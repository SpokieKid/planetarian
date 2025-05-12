import React, { useRef, useEffect } from 'react';
import usePlanetStore from '../hooks/usePlanetState';
import './StoryLog.css';

const StoryLog = () => {
    const log = usePlanetStore(state => state.narrativeLog);
    const activeEvent = usePlanetStore(state => state.activeEvent);
    const isEventPopupOpen = usePlanetStore(state => state.isEventPopupOpen);
    const hasPendingEvent = usePlanetStore(state => state.hasPendingEvent);
    const maximizeEventPopup = usePlanetStore(state => state.maximizeEventPopup);
    const logEndRef = useRef(null);

    // Auto-scroll to the bottom when new messages are added
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [log]);

    return (
        <div className="story-log-container">
            <h4>Planet Log</h4>
            {/* Button to restore minimized event */} 
            {activeEvent && !isEventPopupOpen && !hasPendingEvent && (
                <div className="restore-event-container">
                    <button onClick={maximizeEventPopup} className="restore-event-btn">
                        Restore Event: {activeEvent.title}
                    </button>
                </div>
            )}
            <div className="story-log-entries">
                {log.map((entry, index) => (
                    <p key={index} className="log-entry">{entry}</p>
                ))}
                {/* Empty div to scroll to */}
                <div ref={logEndRef} /> 
            </div>
        </div>
    );
};

export default StoryLog; 