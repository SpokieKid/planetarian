import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import usePlanetStore from '../hooks/usePlanetState';

// Define number of particles to emit when 'Aliens' VFX is triggered
const ALIEN_PARTICLES_COUNT = 100; // Number of alien particles per trigger
const ALIEN_PARTICLE_LIFESPAN = 10.0; // Seconds - Total lifespan for alien particles
const ALIEN_PARTICLE_SPEED = 0.1; // Speed towards the planet

// --- GLSL Shaders for particle fading and texture selection ---
const vertexShader = `
    attribute float lifeRemaining;
    attribute float textureIndex; // Attribute to pass texture index
    varying float vLifeRemaining;
    varying float vTextureIndex; // Varying to pass index to fragment shader
    uniform float lifespan; // Pass lifespan as a uniform

    void main() {
        vLifeRemaining = lifeRemaining;
        vTextureIndex = textureIndex; // Pass texture index

        // Scale size with life and distance
        gl_PointSize = 0.3 * (1.0 + lifeRemaining / lifespan);
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize *= (300.0 / length(modelViewPosition.xyz));
        gl_Position = projectionMatrix * modelViewPosition;
    }
`;

const fragmentShader = `
    uniform sampler2D textures[3]; // Uniform array of textures (assuming 3)
    varying float vLifeRemaining;
    varying float vTextureIndex; // Receive texture index
    uniform float lifespan; // Pass lifespan as a uniform

    void main() {
        vec4 texColor;

        // Use vTextureIndex to select the correct texture from the array
        // int index = int(vTextureIndex); // Use floor or direct cast, be mindful of precision
        if (vTextureIndex < 0.5) { // Index 0
            texColor = texture2D(textures[0], gl_PointCoord);
        } else if (vTextureIndex < 1.5) { // Index 1
            texColor = texture2D(textures[1], gl_PointCoord);
        } else { // Index 2 (and potentially higher if buffer is larger than 3)
            texColor = texture2D(textures[2], gl_PointCoord);
        }


        float lifeRatio = vLifeRemaining / lifespan; // Ratio from 0 (dead) to 1 (born)

        // Fade in over the first 0.5 seconds
        float fadeInDuration = 0.5;
        float fadeInFactor = smoothstep(lifespan - fadeInDuration, lifespan, vLifeRemaining);

        // Fade out over the last 0.5 seconds
        float fadeOutDuration = 0.5;
        float fadeOutFactor = smoothstep(0.0, fadeOutDuration, vLifeRemaining);

        float alpha = texColor.a * fadeInFactor * fadeOutFactor; // Apply both fade in and fade out

        gl_FragColor = vec4(texColor.rgb, alpha);

        if (gl_FragColor.a < 0.01) discard;
    }
`;
// --- End Shaders ---

