import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n'; // Import i18n configuration
import { ThirdwebProvider } from 'thirdweb/react'

// --- Wagmi Imports (Remove or adjust if MiniKitProvider handles it) ---
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { WagmiProvider } from '@privy-io/wagmi' // REMOVE THIS
// import { wagmiConfig } from './wagmi' // Config might still be needed by MiniKit or a generic WagmiProvider if MiniKit doesn't fully cover
// --- End Wagmi Imports ---

// Create a QueryClient instance - This might also be handled by MiniKitProvider
// const queryClient = new QueryClient()

// +++ Add MiniKit Imports +++
// import { MiniKitProvider } from '@coinbase/onchainkit/minikit' // REMOVED
// import { base } from 'viem/chains' // REMOVED (Chain info now likely managed in App.jsx)
// +++ End MiniKit Imports +++

// You will need to create a .env file in your project root
// and add VITE_CDP_CLIENT_API_KEY=your_api_key
const cdpClientApiKey = import.meta.env.VITE_CDP_CLIENT_API_KEY
if (!cdpClientApiKey) {
  console.warn("VITE_CDP_CLIENT_API_KEY is not set. MiniKitProvider might not work correctly.")
}

// We might need to pass wagmiConfig to MiniKitProvider if it accepts it,
// or MiniKitProvider might create its own. Refer to MiniKitProvider props.
// For now, let's assume MiniKitProvider handles wagmiConfig internally or doesn't need it explicitly here.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* --- PrivyProvider Removed --- */}
    {/* <PrivyProvider
      appId="clvhp0nys08gxtp701p621n5h" // Replace with your Privy App ID
      config={{
        // Customize Privy's appearance and behavior here
        loginMethods: ['email', 'wallet', 'google', 'apple'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: '/planetary-logo.png', // Ensure this path is correct in your public folder
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    > */}
    {/* --- End PrivyProvider Removed --- */}
    {/* +++ Wrap with MiniKitProvider +++ */}
    {/* <MiniKitProvider
      apiKey={cdpClientApiKey}
      chain={base}
      // wagmiConfig={wagmiConfig} // Example: if MiniKitProvider accepts wagmiConfig
      // Refer to MiniKitProvider documentation for how it handles Wagmi config
    > */}
      <ThirdwebProvider> {/* Keep ThirdwebProvider if used independently */}
        <App />
      </ThirdwebProvider>
    {/* </MiniKitProvider> */}
    {/* +++ End Wrap with MiniKitProvider +++ */}
    {/* </PrivyProvider> */}
  </React.StrictMode>,
)
