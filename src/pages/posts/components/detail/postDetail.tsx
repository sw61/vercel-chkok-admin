import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axiosInterceptor from '@/lib/axiosInterceptors';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MDEditor, {
  commands,
  type ICommand,
  type TextState,
} from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import axios from 'axios';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '@/components/ui/button';
import TurndownService from 'turndown';
import MarkdownDetailSkeleton from '@/pages/posts/components/detail/markdownDetailSkeleton';
import { ChevronLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alertDialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import KakaoSearch from '@/pages/kakaoMap/kakaoSearch'; // MapComponent 임포트

interface PostData {
  id: number;
  campaignId: number;
  authorId: number;
  title: string;
  viewCount: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  visitInfo: {
    contactPhone: string;
    homepage: string;
    businessAddress: string;
    businessDetailAddress: string;
    lat: number;
    lng: number;
  } | null;
}

export default function PostDetail() {
  const { markdownId } = useParams<{ markdownId: string }>();
  const navigate = useNavigate();
  const [postData, setPostData] = useState<PostData | null>(null);
  const [editData, setEditData] = useState<{ title: string; content: string }>({
    title: '',
    content: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [pendingImageData, setPendingImageData] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [editorApi, setEditorApi] = useState<any>(null); // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [contactPhone, setContactPhone] = useState<string>('');
  const [homepage, setHomepage] = useState<string>('');
  const [businessAddress, setBusinessAddress] = useState<string>('');
  const [businessDetailAddress, setBusinessDetailAddress] =
    useState<string>('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [showMapModal, setShowMapModal] = useState<boolean>(false); // 지도 모달 상태

  // HTML -> Markdown 변환
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  // 유효성 검사
  const validateRequiredFields = () => {
    if (!editData.title) {
      toast.error('제목을 입력해주세요.');
      return false;
    }
    if (!editData.content) {
      toast.error('내용을 입력해주세요.');
      return false;
    }
    if (!contactPhone.trim()) {
      toast.error('연락처를 입력해주세요.');
      return false;
    }
    return true;
  };

  // 체험콕 글 상세 정보
  const getPostDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(`/api/admin/posts/${id}`);
      const data = response.data.data;
      const markdownContent = turndownService.turndown(data.content);

      setPostData(data);
      setEditData({ title: data.title, content: markdownContent });
      if (data.visitInfo) {
        setContactPhone(data.visitInfo.contactPhone || '');
        setHomepage(data.visitInfo.homepage || '');
        setBusinessAddress(data.visitInfo.businessAddress || '');
        setBusinessDetailAddress(data.visitInfo.businessDetailAddress || '');
        setLat(data.visitInfo.lat ?? undefined);
        setLng(data.visitInfo.lng ?? undefined);
      } else {
        setContactPhone('');
        setHomepage('');
        setBusinessAddress('');
        setBusinessDetailAddress('');
        setLat(undefined);
        setLng(undefined);
      }
    } catch (error) {
      console.log(error);
      toast.error('아티클을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 체험콕 글 문서 수정
  const editMarkdown = async (id: number) => {
    if (!validateRequiredFields()) {
      return;
    }
    try {
      const markdownComponent = (
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {editData.content}
        </ReactMarkdown>
      );
      const html = renderToStaticMarkup(markdownComponent);
      const payload = {
        title: editData.title,
        content: html,
        visitInfo: {
          contactPhone: contactPhone || null,
          homepage: homepage || null,
          businessAddress: businessAddress || null,
          businessDetailAddress: businessDetailAddress || null,
          lat: lat ?? null,
          lng: lng ?? null,
        },
      };
      await axiosInterceptor.put(`/api/admin/posts/${id}`, payload);
      toast.success('아티클이 수정되었습니다.');
      await getPostDetail(markdownId!);
    } catch (error) {
      console.log(error);
      toast.error('아티클 수정에 실패했습니다.');
    }
  };

  // 체험콕 아티클 삭제
  const deleteMarkdown = async (id: number) => {
    try {
      await axiosInterceptor.delete(`/api/admin/posts/${id}`);
      navigate('/posts');
      toast.success('아티클가 삭제되었습니다.');
    } catch (error) {
      console.log(error);
      toast.error('아티클 삭제에 실패했습니다.');
    }
  };

  // S3 이미지 업로드
  const uploadImageFile = async (file: File): Promise<string> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    try {
      toast.info('이미지 업로드 중 입니다...');
      const response = await axiosInterceptor.post(
        '/api/images/kokpost/presigned-url',
        {
          fileExtension,
        }
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

  // 이미지 삽입 모달
  const openImageModal = (url: string, name: string) => {
    setPendingImageData({ url, name });
    setShowImageModal(true);
  };

  // 이미지 삽입
  const insertImage = () => {
    if (!pendingImageData || !editorApi) return;
    const { url, name } = pendingImageData;
    const markdownImage = `![${name}](${url})`;
    editorApi.replaceSelection(markdownImage);
    setShowImageModal(false);
    toast.success('이미지가 삽입되었습니다.');
    setPendingImageData(null);
  };

  // 이미지 업로드 커맨드
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
          openImageModal(url, file.name);
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

  useEffect(() => {
    if (markdownId) {
      getPostDetail(markdownId);
    }
  }, [markdownId]);

  if (isLoading) {
    return <MarkdownDetailSkeleton />;
  }
  if (!postData) {
    return <div>데이터 없음</div>;
  }

  return (
    <div className="min-w-[800px] p-6">
      <div className="mb-4">
        <ChevronLeft
          onClick={() => navigate('/posts')}
          className="cursor-pointer"
        />
      </div>
      <Card className="w-full px-6 py-4">
        <div className="flex items-center justify-between px-6">
          <CardTitle className="ck-title">체험콕 글</CardTitle>

          <div className="flex gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">필드 입력</Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px]">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">필드 입력</h4>
                    <p className="text-muted-foreground text-sm">
                      글 수정을 위해 필드를 입력해주세요
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="contactPhone">
                        연락처 <span className="text-ck-red-500">*</span> 필수
                      </Label>
                      <div className="col-span-2">
                        <Input
                          id="contactPhone"
                          className="h-8"
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
                        onChange={(e) => setHomepage(e.target.value)}
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
                          onChange={(e) => setBusinessAddress(e.target.value)}
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
                        onChange={(e) =>
                          setBusinessDetailAddress(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="px-4 py-2" variant="outline">
                  삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[350px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    아티클을 삭제하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMarkdown(postData.id)}
                  >
                    확인
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="px-4 py-2" variant="outline">
                  수정
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[350px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    아티클을 수정하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={() => editMarkdown(postData.id)}>
                    확인
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CardContent className="ck-body-2 flex justify-between gap-6 items-center">
          <div className="flex gap-4">
            <p>작성자 : {postData?.authorName}</p>
            <p>생성일 : {postData?.createdAt.split('T')[0]}</p>
            <p>수정일 : {postData?.updatedAt.split('T')[0]}</p>
            <p>조회수 : {postData?.viewCount}</p>
          </div>
          <Button
            variant="link"
            onClick={() => navigate(`/campaigns/${postData.campaignId}`)}
          >
            캠페인 보러 가기
          </Button>
        </CardContent>

        <CardContent>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              제목
            </label>
            <Input
              value={editData.title}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="제목을 입력하세요"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              내용
            </label>
            <MDEditor
              value={editData.content}
              onChange={(value) =>
                setEditData((prev) => ({ ...prev, content: value || '' }))
              }
              height={500}
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
        </CardContent>
      </Card>

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

      {/* 이미지 설정 모달 */}
      {showImageModal && (
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
                  setShowImageModal(false);
                  setPendingImageData(null);
                }}
                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={insertImage}
                className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                설정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
