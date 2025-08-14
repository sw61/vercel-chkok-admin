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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/auth/useLogout";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInterceptor from "@/lib/axios-interceptors";
import { Skeleton } from "@/components/ui/skeleton";
import appicon from "../Image/appicon.png";

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

const getAdminData = async (): Promise<AdminData> => {
  const response = await axiosInterceptor.get("/auth/me");
  return response.data.data;
};

export function NavUser() {
  const { isMobile } = useSidebar();
  const logout = useLogout();
  const navigate = useNavigate();
  const {
    data: adminData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminData"],
    queryFn: getAdminData,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐싱
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-2 opacity-50">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    );
  }

  if (error || !adminData) {
    return (
      <div className="p-2 text-sm text-red-500">
        {error ? error.message : "데이터를 불러올 수 없습니다."}
        <button
          onClick={() => window.location.reload()}
          className="ml-2 text-blue-500 underline"
        >
          재시도
        </button>
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={adminData.thumbnailUrl || appicon}
                  alt={adminData.name}
                />
                <AvatarFallback>Admin</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="ck-body-2-bold truncate">
                  {adminData.name}
                </span>
                <span className="ck-caption-2 truncate">{adminData.email}</span>
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
                  <AvatarImage
                    src={adminData.thumbnailUrl || appicon}
                    alt={adminData.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="ck-body-2-bold truncate">
                    {adminData.name}
                  </span>
                  <span className="ck-caption-2 truncate">
                    {adminData.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/admin")}>
                <BadgeCheck />
                관리자 계정 설정
              </DropdownMenuItem>
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
