import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryFunction, UseMutationResult, UseQueryResult } from '@tanstack/react-query';

export type QueryResponse<T> = {
  error?: {
    message: string;
  };
  data?: T;
  count?: number;
  code?: number;
};

export type MutationResponse = {
  success: boolean;
};

export const useGenericQuery = <T>(
  queryKey: Array<string | number>,
  queryFn: QueryFunction<T>,
  options?: { enabled?: boolean },
): UseQueryResult<T> => {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
};

export const useGenericMutation = <TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  onSuccessCallback?: (data: TData, variables: TVariables) => void,
  invalidateKeys?: (variables: TVariables) => Array<string | Array<string | number>>,
): UseMutationResult<TData, unknown, TVariables, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => {
      if (onSuccessCallback) {
        onSuccessCallback(data, variables as TVariables);
      }
      if (invalidateKeys) {
        const keysToInvalidate = invalidateKeys(variables);

        keysToInvalidate.forEach((key: string | (string | number)[]) => {
          queryClient.invalidateQueries({
            queryKey: Array.isArray(key) ? key.flat() : [key],
          });
        });
      }
    },
  });
};
