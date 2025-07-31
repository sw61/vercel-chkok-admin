import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { Button } from "@/components/ui/button";

interface BannerData {
  id: number;
  title: string;
  bannerUrl: string;
  redirectUrl: string;
  description: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}
// 현재 내용 없음
export default function BannersDetail() {
  const { bannerId } = useParams<{ bannerId: string }>();
  const [bannerData, setBannerData] = useState<BannerData>();

  // 배너 목록 조회
  const getBannersTable = async () => {
    try {
      const response = await axiosInterceptor.get("/api/banners");
      const data = response.data.data;
      setBannerData(data);
    } catch (error) {
      console.error("배너 목록 조회 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    getBannersTable();
  }, []);

  if (!bannerData) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }

  return (
    <>
      {bannerData && (
        <Table className="flex flex-row ">
          <TableHeader>
            <TableRow className="flex flex-col border-none">
              <TableHead>ID</TableHead>
              <TableHead>배너 이름</TableHead>
              <TableHead>배너 위치</TableHead>
              <TableHead>배너 URL</TableHead>
              <TableHead>Redirect URL</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead>업데이트일</TableHead>
              <TableHead>설명</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="flex justify-center">
            <TableRow className="flex flex-col">
              <TableCell>{bannerData.id}</TableCell>
              <TableCell>{bannerData.title}</TableCell>
              <TableCell>{bannerData.position}</TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger>{bannerData.bannerUrl}</TooltipTrigger>
                  <TooltipContent>
                    <img src={bannerData.bannerUrl}></img>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>{bannerData.redirectUrl}</TableCell>
              <TableCell>{bannerData.createdAt}</TableCell>
              <TableCell>{bannerData.updatedAt}</TableCell>
              <TableCell>{bannerData.description}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button className="cursor-pointer">배너 수정</Button>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button className="cursor-pointer">배너 삭제</Button>
      </div>
    </>
  );
}
