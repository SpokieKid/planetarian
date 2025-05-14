import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './GuideOverlay.css'; // Create this CSS file

// Import OnchainKit Wallet components
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';

// Key array for guide steps, makes it easier to manage and use with t()
const guideStepKeys = [
    'guide_step_0',
    'guide_step_1',
    'guide_step_2',
    'guide_step_3',
    'guide_step_4',
    'guide_step_5',
    'guide_step_6',
];

// Modify props to use isConnected and disconnect from wagmi, remove authenticated and login
const GuideOverlay = ({ isConnected, disconnect, onClose }) => {
    const { t, i18n } = useTranslation();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [planetNumber, setPlanetNumber] = useState('xxx'); // Default to xxx
    const [isVisible, setIsVisible] = useState(false); // For fade-in effect
    const [languageSelected, setLanguageSelected] = useState(false);

    useEffect(() => {
        setIsVisible(true); // For fade-in effect
    }, []);

    const handleLanguageSelect = (lang) => {
        i18n.changeLanguage(lang);
        setLanguageSelected(true);
    };

    const handleNext = () => {
        if (currentStepIndex < guideStepKeys.length - 1) {
            if (currentStepIndex === 4 && planetNumber === 'xxx') { // Check against default placeholder
                alert(t('guide_alert_enter_planet_number'));
                return;
            }
            setCurrentStepIndex(prevIndex => prevIndex + 1);
        }
    };

    const handleInputChange = (event) => {
        // Allow empty input temporarily, validation on next
        setPlanetNumber(event.target.value || 'xxx'); // Fallback to xxx if empty to avoid breaking translations
    };

    const renderContent = () => {
        // Pass planetNumber to translation, which now defaults to 'xxx' if empty
        let currentText = t(guideStepKeys[currentStepIndex], { planetNumber });

        const parts = currentText.split('**');
        const formattedText = parts.map((part, index) =>
            index % 2 === 1 ? <strong key={index}>{part}</strong> : part
        );

        return (
            <div className="guide-text">
                {formattedText}
                {currentStepIndex === 4 && (
                    <input
                        type="text"
                        value={planetNumber === 'xxx' ? '' : planetNumber} // Show empty if it's still the placeholder
                        onChange={handleInputChange}
                        placeholder={t('guide_input_placeholder')}
                        className="planet-input"
                    />
                )}
            </div>
        );
    };

    if (!languageSelected) {
        return (
            <div className={`guide-overlay ${isVisible ? 'visible' : ''}`}>
                <div className="guide-content-wrapper language-selection">
                    <div className="guide-image-container">
                         <img src="/assets/agent/Nouns DAO.png" alt="Nounii Assistant" className="guide-assistant-image" />
                    </div>
                    <div className="guide-text-box">
                        <h2>{t('请选择语言 Please select language')}</h2>
                        <div className="language-buttons-container">
                            <button className="language-select-btn pixel-button" onClick={() => handleLanguageSelect('en')}>English</button>
                            <button className="language-select-btn pixel-button" onClick={() => handleLanguageSelect('zh')}>中文</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`guide-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="guide-content-wrapper">
                <div className="guide-image-container">
                    <img src="/assets/agent/Nouns DAO.png" alt="Nounii Assistant" className="guide-assistant-image" />
                </div>
                <div className="guide-text-box">
                    {renderContent()}

                    {currentStepIndex < guideStepKeys.length - 1 && (
                        <button className="guide-next-btn pixel-button" onClick={handleNext}>
                            {t('guide_button_next')}
                        </button>
                    )}

                    {currentStepIndex === guideStepKeys.length - 1 && (
                        // Conditionally render ConnectWallet or Close Guide button
                        <div className="guide-final-step-action"> {/* Wrapper div for layout */}
                            {isConnected ? (
                                <button
                                   className="guide-final-step-btn pixel-button"
                                   onClick={onClose} // Close the guide if already connected
                                >
                                    {t('guide_button_continue')} {/* New translation key for continuation */}
                                </button>
                            ) : (
                                // Use OnchainKit ConnectWallet component when not connected
                                // It will trigger the modal/native connection flow
                                <Wallet> {/* Wallet wrapper provides context and basic styling */}
                                    <ConnectWallet label={t('guide_button_connect_wallet')} /> {/* Use translation key for label */}
                                    {/* No need for WalletDropdown here within the Guide */}
                                </Wallet>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideOverlay; 