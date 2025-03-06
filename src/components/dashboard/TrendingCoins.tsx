
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, BarChart2, Eye, RefreshCw } from "lucide-react";
import { mockMemecoins } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { SolanaService } from '@/services/SolanaService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface MemeToken {
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
  tokenAddress?: string; // Add Solana token address
  onChainLiquidity?: number | null; // Add on-chain liquidity data
  onChainHolders?: number; // Add on-chain holders count
}

export function TrendingCoins() {
  const [memecoins, setMemecoins] = useState<MemeToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('change24h');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enhance memecoins with on-chain data
  const enrichWithOnChainData = async (coins: MemeToken[]) => {
    const enrichedCoins = [...coins];
    
    // Add simulated token addresses if they don't exist
    enrichedCoins.forEach((coin, index) => {
      if (!coin.tokenAddress) {
        // Generate a simulated token address for demo purposes
        coin.tokenAddress = `So1ana${index}MemeToken${coin.id.slice(0, 8)}111111111111111`;
      }
    });
    
    // Fetch on-chain data for each token
    for (const coin of enrichedCoins) {
      if (coin.tokenAddress) {
        try {
          // Get on-chain liquidity data
          const liquidity = await SolanaService.getTokenLiquidity(coin.tokenAddress);
          if (liquidity !== null) {
            coin.onChainLiquidity = liquidity;
          }
          
          // Simulated on-chain holders (in a real app, you'd fetch this from the blockchain)
          coin.onChainHolders = Math.floor(Math.random() * 10000) + 100;
        } catch (error) {
          console.error(`Error fetching on-chain data for ${coin.symbol}:`, error);
        }
      }
    }
    
    return enrichedCoins;
  };

  useEffect(() => {
    // Simulate API fetch with on-chain data
    const fetchData = async () => {
      setLoading(true);
      
      // Initialize Solana connection
      SolanaService.initConnection();
      
      // In a real app, you would fetch from an API
      try {
        setTimeout(async () => {
          // Get mock data and enrich it with on-chain data
          const enrichedCoins = await enrichWithOnChainData(mockMemecoins);
          setMemecoins(enrichedCoins);
          setLoading(false);
          console.log('Enriched memecoins with on-chain data:', enrichedCoins);
        }, 1500);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch token data');
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up price monitoring
    const tokenAddresses = mockMemecoins
      .filter(coin => coin.tokenAddress)
      .map(coin => coin.tokenAddress as string);
      
    const stopMonitoring = SolanaService.startPriceMonitoring(tokenAddresses, (updates) => {
      console.log('Price updates:', updates);
      // In a real app, you would update the prices based on these updates
    });
    
    return () => {
      stopMonitoring();
    };
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const enrichedCoins = await enrichWithOnChainData(memecoins);
      setMemecoins([...enrichedCoins]);
      toast.success('On-chain data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const sortedMemecoins = [...memecoins].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    // @ts-ignore
    return direction * (a[sortBy] - b[sortBy]);
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const handleSort = (field: string) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  return (
    <Card className="memecoin-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl">
            <BarChart2 className="h-5 w-5 text-solana" /> 
            Trending Memecoins
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isRefreshing}
            className="h-8 gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh On-Chain Data'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="p-2 text-left font-medium text-muted-foreground">Token</th>
                <th 
                  className="p-2 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('price')}
                >
                  Price
                </th>
                <th 
                  className="p-2 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => handleSort('change24h')}
                >
                  24h %
                </th>
                <th
                  className="p-2 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground hidden md:table-cell"
                  onClick={() => handleSort('volume24h')}
                >
                  Volume
                </th>
                <th
                  className="p-2 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground hidden md:table-cell"
                  onClick={() => handleSort('liquidity')}
                >
                  Liquidity
                </th>
                <th
                  className="p-2 text-right font-medium text-muted-foreground hidden lg:table-cell"
                >
                  Holders
                </th>
                <th className="p-2 text-center font-medium text-muted-foreground hidden lg:table-cell">Tags</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    <td className="p-2 text-right"><Skeleton className="h-4 w-14 ml-auto" /></td>
                    <td className="p-2 text-right hidden md:table-cell"><Skeleton className="h-4 w-20 ml-auto" /></td>
                    <td className="p-2 text-right hidden lg:table-cell"><Skeleton className="h-4 w-20 ml-auto" /></td>
                    <td className="p-2 text-center hidden lg:table-cell"><Skeleton className="h-6 w-24 mx-auto" /></td>
                  </tr>
                ))
              ) : (
                sortedMemecoins.map((coin) => (
                  <tr key={coin.id} className="border-b border-border hover:bg-muted/20 cursor-pointer transition-colors">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img 
                            src={coin.logoUrl} 
                            alt={coin.name} 
                            className="h-full w-full object-cover" 
                            loading="lazy" 
                          />
                        </div>
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-xs flex items-center gap-1">
                            <span className="text-muted-foreground">{coin.symbol}</span>
                            {coin.tokenAddress && (
                              <Badge variant="outline" className="text-[10px] py-0 h-4">
                                On-chain
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-right font-mono">
                      ${coin.price < 0.01 ? coin.price.toExponential(2) : coin.price.toFixed(2)}
                    </td>
                    <td className="p-2 text-right">
                      <span className={cn(
                        "flex items-center justify-end gap-1 font-medium",
                        coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {coin.change24h >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {Math.abs(coin.change24h).toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-2 text-right font-mono hidden md:table-cell">{formatNumber(coin.volume24h)}</td>
                    <td className="p-2 text-right font-mono hidden md:table-cell">
                      {coin.onChainLiquidity 
                        ? formatNumber(coin.onChainLiquidity)
                        : formatNumber(coin.liquidity)}
                    </td>
                    <td className="p-2 text-right hidden lg:table-cell">
                      {coin.onChainHolders ? coin.onChainHolders.toLocaleString() : coin.holders.toLocaleString()}
                    </td>
                    <td className="p-2 text-center hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {coin.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
