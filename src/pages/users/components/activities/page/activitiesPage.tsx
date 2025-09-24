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

interface Activities {
  userId: number;
  userRole: string;
  items: (UserItems | ClientsItems)[];
  pagination: Pagination;
}

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

interface Pagination {
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export default function ActivitiesPage() {
  const { userId } = useParams<{ userId: string }>();
  const [activitiesData, setActivitiesData] = useState<Activities | null>(null);
  const [status, setStatus] = useState<string>('ALL');
  const [pageData, setPageData] = useState<Pagination>();

  const usersStatusValues = [
    { status: 'ALL', label: '전체 신청인' },
    { status: 'APPLIED', label: '선정' },
    { status: 'PENDING', label: '대기' },
    { status: 'SELETED', label: '선택' },
    { status: 'REJECTED', label: '거절' },
    { status: 'COMPLETED', label: '완료' },
  ];

  const clientsStatusValues = [
    { status: 'ALL', label: '전체 신청인' },
    { status: 'PENDING', label: '대기' },
    { status: 'APPROVED', label: '승인' },
    { status: 'REJECTED', label: '거절' },
    { status: 'EXPIRED', label: '만료' },
  ];
  const getActivities = async (page: number = 0, status: string) => {
    try {
      const url =
        status === 'ALL'
          ? `/users/${userId}/activities`
          : `/users/${userId}/activities?status=${status}`;
      const response = await axiosInterceptor.get(url);
      const data = response.data.data;
      setActivitiesData(data);
      setPageData(data.pagination);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    getActivities(page, status);
  };

  const handleStatus = (status: string) => {
    setStatus(status);
    getActivities(0, status);
  };

  useEffect(() => {
    getActivities(0, status);
  }, []);

  if (!activitiesData || !pageData) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className="flex flex-col">
      {activitiesData.userRole === 'USER' ? (
        <>
          <div className="mb-4">
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
          <div className="mb-4">
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
