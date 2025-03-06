
export interface MemeToken {
  id: string;
  name: string;
  symbol: string;
  logoUrl: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  launchDate: string;
  tags: string[];
  liquidity: number;
  holders: number;
  tokenAddress: string;
  onChainLiquidity?: number | null;
  onChainHolders?: number;
}
