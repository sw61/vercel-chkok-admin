import { CampaignPagination } from "@/Campaigns/CampaignPagination";
import { CampaignTable } from "@/Campaigns/CampaignTable";
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import {
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Campaign {
  id: number;
  title: string;
  campaignType: string;
  approvalStatus: string;
  approvalComment: string;
  approvalDate: string;
  createdAt: string;
  recruitmentStartDate: string;
}

interface PaginationData {
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export default function CampaignTablePage() {
  const [campaignData, setCampaignData] = useState<Campaign[] | null>();
  const [pageData, setPageData] = useState<PaginationData | null>();
  const [searchKey, setSearchKey] = useState<string>("");
  const [campaignType, setCampaignType] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const headerMenu = [
    { id: "id", label: "ID" },
    { id: "title", label: "캠페인 이름" },
    { id: "campaignType", label: "캠페인 유형" },
    { id: "approvalStatus", label: "처리 상태" },
    { id: "approvalDate", label: "처리일" },
    { id: "createdAt", label: "생성일" },
    { id: "approvalComment", label: "처리 코멘트" },
  ];
  // 캠페인 테이블 조회
  const getCampaignTable = async (
    page: number = 0,
    type: typeof campaignType,
  ) => {
    setIsLoading(true);
    try {
      const url =
        type === "ALL"
          ? `/campaigns?page=${page}&size=10`
          : `/campaigns?approvalStatus=${type}&page=${page}&size=10`;
      const response = await axiosInterceptor.get(url);
      const campaignData = response.data.data;
      setCampaignData(campaignData.content);
      setPageData(campaignData.pagination);
      console.log(campaignData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    // 캠페인 검색 함수
  };
  const handleSearch = async (page: number = 0) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(
        `/campaigns/search?keyword=${searchKey}&page=${page}&size=10`,
      );
      const campaignData = response.data.data;
      setCampaignData(campaignData.content);
      setPageData(campaignData.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCampaignTable(0, campaignType);
  }, [campaignType]);

  const typeValues = [
    { type: "ALL", label: "전체 캠페인" },
    { type: "PENDING", label: "승인 대기 캠페인" },
    { type: "APPROVED", label: "승인된 캠페인" },
    { type: "REJECTED", label: "거절된 캠페인" },
    { type: "EXPIRED", label: "만료된 캠페인" },
  ];

  const handlePageChange = (page: number) => {
    getCampaignTable(page, campaignType);
  };

  const handleType = (type: typeof campaignType) => {
    setCampaignType(type);
  };

  const currentLabel =
    typeValues.find((item) => item.type === campaignType)?.label ||
    "캠페인 필터";

  return (
    <Card className="px-6 py-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {currentLabel}
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
          <button
            className="absolute top-0 right-0 h-full w-10 cursor-pointer"
            onClick={() => handleSearch(0)}
          >
            <Search />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="overflow-x-auto rounded-md border">
          <Table className="table-fixed" style={{ minWidth: `${1130}px` }}>
            <TableHeader>
              <TableRow>
                {[50, 250, 120, 100, 120, 120, 120, 250].map((width, idx) => (
                  <TableHead key={idx} style={{ width: `${width}px` }}>
                    <Skeleton className="h-4 w-3/4" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, rowIdx) => (
                <TableRow key={rowIdx}>
                  {[50, 250, 120, 100, 120, 120, 120, 250].map(
                    (width, colIdx) => (
                      <TableCell
                        key={`${rowIdx}-${colIdx}`}
                        style={{ width: `${width}px` }}
                      >
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : !campaignData ||
        !pageData ||
        campaignData.length === 0 ||
        pageData.totalElements === 0 ? (
        <div className="text-ck-gray-600 ck-body-2 flex h-40 items-center justify-center rounded-md border">
          캠페인 데이터가 없습니다.
        </div>
      ) : (
        <>
          <CampaignTable
            campaignData={campaignData}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
          <CampaignPagination
            pageData={pageData}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Card>
  );
}
