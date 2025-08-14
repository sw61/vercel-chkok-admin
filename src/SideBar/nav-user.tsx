"use client";
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

import { useLogout } from "@/auth/useLogout";
import { useNavigate } from "react-router-dom";
import appicon from "../Image/appicon.png";
import { useState, useEffect } from "react";
import axiosInterceptor from "@/lib/axios-interceptors";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminData {
  id: number;
  name: string;
  email: string;
  accountType: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
  loginCount: number;
  thumbnailUrl: string;
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const logout = useLogout();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminData>();
  const [isLoading, setIsLoading] = useState(false);

  const getAdminData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get("/auth/me");
      const data = response.data.data;
      console.log(data);
      setAdminData(data);
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAdminData();
  }, []);
  if (isLoading) {
    return (
      <div className="flex items-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }
  if (!adminData) {
    return <div>데이터가 없습니다.</div>;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src="../src/Image/appicon.png" alt={adminData.name} />
                <AvatarFallback>Admin</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate ck-body-2-bold">{adminData.name}</span>
                <span className="truncate ck-caption-2">{adminData.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={appicon} alt={adminData.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate ck-body-2-bold">{adminData.name}</span>
                  <span className="truncate ck-caption-2">{adminData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/admin")}>
                <BadgeCheck />
                관리자 계정 설정
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
