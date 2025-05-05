import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
// Assuming you might want to use the global state for karma later
// import usePlanetStore from '../hooks/usePlanetState';

// Function to generate a random point on a sphere surface
const getRandomPointOnSphere = (radius) => {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
};

// Individual Sun component
const Sun = ({ position, onClick }) => {
    const meshRef = useRef();

    // Optional: Make the sun pulse or rotate slightly
    useFrame((state /*, delta */) => {
        if (meshRef.current) {
           // meshRef.current.rotation.y += delta * 0.5;
           // Simple pulse effect
           const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
           meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <Sphere ref={meshRef} args={[0.1, 16, 16]} position={position} onClick={onClick}>
            <meshStandardMaterial color="yellow" emissive="orange" emissiveIntensity={2} />
        </Sphere>
    );
};

// Component to manage multiple suns
const CollectibleSuns = ({ count = 5, planetRadius = 1 }) => {
    // const addKarma = usePlanetStore(state => state.addKarma); // Example if using Zustand store
    const [suns, setSuns] = useState([]);

    useEffect(() => {
        const initialSuns = [];
        for (let i = 0; i < count; i++) {
            const position = getRandomPointOnSphere(planetRadius + 0.1); // Place slightly above surface
            initialSuns.push({ id: Math.random(), position }); // Simple unique ID
        }
        setSuns(initialSuns);
    }, [count, planetRadius]);

    const handleSunClick = (id) => {
        const karmaGained = Math.floor(Math.random() * 20) + 1;
        console.log(`Collected sun ${id}! Gained ${karmaGained} karma.`);
        // addKarma(karmaGained); // Update global state if needed

        // Optional: Remove the sun on click, but user requested they persist
        // setSuns(currentSuns => currentSuns.filter(sun => sun.id !== id));

         // Optional: Add visual feedback on click (e.g., temporary scale up/down)
         // This would require more state management per sun.
    };

    return (
        <group>
            {suns.map(sun => (
                <Sun
                    key={sun.id}
                    position={sun.position}
                    onClick={(event) => {
                        event.stopPropagation(); // Prevent triggering OrbitControls
                        handleSunClick(sun.id);
                    }}
                />
            ))}
        </group>
    );
};

export default CollectibleSuns; 