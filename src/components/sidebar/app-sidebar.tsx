import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import Logo from '../logo';
import { NavMain } from './nav-main';
import NavUser from './nav-user';
import { ThemeToggle } from './theme-toggle';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="my-6">
          <div className="group-data-[state=collapsed]:hidden">
            <Logo />
          </div>
          <div className="group-data-[state=expanded]:hidden">
            <Logo isIcon />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
