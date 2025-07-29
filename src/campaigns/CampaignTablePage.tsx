// page
import { CampaignPagination } from "@/Campaigns/CampaignPagination";
import { CampaignTable } from "@/Campaigns/CampaignTable";
// ts, library
import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
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
  const [campaignData, setCampaignData] = useState<Campaign[] | null>();
  const [pageData, setPageData] = useState<PaginationData | null>();
  const [campaignType, setCampaignType] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const navigate = useNavigate();

  const getCampaignTable = async (
    page: number = 0,
    type: typeof campaignType
  ) => {
    setIsLoading(true);
    try {
      const url =
        campaignType === "ALL"
          ? `/campaigns?page=${page}&size=10`
          : `/campaigns?approvalStatus=${type}&page=${page}&size=10`;
      const response = await axiosInterceptor.get(url);
      const campaignData = response.data.data;
      setCampaignData(campaignData.content);
      setPageData(campaignData.pagination);
      console.log(campaignData);
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
            navigate("/login");
            break;
          case 404:
            toast.error("요청한 사용자 데이터를 찾을 수 없습니다.");
            break;
          case 500:
            toast.error("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
            break;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCampaignTable(0, campaignType);
  }, [campaignType]);
  if (!campaignData || !pageData || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }
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
    <>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
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

        <CampaignTable campaignData={campaignData} />
        <CampaignPagination
          pageData={pageData}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
