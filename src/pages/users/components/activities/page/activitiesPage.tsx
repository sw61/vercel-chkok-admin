import axiosInterceptor from '@/lib/axiosInterceptors';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UsersActivitiesTable } from '../table/usersActivities';
import { ClientsActivitiesTable } from '../table/clientsActivities';
import { PaginationHook } from '@/hooks/paginationHook';

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
  const [status, setStatus] = useState<string | null>(null);
  const [pageData, setPageData] = useState<Pagination>();

  const statusValues = [
    { type: '전체', label: '전체 신청인' },
    { type: '선정 대기중', label: '선정 대기중' },
    { type: '선정', label: '선정' },
    { type: '거절', label: '거절' },
    { type: '완료', label: '완료' },
  ];

  const getActivities = async (page: number = 0, type: typeof status) => {
    try {
      const response = await axiosInterceptor.get(
        `/users/${userId}/activities?status=${status}`
      );
      const data = response.data.data;
      setActivitiesData(data);
      setPageData(data.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    getActivities(page, status);
  };

  const handleType = (type: string | null) => {
    setStatus(type);
    getActivities(0, type);
  };

  useEffect(() => {
    getActivities(0, status);
  }, []);

  if (!activitiesData || !pageData) {
    return <div>데이터를 불러오는데 실패했습니다.</div>;
  }

  return (
    <>
      {activitiesData.userRole === 'USER' ? (
        <UsersActivitiesTable userItems={activitiesData.items as UserItems[]} />
      ) : (
        <ClientsActivitiesTable
          clientsItems={activitiesData.items as ClientsItems[]}
        />
      )}
      <PaginationHook pageData={pageData} onPageChange={handlePageChange} />
    </>
  );
}
