import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateUserMemo } from '@/services/users/detail/detailMutation';
import type { UserDetailContentProps } from '@/services/users/detail/detailType';
import { useState, type ChangeEvent } from 'react';

export default function UserDetailContent({
  userId,
  userData,
}: UserDetailContentProps) {
  const [userMemo, setUserMemo] = useState<string>(userData.memo);
  const [hideMemo, setHideMemo] = useState<boolean>(false);
  const { mutate: updateMemoMutation } = useUpdateUserMemo();
  const handleUpdateMemo = () => {
    updateMemoMutation({ userId, userMemo });
    handleUpdateHideMemo();
  };
  // 메모 업데이트 핸들러
  const handleUpdateHideMemo = () => {
    setHideMemo(!hideMemo);
  };

  // 사용자 메모 수정 핸들러
  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserMemo(event.target.value);
  };
  const { AlertDialogComponent: UpdateAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">저장</Button>,
    title: '메모를 저장하시겠습니까?',
    description: '',
    onAlert: handleUpdateMemo,
  });
  return (
    <>
      <div className="mb-6 grid grid-cols-3 gap-6">
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
            <UpdateAlertDialog />
          </div>
        ) : (
          <div className="flex justify-end">
            <Button
              className="ck-body-1 text-ck-gray-900 hover:bg-ck-gray-300 cursor-pointer border bg-white"
              onClick={handleUpdateHideMemo}
            >
              수정
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
