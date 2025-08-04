import * as React from "react";
import {
  BookOpen,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  UserRound,
  Earth,
} from "lucide-react";

import { NavMain } from "@/SideBar/nav-main";
// import { NavProjects } from "@/SideBar/nav-projects";
// import { NavSecondary } from "@/SideBar/nav-secondary";
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

const data = {
  user: {
    name: "관리자",
    email: "admin1234@example.com",
    avatar: "../src/Image/appicon.png",
  },
  navMain: [
    {
      title: "사용자 목록",
      url: "/userTable",
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
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
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
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square w-32 h-32 items-center justify-center rounded-lg">
                  <img src="../src/Image/chkokLogo.png"></img>
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">체험콕</span>
                  <span className="truncate text-xs">관리자 페이지</span>
                </div>
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
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
