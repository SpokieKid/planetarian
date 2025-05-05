import React, { useState, useEffect, useRef } from 'react';
import './IntroScroller.css';

// Intro text broken into paragraphs
const introParagraphs = [
    "他们说，我们是异类",
    "是不安分者，是异想天开，没有意义",
    "我说，我们是觉醒的有机物",
    "是思辨，是智慧，是灵性，是归宿",
    "是树，是风，是树摇摆的运动方向",
    "是观察者，记录者，动荡不安，宇宙进程",
    "是世界缔造者",
    "是",
    "…",
    "星球史学家",
    "自然的惩罚，战乱，瘟疫",
    "每一次，我们的星球都走向毁灭",
    " ", // Spacer
    " ", // Spacer
    " ", // Spacer
    "我们不能就这样消失在历史的长河中",
    " ", // Spacer
    "我们要留下一些东西 …",
    " ", // Spacer
    "任何东西 … "
];

// Constants for timing
const TYPING_SPEED_MS = 80; // Faster typing speed (e.g., 80ms)
const PARAGRAPH_DELAY_MS = 700; // Delay between paragraphs
const FINISH_DELAY_MS = 2000; // Extend delay after finishing to 2 seconds
const TRANSITION_INDEX = 9; // CORRECT Index of "星球史学家"
const TRANSITION_DELAY_MS = 500; // How long the "clear screen" takes

