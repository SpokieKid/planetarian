import React from 'react';
import './PublishPopup.css';

const PublishPopup = ({
    isOpen,
    onClose,
    publishStatus,
    ipfsUri,
    zoraTxHash,
    isPublishing, // To show spinner
    pinataGatewayUrl, // Needed for IPFS link construction
    targetChainBlockExplorerUrl // Needed for Zora link construction
}) => {
    if (!isOpen) {
        return null;
    }

    // Helper to create IPFS link
    const getIpfsLink = () => {
        if (!ipfsUri || !pinataGatewayUrl) return null;
        const cid = ipfsUri.startsWith('ipfs://') ? ipfsUri.substring(7) : ipfsUri;
        return `https://${pinataGatewayUrl}/ipfs/${cid}`;
    };

    // Helper to create Zora transaction link
    const getZoraLink = () => {
        if (!zoraTxHash || !targetChainBlockExplorerUrl) return null;
        return `${targetChainBlockExplorerUrl}/tx/${zoraTxHash}`;
    };

    const ipfsLink = getIpfsLink();
    const zoraLink = getZoraLink();

    return (
        <div className="publish-popup-overlay" onClick={onClose}>
            <div className="publish-popup-card" onClick={(e) => e.stopPropagation()}>
                <button className="close-publish-popup-btn" onClick={onClose}>×</button>
                <h3>Coin on Zora Status</h3>

                {isPublishing && !publishStatus && <div className="publish-spinner"></div>}
                
                {publishStatus && <p>{publishStatus}</p>}

                {ipfsUri && publishStatus.includes('IPFS Uploaded') && ipfsLink && (
                    <p>
                        IPFS Link: <a href={ipfsLink} target="_blank" rel="noopener noreferrer">View on IPFS</a>
                    </p>
                )}

                {zoraTxHash && publishStatus.includes('Zora coin creation initiated') && zoraLink && (
                    <div>
                        <p>Zora Coin Creation Transaction:</p>
                        <p><a href={zoraLink} target="_blank" rel="noopener noreferrer">{zoraTxHash}</a></p>
                        <p style={{ fontSize: '0.9em', color: '#aaa' }}>(Coin address will be available after transaction confirmation)</p>
                    </div>
                )}
                 {/* Show a generic loading spinner if isPublishing is true and no specific status yet, 
                     or if a specific step is in progress e.g. 'Uploading metadata...' */}
                {isPublishing && (publishStatus.includes('...') || publishStatus.includes('Generating...') || publishStatus.includes('Preparing...')) && <div className="publish-spinner"></div> }


                {/* Show a "Done" or "Close" button if not actively publishing and there's a final status */}
                {!isPublishing && (ipfsUri || zoraTxHash || publishStatus.startsWith('Error:')) && (
                    <div className="publish-popup-actions">
                        <button onClick={onClose}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublishPopup; 