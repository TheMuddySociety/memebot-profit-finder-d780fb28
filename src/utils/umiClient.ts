
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { PublicKey } from '@solana/web3.js';
import { mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';

/**
 * Create a UMI instance for Metaplex operations
 * @param endpoint Optional RPC endpoint (defaults to devnet)
 * @returns Configured UMI instance
 */
export function createUmiClient(endpoint: string = 'https://api.devnet.solana.com') {
  try {
    console.log('Creating UMI client with endpoint:', endpoint);
    
    // Ensure polyfills are in place
    if (typeof window !== 'undefined') {
      if (!window.Buffer) {
        console.warn('Buffer polyfill missing, some UMI features may not work');
      }
      if (!window.process) {
        console.warn('Process polyfill missing, some UMI features may not work');
      }
    }
    
    // Create UMI instance with better browser compatibility
    const umi = createUmi(endpoint);
    
    // Wrap in try/catch to prevent errors from propagating
    let umiWithCandyMachine;
    try {
      // Add the Candy Machine plugin
      umiWithCandyMachine = umi.use(mplCandyMachine());
    } catch (error) {
      console.warn('Failed to initialize Candy Machine plugin, continuing with base UMI:', error);
      return umi; // Return basic UMI if plugin fails
    }
    
    console.log('UMI client created successfully');
    return umiWithCandyMachine;
  } catch (error) {
    console.error('Error creating UMI client:', error);
    
    // Create a minimal placeholder UMI instance to avoid crashes
    const mockUmi: any = {
      use: () => mockUmi,
      rpc: {
        getLatestBlockhash: async () => ({ blockhash: '', lastValidBlockHeight: 0 }),
      },
      payer: { publicKey: publicKey('11111111111111111111111111111111') },
      // Add minimal functions to prevent errors
      programs: {
        get: () => null,
      },
      identity: () => {},
    };
    return mockUmi;
  }
}

/**
 * Convert a Solana web3.js PublicKey to UMI publicKey
 * @param key Solana web3.js PublicKey
 * @returns UMI publicKey
 */
export function toUmiPublicKey(key: PublicKey) {
  return publicKey(key.toBase58());
}

/**
 * Convert a UMI publicKey to Solana web3.js PublicKey
 * @param key UMI publicKey
 * @returns Solana web3.js PublicKey
 */
export function fromUmiPublicKey(key: string) {
  return new PublicKey(key);
}
