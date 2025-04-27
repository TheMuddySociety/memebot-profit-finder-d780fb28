
import { PublicKey, Connection } from '@solana/web3.js';
import { createSolanaClient } from '@/utils/solanaClient';
import { createUmiClient } from '@/utils/umiClient';

/**
 * Base service with common utilities for NFT operations
 */
export class NFTBaseService {
  /**
   * Get the Solana connection
   */
  protected static getSolanaConnection(): Connection {
    const client = createSolanaClient({ urlOrMoniker: 'devnet' });
    return client.rpc;
  }

  /**
   * Create a Umi instance for Metaplex operations
   */
  protected static createUmiInstance() {
    try {
      // Add some logging to help with debugging
      console.log('Creating UMI instance from NFTBaseService');
      
      // Create a more browser-friendly UMI instance
      const umi = createUmiClient('https://api.devnet.solana.com');
      
      // Verify it has the necessary methods
      if (!umi || typeof umi.rpc?.getLatestBlockhash !== 'function') {
        console.warn('UMI instance is missing expected methods');
        return createFallbackUmiInstance();
      }
      
      return umi;
    } catch (error) {
      console.error('Failed to create UMI instance:', error);
      // Return a fallback UMI instance to avoid null references
      return createFallbackUmiInstance();
    }
  }
  
  /**
   * Find a metadata PDA for a mint address
   */
  protected static findMetadataPda(mintPublicKey: PublicKey): PublicKey {
    const seeds = [
      Buffer.from('metadata'),
      new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(),
      mintPublicKey.toBuffer()
    ];
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      seeds,
      new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
    );
    
    return metadataAddress;
  }
}

/**
 * Creates a minimal fallback UMI instance that won't throw errors
 * when methods are called, used when the real UMI fails to initialize
 */
function createFallbackUmiInstance() {
  console.log('Creating fallback UMI instance for error prevention');
  
  // Return a minimal object with methods that won't crash
  return {
    use: () => createFallbackUmiInstance(),
    rpc: {
      getLatestBlockhash: async () => ({ blockhash: '', lastValidBlockHeight: 0 }),
    },
    programs: {
      get: () => null,
    },
    identity: () => {},
  };
}
