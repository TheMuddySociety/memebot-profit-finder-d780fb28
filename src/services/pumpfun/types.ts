export interface PumpFunToken {
  address: string;
  symbol: string;
  name: string;
  totalSupply: number;
  decimals: number;
  logo: string;
  creator: string;
  description: string;
  showName: boolean;
  twitter: string;
  telegram: string;
  website: string;
  blockNumber: number;
  hash: string;
  source: string;
  dex: string | null;
  timestamp: number;
  migrateTime: number | null;
  completeTime: number | null;
  marketCap: number;
  tradeVolume: number;
  tradeCount: number;
  top10Holder: number;
  bondingCurveProgress: number;
  status: string;
  tradeVolume24h: number;
  buyVolume24h: number;
  sellVolume24h: number;
  tradeCount24h: number;
  buyCount24h: number;
  sellCount24h: number;
  liquidity: number;
}

export interface PumpFunApiResponse {
  code: number;
  msg: string;
  ts: number;
  data: PumpFunToken[];
}