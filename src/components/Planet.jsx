import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import usePlanetStore from '../hooks/usePlanetState';
import { getVisualStyle } from '../utils/resourceMapping'; // Use for colors/textures

// Updated Building Component to load the Tree model
const Building = ({ position }) => {
    const buildingRef = useRef();

    // Load materials first
    const materials = useLoader(MTLLoader, '/assets/models/tree.mtl');
    // Load the obj model, applying the loaded materials
    const obj = useLoader(OBJLoader, '/assets/models/tree.obj', loader => {
      materials.preload();
      loader.setMaterials(materials);
    });

    useEffect(() => {
        if (buildingRef.current) {
            // Traverse is not strictly necessary if materials are loaded via MTL,
            // but keeping it doesn't hurt and might be useful for other tweaks.
            buildingRef.current.traverse((child) => {
                if (child.isMesh) {
                    // Materials should be applied by the loader now.
                    // child.castShadow = true; // Optional: if you want buildings to cast shadows
                    // child.receiveShadow = true; // Optional: if you want buildings to receive shadows
                }
            });

            // Adjust transformations for the entire loaded object group
            buildingRef.current.lookAt(0, 0, 0); // Orient towards planet center
            buildingRef.current.rotateX(Math.PI / 2); // Rotate base to surface
            
            // !!! IMPORTANT: Adjust scale as needed !!!
            // Start with a small scale and increase until the tree size looks right.
            buildingRef.current.scale.set(0.1, 0.05, 0.05); // Adjust this value!
        }
    }, [obj]); // Re-run effect when the obj model is loaded

    // Render the loaded model using <primitive>
    // Use Suspense to handle the asynchronous loading
    return (
        <Suspense fallback={null}> 
            <primitive 
                ref={buildingRef} 
                object={obj.clone()} // Use clone for multiple instances
                position={position} 
            />
        </Suspense>
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
            console.log("Adding *two* trees (buildings) due to event resolution..."); // Updated log
            
            const newTrees = [];
            for (let i = 0; i < 2; i++) { // Loop to add two trees
                const phi = Math.acos(-1 + (2 * Math.random())); // Inclination (0..pi)
                const theta = Math.random() * Math.PI * 2; // Azimuth (0..2pi)

                const position = new THREE.Vector3();
                // Adjust radius slightly based on scale to sit on surface properly
                const planetScale = 1 + usePlanetStore.getState().growthPoints * 0.005;
                position.setFromSphericalCoords(planetScale * 1.01, phi, theta); // Slightly above surface
                
                // Add new building data to state with a slightly modified ID for uniqueness if adding multiple
                newTrees.push({
                    id: `${resolvedEventCount}-${i}`, // Ensure unique key for React
                    position: [position.x, position.y, position.z]
                });
            }
            
            setBuildings(prev => [
                 ...prev,
                 ...newTrees // Add both new trees to the array
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
            {/* Render buildings (now trees) as children */} 
            {buildings.map(building => (
                 <Building key={building.id} position={building.position} />
             ))}
            {/* TODO: Add atmosphere later */}
        </mesh>
    );
};

export default Planet; 