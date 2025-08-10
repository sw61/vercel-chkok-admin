import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

import {
  Card,
  // CardAction,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Delete, Power, PowerOff, Pencil, ArrowUpNarrowWide } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: number;
  nickname: string;
  email: string;
  accountType: string;
  phone: string;
  gender: string;
  age: number;
  role: string;
  active: boolean;
  provider: string;
  platforms: string;
  profileImg: string;
  memo: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
interface UserAccountInfo {
  key: string;
  label: string;
  value: string | number | boolean | undefined;
}

export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [userMemo, setUserMemo] = useState<string>("");
  const [hideMemo, setHideMemo] = useState<Boolean>(false);

  const UserAccountInfo = (): UserAccountInfo[] => [
    { key: "id", label: "ID", value: userData?.id ?? "정보 없음" },
    { key: "role", label: "권한", value: userData?.role ?? "정보 없음" },
    {
      key: "active",
      label: "계정 상태",
      value: userData?.active ? "활성화" : "비활성화",
    },
    {
      key: "platforms",
      label: "계정 플랫폼",
      value: userData?.platforms ?? "정보 없음",
    },
    {
      key: "emailVerified",
      label: "이메일 인증",
      value: userData?.emailVerified ? "인증 완료" : "인증 필요",
    },
    {
      key: "createdAt",
      label: "생성일",
      value: userData?.createdAt.split("T")[0] ?? "정보 없음",
    },
    {
      key: "updatedAt",
      label: "업데이트일",
      value: userData?.updatedAt.split("T")[0] ?? "정보 없음",
    },
  ];
  const UserInfoComponent = ({ label, value }: { label: string; value: string | boolean | number | undefined }) => {
    return (
      <CardContent className="flex flex-col gap-2">
        <p className="ck-body-2-bold">{label}</p>
        <div className="px-3 py-2 ck-body-2 bg-transparent border border-ck-gray-300 rounded-md">{value}</div>
      </CardContent>
    );
  };

  // 사용자 메모 수정 핸들러
  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserMemo(event.target.value);
  };
  // 사용자 상세 정보 조회
  const getUserDetail = async (id: string) => {
    try {
      const response = await axiosInterceptor.get(`/users/${id}`);
      const userData = response.data.data;
      setUserData(userData);
      setUserMemo(userData.memo || "");
      console.log(userData);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            toast.error("잘못된 요청입니다. 입력 데이터를 확인해주세요.");
            break;
          case 401:
            toast.error("토큰이 만료되었습니다. 다시 로그인 해주세요");
            navigate("/login");
            break;
          case 403:
            toast.error("접근 권한이 없습니다.");
            break;
          case 404:
            toast.error("요청한 사용자 데이터를 찾을 수 없습니다.");
            break;
          case 500:
            toast.error("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
            break;
        }
      }
    }
  };
  // 사용자 활성화 / 비활성화
  const putUserStatus = async (id: number) => {
    try {
      const response = await axiosInterceptor.put(`/users/${id}/status`);
      const updatedData = response.data.data;
      setUserData((prev) => ({ ...prev, ...updatedData }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("상태 변경에 실패했습니다.");
    }
  };
  // 사용자 삭제
  const deleteUser = async (id: number) => {
    if (window.confirm("사용자를 삭제하시겠습니까? (주의 : 이 작업은 되돌릴 수 없습니다)")) {
      try {
        const response = await axiosInterceptor.delete(`/users/${id}`);
        navigate("/users");
        console.log(response);
        toast.success("사용자가 삭제되었습니다.");
      } catch (error) {
        console.log(error);
      }
    }
  };
  // 사용자 메모 업데이트
  const putMemoUpdate = async (id: number, memo: string) => {
    try {
      const response = await axiosInterceptor.put(
        `/users/${id}/memo`,
        { memo },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const updatedData = response.data.data;
      setUserData((prev) => ({ ...prev, ...updatedData }));
      setHideMemo(false);
      toast.success("메모가 업데이트 되었습니다.");
    } catch (error) {
      toast.error("메모 업데이트에 실패했습니다.");
      console.log(error);
    }
  };
  // 사용자 USER -> Client 승급
  const userToClient = async (id: number) => {
    try {
      const response = await axiosInterceptor.put(`/users/${id}/promote-to-client`);
      const data = response.data.data;
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const genderMap: Record<string, string> = {
    UNKNOWN: "비공개",
    MALE: "남성",
    FEMALE: "여성",
  };

  useEffect(() => {
    if (userId) {
      getUserDetail(userId);
    }
  }, [userId]);
  if (!userData) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-row gap-10">
        {/* 헤더 */}
        <div>
          <div className="flex gap-8">
            <Avatar className="w-40 h-40">
              <AvatarImage src={userData.profileImg} alt={userData.nickname} />
              <AvatarFallback></AvatarFallback>
            </Avatar>

            <div className="flex flex-col justify-center gap-4">
              <div className="flex flex-col gap-4 font-semibold">
                <div className="ck-body-1-bold">
                  {userData.nickname} ({genderMap[userData.gender] || "알 수 없음"},{" "}
                  {userData.age ? userData.age : "나이"})
                </div>
                <div className="ck-body-1">{userData.email}</div>
                <div className="ck-body-1">{userData.phone ? userData.phone : "전화번호(정보 없음)"}</div>
              </div>
              <div className="flex gap-4">
                <Button
                  className={`cursor-pointer ck-body-1 flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                    userData.active ? "hover:bg-ck-red-500 hover:text-white" : "hover:bg-ck-blue-500 hover:text-white"
                  } `}
                  onClick={() => putUserStatus(userData.id)}
                  variant="outline"
                >
                  {userData.active ? <PowerOff /> : <Power />}
                  {userData.active ? "비활성화" : "활성화"}
                </Button>
                <Button
                  className="cursor-pointer ck-body-1 flex items-center border hover:bg-ck-red-500 hover:text-white"
                  onClick={() => deleteUser(userData.id)}
                  variant="outline"
                >
                  <Delete />
                  사용자 삭제
                </Button>
                {userData.role === "USER" ? (
                  <Button
                    className="cursor-pointer ck-body-1 flex items-center border "
                    onClick={() => userToClient(userData.id)}
                    variant="outline"
                  >
                    <ArrowUpNarrowWide />
                    클라이언트 승급
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 사용자 계정 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="ck-sub-title-1 flex items-center">사용자 계정 정보</CardTitle>
          </CardHeader>
          {UserAccountInfo().map((item) => (
            <UserInfoComponent key={item.key} label={item.label} value={item.value} />
          ))}
          <CardContent className="flex flex-col gap-2">
            <p className="ck-body-2-bold">사용자 메모</p>
            <div className="px-3 py-2 ck-body-2 bg-transparent border border-ck-gray-300 rounded-md mb-2">
              {userData.memo ? userData.memo : "내용이 없습니다."}
            </div>
            {!hideMemo && (
              <div className="flex justify-end">
                <Button
                  className="cursor-pointer ck-body-1 border bg-white text-ck-gray-900 hover:bg-ck-gray-300 max-w-3xs"
                  onClick={() => setHideMemo(true)}
                >
                  <Pencil />
                  메모 수정
                </Button>
              </div>
            )}
            {/* 메모 수정 기능 */}
            {hideMemo && (
              <div className="flex flex-col gap-4">
                <Textarea placeholder="텍스트를 입력하세요." value={userMemo} onChange={handleTextAreaChange} />
                <div className="flex justify-end">
                  <Button
                    className="cursor-pointer ck-body-1 border bg-white text-ck-gray-900 hover:bg-ck-gray-300"
                    onClick={() => putMemoUpdate(userData.id, userMemo || "")}
                  >
                    <Pencil />
                    메모 업데이트
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
