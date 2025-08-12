import { useNavigate } from "react-router-dom";
import logo from "../Image/mainLogo.png";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col w-full h-full  min-h-screen justify-center items-center gap-4">
        <div className="ck-headline-0">404 ERROR</div>
        <div className="flex flex-col justify-center items-center">
          <div className="ck-body-1">죄송합니다. 페이지를 찾을 수 없습니다.</div>
          <div className="ck-body-1">존재하지 않는 주소를 입력하셨거나,</div>
          <div className="ck-body-1">요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</div>
        </div>

        <img className="w-80 h-50 mt-10" src={logo}></img>
        <Button className="ck-headline-1 cursor-pointer mt-10" onClick={() => navigate("/login")}>
          홈으로
        </Button>
      </div>
    </>
  );
}
