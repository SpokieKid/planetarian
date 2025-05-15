import React from 'react';
import './BaseEventTriggerDialog.css';

const BaseEventTriggerDialog = ({ onYes, isVisible }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="base-event-dialog-overlay">
            <div className="base-event-dialog-card pixel-corners">
                <p className="base-event-dialog-text">
                    即将进入历史编年史模拟器……
                </p>
                <div className="base-event-dialog-options">
                    <button onClick={onYes} className="pixel-button yes-button">
                        Start
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BaseEventTriggerDialog; 