const AlienParticles = () => {
    const alienParticlesRef = useRef();

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

    // Store alien particle data (position, velocity, life, textureIndex)
    const alienParticleData = useMemo(() => [], []);

    // --- Modified: Add textureIndex attribute to geometry ---
    const alienParticlesGeometry = useMemo(() => {
        const totalMaxParticles = ALIEN_PARTICLES_COUNT * 10; // Allocate space
        const positions = new Float32Array(totalMaxParticles * 3);
        const lifeRemainings = new Float32Array(totalMaxParticles);
        const textureIndices = new Float32Array(totalMaxParticles); // New attribute for texture index

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('lifeRemaining', new THREE.BufferAttribute(lifeRemainings, 1));
        geometry.setAttribute('textureIndex', new THREE.BufferAttribute(textureIndices, 1)); // Add texture index attribute

        return geometry;
    }, []); // Empty dependency array

    // --- Modified: Pass the array of textures to the ShaderMaterial ---
    const alienParticlesMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                textures: { value: alienTextures }, // Pass the array of textures
                lifespan: { value: ALIEN_PARTICLE_LIFESPAN },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
    }, [alienTextures]); // Depend on the array of textures

    // Effect to trigger particle emission when lastResolvedEventVfx is 'Aliens'
    useEffect(() => {
        if (lastResolvedEventVfx === 'Aliens') {
            console.log("Alien VFX triggered, emitting alien particles!");

            const planetScale = 1 + usePlanetStore.getState().growthPoints * 0.005; // Get current planet scale for start position offset

            const positions = alienParticlesGeometry.attributes.position.array;
            const lifeRemainings = alienParticlesGeometry.attributes.lifeRemaining.array;
            const textureIndices = alienParticlesGeometry.attributes.textureIndex.array; // Get texture indices attribute array

            // Add new particles
            for (let i = 0; i < ALIEN_PARTICLES_COUNT; i++) {
                const particleIndex = alienParticleData.length;
                // Ensure we don't exceed allocated buffer size
                if (particleIndex >= positions.length / 3) {
                    console.warn("Alien particle buffer full, skipping emission.");
                    break;
                }

                const positionIndex = particleIndex * 3;
                const lifeIndex = particleIndex;
                const textureIndexAttr = particleIndex; // Index for textureIndex attribute array

                // Generate a random position far away from the planet
                const phi = Math.acos(-1 + (2 * Math.random()));
                const theta = Math.random() * Math.PI * 2;
                const startDistance = planetScale * 5; // Start 5 times the planet radius away

                const startPos = new THREE.Vector3();
                startPos.setFromSphericalCoords(startDistance, phi, theta);

                // Calculate velocity vector pointing towards the planet center (0,0,0)
                const velocity = startPos.clone().negate().normalize().multiplyScalar(ALIEN_PARTICLE_SPEED);

                // --- Modified: Randomly select a texture index ---
                const randomTextureIndex = Math.floor(Math.random() * alienTextures.length);
                // --- End Modified ---


                alienParticleData.push({
                    position: startPos.toArray(),
                    velocity: velocity,
                    life: ALIEN_PARTICLE_LIFESPAN,
                    textureIndex: randomTextureIndex, // Store the selected texture index
                });

                // Update geometry attributes for the new particle
                positions[positionIndex] = startPos.x;
                positions[positionIndex + 1] = startPos.y;
                positions[positionIndex + 2] = startPos.z;
                lifeRemainings[lifeIndex] = ALIEN_PARTICLE_LIFESPAN;
                textureIndices[textureIndexAttr] = randomTextureIndex; // Update texture index attribute
            }

            // Update geometry draw range to include new particles
            alienParticlesGeometry.setDrawRange(0, alienParticleData.length);

            // Mark attributes for update
            alienParticlesGeometry.attributes.position.needsUpdate = true;
            alienParticlesGeometry.attributes.lifeRemaining.needsUpdate = true;
            alienParticlesGeometry.attributes.textureIndex.needsUpdate = true; // Mark new attribute for update
        }
    }, [lastResolvedEventVfx, alienParticleData, alienParticlesGeometry, alienTextures.length]); // Depend on lastResolvedEventVfx and texture length

    // useFrame for animating particles
    useFrame((state, delta) => {
        const positions = alienParticlesGeometry.attributes.position.array;
        const lifeRemainings = alienParticlesGeometry.attributes.lifeRemaining.array;
        // textureIndices attribute doesn't change after creation, no need to get it here

        for (let i = alienParticleData.length - 1; i >= 0; i--) {
            const particle = alienParticleData[i];
            const positionIndex = i * 3;
            const lifeIndex = i;
            // textureIndexAttr index is simply 'i'

            if (particle.life > 0) {
                // Update position based on velocity
                particle.position[0] += particle.velocity.x * delta;
                particle.position[1] += particle.velocity.y * delta;
                particle.position[2] += particle.velocity.z * delta;

                positions[positionIndex] = particle.position[0];
                positions[positionIndex + 1] = particle.position[1];
                positions[positionIndex + 2] = particle.position[2];

                // Decrease life
                particle.life -= delta;
                lifeRemainings[lifeIndex] = Math.max(0, particle.life);

                // Optional: remove particle if it gets too close to the center (inside planet)
                // const distanceToCenter = new THREE.Vector3(particle.position[0], particle.position[1], particle.position[2]).length();
                // if (distanceToCenter < (1 + usePlanetStore.getState().growthPoints * 0.005)) { // Use current planet radius
                //      particle.life = 0; // Mark as dead to be removed/hidden
                // }

            } else {
                // Hide particles with zero life by moving them far away
                positions[positionIndex] = 10000;
                positions[positionIndex + 1] = 10000;
                positions[positionIndex + 2] = 10000;
                lifeRemainings[lifeIndex] = 0; // Ensure life is zero in buffer
                // Note: Particles are marked dead/hidden but not removed from the array to avoid
                // constantly shifting buffer data, which can be less performant.
            }
        }

        // Mark attributes for update
        alienParticlesGeometry.attributes.position.needsUpdate = true;
        alienParticlesGeometry.attributes.lifeRemaining.needsUpdate = true;
        // textureIndex attribute does NOT need update in useFrame as it's static per particle
    });

    // Render the particles
    return (
        <points ref={alienParticlesRef} geometry={alienParticlesGeometry} material={alienParticlesMaterial} />
    );
};

export default AlienParticles;
