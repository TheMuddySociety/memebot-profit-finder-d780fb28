import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDownUp } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';

declare global {
  interface Window {
    Jupiter: {
      init: (config: any) => void;
      syncProps: (props: any) => void;
    };
  }
}

export function TokenSwap() {
  const passthroughWalletContextState = useWallet();

  // To make sure passthrough wallet are synced
  useEffect(() => {
    if (!window.Jupiter?.syncProps) return;
    window.Jupiter.syncProps({ passthroughWalletContextState });
  }, [passthroughWalletContextState.connected]);

  useEffect(() => {
    // Load Jupiter Terminal script
    const script = document.createElement('script');
    script.src = 'https://terminal.jup.ag/main-v2.js';
    script.async = true;
    script.onload = () => {
      console.log('Jupiter script loaded successfully');
      if (window.Jupiter) {
        console.log('Initializing Jupiter terminal...');
        window.Jupiter.init({
          displayMode: "integrated",
          integratedTargetId: "target-container",
          endpoint: "https://quote-api.jup.ag/v6",
          formProps: {
            fixedOutputMint: false,
            swapMode: "ExactIn",
            initialAmount: "1000000",
            initialInputMint: "So11111111111111111111111111111111111111112",
            initialOutputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
          },
          enableWalletPassthrough: true,
          onSuccess: ({ txid }) => {
            console.log('Swap successful:', txid);
          },
          onSwapError: ({ error }) => {
            console.error('Swap error:', error);
          }
        });
      } else {
        console.error('Jupiter object not available');
      }
    };
    script.onerror = (error) => {
      console.error('Failed to load Jupiter Terminal script:', error);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script
      const existingScript = document.querySelector('script[src="https://terminal.jup.ag/main-v2.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <Card className="memecoin-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ArrowDownUp className="h-5 w-5 text-solana" />
          D3 SAVAGE SWAP
        </CardTitle>
        <CardDescription>
          Swap your tokens at the best rates across multiple DEXs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          id="target-container"
          className="min-h-[400px] w-full"
        />
      </CardContent>
    </Card>
  );
}
