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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
      navigate("/login");
      alert("로그인이 필요합니다.");
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
      alert("상태 변경에 실패했습니다.");
    }
  };
  // 사용자 삭제
  const deleteUser = async (id: number) => {
    if (window.confirm("확인 누르면 바로 지워지니까 누르시면 안됩니다!")) {
      try {
        const response = await axiosInterceptor.delete(`/users/${id}`);
        navigate("/userTable");
        console.log(response);
        alert("사용자가 삭제되었습니다.");
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
      alert("메모가 업데이트 되었습니다.");
    } catch (error) {
      alert("메모 업데이트에 실패했습니다.");
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
      <div className="grid grid-cols-[180px_1fr] gap-4 ">
        <img className="w-60 h-60 bg-cover" src={userData.profileImg}></img>
        <Table className="flex flex-row ">
          <TableHeader>
            <TableRow className="flex flex-col border-none">
              <TableHead>ID</TableHead>
              <TableHead>닉네임</TableHead>
              <TableHead>이메일</TableHead>
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
          <TableBody className="flex justify-center border-l-3 pl-4">
            <TableRow className="flex flex-col">
              <TableCell>{userData.id}</TableCell>
              <TableCell>{userData.nickname}</TableCell>
              <TableCell>{userData.email}</TableCell>
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
      </div>

      <div>캠페인지원현황</div>
      <div>회원 메모</div>
      <div>메모 내용 : {userData.memo}</div>
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
