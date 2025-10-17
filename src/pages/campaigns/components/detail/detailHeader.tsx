import { Button } from '@/components/ui/button';
import type { DetailHeaderProps } from '@/services/campaigns/detail/detailType';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useApproveMutation,
  useDeleteCampaignsMutation,
  useRejectMutation,
} from '@/services/campaigns/detail/detailMutation';
import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';

export default function CampaignDetailHeader({
  campaignData,
  campaignId,
  comment,
}: DetailHeaderProps) {
  const navigate = useNavigate();
  // Mutation Hook
  const { mutate: deleteMutation } = useDeleteCampaignsMutation();
  const { mutate: approveMutation } = useApproveMutation();
  const { mutate: rejectMutation } = useRejectMutation();
  // Alert Component
  const { AlertDialogComponent: ApproveAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">승인</Button>,
    title: '캠페인을 승인하시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => approveMutation({ id: campaignId!, comment: comment! }),
  });
  const { AlertDialogComponent: RejectAlertDialog } = useAlertDialog({
    trigger: <Button variant="outline">거절</Button>,
    title: '캠페인을 거절하시겠습니까?',
    description: '이 작업은 되돌릴 수 없습니다.',
    onAlert: () => rejectMutation({ id: campaignId!, comment: comment! }),
  });
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
          onClick={() => navigate('/campaigns')}
          className="cursor-pointer"
        />
      </div>
      <div className="my-4 flex items-center justify-between">
        <div className="ck-title">{campaignData.title}</div>
        <div className="px-4">
          <div className="flex gap-2">
            {campaignData.approvalStatus === '대기중' && (
              <>
                <RejectAlertDialog />
                <ApproveAlertDialog />
              </>
            )}
            <DeleteAlertDialog />
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
