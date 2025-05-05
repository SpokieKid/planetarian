import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BackgroundShip = ({ initialPosition, speed }) => {
    const meshRef = useRef();
    const resetPosition = -20; // Where to reset when off-screen
    const limit = 20; // Screen edge limit

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.position.x += delta * speed;
            // Reset position if it goes off screen
            if (speed > 0 && meshRef.current.position.x > limit) {
                meshRef.current.position.x = resetPosition;
                // Optional: Randomize y/z slightly on reset
                meshRef.current.position.y = (Math.random() - 0.5) * 10;
            } else if (speed < 0 && meshRef.current.position.x < resetPosition) {
                meshRef.current.position.x = limit;
                meshRef.current.position.y = (Math.random() - 0.5) * 10;
            }
        }
    });

    return (
        <mesh ref={meshRef} position={initialPosition} rotation={[0, 0, Math.PI / 2]}> 
            {/* Point cone along X axis */}
            <coneGeometry args={[0.1, 0.4, 8]} /> 
            <meshBasicMaterial color={0xffa500} /> {/* Simple orange color */}
        </mesh>
    );
};

const BackgroundShips = ({ count = 4 }) => {
    const ships = [];
    const Z_DISTANCE = -15; // How far back the ships are

    for (let i = 0; i < count; i++) {
        const initialX = (Math.random() - 0.5) * 40; // Start anywhere between -20 and 20
        const initialY = (Math.random() - 0.5) * 10; // Random height
        const speed = (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 1.0); // Random speed and direction
        ships.push(
            <BackgroundShip 
                key={i} 
                initialPosition={[initialX, initialY, Z_DISTANCE]}
                speed={speed}
            />
        );
    }

    return <>{ships}</>;
};

export default BackgroundShips; 