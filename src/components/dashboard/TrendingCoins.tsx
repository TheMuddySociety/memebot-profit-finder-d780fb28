import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, RefreshCw, Star, Filter, ArrowUpDown, ExternalLink } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useMemecoins } from '@/hooks/useMemecoins';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format";

export function TrendingCoins() {
  const { 
    memecoins, 
    loading, 
    handleSort, 
    isRefreshing, 
    refreshData 
  } = useMemecoins();
  
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const toggleFavorite = (id: string) => {
    setFavorites(prevFavorites => 
      prevFavorites.includes(id) 
        ? prevFavorites.filter(fav => fav !== id)
        : [...prevFavorites, id]
    );
  };

  const handleTokenClick = (tokenAddress: string) => {
    if (tokenAddress) {
      const solscanUrl = `https://solscan.io/token/${tokenAddress}`;
      window.open(solscanUrl, '_blank', 'noopener,noreferrer');
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
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 gap-1"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={isRefreshing}
              className="h-8 gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Token</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('age')}>
                  <div className="flex items-center gap-1">
                    Age <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('liquidity')}>
                  <div className="flex items-center justify-end gap-1">
                    Liquidity <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('marketCap')}>
                  <div className="flex items-center justify-end gap-1">
                    Market Cap <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Holders</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('price')}>
                  <div className="flex items-center justify-end gap-1">
                    Price <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('change1h')}>
                  <div className="flex items-center justify-end gap-1">
                    1h% <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('change24h')}>
                  <div className="flex items-center justify-end gap-1">
                    24h% <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                          <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><div className="h-4 w-12 bg-muted rounded animate-pulse"></div></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-20 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-12 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-14 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-14 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                    <TableCell className="text-right"><div className="h-6 w-12 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                    <TableCell className="text-right"><div className="h-8 w-16 bg-muted rounded animate-pulse ml-auto"></div></TableCell>
                  </TableRow>
                ))
              ) : (
                memecoins.map((coin) => (
                  <TableRow 
                    key={coin.id} 
                    className={cn(
                      "hover:bg-muted/20 transition-colors",
                      coin.tokenAddress ? "cursor-pointer hover:bg-solana/10" : ""
                    )}
                    onClick={() => coin.tokenAddress && handleTokenClick(coin.tokenAddress)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => toggleFavorite(coin.id)}
                        className="text-yellow-500 hover:text-yellow-300 transition-colors"
                      >
                        <Star className={cn("h-4 w-4", favorites.includes(coin.id) ? "fill-yellow-500" : "")} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                          <img 
                            src={coin.logoUrl} 
                            alt={coin.name} 
                            className="h-full w-full object-cover" 
                            loading="lazy" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            {coin.name}
                            {coin.tokenAddress && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-1">
                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] py-0 px-1 h-4">
                                      V
                                    </Badge>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Verified on-chain - Click to view on Solscan</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {coin.tokenAddress && (
                              <ExternalLink className="h-3 w-3 text-muted-foreground opacity-60" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {coin.symbol}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {coin.age || "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${formatNumber(coin.liquidity || 0)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${formatNumber(coin.marketCap || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(coin.holders || 0)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${coin.price < 0.01 ? coin.price.toExponential(2) : coin.price.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={cn(
                        coin.change1h >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {coin.change1h ? `${coin.change1h > 0 ? '+' : ''}${coin.change1h.toFixed(1)}%` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={cn(
                        coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {coin.change24h ? `${coin.change24h > 0 ? '+' : ''}${coin.change24h.toFixed(1)}%` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Badge variant={coin.status === "NEW" ? "success" : "secondary"} className="text-xs">
                          {coin.status || "LISTED"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs text-green-500 hover:text-green-400 hover:bg-green-500/10">
                          Buy
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10">
                          Sell
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
