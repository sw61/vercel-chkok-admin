import axiosInterceptor from '@/lib/axiosInterceptors';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UsersActivitiesTable } from '../table/usersActivities';
import { ClientsActivitiesTable } from '../table/clientsActivities';
import { PaginationHook } from '@/hooks/paginationHook';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface UserItems {
  id: number;
  title: string;
  company: string;
  type: string;
  statusText: string;
  createdAt: string;
  updatedAt: string;
  campaignType: string;
  // 유저 타입에서만 사용
  campaignId: number;
  maxApplicants: number;
}

interface ClientsItems {
  id: number;
  title: string;
  company: string;
  type: string;
  statusText: string;
  createdAt: string;
  updatedAt: string;
  campaignType: string;
  // 클라이언트 타입에서만 사용
  currentApplications: number;
  approvedBy: string;
  approvalDate: string;
  recruitmentPeriod: string;
}

export default function ActivitiesPage() {
  const { userId } = useParams<{ userId: string }>();

  const [status, setStatus] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(0);

  const usersStatusValues = [
    { status: 'ALL', label: '전체 캠페인' },
    { status: 'APPLIED', label: '선정' },
    { status: 'PENDING', label: '대기' },
    { status: 'SELETED', label: '선택' },
    { status: 'REJECTED', label: '거절' },
    { status: 'COMPLETED', label: '완료' },
  ];

  const clientsStatusValues = [
    { status: 'ALL', label: '전체 캠페인' },
    { status: 'PENDING', label: '대기' },
    { status: 'APPROVED', label: '승인' },
    { status: 'REJECTED', label: '거절' },
    { status: 'EXPIRED', label: '만료' },
  ];
  const { data: activitiesData } = useQuery({
    queryKey: ['activities', userId, status, currentPage],
    queryFn: async () => {
      const url =
        status === 'ALL'
          ? `/users/${userId}/activities?page=${currentPage}`
          : `/users/${userId}/activities?status=${status}&page=${currentPage}`;
      const response = await axiosInterceptor.get(url);
      const data = response.data.data;
      return data;
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatus = (status: string) => {
    setStatus(status);
  };
  const pageData = activitiesData?.pagination;

  if (!activitiesData) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className="flex flex-col">
      {activitiesData.userRole === 'USER' ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="ck-sub-title-1 ">사용자 캠페인 활동 내역</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {usersStatusValues.find((item) => item.status === status)
                    ?.label || '상태 필터'}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {usersStatusValues.map((item) => (
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

          <UsersActivitiesTable
            userItems={activitiesData.items as UserItems[]}
          />
        </>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="ck-sub-title-1">클라이언트 캠페인 활동 내역</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {clientsStatusValues.find((item) => item.status === status)
                    ?.label || '상태 필터'}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {clientsStatusValues.map((item) => (
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

          <ClientsActivitiesTable
            clientsItems={activitiesData.items as ClientsItems[]}
          />
        </>
      )}
      <div className="mt-4">
        <PaginationHook pageData={pageData} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
