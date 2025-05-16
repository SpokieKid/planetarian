import React, { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow'; // Import useShallow
import usePlanetStore from '../hooks/usePlanetState';
import { PinataSDK } from 'pinata'; // Import from new package
import { createPublicClient, http } from 'viem'; // Only need public client utils now
import { baseSepolia } from 'viem/chains'; // Import target chain (e.g., baseSepolia)
import { createCoinCall } from '@zoralabs/coins-sdk'; // Import createCoinCall
// import { getResourceModifiers } from '../utils/resourceMapping'; // REMOVED unused import
import './ResourcePanel.css'; // Add basic styling
import PublishPopup from './PublishPopup'; // Import the new popup component

const ResourcePanel = () => {
    // Use useShallow for state selection involving objects or multiple primitives
    const {
        // resources, // REMOVED
        game_mode,
        planetName,
        growthPoints,
        era, // Select new state
        turn, // Select new state
        karma, // Select new state
        narrativeLog, // Get narrativeLog
        walletAddress, // Get walletAddress
        coinbaseProvider, // Get Coinbase provider
        // addResource, // REMOVED
        hasEarnedBaseCompletionBadge,
        // incrementResolvedEventCount, // REMOVED
        // triggerDataWave, // REMOVED
        // triggerVfx, // REMOVED
    } = usePlanetStore(
        useShallow(state => ({
            // resources: state.resources, // REMOVED
            game_mode: state.game_mode,
            planetName: state.planetName,
            growthPoints: state.growthPoints,
            era: state.era, // Add to selector
            turn: state.turn, // Add to selector
            karma: state.karma, // Add to selector
            narrativeLog: state.narrativeLog, // Add narrativeLog
            walletAddress: state.walletAddress, // Add walletAddress
            coinbaseProvider: state.coinbaseProvider, // Add provider
            // addResource: state.addResource, // REMOVED
            hasEarnedBaseCompletionBadge: state.hasEarnedBaseCompletionBadge,
            // incrementResolvedEventCount: state.incrementResolvedEventCount, // REMOVED
            // triggerDataWave: state.triggerDataWave, // REMOVED
            // triggerVfx: state.triggerVfx, // REMOVED
        }))
    );

    // --- Log the entire useWallets return object --- 
    console.log("Zustand walletAddress:", walletAddress);
    // ---

    // Add this useEffect for debugging Coinbase Provider status
    useEffect(() => {
        console.log("[ResourcePanel Debug] Coinbase Provider from store:", coinbaseProvider);
        if (coinbaseProvider) {
            console.log("[ResourcePanel Debug] Coinbase Provider is available.");
        } else {
            console.log("[ResourcePanel Debug] Coinbase Provider is currently NOT available from store. Ensure wallet is connected and SDK initialized.");
        }
    }, [coinbaseProvider]);

    // --- Component State for Publishing --- 
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishStatus, setPublishStatus] = useState(''); // To show messages
    const [ipfsUri, setIpfsUri] = useState(null); // To store the result
    const [zoraTxHash, setZoraTxHash] = useState(null); // State for Zora transaction hash
    // --- Add State for Viem Clients --- 
    const [publicClient, setPublicClient] = useState(null);
    const [showPublishPopup, setShowPublishPopup] = useState(false); // State for popup visibility
    // const [walletClient, setWalletClient] = useState(null); // REMOVE walletClient state
    // --- End State for Viem Clients --- 

    // --- Pinata Configuration (Using JWT - INSECURE for Frontend) --- 
    const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
    const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY; // e.g., your-gateway.mypinata.cloud

    let pinata = null;
    if (PINATA_JWT && PINATA_GATEWAY) {
        pinata = new PinataSDK({
            pinataJwt: PINATA_JWT,
            pinataGateway: PINATA_GATEWAY
        });
        console.log("Pinata SDK initialized with JWT and Gateway");
    } else {
        console.warn("Pinata JWT or Gateway URL not found in environment variables (VITE_PINATA_JWT, VITE_PINATA_GATEWAY). Publishing will fail.");
    }
    // --- End Pinata Configuration ---

    // --- Viem/Zora Config --- 
    const TARGET_CHAIN = baseSepolia; // Use baseSepolia
    const RPC_URL = import.meta.env.VITE_BASE_SEPOLIA_RPC_URL; // Get RPC URL from .env

    // --- Effect to Initialize ONLY Public Client --- 
    useEffect(() => {
        console.log("[Effect] Checking for RPC for PublicClient...");
        setPublicClient(null); // Reset first

        if (RPC_URL) {
            try {
                console.log("[Effect] Creating PublicClient...");
                const newPublicClient = createPublicClient({
                    chain: TARGET_CHAIN,
                    transport: http(RPC_URL),
                });
                setPublicClient(newPublicClient);
                console.log("[Effect] PublicClient state updated.");
            } catch (error) {
                console.error("[Effect] Error creating PublicClient:", error);
            }
        } else {
            console.warn("[Effect] RPC_URL missing, cannot create PublicClient.");
        }
    // Depend only on RPC_URL and TARGET_CHAIN for public client
    }, [RPC_URL, TARGET_CHAIN]); 
    // --- End Effect --- 

    // REMOVED handleAddResource function
    // const handleAddResource = (resourceType) => {
    //     addResource(resourceType, 10);
    // };

    // Optional: Button to manually advance the turn for testing
    // const handleAdvanceTurn = () => {
    //     incrementTurn();
    // };

    // --- Publish Function --- 
    const handlePublish = async () => {
        setShowPublishPopup(true); // Open the popup
        setPublishStatus(''); 
        setIpfsUri(null);
        setZoraTxHash(null);
        setIsPublishing(true); // Set initial publishing state for the popup

        // --- Log connectedWallet right before the check --- 
        console.log("[handlePublish] Checking connectedWallet:", walletAddress);
        console.log("[handlePublish] typeof connectedWallet?.getProvider:", typeof walletAddress?.getProvider);
        // ---

        // Initial Checks
        if (!walletAddress) { 
            setPublishStatus('Error: Wallet not connected.');
            setIsPublishing(false);
            return;
        }
        if (!pinata) {
             setPublishStatus('Error: Pinata client not configured.');
             setIsPublishing(false);
             return;
        }
         if (!publicClient) { // Only check publicClient from state
             setPublishStatus('Error: Public blockchain client not ready. Check RPC URL.');
             console.error("PublicClient not available in state.", { publicClient });
             setIsPublishing(false);
             return;
         }
         // Check if Coinbase Provider is available
         if (!coinbaseProvider) {
             setPublishStatus('Error: Coinbase Wallet provider not available.');
             console.error("Coinbase Provider not available in state.");
             setIsPublishing(false);
             return;
         }

        setPublishStatus('Generating metadata...');
        const metadata = {
            name: `Planet ${planetName} Log (${walletAddress.substring(0, 6)})`,
            description: `A chronicle of events and karma for planet ${planetName}, owned by ${walletAddress}.`,
            external_url: "https://your-project-url.com",
            attributes: [
                { trait_type: "Final Karma", value: karma },
                { trait_type: "Era Reached", value: era },
                { trait_type: "Turns Survived", value: turn },
                { trait_type: "Mode", value: game_mode },
            ],
            planet_log: narrativeLog, 
        };
        let currentIpfsUri = null;
        try {
            const metadataString = JSON.stringify(metadata, null, 2);
            const metadataFile = new File([metadataString], `${planetName}-log-${Date.now()}.json`, { type: 'application/json' });
            setPublishStatus('Uploading metadata to IPFS...');
            const uploadResult = await pinata.upload.public.file(metadataFile);
            if (!uploadResult || !uploadResult.cid) {
                throw new Error("IPFS upload failed or did not return a CID.");
            }
            currentIpfsUri = `ipfs://${uploadResult.cid}`;
            setIpfsUri(currentIpfsUri);
            setPublishStatus('IPFS Uploaded! Check it out.');
            console.log("IPFS URI:", currentIpfsUri);
        } catch (error) {
            console.error("Error uploading metadata:", error);
            setPublishStatus(`Error uploading metadata: ${error.message}`);
            setIsPublishing(false);
            return; 
        }
        // --- End IPFS Upload --- 

        // --- Call Zora via useSendTransaction --- 
        if (currentIpfsUri) {
            try {
                setPublishStatus('Preparing Zora coin creation parameters...');
                
                const coinParams = {
                    name: `Planet ${planetName}`, 
                    symbol: `PL${planetName.substring(0,3).toUpperCase()}`, 
                    uri: currentIpfsUri,
                    payoutRecipient: walletAddress, 
                };

                // Get transaction parameters from Zora SDK
                const txParams = createCoinCall(coinParams);
                console.log("Zora createCoinCall params:", txParams);

                setPublishStatus('Please approve transaction in your wallet...');

                // Construct the transaction parameters for eth_sendTransaction
                const transactionParameters = {
                  from: walletAddress, // The user's address
                  to: txParams.to,       // The contract address from Zora SDK
                  data: txParams.data,    // The encoded function call from Zora SDK
                  value: txParams.value?.toString(), // Optional: value in wei (as string if bigint)
                };

                console.log("Sending transaction via eth_sendTransaction:", transactionParameters);

                // Send transaction using the Coinbase Wallet provider
                const txHash = await coinbaseProvider.request({
                  method: 'eth_sendTransaction',
                  params: [transactionParameters],
                });
                
                console.log("Zora Coin creation Tx Hash:", txHash);
                setZoraTxHash(txHash); // Store the transaction hash
                setPublishStatus(`Success! Zora coin creation initiated.`);

            } catch (error) {
                console.error("Error initiating Zora coin creation:", error);
                setPublishStatus(`Error initiating Zora coin creation: ${error.message}`);
            } finally {
                setIsPublishing(false);
            }
        } else {
            setPublishStatus('Error: IPFS URI missing.');
            setIsPublishing(false);
        }
        // --- End Call Zora --- 
    };
    // --- End Publish Function --- 

    const handleClosePublishPopup = () => {
        setShowPublishPopup(false);
        // Optionally reset status when closing if not fully completed, or let it persist
        // if (isPublishing) { // If closed mid-process
        //     setIsPublishing(false);
        //     setPublishStatus('Publishing cancelled by user.');
        // }
    };

    return (
        <div className="resource-panel">
            <h2>{planetName} <span className={`mode-badge mode-${game_mode.toLowerCase()}`}>{game_mode}</span></h2>
            <div className="planet-stats">
                <span>Era: {era}</span>
                <span>Turn: {turn}</span>
                <span>Karma: {karma}</span>
            </div>
            <p>Growth Points: {growthPoints.toFixed(2)}</p>
            {/* REMOVED resources-grid section */}
            {/* <div className="resources-grid">
                {Object.entries(resources).map(([key, value]) => (
                    <div key={key} className="resource-item">
                        <span className="resource-name">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                        <span className="resource-value">{value.toFixed(2)}</span>
                        <button onClick={() => handleAddResource(key)} className="add-resource-btn">+</button>
                    </div>
                ))}
            </div> */}
            <div className="action-buttons">
                <div className="publish-badge-btn-row">
                  {hasEarnedBaseCompletionBadge && (
                    <img src="/assets/images/badge.gif" alt="Completion Badge" className="mini-badge-cyberpunk" />
                  )}
                  <button
                      onClick={handlePublish}
                      disabled={isPublishing && showPublishPopup} // Disable if already publishing (popup is open)
                      className="publish-zora-btn"
                  >
                      <img src="/assets/icons/zora-icon.png" alt="Zora Icon" style={{ width: '20px', height: 'auto' }} />
                      { (isPublishing && showPublishPopup) ? 'Publishing...' : 'Coin on Zora'}
                  </button>
                </div>
            </div>

            <PublishPopup 
                isOpen={showPublishPopup}
                onClose={handleClosePublishPopup}
                publishStatus={publishStatus}
                ipfsUri={ipfsUri}
                zoraTxHash={zoraTxHash}
                isPublishing={isPublishing}
                pinataGatewayUrl={PINATA_GATEWAY} // Pass gateway URL
                targetChainBlockExplorerUrl={TARGET_CHAIN.blockExplorers.default.url} // Pass explorer URL
            />
        </div>
    );
};

export default ResourcePanel; 