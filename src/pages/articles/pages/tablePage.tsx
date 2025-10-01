import { Suspense, useState } from 'react';
import { type VisibilityState } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { PaginationHook } from '@/hooks/paginationHook';
import { ArticleTable } from '../components/table/articleTable';
import UserTableSkeleton from '@/pages/users/components/table/usersTableSkeleton';
import { useQuery } from '@tanstack/react-query';
import useDebounce from '@/hooks/useDebounce';
import { getArticleTable, searchArticle } from '@/services/articles/tableApi';
import ArticleDropDownMenu from '../components/table/dropdownMenu';

export default function ArticleTablePage() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchKey, setSearchKey] = useState<string>('');
  const [debouncedSearchKey] = useDebounce(searchKey, 300);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [articleType, setArticleType] = useState<string>('all');

  // 아티클 전체 목록 조회
  const { data: articleData } = useQuery({
    queryKey: ['articleTable', currentPage, articleType],
    queryFn: () => getArticleTable({ currentPage, articleType }),
    enabled: !debouncedSearchKey,
  });
  // 아티클 검색
  const { data: searchData } = useQuery({
    queryKey: ['searchArticle', searchKey, currentPage],
    queryFn: () => searchArticle({ currentPage, searchKey, articleType }),
    enabled: !!debouncedSearchKey,
  });
  const isSearchMode = !!searchKey;
  const activeData = isSearchMode ? searchData : articleData;
  const activePageData = activeData?.pagination ?? {
    totalPages: 0,
    currentPage: 0,
  };
  const activeContent = activeData?.content || [];

  // 페이지네이션
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // 아티클 필터
  const handleType = (type: string) => {
    setArticleType(type);
  };

  return (
    <div className="p-6">
      <Card className="px-6 py-4">
        <div className="mb-2 flex items-center justify-between">
          <ArticleDropDownMenu
            articleType={articleType}
            handleType={handleType}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />

          <div className="relative">
            <Input
              placeholder="체험콕 아티클 검색"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="pr-12"
            />
            <button className="absolute top-0 right-0 h-full w-10">
              <Search />
            </button>
          </div>
        </div>
        <Suspense fallback={<UserTableSkeleton />}>
          <ArticleTable articleData={activeContent} />
          <PaginationHook
            pageData={activePageData}
            onPageChange={handlePageChange}
          />
        </Suspense>
      </Card>
    </div>
  );
}
