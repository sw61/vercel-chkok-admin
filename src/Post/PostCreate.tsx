import { useState } from 'react';
import MDEditor, {
  commands,
  type ICommand,
  type TextState,
} from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { toast } from 'react-toastify';
import axiosInterceptor from '@/lib/axios-interceptors';
import axios from 'axios';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';
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
import KakaoSearch from '@/KakaoMap/KakaoSearch';

export default function PostCreate() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string | undefined>('');
  const [showImageSizeModal, setShowImageSizeModal] = useState<boolean>(false);
  const [pendingImageData, setPendingImageData] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [editorApi, setEditorApi] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [campaignId, setCampaignId] = useState<number | undefined>(undefined);
  const [contactPhone, setContactPhone] = useState<string>('');
  const [homepage, setHomepage] = useState<string>('');
  const [businessAddress, setBusinessAddress] = useState<string>('');
  const [businessDetailAddress, setBusinessDetailAddress] =
    useState<string>('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [showMapModal, setShowMapModal] = useState<boolean>(false); // 지도 모달 상태
  const navigate = useNavigate();

  // 유효성 검사
  const validateRequiredFields = () => {
    if (!title) {
      toast.error('제목을 입력해주세요.');
      return false;
    }
    if (!content) {
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

    const markdownComponent = (
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    );
    const html = renderToStaticMarkup(markdownComponent);

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
      const response = await axiosInterceptor.post('/api/admin/posts', payload);
      toast.success('아티클이 생성되었습니다.');
      navigate('/posts');
    } catch (error) {
      console.error('아티클 생성 오류:', error);
      toast.error('아티클 생성에 실패했습니다.');
    }
  };

  // 파일을 직접 받아서 S3 업로드 처리하는 함수
  const uploadImageFile = async (file: File): Promise<string> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    try {
      toast.info('이미지 업로드 중 입니다...');
      const response = await axiosInterceptor.post(
        '/api/images/kokpost/presigned-url',
        { fileExtension }
      );
      const presignedUrl = response.data.data.presignedUrl.split('?')[0];
      const contentType = file.type || 'image/jpeg';
      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': contentType },
      });
      return presignedUrl;
    } catch (error) {
      toast.error('이미지 업로드에 실패했습니다.');
      throw error;
    }
  };

  // 이미지 크기 설정 모달을 열고 이미지 데이터를 저장
  const openImageSizeModal = (url: string, name: string) => {
    setPendingImageData({ url, name });
    setShowImageSizeModal(true);
  };

  // 이미지 크기 설정 완료 후 마크다운에 삽입
  const insertImageWithSize = () => {
    if (!pendingImageData || !editorApi) return;
    const { url, name } = pendingImageData;
    const markdownImage = `![${name}](${url})`;
    editorApi.replaceSelection(markdownImage);
    setShowImageSizeModal(false);
    toast.success('이미지가 삽입 되었습니다.');
    setPendingImageData(null);
  };

  // 커스텀 이미지 업로드 커맨드
  const imageUploadCommand: ICommand = {
    name: 'imageUpload',
    keyCommand: 'imageUpload',
    buttonProps: { 'aria-label': 'Add image (ctrl + k)' },
    icon: (
      <svg width="13" height="13" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        />
      </svg>
    ),
    execute: async (state: TextState, api) => {
      setEditorApi(api);
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (input.files && input.files[0]) {
          const file = input.files[0];
          const url = await uploadImageFile(file);
          openImageSizeModal(url, file.name);
        }
      };
      input.click();
    },
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
          onClick={() => navigate('/posts')}
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
                                onChange={(event) => {
                                  setContactPhone(event.target.value);
                                }}
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
                  <Button variant="outline" onClick={() => navigate('/posts')}>
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
            <MDEditor
              value={content}
              onChange={setContent}
              height={700}
              preview="live"
              commands={[
                commands.bold,
                commands.italic,
                commands.strikethrough,
                commands.hr,
                commands.heading,
                commands.divider,
                commands.link,
                commands.quote,
                commands.code,
                commands.codeBlock,
                commands.comment,
                commands.divider,
                imageUploadCommand,
                commands.divider,
                commands.unorderedListCommand,
                commands.orderedListCommand,
                commands.checkedListCommand,
                commands.divider,
                commands.help,
              ]}
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

          {/* 이미지 크기 설정 모달 */}
          {showImageSizeModal && (
            <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center backdrop-blur-sm">
              <div className="w-96 rounded-lg border bg-white p-6">
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    이미지 미리보기
                  </label>
                  <div className="rounded-lg border bg-gray-50 p-2">
                    <img
                      src={pendingImageData?.url}
                      alt={pendingImageData?.name}
                      className="h-auto max-w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowImageSizeModal(false);
                      setPendingImageData(null);
                    }}
                    className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                  >
                    취소
                  </button>
                  <button
                    onClick={insertImageWithSize}
                    className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    설정
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
