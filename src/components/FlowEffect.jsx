import React, { useEffect, useRef } from 'react';
import './FlowEffect.css';

const FlowEffect = ({ isActive = false, audioSrc = "/assets/sounds/electronic-pulse.mp3" }) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (isActive && audioRef.current && audioSrc) {
            audioRef.current.play().catch(error => console.error("Error playing audio:", error));
        } else if (!isActive && audioRef.current) {
            audioRef.current.pause();
            // audioRef.current.currentTime = 0; // Optional: Reset audio to start
        }
    }, [isActive, audioSrc]);

    if (!isActive) {
        return null;
    }

    return (
        <div className="flow-effect-container">
            {/* Multiple lines to create the flow effect */}
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flow-line-wrapper">
                    <div 
                        className="flow-line" 
                        style={{ 
                            '--i': i,
                            '--total-lines': 10,
                            animationDelay: `${Math.random() * 2}s`, 
                            animationDuration: `${2 + Math.random() * 2}s` 
                        }}
                    />
                </div>
            ))}
            {audioSrc && <audio ref={audioRef} src={audioSrc} loop />}
            <div className="flow-overlay-text">Flow Active</div> {/* Optional: Text indicator */}
        </div>
    );
};

export default FlowEffect; 