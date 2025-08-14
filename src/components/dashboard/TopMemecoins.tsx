import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLaunchpadTokens } from "@/hooks/useLaunchpadTokens";
import { LAUNCHPADS, LaunchpadConfig } from "@/services/launchpads/LaunchpadService";

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

const handleLaunchpadClick = (tokenAddress?: string, launchpad?: string) => {
  if (tokenAddress) {
    let url = '';
    switch (launchpad) {
      case 'pumpfun':
        url = `https://pump.fun/${tokenAddress}`;
        break;
      case 'bullme':
        url = `https://bullme.one/token/${tokenAddress}`;
        break;
      case 'raydium':
        url = `https://raydium.io/swap/?outputCurrency=${tokenAddress}`;
        break;
      case 'jupiter':
        url = `https://jup.ag/swap/SOL-${tokenAddress}`;
        break;
      default:
        url = `https://solscan.io/token/${tokenAddress}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

export function TopMemecoins() {
  const [selectedLaunchpad, setSelectedLaunchpad] = useState('all');
  const { tokens, loading, error } = useLaunchpadTokens(selectedLaunchpad, 15);

  // Categorize tokens based on bonding curve progress
  const categorizeTokens = (tokens: any[]) => {
    return {
      newlyCreated: tokens.filter(t => (t.bondingCurveProgress || 0) < 0.8),
      aboutToGraduate: tokens.filter(t => (t.bondingCurveProgress || 0) >= 0.8 && (t.bondingCurveProgress || 0) < 1),
      graduated: tokens.filter(t => (t.bondingCurveProgress || 0) >= 1)
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-pulse">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Trading Dashboard</h2>
            <p className="text-muted-foreground">Live trending tokens from Pump.Fun</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, categoryIndex) => (
            <div key={categoryIndex} className="space-y-4">
              <div className="h-8 bg-white/10 rounded-lg animate-pulse" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/10 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">⚠️</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Failed to Load Data</h3>
        <p className="text-muted-foreground mb-2">Unable to fetch trending tokens</p>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  const categories = categorizeTokens(tokens);
  
  const CategorySection = ({ title, tokens, bgGradient, iconBg, icon }: any) => (
    <div className="space-y-4">
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-xl backdrop-blur-sm",
        "border border-white/10",
        bgGradient
      )}>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
          <span className="text-white font-bold text-sm">{icon}</span>
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <p className="text-sm text-white/70">{tokens.length} tokens</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {tokens.slice(0, 5).map((coin: any, index: number) => (
          <div
            key={coin.id}
            className={cn(
              "group relative overflow-hidden rounded-xl transition-all duration-300",
              "bg-gradient-to-r from-white/5 to-white/2 backdrop-blur-sm",
              "border border-white/10 hover:border-white/20",
              "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10",
              "cursor-pointer"
            )}
            onClick={() => coin.tokenAddress && handleTokenClick(coin.tokenAddress)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20">
                    <img 
                      src={coin.logoUrl} 
                      alt={coin.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{coin.name}</h4>
                    <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-white text-sm">{formatPrice(coin.price)}</p>
                  <div className="flex items-center gap-1">
                    {coin.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span className={cn(
                      "text-xs font-medium",
                      coin.change24h >= 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="text-white font-medium">{formatMarketCap(coin.marketCap)}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-white font-medium">{((coin.bondingCurveProgress || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out",
                        title === "GRADUATED" ? "bg-gradient-to-r from-green-400 to-emerald-500" :
                        title === "ABOUT TO GRADUATE" ? "bg-gradient-to-r from-yellow-400 to-orange-500" :
                        "bg-gradient-to-r from-blue-400 to-cyan-500"
                      )}
                      style={{ width: `${Math.min((coin.bondingCurveProgress || 0) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 retro-button text-xs font-mono"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchpadClick(coin.tokenAddress, selectedLaunchpad);
                  }}
                >
                  VIEW
                </Button>
                
                <Button
                  size="sm"
                  className="flex-1 bg-retro-green text-black hover:bg-retro-green/80 text-xs font-mono font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add buy functionality here
                  }}
                >
                  BUY
                </Button>
              </div>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header with Launchpad Filter */}
      <div className="retro-terminal p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-retro-green flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-black" />
            </div>
            <div>
              <h3 className="text-sm font-mono text-primary font-bold">MEMECOIN SCANNER</h3>
              <p className="text-xs text-muted-foreground font-mono">
                {LAUNCHPADS.find(l => l.id === selectedLaunchpad)?.displayName || 'All Launchpads'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-3 w-3 text-primary" />
            <Select value={selectedLaunchpad} onValueChange={setSelectedLaunchpad}>
              <SelectTrigger className="w-32 h-6 text-xs font-mono border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LAUNCHPADS.map((launchpad) => (
                  <SelectItem key={launchpad.id} value={launchpad.id} className="text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span>{launchpad.icon}</span>
                      <span>{launchpad.displayName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Token Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CategorySection
          title="NEWLY CREATED"
          tokens={categories.newlyCreated}
          bgGradient="bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
          iconBg="bg-gradient-to-r from-blue-500 to-cyan-500"
          icon="🆕"
        />
        
        <CategorySection
          title="ABOUT TO GRADUATE"
          tokens={categories.aboutToGraduate}
          bgGradient="bg-gradient-to-r from-yellow-500/10 to-orange-500/10"
          iconBg="bg-gradient-to-r from-yellow-500 to-orange-500"
          icon="🎓"
        />
        
        <CategorySection
          title="GRADUATED"
          tokens={categories.graduated}
          bgGradient="bg-gradient-to-r from-green-500/10 to-emerald-500/10"
          iconBg="bg-gradient-to-r from-green-500 to-emerald-500"
          icon="✅"
        />
      </div>
    </div>
  );
}