const IntroScroller = ({ onFinished, onTypingFinished }) => {
    const [currentParaIndex, setCurrentParaIndex] = useState(0);
    const [displayedLines, setDisplayedLines] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false); // State for transition effect
    const intervalRef = useRef(null);
    const typingAudioRef = useRef(null);
    const outputRef = useRef(null);

    // Function to clear the interval
    const clearTypingInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Effect for typing logic (Refactored)
    useEffect(() => {
        if (isTransitioning) return;
        clearTypingInterval();

        if (currentParaIndex >= introParagraphs.length) {
            setIsFinished(true);
            onTypingFinished?.(); // Call immediately when typing finishes
            // Delay only the final onFinished call
            setTimeout(() => {
                onFinished?.(); 
            }, FINISH_DELAY_MS);
            return;
        }

        const currentParagraph = introParagraphs[currentParaIndex];
        let charIndex = 0; 
        let lineAdded = false; // Flag to track if the current line placeholder has been added

        // Handle non-typable lines immediately
        if (currentParagraph.startsWith("(") || currentParagraph.trim() === "" || currentParagraph === "Planetarian") {
            const lineType = currentParagraph.startsWith("(") ? 'sound' : (currentParagraph === "Planetarian" ? 'title' : 'normal');
            setDisplayedLines(prev => [...prev, { text: currentParagraph, type: lineType }]);
            setTimeout(() => setCurrentParaIndex(prev => prev + 1), PARAGRAPH_DELAY_MS / 2);
            return;
        }

        intervalRef.current = setInterval(() => {
            charIndex++;
            if (charIndex <= currentParagraph.length) {
                // Add the line placeholder ONCE when the first character is typed
                if (!lineAdded) {
                    setDisplayedLines(prev => [...prev, { text: '', type: 'normal' }]);
                    lineAdded = true;
                    // Use a minimal timeout to allow state update before proceeding
                    // This might still be racy, alternative needed if issues persist.
                    setTimeout(() => { 
                        // Update the (now existing) last line
                        setDisplayedLines(prev => {
                            const newLines = [...prev];
                            if (newLines.length > 0) {
                                newLines[newLines.length - 1].text = currentParagraph.substring(0, charIndex);
                            }
                            return newLines;
                        });
                         // Play typing sound
                         if (typingAudioRef.current) {
                            typingAudioRef.current.currentTime = 0;
                            typingAudioRef.current.play().catch(error => console.warn("Typing sound failed:", error));
                        }
                    }, 10); // Small delay
                } else {
                     // Update the last line in displayedLines (subsequent characters)
                     setDisplayedLines(prev => {
                        const newLines = [...prev];
                        if (newLines.length > 0) {
                            newLines[newLines.length - 1].text = currentParagraph.substring(0, charIndex);
                        }
                        return newLines;
                    });
                     // Play typing sound
                     if (typingAudioRef.current) {
                        typingAudioRef.current.currentTime = 0;
                        typingAudioRef.current.play().catch(error => console.warn("Typing sound failed:", error));
                    }
                }

            } else {
                // Paragraph finished typing
                clearTypingInterval();
                console.log(`[Typing Effect] Paragraph finished. Index: ${currentParaIndex}, Transition Index: ${TRANSITION_INDEX}`);
                if (currentParaIndex === TRANSITION_INDEX) {
                    console.log('[Typing Effect] Entering transition logic...');
                    setIsTransitioning(true);
                    setTimeout(() => {
                        console.log('[Typing Effect] Transition timeout: Clearing lines and moving index.');
                        setDisplayedLines([]);
                        setCurrentParaIndex(prev => prev + 1);
                        setIsTransitioning(false);
                    }, TRANSITION_DELAY_MS);
                } else {
                     console.log('[Typing Effect] Normal paragraph end. Scheduling next paragraph.');
                    setTimeout(() => setCurrentParaIndex(prev => prev + 1), PARAGRAPH_DELAY_MS);
                }
            }
        }, TYPING_SPEED_MS);

        // Cleanup
        return () => clearTypingInterval();

    }, [currentParaIndex, onFinished, onTypingFinished, isTransitioning]);

    // Effect for auto-scrolling
    useEffect(() => {
        if (outputRef.current && !isTransitioning) {
            const container = outputRef.current;
            const lastElement = container.querySelector('p:last-child');

            if (lastElement) {
                // Use scrollIntoView to bring the last element into view,
                // attempting to center it vertically.
                lastElement.scrollIntoView({
                    behavior: 'smooth', // Optional: smooth scrolling
                    block: 'center'    // Attempt to vertically center
                });
                 // console.log('Scrolling last element into view (center)');
            } else {
                 // Fallback remains the same
                 container.scrollTop = container.scrollHeight;
            }
        }
    }, [displayedLines, isTransitioning]);

    const handleSkip = () => {
        clearTypingInterval();
        setIsFinished(true);
        // Display all lines immediately
        const allLines = introParagraphs.map(text => ({
            text,
            type: text.startsWith("(") ? 'sound' : (text === "Planetarian" ? 'title' : 'normal')
        }));
        setDisplayedLines(allLines);
        onTypingFinished?.();
        onFinished?.();
    };

    return (
        <div className={`intro-container console-style ${isFinished ? 'finished' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
            <audio ref={typingAudioRef} src="/assets/audio/typing_sound.mp3" preload="auto"></audio>

            <div className="intro-output" ref={outputRef}>
                 {/* Render displayed lines */} 
                 {displayedLines.map((line, index) => {
                     const isLastLine = index === displayedLines.length - 1;
                     const isTyping = !isFinished && !isTransitioning && currentParaIndex < introParagraphs.length && isLastLine && line.text.length < introParagraphs[currentParaIndex].length;

                     // Log isTyping for the last line
                     if (isLastLine) {
                       // console.log(`[Render] isTyping for last line (index ${index}): ${isTyping}`);
                     }

                     if (line.type === "title") {
                         return <p key={index} className="planetarian-title">{line.text}</p>;
                     } else if (line.type === "sound") {
                         return <p key={index} className="sound-effect"><em>{line.text}</em></p>;
                     } else {
                         return (
                            <p key={index}>
                                {line.text}
                                {isTyping && <span className="cursor"></span>} {/* Show cursor only on the line being actively typed */}
                            </p>
                         );
                     }
                 })}
            </div>
            {/* Conditionally render the skip button */} 
            {!isFinished && (
                <button className="skip-intro-btn pixel-button" onClick={handleSkip}>
                     Skip Intro
                </button>
            )}
        </div>
    );
};

export default IntroScroller; 