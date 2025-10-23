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
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import type { FormData } from '@/services/articles/type/articleType';
import { CampaignIdSelect } from '../campaignIdSelect';
import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';

interface FormProps {
  formData: FormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenModal: () => void;
  handleActiveChange: (checked: boolean) => void;
  handleChangeCampaignId: (value: string) => void;
  handleCreate: () => void;
}
export default function CreateForm({
  formData,
  handleChange,
  handleOpenModal,
  handleActiveChange,
  handleChangeCampaignId,
  handleCreate,
}: FormProps) {
  const navigate = useNavigate();
  const { AlertDialogComponent: CreateAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">생성</Button>,
    title: '아티클을 생성하시겠습니까?',
    description: '',
    onAlert: handleCreate,
  });

  return (
    <div className="w-full" data-color-mode="light">
      <div className="mb-4">
        <div className="mb-2 mb-4 flex items-center justify-between">
          <div className="ck-body-2 flex flex-col justify-end">제목</div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/articles')}>
              취소
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">생성</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="leading-none font-medium">
                    필드 입력
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground text-sm">
                    아티클 생성을 위해 필드를 입력해주세요
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label>아티클 활성화</Label>
                    <div className="col-span-2 flex h-[32px] items-center">
                      <Switch
                        checked={formData.active}
                        onCheckedChange={handleActiveChange}
                      />
                    </div>
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
                  <div className="grid w-full grid-cols-3 items-center gap-4">
                    <Label htmlFor="campaignId">캠페인 연결</Label>
                    <div className="col-span-2">
                      <CampaignIdSelect
                        value={formData.campaignId!}
                        handleChangeCampaignId={handleChangeCampaignId}
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
                    <Input
                      id="businessAddress"
                      className="col-span-2"
                      placeholder="클릭하여 위치 정보 입력"
                      onClick={handleOpenModal}
                      readOnly
                      value={formData.businessAddress}
                      onChange={handleChange}
                    />
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
                <DialogFooter>
                  <DialogClose>
                    <Button variant="outline">취소</Button>
                  </DialogClose>
                  <CreateAlertDialog />
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
