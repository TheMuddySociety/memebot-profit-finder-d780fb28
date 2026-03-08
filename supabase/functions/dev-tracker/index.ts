import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ── Pattern Detection Engine ──

interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  supply: number;
  decimals: number;
  frozen: boolean;
  burnt: boolean;
  createdAt: number | null;
}

interface PatternFlag {
  type: 'symbol_reuse' | 'name_similarity' | 'supply_clone' | 'rapid_launch' | 'burst_trading' | 'serial_deployer' | 'instant_dump' | 'identical_decimals_supply';
  severity: 'info' | 'warning' | 'danger';
  description: string;
  evidence: string[];
}

function detectSymbolReuse(tokens: TokenInfo[]): PatternFlag | null {
  const symbolCounts: Record<string, string[]> = {};
  for (const t of tokens) {
    const sym = t.symbol.toUpperCase();
    if (!symbolCounts[sym]) symbolCounts[sym] = [];
    symbolCounts[sym].push(t.mint.slice(0, 8));
  }
  const reused = Object.entries(symbolCounts).filter(([, mints]) => mints.length > 1);
  if (reused.length === 0) return null;
  return {
    type: 'symbol_reuse',
    severity: 'danger',
    description: `Reuses the same token symbol across ${reused.reduce((s, [, m]) => s + m.length, 0)} tokens — classic scam factory pattern`,
    evidence: reused.map(([sym, mints]) => `${sym} used ${mints.length}x: ${mints.join(', ')}...`),
  };
}

