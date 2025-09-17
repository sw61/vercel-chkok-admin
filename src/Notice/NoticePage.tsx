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
import { PaginationHook } from '@/hooks/PaginationHook';
import { NoticeTable } from './NoticeTable';
import { useNavigate } from 'react-router-dom';
import UserTableSkeleton from '@/Skeleton/UserTableSkeleton';

interface Notice {
  id: number;
  title: string;
  viewCount: number;
  isMustRead: boolean;
  authorId: number;
  authorName: string;
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

export default function NoticePage() {
  const [noticeData, setNoticeData] = useState<Notice[] | null>(null);
  const [pageData, setPageData] = useState<PaginationData | null>(null);
  const [searchKey, setSearchKey] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const headerMenu = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: '제목' },
    { id: 'authorName', label: '작성자' },
    { id: 'viewCount', label: '조회수' },
    { id: 'createdAt', label: '생성일' },
    { id: 'updatedAt', label: '업데이트일' },
  ];

  // 공지사항 데이터 목록 조회
  const getNoticeTable = async (page: number = 0) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(
        `/api/admin/notices?page=${page}`
      );
      const data = response.data.data;
      setNoticeData(data.notices);
      setPageData(data.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 공지사항 제목 검색 기능
  const handleSearch = async () => {
    try {
      const response = await axiosInterceptor.get(
        `/api/admin/notices/search?title=${searchKey}&size=10`
      );
      const data = response.data.data;
      setNoticeData(data.notices);
      setPageData(data.pagination);
    } catch (error) {
      console.log(error);
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
    getNoticeTable(page);
  };

  useEffect(() => {
    getNoticeTable();
  }, []);

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
            <Button
              variant="outline"
              onClick={() => navigate('/notices/create')}
            >
              글 작성
            </Button>
          </div>

          <div className="relative">
            <Input
              placeholder="공지사항 검색"
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
        ) : !noticeData || !pageData ? (
          <div className="text-ck-gray-600 ck-body-2 flex items-center justify-center rounded-md border py-10">
            데이터가 없습니다.
          </div>
        ) : (
          <>
            <NoticeTable
              noticeData={noticeData}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
            />

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
