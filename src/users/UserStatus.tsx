import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserStatus() {
  const [userStatus, setUserStatus] = useState();
  const navigate = useNavigate();
  const getUserStatus = async () => {
    try {
      const response = await axiosInterceptor.get(`/users/stats`);
      const userStatus = response.data.data;
      setUserStatus(userStatus);
      console.log(userStatus);
    } catch (error) {
      console.log(error);
      navigate("/");
      alert("로그인이 필요합니다.");
    }
  };
  useEffect(() => {
    getUserStatus();
  }, []);
  return <></>;
}
