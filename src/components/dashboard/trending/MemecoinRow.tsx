
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format";
import { MemeToken } from '@/types/memeToken';

interface MemecoinRowProps {
  coin: MemeToken;
}

export function MemecoinRow({ coin }: MemecoinRowProps) {
  return (
    <tr className="border-b border-border hover:bg-muted/20 cursor-pointer transition-colors">
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
  );
}
