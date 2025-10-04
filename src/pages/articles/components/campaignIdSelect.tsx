import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCampaignList } from '@/services/articles/detailApi';
import { useQuery } from '@tanstack/react-query';

interface CampaignIdList {
  id: string;
  title: string;
}
export function CampaignIdSelect({
  value = '',
  articleId,
  handleChangeCampaignId,
}: {
  value?: string;
  articleId?: string;
  handleChangeCampaignId: (value: string) => void;
}) {
  const { data: campaignIdList } = useQuery<CampaignIdList[]>({
    queryKey: ['campaignIdList', articleId],
    queryFn: getCampaignList,
  });

  return (
    <Select value={value} onValueChange={handleChangeCampaignId}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="캠페인을 선택하세요." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>캠페인 제목</SelectLabel>
          {campaignIdList?.map((campaign) => (
            <SelectItem key={campaign.id} value={campaign.id}>
              {campaign.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
