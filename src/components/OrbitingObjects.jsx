import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple asteroid/satellite object
const OrbitingObject = ({ radius, speed, offset = 0, size = 0.1 }) => {
    const meshRef = useRef();
    const angleRef = useRef(offset * Math.PI * 2); // Start at a random angle

    useFrame((state, delta) => {
        if (meshRef.current) {
            angleRef.current += delta * speed;
            const x = Math.cos(angleRef.current) * radius;
            const z = Math.sin(angleRef.current) * radius;
            // Keep y constant or add a slight wobble/inclination later
            meshRef.current.position.set(x, 0, z);
             // Optional: Add self-rotation
             meshRef.current.rotation.y += delta * 0.5;
             meshRef.current.rotation.x += delta * 0.2;
        }
    });

    // Use Icosahedron for a simple asteroid look
    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[size, 0]} /> 
            <meshStandardMaterial color={0x888888} roughness={0.8} metalness={0.2} />
        </mesh>
    );
};

// Component to manage multiple orbiting objects
const OrbitingObjects = ({ count = 5 }) => {
    const objects = [];
    for (let i = 0; i < count; i++) {
        const radius = 2 + Math.random() * 2; // Orbit radius between 2 and 4
        const speed = 0.1 + Math.random() * 0.2; // Random speed
        const offset = Math.random(); // Random starting position
        const size = 0.05 + Math.random() * 0.1; // Random size
        objects.push(<OrbitingObject key={i} radius={radius} speed={speed} offset={offset} size={size} />);
    }

    return <>{objects}</>;
};

export default OrbitingObjects; 