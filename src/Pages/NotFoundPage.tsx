import { useNavigate } from "react-router-dom";
import bannerImg from "../Image/bannerImg.png";
import { Button } from "@/components/ui/button";
import { House, ArrowBigLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
        <div className="ck-headline-0">404 ERROR</div>
        <div className="flex flex-col items-center justify-center">
          <div className="ck-body-1">
            죄송합니다. 페이지를 찾을 수 없습니다.
          </div>
          <div className="ck-body-1">존재하지 않는 주소를 입력하셨거나,</div>
          <div className="ck-body-1">
            요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
          </div>
        </div>

        <img className="mt-10 h-50 w-80" src={bannerImg}></img>
        <div className="flex gap-6">
          <Button
            className="ck-headline-1 mt-10 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <House />
            홈으로
          </Button>
          <Button
            className="ck-headline-1 mt-10 cursor-pointer"
            onClick={handleGoBack}
          >
            <ArrowBigLeft />
            이전
          </Button>
        </div>
      </div>
    </>
  );
}
