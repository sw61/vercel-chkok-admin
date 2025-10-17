import { Suspense, useState } from 'react';
import {
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Card } from '@/components/ui/card';
import UserTableSkeleton from '@/pages/users/components/table/usersTableSkeleton';
import { PaginationHook } from '@/hooks/paginationHook';
import { CompanyTable } from '@/pages/companies/components/companyTable';
import { useSuspenseQuery } from '@tanstack/react-query';
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
  const { data: companyData } = useSuspenseQuery<Company>({
    queryKey: ['companyTable', currentPage],
    queryFn: () => getCompanyTable(currentPage),
  });

  // 페이지네이션
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <Card className="px-6 py-4">
        <div className="ck-title">클라이언트 신청 목록</div>
        <Suspense fallback={<UserTableSkeleton />}>
          <CompanyTable
            companyData={companyData.companies}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
          <PaginationHook
            pageData={companyData.pagination}
            onPageChange={handlePageChange}
          />
        </Suspense>
      </Card>
    </div>
  );
}
