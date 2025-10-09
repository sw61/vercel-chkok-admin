import { CampaignsTable } from '@/pages/campaigns/components/table/campaignsTable';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search } from 'lucide-react';
import {
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Card } from '@/components/ui/card';
import CampaignTableSkeleton from '@/pages/campaigns/components/table/campaignTableSkeleton';
import { PaginationHook } from '@/hooks/paginationHook';
import { useQuery } from '@tanstack/react-query';
import {
  getCampaignTable,
  searchCampaign,
} from '@/services/campaigns/table/tableApi';
import useDebounce from '@/hooks/useDebounce';

export default function CampaignsTablePage() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchKey, setSearchKey] = useState<string>('');
  const [debouncedSearchKey] = useDebounce(searchKey, 300);
  const [campaignType, setCampaignType] = useState<string>('ALL');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const headerMenu = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: '캠페인 이름' },
    { id: 'campaignType', label: '캠페인 유형' },
    { id: 'approvalStatus', label: '처리 상태' },
    { id: 'approvalDate', label: '처리일' },
    { id: 'createdAt', label: '생성일' },
    { id: 'approvalComment', label: '처리 코멘트' },
  ];

  const typeValues = [
    { type: 'ALL', label: '전체 캠페인' },
    { type: 'PENDING', label: '승인 대기 캠페인' },
    { type: 'APPROVED', label: '승인된 캠페인' },
    { type: 'REJECTED', label: '거절된 캠페인' },
    { type: 'EXPIRED', label: '만료된 캠페인' },
  ];

  const {
    data: campaignData,
    isPending,
    error,
    isError,
  } = useQuery({
    queryKey: ['campaignTable', currentPage, campaignType],
    queryFn: () => getCampaignTable(currentPage, campaignType),
    enabled: !debouncedSearchKey,
    select: (data) => ({
      ...data,
      content: data.content.map((campaign: any) => ({
        ...campaign,
        categoryType: campaign.category?.type ?? '',
        categoryName: campaign.category?.name ?? '',
      })),
    }),
  });

  const { data: searchData } = useQuery({
    queryKey: ['searchCampaign', searchKey, currentPage, campaignType],
    queryFn: () => searchCampaign(searchKey, currentPage, campaignType),
    enabled: !!searchKey,
    select: (data) => ({
      ...data,
      content: data.content.map((campaign: any) => ({
        ...campaign,
        categoryType: campaign.category?.type ?? '',
        categoryName: campaign.category?.name ?? '',
      })),
    }),
  });

  const isSearchMode = !!searchKey;
  const activeData = isSearchMode ? searchData : campaignData;
  const activePageData = activeData?.pagination ?? {
    totalPages: 0,
    currentPage: 0,
  };
  const activeContent = activeData?.content || [];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleType = (type: string) => {
    setCampaignType(type);
  };
  useEffect(() => {
    if (!isSearchMode) {
      setCurrentPage(0);
    }
  }, [isSearchMode]);
  if (isError) {
    console.log(error);
  }
  return (
    <div className="p-6">
      <Card className="px-6 py-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {typeValues.find((item) => item.type === campaignType)
                    ?.label || '캠페인 필터'}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {typeValues.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item.type}
                    checked={campaignType === item.type}
                    onClick={() => handleType(item.type)}
                  >
                    {item.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
              placeholder="캠페인 이름 검색"
              value={searchKey}
              onChange={(event) => setSearchKey(event.target.value)}
              className="pr-12"
            />
            <button className="absolute top-0 right-0 h-full w-10">
              <Search />
            </button>
          </div>
        </div>

        {isPending ? (
          <CampaignTableSkeleton />
        ) : !campaignData ? (
          <div className="text-ck-gray-600 ck-body-2 flex h-40 items-center justify-center rounded-md border">
            캠페인 데이터를 불러오는데 실패했습니다.
          </div>
        ) : (
          <>
            <CampaignsTable
              campaignData={activeContent}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
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
