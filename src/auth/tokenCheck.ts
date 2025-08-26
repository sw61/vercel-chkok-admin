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
      toast.error("토큰이 없습니다. 로그인이 필요합니다.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  return tokenCheck() ? children : null;
};
