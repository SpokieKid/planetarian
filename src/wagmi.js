import { http } from 'wagmi';
import { base } from 'viem/chains'; // Import the chains you need (e.g., base)
import { createConfig } from '@privy-io/wagmi'; // Import from Privy's connector

// Define your chains
const supportedChains = [base]; // Add other chains if needed

// Create wagmi config
export const wagmiConfig = createConfig({
  chains: supportedChains,
  transports: {
    // Set up http transport for each chain
    [base.id]: http(import.meta.env.VITE_RPC_URL), // Use your RPC URL from .env
    // Add transports for other chains if needed, potentially using different RPC URLs
  },
}); 