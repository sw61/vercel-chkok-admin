import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import type {
  FormData,
  DetailResponse,
} from '@/services/articles/type/articleType';

interface ContentProps {
  articleData: DetailResponse;
  formData: FormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DetailContent({
  articleData,
  formData,
  handleChange,
}: ContentProps) {
  const navigate = useNavigate();
  return (
    <>
      <CardContent className="ck-body-2 flex items-center justify-between gap-6">
        <div className="flex gap-4">
          <p>작성자 : {articleData?.authorName}</p>
          <p>생성일 : {articleData?.createdAt.split('T')[0]}</p>
          <p>수정일 : {articleData?.updatedAt.split('T')[0]}</p>
          <p>조회수 : {articleData?.viewCount}</p>
        </div>
        {articleData.campaignId && (
          <Button
            variant="link"
            onClick={() => navigate(`/campaigns/${articleData.campaignId}`)}
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
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            className="w-full"
          />
        </div>
      </CardContent>
    </>
  );
}
