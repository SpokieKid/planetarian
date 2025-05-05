import React, { useState } from 'react';
import './ActionIcon.css';
import ChatDialog from './ChatDialog';

const ActionIcon = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    // Placeholder: You can replace the button content with an <img> tag later
    // Make sure to import the image or use a path from the public folder.
    // Example: <img src="/assets/icons/your-icon.png" alt="Action" /> 
    return (
        <div style={{ position: 'relative' }}>
            <button className="action-icon-button" onClick={toggleChat}>
                 {/* Replace emoji with image */}
                 <img src="/noun-2.png" alt="Action Icon" />
            </button>
            {isChatOpen && <ChatDialog onClose={toggleChat} />}
        </div>
    );
};

export default ActionIcon; 