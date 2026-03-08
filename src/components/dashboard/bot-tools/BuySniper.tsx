import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Crosshair, Zap, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  sim: any;
}

export const BuySniper = ({ sim }: Props) => {
  const { toast } = useToast();
  const [isArmed, setIsArmed] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [buyAmount, setBuyAmount] = useState("0.5");
  const [maxSlippage, setMaxSlippage] = useState("15");
  const [priorityFee, setPriorityFee] = useState("0.005");
  const [autoSell, setAutoSell] = useState(false);
  const [takeProfitPercent, setTakeProfitPercent] = useState("100");
  const sniperInterval = useRef<NodeJS.Timeout | null>(null);

  // When armed, simulate periodic checks
  const startSniping = useCallback(() => {
    if (sniperInterval.current) clearInterval(sniperInterval.current);

    // Execute immediate buy simulation
    const executeBuy = async () => {
      const result = await sim.simulateBuy(
        tokenAddress,
        tokenSymbol || tokenAddress.slice(0, 6),
        parseFloat(buyAmount),
        'sniper'
      );
      if (result) {
        setIsArmed(false);
        if (sniperInterval.current) clearInterval(sniperInterval.current);
        toast({
          title: "🎯 Sniper Hit!",
          description: `Bought ${result.token_amount.toFixed(2)} ${tokenSymbol || 'tokens'} for ${buyAmount} SOL`,
        });
      }
    };

    // Simulate finding liquidity after 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    sniperInterval.current = setTimeout(executeBuy, delay) as any;
  }, [tokenAddress, tokenSymbol, buyAmount, sim, toast]);

  useEffect(() => {
    return () => {
      if (sniperInterval.current) clearInterval(sniperInterval.current);
    };
  }, []);

  const handleArm = () => {
    if (!tokenAddress) {
      toast({ title: "Missing token", description: "Enter a token address to snipe", variant: "destructive" });
      return;
    }
    if (!isArmed) {
      setIsArmed(true);
      startSniping();
      toast({ title: "Sniper Armed 🎯", description: `Watching for ${tokenAddress.slice(0, 8)}...` });
    } else {
      setIsArmed(false);
      if (sniperInterval.current) clearInterval(sniperInterval.current);
      toast({ title: "Sniper Disarmed", description: "Buy sniper deactivated" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Buy Sniper</span>
        </div>
        {isArmed && (
          <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">
            🎯 Armed
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">Token Address</Label>
          <Input
            placeholder="Paste token mint address..."
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="bg-muted/30 border-border text-sm font-mono"
            disabled={isArmed}
          />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Token Symbol (optional)</Label>
          <Input
            placeholder="e.g. BONK"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="bg-muted/30 border-border text-sm"
            disabled={isArmed}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Buy Amount (SOL)</Label>
            <Input
              type="number"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="bg-muted/30 border-border text-sm"
              disabled={isArmed}
              min="0.01"
              step="0.1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Max Slippage (%)</Label>
            <Input
              type="number"
              value={maxSlippage}
              onChange={(e) => setMaxSlippage(e.target.value)}
              className="bg-muted/30 border-border text-sm"
              disabled={isArmed}
              min="1"
              max="50"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Priority Fee (SOL)</Label>
          <div className="flex gap-1 mt-1">
            {["0.001", "0.005", "0.01", "0.05"].map((fee) => (
              <Button
                key={fee}
                variant={priorityFee === fee ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs h-7"
                onClick={() => setPriorityFee(fee)}
                disabled={isArmed}
              >
                {fee}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-2 rounded-lg bg-muted/20 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 text-muted-foreground" />
              <Label className="text-xs text-muted-foreground">Auto Take-Profit</Label>
            </div>
            <Switch checked={autoSell} onCheckedChange={setAutoSell} disabled={isArmed} />
          </div>
          {autoSell && (
            <div>
              <Label className="text-xs text-muted-foreground">Sell at +%</Label>
              <Input
                type="number"
                value={takeProfitPercent}
                onChange={(e) => setTakeProfitPercent(e.target.value)}
                className="bg-muted/30 border-border text-sm h-7"
                disabled={isArmed}
                min="10"
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleArm}
          disabled={sim.isLoading}
          className={`w-full ${isArmed ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'} text-primary-foreground`}
          size="sm"
        >
          {sim.isLoading ? (
            <><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" /> Processing...</>
          ) : isArmed ? (
            <><Crosshair className="h-4 w-4 mr-2" /> Disarm Sniper</>
          ) : (
            <><Zap className="h-4 w-4 mr-2" /> Arm Sniper (Paper)</>
          )}
        </Button>
      </div>
    </div>
  );
};
