// src/pages/ArticleCreate.tsx
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import axiosInterceptor from '@/lib/axiosInterceptors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import KakaoSearch from '@/pages/kakaoMap/kakaoSearch';
import TuiEditor from '@/components/markdown/editor/toastUiEditor';
import { useAddImage } from '@/hooks/useAddImage';
import { Editor } from '@toast-ui/react-editor';

export default function ArticleCreate() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string | undefined>('');
  const [campaignId, setCampaignId] = useState<number | undefined>(undefined);
  const [contactPhone, setContactPhone] = useState<string>('');
  const [homepage, setHomepage] = useState<string>('');
  const [businessAddress, setBusinessAddress] = useState<string>('');
  const [businessDetailAddress, setBusinessDetailAddress] =
    useState<string>('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const editorRef = useRef<Editor | null>(null);

  // Use the useAddImage hook
  const { imageHandler } = useAddImage();

  // 유효성 검사
  const validateRequiredFields = () => {
    if (!title) {
      toast.error('제목을 입력해주세요.');
      return false;
    }
    if (!editorRef.current?.getInstance().getHTML()) {
      toast.error('내용을 입력해주세요.');
      return false;
    }
    if (campaignId === undefined || isNaN(campaignId)) {
      toast.error('캠페인 ID를 입력해주세요.');
      return false;
    }
    if (!contactPhone.trim()) {
      toast.error('연락처를 입력해주세요.');
      return false;
    }
    return true;
  };

  // 숫자 입력 핸들러
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | undefined>>
  ) => {
    const value = e.target.value;
    setter(value === '' ? undefined : parseFloat(value));
  };

  // 포스트 생성
  const createPost = async () => {
    if (!validateRequiredFields()) {
      return;
    }

    const html = editorRef.current?.getInstance().getHTML() || '';

    try {
      const payload = {
        title,
        content: html,
        campaignId,
        visitInfo: {
          contactPhone: contactPhone || null,
          homepage: homepage || null,
          businessAddress: businessAddress || null,
          businessDetailAddress: businessDetailAddress || null,
          lat: lat ?? null,
          lng: lng ?? null,
        },
      };
      await axiosInterceptor.post('/api/admin/posts', payload);
      toast.success('아티클이 생성되었습니다.');
      navigate('/articles');
    } catch (error) {
      console.error('아티클 생성 오류:', error);
      toast.error('아티클 생성에 실패했습니다.');
    }
  };

  // MapComponent에서 선택된 데이터 처리
  const handleMapSelect = (data: {
    roadAddr: string;
    lat: number;
    lng: number;
  }) => {
    setBusinessAddress(data.roadAddr);
    setLat(data.lat);
    setLng(data.lng);
    setShowMapModal(false);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <ChevronLeft
          onClick={() => navigate('/articles')}
          className="cursor-pointer"
        />
      </div>
      <Card>
        <div className="flex flex-col items-center px-6">
          <div className="w-full" data-color-mode="light">
            <div className="mb-4">
              <div className="mb-2 flex justify-between items-center">
                <div className="ck-body-2 flex flex-col justify-end">제목</div>
                <div className="flex gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">필드 입력</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[500px]">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="leading-none font-medium">
                            필드 입력
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            아티클 생성을 위해 필드를 입력해주세요
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="campaignId">
                              캠페인 ID{' '}
                              <span className="text-ck-red-500">*</span> 필수
                            </Label>
                            <div className="col-span-2">
                              <Input
                                id="campaignId"
                                type="number"
                                className="h-8"
                                placeholder="캠페인 ID 입력하세요"
                                value={campaignId ?? ''}
                                onChange={(event) =>
                                  handleNumberInput(event, setCampaignId)
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="contactPhone">
                              연락처 <span className="text-ck-red-500">*</span>{' '}
                              필수
                            </Label>
                            <div className="col-span-2">
                              <Input
                                id="contactPhone"
                                className="h-8"
                                type="number"
                                placeholder="01012345678"
                                value={contactPhone}
                                onChange={(event) =>
                                  setContactPhone(event.target.value)
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="homepage">홈페이지 주소</Label>
                            <Input
                              id="homepage"
                              className="col-span-2 h-8"
                              placeholder="https://chkok.kr"
                              value={homepage}
                              onChange={(event) =>
                                setHomepage(event.target.value)
                              }
                            />
                          </div>
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="businessAddress">위치 정보</Label>
                            <div className="col-span-2 flex gap-2">
                              <Input
                                id="businessAddress"
                                className="h-8 flex-1"
                                placeholder="위치 정보 입력"
                                value={businessAddress}
                                onChange={(event) =>
                                  setBusinessAddress(event.target.value)
                                }
                              />
                              <Button
                                variant="outline"
                                className="h-8"
                                onClick={() => setShowMapModal(true)}
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
                              className="col-span-2 h-8"
                              placeholder="위치 정보 상세 입력"
                              value={businessDetailAddress}
                              onChange={(event) =>
                                setBusinessDetailAddress(event.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/articles')}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={createPost}
                    className="px-4 py-2"
                    variant="outline"
                  >
                    생성
                  </Button>
                </div>
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full"
              />
            </div>
            <TuiEditor
              content={content}
              editorRef={editorRef}
              imageHandler={imageHandler}
            />
          </div>

          {/* 지도 모달 */}
          {showMapModal && (
            <div className="absolute inset-0 z-10 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg border max-w-2xl min-w-[600px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold mb-2">위치 검색</h2>
                <KakaoSearch
                  onSelect={handleMapSelect}
                  onClose={() => setShowMapModal(false)}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
