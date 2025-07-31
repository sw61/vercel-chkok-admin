import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export const tokenCheck = (): boolean => {
  return !!localStorage.getItem("accessToken");
};
interface PrivateComponentProps {
  children: React.ReactNode;
}
export const PrivateComponent: React.FC<PrivateComponentProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!tokenCheck()) {
      toast.error("토큰이 만료되었습니다. 다시 로그인 해주세요.");
      alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  return tokenCheck() ? children : null;
};
