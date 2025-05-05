import React, { useState, useEffect, useRef } from 'react';
import './IntroScroller.css';

// Intro text broken into paragraphs
const introParagraphs = [
    "他们说，我们是异类",
    "是不安分者，是异想天开，是不可能",
    "是\"想都不用想\"",
    "是 meaningless",
    "是 nonsense",
    "我说，我们是觉醒的有机物",
    "是思辨，是智慧，是灵性，是归宿",
    "是树，是风，是树摇摆的运动方向",
    "是观察者",
    "是记录者",
    "是动荡不安",
    "是宇宙进程",
    "是世界缔造者",
    "是",
    "…",
    "Planetarian",
    " ", // Spacer
    "(电供应上升的音效)",
    "(操作系统启动的声音)",
    "这是实验的第 43 次重启",
    "每一次，我们的星球都已走向毁灭",
    "自然的惩罚，战乱，瘟疫",
    "每次毁灭都以我们的种群为代价",
    "(喀噔、喀噔的切换卡带一样的声音)",
    "(按下按钮声)",
    "不可以 … 我们不能就这样消失在历史的长河中",
    "(电供应上升的音效)",
    "我们要留下一些东西 …",
    "(操作系统启动的声音)",
];

// Constants for timing
const TYPING_SPEED_MS = 50; // Speed of typing characters
const PARAGRAPH_DELAY_MS = 700; // Delay between paragraphs
const FINISH_DELAY_MS = 1000; // Delay after finishing before calling onFinished

const IntroScroller = ({ onFinished }) => {
    const [currentParaIndex, setCurrentParaIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [displayedLines, setDisplayedLines] = useState([]); // Stores fully displayed lines
    const [currentLine, setCurrentLine] = useState(''); // Stores the currently typing line
    const [isFinished, setIsFinished] = useState(false);
    const intervalRef = useRef(null); // Ref to store interval ID

    // Function to clear the interval
    const clearTypingInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        clearTypingInterval(); // Clear any existing interval on re-render

        if (currentParaIndex >= introParagraphs.length) {
            setIsFinished(true);
            setTimeout(() => {
                onFinished?.(); // Use optional chaining
            }, FINISH_DELAY_MS);
            return; // Stop typing
        }

        const currentParagraph = introParagraphs[currentParaIndex];

        // Handle sound effects or empty lines immediately
        if (currentParagraph.startsWith("(") || currentParagraph.trim() === "" || currentParagraph === "Planetarian") {
             setDisplayedLines(prev => [...prev, { text: currentParagraph, type: currentParagraph.startsWith("(") ? 'sound' : (currentParagraph === "Planetarian" ? 'title' : 'normal') }]);
            setTimeout(() => {
                setCurrentParaIndex(prevIndex => prevIndex + 1);
                setCurrentCharIndex(0);
                setCurrentLine('');
            }, PARAGRAPH_DELAY_MS / 2); // Shorter delay for these lines
            return;
        }


        intervalRef.current = setInterval(() => {
            setCurrentCharIndex(prevCharIndex => {
                const nextCharIndex = prevCharIndex + 1;
                if (nextCharIndex > currentParagraph.length) {
                    // Paragraph finished typing
                    clearTypingInterval();
                    setDisplayedLines(prev => [...prev, { text: currentParagraph, type: 'normal' }]); // Add finished line
                    setCurrentLine(''); // Clear current typing line

                    // Move to the next paragraph after a delay
                    setTimeout(() => {
                        setCurrentParaIndex(prevParaIndex => prevParaIndex + 1);
                        setCurrentCharIndex(0); // Reset char index for new paragraph
                    }, PARAGRAPH_DELAY_MS);

                    return 0; // Reset for the next cycle (though interval is cleared)
                } else {
                    // Update the currently typing line
                    setCurrentLine(currentParagraph.substring(0, nextCharIndex));
                    return nextCharIndex;
                }
            });
        }, TYPING_SPEED_MS);

        // Cleanup function to clear interval on component unmount or dependency change
        return () => clearTypingInterval();

    }, [currentParaIndex, onFinished]); // Re-run effect when paragraph index changes or onFinished callback changes

    const handleSkip = () => {
        clearTypingInterval(); // Stop any typing
        setIsFinished(true);
         // Display all lines immediately for skip
        const allLines = introParagraphs.map(text => ({
            text,
            type: text.startsWith("(") ? 'sound' : (text === "Planetarian" ? 'title' : 'normal')
        }));
        setDisplayedLines(allLines);
        setCurrentLine(''); // Ensure no line is actively typing
        onFinished?.(); // Call immediately
    };

    return (
        <div className={`intro-container console-style ${isFinished ? 'finished' : ''}`}>
            <div className="intro-output">
                 {/* Render fully displayed lines */}
                {displayedLines.map((line, index) => {
                     if (line.type === "title") {
                         return <p key={index} className="planetarian-title">{line.text}</p>;
                     } else if (line.type === "sound") {
                         return <p key={index} className="sound-effect"><em>{line.text}</em></p>;
                     } else {
                         return <p key={index}>{line.text}</p>;
                     }
                 })}
                 {/* Render the line currently being typed */}
                 {!isFinished && currentLine && (
                    <p className="current-typing">
                        {currentLine}
                        <span className="cursor"></span> {/* Blinking cursor */}
                    </p>
                )}
            </div>
             {/* Use handleSkip for the button */}
            <button className="skip-intro-btn" onClick={handleSkip} disabled={isFinished}>
                 {isFinished ? 'Finished' : 'Skip Intro'}
            </button>
        </div>
    );
};

export default IntroScroller; 