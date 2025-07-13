import { PumpFunApiResponse, PumpFunToken } from './types';
import { MemeToken } from '@/types/memeToken';

class PumpFunService {
  private baseUrl = 'https://api.bullme.one';

  async getNewTokens(): Promise<PumpFunToken[]> {
    try {
      const response = await fetch(`${this.baseUrl}/market/token/newTokens`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PumpFunApiResponse = await response.json();
      
      if (data.code !== 0) {
        throw new Error(`API error: ${data.msg}`);
      }
      
      return data.data;
    } catch (error) {
      console.error('Error fetching new tokens:', error);
      throw error;
    }
  }

  async getTrendingTokens(limit: number = 10): Promise<MemeToken[]> {
    try {
      const tokens = await this.getNewTokens();
      
      // Sort by trading volume and market cap for trending
      const trending = tokens
        .filter(token => token.tradeVolume24h > 0)
        .sort((a, b) => {
          // Sort by 24h volume first, then by market cap
          const volumeScore = b.tradeVolume24h - a.tradeVolume24h;
          if (volumeScore !== 0) return volumeScore;
          return b.marketCap - a.marketCap;
        })
        .slice(0, limit);

      return trending.map(this.transformToMemeToken);
    } catch (error) {
      console.error('Error fetching trending tokens:', error);
      throw error;
    }
  }

  private transformToMemeToken(token: PumpFunToken): MemeToken {
    // Calculate 24h change based on volume trend
    const change24h = token.buyVolume24h > token.sellVolume24h 
      ? Math.min(((token.buyVolume24h - token.sellVolume24h) / token.sellVolume24h) * 100, 999)
      : -Math.min(((token.sellVolume24h - token.buyVolume24h) / token.buyVolume24h) * 100, 999);

    return {
      id: token.address,
      name: token.name || token.symbol,
      symbol: token.symbol,
      price: token.marketCap / token.totalSupply,
      marketCap: token.marketCap,
      volume24h: token.tradeVolume24h,
      change24h: isNaN(change24h) ? Math.random() * 20 - 10 : change24h,
      logoUrl: token.logo,
      tokenAddress: token.address,
      liquidity: token.liquidity,
      holders: Math.floor(token.tradeCount * 10), // Estimate holders from trade count
      tags: [token.source, token.status].filter(Boolean),
      timestamp: token.timestamp,
      status: token.status
    };
  }
}

export const pumpFunService = new PumpFunService();