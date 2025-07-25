import axiosInterceptor from "@/lib/axios-interceptors";
import { useState, useEffect } from "react";
export default function BannersTable() {
  const [bannerData, setBannerData] = useState();
  const getBannersTable = async () => {
    try {
      const response = await axiosInterceptor.get("/api/banners");
      const data = response.data.data;
      setBannerData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };
  useEffect(() => {
    getBannersTable();
  }, []);
  return (
    <>
      <div>{bannerData}</div>
    </>
  );
}
