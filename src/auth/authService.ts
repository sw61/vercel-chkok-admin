import axios, { AxiosError } from 'axios';
import type { LoginRequest, LoginResponse, ErrorResponse } from './auth';

const API_BASE_URL = 'https://chkok.kr/admin-api/swagger-ui/index.html#/'; // Swagger API의 기본 URL

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/api/auth/login`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data.message || '로그인에 실패했습니다.',
    );
  }
};
