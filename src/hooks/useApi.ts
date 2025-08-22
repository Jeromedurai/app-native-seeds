import { useState, useEffect, useCallback } from 'react';
import { LoadingState } from '../types';

interface UseApiOptions {
  immediate?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<void>;
  reset: () => void;
}

export const useApi = <T>(
  apiFunction: () => Promise<{ data: T; success: boolean; message?: string }>,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { immediate = false } = options;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction();
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

// Hook for async operations with loading state
export const useAsyncOperation = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T | null> => {
    setLoadingState({ isLoading: true, error: null });
    
    try {
      const result = await asyncFunction();
      setLoadingState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setLoadingState({ isLoading: false, error: errorMessage });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setLoadingState({ isLoading: false, error: null });
  }, []);

  return {
    ...loadingState,
    execute,
    reset,
  };
}; 