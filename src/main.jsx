import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PrivyProvider } from '@privy-io/react-auth'

// --- Wagmi Imports ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from '@privy-io/wagmi' // Import from Privy's connector
import { wagmiConfig } from './wagmi' // Import your wagmi config
// --- End Wagmi Imports ---

// Create a QueryClient instance
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <PrivyProvider
    appId="cmaaomgt9018nl10mbu92v4j2"
    config={{
      appearance: {
        theme: 'light',
        accentColor: '#676FFF',
      },
      embeddedWallets: {
        createOnLogin: 'users-without-wallets',
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <App />
      </WagmiProvider>
    </QueryClientProvider>
  </PrivyProvider>,
)
