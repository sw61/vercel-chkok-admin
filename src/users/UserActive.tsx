import axiosInterceptor from "@/lib/axios-interceptors";

// 사용자 활성화 / 비활성화
export default function UserActive() {
  const putUserStatus = async () => {
    try {
      const response = await axiosInterceptor.put(`/users/17/status`);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return <></>;
}
