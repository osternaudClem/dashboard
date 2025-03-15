import { App } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { QueryResponse, useGenericMutation } from '@/hooks/use-generic-query';

import { QUERY_KEYS } from './queryKeys';

type NewApp = {
  name: string;
  projectId: string;
};

export const useCreateProjectApp = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<NewApp, QueryResponse<App>>(
    async (datas) => {
      const res = await fetch(`/api/app`, {
        method: 'POST',
        body: JSON.stringify(datas),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.json();
    },
    (response) => {
      if (response.id) {
        const projectId = response.projectId;

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PROJECT_BY_ID, projectId],
        });
      }
    },
    () => [QUERY_KEYS.ALL_USER_PROJECTS],
  );
};
