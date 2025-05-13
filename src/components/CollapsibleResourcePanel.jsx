import React, { useState } from 'react';
import ResourcePanel from './ResourcePanel'; // Import the original ResourcePanel
import './CollapsibleResourcePanel.css'; // We'll create this CSS file next

const CollapsibleResourcePanel = () => {
    const [isOpen, setIsOpen] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`collapsible-resource-panel-container ${isOpen ? 'open' : ''}`}>
            <button className="resource-panel-toggle-button" onClick={togglePanel}>
                <img src="/assets/icons/resource-icon.png" alt="Resource Panel Icon" />
                <span className="resource-panel-arrow">{isOpen ? '⬅️' : '➡️'}</span>
            </button>
            <div className="resource-panel-content">
                <ResourcePanel />
            </div>
        </div>
    );
};

export default CollapsibleResourcePanel; 