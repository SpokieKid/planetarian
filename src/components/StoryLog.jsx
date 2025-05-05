import React, { useRef, useEffect } from 'react';
import usePlanetStore from '../hooks/usePlanetState';
import './StoryLog.css';

const StoryLog = () => {
    const log = usePlanetStore(state => state.narrativeLog);
    const logEndRef = useRef(null);

    // Auto-scroll to the bottom when new messages are added
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [log]);

    return (
        <div className="story-log-container">
            <h4>Planet Log</h4>
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