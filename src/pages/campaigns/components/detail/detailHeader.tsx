import { Button } from '@/components/ui/button';
import type { DetailHeaderProps } from '@/services/campaigns/detail/detailType';
import { ChevronLeft } from 'lucide-react';
import { useDeleteCampaignsMutation } from '@/services/campaigns/detail/detailMutation';
import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';
import ApprovalButton from './approveButton';
import EditCampaignDetailSheet from './editDetailSheet';

export default function CampaignDetailHeader({
  campaignData,
  campaignId,
}: DetailHeaderProps) {
  // Mutation Hook
  const { mutate: deleteMutation } = useDeleteCampaignsMutation();

  // Alert Component
  const { AlertDialogComponent: DeleteAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">삭제</Button>,
    title: '캠페인을 삭제하시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => deleteMutation(campaignId!),
  });
  return (
    <>
      <div>
        <ChevronLeft
          onClick={() => window.history.back()}
          className="cursor-pointer"
        />
      </div>
      <div className="my-4 flex items-center justify-between">
        <div className="ck-title">
          #{campaignData.id}&nbsp;
          {campaignData.title}
        </div>
        <div className="px-4">
          <div className="flex gap-2">
            {campaignData.approvalStatus === '대기중' && (
              <>
                <ApprovalButton campaignId={campaignId} />
              </>
            )}
            <DeleteAlertDialog />
            <EditCampaignDetailSheet />
          </div>
        </div>
      </div>
      <img
        src={campaignData.thumbnailUrl}
        className="max-h-[400px] rounded-md object-contain"
      ></img>
    </>
  );
}
