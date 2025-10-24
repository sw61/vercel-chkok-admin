import { useState, useEffect } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { getUserTable, searchUser } from '@/services/users/table/tableApi';
import useDebounce from '@/hooks/useDebounce';
import ChartContent from '@/pages/chart/userChartContent';

export default function UserTablePage() {
  const [searchKey, setSearchKey] = useState<string>('');
  const [debouncedSearchKey] = useDebounce(searchKey, 300);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [column, setColumn] = useState('id');
  const [direction, setDirection] = useState('ASC');
  const [role, setRole] = useState<string>('ALL');

  // 항목 필터
  const headerMenu = [
    { id: 'id', label: 'ID' },
    { id: 'nickname', label: '닉네임' },
    { id: 'email', label: '이메일' },
    { id: 'role', label: '권한' },
    { id: 'active', label: '활성화 상태' },
    { id: 'createdAt', label: '생성일' },
    { id: 'updatedAt', label: '갱신일' },
  ];
  // 권한 필터
  const roleValues = [
    { role: 'ALL', label: '전체 사용자' },
    { role: 'USER', label: '사용자 권한' },
    { role: 'CLIENT', label: '클라이언트 권한' },
    { role: 'ADMIN', label: '어드민 권한' },
  ];
  // 사용자 전체 목록 조회
  const { data: userData, isPending } = useQuery({
    queryKey: ['userTable', currentPage, column, direction, role],
    queryFn: () => getUserTable({ currentPage, column, direction, role }),
    enabled: !debouncedSearchKey,
  });

  // 사용자 검색
  const { data: searchUserData } = useQuery({
    queryKey: ['searchUser', searchKey, currentPage, role],
    queryFn: () => searchUser({ searchKey, currentPage, role }),
    enabled: !!debouncedSearchKey,
  });
  const isSearchMode = !!searchKey;
  const activeData = isSearchMode ? searchUserData : userData;
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

  const handleRole = (role: string) => {
    setRole(role);
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
                <Button variant="outline">
                  {roleValues.find((item) => item.role === role)?.label ||
                    '권한 필터'}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {roleValues.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item.role}
                    checked={role === item.role}
                    onClick={() => handleRole(item.role)}
                  >
                    {item.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
            <button className="absolute top-0 right-0 h-full w-10">
              <Search />
            </button>
          </div>
        </div>

        {isPending ? (
          <UserTableSkeleton />
        ) : !userData ? (
          <div className="text-ck-gray-600 ck-body-2 flex items-center justify-center rounded-md border py-10">
            사용자 데이터를 불러오는데 실패했습니다.
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
        <ChartContent />
      </Card>
    </div>
  );
}
