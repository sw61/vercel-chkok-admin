import { UserTable } from "./UserTable";
import { PaginationDemo } from "./UserPagination";
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  nickname: string;
  active: boolean;
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

export default function UserTablePage() {
  const [userData, setUserData] = useState<User[]>();
  const [pageData, setPageData] = useState<PaginationData | null>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const navigate = useNavigate();
  const headerMenu = [
    { id: "id", label: "ID" },
    { id: "nickname", label: "닉네임" },
    { id: "email", label: "이메일" },
    { id: "role", label: "권한" },
    { id: "active", label: "활성화 상태" },
    { id: "createdAt", label: "생성일" },
    { id: "updatedAt", label: "갱신일" },
  ];

  const getUserTable = async (page: number = 0) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(
        `/users?page=${page}&size=10`
      );
      const data = response.data.data;
      setUserData(data.content);
      setPageData(data.pagination);
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
            navigate("/login");
            toast.error("토큰이 만료되었습니다. 다시 로그인 해주세요");
            break;
          case 403:
            navigate("/login");
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
    } finally {
      setIsLoading(false);
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
      <div className="flex justify-between items-center mb-2">
        <div>
          {/* 테이블 헤더 카테고리 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                항목 <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {headerMenu.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={columnVisibility[column.id] !== false}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [column.id]: value,
                    }))
                  }
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* 검색창 */}
        <Input
          placeholder="사용자 이름 검색"
          value={
            (columnFilters.find((f) => f.id === "nickname")?.value as string) ??
            ""
          }
          onChange={(event) =>
            setColumnFilters((prev) => [
              ...prev.filter((f) => f.id !== "nickname"),
              { id: "nickname", value: event.target.value },
            ])
          }
          className="pr-20"
        />
      </div>
      {!userData || !pageData || isLoading ? (
        <div className="flex justify-center items-center h-64">
          <PulseLoader />
        </div>
      ) : (
        <>
          <UserTable
            userData={userData}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
          <PaginationDemo pageData={pageData} onPageChange={handlePageChange} />
        </>
      )}
    </>
  );
}
