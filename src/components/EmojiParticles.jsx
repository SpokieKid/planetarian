import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import usePlanetStore from '../hooks/usePlanetState';

// Define number of particles to emit per event
const PARTICLES_PER_EVENT = 60; // Increase total particles
const PARTICLE_LIFESPAN = 25.0; // Seconds - Increased total lifespan to include fade
const PARTICLE_SPEED = 0.05; // Adjust as needed

// --- GLSL Shaders for particle fading ---
const vertexShader = `
    attribute float lifeRemaining;
    varying float vLifeRemaining;

    void main() {
        vLifeRemaining = lifeRemaining;
        // Pass the point size to the fragment shader if needed
        gl_PointSize = 0.2 * (1.0 + lifeRemaining / ${PARTICLE_LIFESPAN}.0); // Example: Scale size with life
        // Scale points based on distance (adjust 300.0 based on camera/scene size)
        // Use length of modelViewPosition for distance-based scaling
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize *= (300.0 / length(modelViewPosition.xyz)); 
        gl_Position = projectionMatrix * modelViewPosition;
    }
`;

const fragmentShader = `
    uniform sampler2D map;
    varying float vLifeRemaining;

    void main() {
        vec4 texColor = texture2D(map, gl_PointCoord);

        // Calculate alpha based on life remaining
        float lifeRatio = vLifeRemaining / ${PARTICLE_LIFESPAN}.0; // Ratio from 0 (dead) to 1 (born)

        // Fade in over the first 0.5 seconds (lifeRatio from 1.0 to 0.875)
        // Fade out over the last 0.5 seconds (lifeRatio from 0.125 to 0.0)
        // Fully opaque between 0.875 and 0.125 lifeRatio (which is 3 seconds)
        float fadeInFactor = smoothstep(0.875, 1.0, lifeRatio);
        float fadeOutFactor = smoothstep(0.0, 0.125, lifeRatio);

        float alpha = fadeInFactor * fadeOutFactor;

        gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);

        // Discard transparent pixels
        if (gl_FragColor.a < 0.01) discard;
    }
`;
// --- End Shaders ---

