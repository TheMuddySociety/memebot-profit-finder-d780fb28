import { pumpFunService } from '../pumpfun';
import { BullmeService } from '../bullme/BullmeService';
import { MemeToken } from '@/types/memeToken';

export interface LaunchpadConfig {
  id: string;
  name: string;
  displayName: string;
  color: string;
  icon: string;
}

export const LAUNCHPADS: LaunchpadConfig[] = [
  {
    id: 'all',
    name: 'All Launchpads',
    displayName: 'All',
    color: 'bg-primary',
    icon: '🚀'
  },
  {
    id: 'pumpfun',
    name: 'Pump.Fun',
    displayName: 'Pump.Fun',
    color: 'bg-green-500',
    icon: '💎'
  },
  {
    id: 'bullme',
    name: 'Bullme.one',
    displayName: 'Bullme',
    color: 'bg-blue-500',
    icon: '🐂'
  },
  {
    id: 'raydium',
    name: 'Raydium',
    displayName: 'Raydium',
    color: 'bg-purple-500',
    icon: '⚡'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    displayName: 'Jupiter',
    color: 'bg-orange-500',
    icon: '🪐'
  }
];

export class LaunchpadService {
  private static cache = new Map<string, { data: MemeToken[], timestamp: number }>();
  private static readonly CACHE_DURATION = 30000; // 30 seconds

  static async getTokensByLaunchpad(launchpadId: string, limit: number = 10): Promise<MemeToken[]> {
    const cacheKey = `${launchpadId}-${limit}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    let tokens: MemeToken[] = [];

    try {
      switch (launchpadId) {
        case 'all':
          tokens = await this.getAllTokens(limit);
          break;
        case 'pumpfun':
          tokens = await pumpFunService.getTrendingTokens(limit);
          break;
        case 'bullme':
          const bullmeTokens = await BullmeService.getNewTokens();
          tokens = this.mapBullmeToMemeTokens(bullmeTokens.slice(0, limit));
          break;
        case 'raydium':
          tokens = await this.getMockRaydiumTokens(limit);
          break;
        case 'jupiter':
          tokens = await this.getMockJupiterTokens(limit);
          break;
        default:
          tokens = await pumpFunService.getTrendingTokens(limit);
      }

      this.cache.set(cacheKey, { data: tokens, timestamp: Date.now() });
      return tokens;
    } catch (error) {
      console.error(`Error fetching tokens from ${launchpadId}:`, error);
      return cached?.data || [];
    }
  }

  private static async getAllTokens(limit: number): Promise<MemeToken[]> {
    try {
      const [pumpFunTokens, bullmeTokens] = await Promise.all([
        pumpFunService.getTrendingTokens(Math.ceil(limit * 0.4)),
        BullmeService.getNewTokens()
      ]);

      const mappedBullme = this.mapBullmeToMemeTokens(bullmeTokens.slice(0, Math.ceil(limit * 0.3)));
      const mockRaydium = await this.getMockRaydiumTokens(Math.ceil(limit * 0.2));
      const mockJupiter = await this.getMockJupiterTokens(Math.ceil(limit * 0.1));

      const allTokens = [...pumpFunTokens, ...mappedBullme, ...mockRaydium, ...mockJupiter];
      
      // Sort by volume and return top tokens
      return allTokens
        .sort((a, b) => b.volume24h - a.volume24h)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching all tokens:', error);
      return [];
    }
  }

  private static mapBullmeToMemeTokens(bullmeTokens: any[]): MemeToken[] {
    return bullmeTokens.map((token, index) => ({
      id: token.address || `bullme-${index}`,
      name: token.name || `Token ${index + 1}`,
      symbol: token.symbol || 'UNK',
      price: parseFloat(token.price) || Math.random() * 0.01,
      marketCap: parseFloat(token.fdv) || Math.random() * 1000000,
      volume24h: parseFloat(token.volume24h) || Math.random() * 100000,
      change24h: parseFloat(token.change24h) || (Math.random() - 0.5) * 200,
      logoUrl: token.logoURI || '/placeholder.svg',
      tokenAddress: token.address,
      liquidity: parseFloat(token.liquidity) || Math.random() * 50000,
      holders: parseInt(token.holders) || Math.floor(Math.random() * 1000),
      tags: ['Bullme', 'New'],
      timestamp: Date.now(),
      bondingCurveProgress: Math.random()
    }));
  }

  private static async getMockRaydiumTokens(limit: number): Promise<MemeToken[]> {
    return Array.from({ length: limit }, (_, i) => ({
      id: `raydium-${i}`,
      name: `Raydium Token ${i + 1}`,
      symbol: `RAY${i + 1}`,
      price: Math.random() * 0.1,
      marketCap: Math.random() * 5000000,
      volume24h: Math.random() * 200000,
      change24h: (Math.random() - 0.5) * 100,
      logoUrl: '/placeholder.svg',
      tokenAddress: `ray${i}${'x'.repeat(40)}`,
      liquidity: Math.random() * 100000,
      holders: Math.floor(Math.random() * 2000),
      tags: ['Raydium', 'DEX'],
      timestamp: Date.now(),
      bondingCurveProgress: Math.random()
    }));
  }

  private static async getMockJupiterTokens(limit: number): Promise<MemeToken[]> {
    return Array.from({ length: limit }, (_, i) => ({
      id: `jupiter-${i}`,
      name: `Jupiter Token ${i + 1}`,
      symbol: `JUP${i + 1}`,
      price: Math.random() * 0.05,
      marketCap: Math.random() * 3000000,
      volume24h: Math.random() * 150000,
      change24h: (Math.random() - 0.5) * 80,
      logoUrl: '/placeholder.svg',
      tokenAddress: `jup${i}${'x'.repeat(40)}`,
      liquidity: Math.random() * 75000,
      holders: Math.floor(Math.random() * 1500),
      tags: ['Jupiter', 'Swap'],
      timestamp: Date.now(),
      bondingCurveProgress: Math.random()
    }));
  }
}