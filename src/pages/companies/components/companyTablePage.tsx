import { useState } from 'react';
import {
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import UserTableSkeleton from '@/pages/users/components/table/usersTableSkeleton';
import { PaginationHook } from '@/hooks/paginationHook';
import { CompanyTable } from '@/pages/companies/components/companyTable';
import { useQuery } from '@tanstack/react-query';
import { getCompanyTable } from '@/services/companies/tableApi';

interface Company {
  companies: [
    {
      id: number;
      userId: number;
      companyName: string;
      businessRegistrationNumber: string;
      createdAt: string;
      updatedAt: string;
    },
  ];
  pagination: {
    first: boolean;
    last: boolean;
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}

export default function CompanyTablePage() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [currentPage, setCurrentPage] = useState<number>(0);

  // 데이터 패칭
  const { data: companyData, isPending } = useQuery<Company>({
    queryKey: ['companyTable', currentPage],
    queryFn: () => getCompanyTable({ currentPage }),
  });

  // 페이지네이션
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const pageData = companyData?.pagination;

  return (
    <Card className="px-6 py-4">
      <div className="mb-2 flex items-center justify-between">
        <Button>사용자 목록</Button>
      </div>

      {isPending ? (
        <UserTableSkeleton />
      ) : !companyData || !pageData ? (
        <div className="text-ck-gray-600 ck-body-2 flex items-center justify-center rounded-md border py-10">
          데이터가 없습니다.
        </div>
      ) : (
        <>
          <CompanyTable
            companyData={companyData.companies}
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
