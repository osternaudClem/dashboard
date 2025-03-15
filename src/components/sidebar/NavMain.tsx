'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';

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
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectWithApps, useGetMeProjects } from '@/lib/react-query/projectQueries';

const SidebarSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-10" />
      <Skeleton className="h-4" />
      <Skeleton className="h-4" />
      <Skeleton className="h-4" />
    </div>
  );
};

type CollapsibleMenuProps = {
  isOpen?: boolean;
  item: ProjectWithApps;
};

const CollapsibleMenu = ({ isOpen = false, item }: CollapsibleMenuProps) => {
  const [open, setOpen] = useState(isOpen);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const openSubMenu = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <Collapsible
      asChild
      defaultOpen={isOpen}
      open={open}
      onOpenChange={handleToggle}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex items-center">
            <Link
              href={`/project/${item.id}`}
              className="flex items-center gap-2"
              onClick={openSubMenu}
            >
              <Avatar className="rounded border">
                <AvatarFallback className="rounded-none">{item.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span>{item.name}</span>
            </Link>

            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.apps?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.id}>
                <SidebarMenuSubButton asChild>
                  <Link href={`/project/${item.id}/app/${subItem.id}`}>
                    <span>{subItem.name}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const NavMain = () => {
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
            <CollapsibleMenu key={item.id} isOpen={key === 0} item={item} />
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
