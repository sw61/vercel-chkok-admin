import { useState, useEffect, useRef } from 'react';
import Item from './bannersDragItem';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useSensors, useSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import axiosInterceptor from '@/lib/axiosInterceptors';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { FolderInput } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BannerPageSkeleton from '@/pages/banners/components/table/bannersPageSkeleton';

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

export default function BannersDragPage() {
  const [bannerData, setBannerData] = useState<BannerData[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // 파일 입력 참조
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [createBannerData, setCreateBannerData] = useState({
    redirectUrl: '',
    title: '',
    description: '',
    position: '',
  });

  // 배너 이미지 목록 조회
  const getBannersTable = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get('/api/banners');
      const data = response.data.data;
      // displayOrder 기준으로 정렬
      setBannerData(data);
    } catch (error) {
      console.error('배너 목록 조회 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
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
  };

  // 이미지 파일 선택 + presignedUrl 을 통해 S3 이미지 업로드
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

      const contentType = imageFile.type || 'image/jpeg';
      await axios.put(presignedUrl, imageFile, {
        headers: {
          'Content-Type': contentType,
        },
      });
      toast.success('이미지가 업로드 되었습니다.');
    } catch (error) {
      toast.error('이미지 업로드에 실패했습니다.');
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };
  // 배너 생성
  const createBanner = async () => {
    setIsCreating(true);
    if (!presignedUrl) {
      toast.error('이미지를 업로드 해주세요.');
      setIsCreating(false);
      return;
    }
    if (
      !createBannerData.title ||
      !createBannerData.description ||
      !createBannerData.redirectUrl ||
      !createBannerData.position
    ) {
      toast.error('모든 필수 필드를 입력해주세요.');
      setIsCreating(false);
      return;
    }
    try {
      await axiosInterceptor.post('/api/banners', {
        bannerUrl: presignedUrl,
        redirectUrl: createBannerData.redirectUrl,
        title: createBannerData.title,
        description: createBannerData.description,
        position: createBannerData.position,
        displayOrder: bannerData.length + 1,
      });
      toast.success('배너 이미지가 생성되었습니다.');
      await getBannersTable();
      setImageFile(null);
      setPresignedUrl(null);
    } catch (error) {
      console.error('배너 이미지 생성 중 오류 발생:', error);
    } finally {
      setCreateMode(false);
      setIsCreating(false);
    }
  };
  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateBannerData((prev) => ({ ...prev, [name]: value }));
    // bannerUrl 입력 시 파일 선택 초기화
    if (name === 'bannerUrl' && value) {
      setImageFile(null);
      setPresignedUrl(null);
    }
  };
  // 수정 모드 토글
  const toggleCreateMode = () => {
    setCreateMode(!createMode);
    setImageFile(null);
    setPresignedUrl(null);
    setCreateBannerData({
      title: '',
      redirectUrl: '',
      description: '',
      position: '',
    });
  };

  // 배너 순서 업데이트 (PATCH 요청)
  const updateBannerOrder = async (updatedBanners: BannerData[]) => {
    try {
      const requestBody = {
        banners: updatedBanners.map((banner, index) => ({
          id: banner.id,
          displayOrder: index + 1, // 1부터 시작
        })),
      };
      await axiosInterceptor.patch('/api/banners/order', requestBody);
      toast.success('배너 순서 변경이 완료되었습니다.');
    } catch (error) {
      console.log(error);
      toast.error('배너 순서 업데이트 중 오류 발생');
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );
  // 드래그 종료 함수
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const activeIndex = bannerData.findIndex(
        (item) => item.id === Number(active.id)
      );
      const overIndex = bannerData.findIndex(
        (item) => item.id === Number(over.id)
      );
      if (activeIndex !== -1 && overIndex !== -1) {
        // 새로운 배열 생성 및 displayOrder 업데이트
        const updatedBanners = arrayMove(
          bannerData,
          activeIndex,
          overIndex
        ).map((banner, index) => ({
          ...banner,
          displayOrder: index + 1, // 1부터 시작
        }));

        setBannerData(updatedBanners); // 로컬 상태 업데이트
        updateBannerOrder(updatedBanners); // 서버에 PATCH 요청
      }
    }
    // no-op
  };
  useEffect(() => {
    getBannersTable();
  }, []);

  if (isLoading) {
    return (
      <Card className="flex w-full flex-col gap-4 rounded-xl px-6 py-4">
        <CardTitle className="flex justify-between">
          <div className="ck-title flex items-center">배너 목록</div>
          <Button
            onClick={toggleCreateMode}
            className="ck-body-1 cursor-pointer"
            variant="outline"
          >
            배너 추가
          </Button>
        </CardTitle>
        <BannerPageSkeleton />
      </Card>
    );
  }

  if (!bannerData.length) {
    return (
      <Card className="flex w-full flex-col gap-4 rounded-xl px-6 py-4">
        <CardTitle className="flex justify-between">
          <div className="ck-title flex items-center">배너 목록</div>
          <div className="flex gap-4">
            {createMode ? (
              <>
                <Button onClick={toggleCreateMode} variant="outline">
                  취소
                </Button>
                <Button
                  onClick={() => createBanner()}
                  disabled={!presignedUrl || isCreating}
                  variant="outline"
                >
                  {isCreating ? '생성 중...' : '생성'}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={toggleCreateMode} variant="outline">
                  배너 추가
                </Button>
              </>
            )}
          </div>
        </CardTitle>
        {createMode ? (
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
        ) : (
          <div className="text-ck-gray-600 ck-body-2 flex h-40 items-center justify-center rounded-md border py-10">
            데이터가 없습니다.
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="grid-row grid gap-10 p-6 min-w-[800px]">
      {/* 배너 상세 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div className="ck-title flex items-center">배너 목록</div>
            <div className="flex gap-4">
              {createMode ? (
                <>
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
                        onClick={handleUrlUpload}
                        disabled={isUploading || !imageFile}
                        variant="outline"
                      >
                        {isUploading ? '업로드 중...' : '파일 업로드'}
                      </Button>
                    )}
                  </div>

                  <Button onClick={toggleCreateMode} variant="outline">
                    취소
                  </Button>
                  <Button
                    onClick={() => createBanner()}
                    disabled={!presignedUrl || isCreating}
                    variant="outline"
                  >
                    {isCreating ? '생성 중...' : '생성'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={toggleCreateMode}
                    className="ck-body-1 cursor-pointer"
                    variant="outline"
                  >
                    배너 추가
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        {createMode ? (
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
        ) : (
          <div className="flex w-full flex-col gap-4 rounded-xl px-6 py-4">
            <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
              <SortableContext
                items={bannerData.map((item) => item.id.toString())}
              >
                {bannerData.map((banner) => (
                  <Item key={banner.id} banner={banner} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </Card>
    </div>
  );
}
