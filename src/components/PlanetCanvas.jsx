import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Preload } from '@react-three/drei';
import Planet from './Planet'; // Import the new Planet component
import OrbitingObjects from './OrbitingObjects'; // Import orbiting objects
import BackgroundShips from './BackgroundShips'; // Import background ships
import CollectibleSuns from './CollectibleSuns'; // Import the new suns component
import usePlanetStore from '../hooks/usePlanetState';
import { getVisualStyle } from '../utils/resourceMapping'; // To get background color
import './PlanetCanvas.css'; // Basic styling for canvas container

const PlanetCanvas = () => {
    const mode = usePlanetStore(state => state.mode);
    const visualStyle = getVisualStyle(mode);

    return (
        <div className="planet-canvas-container">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }} // Adjust camera position and field of view
                gl={{ preserveDrawingBuffer: true }} // Needed for potential screenshots
            >
                {/* Optional: Set background color via CSS or a scene background */}
                {/* <color attach="background" args={[visualStyle.backgroundColor]} /> Doesn't work well with hex numbers */}
                
                {/* Add lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                {/* Use Suspense for potential async loading (like textures) */}
                <Suspense fallback={null}> 
                    <Planet />
                    <OrbitingObjects count={8} /> {/* Add orbiting objects */} 
                    <BackgroundShips count={5} /> {/* Add background ships */} 
                    <Preload all /> {/* Preload assets */} 
                </Suspense>
                
                 {/* Optional: Add environment for reflections/lighting */}
                 {/* <Environment preset="sunset" /> */}

                {/* Add controls to orbit the planet */}
                <OrbitControls enableZoom={true} />
            </Canvas>
            {/* Style background color via CSS as hex is tricky in r3f color attach */}
            <style>{`
                .planet-canvas-container {
                    background-color: transparent; /* Allow underlying CSS background to show */
                }
            `}</style>
        </div>
    );
};

export default PlanetCanvas; 