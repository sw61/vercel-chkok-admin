import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('로그아웃 되었습니다.');
    navigate('/login', { replace: true });
  };
  return logout;
};
