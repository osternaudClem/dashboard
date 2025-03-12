"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@prisma/client";

const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetch(`/api/projects`);
  return res.json();
};

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const [activeProject, setActiveProject] = React.useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
  });

  const project = React.useMemo(() => {
    if (data) {
      return data[activeProject];
    }
    return null;
  }, [data, activeProject]);

  console.log(">>> ℹ️ team-switcher - 45", { data });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <div className="size-4">{project?.name.slice(0, 1)}</div>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{project?.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Projects
            </DropdownMenuLabel>
            {isLoading || !data ? (
              <DropdownMenuItem className="p-2">Loading...</DropdownMenuItem>
            ) : (
              data?.map((project, index) => (
                <DropdownMenuItem
                  key={project.name}
                  onClick={() => setActiveProject(index)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-xs border">
                    <div className="size-4 shrink-0">
                      {project.name.slice(0, 1)}
                    </div>
                  </div>
                  {project.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Create project
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
