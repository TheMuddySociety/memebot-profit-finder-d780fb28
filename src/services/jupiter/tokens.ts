
import { BullmeService } from '../bullme/BullmeService';

/**
 * Service for token-related utilities
 */
export class TokenService {
  private static cachedTokens: any[] | null = null;

  /**
   * Get common token list for Solana
   * @returns List of common tokens with their details
   */
  static getCommonTokens() {
    // Return cached tokens if available
    if (this.cachedTokens) {
      return this.cachedTokens;
    }

    // Default tokens to use if API fails or before API response is available
    const defaultTokens = [
      {
        symbol: "SOL",
        name: "Solana",
        mint: "So11111111111111111111111111111111111111112",
        decimals: 9,
        logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        decimals: 6,
        logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
      }
    ];

    // Fetch new tokens from Bullme API in the background
    this.fetchTokensFromBullme();
    
    return defaultTokens;
  }

  /**
   * Fetch tokens from the Bullme API and cache them
   */
  private static async fetchTokensFromBullme() {
    try {
      const newTokens = await BullmeService.getNewTokens();
      const mappedTokens = BullmeService.mapToCommonTokens(newTokens);
      
      // Add default SOL and USDC tokens to the beginning of the list
      const defaultTokens = [
        {
          symbol: "SOL",
          name: "Solana",
          mint: "So11111111111111111111111111111111111111112",
          decimals: 9,
          logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
        },
        {
          symbol: "USDC",
          name: "USD Coin",
          mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          decimals: 6,
          logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
        }
      ];
      
      this.cachedTokens = [...defaultTokens, ...mappedTokens];
      console.log('Tokens fetched from Bullme API:', this.cachedTokens);
      return this.cachedTokens;
    } catch (error) {
      console.error('Error fetching tokens from Bullme API:', error);
      return this.getCommonTokens();
    }
  }

  /**
   * Get all tokens (including new listings from Bullme API)
   * This method can be used to refresh the token list
   */
  static async getAllTokens() {
    try {
      return await this.fetchTokensFromBullme();
    } catch (error) {
      console.error('Error getting all tokens:', error);
      return this.getCommonTokens();
    }
  }
}
