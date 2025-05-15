import React, { useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import usePlanetStore from '../hooks/usePlanetState';

// Define constants for the wave effect
const NUM_POINTS = 500; // Number of points in the wave
const WAVE_RADIUS_SCALE = 1.2; // How far the wave is from the planet surface (relative to planet scale)
const WAVE_AMPLITUDE = 0.1; // Base height of the wave peaks (for continuous subtle wave)
const WAVE_FREQUENCY = 2; // How many waves around the planet
const WAVE_SPEED = 0.5; // Speed of the continuous wave animation
const POINT_SIZE = 0.2; // Base size of the points

const PULSE_AMPLITUDE = 0.5; // Additional height for the triggered pulse
const PULSE_DECAY_SPEED = 3.0; // How fast the pulse effect fades

// --- GLSL Shaders for data wave ---
const vertexShader = `
    attribute float phase;
    uniform float time;
    uniform float waveAmplitude;
    uniform float waveFrequency;
    uniform float waveSpeed;
    uniform float planetScale;
    uniform float waveRadiusScale;

    uniform float pulseTime; // New uniform for pulse timing
    uniform float pulseAmplitude;
    uniform float pulseDecaySpeed;

    void main() {
        vec3 basePosition = position;

        // Calculate the angle in the XY plane
        float angle = atan(basePosition.y, basePosition.x);

        // Calculate the displacement based on time, phase, angle, frequency, and speed (continuous wave)
        float continuousDisplacement = sin((angle + time * waveSpeed) * waveFrequency + phase) * waveAmplitude;

        // Calculate the pulse displacement
        // The pulse starts at pulseTime and decays over time
        float timeSincePulse = time - pulseTime;
        float pulseDisplacement = 0.0;
        if (timeSincePulse >= 0.0) {
            // Use a decaying function, e.g., exponential or a simple inverse
            // float decayFactor = exp(-timeSincePulse * pulseDecaySpeed);
             float decayFactor = max(0.0, 1.0 - timeSincePulse * pulseDecaySpeed); // Linear decay for simplicity
            pulseDisplacement = sin(angle * waveFrequency + phase) * pulseAmplitude * decayFactor;
        }

        // Combine continuous wave and pulse displacement
        float totalDisplacement = continuousDisplacement + pulseDisplacement;

        // Apply the total displacement along the radial direction (away from the center)
        vec3 normalizedPosition = normalize(basePosition);
        vec3 finalPosition = basePosition + normalizedPosition * totalDisplacement;

        vec4 modelViewPosition = modelViewMatrix * vec4(finalPosition, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;

        // Scale points based on distance
        gl_PointSize = ${POINT_SIZE} * (300.0 / length(modelViewPosition.xyz));
    }
`;

const fragmentShader = `
    void main() {
        // Simple cyan color for now, can add more effects later
        gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0); // Cyan with full opacity
    }
`;
// --- End Shaders ---

const DataWave = ({ planetScale = 1.0 }) => {
    const pointsRef = useRef();
    const shaderMaterialRef = useRef();

    // Get the data wave trigger count from the store
    const dataWaveTriggerCount = usePlanetStore(state => state.dataWaveTriggerCount);
    // Ref to track the previous trigger count
    const prevDataWaveTriggerCountRef = useRef(dataWaveTriggerCount);

    // Use useMemo to create geometry and material
    const [geometry, material] = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(NUM_POINTS * 3);
        const phases = new Float32Array(NUM_POINTS);

        for (let i = 0; i < NUM_POINTS; i++) {
            const angle = (i / NUM_POINTS) * Math.PI * 2;
            // Adjust initial position based on planetScale and waveRadiusScale
            const radius = planetScale * WAVE_RADIUS_SCALE;
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = Math.sin(angle) * radius;
            positions[i * 3 + 2] = 0;

            phases[i] = Math.random() * Math.PI * 2;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                waveAmplitude: { value: WAVE_AMPLITUDE },
                waveFrequency: { value: WAVE_FREQUENCY },
                waveSpeed: { value: WAVE_SPEED },
                planetScale: { value: planetScale },
                waveRadiusScale: { value: WAVE_RADIUS_SCALE },
                // New uniforms for the pulse effect
                pulseTime: { value: -1000 }, // Initialize far in the past
                pulseAmplitude: { value: PULSE_AMPLITUDE },
                pulseDecaySpeed: { value: PULSE_DECAY_SPEED },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        return [geo, mat];
    }, [planetScale]); // Recreate if planetScale changes

    // Effect to trigger the pulse when dataWaveTriggerCount increases
    useEffect(() => {
        if (dataWaveTriggerCount > prevDataWaveTriggerCountRef.current) {
            console.log(`Data wave triggered (count: ${dataWaveTriggerCount}), initiating pulse!`);
            if (shaderMaterialRef.current) {
                 // Set pulseTime to the current frame's time to start the pulse animation
                 // We need access to the R3F state for the current time
                 // This requires getting time from the useFrame hook, which means we can't set it directly here.
                 // Instead, we'll use a ref or state to signal the start of the pulse to useFrame.
                 // Let's use a ref to store the time when the pulse should start.
                 pulseStartTimeRef.current = performance.now() / 1000.0; // Use high-resolution time
            }
        }
        prevDataWaveTriggerCountRef.current = dataWaveTriggerCount;

    }, [dataWaveTriggerCount]);

    // Ref to store the time when the pulse should start
    const pulseStartTimeRef = useRef(-1000); // Initialize far in the past

    // Use useFrame to animate the wave and update pulse uniform
    useFrame((state, delta) => {
        if (shaderMaterialRef.current) {
             const currentTime = state.clock.getElapsedTime(); // Get current time from R3F state
             shaderMaterialRef.current.uniforms.time.value = currentTime; // Update continuous wave time

             // Check if a pulse was triggered
             if (pulseStartTimeRef.current > -1000) {
                 // Update the pulseTime uniform with the stored start time
                 shaderMaterialRef.current.uniforms.pulseTime.value = pulseStartTimeRef.current;
                 // Reset the ref after updating the uniform
                 pulseStartTimeRef.current = -1000; // Reset signal
             }
             // Note: The shader's `pulseTime` uniform will hold the start time,
             // and the decay is calculated within the shader based on `time - pulseTime`.
        }
    });

    // Render the points
    return (
        <points ref={pointsRef} geometry={geometry}>
             {/* Assign the shader material to the points */}
             <primitive object={material} ref={shaderMaterialRef} />
        </points>
    );
};

export default DataWave;
