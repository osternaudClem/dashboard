import { App } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { QueryResponse, useGenericMutation, useGenericQuery } from '@/hooks/use-generic-query';

import { ProjectWithApps } from './projectQueries';
import { QUERY_KEYS } from './queryKeys';

type NewApp = {
  name: string;
  projectId: string;
};

type UpdateApp = {
  name?: string;
  apiKey?: string;
};

export const useGetAppById = (appId?: string) =>
  useGenericQuery<App | null>(
    [QUERY_KEYS.APP_BY_ID, appId],
    async (): Promise<App | null> => {
      const res = await fetch(`/api/app/${appId}`);
      return res.json();
    },
    {
      enabled: !!appId,
    },
  );

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

export const useUpdateProjectApp = (appId: string) => {
  const queryClient = useQueryClient();

  return useGenericMutation<UpdateApp, QueryResponse<App>>(
    async (datas) => {
      const res = await fetch(`/api/app/${appId}`, {
        method: 'PUT',
        body: JSON.stringify(datas),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.json();
    },
    (response) => {
      if (response.id) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.APP_BY_ID, appId],
        });

        queryClient.setQueryData(
          [QUERY_KEYS.ALL_USER_PROJECTS],
          (oldProjects: ProjectWithApps[] | undefined) => {
            if (!oldProjects) return oldProjects;

            return oldProjects.map((project) => ({
              ...project,
              apps: project.apps.map((app) => (app.id === response.id ? response : app)),
            }));
          },
        );
      }
    },
  );
};

export const useDeleteProjectApp = () => {
  const queryClient = useQueryClient();

  return useGenericMutation<string, QueryResponse<App>>(
    async (id) => {
      const res = await fetch(`/api/app/${id}`, {
        method: 'DELETE',
      });

      return res.json();
    },
    (response) => {
      const projectId = response.projectId;

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECT_BY_ID, projectId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALL_USER_PROJECTS],
      });
    },
  );
};
