
import { RefreshCw } from "lucide-react";

interface QuoteDetailsProps {
  quote: {
    inAmount: string;
    outAmount: string;
    priceImpactPct?: string;
    routePlan?: Array<any>;
  } | null;
  fromTokenDetails: any;
  toTokenDetails: any;
  amount: number;
  isGettingQuote: boolean;
  maxAccounts?: number;
  priorityLevel?: 'low' | 'medium' | 'high' | 'veryHigh';
  useDynamicSlippage: boolean;
  slippage: number;
}

export function QuoteDetails({ 
  quote, 
  fromTokenDetails, 
  toTokenDetails, 
  amount,
  isGettingQuote,
  maxAccounts,
  priorityLevel,
  useDynamicSlippage,
  slippage
}: QuoteDetailsProps) {
  if (!quote) return null;

  const priceImpact = quote.priceImpactPct ? parseFloat(quote.priceImpactPct) : 0;
  const routeInfo = quote.routePlan ? 
    quote.routePlan.map((route: any) => route.swapInfo?.label || 'Unknown').join(' → ') : 
    'Direct';

  return (
    <div className="retro-card p-2 text-xs font-mono">
      <div className="flex justify-between">
        <span className="text-muted-foreground">RATE:</span>
        <span>{(parseFloat(quote.outAmount) / amount).toFixed(6)} {toTokenDetails?.symbol}/{fromTokenDetails?.symbol}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">IMPACT:</span>
        <span className={priceImpact > 1 ? "text-primary" : "text-retro-green"}>
          {priceImpact.toFixed(3)}%
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">ROUTE:</span>
        <span className="truncate max-w-24">{routeInfo}</span>
      </div>
      {maxAccounts && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Max Accounts</span>
          <span>{maxAccounts}</span>
        </div>
      )}
      {priorityLevel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Priority Fee</span>
          <span className="capitalize">{priorityLevel}</span>
        </div>
      )}
      {useDynamicSlippage && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Dynamic Slippage</span>
          <span className="text-green-500">Enabled (max {slippage}%)</span>
        </div>
      )}
      {isGettingQuote && (
        <div className="flex justify-center">
          <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
