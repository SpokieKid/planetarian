import React from 'react';
import usePlanetStore from '../hooks/usePlanetState';
import './EventPopup.css'; // Use renamed CSS file

const EventPopup = () => {
    const activeEvent = usePlanetStore(state => state.activeEvent);
    const resolveEvent = usePlanetStore(state => state.resolveEvent);

    if (!activeEvent) {
        return null; // Don't render if no event is active
    }

    // Function to handle option selection
    const handleOptionClick = (option) => {
        console.log(`User chose option ID: "${option.id}" for event: ${activeEvent.title}`);
        resolveEvent(option); 
    };

    return (
        <div className="story-event-overlay">
            <div className={`story-event-card story-event-${activeEvent.bias || 'neutral'}`}>
                <h2>{activeEvent.title}</h2>
                
                {/* Display Narrative */}
                <div className="story-event-narrative">
                    <h3>发生了这些事...</h3>
                    <p>{activeEvent.narrative}</p>
                </div>

                {/* Display Conflict */}
                <div className="story-event-conflict">
                    <h3>但是你也要谨慎...</h3>
                    <p>{activeEvent.conflict}</p>
                </div>
                
                {/* Display Options */}
                <div className="story-event-options">
                    <h3>你计划要...</h3>
                    {activeEvent.options && activeEvent.options.map((option) => (
                        <button key={option.id} onClick={() => handleOptionClick(option)}>
                            {option.text}
                        </button>
                    ))}
                    {/* Fallback if no options (shouldn't happen with proper structure) */}
                    {!activeEvent.options?.length && (
                         <button onClick={() => handleOptionClick(null)}> 
                            Acknowledge
                         </button>
                     )}
                </div>
            </div>
        </div>
    );
};

export default EventPopup; 