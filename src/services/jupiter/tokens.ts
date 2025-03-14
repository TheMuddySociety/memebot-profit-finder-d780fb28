
/**
 * Service for token-related utilities
 */
export class TokenService {
  /**
   * Get common token list for Solana
   * @returns List of common tokens with their details
   */
  static getCommonTokens() {
    return [
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
      },
      {
        symbol: "BONK",
        name: "Bonk",
        mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        decimals: 5,
        logoURI: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I"
      },
      {
        symbol: "WIF",
        name: "Dogwifhat",
        mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
        decimals: 6,
        logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm/logo.png"
      },
      {
        symbol: "BOME",
        name: "Book of Meme",
        mint: "BVg7GgxUXLVh38Y1bhrVzGdDvAJvyhvF3MNCkpRnuoT5",
        decimals: 6,
        logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BVg7GgxUXLVh38Y1bhrVzGdDvAJvyhvF3MNCkpRnuoT5/logo.png"
      }
    ];
  }
}
