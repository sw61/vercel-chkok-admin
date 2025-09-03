import axiosInterceptor from '@/lib/axios-interceptors';
import { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import {
  ArrowUpNarrowWide,
  ChevronLeft,
  Trash,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import UserDetailSkeleton from '@/Skeleton/UserDetailSkeleton';
import { CustomBadge } from '@/hooks/useBadge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface User {
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

export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [userMemo, setUserMemo] = useState<string>('');
  const [hideMemo, setHideMemo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dataMap: Record<string, string> = {
    GOOGLE: '구글',
    kakao: '카카오',
    USER: '사용자',
    CLIENT: '클라이언트',
    ADMIN: '관리자',
    LOCAL: '로컬',
    SOCIAL: '소셜',
    UNKNOWN: '비공개',
    MALE: '남성',
    FEMALE: '여성',
  };

  // 사용자 상세 정보 호출
  const getUserDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(`/users/${id}`);
      const userData = response.data.data;
      const mappedData = {
        ...userData,
        accountType: dataMap[userData.accountType] || userData.accountType,
        role: dataMap[userData.role] || userData.role,
        gender: dataMap[userData.gender] || userData.gender,
        provider: dataMap[userData.provider] || userData.provider,
      };
      setUserData(mappedData);
      setUserMemo(userData.memo || '');
    } catch (error) {
      toast.error('유저 정보 조회에 실패했습니다.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  // 사용자 상태 변경
  const putUserStatus = async (id: number) => {
    try {
      const response = await axiosInterceptor.put(`/users/${id}/status`);
      const updatedData = response.data.data;
      setUserData((prev) => ({ ...prev, ...updatedData }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error('상태 변경에 실패했습니다.');
    }
  };
  // 사용자 삭제
  const deleteUser = async (id: number) => {
    if (window.confirm('사용자를 삭제하시겠습니까?')) {
      try {
        const response = await axiosInterceptor.delete(`/users/${id}`);
        navigate('/users');
        toast.success('사용자가 삭제되었습니다.');
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };
  // 메모 수정
  const putMemoUpdate = async (id: number, memo: string) => {
    try {
      const response = await axiosInterceptor.put(
        `/users/${id}/memo`,
        { memo },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const updatedData = response.data.data;
      setUserData((prev) => ({ ...prev, ...updatedData }));
      setHideMemo(false);
      toast.success('메모가 업데이트 되었습니다.');
    } catch (error) {
      toast.error('메모 업데이트에 실패했습니다.');
      console.log(error);
    }
  };
  // 사용자 메모 수정 핸들러
  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserMemo(event.target.value);
  };
  const userToClient = async (id: number) => {
    if (window.confirm('클라이언트로 승급하시겠습니까?')) {
      try {
        await axiosInterceptor.put(`/users/${id}/promote-to-client`);
        await getUserDetail(id.toString());
        toast.success('클라이언트로 승급되었습니다.');
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      getUserDetail(userId);
    }
  }, [userId]);
  if (isLoading) {
    return <UserDetailSkeleton />;
  }
  if (!userData) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="min-w-[650px] px-6 py-4">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <ChevronLeft
            onClick={() => navigate('/users')}
            className="cursor-pointer"
          />
        </div>
        <Card>
          <div className="flex gap-4 px-6">
            <CardTitle className="ck-title">사용자 정보</CardTitle>
            <CustomBadge variant={userData.role} />
          </div>
          <CardContent className="pt-2">
            <div className="flex justify-between pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={userData.profileImg}
                    alt={userData.nickname}
                  />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <div>
                  <p className="ck-body-2">
                    {userData.nickname} ({userData.gender || '성별 미공개'},{' '}
                    {userData.age || '나이 미공개'})
                  </p>
                  <p className="ck-body-2 text-gray-500">
                    {userData.email || '이메일 없음'}
                  </p>
                  <p className="ck-body-2 text-gray-500">
                    {userData.phone || '전화번호 없음'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 px-4">
                {userData.role === '사용자' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="ck-body-1 flex cursor-pointer items-center border"
                        variant="outline"
                      >
                        <ArrowUpNarrowWide />
                        권한 승급
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[350px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          권한을 승급시키겠습니까?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          이 작업은 되돌릴 수 없습니다
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => userToClient(userData.id)}
                        >
                          확인
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className={`ck-body-1 flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-colors ${
                        userData.active
                          ? 'hover:bg-ck-red-500 hover:text-white'
                          : 'hover:bg-ck-blue-500 hover:text-white'
                      }`}
                      variant="outline"
                    >
                      {userData.active ? <UserX /> : <UserCheck />}
                      {userData.active ? '비활성화' : '활성화'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[350px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {userData.active
                          ? '사용자를 비활성화 시키겠습니까?'
                          : '사용자를 활성화 시키겠습니까?'}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        이 작업은 되돌릴 수 없습니다
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => putUserStatus(userData.id)}
                      >
                        확인
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="ck-body-1 hover:bg-ck-red-500 flex cursor-pointer items-center border hover:text-white"
                      variant="outline"
                    >
                      <Trash />
                      계정 삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[350px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        계정을 삭제하시겠습니까?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        이 작업은 되돌릴 수 없습니다
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteUser(userData.id)}
                      >
                        확인
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-6">
              <div>
                <p className="ck-caption-1 text-ck-gray-600">사용자 ID</p>
                <p className="ck-body-2">{userData.id}</p>
              </div>

              <div>
                <p className="ck-caption-1 text-ck-gray-600">계정 상태</p>
                {userData.active ? (
                  <p className="ck-body-2 text-ck-blue-500">활성화</p>
                ) : (
                  <p className="ck-body-2 text-ck-red-500">비활성화</p>
                )}
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">이메일 인증</p>
                <div className="ck-body-2">
                  {userData.emailVerified ? (
                    <p className="text-ck-blue-500 ck-body-2">인증됨</p>
                  ) : (
                    <p className="text-ck-red-500 ck-body-2">인증 필요</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">계정 서비스</p>
                <p className="ck-body-2">{userData.provider}</p>
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">계정 타입</p>
                <p className="ck-body-2">{userData.accountType}</p>
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">계정 플랫폼</p>
                <p className="ck-body-2">{userData.platforms ?? '정보 없음'}</p>
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">생성일</p>
                <p className="ck-body-2">{userData.createdAt.split('T')[0]}</p>
              </div>
              <div>
                <p className="text-ck-gray-600 ck-caption-1">업데이트일</p>
                <p className="ck-body-2">{userData.updatedAt.split('T')[0]}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="ck-body-2">사용자 메모</p>
              {hideMemo ? (
                <div className="flex flex-col gap-4">
                  <Textarea
                    placeholder="텍스트를 입력하세요."
                    value={userMemo}
                    onChange={handleTextAreaChange}
                  />
                </div>
              ) : (
                <div className="ck-body-2 border-ck-gray-300 rounded-md border bg-transparent px-3 py-2">
                  {userData.memo ? userData.memo : '내용이 없습니다.'}
                </div>
              )}

              {hideMemo ? (
                <div className="flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="ck-body-1 text-ck-gray-900 hover:bg-ck-gray-300 cursor-pointer border bg-white">
                        저장
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[350px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          메모를 저장하시겠습니까?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            putMemoUpdate(userData.id, userMemo || '')
                          }
                        >
                          확인
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <div className="flex justify-end">
                  <Button
                    className="ck-body-1 text-ck-gray-900 hover:bg-ck-gray-300 cursor-pointer border bg-white"
                    onClick={() => setHideMemo(true)}
                  >
                    수정
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
