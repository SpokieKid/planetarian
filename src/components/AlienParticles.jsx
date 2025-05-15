import React, { useRef, useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import usePlanetStore from '../hooks/usePlanetState';

const AlienVfx = () => {
    const alienImageRef = useRef();

    const lastResolvedEventVfx = usePlanetStore(state => state.lastResolvedEventVfx);

    // --- Modified: Load an array of Alien Textures ---
    const alienTextures = useLoader(THREE.TextureLoader, [
        '/assets/textures/alien_particle_1.png', // Replace with your paths
        '/assets/textures/alien_particle_2.png',
        '/assets/textures/alien_particle_3.png',
    ]);

    // Apply NearestFilter for pixelated look to all loaded textures
    useEffect(() => {
        alienTextures.forEach(texture => {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
        });
    }, [alienTextures]); // Apply once textures are loaded

    // Use state to manage the currently displayed texture and visibility
    const [currentAlienTexture, setCurrentAlienTexture] = React.useState(null);
    const [isAlienVisible, setIsAlienVisible] = React.useState(false);

    // Use a timeout ref to manage the display duration
    const hideTimeoutRef = useRef(null);

    // Effect to handle VFX trigger
    useEffect(() => {
        if (lastResolvedEventVfx === 'Aliens' && alienTextures.length > 0) {
            console.log("Alien VFX triggered, displaying alien image!");

            // Clear any existing timeout
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }

            // Select a random texture
            const randomIndex = Math.floor(Math.random() * alienTextures.length);
            const selectedTexture = alienTextures[randomIndex];
            setCurrentAlienTexture(selectedTexture);

            // Make the image visible
            setIsAlienVisible(true);

            // Hide the image after 3 seconds
            hideTimeoutRef.current = setTimeout(() => {
                setIsAlienVisible(false);
                setCurrentAlienTexture(null); // Clear texture after hiding
                console.log("Alien image hidden.");
            }, 3000); // 3000 milliseconds = 3 seconds
        }

        // Cleanup function to clear timeout if component unmounts or state changes
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, [lastResolvedEventVfx, alienTextures]); // Depend on VFX state and loaded textures

    // Calculate the position on the planet surface
    const planetScale = 1 + usePlanetStore.getState().growthPoints * 0.005; // Get current planet scale
    // We need a fixed position on the surface. Let's pick one spot for now.
    // You might want to make this random or tied to an event location later.
    const position = useMemo(() => {
        const pos = new THREE.Vector3();
        // Example: Position on the equator at a specific angle
        const radius = planetScale * 1.02; // Slightly above surface
        const angle = Math.PI / 4; // Example angle (45 degrees)
        pos.setFromSphericalCoords(radius, Math.PI / 2, angle); // phi = PI/2 for equator
        return pos.toArray();
    }, [planetScale]); // Recalculate if planetScale changes

    // Render the image plane if visible and a texture is loaded
    return isAlienVisible && currentAlienTexture ? (
        <mesh position={position} ref={alienImageRef}>
            <planeGeometry args={[0.5, 0.5]} /> {/* Adjust size as needed */}
            <meshBasicMaterial map={currentAlienTexture} transparent={true} alphaTest={0.001} />
        </mesh>
    ) : null;
};

export default AlienVfx;
