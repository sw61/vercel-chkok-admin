import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useActivateArticleMutation,
  useDeactivateArticleMutation,
  useDeleteArticleMutation,
  useEditArticleMutation,
} from '@/services/articles/detailMutation';
import {
  type DetailResponse,
  type FormData,
} from '@/services/articles/type/articleType';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { Editor } from '@toast-ui/react-editor';
import { CampaignIdSelect } from '../campaignIdSelect';

interface FormProps {
  articleId: string;
  articleData: DetailResponse;
  formData: FormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenModal: () => void;
  handleChangeCampaignId: (value: string) => void;
}

export default function DetailForm({
  articleId,
  articleData,
  formData,
  handleChange,
  handleOpenModal,
  handleChangeCampaignId,
}: FormProps) {
  const editorRef = useRef<Editor | null>(null);
  const { mutate: editMutation } = useEditArticleMutation();
  const { mutate: deleteMutation } = useDeleteArticleMutation();
  const { mutate: activateMutation } = useActivateArticleMutation();
  const { mutate: deactivateMutation } = useDeactivateArticleMutation();
  const handleEdit = () => {
    if (!editorRef.current) {
      return;
    }
    // 서버에 보낼 마크다운 내용
    const markdownContent = editorRef.current.getInstance().getMarkdown() || '';

    if (!formData.title) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!markdownContent) {
      toast.error('내용을 입력해주세요.');
      return;
    }
    if (!formData.contactPhone.trim()) {
      toast.error('연락처를 입력해주세요.');
      return;
    }
    const id = articleData.id;
    const payload = {
      title: formData.title,
      content: markdownContent,
      visitInfo: {
        contactPhone: formData.contactPhone || null,
        homepage: formData.homepage || null,
        businessAddress: formData.businessAddress || null,
        businessDetailAddress: formData.businessDetailAddress || null,
        lat: formData.lat ?? null,
        lng: formData.lng ?? null,
      },
    };

    editMutation({ id, payload });
  };
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
  return (
    <div className="flex gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">필드 입력</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px]">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex itmes-center justify-between">
                <div className="ck-body-1-bold flex items-center">
                  필드 입력
                </div>
                <div>
                  {articleData.active ? (
                    <Button
                      onClick={() => deactivateMutation(articleId!)}
                      variant="outline"
                    >
                      아티클 비활성화
                    </Button>
                  ) : (
                    <Button
                      onClick={() => activateMutation(articleId!)}
                      variant="outline"
                    >
                      아티클 활성화
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground ck-body-2">
                아티클 수정을 위해 필드를 입력해주세요
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="campaignId">캠페인 ID</Label>
                <CampaignIdSelect
                  value={formData.campaignId!}
                  handleChangeCampaignId={handleChangeCampaignId}
                />
              </div>
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
          </div>
        </PopoverContent>
      </Popover>
      <DeleteAlertDialog />
      <EditAlertDialog />
    </div>
  );
}
