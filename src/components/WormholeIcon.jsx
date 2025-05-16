import React from 'react';
import './WormholeIcon.css';
import usePlanetStore from '../hooks/usePlanetState';
import { PLANET_MODES } from '../utils/resourceMapping';

const WormholeIcon = () => {
    const setCurrentView = usePlanetStore(state => state.setCurrentView);
    const initializePlanet = usePlanetStore(state => state.initializePlanet);
    const hasBaseIntroBeenCompleted = usePlanetStore(state => state.hasBaseIntroBeenCompleted);

    const handleClick = () => {
        if (hasBaseIntroBeenCompleted) {
            console.log('Wormhole clicked! Base intro already completed. Initializing Base planet and navigating directly to Base planet view...');
            initializePlanet(PLANET_MODES.BASE);
            setCurrentView('base_planet');
        } else {
            console.log('Wormhole clicked! Attempting to navigate to Base planet intro...');
            setCurrentView('base_intro');
        }
    };

    return (
        <div className="wormhole-icon-container" onClick={handleClick} title="Travel to Base Planet">
            <img src="/assets/images/wormhole.jpg" alt="Wormhole to Base Planet" />
        </div>
    );
};

export default WormholeIcon; 