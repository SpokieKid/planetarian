// Logic for defining resource modifiers based on the planet's societal mode

export const PLANET_MODES = {
  INTERNATIONAL: 'International',
  GLOBAL: 'Global',
  PLANETARY: 'Planetary',
  BASE: 'Base', // New mode for Base Planet
};

const MODIFIERS = {
  [PLANET_MODES.INTERNATIONAL]: {
    baseGrowthRate: 0.5, // Slower growth
    resourceCapMultiplier: 0.8, // Lower resource caps
    eventBias: 'negative', // More likely to get negative events
    initialResources: { water: 50, light: 50, air: 50, ideas: 20 },
    description: "Governed by strict borders and regulations. Growth is slow, resources are controlled, and international cooperation is difficult."
  },
  [PLANET_MODES.GLOBAL]: {
    baseGrowthRate: 1.0, // Standard growth
    resourceCapMultiplier: 1.0, // Standard caps
    eventBias: 'mixed', // Mix of positive and negative events
    initialResources: { water: 70, light: 70, air: 70, ideas: 50 },
    description: "Connected through global trade and finance. Growth is possible but volatile, subject to market forces and competition."
  },
  [PLANET_MODES.PLANETARY]: {
    baseGrowthRate: 1.5, // Faster growth
    resourceCapMultiplier: 1.2, // Higher caps
    eventBias: 'positive', // More likely to get positive events
    initialResources: { water: 100, light: 100, air: 100, ideas: 100 },
    description: "A decentralized, open network. Growth is rapid, resources flow freely, and collaboration thrives."
  }
};

/**
 * Gets the modifiers (growth rate, caps, event bias, etc.) for a given planet mode.
 * @param {string} mode - The planet mode (e.g., PLANET_MODES.INTERNATIONAL).
 * @returns {object} The modifiers for that mode.
 */
export const getResourceModifiers = (mode) => {
  return MODIFIERS[mode] || MODIFIERS[PLANET_MODES.GLOBAL]; // Default to Global if mode is invalid
};

/**
 * Gets the visual style properties for a given mode.
 * @param {string} mode
 * @returns {object} Object containing style properties (e.g., { planetTexture: 'texture_int.png', backgroundColor: '#...' })
 */
export const getVisualStyle = (mode) => {
    switch (mode) {
        case PLANET_MODES.INTERNATIONAL:
            return {
                planetTextureKey: 'planet_int', // Base name for texture
                planetTextureUrl: '/assets/planets/planet_texture_international.png', // Relative path
                backgroundColor: 0x1a1a2e, // Dark blue-purple
                borderColor: '#e94560', // Reddish border (less relevant now)
                atmosphereColor: 0x4a4e69, // Muted grey-blue
            };
        case PLANET_MODES.GLOBAL:
            return {
                planetTextureKey: 'planet_glob',
                planetTextureUrl: '/assets/planets/planet_texture_global.png',
                backgroundColor: 0x16213e, // Deeper blue
                borderColor: '#fca311', // Orange border
                atmosphereColor: 0x0f3460, // Standard blue
            };
        case PLANET_MODES.BASE: // Visuals for Base Planet
            return {
                planetTextureKey: 'planet_base',
                planetTextureUrl: '/assets/planets/planet_texture_base.jpg', // Path for Base planet texture
                backgroundColor: 0x000000, // Example: Black, or could be transparent if basebackground.jpg is handled elsewhere
                borderColor: '#8888FF', // Example border color for Base
                atmosphereColor: 0xCCCCCC, // Example atmosphere for Base
            };
        case PLANET_MODES.PLANETARY:
        default:
            return {
                planetTextureKey: 'planet_plan',
                planetTextureUrl: '/assets/planets/planet_texture_planetary.png',
                backgroundColor: 0x000000, // Black space
                borderColor: '#50c878', // Emerald green border
                atmosphereColor: 0x50fa7b, // Bright green
            };
    }
} 