import { createCoin } from "@zoralabs/coins-sdk";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import 'dotenv/config'; // To load environment variables from .env file

// --- Configuration (Load from .env file) ---
const RPC_URL = process.env.VITE_RPC_URL; // Use the same RPC URL
const DEPLOYER_PRIVATE_KEY = process.env.ZORA_TEST_DEPLOYER_PRIVATE_KEY; // **NEVER COMMIT THIS KEY**
const IPFS_URI = "ipfs://bafkreibxqwx56v3tjd46pu74q4rhvpdmttkzavpfaqxzm23gf7pxm2e6cy"; // The URI that worked previously via your gateway
const COIN_NAME = "Zora SDK Test Coin";
const COIN_SYMBOL = "ZSTC";
// --- End Configuration ---

// --- Input Validation ---
if (!RPC_URL) {
  console.error("Error: VITE_RPC_URL not found in environment variables.");
  process.exit(1);
}
if (!DEPLOYER_PRIVATE_KEY) {
  console.error("Error: ZORA_TEST_DEPLOYER_PRIVATE_KEY not found in environment variables.");
  console.error("Please add it to your .env file.");
  process.exit(1);
}
if (!IPFS_URI || !IPFS_URI.startsWith('ipfs://')) {
    console.error("Error: Invalid or missing IPFS_URI.");
    process.exit(1);
}
// --- End Input Validation ---

console.log(`Using RPC URL: ${RPC_URL}`);
console.log(`Using IPFS URI: ${IPFS_URI}`);
console.log(`Attempting coin creation for: ${COIN_NAME} (${COIN_SYMBOL})`);

try {
  // Set up viem account from private key
  const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);
  console.log(`Using Deployer Address: ${account.address}`);

  // Set up viem clients
  const publicClient = createPublicClient({
    chain: base,
    transport: http(RPC_URL),
  });

  const walletClient = createWalletClient({
    account: account,
    chain: base,
    transport: http(RPC_URL),
  });

  // Define coin parameters
  const coinParams = {
    name: COIN_NAME,
    symbol: COIN_SYMBOL,
    uri: IPFS_URI,
    payoutRecipient: account.address, // Payout to the deployer
    // platformReferrer: undefined, // Optional
    initialPurchaseWei: 0n, // Optional: No initial purchase
  };

  console.log("Coin parameters prepared:", coinParams);
  console.log("Calling createCoin function...");

  // Create the coin using the higher-level function
  const result = await createCoin(coinParams, walletClient, publicClient);

  console.log("\n--- Success! ---");
  console.log("Transaction hash:", result.hash);
  console.log("Predicted Coin address:", result.address); // Note: This address is predictable before confirmation
  console.log("Deployment details:", result.deployment);

} catch (error) {
  console.error("\n--- Error creating coin: ---");
  // Log the specific error message and potentially the stack trace
  console.error("Error Message:", error.message);
  if (error.cause) {
      console.error("Cause:", error.cause);
  }
  // Check for specific metadata fetch failure hints
  if (error.message?.includes('Metadata fetch failed') || error.message?.includes('500')) {
      console.error("\n>>> This looks like the same metadata fetch error encountered before. <<<");
  }
  console.error("Full Error Object:", error);
} 