import React from 'react';
import usePlanetStore from '../hooks/usePlanetState';
import './BaseCompletionPopup.css';

const BaseCompletionPopup = () => {
    const showPopup = usePlanetStore(state => state.showBaseCompletionPopup);
    const closePopup = usePlanetStore(state => state.closeBaseCompletionPopup);

    if (!showPopup) {
        return null;
    }

    return (
        <div className="base-completion-popup-overlay">
            <div className="base-completion-popup-card">
                <div className="badge-animation-container">
                    <img src="/assets/images/badge.gif" alt="Completion Badge" className="completion-badge" />
                </div>
                <div className="congrats-message-container">
                    <img src="/assets/agent/Nouns DAO.png" alt="AI Avatar" className="ai-avatar-badge" />
                    <p className="congrats-text">恭喜你完成本次历史模拟！</p>
                </div>
                <button onClick={closePopup} className="pixel-button close-badge-popup-btn">
                    Close
                </button>
            </div>
        </div>
    );
};

export default BaseCompletionPopup; 