import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import usePlanetStore from '../hooks/usePlanetState';
import { getVisualStyle } from '../utils/resourceMapping'; // Use for colors/textures

// Array of available models
// const AVAILABLE_MODELS = [
//     { name: 'tree', mtl: '/assets/models/tree.mtl', obj: '/assets/models/tree.obj', scale: [0.0002, 0.0002, 0.0002] },
//     { name: 'robot', mtl: '/assets/models/robot.mtl', obj: '/assets/models/robot.obj', scale: [0.0002, 0.0002, 0.0002] },
//     { name: 'room', mtl: '/assets/models/room.mtl', obj: '/assets/models/room.obj', scale: [0.01, 0.01, 0.01] },
//     // Add more models here, e.g.:
//     // { name: 'rock', mtl: '/assets/models/rock.mtl', obj: '/assets/models/rock.obj', scale: [0.01, 0.01, 0.01] },
// ];

// Updated Building Component to load the Tree model
// const Building = ({ position, modelInfo }) => {
//     const buildingRef = useRef();

//     // Load materials first
//     const materials = useLoader(MTLLoader, modelInfo.mtl);
//     // Load the obj model, applying the loaded materials
//     const obj = useLoader(OBJLoader, modelInfo.obj, loader => {
//       materials.preload();
//       loader.setMaterials(materials);
//     });

//     useEffect(() => {
//         if (buildingRef.current) {
//             // Traverse is not strictly necessary if materials are loaded via MTL,
//             // but keeping it doesn't hurt and might be useful for other tweaks.
//             buildingRef.current.traverse((child) => {
//                 if (child.isMesh) {
//                     // Materials should be applied by the loader now.
//                     // child.castShadow = true; // Optional: if you want buildings to cast shadows
//                     // child.receiveShadow = true; // Optional: if you want buildings to receive shadows
//                 }
//             });

//             // Adjust transformations for the entire loaded object group
//             buildingRef.current.lookAt(0, 0, 0); // Orient towards planet center
//             buildingRef.current.rotateX(Math.PI / 2); // Rotate base to surface

//             buildingRef.current.scale.set(...modelInfo.scale);
//         }
//     }, [obj, modelInfo.scale]); // Re-run effect when the obj model is loaded or scale changes

//     // Render the loaded model using <primitive>
//     // Use Suspense to handle the asynchronous loading
//     return (
//         <Suspense fallback={null}> 
//             <primitive 
//                 ref={buildingRef} 
//                 object={obj.clone()} // Use clone for multiple instances
//                 position={position} 
//             />
//         </Suspense>
//     );
// };

