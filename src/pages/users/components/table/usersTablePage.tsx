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
} from '@/components/ui/dropdownMenu';

import { UserTable } from '@/pages/users/components/table/usersTable';
import UserTableSkeleton from '@/pages/users/components/table/usersTableSkeleton';
import { PaginationHook } from '@/hooks/paginationHook';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserTable, searchUser } from '@/services/users/chart/tableApi';
import useDebounce from '@/hooks/useDebounce';

interface User {
  content: [
    {
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
    },
  ];
}

export default function TableView() {
  const [searchKey, setSearchKey] = useState<string>('');
  const [debouncedSearchKey] = useDebounce(searchKey, 300);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [column, setColumn] = useState('id');
  const [direction, setDirection] = useState('ASC');
  const queryClient = useQueryClient();

  const headerMenu = [
    { id: 'id', label: 'ID' },
    { id: 'nickname', label: '닉네임' },
    { id: 'email', label: '이메일' },
    { id: 'role', label: '권한' },
    { id: 'active', label: '활성화 상태' },
    { id: 'createdAt', label: '생성일' },
    { id: 'updatedAt', label: '갱신일' },
  ];

  const { data: userData, isPending } = useQuery({
    queryKey: ['usersTable', currentPage, column, direction],
    queryFn: () => getUserTable({ currentPage, column, direction }),
    enabled: !debouncedSearchKey,
  });
  const { data: searchData } = useQuery({
    queryKey: ['searchUser', searchKey, currentPage],
    queryFn: () => searchUser({ searchKey, currentPage }),
    enabled: !!debouncedSearchKey,
  });
  const isSearchMode = !!searchKey;
  const activeData = isSearchMode ? searchData : userData;
  const activePageData = activeData?.pagination ?? {
    totalPages: 0,
    currentPage: 0,
  };
  const activeContent = activeData?.content || [];

  // 페이지네이션
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 사용자 목록 정렬
  const handleSortChange = (column: string) => {
    let newDirection = 'ASC';
    if (column === column) {
      newDirection = direction === 'ASC' ? 'DESC' : 'ASC';
    }
    setColumn(column);
    setDirection(newDirection);
  };

  useEffect(() => {
    if (!isSearchMode) {
      setCurrentPage(0);
      setColumn('id');
      setDirection('ASC');
    }
  }, [isSearchMode]);

  return (
    <div className="p-6">
      <Card className="px-6 py-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-4">
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

          <div className="relative">
            <Input
              placeholder="사용자 이름 검색"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="pr-12"
            />
            <button className="absolute top-0 right-0 h-full w-10 ">
              <Search />
            </button>
          </div>
        </div>

        {isPending ? (
          <UserTableSkeleton />
        ) : !userData ? (
          <div className="text-ck-gray-600 ck-body-2 flex items-center justify-center rounded-md border py-10">
            데이터가 없습니다.
          </div>
        ) : (
          <>
            <UserTable
              userData={activeContent}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              handleSortChange={handleSortChange}
            />
            <PaginationHook
              pageData={activePageData}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Card>
    </div>
  );
}
