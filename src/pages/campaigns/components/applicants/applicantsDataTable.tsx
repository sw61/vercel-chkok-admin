import axiosInterceptor from '@/lib/axiosInterceptors';
import { useEffect, useState } from 'react';
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
interface Applicants {
  id: number;
  nickname: string;
  email: string;
  appliedAt: string;
  applicationStatus: string;
  statusText: string;
}
interface Pagination {
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export default function ApplicantsDataTable() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [applicantsData, setApplicantsData] = useState<Applicants[]>();
  const [pageData, setPageData] = useState<Pagination>();
  const [campaignsData, setCampaignsData] = useState<Campaigns>();
  const [status, setStatus] = useState<string>('전체');

  const statusValues = [
    { status: '전체', label: '전체 신청인' },
    { status: '선정 대기중', label: '선정 대기중' },
    { status: '선정', label: '선정' },
    { status: '거절', label: '거절' },
    { status: '완료', label: '완료' },
  ];

  const getApplicants = async (page: number = 0, status: string) => {
    try {
      const url =
        status === '전체'
          ? `/campaigns/${campaignId}/applicants?page=${page}`
          : `/campaigns/${campaignId}/applicants?page=${page}&status=${status}`;
      const response = await axiosInterceptor.get(url);
      const data = response.data.data;
      setCampaignsData(data);
      setApplicantsData(data.applicants);
      setPageData(data.pagination);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    getApplicants(page, status);
  };
  const handleStatus = (status: string) => {
    setStatus(status);
  };
  useEffect(() => {
    getApplicants(0, status);
  }, []);
  if (!campaignsData || !applicantsData || !pageData) {
    return <div>데이터를 가져오는데 실패했습니다.</div>;
  }
  return (
    <>
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
            <ApplicantsTable applicantsData={applicantsData} />
            <PaginationHook
              pageData={pageData}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
}