const EmojiParticles = () => {
    const chatParticlesRef = useRef();
    const linkParticlesRef = useRef();

    const resolvedEventCount = usePlanetStore(state => state.resolvedEventCount);
    const prevEventCountRef = useRef(resolvedEventCount);

    // Load Emoji Textures
    const chatTexture = useLoader(THREE.TextureLoader, '/assets/textures/emoji_chat.png'); // Assuming you have these files
    const linkTexture = useLoader(THREE.TextureLoader, '/assets/textures/emoji_link.png'); // Assuming you have these files

    // Store particle data (position, velocity, life)
    const chatParticleData = useMemo(() => [], []);
    const linkParticleData = useMemo(() => [], []);

    // Use useMemo to create geometry for each emoji type
    const [chatParticlesGeometry, linkParticlesGeometry] = useMemo(() => {
        const totalMaxParticles = PARTICLES_PER_EVENT * 100; // Allocate space for up to 100 events worth of particles
        const positions = new Float32Array(totalMaxParticles * 3);
        const lifeRemainings = new Float32Array(totalMaxParticles); // Attribute for life remaining

        const chatGeometry = new THREE.BufferGeometry();
        chatGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, totalMaxParticles * 3 / 2), 3));
        chatGeometry.setAttribute('lifeRemaining', new THREE.BufferAttribute(lifeRemainings.slice(0, totalMaxParticles / 2), 1));

        const linkGeometry = new THREE.BufferGeometry();
        linkGeometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(totalMaxParticles * 3 / 2), 3));
        linkGeometry.setAttribute('lifeRemaining', new THREE.BufferAttribute(lifeRemainings.slice(totalMaxParticles / 2), 1));

        return [chatGeometry, linkGeometry];
    }, []); // Empty dependency array means this runs only once

    // Use useMemo to create ShaderMaterial for each emoji type
    const [chatParticlesMaterial, linkParticlesMaterial] = useMemo(() => {
        const chatMaterial = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: chatTexture },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const linkMaterial = new THREE.ShaderMaterial({
             uniforms: {
                map: { value: linkTexture },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        return [chatMaterial, linkMaterial];
    }, [chatTexture, linkTexture]); // Depend on textures

    // Effect to trigger particle emission when resolvedEventCount increases
    useEffect(() => {
        if (resolvedEventCount > prevEventCountRef.current) {
            console.log(`Event resolved (count: ${resolvedEventCount}), triggering emoji particle emission!`);

            const planetScale = 1 + usePlanetStore.getState().growthPoints * 0.005; // Get current planet scale

            const chatPositions = chatParticlesGeometry.attributes.position.array;
            const chatLifeRemainings = chatParticlesGeometry.attributes.lifeRemaining.array;
            const linkPositions = linkParticlesGeometry.attributes.position.array;
            const linkLifeRemainings = linkParticlesGeometry.attributes.lifeRemaining.array;

            for (let i = 0; i < PARTICLES_PER_EVENT; i++) {
                const isChatEmoji = Math.random() > 0.5;
                const targetData = isChatEmoji ? chatParticleData : linkParticleData;
                const targetPositions = isChatEmoji ? chatPositions : linkPositions;
                const targetLifeRemainings = isChatEmoji ? chatLifeRemainings : linkLifeRemainings;

                const phi = Math.acos(-1 + (2 * Math.random()));
                const theta = Math.random() * Math.PI * 2;

                const startPos = new THREE.Vector3();
                startPos.setFromSphericalCoords(planetScale * 1.02, phi, theta);

                const particleIndex = targetData.length;
                const positionIndex = particleIndex * 3;
                const lifeIndex = particleIndex;

                targetData.push({
                    position: startPos.toArray(),
                    velocity: new THREE.Vector3(
                        (Math.random() - 0.5),
                        (Math.random() - 0.5),
                        (Math.random() - 0.5)
                    ).normalize().multiplyScalar(PARTICLE_SPEED),
                    life: PARTICLE_LIFESPAN,
                });

                targetPositions[positionIndex] = startPos.x;
                targetPositions[positionIndex + 1] = startPos.y;
                targetPositions[positionIndex + 2] = startPos.z;
                targetLifeRemainings[lifeIndex] = PARTICLE_LIFESPAN;
            }

            chatParticlesGeometry.attributes.position.needsUpdate = true;
            chatParticlesGeometry.attributes.lifeRemaining.needsUpdate = true;
            linkParticlesGeometry.attributes.position.needsUpdate = true;
            linkParticlesGeometry.attributes.lifeRemaining.needsUpdate = true;

            chatParticlesGeometry.setDrawRange(0, chatParticleData.length);
            linkParticlesGeometry.setDrawRange(0, linkParticleData.length);
        }
        prevEventCountRef.current = resolvedEventCount;

    }, [resolvedEventCount, chatParticleData, linkParticleData, chatParticlesGeometry, linkParticlesGeometry]);

    // useFrame for animating particles
    useFrame((state, delta) => {
        // Update Chat Particles
        const chatPositions = chatParticlesGeometry.attributes.position.array;
        const chatLifeRemainings = chatParticlesGeometry.attributes.lifeRemaining.array;
        for (let i = 0; i < chatParticleData.length; i++) {
            const particle = chatParticleData[i];
            const positionIndex = i * 3;
            const lifeIndex = i;

            if (particle.life > 0) {
                particle.position[0] += particle.velocity.x * delta;
                particle.position[1] += particle.velocity.y * delta;
                particle.position[2] += particle.velocity.z * delta;

                chatPositions[positionIndex] = particle.position[0];
                chatPositions[positionIndex + 1] = particle.position[1];
                chatPositions[positionIndex + 2] = particle.position[2];

                particle.life -= delta;

                chatLifeRemainings[lifeIndex] = Math.max(0, particle.life);
            } else {
                 chatPositions[positionIndex] = 10000;
                 chatPositions[positionIndex + 1] = 10000;
                 chatPositions[positionIndex + 2] = 10000;
                 chatLifeRemainings[lifeIndex] = 0;
            }
        }

        // Update Link Particles
        const linkPositions = linkParticlesGeometry.attributes.position.array;
        const linkLifeRemainings = linkParticlesGeometry.attributes.lifeRemaining.array;
         for (let i = 0; i < linkParticleData.length; i++) {
            const particle = linkParticleData[i];
            const positionIndex = i * 3;
            const lifeIndex = i;

            if (particle.life > 0) {
                particle.position[0] += particle.velocity.x * delta;
                particle.position[1] += particle.velocity.y * delta;
                particle.position[2] += particle.velocity.z * delta;

                linkPositions[positionIndex] = particle.position[0];
                linkPositions[positionIndex + 1] = particle.position[1];
                linkPositions[positionIndex + 2] = particle.position[2];

                particle.life -= delta;

                linkLifeRemainings[lifeIndex] = Math.max(0, particle.life);
            } else {
                 linkPositions[positionIndex] = 10000;
                 linkPositions[positionIndex + 1] = 10000;
                 linkPositions[positionIndex + 2] = 10000;
                 linkLifeRemainings[lifeIndex] = 0;
            }
        }

        chatParticlesGeometry.attributes.position.needsUpdate = true;
        chatParticlesGeometry.attributes.lifeRemaining.needsUpdate = true;
        linkParticlesGeometry.attributes.position.needsUpdate = true;
        linkParticlesGeometry.attributes.lifeRemaining.needsUpdate = true;
    });

    // Render both sets of particles
    return (
        <>
            <points ref={chatParticlesRef} geometry={chatParticlesGeometry} material={chatParticlesMaterial} />
            <points ref={linkParticlesRef} geometry={linkParticlesGeometry} material={linkParticlesMaterial} />
        </>
    );
};

export default EmojiParticles; 