import * as React from "react";
import { BookOpen, Frame, BadgeCheck, Map, PieChart, UserRound, Earth } from "lucide-react";

import { NavMain } from "@/SideBar/nav-main";
// import { NavProjects } from "@/SideBar/nav-projects";
import { NavSecondary } from "@/SideBar/nav-secondary";
import { NavUser } from "@/SideBar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const data = {
  user: {
    name: "관리자",
    email: "admin1234@example.com",
    avatar: "../src/Image/appicon.png",
  },
  navMain: [
    {
      title: "사용자 목록",
      url: "/users",
      icon: UserRound,
    },
    {
      title: "캠페인 목록",
      url: "/campaigns",
      icon: Earth,
    },
    {
      title: "배너 목록",
      url: "/banners",
      icon: BookOpen,
    },
  ],
  navSecondary: [
    {
      title: "관리자 계정 설정",
      url: "/admin",
      icon: BadgeCheck,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <img src="../src/Image/chkokLogo.png"></img>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
