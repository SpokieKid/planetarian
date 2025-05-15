import React, { useState, useEffect } from 'react';
import usePlanetStore from '../hooks/usePlanetState';
import './EventPopup.css'; // Use renamed CSS file
import { useTranslation } from 'react-i18next'; // Import useTranslation

const EventPopup = () => {
    const activeEvent = usePlanetStore(state => state.activeEvent);
    const resolveEvent = usePlanetStore(state => state.resolveEvent);
    const minimizeEventPopup = usePlanetStore(state => state.minimizeEventPopup); // Import minimize action
    const isEventPopupOpen = usePlanetStore(state => state.isEventPopupOpen);
    const isEventPopupMinimized = usePlanetStore(state => state.isEventPopupMinimized); // Import isEventPopupMinimized
    const [narrativeIndex, setNarrativeIndex] = useState(0);
    const [showConflictAndOptions, setShowConflictAndOptions] = useState(false);

    const { t } = useTranslation(); // Get t function, i18n object removed as it's not used

    useEffect(() => {
        setNarrativeIndex(0);
        setShowConflictAndOptions(false);
    }, [activeEvent]);

    if (!activeEvent || !isEventPopupOpen || isEventPopupMinimized) {
        console.log("[EventPopup] Not rendering: activeEvent", !!activeEvent, "isEventPopupOpen", isEventPopupOpen, "isEventPopupMinimized", isEventPopupMinimized);
        return null;
    }

    // Updated to use narrativePages from baseEvents structure or narrative key from main events
    // narrativeSource will be the i18n key for main events, or an array of i18n keys for base events narrativePages
    const narrativeSource = activeEvent.narrativePages || activeEvent.narrative; 
    const isMultiPartNarrative = Array.isArray(narrativeSource);
    // Translate current narrative page/key
    const currentNarrativeKeyOrText = isMultiPartNarrative ? narrativeSource[narrativeIndex] : narrativeSource;
    const translatedNarrative = t(currentNarrativeKeyOrText);

    const isLastNarrativePage = isMultiPartNarrative && narrativeIndex === narrativeSource.length - 1;

    // Function to handle option selection
    const handleOptionClick = (option) => {
        console.log(`User chose option ID: "${option?.id || 'Acknowledge'}" for event: ${activeEvent.title}`);
        resolveEvent(option); 
    };

    // --- Narrative Navigation Handlers ---
    const handleNext = () => {
        if (isMultiPartNarrative && !isLastNarrativePage) {
            setNarrativeIndex(prevIndex => prevIndex + 1);
        } else if (!isMultiPartNarrative || isLastNarrativePage) { // Move to conflict/options if single page or last page
             setShowConflictAndOptions(true);
        }
    };

    const handlePrev = () => {
        if (narrativeIndex > 0) {
            setNarrativeIndex(prevIndex => prevIndex - 1);
            setShowConflictAndOptions(false);
        }
    };
    // --- End Narrative Navigation Handlers ---

    // Function to get translated option description
    const getTranslatedOptionDescription = (option) => {
        // Get the translation key from the option object
        const translationKey = option.description_key;

        if (translationKey) {
            const translated = t(translationKey);
            // If translation is different from the key, it means translation was successful
            if (translated !== translationKey) {
                return translated;
            }
            // If translation is the same as the key, it means key was not found in translation files.
            // Log a warning and return the key itself as a fallback, or a generic message.
            console.warn(`Translation not found for key: ${translationKey}. Displaying key as fallback.`);
            // Optionally, return a more user-friendly message if the key itself is not suitable for display
            // return t('noOptionDescriptionAvailable', 'No description available'); 
            return translationKey; // Or return the key itself if that's preferred when a translation is missing
        }

        // Fallback for options that might not use description_key (e.g., older event structures or dynamic content)
        // This part can be adjusted based on how other event types (if any) store their descriptions.
        if (option.mainText) { // Check for a generic mainText field
            const mainTextTranslated = t(option.mainText);
            if (mainTextTranslated !== option.mainText) {
                return mainTextTranslated;
            }
            return option.mainText; // Fallback to raw mainText
        }
        
        console.warn("No suitable key (description_key or mainText) found for option description translation:", option);
        return t('noOptionDescriptionAvailable', 'No description available'); // Default fallback
    };


    return (
        <div className="story-event-overlay">
            <div className={`story-event-card story-event-${activeEvent.bias || 'neutral'}`}>
                <button onClick={minimizeEventPopup} className="minimize-event-btn">
                    -
                </button>
                {/* Translate Event Title */}
                <h2>{t(activeEvent.title)}</h2>

                {/* Display Event Image */}
                {activeEvent.image && ( // Assuming activeEvent.image is the direct path, not an i18n key
                    <div className="story-event-image-container">
                        <img 
                            src={activeEvent.image} 
                            alt={t(activeEvent.title)} // Use translated title for alt text
                            className="story-event-image"
                        />
                    </div>
                )}
                
                {/* --- Updated Narrative Section --- */}
                {!showConflictAndOptions && (
                    <div className="story-event-narrative-paginated">
                        {/* Display Translated Narrative */}
                        <p>{translatedNarrative}</p>
                        <div className="narrative-navigation">
                            {isMultiPartNarrative && narrativeIndex > 0 && (
                                <button className="pixel-button narrative-nav-btn" onClick={handlePrev}>
                                    {t('event_popup_nav_prev', 'Previous')}
                                </button>
                            )}
                            {/* Only show 'Next' if not on the last page of multi-part or if it's a single page */}
                            {(!isMultiPartNarrative || !isLastNarrativePage) && (
                                <button className="pixel-button narrative-nav-btn" onClick={handleNext}>
                                    {t('event_popup_nav_next', 'Next')}
                                </button>
                            )}
                             {/* Show 'Continue' button only on the last page of multi-part narrative */}
                            {isMultiPartNarrative && isLastNarrativePage && (
                                 <button className="pixel-button narrative-nav-btn" onClick={() => setShowConflictAndOptions(true)}>
                                    {t('event_popup_nav_continue', 'Continue')}
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {/* --- End Updated Narrative Section --- */}

                {/* --- Conditionally Render Conflict and Options --- */}
                {showConflictAndOptions && (
                    <>
                        {/* Display Translated Conflict */}
                        {activeEvent.conflict && (
                            <div className="story-event-conflict">
                                <p>{t(activeEvent.conflict)}</p>
                            </div>
                        )}
                        
                        {/* Display Options */}
                        <div className="story-event-options">
                            {/* Translate header */}
                            <h3>{t('event_popup_options_header_plan_to')}</h3>
                            {activeEvent.options && activeEvent.options.map((option, index) => {
                                let emoji = '';
                                if (index === 0) emoji = '🤝';
                                else if (index === 1) emoji = '🛡️';
                                // Assuming event.options.id is like "A" or "B"
                                // Option text should come from translation keys like event_EraX_EventKey_option_A_description
                                
                                return (
                                    // Use option.id for key as it's stable
                                    <button key={option.id} onClick={() => handleOptionClick(option)}>
                                        {/* Display Emoji */} {/* Assuming emoji is a direct string or handled elsewhere */}
                                        <span className="option-emoji">{option.emoji || emoji}</span>
                                        <span className="option-text-container">
                                            {/* Translate Option Description */}
                                            {/* Use getTranslatedOptionDescription helper */}
                                            <strong>{getTranslatedOptionDescription(option)}</strong>
                                            {/* Assuming subText is direct text or will be removed/handled via description */}
                                            {/* {option.subText && <span className="option-subtext">{option.subText}</span>} */}
                                        </span>
                                    </button>
                                );
                            })}
                            {!activeEvent.options?.length && ( // Handle case with no options (auto-resolve/acknowledge)
                                <button onClick={() => handleOptionClick(null)}> 
                                    {t('event_popup_acknowledge', 'Acknowledge')}
                                </button>
                            )}
                        </div>
                    </>
                )}
                {/* --- End Conditional Rendering --- */}
            </div>
        </div>
    );
};

export default EventPopup; 