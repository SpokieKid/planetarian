import React from 'react';
import './DialogBox.css';

const DialogBox = ({ isOpen, onClose, title = "Dialog", children }) => {
    if (!isOpen) {
        return null; // Don't render if not open
    }

    return (
        <div className="dialog-overlay" onClick={onClose}> {/* Close on overlay click */}
            <div className="dialog-box" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
                <div className="dialog-header">
                    <h2>{title}</h2>
                    <button className="dialog-close-btn" onClick={onClose}>
                        &times; {/* Close symbol */}
                    </button>
                </div>
                <div className="dialog-content">
                    {children} {/* Content passed from parent */}
                </div>
            </div>
        </div>
    );
};

export default DialogBox; 