'use client';

import Link from 'next/link';

import { ChevronRight, Plus } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useGetMeProjects } from '@/lib/react-query/projectQueries';

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-300 ${className}`} />;
}

function SidebarSkeleton() {
  return (
    <div className="w-64 space-y-4 p-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-6 w-4/5" />
    </div>
  );
}

export function NavMain() {
  const { data: projects = [], isFetching: isProjectFetching } = useGetMeProjects();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupAction title="Add Project" asChild>
        <Link href="/project/create">
          <Plus />
        </Link>
      </SidebarGroupAction>
      <SidebarMenu>
        {isProjectFetching ? (
          <SidebarSkeleton />
        ) : (
          projects.map((item, key) => (
            <Collapsible
              key={item.id}
              asChild
              defaultOpen={key === 0}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.name}>
                    <Avatar className="rounded border">
                      <AvatarFallback className="rounded-none">
                        {item.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.name}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.apps?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/app/${subItem.id}`}>
                            <span>{subItem.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
