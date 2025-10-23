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
  platforms: [
    {
      id: number;
      platformType: string;
      accountUrl: string;
      followerCount: number;
    },
  ];
}

export interface UpdateUserMemoProps {
  userId: string;
  userMemo: string;
}
export interface UserDetailHeaderProps {
  userId: string;
  userData: User;
}
export interface UserDetailContentProps {
  userId: string;
  userData: User;
}

export interface Platform {
  id: number;
  platformType: 'BLOG' | 'INSTAGRAM' | 'YOUTUBE' | string;
  accountUrl: string;
  followerCount: number;
}

export interface PlatformLinksProps {
  platformsData: Platform[];
}
