import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  createBanner,
  getBannersTable,
  urlUpload,
} from '@/services/banners/dragPage/dragTableApi';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { FolderInput } from 'lucide-react';
import { useRef, useState } from 'react';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const queryClient = useQueryClient();

  // 배너 목록 조회
  const { data: bannerData } = useSuspenseQuery<BannerData[]>({
    queryKey: ['bannersData'],
    queryFn: getBannersTable,
  });
  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateBannerData((prev) => ({ ...prev, [name]: value }));
    // bannerUrl 입력 시 파일 선택 초기화
    if (name === 'bannerUrl' && value) {
      setImageFile(null);
      setPresignedUrl('');
    }
  };
  // 파일 선택 버튼 클릭 시 파일 입력 창 띄우기
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  // 파일 입력 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }
    setImageFile(file);
    setPresignedUrl('');
  };
  // 배너 이미지 업로드 S3
  const handleUrlUpload = async (imageFile: File) => {
    setIsUploading(true);
    try {
      const urlResponse = await urlUpload(imageFile);
      setPresignedUrl(urlResponse);
      toast.success('파일이 업로드 되었습니다.');
    } catch (error) {
      toast.error('파일 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };
  // 배너 생성
  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannersData'] });
      setImageFile(null);
      setPresignedUrl('');
      setCreateBannerData({
        title: '',
        redirectUrl: '',
        description: '',
        position: '',
      });
      navigate('/banners');
      toast.success('배너 이미지가 생성되었습니다.');
    },
    onError: () => {
      toast.error('배너 이미지 생성에 실패했습니다.');
    },
  });
  return (
    <div className="p-6">
      <Card className="flex w-full flex-col gap-4 rounded-xl px-6 py-4">
        <CardTitle className="flex justify-between">
          <div className="ck-title flex items-center">배너 목록</div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              {/* 숨겨진 파일 입력 */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              {/* 파일 선택 버튼 */}
              <Button
                className="ck-body-1 bg-ck-white text-ck-gray-900 hover:bg-ck-gray-300 border-1"
                onClick={handleFileSelect}
              >
                <FolderInput />
                파일 선택
              </Button>

              {/* 선택된 파일 정보 표시 */}
              {imageFile && (
                <div className="text-sm text-gray-700">
                  <span className="ck-body-2">
                    선택된 파일 : {imageFile.name}
                  </span>
                </div>
              )}
              {/* 파일 업로드 버튼 */}
              {imageFile && (
                <Button
                  onClick={() => handleUrlUpload(imageFile)}
                  disabled={isUploading || !imageFile}
                  variant="outline"
                >
                  {isUploading ? '업로드 중...' : '파일 업로드'}
                </Button>
              )}
            </div>
            <Button onClick={() => navigate('/banners')} variant="outline">
              취소
            </Button>
            <Button
              onClick={() =>
                createMutation({
                  ...createBannerData,
                  bannerUrl: presignedUrl,
                  displayOrder: bannerData.length + 1,
                })
              }
              disabled={!isFormValid() || isPending}
              variant="outline"
            >
              {isPending ? '생성 중...' : '생성'}
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
