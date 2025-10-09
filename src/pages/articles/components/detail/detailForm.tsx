import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  useActivateArticleMutation,
  useDeactivateArticleMutation,
  useDeleteArticleMutation,
} from '@/services/articles/detailMutation';
import {
  type DetailResponse,
  type FormData,
} from '@/services/articles/type/articleType';
import { CampaignIdSelect } from '../campaignIdSelect';

interface FormProps {
  articleId: string;
  articleData: DetailResponse;
  formData: FormData;
  handleEdit: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenModal: () => void;
  handleChangeCampaignId: (value: string) => void;
}

export default function DetailForm({
  articleId,
  articleData,
  formData,
  handleEdit,
  handleChange,
  handleOpenModal,
  handleChangeCampaignId,
}: FormProps) {
  const { mutate: deleteMutation } = useDeleteArticleMutation();
  const { mutate: activateMutation } = useActivateArticleMutation();
  const { mutate: deactivateMutation } = useDeactivateArticleMutation();

  const { AlertDialogComponent: DeleteAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">삭제</Button>,
    title: '아티클을 삭제하시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => deleteMutation(articleData.id),
  });
  const { AlertDialogComponent: EditAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">수정</Button>,
    title: '아티클을 수정하시겠습니까?',
    description: '',
    onAlert: handleEdit,
  });
  const { AlertDialogComponent: ActivateAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">아티클 활성화</Button>,
    title: '아티클을 활성화하시겠습니까?',
    description: '',
    onAlert: () => activateMutation(articleData.id),
  });
  const { AlertDialogComponent: DeactivateAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">아티클 비활성화</Button>,
    title: '아티클을 비활성화하시겠습니까?',
    description: '',
    onAlert: () => deactivateMutation(articleData.id),
  });
  return (
    <div className="flex gap-3">
      <div>
        {articleData.active ? (
          <DeactivateAlertDialog />
        ) : (
          <ActivateAlertDialog />
        )}
      </div>
      <DeleteAlertDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">수정</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              필드 입력
            </DialogTitle>
            <DialogDescription className="text-ck-gray-600 ck-body-2">
              아티클 수정을 위해 필드를 확인해주세요
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="contactPhone">
                연락처 <span className="text-ck-red-500">*</span> 필수
              </Label>
              <div className="col-span-2">
                <Input
                  id="contactPhone"
                  className="h-8 w-full"
                  placeholder="01012345678"
                  value={formData.contactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="campaignId">캠페인 연결</Label>
              <div className="col-span-2">
                <CampaignIdSelect
                  value={formData.campaignId ?? ''}
                  articleId={articleId!}
                  handleChangeCampaignId={handleChangeCampaignId}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="homepage">홈페이지 주소</Label>
              <Input
                id="homepage"
                className="col-span-2 h-8"
                placeholder="https://chkok.kr"
                value={formData.homepage}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="businessAddress">위치 정보</Label>
              <div className="col-span-2 flex gap-2">
                <Input
                  id="businessAddress"
                  className="h-8 flex-1"
                  placeholder="위치 정보 입력"
                  value={formData.businessAddress}
                  onChange={handleChange}
                />
                <Button
                  variant="outline"
                  className="h-8"
                  onClick={handleOpenModal}
                >
                  위치 검색
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="businessDetailAddress">위치 정보 상세</Label>
              <Input
                id="businessDetailAddress"
                className="col-span-2 h-8"
                placeholder="위치 정보 상세 입력"
                value={formData.businessDetailAddress}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <EditAlertDialog />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
