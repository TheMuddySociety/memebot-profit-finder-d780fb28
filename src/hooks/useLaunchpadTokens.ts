import { useState, useEffect } from 'react';
import { MemeToken } from '@/types/memeToken';
import { LaunchpadService } from '@/services/launchpads/LaunchpadService';

export function useLaunchpadTokens(launchpadId: string, limit: number = 10) {
  const [tokens, setTokens] = useState<MemeToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTokens = await LaunchpadService.getTokensByLaunchpad(launchpadId, limit);
        
        if (isMounted) {
          setTokens(fetchedTokens);
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
  }, [launchpadId, limit]);

  return { tokens, loading, error };
}