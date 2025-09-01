import axiosInterceptor from '@/lib/axios-interceptors';
import { useState, useEffect } from 'react';
import {
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UserTableSkeleton from '@/Skeleton/UserTableSkeleton';
import { PaginationHook } from '@/hooks/PaginationHook';
import { CompanyTable } from './CompanyTable';

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

export default function CompanyTablePage() {
  const [companyData, setCompanyData] = useState<Company[]>();
  const [pageData, setPageData] = useState<PaginationData | null>();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 사용자 테이블 조회
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
  // 페이지네이션
  const handlePageChange = (page: number) => {
    getCompanyTable(page);
  };
  useEffect(() => {
    getCompanyTable();
  }, []);

  return (
    <Card className="px-6 py-4">
      <div className="mb-2 flex items-center justify-between">
        <Button>사용자 목록</Button>
      </div>

      {isLoading ? (
        <UserTableSkeleton />
      ) : !companyData || !pageData ? (
        <div className="text-ck-gray-600 ck-body-2 flex items-center justify-center rounded-md border py-10">
          데이터가 없습니다.
        </div>
      ) : (
        <>
          <CompanyTable
            companyData={companyData}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
          <PaginationHook pageData={pageData} onPageChange={handlePageChange} />
        </>
      )}
    </Card>
  );
}
