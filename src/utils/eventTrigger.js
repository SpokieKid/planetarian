// Logic for triggering narrative events based on game state

// import { getResourceModifiers } from './resourceMapping'; // Currently unused, might need later for event bias

import { ALL_EVENTS } from '../constants/events'; // Import from constants

// Function to check resource conditions (add more as needed)
const checkResourceConditions = (eventConditions, currentResources) => {
    if (!eventConditions || !eventConditions.resources) {
        return true; // No resource conditions to check
    }
    for (const [resource, value] of Object.entries(eventConditions.resources)) {
        // Example: check for minimum resource level (e.g., { light_min: 30 })
        if (resource.endsWith('_min')) {
            const resName = resource.replace('_min', '');
            if (!(resName in currentResources) || currentResources[resName] < value) {
                return false;
            }
        }
        // Add checks for _max, etc. if needed
    }
    return true;
};

/**
 * Checks current game state and determines if any event should be triggered.
 * @param {object} gameState - The current state (e.g., { mode, growthPoints, resources, triggeredEventIds })
 * @returns {object|null} The event object to trigger, or null if none.
 */
export const checkAndTriggerEvent = (gameState) => {
  const { mode, growthPoints, resources, triggeredEventIds = [] } = gameState;

  const potentialEvents = ALL_EVENTS.filter(event => {
    // Check if already triggered
    if (triggeredEventIds.includes(event.id)) {
      return false;
    }

    // Check standard conditions
    const cond = event.conditions;
    if (!cond) return true; // No conditions, always potential

    if (cond.mode && cond.mode !== mode) return false;
    if (cond.growthPointsMin && growthPoints < cond.growthPointsMin) return false;
    if (cond.growthPointsMax && growthPoints > cond.growthPointsMax) return false;
    
    // Check resource conditions
    if (!checkResourceConditions(cond, resources)) {
        return false;
    }

    return true; // All conditions met
  });

  if (potentialEvents.length === 0) {
    return null;
  }

  // --- Simple Trigger Logic --- 
  // TODO: Could prioritize based on mode bias later
  const randomIndex = Math.floor(Math.random() * potentialEvents.length);
  const eventToTrigger = potentialEvents[randomIndex];

  console.log(`Triggering event: ${eventToTrigger.title} (${eventToTrigger.id})`);
  // Return the full event object including options
  return eventToTrigger; 
};

// Removed applyEventEffects - this logic will move to resolveChoice.js / Zustand store 