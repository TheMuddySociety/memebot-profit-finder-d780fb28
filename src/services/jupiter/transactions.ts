
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { toast } from 'sonner';
import fetch from 'cross-fetch';
import { JupiterQuoteService } from './quotes';

/**
 * Service for executing Jupiter swap transactions
 */
export class JupiterTransactionService {
  /**
   * Get Jupiter API swap transaction
   * @param quoteResponse Quote response from Jupiter API
   * @param userPublicKey User's wallet public key
   * @param priorityLevel Optional priority level for transaction
   * @param dynamicSlippageBps Optional slippage in basis points for dynamic slippage
   * @returns Transaction object or null if failed
   */
  static async getJupiterSwapTransaction(
    quoteResponse: any,
    userPublicKey: string,
    priorityLevel?: 'low' | 'medium' | 'high' | 'veryHigh',
    dynamicSlippageBps?: number
  ): Promise<VersionedTransaction | null> {
    try {
      // Jupiter V6 API endpoint for swap transactions
      const swapUrl = 'https://quote-api.jup.ag/v6/swap';
      
      const swapRequestBody: any = {
        quoteResponse,
        userPublicKey,
        wrapAndUnwrapSol: true, // Auto wrap/unwrap SOL
        dynamicComputeUnitLimit: true, // Allow dynamic compute limit instead of max 1,400,000
      };
      
      // Add priority fee if specified
      if (priorityLevel) {
        swapRequestBody.prioritizationFeeLamports = {
          priorityLevelWithMaxLamports: {
            maxLamports: 10000000, // 0.01 SOL max
            priorityLevel: priorityLevel
          }
        };
      }
      
      // Add dynamic slippage if specified
      if (dynamicSlippageBps) {
        swapRequestBody.dynamicSlippage = {
          maxBps: dynamicSlippageBps
        };
        console.log(`Using dynamic slippage with max ${dynamicSlippageBps} bps`);
      }
      
      console.log('Fetching Jupiter swap transaction', swapRequestBody);
      const response = await fetch(swapUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(swapRequestBody)
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching swap transaction: ${response.status} ${response.statusText}`);
      }
      
      const swapResponse = await response.json();
      
      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapResponse.swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      
      return transaction;
    } catch (error) {
      console.error('Error getting Jupiter swap transaction:', error);
      toast.error("Failed to prepare swap transaction");
      return null;
    }
  }

  /**
   * Perform a V6 token swap
   * @param connection Solana connection
   * @param wallet Connected wallet
   * @param fromToken Token to swap from (mint address)
   * @param toToken Token to swap to (mint address)
   * @param amount Amount to swap in lamports
   * @param slippageBps Slippage tolerance in basis points (100 = 1%)
   * @param maxAccounts Optional parameter to limit the number of accounts in the transaction
   * @param priorityLevel Optional priority level for transaction "low", "medium", "high", "veryHigh"
   * @param useDynamicSlippage Whether to use dynamic slippage optimization
   * @returns Transaction signature or null if failed
   */
  static async swapTokens(
    connection: Connection,
    wallet: any,
    fromToken: string,
    toToken: string,
    amount: number,
    slippageBps: number = 100,
    maxAccounts?: number,
    priorityLevel?: 'low' | 'medium' | 'high' | 'veryHigh',
    useDynamicSlippage: boolean = false
  ): Promise<string | null> {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        toast.error("Wallet not connected");
        return null;
      }

      console.log(`Swapping ${amount} of ${fromToken} to ${toToken} with ${slippageBps} bps slippage`);
      
      // Get quote from Jupiter API
      const quoteResponse = await JupiterQuoteService.getJupiterQuote(fromToken, toToken, amount, slippageBps, maxAccounts);
      if (!quoteResponse) return null;
      
      // Get swap transaction from Jupiter API
      const swapTransaction = await this.getJupiterSwapTransaction(
        quoteResponse, 
        wallet.publicKey.toString(),
        priorityLevel,
        useDynamicSlippage ? slippageBps : undefined
      );
      if (!swapTransaction) return null;
      
      // Sign and send the transaction
      const signedTx = await wallet.signTransaction(swapTransaction);
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      
      toast.success(`Swap transaction sent! ${txid.substring(0, 8)}...`);
      
      // Confirm transaction
      const confirmation = await connection.confirmTransaction(txid);
      if (confirmation.value.err) {
        toast.error(`Transaction failed: ${confirmation.value.err}`);
        return null;
      }
      
      toast.success("Swap completed successfully!");
      return txid;
    } catch (error) {
      console.error('Error performing swap:', error);
      toast.error(`Failed to perform swap: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }
}
