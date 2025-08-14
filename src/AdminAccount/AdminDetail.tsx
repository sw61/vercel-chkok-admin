import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PulseLoader from "react-spinners/PulseLoader";
import usericon from "../Image/usericon.png";

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
}
interface AdminAccountInfo {
  key: string;
  label: string;
  value: string | number | boolean | undefined;
}

export default function AdminDetail() {
  const [adminData, setAdminData] = useState<AdminData>();
  const [isLoading, setIsLoading] = useState(false);

  // 상대 시간 포맷팅 함수
  const formatLastLogin = (lastLoginAt: string | undefined) => {
    if (!lastLoginAt) return "정보 없음";
    const loginDate = new Date(lastLoginAt);
    const now = new Date();
    const diffMs = now.getTime() - loginDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return `${diffSeconds}초 전`;
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return loginDate.toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const AdminAccountInfo = (): AdminAccountInfo[] => [
    { key: "id", label: "ID", value: adminData?.id ?? "정보 없음" },
    { key: "name", label: "닉네임", value: adminData?.name ?? "정보 없음" },
    { key: "email", label: "이메일", value: adminData?.email ?? "정보 없음" },
    { key: "role", label: "권한", value: adminData?.role ?? "정보 없음" },
    {
      key: "loginCount",
      label: "로그인 횟수",
      value: adminData?.loginCount ?? "정보 없음",
    },
    {
      key: "isActive",
      label: "계정 상태",
      value: adminData?.isActive ? "활성화" : "비활성화",
    },

    {
      key: "accountType",
      label: "이메일 인증",
      value: adminData?.accountType ? "인증 완료" : "인증 필요",
    },
    {
      key: "createdAt",
      label: "생성일",
      value: adminData?.createdAt.split("T")[0] ?? "정보 없음",
    },
  ];

  const AdminInfoComponent = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | boolean | undefined;
  }) => {
    return (
      <CardContent className="flex flex-col gap-2">
        <p className="ck-body-2-bold">{label}</p>
        <div className="ck-body-2 border-ck-gray-300 rounded-md border bg-transparent px-3 py-2">
          {value}
        </div>
      </CardContent>
    );
  };

  const getUserMe = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInterceptor.get("/auth/me");
      const data = response.data.data;
      setAdminData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserMe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      <div className="grid-row grid gap-10">
        <div className="flex gap-8">
          <Avatar className="h-40 w-40">
            <AvatarImage src={usericon} alt="관리자 프로필" />
            <AvatarFallback></AvatarFallback>
          </Avatar>

          <div className="flex flex-col justify-center gap-4">
            <div className="flex gap-4">
              <div className="ck-sub-title-1">{adminData?.name}</div>
              <div className="ck-sub-title-1">{adminData?.email}</div>
            </div>
            <div className="text-ck-gray-600 ck-body-2">
              마지막 로그인 &nbsp;{formatLastLogin(adminData?.lastLoginAt)}
            </div>
          </div>
        </div>
        {/* 관리자 계정 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="ck-sub-title-1 flex items-center">
              관리자 계정 정보
            </CardTitle>
          </CardHeader>
          {AdminAccountInfo().map((item) => (
            <AdminInfoComponent
              key={item.key}
              label={item.label}
              value={item.value}
            />
          ))}
        </Card>
      </div>
    </>
  );
}
