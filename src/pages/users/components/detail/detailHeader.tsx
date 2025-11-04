import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { CustomBadge } from '@/hooks/useBadge';
import {
  useDeleteUser,
  usePutUserStatus,
  useUserToClient,
} from '@/services/users/detail/detailMutation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import usericon from '@/image/usericon.png';
import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';
import type { UserDetailHeaderProps } from '@/services/users/detail/detailType';
import PlatformLinks from './platformLinks';

export default function UserDetailHeader({
  userId,
  userData,
}: UserDetailHeaderProps) {
  // Mutation Hook
  const { mutate: statusMutation } = usePutUserStatus();
  const { mutate: deleteMutation } = useDeleteUser();
  const { mutate: userToClientMutation } = useUserToClient();
  const platformsData = userData.platforms;
  // Alert Dialog
  const { AlertDialogComponent: UserToClientAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">권한 승급</Button>,
    title: '권한을 승급시키겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => userToClientMutation(userId!),
  });

  const { AlertDialogComponent: DeleteAlertDialog } = useAlertDialog({
    trigger: (
      <Button variant="outline" disabled={true}>
        사용자 삭제
      </Button>
    ),
    title: '사용자를 삭제시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => deleteMutation(userId!),
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
    onAlert: () => statusMutation(userId!),
  });
  return (
    <>
      <div className="flex justify-between gap-4">
        <div className="flex items-center gap-4">
          <CardTitle className="ck-title">사용자 #{userData.id}</CardTitle>
          <CustomBadge variant={userData.role} />
        </div>

        <div className="flex gap-2 px-4">
          {userData.role === '사용자' && <UserToClientAlertDialog />}
          <StatusAlertDialog />
          <DeleteAlertDialog />
        </div>
      </div>
      <div className="pt-2">
        <div className="flex justify-between pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={userData.profileImg || usericon}
                alt={userData.nickname}
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <div>
              <div className="flex gap-2">
                <p className="ck-body-2">
                  {userData.nickname} ({userData.gender || '성별 미공개'},{' '}
                  {userData.age || '나이 미공개'})
                </p>
                {/* 연결된 SNS 링크 */}
                <PlatformLinks platformsData={platformsData} />
              </div>

              <p className="ck-body-2 text-ck-gray-600">
                {userData.email || '이메일 없음'}
              </p>
              <p className="ck-body-2 text-ck-gray-600">
                {userData.phone || '전화번호 없음'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
