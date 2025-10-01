import { Suspense, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import { ChevronLeft } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import UserDetailSkeleton from '@/pages/users/components/detail/usersDetailSkeleton';
import { CustomBadge } from '@/hooks/useBadge';
import usericon from '@/image/usericon.png';
import ActivitiesPage from '../activities/table/activitiesPage';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  deleteUser,
  getUserDetail,
  putMemoUpdate,
  putUserStatus,
  userToClient,
} from '@/services/users/detail/detailApi';
import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';

export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userMemo, setUserMemo] = useState<string>('');
  const [hideMemo, setHideMemo] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // 사용자 데이터 요청
  const { data: userData } = useSuspenseQuery({
    queryKey: ['userDetail', userId],
    queryFn: () => getUserDetail(userId!),
  });
  // 사용자 활성화 / 비활성화
  const { mutate: statusMutate } = useMutation({
    mutationFn: putUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userDetail', userId],
      });
      toast.success('상태 변경을 성공했습니다.');
    },
    onError: () => {
      toast.error('상태 변경에 실패했습니다.');
    },
  });
  // 사용자 삭제
  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userDetail', userId],
      });
      navigate('/users');
      toast.success('사용자가 삭제되었습니다.');
    },
    onError: () => {
      toast.error('사용자 삭제를 실패했습니다.');
    },
  });
  // 사용자 메모 업데이트
  const { mutate: memoUpdateMutate } = useMutation({
    mutationFn: putMemoUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userDetail', userId, userMemo],
      });
      toast.success('메모가 업데이트 되었습니다.');
    },
    onError: () => {
      toast.error('메모 업데이트에 실패했습니다.');
    },
    onSettled: () => {
      setHideMemo(false);
    },
  });
  // 권한 승급
  const { mutate: userToClientMutate } = useMutation({
    mutationFn: userToClient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['userDetail', userId],
      });
      toast.success('클라이언트로 승급되었습니다.');
    },
    onError: () => {
      toast.error('클라이언트 승급을 실패했습니다.');
    },
  });

  // 사용자 메모 수정 핸들러
  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserMemo(event.target.value);
  };

  if (!userData) {
    return <div>데이터가 없습니다.</div>;
  }

  // Alert Dialog
  const { AlertDialogComponent: UserToClientAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">권한 승급</Button>,
    title: '권한을 승급시키겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => userData.id && userToClientMutate(userData.id),
  });

  const { AlertDialogComponent: DeleteAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">사용자 삭제</Button>,
    title: '사용자를 삭제시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => userData.id && deleteMutate(userData.id),
  });

  const { AlertDialogComponent: UpdateAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">저장</Button>,
    title: '메모를 저장하시겠습니까?',
    description: '',
    onAlert: () =>
      userData.id &&
      memoUpdateMutate({
        id: userData.id,
        userMemo: userMemo,
      }),
  });

  const { AlertDialogComponent: StatusAlertDialog } = useAlertDialog({
    trigger: (
      <Button
        className={`ck-body-1 flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-colors ${
          userData.active
            ? 'hover:bg-ck-red-500 hover:text-white'
            : 'hover:bg-ck-blue-500 hover:text-white'
        }`}
        variant="outline"
      >
        {userData.active ? '비활성화' : '활성화'}
      </Button>
    ),
    title: userData.active
      ? '사용자를 비활성화 시키겠습니까?'
      : '사용자를 활성화 시키겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다',
    onAlert: () => userData.id && statusMutate(userData.id),
  });

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
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
                      src={userData.profileImg || usericon}
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
                  {userData.role === '사용자' && <UserToClientAlertDialog />}
                  <StatusAlertDialog />
                  <DeleteAlertDialog />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-6">
                <div>
                  <p className="ck-caption-1 text-ck-gray-600">사용자 ID</p>
                  <p className="ck-body-2">{userData.id}</p>
                </div>

                <div>
                  <p className="ck-caption-1 text-ck-gray-600">계정 상태</p>
                  <p className="ck-body-2 text-ck-blue-500">
                    {userData.active ? '활성화' : '비활성화'}
                  </p>
                </div>
                <div>
                  <p className="text-ck-gray-600 ck-caption-1">이메일 인증</p>
                  <div className="ck-body-2">
                    <p className="text-ck-blue-500 ck-body-2">
                      {userData.emailVerified ? '인증됨' : '인증 필요'}
                    </p>
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
                  <p className="ck-body-2">
                    {userData.platforms ?? '정보 없음'}
                  </p>
                </div>
                <div>
                  <p className="text-ck-gray-600 ck-caption-1">생성일</p>
                  <p className="ck-body-2">
                    {userData.createdAt.split('T')[0]}
                  </p>
                </div>
                <div>
                  <p className="text-ck-gray-600 ck-caption-1">업데이트일</p>
                  <p className="ck-body-2">
                    {userData.updatedAt.split('T')[0]}
                  </p>
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
                    <UpdateAlertDialog />
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
          <ActivitiesPage />
        </div>
      </div>
    </Suspense>
  );
}
