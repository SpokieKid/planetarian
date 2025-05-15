import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import './BaseIntroScroller.css'; // We'll create this CSS file

const BASE_INTRO_TEXT = [
    "intro.welcome",
    "intro.journey",
    "intro.historyContext",
    "intro.timeDifference",
    "intro.yearlyChronicle",
    "intro.importance",
    "intro.questions",
    "intro.goodLuck"
];

const BaseIntroScroller = ({ onFinished }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef(null);
    const { t } = useTranslation(); // Use the translation hook

    useEffect(() => {
        // Autoplay background music
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Error playing BaseIntro music:", e));
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const handleNext = () => {
        if (currentIndex < BASE_INTRO_TEXT.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Get the translation key for the current paragraph and translate it
    const currentParagraphKey = BASE_INTRO_TEXT[currentIndex];
    const currentParagraph = t(currentParagraphKey); // Translate the key

    // For bolding, replace **text** with <strong>text</strong>
    const formattedParagraph = currentParagraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>);


    return (
        <div className="base-intro-scroller-container">
            <audio ref={audioRef} src="/assets/audio/bluesky.mp3" loop preload="auto" />
            <div className="base-intro-content">
                <div className="ai-assistant-avatar-container">
                    {/* TODO: Replace with actual AI assistant avatar image */}
                    <img src="/assets/agent/Nouns DAO.png" alt="AI Assistant" className="ai-assistant-avatar" /> 
                </div>
                <div className="base-intro-paragraph">
                    {formattedParagraph}
                </div>
                <div className="base-intro-navigation">
                    {/* Show UP button only if not on the first page AND not on the last page where FINISH is shown */}
                    {currentIndex > 0 && currentIndex < BASE_INTRO_TEXT.length - 1 && (
                        <button onClick={handlePrev} className="pixel-button prev-button">UP</button>
                    )}
                    {currentIndex < BASE_INTRO_TEXT.length - 1 ? (
                        <button onClick={handleNext} className="pixel-button next-button">NEXT</button>
                    ) : (
                        <button onClick={onFinished} className="pixel-button finish-button">START JOURNEY</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BaseIntroScroller; 