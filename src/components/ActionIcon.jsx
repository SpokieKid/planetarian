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
import React, { useState } from 'react';
import usePlanetStore from '../hooks/usePlanetState'; // Import store
import './ActionIcon.css';
import ChatDialog from './ChatDialog';

const ActionIcon = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const hasPendingEvent = usePlanetStore(state => state.hasPendingEvent); // Get pending state
    const maximizeEventPopup = usePlanetStore(state => state.maximizeEventPopup); // Get open action

    // Log the state received from the store
    console.log("[ActionIcon Render] hasPendingEvent:", hasPendingEvent);

    const handleIconClick = () => {
        if (hasPendingEvent) {
            console.log("[ActionIcon] handleIconClick: hasPendingEvent is true, calling maximizeEventPopup...");
            maximizeEventPopup(); // Prioritize opening event popup
        } else {
            console.log("[ActionIcon] handleIconClick: hasPendingEvent is false, toggling chat...");
            setIsChatOpen(!isChatOpen); // Fallback to opening chat
        }
    };

    // Placeholder: You can replace the button content with an <img> tag later
    // Make sure to import the image or use a path from the public folder.
    // Example: <img src="/assets/icons/your-icon.png" alt="Action" /> 
    return (
        <div style={{ position: 'relative' }}>
            <button className="action-icon-button" onClick={handleIconClick}>
                {/* Show notification bubble if event is pending */}
                {hasPendingEvent && <span className="event-notification-bubble">💬</span>}
                {/* Replace emoji with image */}
                <img src="/assets/agent/Nouns DAO.png" alt="Action Icon" />
            </button>
            {isChatOpen && <ChatDialog onClose={() => setIsChatOpen(false)} />}
        </div>
    );
};

export default ActionIcon; 