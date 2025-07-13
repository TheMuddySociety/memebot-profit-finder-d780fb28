import { useState, useEffect } from 'react';
import { MemeToken } from '@/types/memeToken';
import { pumpFunService } from '@/services/pumpfun';

export function usePumpFunTokens(limit: number = 10) {
  const [tokens, setTokens] = useState<MemeToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError(null);
        const trendingTokens = await pumpFunService.getTrendingTokens(limit);
        
        if (isMounted) {
          setTokens(trendingTokens);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTokens();

    // Refresh every 30 seconds
    const interval = setInterval(fetchTokens, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [limit]);

  return { tokens, loading, error };
}