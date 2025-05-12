import React, { useState, useEffect } from 'react';
// --- Remove Privy Hook ---
// import { usePrivy } from '@privy-io/react-auth';
// --- End Remove Privy Hook ---
import PlanetCanvas from './components/PlanetCanvas';
import ResourcePanel from './components/ResourcePanel';
import EventPopup from './components/EventPopup';
import StoryLog from './components/StoryLog';
import ActionIcon from './components/ActionIcon';
import DialogBox from './components/DialogBox';
import IntroScroller from './components/IntroScroller';
import usePlanetStore from './hooks/usePlanetState';
import { useShallow } from 'zustand/react/shallow';
import { PLANET_MODES } from './utils/resourceMapping';
import { EVENTS_TO_FINISH } from './constants/events';
import './App.css';

// +++ Import Coinbase Wallet SDK +++
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
// +++ End Import +++

// +++ Coinbase Wallet Configuration +++
const COINBASE_APP_NAME = 'Planatarian'; // Or your desired app name
const COINBASE_RPC_URL = 'https://base-sepolia.g.alchemy.com/v2/wYLLLqg2CDlpIiTy5j6dqzBnTg1GzLPS'; // Your RPC URL
const COINBASE_CHAIN_ID = 84532; // Your Chain ID
// +++ End Configuration +++

// +++ Add MiniKit Hook Import +++
import { useMiniKit } from '@coinbase/onchainkit/minikit';
// --- End Nounii System Prompt Logic ---

