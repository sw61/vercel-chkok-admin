import axiosInterceptor from '@/lib/axios-interceptors';

function GetUser() {
  const getUserMe = async () => {
    try {
      const response = await axiosInterceptor.get('/auth/me');
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div onClick={getUserMe}>관리자 조회 버튼</div>
    </>
  );
}

export default GetUser;