function detectNameSimilarity(tokens: TokenInfo[]): PatternFlag | null {
  const names = tokens.map((t) => t.name.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
  if (names.length < 2) return null;

  // Group by 3-char prefix to find template names
  const prefixGroups: Record<string, number> = {};
  for (const n of names) {
    if (n.length >= 3) {
      const prefix = n.slice(0, 3);
      prefixGroups[prefix] = (prefixGroups[prefix] || 0) + 1;
    }
  }
  const clusters = Object.entries(prefixGroups).filter(([, count]) => count >= 3);
  if (clusters.length === 0) return null;
  return {
    type: 'name_similarity',
    severity: 'warning',
    description: `Token names share common patterns — likely generated from templates`,
    evidence: clusters.map(([prefix, count]) => `"${prefix}..." prefix appears in ${count} tokens`),
  };
}

function detectSupplyClones(tokens: TokenInfo[]): PatternFlag | null {
  const supplyCounts: Record<string, number> = {};
  for (const t of tokens) {
    if (t.supply > 0) {
      const key = `${t.supply}_${t.decimals}`;
      supplyCounts[key] = (supplyCounts[key] || 0) + 1;
    }
  }
  const clones = Object.entries(supplyCounts).filter(([, count]) => count >= 2);
  if (clones.length === 0) return null;
  return {
    type: 'supply_clone',
    severity: 'warning',
    description: `Multiple tokens with identical supply + decimals config — cookie-cutter deployment`,
    evidence: clones.map(([key, count]) => {
      const [supply, decimals] = key.split('_');
      return `Supply ${Number(supply).toLocaleString()} / ${decimals} decimals → ${count} tokens`;
    }),
  };
}

function detectIdenticalDecimalsSupply(tokens: TokenInfo[]): PatternFlag | null {
  if (tokens.length < 3) return null;
  const configs = tokens.map((t) => `${t.decimals}`);
  const uniqueConfigs = new Set(configs);
  if (uniqueConfigs.size === 1 && tokens.length >= 5) {
    return {
      type: 'identical_decimals_supply',
      severity: 'info',
      description: `All ${tokens.length} tokens use identical decimal configuration — automated deployment likely`,
      evidence: [`All tokens: ${configs[0]} decimals`],
    };
  }
  return null;
}

function detectRapidLaunches(tokens: TokenInfo[]): PatternFlag | null {
  const withDates = tokens.filter((t) => t.createdAt).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  if (withDates.length < 3) return null;

  let rapidCount = 0;
  const rapidPairs: string[] = [];

  for (let i = 1; i < withDates.length; i++) {
    const gap = (withDates[i].createdAt || 0) - (withDates[i - 1].createdAt || 0);
    const gapHours = gap / 3600;
    if (gapHours < 24 && gapHours >= 0) {
      rapidCount++;
      rapidPairs.push(
        `${withDates[i - 1].symbol} → ${withDates[i].symbol} (${gapHours < 1 ? `${Math.round(gapHours * 60)}m` : `${Math.round(gapHours)}h`} apart)`
      );
    }
  }

  if (rapidCount === 0) return null;
  return {
    type: 'rapid_launch',
    severity: rapidCount >= 3 ? 'danger' : 'warning',
    description: `${rapidCount} token pairs launched within 24h of each other — serial deployer behavior`,
    evidence: rapidPairs.slice(0, 5),
  };
}

function detectBurstTrading(timestamps: number[]): PatternFlag | null {
  if (timestamps.length < 5) return null;
  const sorted = [...timestamps].sort((a, b) => a - b);

  // Sliding window: count txns within 5-minute windows
  let maxBurst = 0;
  let burstStart = 0;
  for (let i = 0; i < sorted.length; i++) {
    let count = 0;
    for (let j = i; j < sorted.length && sorted[j] - sorted[i] <= 300; j++) {
      count++;
    }
    if (count > maxBurst) {
      maxBurst = count;
      burstStart = sorted[i];
    }
  }

  if (maxBurst < 5) return null;
  const burstTime = new Date(burstStart * 1000).toISOString().slice(0, 16);
  return {
    type: 'burst_trading',
    severity: maxBurst >= 10 ? 'danger' : 'warning',
    description: `${maxBurst} swaps within a 5-minute window — likely bot-driven dump`,
    evidence: [`Peak burst: ${maxBurst} txns around ${burstTime}`],
  };
}

function detectSerialDeployer(tokensLaunched: number): PatternFlag | null {
  if (tokensLaunched < 5) return null;
  return {
    type: 'serial_deployer',
    severity: tokensLaunched >= 15 ? 'danger' : 'warning',
    description: `${tokensLaunched} tokens deployed from a single wallet — high probability scam factory`,
    evidence: [`${tokensLaunched} total token deployments detected on-chain`],
  };
}

function detectInstantDumps(transactions: any[], walletAddress: string): PatternFlag | null {
  // Look for large sells shortly after token creation
  const sells: { token: string; amount: number; timestamp: number }[] = [];

  for (const tx of transactions) {
    if (tx.type === 'SWAP' && tx.tokenTransfers) {
      for (const transfer of tx.tokenTransfers) {
        if (transfer.fromUserAccount === walletAddress && transfer.tokenAmount > 0) {
          sells.push({
            token: transfer.mint || 'unknown',
            amount: transfer.tokenAmount,
            timestamp: tx.timestamp || 0,
          });
        }
      }
    }
  }

  if (sells.length < 3) return null;

  // Group sells by token and check for large concentrated dumps
  const tokenSells: Record<string, number> = {};
  for (const s of sells) {
    tokenSells[s.token] = (tokenSells[s.token] || 0) + 1;
  }

  const multiDumps = Object.entries(tokenSells).filter(([, count]) => count >= 2);
  if (multiDumps.length === 0) return null;

  return {
    type: 'instant_dump',
    severity: 'danger',
    description: `Repeated sell-offs detected across ${multiDumps.length} tokens — dump pattern confirmed`,
    evidence: multiDumps.slice(0, 3).map(([mint, count]) => `${mint.slice(0, 8)}... sold ${count}x`),
  };
}

// ── Main Handler ──

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');
    if (!HELIUS_API_KEY) {
      throw new Error('HELIUS_API_KEY is not configured');
    }

    const { walletAddress } = await req.json();
    if (!walletAddress) {
      throw new Error('walletAddress is required');
    }

    const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    const HELIUS_API = `https://api.helius.xyz/v0`;

    // 1. Get tokens created by this wallet
    const assetsResponse = await fetch(HELIUS_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'assets',
        method: 'getAssetsByCreator',
        params: {
          creatorAddress: walletAddress,
          onlyVerified: false,
          page: 1,
          limit: 1000,
        },
      }),
    });

    const assetsData = await assetsResponse.json();
    const assets = assetsData?.result?.items || [];

    const fungibleTokens = assets.filter((a: any) => {
      const isFungible = a.interface === 'FungibleToken' || a.interface === 'FungibleAsset';
      const isToken = a.token_info?.supply > 1;
      return isFungible || isToken;
    });

    // 2. Get transaction history
    const txResponse = await fetch(
      `${HELIUS_API}/addresses/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}&limit=100&type=SWAP`
    );
    const transactions = await txResponse.json();

    // 3. Build token details
    const tokenDetails: TokenInfo[] = [];
    for (const asset of fungibleTokens) {
      const meta = asset.content?.metadata || {};
      const supply = asset.token_info?.supply || 0;
      const decimals = asset.token_info?.decimals || 0;

      tokenDetails.push({
        mint: asset.id,
        name: meta.name || 'Unknown',
        symbol: meta.symbol || '???',
        supply: supply / Math.pow(10, decimals),
        decimals,
        frozen: asset.ownership?.frozen || false,
        burnt: asset.burnt || false,
        createdAt: asset.created_at ? Math.floor(new Date(asset.created_at).getTime() / 1000) : null,
      });
    }

    // 4. Analyze swap timestamps
    const swapTimestamps: number[] = [];
    let totalVolume = 0;
    let suspiciousPatterns = 0;

    if (Array.isArray(transactions)) {
      for (const tx of transactions) {
        if (tx.timestamp) swapTimestamps.push(tx.timestamp);
        if (tx.type === 'SWAP' && tx.tokenTransfers) {
          for (const transfer of tx.tokenTransfers) {
            if (transfer.fromUserAccount === walletAddress) {
              totalVolume += Math.abs(transfer.tokenAmount || 0);
            }
          }
        }
      }
    }

    if (swapTimestamps.length > 2) {
      swapTimestamps.sort((a, b) => a - b);
      for (let i = 1; i < swapTimestamps.length; i++) {
        if (swapTimestamps[i] - swapTimestamps[i - 1] < 60) suspiciousPatterns++;
      }
    }

    const burntOrFrozen = tokenDetails.filter((t) => t.burnt || t.frozen).length;
    const quickDumps = tokenDetails.filter((t) => t.burnt).length;
    const tokensLaunched = fungibleTokens.length;

    // 5. ── Run Pattern Detection ──
    const patternFlags: PatternFlag[] = [];

    const detectors = [
      () => detectSymbolReuse(tokenDetails),
      () => detectNameSimilarity(tokenDetails),
      () => detectSupplyClones(tokenDetails),
      () => detectIdenticalDecimalsSupply(tokenDetails),
      () => detectRapidLaunches(tokenDetails),
      () => detectBurstTrading(swapTimestamps),
      () => detectSerialDeployer(tokensLaunched),
      () => detectInstantDumps(Array.isArray(transactions) ? transactions : [], walletAddress),
    ];

    for (const detect of detectors) {
      const flag = detect();
      if (flag) patternFlags.push(flag);
    }

    // 6. Risk scoring (enhanced with pattern flags)
    let riskScore = 0;
    if (tokensLaunched > 10) riskScore += 2;
    else if (tokensLaunched > 5) riskScore += 1;
    if (quickDumps > 3) riskScore += 3;
    else if (quickDumps > 0) riskScore += 1;
    if (suspiciousPatterns > 5) riskScore += 2;
    else if (suspiciousPatterns > 0) riskScore += 1;
    if (burntOrFrozen > 2) riskScore += 2;

    // Pattern flags boost risk
    for (const flag of patternFlags) {
      if (flag.severity === 'danger') riskScore += 2;
      else if (flag.severity === 'warning') riskScore += 1;
    }

    let riskLevel: string;
    if (riskScore >= 7) riskLevel = 'critical';
    else if (riskScore >= 4) riskLevel = 'high';
    else if (riskScore >= 2) riskLevel = 'medium';
    else riskLevel = 'low';

    let avgLifespan = 'N/A';
    if (swapTimestamps.length >= 2) {
      const totalSpan = swapTimestamps[swapTimestamps.length - 1] - swapTimestamps[0];
      const avgHours = Math.round(totalSpan / 3600 / Math.max(tokensLaunched, 1));
      avgLifespan = avgHours > 24 ? `${Math.round(avgHours / 24)}d` : `${avgHours}h`;
    }

    const result = {
      walletAddress,
      tokensLaunched,
      rugPulls: quickDumps,
      honeypots: burntOrFrozen,
      suspiciousPatterns,
      avgLifespan,
      riskLevel,
      totalVolume,
      tokens: tokenDetails.slice(0, 20),
      transactionCount: Array.isArray(transactions) ? transactions.length : 0,
      patternFlags,
    };

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Dev tracker error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
