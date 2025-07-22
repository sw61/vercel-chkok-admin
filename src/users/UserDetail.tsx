import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

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
  createdAt: string;
  updatedAt: string;
}

export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [userMemo, setUserMemo] = useState<string>("");
  const [hideMemo, setHideMemo] = useState<Boolean>(false);

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
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("상태 변경에 실패했습니다.");
    }
  };
  // 사용자 삭제
  const deleteUser = async (id: number) => {
    if (
      window.confirm(
        "사용자를 삭제하시겠습니까? (주의 : 이 작업은 되돌릴 수 없습니다)"
      )
    ) {
      try {
        const response = await axiosInterceptor.delete(`/users/${id}`);
        navigate("/userTable");
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
      <Table className="flex flex-row ">
        <TableHeader>
          <TableRow className="flex flex-col border-none">
            <TableHead>ID</TableHead>
            <TableHead>닉네임</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>프로필 이미지</TableHead>
            <TableHead>전화번호</TableHead>
            <TableHead>성별</TableHead>
            <TableHead>나이</TableHead>
            <TableHead>계정 서비스</TableHead>
            <TableHead>역할</TableHead>
            <TableHead>활성화 상태</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead>갱신일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="flex justify-center">
          <TableRow className="flex flex-col">
            <TableCell>{userData.id}</TableCell>
            <TableCell>{userData.nickname}</TableCell>
            <TableCell>{userData.email}</TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger>{userData.profileImg}</TooltipTrigger>
                <TooltipContent>
                  <img src={userData.profileImg}></img>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell>{userData.phone}</TableCell>
            <TableCell>{userData.gender}</TableCell>
            <TableCell>{userData.age}</TableCell>
            <TableCell>{userData.provider}</TableCell>
            <TableCell>{userData.role}</TableCell>
            <TableCell>{userData.active ? "활성화" : "비활성화"}</TableCell>
            <TableCell>{userData.createdAt.split("T")[0]}</TableCell>
            <TableCell>{userData.updatedAt.split("T")[0]}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div>회원 메모</div>
      <div className="whitespace-normal break-words overflow-auto overflow-hidden max-h-40">
        {userData.memo}
      </div>
      {!hideMemo && (
        <div className="flex justify-end">
          <Button onClick={() => setHideMemo(true)}>메모 수정</Button>
        </div>
      )}

      {hideMemo && (
        <div>
          <Textarea
            placeholder="텍스트를 입력하세요."
            value={userMemo}
            onChange={handleTextAreaChange}
          />
          <div className="flex justify-end">
            <Button onClick={() => putMemoUpdate(userData.id, userMemo || "")}>
              메모 업데이트
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button
          className="cursor-pointer"
          onClick={() => putUserStatus(userData.id)}
        >
          활성화/비활성화
        </Button>
        <Button onClick={() => deleteUser(userData.id)}>사용자 삭제</Button>
      </div>
    </>
  );
}
