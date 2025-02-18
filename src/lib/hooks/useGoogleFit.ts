import { useState, useCallback } from 'react';
import { fetchFitnessData, type FitnessData } from '../googleFit';
import { toast } from 'sonner';

export function useGoogleFit(accessToken: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [data, setData] = useState<FitnessData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refreshData = useCallback(async () => {
    if (!accessToken) {
      toast.error('Please connect to Google Fit first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fitnessData = await fetchFitnessData(accessToken);
      setData(fitnessData);
      setLastSync(new Date());
      toast.success('Data refreshed successfully');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch fitness data'));
      toast.error('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    data,
    isLoading,
    lastSync,
    error,
    refreshData
  };
}