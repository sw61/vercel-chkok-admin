import axios from "axios";

const axiosInterceptor = axios.create({
  baseURL: "https://chkok.kr/admin-api",
});

axiosInterceptor.interceptors.request.use(
  function (config) {
    // 요청이 전달되기 전에 작업 수행

    // 1. 토큰이 로컬스토리지에 저장이 되어 있나?
    if (localStorage.getItem("accessToken") !== null) {
      const accessToken = localStorage.getItem("accessToken");

      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    // 요청 오류가 있는 작업 수행
    return Promise.reject(error);
  },
);

// 응답 인터셉터 추가하기
axiosInterceptor.interceptors.response.use(
  async function (response) {
    // 2xx 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 데이터가 있는 작업 수행

    if (response.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axiosInterceptor.post("/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = response.data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
      } catch (error) {
        console.log(error);
      }
    }

    return response;
  },
  function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 합니다.
    // 응답 오류가 있는 작업 수행
    return Promise.reject(error);
  },
);

export default axiosInterceptor;
