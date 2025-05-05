import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Remove Privy getAccessToken import if no longer needed here
// import { getAccessToken } from '@privy-io/react-auth';
import { supabase } from '../lib/supabaseClient'; // Import Supabase client
import { PLANET_MODES } from '../utils/resourceMapping'; // Removed getResourceModifiers import as it's not used directly here anymore
import { events } from '../data/events.js'; // Import the new events structure
// Removed import { checkAndTriggerEvent } from '../utils/eventTrigger'; as it's being replaced

// Function to apply effects based on chosen option and its outcome (Success/Fail)
const applyChoiceOutcomeEffects = (currentGameState, outcome) => {
    const stateChanges = {
        // Remove resources field if it's no longer used for specific types
        // resources: {}, // REMOVED or keep if generic resources exist
        growthPoints: 0,
        karma: 0,
        narrative: null,
    };

    if (!outcome) return stateChanges;

    // Apply state changes defined in the outcome
    if (outcome.stateChanges) {
        // Remove resource changes section if specific resources are gone
        // if (outcome.stateChanges.resources) {
        //      for (const [resource, change] of Object.entries(outcome.stateChanges.resources)) {
        //          if (resource in currentGameState.resources) {
        //              stateChanges.resources[resource] = change;
        //          }
        //      }
        // }
        // Apply growth point changes
        if (outcome.stateChanges.growthPoints) {
            stateChanges.growthPoints = outcome.stateChanges.growthPoints;
        }
        // Apply other specific state changes here (e.g., technology, stability)
    }

     // Apply karma change
     if (outcome.karmaChange) {
        stateChanges.karma = outcome.karmaChange;
     }

    // Capture narrative text from the outcome
    if (outcome.narrative) {
        stateChanges.narrative = outcome.narrative;
    }

    console.log("Calculated state changes from outcome:", stateChanges);
    return stateChanges;
};


