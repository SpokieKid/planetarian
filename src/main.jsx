import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n'; // Import i18n configuration

// --- Sentry Initialization ---
import * as Sentry from "@sentry/react";
// Removed incorrect named imports for BrowserTracing and Replay

Sentry.init({
  dsn: "https://742ee436c77a39aee15ea21bafc8e833@o4509320334475264.ingest.us.sentry.io/4509320335261696",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  // Use the correct integration functions
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()], // Use integration functions
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,
  // Capture Replay for 10% of all sessions, and 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
// --- End Sentry Initialization ---

// --- Import OnchainKitProvider and styles ---
import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@coinbase/onchainkit/styles.css'; // Import OnchainKit styles

// --- Import Wagmi and QueryClient components and setup ---
import { WagmiProvider, createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- Import ThirdwebProvider ---
import { ThirdwebProvider } from "@thirdweb-dev/react";
// --- End Import ThirdwebProvider ---

// Create a QueryClient instance
const queryClient = new QueryClient();

// Define wagmiConfig
const wagmiConfig = createConfig({
  chains: [baseSepolia], // Configure for Base Sepolia
  connectors: [
    coinbaseWallet({
      appName: 'Planatarian', // Your app name
      version: '1', // Optional: Specify version
      // Optional: Add appLogoUrl if you want it to appear in the wallet UI
      // appLogoUrl: 'https://example.com/logo.png',
    }),
    // Add other connectors like MetaMask, WalletConnect if needed
    // metaMask({ dappUrl: 'http://localhost:5173' }), // Your dApp URL
    // walletConnect({ projectId: 'YOUR_WC_PROJECT_ID' }), // Replace with your WalletConnect Project ID if using
  ],
  ssr: true, // Set to false if you are not using SSR
  transports: {
    [baseSepolia.id]: http(), // Use HTTP transport for the chain
  },
});
// --- End Wagmi and QueryClient setup ---

// You will need to create a .env file in your project root
// and add VITE_CDP_CLIENT_API_KEY=your_api_key
const onchainKitApiKey = import.meta.env.VITE_CDP_CLIENT_API_KEY // Use the correct public key name
if (!onchainKitApiKey) {
  console.warn("VITE_CDP_CLIENT_API_KEY is not set. OnchainKit features might not work correctly.")
}

// Custom fallback component for Sentry ErrorBoundary
const SentryFallback = ({ error }) => {
  // Explicitly capture the error to ensure it's sent to Sentry
  Sentry.captureException(error);

  return (
    <div style={{
      padding: '20px',
      textAlign: 'left',
      color: 'red',
      border: '1px solid red',
      margin: '20px',
      backgroundColor: '#ffe6e6'
    }}>
      <h2>An unexpected error occurred:</h2>
      <p><strong>Message:</strong> {error.message}</p>
      {/* Display stack trace for debugging, consider hiding in production */}
      {error.stack && (
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          <strong>Stack:</strong> {error.stack}
        </pre>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* --- PrivyProvider Removed --- */}
    {/* --- MiniKitProvider Removed --- */}

    {/* Wrap with WagmiProvider first, then QueryClientProvider, then OnchainKitProvider */}
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={onchainKitApiKey}
          chain={baseSepolia} // Specify the chain
          // Optional: Add appearance or wallet config here if needed from OnchainKit docs
          // config={{
          //   appearance: { name: 'Planatarian' },
          //   wallet: { display: 'modal' }, // Example: if you want to force modal on connect
          // }}
        >
          {/* Place App and ThirdwebProvider inside OnchainKitProvider as they consume the context */}
          <ThirdwebProvider clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}> {/* Keep ThirdwebProvider if used independently */}
             {/* Wrap App with Sentry.ErrorBoundary to catch rendering errors */}
             {/* Use a custom fallback component to display error details and ensure Sentry capture */}
             <Sentry.ErrorBoundary fallback={SentryFallback}> {/* Use the custom fallback component */}
                <App />
             </Sentry.ErrorBoundary>
          </ThirdwebProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>

  </React.StrictMode>,
);
