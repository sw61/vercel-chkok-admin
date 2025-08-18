import axiosInterceptor from "@/lib/axios-interceptors";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInterceptor.post("/auth/login", {
      email,
      password,
    });
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return response.data.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error; // 에러를 호출한 쪽에서 처리하도록 던짐
  }
};
