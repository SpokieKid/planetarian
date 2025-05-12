import React, { useState, useEffect } from 'react';
import './GuideOverlay.css'; // Create this CSS file

const guideSteps = [
    "您好，No. xxx 号星球史学家，欢迎来到星球模拟器。",
    "我是 Nounii，你的智能星球助理。这是一个平行宇宙模拟器，是一个经过审查的安全的环境。",
    "你可以在这里进行任何实验，**完全不用担心**在模拟器中的行为会对你或任何世界带来影响，请自由发挥创造力，给智慧生物创造一个与众不同的未来。",
    "现在，请根据画面指示，进行模拟器初始化流程。",
    "请输入你这次创造的星球编号：", // Step index 4 (input)
    "由于目前你的权限不足，模拟器仅开放了 xxx 号星球，与其他星球的通讯处于截断状态。",
    "请连接钱包并登入你的星球", // Step index 6 (connect wallet instruction)
];

const GuideOverlay = ({ login, authenticated, onClose }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [planetNumber, setPlanetNumber] = useState('');
    const [isVisible, setIsVisible] = useState(false); // For fade-in effect

    useEffect(() => {
        // Trigger fade-in effect when component mounts
        setIsVisible(true);
    }, []);

    const handleNext = () => {
        if (currentStepIndex < guideSteps.length - 1) {
             // Add logic here if input is required before proceeding from step 4
             if (currentStepIndex === 4 && !planetNumber.trim()) {
                 alert("请输入星球编号！"); // Simple validation
                 return;
             }
            setCurrentStepIndex(prevIndex => prevIndex + 1);
        } 
        // No else needed - last step button now handles login directly
    };

    const handleInputChange = (event) => {
        setPlanetNumber(event.target.value);
    };

    const renderContent = () => {
        let currentText = guideSteps[currentStepIndex];
        
        // If it's the step mentioning the planet number, replace 'xxx'
        if (currentStepIndex === 5) {
            // Use the entered planetNumber, or default back to 'xxx' if empty for some reason
            const finalPlanetNumber = planetNumber.trim() || 'xxx'; 
            currentText = currentText.replace('xxx', finalPlanetNumber);
        }

        // Simple bold highlighting for the specified text
        const parts = currentText.split('**');
        const formattedText = parts.map((part, index) => 
            index % 2 === 1 ? <strong key={index}>{part}</strong> : part
        );

        return (
            <div className="guide-text">
                {formattedText}
                {currentStepIndex === 4 && ( // Show input field at step 4
                    <input 
                        type="text" 
                        value={planetNumber}
                        onChange={handleInputChange}
                        placeholder="输入星球编号"
                        className="planet-input"
                    />
                )}
            </div>
        );
    };

    return (
        <div className={`guide-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="guide-content-wrapper">
                <div className="guide-image-container">
                    <img src="/assets/agent/Nouns DAO.png" alt="Nounii Assistant" className="guide-assistant-image" />
                </div>
                <div className="guide-text-box">
                    {renderContent()}
                    
                    {/* Show "Next" button for intermediate steps */} 
                    {currentStepIndex < guideSteps.length - 1 && (
                        <button className="guide-next-btn pixel-button" onClick={handleNext}>
                            Next
                        </button>
                    )}

                    {/* Show button on the last step, behavior depends on auth state */} 
                    {currentStepIndex === guideSteps.length - 1 && (
                        <button 
                           className="guide-final-step-btn pixel-button" 
                           onClick={() => {
                                console.log('[GuideOverlay] Final button clicked. Authenticated:', authenticated);
                                if (authenticated) {
                                    console.log('[GuideOverlay] Calling onClose...');
                                    onClose();
                                } else {
                                    console.log('[GuideOverlay] Calling login (connectWallet)... ');
                                    login(); // This should be connectWallet from App.jsx
                                }
                           }}
                        >
                            Connect Wallet 
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideOverlay; 