import { UserTable } from "./UserTable";
import { PaginationDemo } from "./UserPagination";
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
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
  // 사용자 테이블 조회
  const getUserTable = async (page: number = 0) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(
        `/users?page=${page}&size=10`,
      );
      const data = response.data.data;
      setUserData(data.content);
      setPageData(data.pagination);
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
            className="pr-12"
          />
          <button
            className="absolute top-0 right-0 h-full w-10 cursor-pointer"
            onClick={() => handleSearch()}
          >
            <Search />
          </button>
        </div>
      </div>

      {!userData || !pageData || isLoading ? (
        <div className="overflow-x-auto rounded-md border">
          <Table className="table-fixed" style={{ minWidth: `${1000}px` }}>
            <TableHeader>
              <TableRow>
                {[80, 150, 200, 100, 120, 150, 150].map((width, idx) => (
                  <TableHead key={idx} style={{ width: `${width}px` }}>
                    <Skeleton className="h-4 w-3/4" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, rowIdx) => (
                <TableRow key={rowIdx}>
                  {[80, 150, 200, 100, 120, 150, 150].map((width, colIdx) => (
                    <TableCell
                      key={`${rowIdx}-${colIdx}`}
                      style={{ width: `${width}px` }}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
    </Card>
  );
}
