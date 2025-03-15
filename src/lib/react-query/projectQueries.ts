import { App, Project } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { QueryResponse, useGenericMutation, useGenericQuery } from '@/hooks/use-generic-query';

import { QUERY_KEYS } from './queryKeys';

export type ProjectWithApps = Project & { apps: App[] };

type NewProject = {
  name: string;
  description?: string;
  url?: string;
};

export const useGetMeProjects = () => {
  const queryClient = useQueryClient();

  return useGenericQuery([QUERY_KEYS.ALL_USER_PROJECTS], async (): Promise<ProjectWithApps[]> => {
    const res = await fetch(`/api/projects`);
    const projects: ProjectWithApps[] = await res.json();

    projects.forEach((project) =>
      project.apps.forEach((app) => {
        queryClient.setQueryData([QUERY_KEYS.APP_BY_ID, app.id], app);
      }),
    );

    return projects;
  });
};

export const useGetProjectById = (projectId?: string) =>
  useGenericQuery<ProjectWithApps | null>(
    [QUERY_KEYS.PROJECT_BY_ID, projectId],
    async (): Promise<ProjectWithApps | null> => {
      const res = await fetch(`/api/projects/${projectId}`);
      return res.json();
    },
    {
      enabled: !!projectId,
    },
  );

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
