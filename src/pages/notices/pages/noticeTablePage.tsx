import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { PaginationHook } from '@/hooks/paginationHook';
import { NoticeTable } from '../components/table/noticeTable';
import { useNavigate } from 'react-router-dom';
import UserTableSkeleton from '@/pages/users/components/table/usersTableSkeleton';
import { useQuery } from '@tanstack/react-query';
import {
  getNoticeTable,
  searchNotice,
} from '@/services/notices/table/tableApi';
import useDebounce from '@/hooks/useDebounce';

export default function NoticeTablePage() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchKey, setSearchKey] = useState<string>('');
  const [debouncedSearchKey] = useDebounce(searchKey, 300);
  const navigate = useNavigate();

  // 공지사항 데이터 테이블 패칭
  const { data: noticeData, isPending } = useQuery({
    queryKey: ['noticeTable', currentPage],
    queryFn: () => getNoticeTable(currentPage),
    enabled: !debouncedSearchKey,
  });
  // 공지사항 키워드 검색 데이터 패칭
  const { data: searchData } = useQuery({
    queryKey: ['searchNotice', currentPage, searchKey],
    queryFn: () => searchNotice(currentPage, searchKey),
    enabled: !!debouncedSearchKey,
  });
  const isSearchMode = !!searchKey;
  const activeData = isSearchMode ? searchData : noticeData;
  const activePageData = activeData?.pagination ?? {
    totalPages: 0,
    currentPage: 0,
  };
  const activeContent = activeData?.notices || [];

  // 페이지네이션
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!isSearchMode) {
      setCurrentPage(0);
    }
  }, [isSearchMode]);

  return (
    <div className="p-6">
      <Card className="px-6 py-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-4">
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
              className="pr-12"
            />
            <button className="absolute top-0 right-0 h-full w-10 cursor-pointer">
              <Search />
            </button>
          </div>
        </div>

        {isPending ? (
          <UserTableSkeleton />
        ) : !noticeData ? (
          <div className="text-ck-gray-600 ck-body-2 flex items-center justify-center rounded-md border py-10">
            데이터가 없습니다.
          </div>
        ) : (
          <>
            <NoticeTable noticeData={activeContent} />
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
