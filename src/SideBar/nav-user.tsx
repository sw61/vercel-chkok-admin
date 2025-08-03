"use client";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

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
import axiosInterceptor from "@/lib/axios-interceptors";
import { useLogout } from "@/auth/useLogout";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface AdminData {
  name: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
}

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const [adminData, setAdminData] = useState<AdminData | null | undefined>();
  const { isMobile } = useSidebar();
  const logout = useLogout();
  const getUserMe = async () => {
    try {
      const response = await axiosInterceptor.get("/auth/me");
      const data = response.data.data;
      setAdminData(data);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserMe();
  }, []);
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
                <AvatarImage src="../src/Image/mainLogo.png" alt={user.name} />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel
              className="p-0 font-normal cursor-pointer"
              onClick={() => {
                if (!adminData) {
                  toast("관리자 정보 없음", {
                    description: "불러오는 중이거나 실패했습니다.",
                  });
                  return;
                }
                toast(
                  <div>
                    <p className="font-semibold mb-1">👤 관리자 정보</p>
                    <p>이름: {adminData?.name}</p>
                    <p>이메일: {adminData?.email}</p>
                    <p>
                      가입일:{" "}
                      {new Date(adminData?.createdAt).toLocaleDateString()}
                    </p>
                  </div>,
                  {
                    action: {
                      label: "확인",
                      onClick: () => console.log("확인 클릭됨"),
                    },
                    duration: Infinity,
                    position: "top-right",
                  }
                );
              }}
            >
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src="../src/Image/mainLogo.png"
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                계정 설정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
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
