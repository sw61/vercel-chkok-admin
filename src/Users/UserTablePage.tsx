import { useState, useEffect, type KeyboardEvent } from 'react';
import {
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axiosInterceptor from '@/lib/axios-interceptors';
import { UserTable } from '@/Users/UserTable';
import { CompanyTable } from '@/Company/CompanyTable';
import UserTableSkeleton from '@/Skeleton/UserTableSkeleton';
import { PaginationHook } from '@/hooks/PaginationHook';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  companyName: string;
  businessRegistrationNumber: string;
  role: string;
  contactPerson: string;
  phoneNumber: string;
}

interface Company {
  id: number;
  userId: number;
  companyName: string;
  businessRegistrationNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export default function TableView() {
  const [toggle, setToggle] = useState<boolean>(false); // false: UserTable, true: CompanyTable
  const [userData, setUserData] = useState<User[] | null>(null);
  const [companyData, setCompanyData] = useState<Company[] | null>(null);
  const [pageData, setPageData] = useState<PaginationData | null>(null);
  const [searchKey, setSearchKey] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    column: string;
    direction: string;
  }>({
    column: 'id',
    direction: 'ASC',
  });

  const headerMenu = [
    { id: 'id', label: 'ID' },
    { id: 'nickname', label: '닉네임' },
    { id: 'email', label: '이메일' },
    { id: 'role', label: '권한' },
    { id: 'active', label: '활성화 상태' },
    { id: 'createdAt', label: '생성일' },
    { id: 'updatedAt', label: '갱신일' },
  ];

  // 사용자 데이터 목록 조회
  const getUserTable = async (
    page: number = 0,
    sort: string = sortConfig.column,
    direction: string = sortConfig.direction
  ) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(
        `/users?page=${page}&size=10&sortBy=${sort}&sortDirection=${direction}`
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

  // 클라이언트 승급 심사 목록 조회
  const getCompanyTable = async (page: number = 0) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(
        `/api/companies/examine?page=${page}&size=10`
      );
      const data = response.data.data;
      setCompanyData(data.companies);
      setPageData(data.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 검색 기능
  const handleSearch = async () => {
    if (!toggle) {
      try {
        const response = await axiosInterceptor.get(
          `/users/search?keyword=${searchKey}&size=10`
        );
        const userData = response.data.data;
        setUserData(userData.content);
        setPageData(userData.pagination);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Enter 검색 기능
  const handleEnterSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // 페이지네이션
  const handlePageChange = (page: number) => {
    if (toggle) {
      getCompanyTable(page);
    } else {
      getUserTable(page);
    }
  };

  // 사용자 목록 정렬
  const handleSortChange = (column: string) => {
    if (!toggle) {
      let newDirection = 'ASC';
      if (sortConfig.column === column) {
        newDirection = sortConfig.direction === 'ASC' ? 'DESC' : 'ASC';
      }
      setSortConfig({ column, direction: newDirection });
      getUserTable(0, column, newDirection);
    }
  };

  useEffect(() => {
    if (toggle) {
      getCompanyTable();
    } else {
      getUserTable();
    }
  }, [toggle]);

  return (
    <div className="p-6">
      <Card className="px-6 py-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-2">
            {!toggle ? (
              <>
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
                <Button
                  onClick={() => setToggle(true)}
                  variant={toggle ? 'default' : 'outline'}
                >
                  클라이언트 승급 심사
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setToggle(false)}
                variant={toggle ? 'outline' : 'default'}
              >
                사용자 목록
              </Button>
            )}
          </div>
          {!toggle && (
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
          )}
        </div>

        {isLoading ? (
          <UserTableSkeleton />
        ) : (!toggle && !userData) || (toggle && !companyData) || !pageData ? (
          <div className="text-ck-gray-600 ck-body-2 flex items-center justify-center rounded-md border py-10">
            데이터가 없습니다.
          </div>
        ) : (
          <>
            {toggle ? (
              <CompanyTable
                companyData={companyData!}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
              />
            ) : (
              <UserTable
                userData={userData!}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                handleSortChange={handleSortChange}
              />
            )}
            <PaginationHook
              pageData={pageData}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Card>
    </div>
  );
}
