'use client';

import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { useGetAppById } from '@/lib/react-query/appQueries';
import { useGetProjectById } from '@/lib/react-query/projectQueries';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem> = {
  project: { title: 'Project', link: '/' },
};

const useBreadcrumbs = () => {
  const pathname = usePathname();
  const params = useParams();
  const projectId = (params.projectId as string) || undefined;
  const appId = (params.appId as string) || undefined;

  const { data: project, isFetching: isProjectFetching } = useGetProjectById(projectId);
  const { data: app, isFetching: isAppFetching } = useGetAppById(appId);

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);

    return segments.map((segment, index) => {
      if (routeMapping[segment]) {
        return routeMapping[segment];
      }

      // check if segment equal to a project id
      if (project) {
        if (project.id === segment) {
          return {
            title: project.name,
            link: `/project/${project.id}`,
          };
        }

        if (segment === 'app') {
          return {
            title: 'App',
            link: `/project/${project.id}`,
          };
        }
      }

      // check if segment equal to an app id
      if (app && app.id === segment) {
        return {
          title: app.name,
          link: `/project/${project?.id}/app/${app.id}`,
        };
      }

      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      };
    });
  }, [app, pathname, project]);

  if (isProjectFetching || isAppFetching) {
    return [];
  }

  return breadcrumbs;
};

export { useBreadcrumbs };
