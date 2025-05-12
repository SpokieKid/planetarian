import React from 'react';
import './WormholeIcon.css';
import usePlanetStore from '../hooks/usePlanetState';

const WormholeIcon = () => {
    const setCurrentView = usePlanetStore(state => state.setCurrentView);
    const hasBaseIntroBeenCompleted = usePlanetStore(state => state.hasBaseIntroBeenCompleted);
    const setMode = usePlanetStore(state => state.setMode); // Assuming a setMode action exists or will be added

    const handleClick = () => {
        if (hasBaseIntroBeenCompleted) {
            console.log('Wormhole clicked! Base intro already completed. Navigating directly to Base planet view...');
            // If setCurrentView also handles setting the mode based on view, this might be enough.
            // Otherwise, explicitly set mode if necessary:
            // usePlanetStore.setState({ mode: PLANET_MODES.BASE }); 
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