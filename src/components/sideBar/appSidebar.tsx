import * as React from 'react';
import {
  Frame,
  BadgeCheck,
  Map,
  PieChart,
  UserRound,
  Earth,
  Server,
  Megaphone,
  Wallpaper,
  NotebookPen,
} from 'lucide-react';

import { NavMain } from '@/components/sideBar/navMain';
// import { NavProjects } from "@/SideBar/nav-projects";
// import { NavSecondary } from "@/SideBar/nav-secondary";
import { NavUser } from '@/components/sideBar/navUser';

import chkokLogo from '@/image/chkokLogo.png';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
    navMain: [
      {
        title: '사용자 목록',
        url: '/users',
        icon: UserRound,
      },
      {
        title: '클라이언트 신청 목록',
        url: '/companies',
        icon: UserRound,
      },

      {
        title: '캠페인 목록',
        url: '/campaigns',
        icon: Earth,
      },
      {
        title: '배너 목록',
        url: '/banners',
        icon: Wallpaper,
      },

      {
        title: '공지사항 글',
        url: '/notices',
        icon: Megaphone,
      },
      {
        title: '체험콕 아티클',
        url: '/posts',
        icon: NotebookPen,
      },
      {
        title: '서버 데이터',
        url: '/server',
        icon: Server,
      },
    ],
    navSecondary: [
      {
        title: '관리자 계정 설정',
        url: '/admin',
        icon: BadgeCheck,
      },
    ],
    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: Frame,
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: PieChart,
      },
      {
        name: 'Travel',
        url: '#',
        icon: Map,
      },
    ],
  };

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! bg-white"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/" className="h-20">
                <img src={chkokLogo} className="object-contain"></img>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
