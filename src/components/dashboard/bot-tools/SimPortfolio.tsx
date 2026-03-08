import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SimHolding {
  token_symbol: string;
  amount: number;
  avg_buy_price: number;
  total_invested: number;
  current_value?: number;
  pnl_percent?: number;
}

interface Props {
  holdings: SimHolding[];
}

export const SimPortfolio = ({ holdings }: Props) => {
  if (holdings.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-muted-foreground">Holdings</span>
      {holdings.map((h, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border">
          <div>
            <span className="text-sm font-medium text-foreground">{h.token_symbol}</span>
            <p className="text-[10px] text-muted-foreground font-mono">{h.amount.toFixed(2)} tokens</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-foreground">{h.total_invested.toFixed(4)} SOL</p>
            {h.pnl_percent !== undefined && (
              <Badge
                variant="outline"
                className={`text-[10px] ${h.pnl_percent >= 0 ? 'text-accent border-accent/30' : 'text-destructive border-destructive/30'}`}
              >
                {h.pnl_percent >= 0 ? <TrendingUp className="h-2 w-2 mr-0.5" /> : <TrendingDown className="h-2 w-2 mr-0.5" />}
                {h.pnl_percent >= 0 ? '+' : ''}{h.pnl_percent.toFixed(1)}%
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
