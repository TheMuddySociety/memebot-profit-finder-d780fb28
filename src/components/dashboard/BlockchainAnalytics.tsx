
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Activity, AlertCircle, RefreshCw } from "lucide-react";
import { SolanaService } from '@/services/SolanaService';
import { toast } from 'sonner';

interface Transaction {
  signature: string;
  slot: number;
  timestamp?: string;
  err: any;
  memo?: string;
}

export function BlockchainAnalytics() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      setIsRefreshing(true);
      const txs = await SolanaService.getRecentMemeTransactions(15);
      setTransactions(txs);
      console.log('Fetched transactions:', txs);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch blockchain data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Initialize Solana connection
    SolanaService.initConnection();
    
    // Fetch initial data
    fetchTransactions();
    
    // Set up automatic refresh every 2 minutes
    const intervalId = setInterval(fetchTransactions, 120000);
    
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString();
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const refreshData = () => {
    fetchTransactions();
  };

  return (
    <Card className="memecoin-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-5 w-5 text-solana" />
            Solana Memecoin Activity
          </div>
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="transactions" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>Recent Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>Market Insights</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto rounded-md border">
              {isLoading ? (
                <div className="space-y-2 p-4">
                  {Array(5).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No recent transactions found
                </div>
              ) : (
                <div className="divide-y">
                  {transactions.map((tx) => (
                    <div key={tx.signature} className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between mb-1">
                        <span className="font-mono text-xs text-muted-foreground">
                          {shortenAddress(tx.signature)}
                        </span>
                        <span className={`text-xs ${tx.err ? 'text-red-500' : 'text-green-500'}`}>
                          {tx.err ? 'Failed' : 'Success'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(tx.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-md">
              <h3 className="font-semibold mb-2">On-Chain Insights</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-1">
                  <span className="text-solana">•</span>
                  <span>High transaction velocity detected on Raydium DEX, indicating potential new memecoin launches</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-solana">•</span>
                  <span>Unusual wallet activity detected with 3 wallets accumulating over 5% of circulating supply in $BONK</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-solana">•</span>
                  <span>Recent Jupiter swaps show increased interest in low-cap memecoins with $PEPE derivatives seeing 125% increase in volume</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-solana">•</span>
                  <span>SPL token creation rate is 237% higher than 30-day average, signaling potential market saturation</span>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-muted/10">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">24h New Tokens</div>
                  <div className="text-xl font-bold">127</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/10">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">Avg. Initial Liquidity</div>
                  <div className="text-xl font-bold">$23.4K</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
