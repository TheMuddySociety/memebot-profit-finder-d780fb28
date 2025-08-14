import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Signal {
  id: string;
  type: 'buy' | 'sell' | 'alert' | 'volume';
  token: string;
  message: string;
  timestamp: number;
  strength: 'low' | 'medium' | 'high';
  price?: number;
  change?: number;
}

const SIGNAL_TYPES = {
  buy: { icon: TrendingUp, color: 'text-retro-green', bg: 'bg-retro-green/20' },
  sell: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-400/20' },
  alert: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  volume: { icon: Zap, color: 'text-blue-400', bg: 'bg-blue-400/20' }
};

const generateSignal = (): Signal => {
  const types: Signal['type'][] = ['buy', 'sell', 'alert', 'volume'];
  const tokens = ['PEPE', 'DOGE', 'SHIB', 'FLOKI', 'BONK', 'WIF', 'MEME', 'TRUMP'];
  const type = types[Math.floor(Math.random() * types.length)];
  const token = tokens[Math.floor(Math.random() * tokens.length)];
  const strength: Signal['strength'] = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Signal['strength'];
  
  const messages = {
    buy: [
      `Strong buy signal detected`,
      `Whale accumulation spotted`,
      `Breaking resistance level`,
      `High volume breakout`
    ],
    sell: [
      `Profit taking detected`,
      `Support level broken`,
      `Large sell orders`,
      `Bearish divergence`
    ],
    alert: [
      `Unusual activity detected`,
      `New whale wallet spotted`,
      `Listing announcement rumor`,
      `Social sentiment spike`
    ],
    volume: [
      `Volume surge +200%`,
      `Highest 24h volume`,
      `DEX activity spike`,
      `Trading bot detected`
    ]
  };

  return {
    id: `signal-${Date.now()}-${Math.random()}`,
    type,
    token,
    message: messages[type][Math.floor(Math.random() * messages[type].length)],
    timestamp: Date.now(),
    strength,
    price: Math.random() * 0.01,
    change: (Math.random() - 0.5) * 100
  };
};

export function LiveSignalFeed() {
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    // Initialize with some signals
    setSignals(Array.from({ length: 5 }, generateSignal));

    // Add new signal every 3-8 seconds
    const interval = setInterval(() => {
      setSignals(prev => {
        const newSignal = generateSignal();
        const updated = [newSignal, ...prev].slice(0, 20); // Keep only latest 20
        return updated;
      });
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  const getStrengthColor = (strength: Signal['strength']) => {
    switch (strength) {
      case 'high': return 'border-retro-green text-retro-green';
      case 'medium': return 'border-yellow-400 text-yellow-400';
      case 'low': return 'border-gray-400 text-gray-400';
    }
  };

  return (
    <Card className="retro-terminal h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-mono text-primary flex items-center gap-2">
          <Activity className="h-4 w-4 text-retro-green animate-pulse" />
          LIVE SIGNALS
          <Badge variant="outline" className="text-xs font-mono border-retro-green text-retro-green">
            {signals.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {signals.map((signal, index) => {
              const signalConfig = SIGNAL_TYPES[signal.type];
              const Icon = signalConfig.icon;
              
              return (
                <div
                  key={signal.id}
                  className={cn(
                    "p-2 rounded border border-white/10 transition-all duration-500",
                    "hover:border-primary/50",
                    index === 0 ? "animate-fade-in" : "",
                    signalConfig.bg
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Icon className={cn("h-3 w-3 mt-0.5", signalConfig.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-primary font-bold">
                          ${signal.token}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs px-1 py-0 h-4", getStrengthColor(signal.strength))}
                        >
                          {signal.strength.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {signal.message}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        {signal.price && (
                          <span className="text-xs font-mono text-primary">
                            ${signal.price.toFixed(6)}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(signal.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}