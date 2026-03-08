import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Clock, Crosshair, BarChart3, Brain, Wallet, RotateCcw, History } from "lucide-react";
import { DCABot } from "./bot-tools/DCABot";
import { BuySniper } from "./bot-tools/BuySniper";
import { VolumeBot } from "./bot-tools/VolumeBot";
import { AutoStrategies } from "./bot-tools/AutoStrategies";
import { SimPortfolio } from "./bot-tools/SimPortfolio";
import { TradeHistory } from "./bot-tools/TradeHistory";
import { useSimTrading } from "@/hooks/useSimTrading";
import { useWallet } from "@solana/wallet-adapter-react";

export const BotAccess = () => {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() || null;
  const sim = useSimTrading(walletAddress);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm">Bot Trading Tools</CardTitle>
          <Badge variant="outline" className="text-[10px] bg-[hsl(var(--fun-yellow))]/20 text-[hsl(var(--fun-yellow))] border-[hsl(var(--fun-yellow))]/30 ml-auto">
            PAPER
          </Badge>
        </div>
        {walletAddress && sim.wallet && (
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1.5 text-xs">
              <Wallet className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">Sim Balance:</span>
              <span className="font-mono text-foreground font-medium">
                {sim.wallet.sol_balance.toFixed(4)} SOL
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowHistory(!showHistory)}
                title="Trade History"
              >
                <History className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={sim.resetWallet}
                title="Reset to 10 SOL"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {showHistory ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Trade History</span>
              <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setShowHistory(false)}>
                Back to Tools
              </Button>
            </div>
            <TradeHistory orders={sim.orders} />
            {sim.holdings.length > 0 && <SimPortfolio holdings={sim.holdings} />}
          </div>
        ) : (
          <Tabs defaultValue="sniper" className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-muted/30 h-8 mb-3">
              <TabsTrigger value="sniper" className="text-xs gap-1 data-[state=active]:bg-primary/20">
                <Crosshair className="h-3 w-3" />
                <span className="hidden sm:inline">Sniper</span>
              </TabsTrigger>
              <TabsTrigger value="dca" className="text-xs gap-1 data-[state=active]:bg-accent/20">
                <Clock className="h-3 w-3" />
                <span className="hidden sm:inline">DCA</span>
              </TabsTrigger>
              <TabsTrigger value="volume" className="text-xs gap-1 data-[state=active]:bg-accent/20">
                <BarChart3 className="h-3 w-3" />
                <span className="hidden sm:inline">Volume</span>
              </TabsTrigger>
              <TabsTrigger value="auto" className="text-xs gap-1 data-[state=active]:bg-primary/20">
                <Brain className="h-3 w-3" />
                <span className="hidden sm:inline">Auto</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sniper" className="mt-0">
              <BuySniper sim={sim} />
            </TabsContent>
            <TabsContent value="dca" className="mt-0">
              <DCABot sim={sim} />
            </TabsContent>
            <TabsContent value="volume" className="mt-0">
              <VolumeBot sim={sim} />
            </TabsContent>
            <TabsContent value="auto" className="mt-0">
              <AutoStrategies sim={sim} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
