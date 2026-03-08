import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface SimOrder {
  id: string;
  bot_type: string;
  token_symbol: string;
  side: string;
  sol_amount: number;
  token_amount: number;
  pnl_percent?: number;
  created_at: string;
}

interface Props {
  orders: SimOrder[];
}

export const TradeHistory = ({ orders }: Props) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-4 text-xs text-muted-foreground">
        No trades yet. Start a bot to begin paper trading!
      </div>
    );
  }

  return (
    <div className="space-y-1.5 max-h-60 overflow-y-auto">
      {orders.slice(0, 20).map((order) => (
        <div key={order.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/10 border border-border">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 ${order.side === 'buy' ? 'text-accent border-accent/30' : 'text-primary border-primary/30'}`}
            >
              {order.side.toUpperCase()}
            </Badge>
            <div>
              <span className="text-xs font-medium text-foreground">{order.token_symbol}</span>
              <p className="text-[10px] text-muted-foreground">
                {order.bot_type} · {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-foreground">{order.sol_amount.toFixed(4)} SOL</p>
            {order.pnl_percent != null && (
              <span className={`text-[10px] font-mono ${order.pnl_percent >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {order.pnl_percent >= 0 ? '+' : ''}{order.pnl_percent.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
