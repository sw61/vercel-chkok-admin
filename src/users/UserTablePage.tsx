import { UserTable } from "./UserTable";
import { PaginationDemo } from "./UserPagination";
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

interface PaginationData {
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export function UserTablePage() {
  const [userData, setUserData] = useState<User[]>();
  const [pageData, setPageData] = useState<PaginationData | null>();
  const navigate = useNavigate();

  const getUserTable = async (page: number = 0) => {
    try {
      const response = await axiosInterceptor.get(
        `/users?page=${page}&size=10`
      );
      const userData = response.data.data;
      // console.log(userData);
      setUserData(userData.content);

      setPageData(userData.pagination);
    } catch (error) {
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
  useEffect(() => {
    getUserTable();
  }, []);
  if (!userData || !pageData) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    getUserTable(page);
  };

  return (
    <>
      <div>
        <UserTable userData={userData} />
        <PaginationDemo pageData={pageData} onPageChange={handlePageChange} />
      </div>
    </>
  );
}
