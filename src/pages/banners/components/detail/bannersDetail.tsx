import axiosInterceptor from '@/lib/axiosInterceptors';
import { useState, useRef, Suspense, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, FolderInput } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import BannerDetailSkeleton from '@/pages/banners/components/detail/bannersDetailSkeleton';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  deleteBanners,
  editBanners,
  getBannersDetail,
} from '@/services/banners/detail/detailApi';
import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';

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

export default function BannersDetail() {
  const navigate = useNavigate();
  const { bannerId } = useParams<{ bannerId: string }>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editBannerData, setEditBannerData] = useState({
    title: '',
    bannerUrl: '',
    redirectUrl: '',
    description: '',
    position: '',
    displayOrder: 0,
  });
  const queryClient = useQueryClient();

  const { data: bannerData } = useSuspenseQuery<BannerData>({
    queryKey: ['bannerDetail', bannerId],
    queryFn: () => getBannersDetail(bannerId!),
  });
  useEffect(() => {
    if (bannerData) {
      setEditBannerData({
        title: bannerData.title,
        bannerUrl: bannerData.bannerUrl,
        redirectUrl: bannerData.redirectUrl,
        description: bannerData.description,
        position: bannerData.position,
        displayOrder: bannerData.displayOrder,
      });
    }
  }, [bannerData]);

  // 배너 삭제
  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteBanners,
    onSuccess: () => {
      navigate('/banners');
      toast.success('배너가 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['bannerDetail'] });
    },
    onError: () => {
      toast.error('배너 삭제에 실패했습니다.');
    },
  });

  // 배너 수정
  const { mutate: editMutate } = useMutation({
    mutationFn: () =>
      editBanners(bannerId!, {
        ...editBannerData,
        bannerUrl: presignedUrl?.split('?')[0] || editBannerData.bannerUrl,
      }),
    onSuccess: () => {
      toast.success('배너가 수정되었습니다.');
      setIsEditing(false);
      setImageFile(null);
      setPresignedUrl(null);
      queryClient.invalidateQueries({ queryKey: ['bannerDetail'] });
    },
    onError: () => {
      toast.error('배너 수정에 실패했습니다.');
    },
  });
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
  };

  // 이미지 파일 선택 + presignedUrl을 통해 S3 이미지 업로드
  const handleUrlUpload = async () => {
    if (!imageFile) {
      toast.error('이미지 파일을 선택해주세요.');
      return;
    }
    setIsUploading(true);
    const fileExtension =
      imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';

    try {
      const response = await axiosInterceptor.post(
        '/api/images/banners/presigned-url',
        { fileExtension }
      );
      const presignedUrl = response.data.data.presignedUrl;
      setPresignedUrl(presignedUrl);
      const contentType = imageFile.type || 'image/jpeg';
      await axios.put(presignedUrl, imageFile, {
        headers: {
          'Content-Type': contentType,
        },
      });
      toast.success('이미지가 업로드 되었습니다.');
    } catch (error) {
      toast.error('이미지 업로드에 실패했습니다.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditBannerData((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 모드 토글
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setImageFile(null);
      setPresignedUrl(null);
    }
  };
  const { AlertDialogComponent: DeleteAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">삭제</Button>,
    title: '항목을 삭제하시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => bannerId && deleteMutate(bannerId),
  });

  const { AlertDialogComponent: EditAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">수정</Button>,
    title: '수정 사항을 저장하시겠습니까?',
    description: '',
    onAlert: () => {
      if (!editBannerData.title || !editBannerData.position) {
        toast.error('배너 이름과 위치를 입력해주세요.');
        return;
      }
      editMutate();
    },
  });
  if (!bannerData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div>데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <Suspense fallback={<BannerDetailSkeleton />}>
      <div className="grid-row grid px-6 py-2">
        <div className="mb-4">
          <ChevronLeft
            onClick={() => navigate('/banners')}
            className="cursor-pointer"
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              {isEditing ? (
                <>
                  <div className="ck-title flex items-center">배너 수정</div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                      />
                      <Button
                        variant="outline"
                        onClick={handleFileSelect}
                        disabled={isUploading}
                      >
                        <FolderInput />
                        이미지 선택
                      </Button>
                      {imageFile && (
                        <div className="text-sm text-gray-700">
                          <span className="ck-body-2">
                            선택된 파일: {imageFile.name}
                          </span>
                          <Button
                            onClick={handleUrlUpload}
                            disabled={isUploading || !imageFile}
                            variant="outline"
                          >
                            {isUploading ? '업로드 중...' : '파일 업로드'}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <Button
                        onClick={toggleEditMode}
                        variant="outline"
                        disabled={isUploading}
                      >
                        취소
                      </Button>
                      <EditAlertDialog />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="ck-title flex items-center">배너 정보</div>
                  <div className="flex gap-4">
                    <DeleteAlertDialog />
                    <Button
                      onClick={toggleEditMode}
                      variant="outline"
                      disabled={!bannerData}
                    >
                      수정
                    </Button>
                  </div>
                </>
              )}
            </CardTitle>
          </CardHeader>
          {isEditing ? (
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="ck-body-2-bold">배너 위치</p>
                <Input
                  id="position"
                  name="position"
                  value={editBannerData.position}
                  onChange={handleInputChange}
                  placeholder="배너 위치를 입력하세요. ex) TOP, MIDDLE, BOTTOM, SIDEBAR"
                  className="ck-body-2 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="ck-body-2-bold">배너 이름</p>
                <Input
                  id="title"
                  name="title"
                  value={editBannerData.title}
                  onChange={handleInputChange}
                  placeholder="배너 이름을 입력하세요."
                  className="ck-body-2 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="ck-body-2-bold">설명</p>
                <Input
                  id="description"
                  name="description"
                  value={editBannerData.description}
                  onChange={handleInputChange}
                  placeholder="설명을 입력하세요."
                  className="ck-body-2 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="ck-body-2-bold">Redirect URL</p>
                <Input
                  id="redirectUrl"
                  name="redirectUrl"
                  value={editBannerData.redirectUrl}
                  onChange={handleInputChange}
                  placeholder="Redirect URL을 입력하세요."
                  className="ck-body-2 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2"
                />
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex flex-col gap-4">
              <div className="ck-sub-title-1">{bannerData.title}</div>
              <img
                src={bannerData.bannerUrl}
                className="w-[500px] aspect-video"
              ></img>
              <div className="flex gap-4">
                <div className="flex flex-col gap-4 ck-body-2 min-w-[100px]">
                  <div>ID</div>
                  <div>배너 위치</div>
                  <div>생성일</div>
                  <div>업데이트일</div>
                  <div>설명</div>
                  <div>리다이렉트 주소</div>
                  <div>배너 주소</div>
                </div>
                <div className="flex flex-col gap-4 ck-body-2">
                  <div>{bannerData.id}</div>
                  <div>{bannerData.position}</div>
                  <div>{bannerData.createdAt.split('T')[0]}</div>
                  <div>{bannerData.updatedAt.split('T')[0]}</div>
                  <div>{bannerData.description}</div>
                  <a
                    href={bannerData.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {bannerData.redirectUrl}
                  </a>
                  <a
                    href={bannerData.bannerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {bannerData.bannerUrl}
                  </a>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </Suspense>
  );
}