function App() {
  // +++ Add MiniKit Hook Usage +++
  const { setFrameReady, isFrameReady } = useMiniKit();

  // The setFrameReady() function is called when your mini-app is ready to be shown
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
      console.log('MiniKit: Frame marked as ready.');
    }
  }, [setFrameReady, isFrameReady]);
  // +++ End MiniKit Hook Usage +++

  // Zustand actions (Existing)
  const initializePlanet = usePlanetStore(state => state.initializePlanet);
  const tick = usePlanetStore(state => state.tick);
  const resolvedEventCount = usePlanetStore(state => state.resolvedEventCount);
  const isGameFinished = usePlanetStore(state => state.isGameFinished);
  const finishGame = usePlanetStore(state => state.finishGame);
  const loadPlanetState = usePlanetStore(state => state.loadPlanetState);
  // Get Coinbase state and actions from Zustand
  const {
    coinbaseProvider,
    coinbaseAccount,
    walletAddress // This is updated by setCoinbaseAccount in Zustand
  } = usePlanetStore(
    useShallow(state => ({
      coinbaseProvider: state.coinbaseProvider,
      coinbaseAccount: state.coinbaseAccount,
      walletAddress: state.walletAddress, 
    }))
  );
  const zustandSetCoinbaseProvider = usePlanetStore(state => state.setCoinbaseProvider);
  const zustandSetCoinbaseAccount = usePlanetStore(state => state.setCoinbaseAccount);
  const zustandClearCoinbaseConnection = usePlanetStore(state => state.clearCoinbaseConnection);

  // +++ Get additional state and action from Zustand +++
  const currentView = usePlanetStore(state => state.currentView);
  const activeEvent = usePlanetStore(state => state.activeEvent);
  const triggerNextEvent = usePlanetStore(state => state.triggerNextEvent);
  // +++ End Get additional state and action from Zustand +++

  // Local UI state
  const [isCoinbaseConnecting, setIsCoinbaseConnecting] = useState(false);
  const [coinbaseUiError, setCoinbaseUiError] = useState(null); // For UI feedback
  const [isSdkInitialized, setIsSdkInitialized] = useState(false); // Tracks if SDK init attempt is done

  const [gameStarted, setGameStarted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  // +++ Add state for video and guide screens +++
  const [showVideoScreen, setShowVideoScreen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  // +++ End Add state for video and guide screens +++

  // +++ Effect to Initialize Coinbase Wallet SDK +++
  useEffect(() => {
    console.log("Initializing Coinbase Wallet SDK in App.jsx (using create factory)...");
    let didCancel = false; // To prevent state updates if component unmounts during async ops

    async function initSDK() {
        try {
            const sdk = createCoinbaseWalletSDK({
                appName: COINBASE_APP_NAME,
                appChainIds: [COINBASE_CHAIN_ID], // Recommended to specify chain IDs
            });
            // For `getProvider`, the rpcUrl is often optional if the wallet is already configured
            // or can derive it, but good to be explicit for a specific network.
            const provider = sdk.getProvider({ rpcUrl: COINBASE_RPC_URL }); 

            if (!didCancel) {
                zustandSetCoinbaseProvider(provider);
                console.log("Coinbase Wallet Provider ready in App.jsx and set in Zustand (using getProvider).");
            }
        } catch (error) {
            if (!didCancel) {
                console.error("Error initializing Coinbase Wallet SDK in App.jsx:", error);
                setCoinbaseUiError(`SDK Initialization failed: ${error.message}`);
            }
        } finally {
            if (!didCancel) {
                setIsSdkInitialized(true); // Mark initialization attempt as complete
            }
        }
    }

    initSDK();

    return () => {
        didCancel = true; // Cleanup function to prevent state updates on unmounted component
    };
  }, [zustandSetCoinbaseProvider, zustandSetCoinbaseAccount]); // Keep setters, they should be stable

  // Load User State using Coinbase Wallet (via Zustand's walletAddress)
  useEffect(() => {
      // Ensure SDK initialization has been attempted before trying to load state
      if (isSdkInitialized && walletAddress) {
          console.log("Coinbase Wallet connected (via Zustand), calling loadPlanetState for:", walletAddress);
          loadPlanetState(walletAddress);
      } else if (isSdkInitialized && !walletAddress) {
          console.log("Coinbase Wallet not connected, or SDK init done but no account found.");
      }
  }, [isSdkInitialized, walletAddress, loadPlanetState]);

  // Game loop (Existing)
  useEffect(() => {
    if (!gameStarted || isGameFinished) return;
    const intervalId = setInterval(() => tick(), 1000);
    return () => clearInterval(intervalId);
  }, [tick, gameStarted, isGameFinished]);

  // Check for game end condition (Existing)
  useEffect(() => {
      if (!isGameFinished && resolvedEventCount >= EVENTS_TO_FINISH) {
          finishGame();
      }
  }, [resolvedEventCount, isGameFinished, finishGame]);

  // Send Nounii System Prompt (Existing)
  useEffect(() => {
    // const sendSystemPrompt = async () => { // Removed as it's not called
    //   // ... (rest of sendSystemPrompt logic)
    // };
    // sendSystemPrompt(); // Temporarily commenting out to focus on wallet integration
     console.log("Nounii system prompt sending is currently commented out.");
  }, []);

  // +++ Coinbase Connect Function +++
  const connectCoinbaseWallet = async () => {
    if (!coinbaseProvider) {
        setCoinbaseUiError("Coinbase Provider not available. SDK might be initializing or failed.");
        return;
    }
    setIsCoinbaseConnecting(true);
    setCoinbaseUiError(null);
    try {
        const accounts = await coinbaseProvider.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
            zustandSetCoinbaseAccount(accounts[0]);
        } else {
             setCoinbaseUiError("No accounts returned from Coinbase Wallet.");
             zustandClearCoinbaseConnection();
        }
    } catch (error) {
        console.error('Failed to connect Coinbase wallet:', error);
        setCoinbaseUiError(error.message || 'Failed to connect Coinbase Wallet.');
        if (error.code === 4001) {
           setCoinbaseUiError('Connection request rejected by user.');
        }
        zustandClearCoinbaseConnection();
    } finally {
        setIsCoinbaseConnecting(false);
    }
  };
  // +++ End Coinbase Connect Function +++

  // +++ Coinbase Disconnect Function (Basic Example) +++
  // Coinbase Wallet SDK doesn't have an explicit "disconnect" method that clears permissions
  // from the DApp side. The user manages connections from their wallet.
  // This function will just clear our DApp's state.
  const disconnectCoinbaseWallet = () => {
      console.log("Disconnecting Coinbase Wallet (clearing app and Zustand state).");
      zustandClearCoinbaseConnection();
      setCoinbaseUiError(null);
      // You might want to reset other game state here if appropriate
      // For example, navigate to a logged-out view or clear planet data if it's user-specific
      // setGameStarted(false); // Example: Reset game state
      // setShowIntro(true); // Example: Show intro again
  };
  // +++ End Coinbase Disconnect Function +++


  const handleStartGame = (chosenMode) => {
    initializePlanet(chosenMode);
    setGameStarted(true);
    setIsDialogOpen(false);
  };

  const handleOpenDialog = () => {
      setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
      setIsDialogOpen(false);
  };

  const handleIntroFinished = () => {
      setShowIntro(false);
      console.log("Intro finished");
  };

  // Start Screen Component (Existing)
  const StartScreen = () => (
    <div className="start-screen">
      <h1>Welcome to Planetary Pet</h1>
      <p>Choose your starting society:</p>
      <div className="mode-selection">
        <button onClick={() => handleStartGame(PLANET_MODES.INTERNATIONAL)}>International</button>
        <button onClick={() => handleStartGame(PLANET_MODES.GLOBAL)}>Global</button>
        <button onClick={() => handleStartGame(PLANET_MODES.PLANETARY)}>Planetary</button>
      </div>
       {/* Add descriptions for each mode later */}
    </div>
  );

  // TODO: Create EndingCard component
  const EndingScreen = () => (
     <div className="ending-screen"> {/* Use styles similar to start-screen */}
        <h1>Game Over!</h1>
        <p>Your planet evolution is complete.</p>
        {/* Add summary generation later */}
        <button onClick={() => { setShowIntro(true); setGameStarted(false); initializePlanet(null); /* Reset planet */ }}>Play Again?</button>
     </div>
  );

  // --- Automatically trigger first event after 15 seconds of main game view ---
  useEffect(() => {
    let eventTimer;
    // Conditions to trigger the timer:
    // 1. Not in video, intro, or guide
    // 2. Game is not finished
    // 3. No event is currently active
    // 4. Only on main_planet view
    if (currentView === 'main_planet' && !showVideoScreen && !showIntro && !showGuide && !isGameFinished && !activeEvent) {
      console.log('[App Effect] Main game view active, starting 15s timer for first event...');
      eventTimer = setTimeout(() => {
        console.log('[App Effect] 15s timer elapsed, attempting to trigger next event.');
        triggerNextEvent();
      }, 15000); // 15 seconds
    }

    // Cleanup function to clear the timer if conditions change or component unmounts
    return () => {
      if (eventTimer) {
        console.log('[App Effect] Clearing event timer.');
        clearTimeout(eventTimer);
      }
    };
  // Dependencies: include all states that define the main game view and active event status
  }, [currentView, showVideoScreen, showIntro, showGuide, isGameFinished, activeEvent, triggerNextEvent]);
  // --- End Auto Event Trigger ---

  return (
    <div className="App">
      {/* --- Coinbase Wallet Auth Controls --- */}
      {!isSdkInitialized && <div className="loading-indicator">Initializing Wallet SDK...</div>}
      {isSdkInitialized && (
        <div className="auth-controls">
          {coinbaseAccount ? (
            <>
              <span>Connected: {coinbaseAccount.substring(0,6)}...{coinbaseAccount.substring(coinbaseAccount.length - 4)}</span>
              <button onClick={disconnectCoinbaseWallet}>Disconnect Wallet</button>
            </>
          ) : (
            <button onClick={connectCoinbaseWallet} disabled={isCoinbaseConnecting || !coinbaseProvider}>
              {isCoinbaseConnecting ? 'Connecting...' : 'Connect with Coinbase Wallet'}
            </button>
          )}
          {coinbaseUiError && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>{coinbaseUiError}</div>}
        </div>
      )}
      {/* --- End Coinbase Wallet Auth Controls --- */}

       {/* Show Intro first if showIntro is true */} 
       {showIntro ? (
           <IntroScroller onFinished={handleIntroFinished} />
       ) : !gameStarted ? (
        // Only show StartScreen if wallet is connected or if you allow starting without a wallet
        coinbaseAccount ? <StartScreen /> : (
          isSdkInitialized && <div className="please-connect" style={{textAlign: 'center', marginTop: '50px'}}>Please connect your Coinbase Wallet to start.</div>
        )
      ) : isGameFinished ? (
          <EndingScreen />
      ) : (
        <>
          <PlanetCanvas />
          <ResourcePanel />
          <StoryLog /> {/* Add StoryLog to the UI */} 
          <EventPopup /> 
        </>
      )}

      {/* --- Wrapper for ActionIcon and its Dialog --- */} 
      {/* Render only when intro is done and game is running */}
      {!showIntro && gameStarted && !isGameFinished && (
         <div className="action-icon-area"> 
            <ActionIcon onClick={handleOpenDialog} />
            <DialogBox isOpen={isDialogOpen} onClose={handleCloseDialog} title="Planet Info">
              {/* Placeholder content for the dialog */}
              <p>This is where additional information or actions related to the planet could go.</p>
              <p>Maybe display detailed stats, upgrade options, or lore.</p>
            </DialogBox>
         </div>
      )}
    </div>
  );
}

export default App;
