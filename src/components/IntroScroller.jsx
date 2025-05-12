import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './IntroScroller.css';

// Array of translation keys for intro paragraphs
const introParagraphKeys = [
    'intro_0',
    'intro_1',
    'intro_2',
    'intro_3',
    'intro_4',
    'intro_5',
    'intro_6',
    'intro_7',
    'intro_8',
    'intro_9', // TRANSITION_INDEX (index 9)
    'intro_10',
    'intro_11',
    'intro_12', // Spacer
    'intro_13', // Spacer
    'intro_14', // Spacer
    'intro_15',
    'intro_16', // Spacer
    'intro_17',
    'intro_18', // Spacer
    'intro_19'
];

// Constants for timing
const TYPING_SPEED_MS = 80;
const PARAGRAPH_DELAY_MS = 700;
const FINISH_DELAY_MS = 2000;
const TRANSITION_INDEX = 9; // Index of 'intro_9'
const TRANSITION_DELAY_MS = 500;

// Helper to check if a key corresponds to a spacer
const isSpacerKey = (key) => key === 'intro_12' || key === 'intro_13' || key === 'intro_14' || key === 'intro_16' || key === 'intro_18';

const IntroScroller = ({ onFinished, onTypingFinished }) => {
    const { t, i18n } = useTranslation();
    const [currentParaIndex, setCurrentParaIndex] = useState(0);
    // State now holds both languages
    const [displayedLines, setDisplayedLines] = useState([]); // Array of { key: string, zh: string, en: string, type: 'normal' | 'spacer' }
    const [isFinished, setIsFinished] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef(null);
    const typingAudioRef = useRef(null);
    const outputRef = useRef(null);

    const clearTypingInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        if (isTransitioning) return;
        clearTypingInterval();

        if (currentParaIndex >= introParagraphKeys.length) {
            setIsFinished(true);
            onTypingFinished?.();
            setTimeout(() => {
                onFinished?.();
            }, FINISH_DELAY_MS);
            return;
        }

        const currentKey = introParagraphKeys[currentParaIndex];
        let charIndex = 0;
        let lineAdded = false;

        // Handle spacer lines immediately
        if (isSpacerKey(currentKey)) {
            setDisplayedLines(prev => [...prev, { key: currentKey, zh: ' ', en: ' ', type: 'spacer' }]);
            setTimeout(() => setCurrentParaIndex(prev => prev + 1), PARAGRAPH_DELAY_MS / 2);
            return;
        }

        // Get full texts for both languages
        const fullZhText = i18n.getFixedT('zh')(currentKey);
        const fullEnText = i18n.getFixedT('en')(currentKey);
        const primaryLangFullText = i18n.language.startsWith('zh') ? fullZhText : fullEnText;

        intervalRef.current = setInterval(() => {
            charIndex++;
            if (charIndex <= primaryLangFullText.length) {
                if (!lineAdded) {
                    setDisplayedLines(prev => [...prev, { key: currentKey, zh: '', en: '', type: 'normal' }]);
                    lineAdded = true;
                    setTimeout(() => {
                        setDisplayedLines(prev => {
                            const newLines = [...prev];
                            if (newLines.length > 0) {
                                newLines[newLines.length - 1].zh = fullZhText.substring(0, charIndex);
                                newLines[newLines.length - 1].en = fullEnText.substring(0, charIndex);
                            }
                            return newLines;
                        });
                        if (typingAudioRef.current) {
                            typingAudioRef.current.currentTime = 0;
                            typingAudioRef.current.play().catch(error => console.warn("Typing sound failed:", error));
                        }
                    }, 10);
                } else {
                    setDisplayedLines(prev => {
                        const newLines = [...prev];
                        if (newLines.length > 0) {
                            newLines[newLines.length - 1].zh = fullZhText.substring(0, charIndex);
                            newLines[newLines.length - 1].en = fullEnText.substring(0, charIndex);
                        }
                        return newLines;
                    });
                    if (typingAudioRef.current) {
                        typingAudioRef.current.currentTime = 0;
                        typingAudioRef.current.play().catch(error => console.warn("Typing sound failed:", error));
                    }
                }
            } else {
                clearTypingInterval();
                if (currentParaIndex === TRANSITION_INDEX) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setDisplayedLines([]);
                        setCurrentParaIndex(prev => prev + 1);
                        setIsTransitioning(false);
                    }, TRANSITION_DELAY_MS);
                } else {
                    setTimeout(() => setCurrentParaIndex(prev => prev + 1), PARAGRAPH_DELAY_MS);
                }
            }
        }, TYPING_SPEED_MS);

        return () => clearTypingInterval();

    }, [currentParaIndex, onFinished, onTypingFinished, isTransitioning, i18n]); // Added i18n

    useEffect(() => {
        if (outputRef.current && !isTransitioning) {
            const container = outputRef.current;
            // Select the last English paragraph to scroll it into view
            const lastElement = container.querySelector('p.intro-english:last-child');

            if (lastElement) {
                lastElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            } else {
                 container.scrollTop = container.scrollHeight;
            }
        }
    }, [displayedLines, isTransitioning]);

    const handleSkip = () => {
        clearTypingInterval();
        setIsFinished(true);
        const allLines = introParagraphKeys.map(key => {
            if (isSpacerKey(key)) {
                return { key, zh: ' ', en: ' ', type: 'spacer' };
            }
            return {
                key,
                zh: i18n.getFixedT('zh')(key),
                en: i18n.getFixedT('en')(key),
                type: 'normal'
            };
        });
        // Skip the transition logic if skipping
        const linesAfterTransition = allLines.slice(TRANSITION_INDEX + 1);

        // Show lines before transition, then lines after
        // To replicate the visual clear, we might need a different approach,
        // but for skipping, showing all might be acceptable.
        // Or, just show the final state after transition.
        setDisplayedLines(linesAfterTransition); // Simplest skip: show only post-transition lines

        onTypingFinished?.();
        onFinished?.();
    };

    // Determine primary and secondary languages for rendering order
    const PrimaryLang = i18n.language.startsWith('zh') ? 'zh' : 'en';
    const SecondaryLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    const primaryLangClass = `intro-${PrimaryLang}`;
    const secondaryLangClass = `intro-${SecondaryLang}`;

    return (
        <div className={`intro-container console-style ${isFinished ? 'finished' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
            <audio ref={typingAudioRef} src="/assets/audio/typing_sound.mp3" preload="auto"></audio>

            <div className="intro-output" ref={outputRef}>
                 {displayedLines.map((line, index) => {
                     const isLastLine = index === displayedLines.length - 1;
                     const fullTextPrimary = i18n.getFixedT(PrimaryLang)(line.key);
                     const isTyping = !isFinished && !isTransitioning && currentParaIndex < introParagraphKeys.length && isLastLine && line[PrimaryLang]?.length < fullTextPrimary.length;

                     if (line.type === 'spacer') {
                         return <p key={line.key} className="intro-spacer">{line[PrimaryLang]}</p>; // Render spacer once
                     }

                     // Render both languages, primary first
                     return (
                         <React.Fragment key={line.key}>
                             <p className={primaryLangClass}>
                                 {line[PrimaryLang]}
                                 {isTyping && <span className="cursor"></span>}
                             </p>
                             <p className={secondaryLangClass}>
                                 {line[SecondaryLang]}
                             </p>
                         </React.Fragment>
                     );
                 })}
            </div>
            {!isFinished && (
                <button className="skip-intro-btn pixel-button" onClick={handleSkip}>
                     {t('intro_skip')} {/* Translate skip button */}
                </button>
            )}
        </div>
    );
};

export default IntroScroller; 