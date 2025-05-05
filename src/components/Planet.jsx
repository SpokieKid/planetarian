import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import usePlanetStore from '../hooks/usePlanetState';
import { getVisualStyle } from '../utils/resourceMapping'; // Use for colors/textures

// Simple Building Component
const Building = ({ position }) => {
    const buildingRef = useRef();
    const height = 0.1 + Math.random() * 0.2; // Random height
    const width = 0.05;
    
    // Orient the building outwards from the center
    useEffect(() => {
        if (buildingRef.current) {
            buildingRef.current.lookAt(0, 0, 0); 
            // Rotate it so the base is on the surface
            buildingRef.current.rotateX(Math.PI / 2); 
        }
    }, []); // Run once on mount

    return (
        <mesh ref={buildingRef} position={position}>
            <boxGeometry args={[width, height, width]} /> {/* Y is height */} 
            <meshStandardMaterial color={0xcccccc} roughness={0.6} metalness={0.3} />
        </mesh>
    );
};

const Planet = () => {
    const planetMeshRef = useRef();
    // Select state individually to prevent infinite loops
    const mode = usePlanetStore(state => state.mode);
    const growthPoints = usePlanetStore(state => state.growthPoints);
    const resolvedEventCount = usePlanetStore(state => state.resolvedEventCount);

    // State to hold building data (positions)
    const [buildings, setBuildings] = useState([]);
    // Ref to track the previous event count
    const prevEventCountRef = useRef(resolvedEventCount);

    // --- Effect to add buildings when event count increases ---
    useEffect(() => {
        // Check if the count actually increased since last render
        if (resolvedEventCount > prevEventCountRef.current) {
            console.log("Adding building due to event resolution...");
            // Calculate a random point on the sphere surface (radius 1)
            const phi = Math.acos(-1 + (2 * Math.random())); // Inclination (0..pi)
            const theta = Math.random() * Math.PI * 2; // Azimuth (0..2pi)

            const position = new THREE.Vector3();
            position.setFromSphericalCoords(1.05, phi, theta); // Radius slightly > 1 to sit on surface
            
            // Add new building data to state
            setBuildings(prev => [
                 ...prev,
                 { id: resolvedEventCount, position: [position.x, position.y, position.z] } // Store as array for prop
            ]);
        }
        // Update the ref for the next comparison
        prevEventCountRef.current = resolvedEventCount;
    }, [resolvedEventCount]); // Re-run only when resolvedEventCount changes
    // ---------------------------------------------------------

    // Update rotation every frame
    useFrame((state, delta) => {
        if (planetMeshRef.current) {
            planetMeshRef.current.rotation.y += delta * 0.1; // Adjust rotation speed as needed
        }
    });

    // Memoize style calculation to avoid re-running on every render
    const visualStyle = useMemo(() => getVisualStyle(mode), [mode]);
    
    // Load the texture based on the current mode
    const texture = useLoader(THREE.TextureLoader, visualStyle.planetTextureUrl);
    
    // Ensure pixelated look for 8-bit style
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    // Calculate planet scale based on growthPoints
    const planetScale = 1 + growthPoints * 0.005; // Adjust scaling factor

    // Placeholder for texture loading - replace with actual texture later
    // const texture = useLoader(THREE.TextureLoader, visualStyle.planetTextureKey);
    
    return (
        <mesh ref={planetMeshRef} scale={planetScale}>
            <sphereGeometry args={[1, 32, 32]} />
            {/* Use MeshStandardMaterial for lighting and apply texture */}
            <meshStandardMaterial 
                map={texture} 
                metalness={0.1} // Low metalness for less shine
                roughness={0.8} // High roughness for a matte look
            />
            {/* Render buildings as children */} 
            {buildings.map(building => (
                 <Building key={building.id} position={building.position} />
             ))}
            {/* TODO: Add atmosphere later */}
        </mesh>
    );
};

export default Planet; 