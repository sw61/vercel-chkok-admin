import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';
import { Button } from '@/components/ui/button';
import { CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDeleteNoticeMutation } from '@/services/notices/detail/detailMutation';

interface ContentProps {
  noticeId: string;
  noticeData: {
    id: number;
    title: string;
    content: string;
    viewCount: number;
    isMustRead: boolean;
    authorId: number;
    authorName: string;
    createdAt: string;
    updatedAt: string;
  };
  editData: {
    title: string;
    content: string;
  };
  handleEditNotice: () => void;
  handleChangeEditData: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function NoticeDetailContent({
  noticeId,
  noticeData,
  editData,
  handleEditNotice,
  handleChangeEditData,
}: ContentProps) {
  const { mutate: deleteNoticeMutation } = useDeleteNoticeMutation();
  // Alert Component
  const { AlertDialogComponent: EditAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">수정</Button>,
    title: '공지사항을 수정하시겠습니까?',
    description: '',
    onAlert: handleEditNotice,
  });
  const { AlertDialogComponent: DeleteAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">삭제</Button>,
    title: '공지사항을 삭제하시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => deleteNoticeMutation(noticeId!),
  });
  return (
    <>
      <div className="flex items-center justify-between px-6">
        <CardTitle className="ck-title">공지사항</CardTitle>
        <div className="flex gap-3">
          <DeleteAlertDialog />
          <EditAlertDialog />
        </div>
      </div>
      <CardContent className="ck-body-2 flex gap-6">
        <p>작성자: {noticeData?.authorName}</p>
        <p>생성일: {noticeData?.createdAt.split('T')[0]}</p>
        <p>수정일: {noticeData?.updatedAt.split('T')[0]}</p>
        <p>조회수: {noticeData?.viewCount}</p>
      </CardContent>
      <CardContent>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            제목
          </label>
          <Input
            value={editData.title}
            onChange={handleChangeEditData}
            placeholder="제목을 입력하세요"
            className="w-full"
          />
        </div>
      </CardContent>
    </>
  );
}
