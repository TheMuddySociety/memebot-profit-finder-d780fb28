import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ExternalLink, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemecoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  rank: number;
  marketCap: number;
  price: number;
  change24h: number;
  volume24h: number;
  tokenAddress?: string;
}

// Mock data for top 10 memecoins with high market cap
const topMemecoins: MemecoinData[] = [
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    image: "https://assets.coingecko.com/coins/images/5/thumb/dogecoin.png",
    rank: 1,
    marketCap: 28500000000,
    price: 0.195,
    change24h: 5.2,
    volume24h: 2800000000,
    tokenAddress: "DGECoin1111111111111111111111111111111111"
  },
  {
    id: "shiba-inu",
    name: "Shiba Inu",
    symbol: "SHIB",
    image: "https://assets.coingecko.com/coins/images/11939/thumb/shiba.png",
    rank: 2,
    marketCap: 15200000000,
    price: 0.0000258,
    change24h: -2.1,
    volume24h: 890000000,
    tokenAddress: "SHIBCoin111111111111111111111111111111111"
  },
  {
    id: "pepe",
    name: "Pepe",
    symbol: "PEPE",
    image: "https://assets.coingecko.com/coins/images/29850/thumb/pepe-token.jpeg",
    rank: 3,
    marketCap: 8900000000,
    price: 0.00002115,
    change24h: 8.7,
    volume24h: 2100000000,
    tokenAddress: "PEPECoin111111111111111111111111111111111"
  },
  {
    id: "dogwifhat",
    name: "dogwifhat",
    symbol: "WIF",
    image: "https://assets.coingecko.com/coins/images/33767/thumb/dogwifhat.jpg",
    rank: 4,
    marketCap: 3200000000,
    price: 3.21,
    change24h: 12.4,
    volume24h: 450000000,
    tokenAddress: "WIFCoin1111111111111111111111111111111111"
  },
  {
    id: "bonk",
    name: "Bonk",
    symbol: "BONK",
    image: "https://assets.coingecko.com/coins/images/28600/thumb/bonk.jpg",
    rank: 5,
    marketCap: 2800000000,
    price: 0.00003985,
    change24h: -3.8,
    volume24h: 380000000,
    tokenAddress: "BONKCoin111111111111111111111111111111111"
  },
  {
    id: "floki",
    name: "FLOKI",
    symbol: "FLOKI",
    image: "https://assets.coingecko.com/coins/images/16746/thumb/floki.png",
    rank: 6,
    marketCap: 2100000000,
    price: 0.000218,
    change24h: 6.9,
    volume24h: 290000000,
    tokenAddress: "FLOKICoin11111111111111111111111111111111"
  },
  {
    id: "babydoge",
    name: "Baby Doge Coin",
    symbol: "BABYDOGE",
    image: "https://assets.coingecko.com/coins/images/16125/thumb/babydoge.jpg",
    rank: 7,
    marketCap: 1500000000,
    price: 0.0000000024,
    change24h: -1.2,
    volume24h: 85000000,
    tokenAddress: "BABYDOGECoin1111111111111111111111111111"
  },
  {
    id: "mog-coin",
    name: "Mog Coin",
    symbol: "MOG",
    image: "https://assets.coingecko.com/coins/images/31415/thumb/mog.png",
    rank: 8,
    marketCap: 1200000000,
    price: 0.0000030,
    change24h: 15.6,
    volume24h: 120000000,
    tokenAddress: "MOGCoin1111111111111111111111111111111111"
  },
  {
    id: "popcat",
    name: "Popcat",
    symbol: "POPCAT",
    image: "https://assets.coingecko.com/coins/images/31659/thumb/popcat.png",
    rank: 9,
    marketCap: 950000000,
    price: 0.98,
    change24h: -4.3,
    volume24h: 95000000,
    tokenAddress: "POPCATCoin111111111111111111111111111111"
  },
  {
    id: "brett",
    name: "Brett",
    symbol: "BRETT",
    image: "https://assets.coingecko.com/coins/images/30548/thumb/brett.png",
    rank: 10,
    marketCap: 890000000,
    price: 0.089,
    change24h: 7.2,
    volume24h: 78000000,
    tokenAddress: "BRETTCoin11111111111111111111111111111111"
  }
];

const formatMarketCap = (value: number): string => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const formatPrice = (price: number): string => {
  if (price < 0.000001) return `$${price.toFixed(10)}`;
  if (price < 0.01) return `$${price.toFixed(8)}`;
  if (price < 1) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(4)}`;
};

const handleTokenClick = (tokenAddress?: string) => {
  if (tokenAddress) {
    const solscanUrl = `https://solscan.io/token/${tokenAddress}`;
    window.open(solscanUrl, '_blank', 'noopener,noreferrer');
  }
};

export function TopMemecoins() {
  return (
    <Card className="glass-effect border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-red-400 to-green-400 bg-clip-text text-transparent flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-400" />
          Top 10 Memecoins by Market Cap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topMemecoins.map((coin, index) => (
            <div
              key={coin.id}
              className={cn(
                "glass-effect p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]",
                "border border-white/10 hover:border-white/20",
                coin.tokenAddress ? "cursor-pointer hover:bg-white/5" : ""
              )}
              onClick={() => coin.tokenAddress && handleTokenClick(coin.tokenAddress)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Badge 
                      variant="outline" 
                      className="absolute -top-2 -left-2 z-10 bg-gradient-to-r from-purple-500 to-red-500 text-white border-none text-xs min-w-6 h-6 flex items-center justify-center"
                    >
                      #{coin.rank}
                    </Badge>
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20">
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{coin.name}</h3>
                      <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300">
                        {coin.symbol}
                      </Badge>
                      {coin.tokenAddress && (
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-60" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">Market Cap: {formatMarketCap(coin.marketCap)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-white">{formatPrice(coin.price)}</p>
                    <div className="flex items-center gap-1">
                      {coin.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        coin.change24h >= 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-right hidden md:block">
                    <p className="text-sm text-gray-400">Volume 24h</p>
                    <p className="text-sm font-medium text-white">{formatMarketCap(coin.volume24h)}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="glass-effect border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-400/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add buy functionality here
                    }}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}