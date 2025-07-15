import axiosInterceptor from "@/lib/axios-interceptors";
// 사용자 삭제
export default function UserDelete() {
  const deleteUser = async () => {
    try {
      const response = await axiosInterceptor.delete(`/users/{userId}`);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return <></>;
}
