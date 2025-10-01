import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axiosInterceptor from '@/lib/axiosInterceptors';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import MarkdownDetailSkeleton from '@/pages/articles/components/detail/markdownDetailSkeleton';
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
import KakaoSearch from '@/pages/kakaoMap/kakaoSearch';
import TuiEditor from '@/components/markdown/editor/toastUiEditor';
import { useAddImage } from '@/hooks/useAddImage';
import { Editor } from '@toast-ui/react-editor';
import TurndownService from 'turndown';

interface ArticleData {
  id: number;
  campaignId: number;
  authorId: number;
  title: string;
  viewCount: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  visitInfo: {
    contactPhone: string;
    homepage: string;
    businessAddress: string;
    businessDetailAddress: string;
    lat: number;
    lng: number;
  } | null;
}

export default function ArticleDetail() {
  const { markdownId } = useParams<{ markdownId: string }>();
  const navigate = useNavigate();
  const [postData, setPostData] = useState<ArticleData | null>(null);
  const [editData, setEditData] = useState<{ title: string; content: string }>({
    title: '',
    content: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [campaignId, setCampaignId] = useState<number>();
  const [contactPhone, setContactPhone] = useState<string>('');
  const [homepage, setHomepage] = useState<string>('');
  const [businessAddress, setBusinessAddress] = useState<string>('');
  const [businessDetailAddress, setBusinessDetailAddress] =
    useState<string>('');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const editorRef = useRef<Editor | null>(null);
  const { imageHandler } = useAddImage();

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });
  // <span> <br> 태그를 그대로 유지
  turndownService.keep(['span']);
  turndownService.addRule('brTag', {
    filter: 'br',
    replacement: function () {
      return '<br>';
    },
  });

  // 유효성 검사
  const validateRequiredFields = () => {
    if (!editData.title) {
      toast.error('제목을 입력해주세요.');
      return false;
    }
    if (!editorRef.current?.getInstance().getMarkdown()) {
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
      console.log(data);
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
      const markdownContent =
        editorRef.current?.getInstance().getMarkdown() || ''; // TuiEditor에서 HTML 가져오기
      const payload = {
        title: editData.title,
        content: markdownContent,
        visitInfo: {
          contactPhone: contactPhone || null,
          homepage: homepage || null,
          businessAddress: businessAddress || null,
          businessDetailAddress: businessDetailAddress || null,
          lat: lat ?? null,
          lng: lng ?? null,
        },
      };
      const response = await axiosInterceptor.put(
        `/api/admin/posts/${id}`,
        payload
      );
      toast.success('아티클이 수정되었습니다.');
      await getPostDetail(markdownId!);
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error('아티클 수정에 실패했습니다.');
    }
  };

  // 체험콕 아티클 삭제
  const deleteMarkdown = async (id: number) => {
    try {
      await axiosInterceptor.delete(`/api/admin/posts/${id}`);
      navigate('/articles');
      toast.success('아티클가 삭제되었습니다.');
    } catch (error) {
      console.log(error);
      toast.error('아티클 삭제에 실패했습니다.');
    }
  };
  const activateArticle = async (id: string) => {
    try {
      await axiosInterceptor.post(`/api/admin/posts/${id}/activate`);
    } catch (error) {
      toast.error('캠페인 ID가 필요합니다.');
    }
  };
  const deactivateArticle = async (id: string) => {
    await axiosInterceptor.post(`/api/admin/posts/${id}/deactivate`);
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
  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | undefined>>
  ) => {
    const value = e.target.value;
    setter(value === '' ? undefined : parseFloat(value));
  };

  useEffect(() => {
    if (markdownId) {
      getPostDetail(markdownId);
    }
  }, [markdownId]);

  useEffect(() => {
    if (editorRef.current && editData.content) {
      editorRef.current.getInstance().setMarkdown(editData.content); // 초기 Markdown 설정
    }
  }, [editData.content]);

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
          onClick={() => navigate('/articles')}
          className="cursor-pointer"
        />
      </div>
      <Card className="w-full px-6 py-4">
        <div className="flex items-center justify-between px-6">
          <CardTitle className="ck-title">체험콕 아티클</CardTitle>

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
                        {postData.active ? (
                          <Button
                            onClick={() => activateArticle(markdownId!)}
                            variant="outline"
                          >
                            아티클 비활성화
                          </Button>
                        ) : (
                          <Button
                            onClick={() => deactivateArticle(markdownId!)}
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
                      <div className="col-span-2">
                        <Input
                          id="campaignId"
                          className="h-8 w-full"
                          placeholder="아티클 활성화 시 ID값 필요"
                          value={campaignId}
                          onChange={(event) =>
                            handleNumberInput(event, setCampaignId)
                          }
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
                          className="h-8 w-full"
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
          {postData.campaignId && (
            <Button
              variant="link"
              onClick={() => navigate(`/campaigns/${postData.campaignId}`)}
            >
              캠페인 보러 가기
            </Button>
          )}
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
            <TuiEditor
              content={editData.content}
              editorRef={editorRef}
              imageHandler={imageHandler}
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
    </div>
  );
}
