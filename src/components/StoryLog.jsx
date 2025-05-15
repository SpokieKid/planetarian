import React, { useRef, useEffect } from 'react';
import usePlanetStore from '../hooks/usePlanetState';
import './StoryLog.css';
import { useTranslation } from 'react-i18next';
import { events } from '../data/events'; // Import events to get titles
import { baseEvents } from '../data/baseEvents'; // Import baseEvents to get titles and option descriptions

const StoryLog = () => {
    const log = usePlanetStore(state => state.narrativeLog);
    const activeEvent = usePlanetStore(state => state.activeEvent);
    const isEventPopupOpen = usePlanetStore(state => state.isEventPopupOpen);
    const hasPendingEvent = usePlanetStore(state => state.hasPendingEvent);
    const maximizeEventPopup = usePlanetStore(state => state.maximizeEventPopup);
    const logEndRef = useRef(null);

    const { t } = useTranslation();

    // Auto-scroll to the bottom when new messages are added
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [log]);

    // Helper function to render a single log entry
    const renderLogEntry = (entry, index) => {
        switch (entry.type) {
            case 'event_result': {
                const event = events[entry.eventKey] || baseEvents[entry.eventKey]; // Get event data
                const eventTitle = event ? t(event.title) : entry.eventKey; // Translate event title

                let choiceText = entry.chosenOptionId;
                if (event && entry.chosenOptionId) {
                    // Find the chosen option to get its description
                    const chosenOption = event.options.find(opt => opt.id === entry.chosenOptionId);
                    // Use description_zh if available, otherwise fallback to id
                    choiceText = chosenOption ? t(chosenOption.description_zh || chosenOption.id) : entry.chosenOptionId;
                }

                const resultText = entry.outcomeResultKey ? t(entry.outcomeResultKey) : 'Unknown Outcome'; // Translate result narrative
                const hashtags = entry.hashtags ? ` ${entry.hashtags}` : '';
                const karmaChange = entry.karmaChange !== 0 ? ` (Karma ${entry.karmaChange > 0 ? '+' : ''}${entry.karmaChange})` : '';

                return (
                    <p key={index} className="log-entry">
                        [{eventTitle}] 选择了: "{choiceText}". 结果: "{resultText}"{hashtags}{karmaChange}
                    </p>
                );
            }
            case 'event_triggered': {
                const event = events[entry.eventKey] || baseEvents[entry.eventKey]; // Get event data
                const eventTitle = event ? t(event.title) : entry.eventKey; // Translate event title
                return (
                     <p key={index} className="log-entry">
                         事件触发: {eventTitle}
                     </p>
                 );
            }
            case 'reset':
            case 'initialization':
            case 'badge_earned': {
                 // For simple text logs that might already be translated or don't need translation via key
                 // If `entry.textKey` is used, translate it, otherwise use `entry.text` directly
                 const textToRender = entry.textKey ? t(entry.textKey) : entry.text;
                 return (
                      <p key={index} className="log-entry">
                          {textToRender}
                      </p>
                 );
            }
            case 'base_event_dialog_choice': {
                 const textToRender = entry.textKey ? t(entry.textKey) : entry.choice; // Translate the key or use the choice itself
                 return (
                      <p key={index} className="log-entry">
                          [基础模拟] 用户选择了: {textToRender}
                      </p>
                 );
            }
            // Add more cases for other log types if needed
            default: {
                // Fallback for old log entries or unrecognized types
                // Attempt to translate if it looks like a key, otherwise display as is
                const textToDisplay = typeof entry === 'string' ? t(entry) : JSON.stringify(entry);
                return (
                    <p key={index} className="log-entry old-log-format">
                        {textToDisplay}
                    </p>
                );
            }
        }
    };

    return (
        <div className="story-log-container">
            <h4>{t('planetLogTitle')}</h4>
            {/* Button to restore minimized event */} 
            {activeEvent && !isEventPopupOpen && !hasPendingEvent && (
                <div className="restore-event-container">
                    <button onClick={maximizeEventPopup} className="restore-event-btn">
                        {t('restoreEventButton')}: {activeEvent.title}
                    </button>
                </div>
            )}
            <div className="story-log-entries">
                {log.map((entry, index) => renderLogEntry(entry, index))}
                {/* Empty div to scroll to */}
                <div ref={logEndRef} /> 
            </div>
        </div>
    );
};

export default StoryLog; 