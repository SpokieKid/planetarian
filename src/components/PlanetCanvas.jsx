import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Preload } from '@react-three/drei';
import Planet from './Planet'; // Import the new Planet component
import OrbitingObjects from './OrbitingObjects'; // Import orbiting objects
import BackgroundShips from './BackgroundShips'; // Import background ships
import CollectibleSuns from './CollectibleSuns'; // Import the new suns component
// import usePlanetStore from '../hooks/usePlanetState'; // Removed as unused
// import { getVisualStyle } from '../utils/resourceMapping'; // To get background color - Removed
import EmojiParticles from './EmojiParticles'; // Import the new EmojiParticles component
import DataWave from './DataWave'; // Import the DataWave component
import AlienParticles from './AlienParticles'; // Import AlienParticles
import './PlanetCanvas.css'; // Basic styling for canvas container
// import AmbientLight from './DataWave/AmbientLight';
// import PointLight from './DataWave/PointLight';
// import Camera from './DataWave/Camera'; // Import Camera component

const PlanetCanvas = ({ isZoomEnabled }) => {
    console.log("[PlanetCanvas] Component rendering."); // Add this log
    // const mode = usePlanetStore(state => state.mode); // Removed as it's unused
    // const visualStyle = getVisualStyle(mode); // Remove or uncomment this line

    return (
        <div className="planet-canvas-container">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                style={{ height: '100vh', width: '100vw', background: 'black' }} // Basic styling
                shadows // Enable shadows if needed (requires light and object setup)
            >
                <Suspense fallback={null}> {/* Use Suspense for loading models/textures */}
                    {/* <AmbientLight intensity={0.5} /> Basic ambient light */}
                    {/* <PointLight position={[10, 10, 10]} intensity={0.8} /> {/* Basic point light */}
                    <Planet /> {/* Your existing planet */}
                    {/* <Camera isZoomEnabled={isZoomEnabled} /> {/* Add the Camera component */}
                    <OrbitingObjects count={8} /> {/* Add orbiting objects */} 
                    <BackgroundShips count={5} /> {/* Add background ships */} 
                    <EmojiParticles />
                    <DataWave planetScale={1.5} /> {/* Pass initial planetScale */}
                    <AlienParticles /> {/* Add AlienParticles component */}
                    <Preload all /> {/* Preload assets */} 
                </Suspense>
                
                 {/* Optional: Add environment for reflections/lighting */}
                 {/* <Environment preset="sunset" /> */}

                {/* Add controls to orbit the planet */}
                <OrbitControls enableZoom={isZoomEnabled} minDistance={3} />
            </Canvas>
            {/* Style background color via CSS as hex is tricky in r3f color attach */}
            <style>{`
                .planet-canvas-container { /* Add a temporary background to see if the div is there */
                    background-color: transparent; /* Allow underlying CSS background to show */
                }
            `}</style>
        </div>
    );
};

export default PlanetCanvas; 