import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Remove Privy getAccessToken import if no longer needed here
// import { getAccessToken } from '@privy-io/react-auth';
import { supabase } from '../lib/supabaseClient'; // Import Supabase client
import { PLANET_MODES } from '../utils/resourceMapping'; // Removed getResourceModifiers import as it's not used directly here anymore
import { events } from '../data/events.js'; // Import the new events structure
// Line below was causing syntax error, removed. Event triggering is refactored.
// import { checkAndTriggerEvent } from '../utils/eventTrigger'; as it's being replaced 

// Define initial state values outside the main function for clarity and reuse
const initialGameState = {
    planetName: 'Genesis', 
    mode: PLANET_MODES.GLOBAL, // Default mode
    era: 1,
    turn: 1,
    karma: 20,
    growthPoints: 0,
    activeEvent: null,
    triggeredEventKeys: [],
    resolvedEventCount: 0,
    narrativeLog: [], // Start with an empty log
    isGameFinished: false,
    isEventPopupOpen: false, // Tracks if the popup UI is currently open
    hasPendingEvent: false, // Tracks if an event is waiting to be shown
    isFlowEffectActive: false, // New state for FlowEffect
};

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
            // --- Core State --- Spread initial state here for defaults ---
            ...initialGameState, 
            // --- Overwrite specific initial values if needed ---
            walletAddress: null, 
            createdAt: Date.now(),
            lastTickTime: Date.now(),

            // --- Actions ---
            setWalletAddress: (address) => set({ walletAddress: address }),

            // --- Action to reset the game state --- 
            resetPlanetState: () => {
                const now = Date.now();
                const newPlanetName = `Planet-${Math.random().toString(36).substring(2, 7)}`;
                set({
                    ...initialGameState, // Reset to initial values defined above
                    planetName: newPlanetName, // Give a new random name
                    createdAt: now,
                    lastTickTime: now,
                    narrativeLog: [`Planet state reset (${newPlanetName}). Welcome back.`], // Add an initial log entry
                    // walletAddress is intentionally not reset here
                    // Also reset minimized state
                    isEventPopupOpen: false, 
                    hasPendingEvent: false, // Reset pending event flag
                    isFlowEffectActive: false, // Reset FlowEffect state
                });
                console.log("Zustand planet state has been reset.");
                // Optionally: Trigger save immediately after reset?
                // get().savePlanetState(); 
            },

            // --- Rewritten loadPlanetState using Supabase --- 
            loadPlanetState: async (walletAddress) => {
                if (!walletAddress) {
                    console.warn("Cannot load state: No wallet address provided.");
                    // Reset to initial state if no address (or handle as needed)
                    get().resetPlanetState(); 
                    return;
                }
                console.log(`Loading state from Supabase for ${walletAddress}...`);
                try {
                    const { data, error } = await supabase
                        .from('planets')
                        .select('karma, narrative_log, resolved_event_count, is_game_finished') // Select fields needed for state
                        .eq('wallet_address', walletAddress)
                        .maybeSingle(); // Returns single object or null

                    if (error) {
                        console.error("Error loading planet state from Supabase:", error.message);
                         // If loading fails, reset to initial state
                        get().resetPlanetState(); 
                        throw error;
                    }

                    if (data) {
                        console.log("Supabase state loaded:", data);
                        set({
                            // Set state from loaded data, providing defaults if null/undefined
                            karma: data.karma ?? initialGameState.karma,
                            narrativeLog: data.narrative_log ?? initialGameState.narrativeLog,
                            resolvedEventCount: data.resolved_event_count ?? initialGameState.resolvedEventCount,
                            isGameFinished: data.is_game_finished ?? initialGameState.isGameFinished,
                             // Keep other parts of state as they were unless loaded
                        });
                    } else {
                        console.log("No saved state found in Supabase for this address. Resetting to defaults.");
                         // Reset to initial state if no data found
                        get().resetPlanetState(); 
                    }
                } catch (error) {
                     console.error("Caught error during state loading, resetting state:", error);
                     // Reset state on any other caught error during loading
                     get().resetPlanetState();
                }
            },
            // --- End rewritten loadPlanetState ---

            // --- Rewritten savePlanetState using Supabase --- 
            savePlanetState: async () => {
                 // Include is_game_finished and resolved_event_count in save
                 const { walletAddress, karma, narrativeLog, isGameFinished, resolvedEventCount } = get(); 
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
                             is_game_finished: isGameFinished, // Save game finished status
                             resolved_event_count: resolvedEventCount, // Save resolved count
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
                // Get a new name and timestamp
                 const now = Date.now();
                 const newPlanetName = `Planet-${Math.random().toString(36).substring(2, 7)}`;
                set({
                    ...initialGameState, // Start with defaults
                    planetName: newPlanetName,
                    mode: chosenMode,
                    createdAt: now,
                    lastTickTime: now,
                    narrativeLog: [`Planet ${newPlanetName} (${chosenMode}) initialized. Era: 1, Turn: 1, Karma: 50`],
                    // isGameFinished is already false in initialGameState
                });
                console.log(`Planet initialized in ${chosenMode} mode.`);
                // Save initial state after creation
                 get().savePlanetState();
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
            }, // Closing brace for incrementTurn was missing

            // REFACTORED Action to trigger the next available event using the new structure
            triggerNextEvent: () => {
                 const state = get();
                 if (state.isGameFinished || state.activeEvent) return;

                 console.log(`Checking for eligible events for Era ${state.era}, Turn ${state.turn}, Karma ${state.karma}`);

                 let eligibleEvent = null;
                 const availableEvents = Object.values(events); // Get all events as an array

                 // Find the first eligible event that hasn't been triggered yet
                 for (const event of availableEvents) {
                     const isEraMatch = !event.era || event.era === state.era; // Allow events without era constraint
                     const isKarmaMatch = !event.karmaLevel || (state.karma >= event.karmaLevel[0] && state.karma <= event.karmaLevel[1]);
                     const isTurnMatch = !event.turns || (state.turn >= event.turns[0] && state.turn <= event.turns[1]);
                     // Ensure eventKey exists before checking triggered list
                     const isAlreadyTriggered = event.eventKey && state.triggeredEventKeys.includes(event.eventKey); 

                     // Trigger if matches AND not already triggered
                     if (isEraMatch && isKarmaMatch && isTurnMatch && !isAlreadyTriggered) {
                         eligibleEvent = event;
                         break; // Found one, stop searching (simple strategy)
                     }
                 }

                 if (eligibleEvent) {
                      console.log("Triggering event:", eligibleEvent.title, "(Key:", eligibleEvent.eventKey, ")");
                       set({
                            activeEvent: eligibleEvent, // Store the full event object
                            hasPendingEvent: true, // Indicate an event is waiting
                            isEventPopupOpen: false, // Ensure popup isn't open yet
                       });
                      console.log("[triggerNextEvent] Set activeEvent:", eligibleEvent?.title, "(Pending notification)");
                 } else {
                      console.log("No eligible events found to trigger for the current state.");
                      // Optionally add a message to the narrative log
                      // set(prevState => ({ narrativeLog: [...prevState.narrativeLog, "The winds are calm, no major events stir."] }));
                 }
            }, // Closing brace for triggerNextEvent

            // Action to handle user choice on an event - REFACTORED for new structure
             resolveEvent: (chosenOption) => {
                const state = get();
                if (!state.activeEvent || state.isGameFinished) return;

                // --- DETAILED LOGGING --- 
                console.log("[resolveEvent] Called. Current activeEvent:", state.activeEvent?.title);
                console.log("[resolveEvent] Chosen Option:", chosenOption);
                // --- END LOGGING --- 

                 // If no option chosen (e.g., auto-resolve event), treat as default success/no specific outcome
                 let outcome;
                 if (chosenOption) {
                    const randomChance = Math.random() * 100;
                    if (randomChance < (chosenOption.success?.probability ?? 100)) { // Default to 100% success if not specified
                        outcome = chosenOption.success;
                        console.log("Outcome: Success");
                    } else {
                        outcome = chosenOption.failed;
                        console.log("Outcome: Failed");
                    }
                 } else {
                     // Handle events without options or auto-resolve logic
                     outcome = state.activeEvent.defaultOutcome || {}; // Use a default outcome if defined, else empty
                     console.log("Outcome: Auto-resolved or No option chosen");
                 }


                const stateChanges = applyChoiceOutcomeEffects(state, outcome);

                // Apply the calculated changes
                const newGrowthPoints = state.growthPoints + stateChanges.growthPoints;
                const newKarma = state.karma + stateChanges.karma;
                const newNarrativeLog = [...state.narrativeLog];
                if(stateChanges.narrative) {
                    // Add option ID if available
                    const optionIdText = chosenOption ? ` - Opt ${chosenOption.id}` : ''; 
                    newNarrativeLog.push(`[${state.activeEvent.title}${optionIdText}] ${stateChanges.narrative} (Karma ${stateChanges.karma > 0 ? '+' : ''}${stateChanges.karma})`);
                } else if (!chosenOption) {
                    // Log something for auto-resolve if no narrative provided
                     newNarrativeLog.push(`[${state.activeEvent.title}] Event period concluded.`);
                }
                
                const newResolvedEventCount = state.resolvedEventCount + 1;
                const resolvedEventKey = state.activeEvent.eventKey; // Get key before clearing activeEvent
                
                let activateFlowEffect = false;
                // IMPORTANT: Replace 'option1' with the actual ID or a distinguishing property 
                // of the choice that should trigger the FlowEffect.
                // For example, if your chosenOption object has a specific `effectType` or `name`:
                // if (chosenOption && chosenOption.id === 'option1_id_from_event_data') {
                if (chosenOption && chosenOption.id === 'option1') { 
                    console.log("[resolveEvent] Option 1 chosen, activating FlowEffect.");
                    activateFlowEffect = true;
                }

                set({
                    activeEvent: null,
                    growthPoints: newGrowthPoints,
                    karma: newKarma,
                    narrativeLog: newNarrativeLog,
                    resolvedEventCount: newResolvedEventCount,
                    triggeredEventKeys: resolvedEventKey ? [...state.triggeredEventKeys, resolvedEventKey] : state.triggeredEventKeys, 
                    isEventPopupOpen: false, // Close popup after resolving
                    hasPendingEvent: false, // Clear pending flag
                    isFlowEffectActive: activateFlowEffect, // Set FlowEffect state
                });

                console.log("Event resolved. New State:", { karma: newKarma, resolvedCount: newResolvedEventCount });
                get().savePlanetState(); // Save state after resolving

                // If FlowEffect was activated, set a timeout to deactivate it
                if (activateFlowEffect) {
                    setTimeout(() => {
                        set({ isFlowEffectActive: false });
                        console.log("[resolveEvent] FlowEffect automatically deactivated after 5 seconds.");
                    }, 5000); // Deactivate after 5 seconds (adjust as needed)
                }
            }, // Closing brace for resolveEvent

            // Action to explicitly end the game
            finishGame: () => {
                 if (get().isGameFinished) return; // Prevent multiple calls
                set({ isGameFinished: true });
                console.log("Game Finished!");
                get().savePlanetState(); // Save the final finished state
            }, // Closing brace for finishGame

            // --- Add back the tick action ---
            tick: () => {
                if (get().isGameFinished || get().activeEvent) return; // Don't tick if paused/ended

                const now = Date.now();
                const timeElapsed = now - get().lastTickTime;

                // Add any time-based logic here in the future (e.g., resource decay?)
                // For now, just update the last tick time.

                set({ lastTickTime: now });
                
                // --- Check for event trigger on tick ---
                // Decide if events should trigger on tick or only on turn increment.
                // If on tick, uncomment below:
                // get().triggerNextEvent(); 

                // Optional: console.log("Tick:", timeElapsed);
            }, // Closing brace for tick action ---

            // --- Actions for Event Popup State ---
            maximizeEventPopup: () => {
                if (get().activeEvent) { // Only open if there is an event to show
                   set({ isEventPopupOpen: true, hasPendingEvent: false });
                   console.log("Event popup opened/maximized.");
                } else {
                    console.log("Tried to open event popup, but no active event.");
                }
            },
            minimizeEventPopup: () => {
                set({ isEventPopupOpen: false });
                console.log("Event popup closed/minimized.");
            }
            // --- End Popup State Actions ---

        }), // Closing parenthesis for the main state object
        { // Persist configuration
            name: 'planetary-pet-storage-v3', // Consider changing name if schema changed significantly
            // Optionally specify parts of the state to persist or ignore
            // partialize: (state) => ({ ... }), 
            // onRehydrateStorage: (state) => {
            //   console.log("hydration starts");
            //   return (state, error) => {
            //     if (error) {
            //       console.log("an error happened during hydration", error);
            //     } else {
            //       console.log("hydration finished");
            //     }
            //   };
            // },
        }
    ) // Closing parenthesis for persist
); // Closing parenthesis for create

export default usePlanetStore;
