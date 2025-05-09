import React, { useState, useEffect, useRef } from 'react';
import './BaseIntroScroller.css'; // We'll create this CSS file

const BASE_INTRO_TEXT = [
    "欢迎，星球史学家！",
    "你即将进入一段特殊的时间旅程，回到1号星球的过去，去研究一段塑造了未来\"星球化\"文明的关键历史。",
    "这段历史围绕着一个名为Coinbase的组织和它构建的BaseNetwork展开。",
    "在这次历史模拟中，时间的流逝方式与《星球史学家》主线游戏略有不同。我们不是使用抽象的\"回合\"来代表漫长的时代，而是用每一个\"回合\"代表地球上的\"一年\"。",
    "这就像你在查阅一份详细的历史编年史，每个事件都有它发生的具体年份标记。通过回合的推进，你将亲身感受到历史是如何一步步展开的。",
    "作为星球史学家，理解这些阶段非常重要。通过研究Coinbase和Base如何在这种历史背景下做出选择，以及这些选择如何影响了文明的走向，你就能更深入地理解：",
    "为什么链上经济体是\"星球化\"的关键？\n从全球化到星球化转变中的主要挑战是什么？\n在构建未来的链上文明时，我们可以从1号星球的历史中吸取哪些经验和教训？",
    "祝你在这次历史模拟中，发现宝贵的史学洞察！"
];

const BaseIntroScroller = ({ onFinished }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        // Autoplay background music
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Error playing BaseIntro music:", e));
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const handleNext = () => {
        if (currentIndex < BASE_INTRO_TEXT.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const currentParagraph = BASE_INTRO_TEXT[currentIndex];
    // For bolding, replace **text** with <strong>text</strong>
    const formattedParagraph = currentParagraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>);


    return (
        <div className="base-intro-scroller-container">
            <audio ref={audioRef} src="/assets/audio/bluesky.mp3" loop preload="auto" />
            <div className="base-intro-content">
                <div className="ai-assistant-avatar-container">
                    {/* TODO: Replace with actual AI assistant avatar image */}
                    <img src="/assets/agent/Nouns DAO.png" alt="AI Assistant" className="ai-assistant-avatar" /> 
                </div>
                <div className="base-intro-paragraph">
                    {formattedParagraph}
                </div>
                <div className="base-intro-navigation">
                    {/* Show UP button only if not on the first page AND not on the last page where FINISH is shown */}
                    {currentIndex > 0 && currentIndex < BASE_INTRO_TEXT.length - 1 && (
                        <button onClick={handlePrev} className="pixel-button prev-button">UP</button>
                    )}
                    {currentIndex < BASE_INTRO_TEXT.length - 1 ? (
                        <button onClick={handleNext} className="pixel-button next-button">NEXT</button>
                    ) : (
                        <button onClick={onFinished} className="pixel-button finish-button">FINISH</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BaseIntroScroller; 