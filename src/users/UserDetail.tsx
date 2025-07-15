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

interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
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
      <div className="grid grid-cols-[160px_1fr] gap-4">
        <div className="w-40 h-60 bg-[url('./img/dog.png')] bg-cover"></div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>닉네임</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>역할</TableHead>
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
              <TableCell>{userData.createdAt.split("T")[0]}</TableCell>
              <TableCell>{userData.updatedAt.split("T")[0]}</TableCell>
            </TableRow>
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell>캠페인 지원 현황</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </div>
      <div>캠페인지원현황</div>
      <div>회원 메모 입력 창</div>
    </>
  );
}
