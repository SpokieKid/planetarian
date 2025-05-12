import React, { useState, useEffect } from 'react';
import usePlanetStore from '../hooks/usePlanetState';
import './EventPopup.css'; // Use renamed CSS file

const EventPopup = () => {
    const activeEvent = usePlanetStore(state => state.activeEvent);
    const resolveEvent = usePlanetStore(state => state.resolveEvent);
    const minimizeEventPopup = usePlanetStore(state => state.minimizeEventPopup); // Import minimize action
    const [narrativeIndex, setNarrativeIndex] = useState(0);
    const [showConflictAndOptions, setShowConflictAndOptions] = useState(false);

    useEffect(() => {
        setNarrativeIndex(0);
        setShowConflictAndOptions(false);
    }, [activeEvent]);

    if (!activeEvent) {
        return null; // Render nothing if there's no active event data (should be handled by App.jsx, but as safety)
    }

    // Updated to use narrativePages from baseEvents structure
    const narrativeSource = activeEvent.narrativePages || activeEvent.narrative; // Fallback to activeEvent.narrative if narrativePages is not present
    const isMultiPartNarrative = Array.isArray(narrativeSource);
    const currentNarrativePage = isMultiPartNarrative ? narrativeSource[narrativeIndex] : narrativeSource;
    const isLastNarrativePage = isMultiPartNarrative && narrativeIndex === narrativeSource.length - 1;

    // Function to handle option selection
    const handleOptionClick = (option) => {
        console.log(`User chose option ID: "${option?.id || 'Acknowledge'}" for event: ${activeEvent.title}`);
        resolveEvent(option); 
    };

    // --- Narrative Navigation Handlers ---
    const handleNext = () => {
        if (isLastNarrativePage) {
            setShowConflictAndOptions(true);
        } else if (isMultiPartNarrative) {
            setNarrativeIndex(prevIndex => prevIndex + 1);
        }
    };

    const handlePrev = () => {
        if (narrativeIndex > 0) {
            setNarrativeIndex(prevIndex => prevIndex - 1);
            setShowConflictAndOptions(false);
        }
    };
    // --- End Narrative Navigation Handlers ---

    return (
        <div className="story-event-overlay">
            <div className={`story-event-card story-event-${activeEvent.bias || 'neutral'}`}>
                <button onClick={minimizeEventPopup} className="minimize-event-btn">
                    -
                </button>
                <h2>{activeEvent.title}</h2>

                {/* Display Event Image */}
                {activeEvent.image && (
                    <div className="story-event-image-container">
                        <img 
                            src={activeEvent.image} 
                            alt={activeEvent.title} 
                            className="story-event-image"
                        />
                    </div>
                )}
                
                {/* --- Updated Narrative Section --- */}
                {!showConflictAndOptions && (
                    <div className="story-event-narrative-paginated">
                        <p>{currentNarrativePage}</p>
                        <div className="narrative-navigation">
                            {isMultiPartNarrative && narrativeIndex > 0 && (
                                <button className="pixel-button narrative-nav-btn" onClick={handlePrev}>
                                    Up
                                </button>
                            )}
                            {isMultiPartNarrative && (
                                <button className="pixel-button narrative-nav-btn" onClick={handleNext}>
                                    Next
                                </button>
                            )}
                            {!isMultiPartNarrative && (
                                <button className="pixel-button narrative-nav-btn" onClick={() => setShowConflictAndOptions(true)}>
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {/* --- End Updated Narrative Section --- */}

                {/* --- Conditionally Render Conflict and Options --- */}
                {showConflictAndOptions && (
                    <>
                        {/* Display Conflict */}
                        {activeEvent.conflict && (
                            <div className="story-event-conflict">
                                <p>{activeEvent.conflict}</p>
                            </div>
                        )}
                        
                        {/* Display Options */}
                        <div className="story-event-options">
                            <h3>你计划要...</h3>
                            {activeEvent.options && activeEvent.options.map((option, index) => {
                                let emoji = '';
                                if (index === 0) emoji = '🤝';
                                else if (index === 1) emoji = '🛡️';
                                
                                return (
                                    <button key={option.id} onClick={() => handleOptionClick(option)}>
                                        <span className="option-emoji">{option.emoji || emoji}</span>
                                        <span className="option-text-container">
                                            <strong>{option.description_zh || option.mainText}</strong>
                                            {option.subText && <span className="option-subtext">{option.subText}</span>}
                                        </span>
                                    </button>
                                );
                            })}
                            {!activeEvent.options?.length && (
                                <button onClick={() => handleOptionClick(null)}> 
                                    Acknowledge
                                </button>
                            )}
                        </div>
                    </>
                )}
                {/* --- End Conditional Rendering --- */}
            </div>
        </div>
    );
};

export default EventPopup; 