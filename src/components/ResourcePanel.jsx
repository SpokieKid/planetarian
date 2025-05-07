import React, { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import usePlanetStore from '../hooks/usePlanetState';
import { createThirdwebClient } from "thirdweb";
import { upload, resolveScheme } from "thirdweb/storage";
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import { createCoin } from '@zoralabs/coins-sdk';
import './ResourcePanel.css';

const ResourcePanel = () => {
    const {
        mode,
        planetName,
        growthPoints,
        era,
        turn,
        karma,
        narrativeLog,
        triggerNextEvent,
        incrementTurn,
        coinbaseProvider,
        coinbaseAccount,
    } = usePlanetStore(
        useShallow(state => ({
            mode: state.mode,
            planetName: state.planetName,
            growthPoints: state.growthPoints,
            era: state.era,
            turn: state.turn,
            karma: state.karma,
            narrativeLog: state.narrativeLog,
            triggerNextEvent: state.triggerNextEvent,
            incrementTurn: state.incrementTurn,
            coinbaseProvider: state.coinbaseProvider,
            coinbaseAccount: state.coinbaseAccount,
        }))
    );

    const [isPublishing, setIsPublishing] = useState(false);
    const [publishStatus, setPublishStatus] = useState('');
    const [ipfsUri, setIpfsUri] = useState(null);
    const [zoraTxHash, setZoraTxHash] = useState(null);
    const [coinAddress, setCoinAddress] = useState(null);
    const [publicClient, setPublicClient] = useState(null);
    const [walletClient, setWalletClient] = useState(null);
    const [thirdwebClient, setThirdwebClient] = useState(null);

    const THIRDWEB_CLIENT_ID = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
    const RPC_URL = import.meta.env.VITE_RPC_URL;
    const TARGET_CHAIN = baseSepolia;

    useEffect(() => {
        if (THIRDWEB_CLIENT_ID) {
            const client = createThirdwebClient({
                clientId: THIRDWEB_CLIENT_ID,
            });
            setThirdwebClient(client);
            console.log("[ResourcePanel Effect] Thirdweb client initialized.");
        } else {
            console.warn("Thirdweb Client ID not found. IPFS Publishing will fail.");
            setThirdwebClient(null);
        }

        if (RPC_URL && coinbaseProvider && coinbaseAccount && TARGET_CHAIN) {
            try {
                const newPublicClient = createPublicClient({
                    chain: TARGET_CHAIN,
                    transport: http(RPC_URL),
                });
                setPublicClient(newPublicClient);

                const newWalletClient = createWalletClient({
                    account: coinbaseAccount,
                    chain: TARGET_CHAIN,
                    transport: custom(coinbaseProvider)
                });
                setWalletClient(newWalletClient);
                console.log("[ResourcePanel Effect] Viem PublicClient and WalletClient initialized.");

            } catch (error) {
                console.error("[ResourcePanel Effect] Error creating Viem clients:", error);
                setPublicClient(null);
                setWalletClient(null);
            }
        } else {
             setPublicClient(null);
             setWalletClient(null);
        }
    }, [THIRDWEB_CLIENT_ID, RPC_URL, TARGET_CHAIN, coinbaseProvider, coinbaseAccount]);

    const handlePublish = async () => {
        setPublishStatus('');
        setIpfsUri(null);
        setZoraTxHash(null);
        setCoinAddress(null);

        if (!coinbaseAccount || !coinbaseProvider || !publicClient || !walletClient) {
            setPublishStatus('Error: Wallet not connected or Viem clients not ready.');
            return;
        }
        if (!thirdwebClient) {
             setPublishStatus('Error: Thirdweb client not configured.');
             return;
        }

        setIsPublishing(true);
        
        let currentIpfsUri = null;
        let httpsIpfsUrl = null;
        let imageIpfsUri = null;

        // 1. Upload the static image to IPFS
        try {
            setPublishStatus('Fetching and uploading image to IPFS...');
            const imageResponse = await fetch('/assets/zora_upload/aa_avatar.png');
            if (!imageResponse.ok) {
                throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
            }
            const imageBlob = await imageResponse.blob();
            const imageFile = new File([imageBlob], "aa_avatar.png", { type: imageBlob.type });

            const imageUploadUris = await upload({ client: thirdwebClient, files: [imageFile] });
            console.log("Raw response from thirdweb image upload:", imageUploadUris);

            if (typeof imageUploadUris === 'string' && imageUploadUris.startsWith('ipfs://')) {
                imageIpfsUri = imageUploadUris;
            } else if (Array.isArray(imageUploadUris) && imageUploadUris.length > 0 && typeof imageUploadUris[0] === 'string' && imageUploadUris[0].startsWith('ipfs://')) {
                imageIpfsUri = imageUploadUris[0];
            } else {
                console.error("Thirdweb IPFS image upload failed or returned an invalid URI format. Full response:", imageUploadUris);
                throw new Error("Thirdweb IPFS image upload failed or did not return a valid ipfs:// URI.");
            }
            console.log(`Image uploaded to IPFS: ${imageIpfsUri}`);
            setPublishStatus('Image uploaded. Generating metadata...');
        } catch (error) {
            console.error("Error uploading image to IPFS:", error);
            setPublishStatus(`Error uploading image: ${error.message}`);
            setIsPublishing(false);
            return;
        }

        // 2. Generate metadata including the image URI, then upload metadata
        const metadata = {
            name: `Planet ${planetName} Log (${coinbaseAccount.substring(0, 6)})`,
            description: `A chronicle of events and karma for planet ${planetName}, owned by ${coinbaseAccount}.`,
            image: imageIpfsUri,
            external_url: `https://example.com/planet/${planetName}-${Date.now()}`,
            attributes: [
                { trait_type: "Planet Name", value: planetName },
                { trait_type: "Final Karma", value: karma },
                { trait_type: "Era Reached", value: era },
                { trait_type: "Turns Survived", value: turn },
                { trait_type: "Mode", value: mode },
                { trait_type: "Planet Log Snapshot", value: JSON.stringify(narrativeLog.slice(-5)) },
            ],
        };
        try {
            const metadataString = JSON.stringify(metadata, null, 2);
            const metadataFile = new File([metadataString], `${planetName}-log-${Date.now()}.json`, { type: 'application/json' });
            setPublishStatus('Uploading metadata to IPFS via thirdweb...');
            
            console.log("Attempting to upload to thirdweb IPFS with client:", thirdwebClient, "and file:", metadataFile);
            const uris = await upload({ 
                client: thirdwebClient, 
                files: [metadataFile] 
            });
            console.log("Raw response from thirdweb upload:", uris);

            let singleUri = null;
            if (typeof uris === 'string') {
                singleUri = uris; // uris is directly the string
            } else if (Array.isArray(uris) && uris.length > 0 && typeof uris[0] === 'string') {
                singleUri = uris[0]; // uris is an array, take the first element
            }

            if (!singleUri || !singleUri.startsWith('ipfs://')) {
                console.error("Thirdweb IPFS upload failed or returned an invalid URI format. Full response:", uris);
                throw new Error("Thirdweb IPFS upload failed or did not return a valid ipfs:// URI.");
            }
            currentIpfsUri = singleUri;

            // Resolve to thirdweb's HTTPS gateway URL
            httpsIpfsUrl = await resolveScheme({ client: thirdwebClient, uri: currentIpfsUri });
            setIpfsUri(httpsIpfsUrl); // Store and display the HTTPS URL

            setPublishStatus(`Metadata pinned: ${httpsIpfsUrl}. Preparing Zora Coin transaction...`);
            console.log(`Thirdweb IPFS upload successful. IPFS URI: ${currentIpfsUri}, HTTPS URL: ${httpsIpfsUrl}`);
        } catch (error) {
            console.error("Error uploading metadata to Thirdweb IPFS or resolving scheme:", error);
            setPublishStatus(`Error uploading metadata: ${error.message}`);
            setIsPublishing(false);
            return;
        }

        if (currentIpfsUri) {
            try {
                setPublishStatus('Preparing Zora createCoin transaction...');
                
                const coinParams = {
                    name: `Planet ${planetName} Coin (${coinbaseAccount.substring(0,6)})`,
                    symbol: planetName.substring(0, 3).toUpperCase() + 'C',
                    uri: httpsIpfsUrl,
                    payoutRecipient: coinbaseAccount,
                  };

                console.log("Calling createCoin with params:", coinParams);

                if (!publicClient || !walletClient) {
                    throw new Error("Viem public or wallet client is not initialized.");
                }

                const result = await createCoin(coinParams, walletClient, publicClient);
                
                setZoraTxHash(result.hash);
                setCoinAddress(result.address);
                setPublishStatus(`Success! Zora Coin creation tx sent: ${result.hash}. Coin Address: ${result.address}`);
                console.log("Zora Coin creation successful:", result);

            } catch (error) {
                console.error("Error preparing or sending Zora createCoin transaction:", error);
                setPublishStatus(`Error creating Zora Coin: ${error.message}`);
                if (error?.code === 4001) {
                     setPublishStatus('Zora transaction rejected by user.');
                }
            } finally {
                setIsPublishing(false);
            }
        } else {
            setPublishStatus('Error: IPFS URI missing for Zora Coin creation.');
            setIsPublishing(false);
        }
    };

    const handleAdvanceTurn = () => incrementTurn();

    return (
        <div className="resource-panel">
            <h2>{planetName} <span className={`mode-badge mode-${mode.toLowerCase()}`}>{mode}</span></h2>
            <div className="planet-stats">
                <span>Era: {era}</span>
                <span>Turn: {turn}</span>
                <span>Karma: {karma}</span>
            </div>
            <p>Growth Points: {growthPoints.toFixed(2)}</p>
            <div className="action-buttons">
                <button onClick={triggerNextEvent} className="debug-event-btn">
                    Check for Event
                </button>
                <button onClick={handleAdvanceTurn} className="debug-turn-btn">
                    Advance Turn
                </button>
                <button 
                    onClick={handlePublish} 
                    disabled={isPublishing || !coinbaseAccount || !publicClient || !walletClient}
                    className="publish-zora-btn"
                >
                    {isPublishing ? 'Publishing Coin...' : 'Publish Planet Coin (On-Chain)'}
                </button>
            </div>
            {publishStatus && <p className="publish-status">{publishStatus}</p>}
            {ipfsUri && (
                <p className="ipfs-result">Metadata URI: 
                    <a href={ipfsUri} target="_blank" rel="noopener noreferrer">
                        {ipfsUri}
                    </a>
                </p>
            )}
            {zoraTxHash && (
                <div className="zora-result">
                    <p>Zora Coin Creation Transaction:</p>
                     <a href={`${TARGET_CHAIN.blockExplorers.default.url}/tx/${zoraTxHash}`} target="_blank" rel="noopener noreferrer">
                         {zoraTxHash}
                     </a>
                     {coinAddress && <p>Coin Address: {coinAddress}</p>}
                     <p>(Details visible after confirmation)</p>
                </div>
            )}
        </div>
    );
};

export default ResourcePanel;