// page
import { CampaignPagination } from "./CampaignPagination";
import { CampaignDataTable } from "./CampaignDataTable";
// ts, library
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface Campaign {
  id: number;
  title: string;
  campaignType: string;
  approvalStatus: string;
  approvalComment: string;
  approvalDate: string;
  createdAt: string;
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
  const [campaignData, setCampaignData] = useState<Campaign[]>();
  const [pageData, setPageData] = useState<PaginationData | null>();
  const navigate = useNavigate();

  const getCampaignTable = async (page: number = 0) => {
    try {
      const response = await axiosInterceptor.get(
        `/campaigns?page=${page}&size=10`
      );
      const campaignData = response.data;
      console.log(campaignData);

      setCampaignData(campaignData.content);
      setPageData(campaignData.pagination);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400:
            toast.error("잘못된 요청입니다. 입력 데이터를 확인해주세요.");
            break;
          case 401:
            toast.error("토큰이 만료되었습니다. 다시 로그인 해주세요");
            navigate("/login");
            break;
          case 403:
            toast.error("접근 권한이 없습니다.");
            break;
          case 404:
            toast.error("요청한 사용자 데이터를 찾을 수 없습니다.");
            break;
          case 500:
            toast.error("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
            break;
        }
      }
    }
  };
  useEffect(() => {
    getCampaignTable();
  }, []);
  if (!campaignData || !pageData) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    getCampaignTable(page);
  };

  return (
    <>
      <div>
        <CampaignDataTable campaignData={campaignData} />
        <CampaignPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
