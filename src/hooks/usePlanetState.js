import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Remove Privy getAccessToken import if no longer needed here
// import { getAccessToken } from '@privy-io/react-auth';
import { supabase } from '../lib/supabaseClient'; // Import Supabase client
import { PLANET_MODES } from '../utils/resourceMapping'; // Removed getResourceModifiers import as it's not used directly here anymore
import { events } from '../data/events.js'; // Import the new events structure
import { baseEvents } from '../data/baseEvents.js'; // Import base events
import { EVENTS_TO_FINISH } from '../constants/events'; // Import EVENTS_TO_FINISH
// Line below was causing syntax error, removed. Event triggering is refactored.
// import { checkAndTriggerEvent } from '../utils/eventTrigger'; as it's being replaced 

// Define initial state values outside the main function for clarity and reuse
const initialGameState = {
    planetName: 'Genesis', 
    game_mode: PLANET_MODES.GLOBAL, // Default mode
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
    currentView: 'main_planet', // New state for current view
    hasBaseIntroBeenCompleted: false, // <-- New state for Base Intro completion
    hasSeenBaseEventTriggerDialogEver: false, // <-- New state for one-time dialog
    hasEarnedBaseCompletionBadge: false, // <-- New state for badge earned
    showBaseCompletionPopup: false, // <-- New state for showing badge popup
    dataWaveTriggerCount: 0, // Counter for data wave triggers
    isPlanetDataLoaded: false, // <-- New state for tracking planet data loading
};

