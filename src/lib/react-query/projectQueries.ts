import { App, Project } from '@prisma/client';

import { QueryResponse, useGenericMutation, useGenericQuery } from '@/hooks/use-generic-query';

import { QUERY_KEYS } from './queryKeys';

type ProjectWithApps = Project & { apps: App[] };

type NewProject = {
  name: string;
  description?: string;
  url?: string;
};

export const useGetMeProjects = () =>
  useGenericQuery([QUERY_KEYS.ALL_USER_PROJECTS], async (): Promise<ProjectWithApps[]> => {
    const res = await fetch(`/api/projects`);
    return res.json();
  });

export const useCreateMeProject = () => {
  return useGenericMutation<NewProject, QueryResponse<Project>>(
    async (datas) => {
      const res = await fetch(`/api/projects`, {
        method: 'POST',
        body: JSON.stringify(datas),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return res.json();
    },
    () => {},
    () => [QUERY_KEYS.ALL_USER_PROJECTS],
  );
};
