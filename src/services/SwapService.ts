
import { Connection } from '@solana/web3.js';
import { JupiterQuoteService, JupiterTransactionService, TokenService } from './jupiter';

/**
 * Main Swap Service to handle token swaps on Solana
 * This service uses Jupiter API to provide the best swap routes
 */
export class SwapService {
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
  ) {
    return JupiterTransactionService.swapTokens(
      connection,
      wallet,
      fromToken, 
      toToken, 
      amount, 
      slippageBps,
      maxAccounts,
      priorityLevel,
      useDynamicSlippage
    );
  }

  /**
   * Get Jupiter API quote for a token swap
   * @param inputMint Input token mint address
   * @param outputMint Output token mint address
   * @param amount Amount to swap in lamports
   * @param slippageBps Slippage tolerance in basis points
   * @param maxAccounts Optional parameter to limit the number of accounts in the transaction
   * @returns Quote response from Jupiter API or null if failed
   */
  static getJupiterQuote(
    inputMint: string,
    outputMint: string, 
    amount: number,
    slippageBps: number = 100,
    maxAccounts?: number
  ) {
    return JupiterQuoteService.getJupiterQuote(
      inputMint,
      outputMint,
      amount,
      slippageBps,
      maxAccounts
    );
  }

  /**
   * Get Jupiter API swap transaction
   * @param quoteResponse Quote response from Jupiter API
   * @param userPublicKey User's wallet public key
   * @param priorityLevel Optional priority level for transaction
   * @param dynamicSlippageBps Optional slippage in basis points for dynamic slippage
   * @returns Transaction object or null if failed
   */
  static getJupiterSwapTransaction(
    quoteResponse: any,
    userPublicKey: string,
    priorityLevel?: 'low' | 'medium' | 'high' | 'veryHigh',
    dynamicSlippageBps?: number
  ) {
    return JupiterTransactionService.getJupiterSwapTransaction(
      quoteResponse,
      userPublicKey,
      priorityLevel,
      dynamicSlippageBps
    );
  }

  /**
   * Get quote for a token swap
   * @param connection Solana connection
   * @param fromToken Token to swap from (mint address)
   * @param toToken Token to swap to (mint address)
   * @param amount Amount to swap in lamports
   * @param maxAccounts Optional parameter to limit the number of accounts in the transaction
   * @returns Quote information or null if failed
   */
  static getSwapQuote(
    connection: Connection,
    fromToken: string,
    toToken: string,
    amount: number,
    maxAccounts?: number
  ) {
    return JupiterQuoteService.getSwapQuote(
      connection,
      fromToken,
      toToken,
      amount,
      maxAccounts
    );
  }

  /**
   * Get common token list for Solana
   * @returns List of common tokens with their details
   */
  static getCommonTokens() {
    return TokenService.getCommonTokens();
  }
}