// Function to apply effects based on chosen option and its outcome (Success/Fail)
const applyChoiceOutcomeEffects = (currentGameState, outcome) => {
    const stateChanges = {
        growthPoints: 0,
        karma: 0,
        narrative: null,
        hashtag: null, // Ensure hashtag is initialized
    };

    if (!outcome) return stateChanges;

    // Apply state changes defined in the outcome (e.g., growthPoints)
    if (outcome.stateChanges) {
        if (outcome.stateChanges.growthPoints) {
            stateChanges.growthPoints = outcome.stateChanges.growthPoints;
        }
    }

    // Apply karma change
    if (outcome.karmaChange) {
        stateChanges.karma = outcome.karmaChange;
    }

    // Capture narrative text from the outcome
    if (outcome.result_zh) { // For Base Events
        stateChanges.narrative = outcome.result_zh;
    } else if (outcome.narrative) { // For Main Events
        stateChanges.narrative = outcome.narrative;
    }

    // Capture hashtag from the outcome
    if (outcome.hashtag_zh) { // For Base Events (from success/failed outcome)
        stateChanges.hashtag = outcome.hashtag_zh;
    } else if (currentGameState.activeEvent && currentGameState.activeEvent.options && currentGameState.activeEvent.options.find(opt => opt.id === outcome.optionId)?.hashtag) {
        // For Main Events, try to get hashtag from the chosen option itself if outcome doesn't have one directly
        // This assumes outcome object will have an 'optionId' if it's from a main event option choice
        const chosenOption = currentGameState.activeEvent.options.find(opt => opt.id === outcome.optionId);
        if (chosenOption && chosenOption.hashtag) {
            stateChanges.hashtag = chosenOption.hashtag;
        }
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
            coinbaseProvider: null, // New state for Coinbase Provider
            coinbaseAccount: null, // New state for Coinbase Account
            walletAddress: null, 
            createdAt: Date.now(),
            lastTickTime: Date.now(),

            // --- Actions ---
            setWalletAddress: (address) => set({ walletAddress: address }),
            setCoinbaseProvider: (provider) => set({ coinbaseProvider: provider }),
            setCoinbaseAccount: (account) => set({ coinbaseAccount: account, walletAddress: account }), // Update walletAddress here
            clearCoinbaseConnection: () => set({ coinbaseProvider: null, coinbaseAccount: null, walletAddress: null }), // Action to clear connection
            setCurrentView: (view) => set(state => {
                console.log(`Setting current view from ${state.currentView} to ${view}`);
                let newMode = state.game_mode;
                if (view === 'base_planet') {
                    newMode = PLANET_MODES.BASE;
                } else if (view === 'main_planet') {
                    // When returning to main_planet, set its mode. 
                    // Assuming GLOBAL is the primary mode for main_planet view.
                    // If main_planet can have multiple modes (e.g. GLOBAL, INTERNATIONAL) and you want to remember the last one,
                    // you'd need another state variable like 'lastMainPlanetMode'.
                    newMode = PLANET_MODES.GLOBAL; 
                }
                // Other views like 'base_intro' don't necessarily change the underlying planet mode directly.

                return {
                    currentView: view,
                    activeEvent: null, // Clear events on any view change
                    isEventPopupOpen: false,
                    hasPendingEvent: false,
                    game_mode: newMode, // Set the correct mode for the view
                };
            }), 

            setBaseIntroCompleted: (completed) => set({ hasBaseIntroBeenCompleted: completed }), // <-- Action to set completion

            setHasSeenBaseEventTriggerDialogEver: (seen) => set({ hasSeenBaseEventTriggerDialogEver: seen }), // <-- Action for new state

            earnBaseCompletionBadge: () => {
                set((state) => ({
                    hasEarnedBaseCompletionBadge: true,
                    showBaseCompletionPopup: true,
                    narrativeLog: [...state.narrativeLog, "[历史模拟] 恭喜！已完成基地历史模拟并获得成就徽章！"], // Add log entry
                }));
                get().savePlanetState(); // Immediately save the updated state
            },

            closeBaseCompletionPopup: () => set({ showBaseCompletionPopup: false }),

            // --- Action to reset the game state --- 
            resetPlanetState: () => {
                const now = Date.now();
                set({
                    ...initialGameState, // Reset to initial values defined above
                    planetName: `Planet-${Math.random().toString(36).substring(2, 7)}`, // Always give a new random name on full reset
                    createdAt: now,
                    lastTickTime: now,
                    narrativeLog: [`Planet state reset. Welcome back.`], // Add an initial log entry (simplified name for reset log)
                    isEventPopupOpen: false, 
                    hasPendingEvent: false, 
                    isFlowEffectActive: false, 
                    currentView: 'main_planet', 
                    hasBaseIntroBeenCompleted: false, // Also reset this on full game reset
                    hasSeenBaseEventTriggerDialogEver: false, // Also reset this
                    hasEarnedBaseCompletionBadge: false, // <-- Reset badge earned
                    showBaseCompletionPopup: false, // <-- Reset badge popup show state
                 });
                 console.log("Zustand planet state has been reset to initial.");
                 // Note: This reset does NOT auto-save. Saving happens on load or subsequent actions.
            },

            // --- Rewritten loadPlanetState using Supabase --- 
            loadPlanetState: async (walletAddress) => {
                set({ isPlanetDataLoaded: false }); // Set loading to false at the start
                if (!walletAddress) {
                    console.warn("Cannot load state: No wallet address provided.");
                    // Reset to initial state if no address (or handle as needed)
                    get().resetPlanetState(); // This will also set isPlanetDataLoaded to false via initialGameState
                    return;
                }
                console.log(`Loading state from Supabase for ${walletAddress}...`);
                try {
                    const { data, error } = await supabase
                        .from('planets')
                        .select('karma, narrative_log, resolved_event_count, is_game_finished, game_mode, era, turn, growth_points, planet_name, triggered_event_keys, earned_base_badge') // Load more complete state including badge
                        .eq('wallet_address', walletAddress)
                        .maybeSingle(); // Returns single object or null

                    if (error) {
                        console.error("Error loading planet state from Supabase:", error.message);
                         // If loading fails, reset to initial state
                        get().resetPlanetState(); // This will also set isPlanetDataLoaded to false
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
                            game_mode: data.game_mode ?? initialGameState.game_mode,
                            era: data.era ?? initialGameState.era,
                            turn: data.turn ?? initialGameState.turn,
                            growthPoints: data.growth_points ?? initialGameState.growthPoints,
                            planetName: data.planet_name ?? initialGameState.planetName, // Load name from DB, default to initial if null
                            triggeredEventKeys: data.triggered_event_keys ?? initialGameState.triggeredEventKeys,
                            hasEarnedBaseCompletionBadge: data.earned_base_badge ?? initialGameState.hasEarnedBaseCompletionBadge, // Load badge state
                            isPlanetDataLoaded: true, // Data loaded successfully
                            // currentView will be reset or handled by navigation logic, not loaded from DB for now
                        });
                        console.log("Supabase state loaded and Zustand state updated:", { game_mode: get().game_mode, isPlanetDataLoaded: true }); // Add confirmation log

                        // --- IMPORTANT: Add this line ---
                        // Only switch view after data is loaded and state is set
                        set({ currentView: 'main_planet' });
                        console.log("Setting currentView to 'main_planet' after state load.");
                        // ---------------------------------

                    } else {
                        console.log("No saved state found in Supabase for this address. Generating new planet and saving initial state.");
                        // No data found, initialize with a NEW random name and initial state, then save.
                        const newPlanetName = `Planet-${Math.random().toString(36).substring(2, 7)}`;
                        const now = Date.now();
                        set({
                            ...initialGameState, // Keep spreading for other defaults
                            game_mode: initialGameState.game_mode, // <-- Explicitly set game_mode here
                            planetName: newPlanetName, // Assign the new random name
                            walletAddress: walletAddress, // Ensure wallet address is set in state
                            createdAt: now,
                            lastTickTime: now,
                            narrativeLog: [`Planet ${newPlanetName} initialized for ${walletAddress.substring(0, 6)}...`], // Log entry
                            isPlanetDataLoaded: true, // Data initialized and ready
                        });
                        // Immediately save this newly initialized state
                        get().savePlanetState();

                        // --- IMPORTANT: Add this line ---
                        set({ currentView: 'main_planet' });
                        console.log("Setting currentView to 'main_planet' after new state initialization.");
                        // ---------------------------------
                    }
                } catch (error) {
                     console.error("Caught error during state loading, resetting state:", error);
                     // Reset state on any other caught error during loading
                     get().resetPlanetState(); // This will also set isPlanetDataLoaded to false
                }
            },
            // --- End rewritten loadPlanetState ---

            // --- Rewritten savePlanetState using Supabase --- 
            savePlanetState: async () => {
                 // Include is_game_finished and resolved_event_count in save
                 const { walletAddress, karma, narrativeLog, isGameFinished, resolvedEventCount, game_mode, era, turn, growthPoints, planetName, triggeredEventKeys, hasEarnedBaseCompletionBadge } = get(); 
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
                             game_mode: game_mode,
                             era: era,
                             turn: turn,
                             growth_points: growthPoints,
                             planet_name: planetName,
                             triggered_event_keys: triggeredEventKeys,
                             earned_base_badge: hasEarnedBaseCompletionBadge, // Save badge state
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
                const now = Date.now();
                const newPlanetName = `Planet-${Math.random().toString(36).substring(2, 7)}`;
                set({
                    // Explicitly set fields instead of spreading all of initialGameState
                    // to preserve global progress like triggeredEventKeys and resolvedEventCount across mode initializations.
                    planetName: newPlanetName,
                    game_mode: chosenMode,
                    era: initialGameState.era, // Reset era for the new mode
                    turn: initialGameState.turn, // Reset turn for the new mode
                    karma: initialGameState.karma, // Reset karma or set to a mode-specific start
                    growthPoints: initialGameState.growthPoints, // Reset growth points
                    activeEvent: null, // Clear active event
                    isEventPopupOpen: false,
                    hasPendingEvent: false,
                    isFlowEffectActive: false, 
                    // narrativeLog: [`Planet ${newPlanetName} (${chosenMode}) initialized. Era: 1, Turn: 1, Karma: 50`], // Log entry might be better handled in calling context or based on new/existing
                    // Keep existing narrativeLog, resolvedEventCount, triggeredEventKeys, walletAddress
                    createdAt: now, // Update createdAt to signify re-initialization for this mode context
                    lastTickTime: now,
                    currentView: chosenMode === PLANET_MODES.BASE ? 'base_planet' : 'main_planet',
                });
                console.log(`Planet initialized in ${chosenMode} mode. Critical gameplay states like overall resolved events and triggered keys are preserved.`);
                // Save state after this specific type of initialization
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
                 // Use the correct event source based on game_mode
                 const sourceEvents = state.game_mode === PLANET_MODES.BASE ? baseEvents : events; // Choose source based on mode
                 const availableEvents = Object.values(sourceEvents); // Get all events as an array from the selected source

                 // Find the first eligible event that hasn't been triggered yet
                 for (const event of availableEvents) {
                     // Ensure event has necessary properties before checking conditions
                     if (!event || !event.eventKey) continue; // Skip if event object is invalid

                     const isEraMatch = !event.era || event.era === state.era; // Allow events without era constraint
                     const isKarmaMatch = !event.karmaLevel || (state.karma >= event.karmaLevel[0] && state.karma <= event.karmaLevel[1]);
                     const isTurnMatch = !event.turns || (state.turn >= event.turns[0] && state.turns <= event.turns[1]); // Corrected to use state.turns
                     // Ensure eventKey exists before checking triggered list
                     const isAlreadyTriggered = state.triggeredEventKeys.includes(event.eventKey); 

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
            }, // End of triggerNextEvent

            triggerSpecificEvent: (eventKey) => {
                const state = get();
                if (state.isGameFinished || state.activeEvent) {
                    console.log("Cannot trigger specific event: Game finished or an event is already active.");
                    return;
                }

                let eventToTrigger = null;

                // Check main events first if not in BASE mode
                if (state.game_mode !== PLANET_MODES.BASE) {
                     eventToTrigger = events[eventKey]; // Check in imported 'events' object
                     if (eventToTrigger) {
                         console.log(`Specific event found in main events: ${eventKey}`);
                     }
                }

                // If not found in main events or in BASE mode, check base events
                if (!eventToTrigger) {
                    eventToTrigger = baseEvents[eventKey]; // Check in imported 'baseEvents' object
                    if (eventToTrigger) {
                        console.log(`Specific event found in base events: ${eventKey}`);
                    }
                }


                if (eventToTrigger) {
                    console.log(`Triggering specific event: ${eventKey}`);
                    set({
                        activeEvent: { ...eventToTrigger, eventKey: eventKey }, // Ensure eventKey is part of activeEvent
                        isEventPopupOpen: true,
                        isEventPopupMinimized: false,
                        hasPendingEvent: false, // Clear any pending event flag
                        narrativeLog: [...state.narrativeLog, `Event triggered: ${eventToTrigger.title || eventKey}`],
                    });
                } else {
                    console.warn(`Specific event not found in any source: ${eventKey}`);
                }
            },

            // REFACTORED resolveEvent to use the new event structure and applyChoiceOutcomeEffects
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
                        outcome = { ...chosenOption.success, optionId: chosenOption.id }; // Add optionId
                        console.log("Outcome: Success");
                    } else {
                        outcome = { ...chosenOption.failed, optionId: chosenOption.id }; // Add optionId
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

                if (chosenOption && stateChanges.narrative) {
                    // More detailed log for chosen option and its outcome
                    const chosenOptionText = chosenOption.description_zh || chosenOption.id;
                    const outcomeNarrative = stateChanges.narrative;
                    const outcomeHashtag = stateChanges.hashtag ? ` ${stateChanges.hashtag}` : "";
                    const karmaChangeText = stateChanges.karma !== 0 ? ` (Karma ${stateChanges.karma > 0 ? '+' : ''}${stateChanges.karma})` : "";
                    newNarrativeLog.push(`[${state.activeEvent.title}] Chose: "${chosenOptionText}". Result: "${outcomeNarrative}"${outcomeHashtag}${karmaChangeText}`);
                } else if (stateChanges.narrative) {
                    // Log for events that might auto-resolve or have a narrative without distinct options shown to user before resolving
                    const outcomeNarrative = stateChanges.narrative;
                    const outcomeHashtag = stateChanges.hashtag ? ` ${stateChanges.hashtag}` : "";
                    const karmaChangeText = stateChanges.karma !== 0 ? ` (Karma ${stateChanges.karma > 0 ? '+' : ''}${stateChanges.karma})` : "";
                    newNarrativeLog.push(`[${state.activeEvent.title}] Outcome: "${outcomeNarrative}"${outcomeHashtag}${karmaChangeText}`);
                } else if (!chosenOption) {
                     newNarrativeLog.push(`[${state.activeEvent.title}] Event period concluded.`);
                }
                
                const newResolvedEventCount = state.resolvedEventCount + 1;
                const resolvedEventKey = state.activeEvent.eventKey; 
                const nextEventKeyFromCurrent = state.activeEvent.nextEventKey; 
                
                let activateFlowEffect = false;
                // IMPORTANT: Replace 'option1' with the actual ID or a distinguishing property 
                // of the choice that should trigger the FlowEffect.
                // For example, if your chosenOption object has a specific `effectType` or `name`:
                // if (chosenOption && chosenOption.id === 'option1_id_from_event_data') {
                if (chosenOption && chosenOption.id === 'option1') { 
                    console.log("[resolveEvent] Option 1 chosen, activating FlowEffect.");
                    activateFlowEffect = true;
                }

                set(prevState => ({
                    activeEvent: null, 
                    growthPoints: newGrowthPoints,
                    karma: newKarma,
                    narrativeLog: newNarrativeLog,
                    resolvedEventCount: newResolvedEventCount,
                    triggeredEventKeys: resolvedEventKey ? [...prevState.triggeredEventKeys, resolvedEventKey] : prevState.triggeredEventKeys, 
                    isEventPopupOpen: false, 
                    hasPendingEvent: false, 
                    isFlowEffectActive: activateFlowEffect,
                }));

                console.log("Event resolved. New State:", { karma: newKarma, resolvedCount: newResolvedEventCount, era: get().era, turn: get().turn });
                get().savePlanetState(); 

                // After current event is resolved and state updated, check for next event OR badge
                if (resolvedEventKey === 'BASE_SPRING_04') { // Check if the resolved event was the last in sequence
                    console.log("Completed BASE_SPRING_04, earning completion badge.");
                    get().earnBaseCompletionBadge();
                } else if (nextEventKeyFromCurrent && state.currentView === 'base_planet') {
                    const nextEventToTrigger = baseEvents[nextEventKeyFromCurrent];
                    if (nextEventToTrigger) {
                        console.log(`Auto-triggering next event in sequence: ${nextEventKeyFromCurrent}`);
                        // Use a brief timeout to allow UI to settle before showing the next event
                        setTimeout(() => {
                            set({
                                activeEvent: { ...nextEventToTrigger, eventKey: nextEventKeyFromCurrent },
                                isEventPopupOpen: true,
                                isEventPopupMinimized: false,
                                hasPendingEvent: false,
                                narrativeLog: [...get().narrativeLog, `Event triggered: ${nextEventToTrigger.title || nextEventKeyFromCurrent}`],
                            });
                        }, 500); // 0.5 second delay
                    } else {
                        console.warn(`Next event key "${nextEventKeyFromCurrent}" not found in baseEvents.`);
                    }
                } else if (resolvedEventKey && state.game_mode !== PLANET_MODES.BASE) { // Check for next event in main mode after resolving a main event
                    // In main mode, the next event is not necessarily linked in sequence like base events.
                    // The system relies on the turn-based check in the useEffect in App.jsx
                    console.log("Resolved main event. App.jsx turn effect will check for next event.");
                    // No explicit trigger here, the App.jsx effect handles it on the next turn tick if conditions are met.
                }

                // Check for game completion after resolving any event in main mode
                if (state.game_mode !== PLANET_MODES.BASE && get().resolvedEventCount >= EVENTS_TO_FINISH && !get().isGameFinished) {
                   console.log(`Game finished condition met: ${get().resolvedEventCount} resolved events >= ${EVENTS_TO_FINISH}`);
                   get().finishGame();
                }

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
                // Remove unused timeElapsed variable
                // const timeElapsed = now - get().lastTickTime;

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
            minimizeEventPopup: () => set({ isEventPopupMinimized: true }),

            // Action to restore the event popup UI
            restoreEventPopup: () => set({ isEventPopupMinimized: false }),

            // --- Add action to manually increment resolvedEventCount for testing --- 
            incrementResolvedEventCount: () => set(state => {
                console.log("[usePlanetStore] Incrementing resolvedEventCount");
                return { resolvedEventCount: state.resolvedEventCount + 1 };
            }),
            // --- End action ---

            // New action to trigger data wave
            triggerDataWave: () => set(state => ({ dataWaveTriggerCount: state.dataWaveTriggerCount + 1 })),
        }), // Closing parenthesis for the main state object
        { // Persist configuration
            name: 'planetary-pet-storage-v3', // Consider changing name if schema changed significantly
            // Optionally specify parts of the state to persist or ignore
            partialize: (state) => {
                // Return only the state that should be persisted
                // eslint-disable-next-line no-unused-vars
                const { coinbaseProvider, coinbaseAccount, ...rest } = state;
                return rest; // Exclude coinbaseProvider and coinbaseAccount
            },
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
