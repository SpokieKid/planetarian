import React from 'react';
import './BaseEventTriggerDialog.css';

const BaseEventTriggerDialog = ({ onYes, onNo, isVisible }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="base-event-dialog-overlay">
            <div className="base-event-dialog-card pixel-corners">
                <p className="base-event-dialog-text">
                    即将进入历史编年史模拟器……请选择是否开始
                </p>
                <div className="base-event-dialog-options">
                    <button onClick={onYes} className="pixel-button yes-button">
                        Yes
                    </button>
                    <button onClick={onNo} className="pixel-button no-button">
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BaseEventTriggerDialog; 