const usePlanetStore = create(
    persist(
        (set, get) => ({
            // --- Core State ---
            planetName: 'Genesis',
            mode: PLANET_MODES.GLOBAL,
            era: 1,
            turn: 1,
            karma: 50,
            growthPoints: 0,
            walletAddress: null,
            // resources: { // REMOVED specific resources object
            //     water: 70,
            //     light: 70,
            //     air: 70,
            //     ideas: 50,
            // },
            createdAt: Date.now(),
            lastTickTime: Date.now(),
            activeEvent: null,
            triggeredEventKeys: [],
            resolvedEventCount: 0,
            narrativeLog: [],
            isGameFinished: false,

            // --- Actions ---
            setWalletAddress: (address) => set({ walletAddress: address }),

            // --- Rewritten loadPlanetState using Supabase --- 
            loadPlanetState: async (walletAddress) => {
                if (!walletAddress) {
                    console.warn("Cannot load state: No wallet address provided.");
                    return;
                }
                console.log(`Loading state from Supabase for ${walletAddress}...`);
                try {
                    const { data, error } = await supabase
                        .from('planets')
                        .select('karma, narrative_log') // Select only needed fields
                        .eq('wallet_address', walletAddress)
                        .maybeSingle(); // Returns single object or null, not error if not found

                    if (error) {
                        console.error("Error loading planet state from Supabase:", error.message);
                        throw error; // Rethrow if needed elsewhere
                    }

                    if (data) {
                        console.log("Supabase state loaded:", data);
                        set({
                            karma: data.karma,
                            narrativeLog: data.narrative_log || [], // Ensure it's an array
                        });
                    } else {
                        console.log("No saved state found in Supabase for this address. Using defaults.");
                        // Optional: Explicitly reset to defaults if needed, 
                        // but initial state should handle this.
                        // set({ karma: 50, narrativeLog: [] });
                    }
                } catch (error) {
                     console.error("Caught error during state loading:", error);
                }
            },
            // --- End rewritten loadPlanetState ---

            // --- Rewritten savePlanetState using Supabase --- 
            savePlanetState: async () => {
                 const { walletAddress, karma, narrativeLog } = get();
                 if (!walletAddress) {
                     console.warn("Cannot save state: No wallet address set.");
                     return;
                 }

                 console.log(`Saving state to Supabase for ${walletAddress}...`);

                 try {
                     // Use upsert to insert or update based on the primary key (walletAddress)
                     const { data, error } = await supabase
                         .from('planets')
                         .upsert({
                             wallet_address: walletAddress,
                             karma: karma,
                             narrative_log: narrativeLog,
                             // last_updated_at is handled by DB trigger/default
                         })
                         .select(); // Optionally select the result

                     if (error) {
                         console.error("Error saving planet state to Supabase:", error.message);
                         // Handle specific errors like RLS violation if necessary
                         if (error.code === '42501') { // Example: RLS violation code
                            console.error("Row Level Security policy prevented the save operation.");
                         }
                         throw error;
                     }

                     console.log("State saved successfully to Supabase:", data);

                 } catch (error) {
                     console.error("Caught error during state saving:", error);
                 }
             },
            // --- End rewritten savePlanetState ---

            initializePlanet: (chosenMode) => {
                // const initialResources = { water: 70, light: 70, air: 70, ideas: 50 }; // REMOVED
                set({
                    planetName: `Planet-${Math.random().toString(36).substring(2, 7)}`,
                    mode: chosenMode,
                    era: 1,
                    turn: 1,
                    karma: 50,
                    growthPoints: 0,
                    // resources: { ...initialResources }, // REMOVED
                    createdAt: Date.now(),
                    lastTickTime: Date.now(),
                    activeEvent: null,
                    triggeredEventKeys: [],
                    resolvedEventCount: 0,
                    narrativeLog: [`Planet ${chosenMode} initialized. Era: 1, Turn: 1, Karma: 50`],
                    isGameFinished: false,
                });
                console.log(`Planet initialized in ${chosenMode} mode.`);
            },

            incrementTurn: () => {
                 if (get().isGameFinished || get().activeEvent) return;

                 const currentTurn = get().turn;
                 const newTurn = currentTurn + 1;
                 // Add era advancement logic here if needed
                 // const currentEra = get().era;
                 // const newEra = checkEraAdvancement(newTurn, currentEra, get());

                 set({ turn: newTurn /* , era: newEra */ });
                 console.log(`Turn advanced to: ${newTurn}`);

                 // Automatically try to trigger an event after incrementing the turn
                 get().triggerNextEvent();
            },

            // REFACTORED Action to trigger the next available event using the new structure
            triggerNextEvent: () => {
                 const state = get();
                 if (state.isGameFinished || state.activeEvent) return;

                 console.log(`Checking for eligible events for Era ${state.era}, Turn ${state.turn}, Karma ${state.karma}`);

                 let eligibleEvent = null;
                 const availableEvents = Object.values(events); // Get all events as an array

                 // Find the first eligible event that hasn't been triggered yet
                 for (const event of availableEvents) {
                     const isEraMatch = event.era === state.era;
                     const isKarmaMatch = state.karma >= event.karmaLevel[0] && state.karma <= event.karmaLevel[1];
                     const isTurnMatch = state.turn >= event.turns[0] && state.turn <= event.turns[1];
                     // Optional: Check if already triggered (using triggeredEventKeys now)
                     // const isAlreadyTriggered = state.triggeredEventKeys.includes(event.eventKey);

                     if (isEraMatch && isKarmaMatch && isTurnMatch /* && !isAlreadyTriggered */) {
                         eligibleEvent = event;
                         break; // Found one, stop searching (simple strategy)
                     }
                 }

                 if (eligibleEvent) {
                      console.log("Triggering event:", eligibleEvent.title);
                      set({
                           activeEvent: eligibleEvent, // Store the full event object
                           // Add the key to triggered list to prevent immediate repeat
                           // triggeredEventKeys: [...state.triggeredEventKeys, eligibleEvent.eventKey]
                      });
                 } else {
                      console.log("No eligible events found to trigger for the current state.");
                      // Optionally add a message to the narrative log
                      // set(prevState => ({ narrativeLog: [...prevState.narrativeLog, "The winds are calm, no major events stir."] }));
                 }
            },

            // Add resources manually // REMOVED addResource action
            // addResource: (resourceType, amount) => {
            //     set((state) => ({
            //         resources: {
            //             ...state.resources,
            //             [resourceType]: Math.max(0, (state.resources[resourceType] || 0) + amount),
            //         },
            //     }));
            // },

            // Action to handle user choice on an event - REFACTORED for new structure
             resolveEvent: (chosenOption) => {
                const state = get();
                if (!state.activeEvent || state.isGameFinished) return;

                console.log("Resolving event:", state.activeEvent.title, "with option:", chosenOption.id);

                const randomChance = Math.random() * 100;
                let outcome;
                if (randomChance < chosenOption.success.probability) {
                    outcome = chosenOption.success;
                    console.log("Outcome: Success");
                } else {
                    outcome = chosenOption.failed;
                    console.log("Outcome: Failed");
                }

                const stateChanges = applyChoiceOutcomeEffects(state, outcome);

                // Apply the calculated changes
                // const updatedResources = { ...state.resources }; // REMOVED
                // if (stateChanges.resources) { // REMOVED
                //     Object.entries(stateChanges.resources).forEach(([res, change]) => {
                //         updatedResources[res] = Math.max(0, (updatedResources[res] || 0) + change);
                //     });
                // }
                const newGrowthPoints = state.growthPoints + stateChanges.growthPoints;
                const newKarma = state.karma + stateChanges.karma;
                const newNarrativeLog = [...state.narrativeLog];
                if(stateChanges.narrative) {
                    newNarrativeLog.push(`[${state.activeEvent.title} - Opt ${chosenOption.id}] ${stateChanges.narrative} (Karma ${stateChanges.karma > 0 ? '+' : ''}${stateChanges.karma})`);
                }
                const newResolvedEventCount = state.resolvedEventCount + 1;
                const resolvedEventKey = state.activeEvent.eventKey;

                set({
                    activeEvent: null,
                    // resources: updatedResources, // REMOVED
                    growthPoints: newGrowthPoints,
                    karma: newKarma,
                    narrativeLog: newNarrativeLog,
                    resolvedEventCount: newResolvedEventCount,
                    triggeredEventKeys: [...state.triggeredEventKeys, resolvedEventKey]
                });

                console.log("Event resolved. New State:", { karma: newKarma, resolvedCount: newResolvedEventCount });
                get().savePlanetState();
            },

            // Action to explicitly end the game
            finishGame: () => {
                set({ isGameFinished: true });
                console.log("Game Finished!");
            },

            // --- Add back the tick action ---
            tick: () => {
                if (get().isGameFinished || get().activeEvent) return; // Don't tick if paused/ended

                const now = Date.now();
                const timeElapsed = now - get().lastTickTime;

                // Add any time-based logic here in the future (e.g., resource decay?)
                // For now, just update the last tick time.

                set({ lastTickTime: now });

                // Optional: console.log("Tick:", timeElapsed);
            }
            // --- End tick action ---

        }),
        {
            name: 'planetary-pet-storage-v2',
        }
    )
);

export default usePlanetStore; 