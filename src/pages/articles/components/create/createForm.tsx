import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useCreateArticleMutation } from '@/services/articles/createApi';
import { Editor } from '@toast-ui/react-editor';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { FormData } from '@/services/articles/type/articleType';
import { CampaignIdSelect } from '../campaignIdSelect';

interface FormProps {
  formData: FormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenModal: () => void;
  handleActiveChange: (checked: boolean) => void;
  handleChangeCampaignId: (value: string) => void;
  resetForm: () => void;
}
export default function CreateForm({
  formData,
  handleChange,
  handleOpenModal,
  handleActiveChange,
  handleChangeCampaignId,
  resetForm,
}: FormProps) {
  const editorRef = useRef<Editor | null>(null);

  const navigate = useNavigate();
  const { mutate: createMutation } = useCreateArticleMutation();

  // 아티클 생성 핸들러
  const handleCreate = () => {
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
      return false;
    }
    if (!formData.contactPhone.trim()) {
      toast.error('연락처를 입력해주세요.');
      return;
    }

    const payload = {
      title: formData.title,
      content: markdownContent,
      campaignId: formData.campaignId,
      active: formData.active,
      visitInfo: {
        contactPhone: formData.contactPhone || null,
        homepage: formData.homepage || null,
        businessAddress: formData.businessAddress || null,
        businessDetailAddress: formData.businessDetailAddress || null,
        lat: formData.lat ?? null,
        lng: formData.lng ?? null,
      },
    };
    createMutation(payload, {
      onSuccess: () => {
        resetForm();
      },
    });
  };
  return (
    <div className="w-full" data-color-mode="light">
      <div className="mb-4">
        <div className="mb-2 flex justify-between items-center mb-4">
          <div className="ck-body-2 flex flex-col justify-end">제목</div>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">필드 입력</Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px]">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">필드 입력</h4>
                    <p className="text-muted-foreground text-sm">
                      아티클 생성을 위해 필드를 입력해주세요
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label>아티클 활성화</Label>
                      <Switch
                        checked={formData.active}
                        onCheckedChange={handleActiveChange}
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4 w-full">
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
                          className="w-full"
                          type="number"
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
                        className="col-span-2"
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
                          className="w-full"
                          placeholder="위치 정보 입력"
                          value={formData.businessAddress}
                          onChange={handleChange}
                        />
                        <Button
                          variant="outline"
                          className="h-9"
                          onClick={handleOpenModal}
                        >
                          위치 검색
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="businessDetailAddress">
                        위치 정보 상세
                      </Label>
                      <Input
                        id="businessDetailAddress"
                        className="col-span-2"
                        placeholder="위치 정보 상세 입력"
                        value={formData.businessDetailAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" onClick={() => navigate('/articles')}>
              취소
            </Button>
            <Button
              onClick={handleCreate}
              className="px-4 py-2"
              variant="outline"
            >
              생성
            </Button>
          </div>
        </div>
        <Input
          id="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          className="w-full"
        />
      </div>
    </div>
  );
}
