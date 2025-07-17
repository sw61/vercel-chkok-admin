import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
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

interface User {
  id: number;
  nickname: string;
  email: string;
  accountType: string;
  role: string;
  active: boolean;
  provider: string;
  profileImg: string;
  createdAt: string;
  updatedAt: string;
}
export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const getUserDetail = async (id: string) => {
    try {
      const response = await axiosInterceptor.get(`/users/${id}`);
      const userData = response.data.data;
      setUserData(userData);
      console.log(userData);
    } catch (error) {
      console.log(error);
      navigate("/");
      alert("로그인이 필요합니다.");
    }
  };
  const putUserStatus = async (id: number) => {
    try {
      const response = await axiosInterceptor.put(`/users/${id}/status`);
      const updatedData = response.data.data;
      setUserData(updatedData);
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
      alert("상태 변경에 실패했습니다.");
    }
  };
  const deleteUser = async (id: number) => {
    try {
      const response = await axiosInterceptor.delete(`/users/${id}`);

      console.log(response);
    } catch (error) {
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
      <div className="grid grid-cols-[180px_1fr] gap-4">
        <img
          className="w-60 h-60 bg-cover"
          src="http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg"
        ></img>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>닉네임</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>활성화 상태</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead>갱신일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{userData.id}</TableCell>
              <TableCell>{userData.nickname}</TableCell>
              <TableCell>{userData.email}</TableCell>
              <TableCell>{userData.role}</TableCell>
              <TableCell>{userData.active ? "활성화" : "비활성화"}</TableCell>
              <TableCell>{userData.createdAt.split("T")[0]}</TableCell>
              <TableCell>{userData.updatedAt.split("T")[0]}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Button
        className="cursor-pointer"
        onClick={() => putUserStatus(userData.id)}
      >
        활성화/비활성화
      </Button>
      {/* <Button onClick={() => deleteUser(userData.id)}>사용자 삭제</Button> */}
      <div>캠페인지원현황</div>
      <div>회원 메모 입력 창</div>
    </>
  );
}