const Planet = () => {
    const planetMeshRef = useRef();
    // Select state individually to prevent infinite loops
    const game_mode = usePlanetStore(state => state.game_mode);
    const growthPoints = usePlanetStore(state => state.growthPoints);
    const resolvedEventCount = usePlanetStore(state => state.resolvedEventCount);
    // const currentView = usePlanetStore(state => state.currentView);
    // const triggerSpecificEvent = usePlanetStore(state => state.triggerSpecificEvent);
    // const activeEvent = usePlanetStore(state => state.activeEvent); // To prevent multiple triggers
    const createdAt = usePlanetStore(state => state.createdAt); // <-- Get createdAt

    // State to hold building data (positions)
    const [buildings, setBuildings] = useState([]);
    // Ref to track the previous event count
    const prevEventCountRef = useRef(resolvedEventCount);

    // --- Removed state and ref for glow effect ---
    // const [isGlowing, setIsGlowing] = useState(false);
    // const glowTimerRef = useRef(null);
    // --- End removed state and ref for glow effect ---

    // --- Effect to clear buildings on planet re-initialization (via createdAt or mode change) ---
    useEffect(() => {
        console.log("[Planet.jsx] Mode or createdAt changed, resetting buildings. New mode:", game_mode);
        // setBuildings([]); // Comment out or remove if not needed anymore without buildings
        prevEventCountRef.current = 0;
    }, [createdAt, game_mode]); // Depend on createdAt AND mode

    // --- Effect to add buildings when event count increases (COMMENTED OUT) ---
    // useEffect(() => {
    //     // Check if the count actually increased since last render
    //     if (resolvedEventCount > prevEventCountRef.current) {
    //         console.log("Adding *two* trees (buildings) due to event resolution..."); // Reverted log
    // 
    //         const newObjects = [];
    //         for (let i = 0; i < 2; i++) { // Loop to add two objects
    //             const phi = Math.acos(-1 + (2 * Math.random())); // Inclination (0..pi)
    //             const theta = Math.random() * Math.PI * 2; // Azimuth (0..2pi)
    // 
    //             const positionVec = new THREE.Vector3();
    //             // Adjust radius slightly based on scale to sit on surface properly
    //             const planetScale = 1 + usePlanetStore.getState().growthPoints * 0.005;
    //             positionVec.setFromSphericalCoords(planetScale * 1.01, phi, theta); // Slightly above surface
    // 
    //             // Randomly select a model
    //             const randomModel = AVAILABLE_MODELS[Math.floor(Math.random() * AVAILABLE_MODELS.length)];
    // 
    //             // Add new building data to state with a slightly modified ID for uniqueness if adding multiple
    //             newObjects.push({
    //                 id: `${resolvedEventCount}-${i}-${randomModel.name}`,
    //                 position: [positionVec.x, positionVec.y, positionVec.z],
    //                 modelInfo: randomModel // Store the selected model info
    //             });
    //         }
    // 
    //         setBuildings(prev => [
    //              ...prev,
    //              ...newObjects
    //         ]);
    //     }
    //     // Update the ref for the next comparison
    //     prevEventCountRef.current = resolvedEventCount;
    // }, [resolvedEventCount]); // Re-run only when resolvedEventCount changes
    // ---------------------------------------------------------

    // Update rotation every frame
    useFrame((state, delta) => {
        if (planetMeshRef.current) {
            planetMeshRef.current.rotation.y += delta * 0.1; // Adjust rotation speed as needed
        }
    });

    // Memoize style calculation to avoid re-running on every render
    const visualStyle = useMemo(() => getVisualStyle(game_mode), [game_mode]);

    // Load the texture based on the current mode
    const texture = useLoader(THREE.TextureLoader, visualStyle.planetTextureUrl, 
        (loader) => { console.log(`[Planet.jsx] Texture loading started for: ${visualStyle.planetTextureUrl}`); },
        (progress) => { console.log(`[Planet.jsx] Texture loading progress: ${(progress.loaded / progress.total * 100).toFixed(2)}%`); },
        (error) => { console.error(`[Planet.jsx] Texture loading failed for: ${visualStyle.planetTextureUrl}`, error); });

    // Ensure pixelated look for 8-bit style
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    // Calculate planet scale based on growthPoints
    const planetScale = 1 + growthPoints * 0.005; // Adjust scaling factor

    // Placeholder for texture loading - replace with actual texture later
    // const texture = useLoader(THREE.TextureLoader, visualStyle.planetTextureKey);

    // const handlePlanetClick = () => { // <-- Comment out or remove this handler
    //     if (currentView === 'base_planet' && !activeEvent) {
    //         console.log("Base planet clicked, triggering BASESTONE_01 event.");
    //         triggerSpecificEvent('BASESTONE_01');
    //     } else {
    //         console.log("Planet clicked, but not triggering event. View:", currentView, "ActiveEvent:", activeEvent);
    //     }
    // };

    return (
        <mesh
            ref={planetMeshRef}
            scale={planetScale}
            // onClick={handlePlanetClick} // <-- Comment out or remove click handler attachment
        >
            <sphereGeometry args={[1, 32, 32]} />
            {/* Use MeshStandardMaterial for lighting and apply texture */}
            <meshStandardMaterial
                map={texture}
                metalness={0.1} // Low metalness for less shine
                roughness={0.8} // High roughness for a matte look
                // --- Removed glow effect material properties ---
                // emissive={isGlowing ? new THREE.Color(0xffffff) : new THREE.Color(0x000000)} // Set emissive color (white when glowing)
                // emissiveIntensity={isGlowing ? 1.5 : 0} // Increase intensity when glowing (adjust value)
                // --- End removed glow effect material properties ---
            />
            {/* Render buildings (now trees) as children - COMMENTED OUT */}
             {/* {buildings.map(building => (
                 <Building key={building.id} position={building.position} modelInfo={building.modelInfo} />
             ))} */}
            {/* TODO: Add atmosphere later */}
        </mesh>
    );
};

export default Planet; 