import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import { ArrowUpNarrowWide, Trash, UserCheck, UserX } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface User {
  id: number;
  email: string;
  nickname: string;
  role: string;
  provider: string;
  accountType: string;
  active: boolean;
  emailVerified: boolean;
  gender: string;
  age: number;
  phone: string;
  profileImg: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
  platforms: string;
}

export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [userMemo, setUserMemo] = useState<string>("");
  const [hideMemo, setHideMemo] = useState<Boolean>(false);
  const dataMap: Record<string, string> = {
    GOOGLE: "구글",
    kakao: "카카오",
    USER: "사용자",
    CLIENT: "클라이언트",
    LOCAL: "로컬",
    ADMIN: "관리자",
    SOCIAL: "소셜",
    UNKNOWN: "비공개",
    MALE: "남성",
    FEMALE: "여성",
  };

  // 사용자 메모 수정 핸들러
  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserMemo(event.target.value);
  };
  const getUserDetail = async (id: string) => {
    try {
      const response = await axiosInterceptor.get(`/users/${id}`);
      const userData = response.data.data;
      const mappedData = {
        ...userData,
        accountType: dataMap[userData.accountType] || userData.accountType,
        role: dataMap[userData.role] || userData.role,
        gender: dataMap[userData.gender] || userData.gender,
        provider: dataMap[userData.provider] || userData.provider,
      };
      setUserData(mappedData);
      setUserMemo(userData.memo || "");
      console.log(userData);
    } catch (error) {
      toast.error("유저 정보 조회에 실패했습니다.");
      console.log(error);
    }
  };
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
  const deleteUser = async (id: number) => {
    if (window.confirm("사용자를 삭제하시겠습니까?")) {
      try {
        await axiosInterceptor.delete(`/users/${id}`);
        navigate("/users");
        toast.success("사용자가 삭제되었습니다.");
      } catch (error) {
        console.log(error);
      }
    }
  };
  const putMemoUpdate = async (id: number, memo: string) => {
    try {
      const response = await axiosInterceptor.put(
        `/users/${id}/memo`,
        { memo },
        {
          headers: { "Content-Type": "application/json" },
        },
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
  const userToClient = async (id: number) => {
    if (window.confirm("클라이언트로 승급하시겠습니까?")) {
      try {
        await axiosInterceptor.put(`/users/${id}/promote-to-client`);
        await getUserDetail(id.toString());
        toast.success("클라이언트로 승급되었습니다.");
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      getUserDetail(userId);
    }
  }, [userId]);
  if (!userData) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="ck-title mb-2">계정 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div>
                    <Skeleton className="mb-2 h-6 w-32" />
                    <Skeleton className="mb-1 h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="mb-2 h-4 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-[650px]">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="ck-title">계정 정보</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex justify-between pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={userData.profileImg}
                    alt={userData.nickname}
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <div>
                  <p className="ck-body-2">
                    {userData.nickname} ({userData.gender},{" "}
                    {userData.age || "나이 미상"})
                  </p>
                  <p className="ck-body-2 text-gray-500">
                    {userData.email || "이메일 없음"}
                  </p>
                  <p className="ck-body-2 text-gray-500">
                    {userData.phone || "전화번호 없음"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 px-4">
                {userData.role === "사용자" && (
                  <Button
                    className="ck-body-1 flex cursor-pointer items-center border"
                    onClick={() => userToClient(userData.id)}
                    variant="outline"
                  >
                    <ArrowUpNarrowWide />
                    권한 승급
                  </Button>
                )}
                <Button
                  className={`ck-body-1 flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-colors ${
                    userData.active
                      ? "hover:bg-ck-red-500 hover:text-white"
                      : "hover:bg-ck-blue-500 hover:text-white"
                  }`}
                  onClick={() => putUserStatus(userData.id)}
                  variant="outline"
                >
                  {userData.active ? <UserX /> : <UserCheck />}
                  {userData.active ? "비활성화" : "활성화"}
                </Button>
                <Button
                  className="ck-body-1 hover:bg-ck-red-500 flex cursor-pointer items-center border hover:text-white"
                  onClick={() => deleteUser(userData.id)}
                  variant="outline"
                >
                  <Trash />
                  계정 삭제
                </Button>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-6">
              <div>
                <p className="ck-caption-1 text-ck-gray-600">사용자 ID</p>
                <p className="ck-body-2">{userData.id}</p>
              </div>
              <div>
                <p className="ck-caption-1 text-ck-gray-600">권한</p>
                <p className="ck-body-2">{userData.role}</p>
              </div>
              <div>
                <p className="ck-caption-1 text-ck-gray-600">계정 상태</p>
                {userData.active ? (
                  <p className="ck-body-2 text-green-600">활성화</p>
                ) : (
                  <p className="ck-body-2 text-ck-red-600">비활성화</p>
                )}
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">계정 서비스</p>
                <p className="ck-body-2">{userData.provider}</p>
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">계정 타입</p>
                <p className="ck-body-2">{userData.accountType}</p>
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">계정 플랫폼</p>
                <p className="ck-body-2">{userData.platforms ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">생성일</p>
                <p className="ck-body-2">{userData.createdAt.split("T")[0]}</p>
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">업데이트일</p>
                <p className="ck-body-2">{userData.updatedAt.split("T")[0]}</p>
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">이메일 인증</p>
                <p className="ck-body-2">
                  {userData.emailVerified ? "인증됨" : "인증 필요"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="ck-body-2">사용자 메모</p>
              <div className="ck-body-2 border-ck-gray-300 rounded-md border bg-transparent px-3 py-2">
                {userData.memo ? userData.memo : "내용이 없습니다."}
              </div>
              {!hideMemo && (
                <div className="flex justify-end">
                  <Button
                    className="ck-body-1 text-ck-gray-900 hover:bg-ck-gray-300 cursor-pointer border bg-white"
                    onClick={() => setHideMemo(true)}
                  >
                    수정
                  </Button>
                </div>
              )}
              {hideMemo && (
                <div className="flex flex-col gap-4">
                  <Textarea
                    placeholder="텍스트를 입력하세요."
                    value={userMemo}
                    onChange={handleTextAreaChange}
                  />
                  <div className="flex justify-end">
                    <Button
                      className="ck-body-1 text-ck-gray-900 hover:bg-ck-gray-300 cursor-pointer border bg-white"
                      onClick={() => putMemoUpdate(userData.id, userMemo || "")}
                    >
                      저장
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
