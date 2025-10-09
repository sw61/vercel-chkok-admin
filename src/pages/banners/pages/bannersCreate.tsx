import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUrlUploadMutation } from '@/hooks/useImageUrlUpload';
import { useCreateBannerMutation } from '@/services/banners/create/createApi';
import { getBannersTable } from '@/services/banners/dragPage/dragTableApi';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CircleCheck, CircleX, FolderInput } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
interface BannerData {
  id: number;
  title: string;
  bannerUrl: string;
  redirectUrl: string;
  description: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  displayOrder: number;
}
export default function BannersCreatePage() {
  // 배너 목록 조회
  const { data: bannerData } = useSuspenseQuery<BannerData[]>({
    queryKey: ['bannersTable'],
    queryFn: getBannersTable,
  });
  // 배너 생성 mutation
  const { mutate: createMutation, isPending: isCreating } =
    useCreateBannerMutation();
  // S3 Url Upload Mutation
  const {
    mutate: urlUploadMutation,
    isPending: isUploading,
    data: presignedUrl,
  } = useUrlUploadMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createBannerData, setCreateBannerData] = useState({
    redirectUrl: '',
    title: '',
    description: '',
    position: '',
  });
  const navigate = useNavigate();
  const isFormValid = () =>
    createBannerData.title &&
    createBannerData.description &&
    createBannerData.redirectUrl &&
    createBannerData.position &&
    presignedUrl;

  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateBannerData((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 입력 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }
    if (file) {
      setImageFile(file);
      // 파일 선택 즉시 업로드 시작
      urlUploadMutation(file);
    }
  };
  // 배너 생성 핸들러
  const handleCreateBanner = () => {
    createMutation({
      ...createBannerData,
      bannerUrl: presignedUrl,
      displayOrder: bannerData.length + 1,
    });
  };

  useEffect(() => {
    setImageFile(null);
    setCreateBannerData({
      title: '',
      redirectUrl: '',
      description: '',
      position: '',
    });
  }, []);

  return (
    <div className="p-6">
      <Card className="flex w-full flex-col gap-4 rounded-xl px-6 py-4">
        <CardTitle className="flex justify-between">
          <div className="ck-title flex items-center">배너 목록</div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Button
                  className="ck-body-1 bg-ck-white text-ck-gray-900 hover:bg-ck-gray-300 border-1"
                  asChild
                >
                  <div className="flex gap-2">
                    <FolderInput />
                    파일 선택
                  </div>
                </Button>
              </label>
              {/* 선택된 파일 이름 및 업로드 상태 표시 */}
              {isUploading && (
                <div className="text-sm text-gray-700">
                  <span className="ck-body-2">업로드 중...</span>
                </div>
              )}
              {!isUploading && imageFile && !presignedUrl && (
                <div className="text-sm text-red-500">
                  <span className="ck-body-2">
                    선택됨: {imageFile.name} <CircleX />
                    (업로드 실패)
                  </span>
                </div>
              )}
              {!isUploading && presignedUrl && (
                <div className="text-sm text-green-600">
                  <span className="ck-body-2">
                    {' '}
                    <CircleCheck />
                    업로드 완료
                  </span>
                </div>
              )}
            </div>
            <Button onClick={() => navigate('/banners')} variant="outline">
              취소
            </Button>
            <Button
              onClick={handleCreateBanner}
              disabled={!isFormValid() || isCreating}
              variant="outline"
            >
              {isCreating ? '생성 중...' : '생성'}
            </Button>
          </div>
        </CardTitle>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="ck-body-2-bold">배너 이름</p>
            <Input
              id="title"
              name="title"
              value={createBannerData.title}
              onChange={handleInputChange}
              placeholder="배너 이름을 입력하세요"
              className="ck-body-2 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="ck-body-2-bold">Redirect URL</p>
            <Input
              id="redirectUrl"
              name="redirectUrl"
              value={createBannerData.redirectUrl}
              onChange={handleInputChange}
              placeholder="Redirect URL을 입력하세요"
              className="ck-body-2 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="ck-body-2-bold">설명</p>
            <Input
              id="description"
              name="description"
              value={createBannerData.description}
              onChange={handleInputChange}
              placeholder="설명을 입력하세요"
              className="ck-body-2 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="ck-body-2-bold">배너 위치</p>
            <Input
              id="position"
              name="position"
              value={createBannerData.position}
              onChange={handleInputChange}
              placeholder="배너 위치를 입력하세요"
              className="ck-body-2 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
