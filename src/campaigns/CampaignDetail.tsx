import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
interface Campaign {
  aprrovalDate: any;
  id: number;
  title: string;
  campaignType: string;
  thumbnailUrl: string;
  productShortInfo: string;
  maxApplicants: number;
  recruitmentStartDate: number;
  recruitmentEndDate: string;
  reviewDeadlineDate: string;
  approvalStatus: string;
  approvalComment: string;
  approvalDate: string;
  selectionDate: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: number;
    nickname: string;
    email: string;
    role: string;
  };
  company: {
    id: number;
    companyName: string;
    contactPerson: string;
    phoneNumber: string;
  };
}

export default function CampaignDetail() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaignData, setCampaignData] = useState<Campaign | null>(null);
  const navigate = useNavigate();

  // 캠페인 상세 정보 조회
  const getCampaignDetail = async (id: string) => {
    try {
      const response = await axiosInterceptor.get(`/campaigns/${id}`);
      const campaignData = response.data.data;
      setCampaignData(campaignData);
      console.log(campaignData);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // 캠페인 승인 / 거절
  const putCampaignApproval = async (id: number) => {
    try {
      const response = await axiosInterceptor.put(`/campaigns/${id}/approval`);
      const updatedData = response.data.data;
      setCampaignData((prev) => ({ ...prev, ...updatedData }));
      alert(response.data.message);
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
    if (campaignId) {
      getCampaignDetail(campaignId);
    }
  }, [campaignId]);
  if (!campaignData) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      <Table className="flex flex-row ">
        <TableHeader>
          <TableRow className="flex flex-col border-none">
            <TableHead>ID</TableHead>
            <TableHead>캠페인 이름</TableHead>
            <TableHead>캠페인 유형</TableHead>
            <TableHead>썸네일</TableHead>
            <TableHead>상품 간단 정보</TableHead>
            <TableHead>최대 지원자 수</TableHead>
            <TableHead>신청 시작일</TableHead>
            <TableHead>신청 종료일</TableHead>
            <TableHead>승인 상태</TableHead>
            <TableHead>승인 코멘트</TableHead>
            <TableHead>승인일</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead>리뷰 마감일</TableHead>
            <TableHead>선택일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="flex justify-center">
          <TableRow className="flex flex-col">
            <TableCell>{campaignData.id}</TableCell>
            <TableCell>{campaignData.title}</TableCell>
            <TableCell>{campaignData.campaignType}</TableCell>
            <TableCell>
              <Tooltip>
                <TooltipTrigger>{campaignData.thumbnailUrl}</TooltipTrigger>
                <TooltipContent>
                  <img src={campaignData.thumbnailUrl}></img>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell>{campaignData.productShortInfo}</TableCell>
            <TableCell>{campaignData.maxApplicants}</TableCell>
            <TableCell>{campaignData.recruitmentStartDate}</TableCell>
            <TableCell>{campaignData.recruitmentEndDate}</TableCell>
            <TableCell>{campaignData.approvalStatus}</TableCell>
            <TableCell>{campaignData.approvalComment}</TableCell>
            <TableCell>{campaignData.approvalDate.split("T")[0]}</TableCell>
            <TableCell>{campaignData.createdAt.split("T")[0]}</TableCell>
            <TableCell>{campaignData.reviewDeadlineDate}</TableCell>
            <TableCell>{campaignData.selectionDate}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Accordion type="single" collapsible className="w-full">
        {campaignData.creator && (
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-bold cursor-pointer">
              크리에이터 정보
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>ID : {campaignData.creator.id}</p>
              <p>닉네임 : {campaignData.creator.nickname}</p>
              <p>이메일 : {campaignData.creator.email}</p>
              <p>권한 : {campaignData.creator.role}</p>
            </AccordionContent>
          </AccordionItem>
        )}

        {campaignData.company && (
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-bold cursor-pointer">
              회사 정보
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>ID : {campaignData.company.id}</p>
              <p>이름 : {campaignData.company.companyName}</p>
              <p>연락처 이름 : {campaignData.company.contactPerson}</p>
              <p>연락처 : {campaignData.company.phoneNumber}</p>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          className="cursor-pointer"
          onClick={() => putCampaignApproval(campaignData.id)}
        >
          승인 / 거절
        </Button>
      </div>
    </>
  );
}
