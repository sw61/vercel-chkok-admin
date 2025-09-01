import { UserTable } from "./UserTable";
import { PaginationDemo } from "./UserPagination";
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect, type KeyboardEvent } from "react";
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
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import UserTableSkeleton from "@/Skeleton/UserTableSkeleton";

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
  const [searchKey, setSearchKey] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    column: string;
    direction: string;
  }>({
    column: "id",
    direction: "ASC", // 초기 정렬은 ASC
  });
  const headerMenu = [
    { id: "id", label: "ID" },
    { id: "nickname", label: "닉네임" },
    { id: "email", label: "이메일" },
    { id: "role", label: "권한" },
    { id: "active", label: "활성화 상태" },
    { id: "createdAt", label: "생성일" },
    { id: "updatedAt", label: "갱신일" },
  ];
  // 사용자 테이블 조회
  const getUserTable = async (
    page: number = 0,
    sort: string = sortConfig.column,
    direction: string = sortConfig.direction,
  ) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(
        `/users?page=${page}&size=10&sortBy=${sort}&sortDirection=${direction}`,
      );
      const data = response.data.data;
      setUserData(data.content);
      setPageData(data.pagination);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = async () => {
    try {
      const response = await axiosInterceptor.get(
        `/users/search?keyword=${searchKey}&size=10`,
      );
      const userData = response.data.data;
      setUserData(userData.content);
      setPageData(userData.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    getUserTable(page);
  };
  const handleEnterSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const handleSortChange = (column: string) => {
    let newDirection = "ASC"; // 첫 클릭 시 ASC
    if (sortConfig.column === column) {
      newDirection = sortConfig.direction === "ASC" ? "DESC" : "ASC"; // 동일 컬럼 클릭 시 토글
    }
    setSortConfig({ column, direction: newDirection });
    getUserTable(0, column, newDirection);
  };
  useEffect(() => {
    getUserTable();
  }, []);

  return (
    <Card className="px-6 py-4">
      <div className="mb-2 flex items-center justify-between">
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
        <div className="relative">
          <Input
            placeholder="사용자 이름 검색"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyDown={handleEnterSearch}
            className="pr-12"
          />
          <button
            className="absolute top-0 right-0 h-full w-10 cursor-pointer"
            onClick={handleSearch}
          >
            <Search />
          </button>
        </div>
      </div>

      {isLoading ? (
        <UserTableSkeleton />
      ) : !userData || !pageData ? (
        <div className="text-ck-gray-600 ck-body-2 flex items-center justify-center rounded-md border py-10">
          데이터가 없습니다.
        </div>
      ) : (
        <>
          <UserTable
            userData={userData}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            handleSortChange={handleSortChange}
          />
          <PaginationDemo pageData={pageData} onPageChange={handlePageChange} />
        </>
      )}
    </Card>
  );
}
