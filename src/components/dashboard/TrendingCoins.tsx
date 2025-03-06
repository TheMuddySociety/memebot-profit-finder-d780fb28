
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, RefreshCw } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useMemecoins } from '@/hooks/useMemecoins';
import { MemecoinTableHeader } from './trending/MemecoinTableHeader';
import { MemecoinSkeleton } from './trending/MemecoinSkeleton';
import { MemecoinRow } from './trending/MemecoinRow';

export function TrendingCoins() {
  const { 
    memecoins, 
    loading, 
    handleSort, 
    isRefreshing, 
    refreshData 
  } = useMemecoins();

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
            <MemecoinTableHeader onSort={handleSort} />
            <tbody>
              {loading ? (
                <MemecoinSkeleton />
              ) : (
                memecoins.map((coin) => (
                  <MemecoinRow key={coin.id} coin={coin} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
