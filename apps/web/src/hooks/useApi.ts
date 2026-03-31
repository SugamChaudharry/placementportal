"use client";

import { useState, useEffect, useCallback } from "react";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useQuery<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = [],
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (options.enabled === false) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, options.enabled]);

  useEffect(() => {
    fetch();
  }, deps);

  return { data, isLoading, error, refetch: fetch };
}

export function useMutation<T, V = any>(
  mutateFn: (variables: V) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: V) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mutateFn(variables);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mutateFn]);

  return { mutate, data, isLoading, error };
}

// Auth hooks
export { useAuth } from "./useAuth";
