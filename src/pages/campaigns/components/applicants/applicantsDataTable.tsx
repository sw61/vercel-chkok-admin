import { Suspense, useState } from 'react';
import { ApplicantsTable } from './applicantsTable';
import { PaginationHook } from '@/hooks/paginationHook';
import { useParams } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getApplicants } from '@/services/campaigns/applicants/applicantsApi';

interface Campaigns {
  campaignId: number;
  campaignTitle: string;
  totalApplicants: number;
  applicants: {
    id: number;
    nickname: string;
    email: string;
    appliedAt: string;
    applicationStatus: string;
    statusText: string;
  };
}

export default function ApplicantsDataTable() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [status, setStatus] = useState<string>('전체');

  const statusValues = [
    { status: '전체', label: '전체 신청인' },
    { status: '선정 대기중', label: '선정 대기중' },
    { status: '선정', label: '선정됨' },
    { status: '거절', label: '거절됨' },
    { status: '완료', label: '완료됨' },
  ];
  const { data: applicantsData } = useSuspenseQuery({
    queryKey: ['applicantsTable', campaignId, status, currentPage],
    queryFn: () =>
      getApplicants({
        campaignId,
        status,
        currentPage,
      }),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleStatus = (status: string) => {
    setStatus(status);
  };

  if (!applicantsData) {
    return <div>데이터를 가져오는데 실패했습니다.</div>;
  }
  return (
    <Suspense fallback={<ApplicantsDataTable />}>
      {applicantsData?.length === 0 ? (
        <div className="mt-4 text-ck-gray-600 ck-body-2 flex h-40 items-center justify-center rounded-md border">
          캠페인 신청 인원이 없습니다.
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mt-6">
            <div className="ck-sub-title-1 ">캠페인 신청 인원 목록</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {statusValues.find((item) => item.status === status)?.label ||
                    '신청인 필터'}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusValues.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item.status}
                    checked={status === item.status}
                    onClick={() => handleStatus(item.status)}
                  >
                    {item.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <ApplicantsTable applicantsData={applicantsData.applicants} />
            <PaginationHook
              pageData={applicantsData.pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </Suspense>
  );
}
