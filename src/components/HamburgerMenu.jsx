import React, { useState } from 'react';
import StoryLog from './StoryLog'; // Import StoryLog
import './HamburgerMenu.css'; // We'll create this CSS file

const HamburgerMenu = ({ coinbaseAccount, t, disconnectWallet }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`hamburger-menu-container ${isOpen ? 'open' : ''}`}>
            <button className="hamburger-icon" onClick={toggleMenu}>
                {/* You can use a hamburger icon here, e.g., three lines */}
                ☰ {/* Placeholder for hamburger icon */}
            </button>
            <div className="menu-content">
                {/* Connected Status */}
                {coinbaseAccount && (
                    <div className="wallet-status">
                        <span>{t('connected')} {`${coinbaseAccount.substring(0, 6)}...${coinbaseAccount.substring(coinbaseAccount.length - 4)}`}</span>
                        <button onClick={disconnectWallet}>{t('disconnect')}</button>
                    </div>
                )}
                {/* Story Log */}
                <div className="story-log-in-menu">
                   <StoryLog />
                </div>
            </div>
        </div>
    );
};

export default HamburgerMenu; 