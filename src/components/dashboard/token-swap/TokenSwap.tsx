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
    script.onload = () => {
      if (window.Jupiter) {
        window.Jupiter.init({
          displayMode: "integrated",
          integratedTargetId: "target-container",
          formProps: {
            fixedAmount: true,
            fixedMint: "So11111111111111111111111111111111111111112",
            referralAccount: "F4qYkXAcogrjQHw3ngKWjisMmmRFR4Ea6c9DCCpK5gBr",
            referralFee: 150,
          },
          enableWalletPassthrough: true,
          branding: {
            name: "D3 SAVAGE SWAP",
            logoUri: "https://ibb.co/0VFDBzYQ",
          },
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script
      document.head.removeChild(script);
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
