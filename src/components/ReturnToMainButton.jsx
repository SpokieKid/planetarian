import React from 'react';
import usePlanetStore from '../hooks/usePlanetState';
import { PLANET_MODES } from '../utils/resourceMapping'; // Corrected import path
import './ReturnToMainButton.css'; // CSS for styling and positioning

const ReturnToMainButton = () => {
    const setCurrentView = usePlanetStore(state => state.setCurrentView);
    // initializePlanet is no longer needed here as setCurrentView handles mode for main_planet

    const handleClick = () => {
        console.log("Returning to main planet view...");
        setCurrentView('main_planet'); 
    };

    return (
        <button className="return-to-main-button pixel-button" onClick={handleClick} title="Return to Main Universe">
            <img src="/assets/images/spaceship.jpg" alt="Return" />
            <span>Return</span>
        </button>
    );
};

export default ReturnToMainButton; 