export interface User {
  id: number;
  email: string;
  nickname: string;
  role: '사용자' | '클라이언트' | '관리자';
  provider: string;
  accountType: string;
  active: boolean;
  emailVerified: boolean;
  gender: string;
  age: number;
  phone: string;
  profileImg: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
  platforms: string;
}
