import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useApproveMutation,
  useRejectMutation,
} from '@/services/campaigns/detail/detailMutation';
import { useState, type ChangeEvent } from 'react';
interface ApprovalProps {
  campaignId: string;
}
export default function ApprovalButton({ campaignId }: ApprovalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const { mutate: approveMutation } = useApproveMutation();
  const { mutate: rejectMutation } = useRejectMutation();
  const handleApprove = () => {
    approveMutation({
      id: campaignId!,
      comment: comment ? comment : '모든 조건을 만족하여 승인합니다.',
    });
    setIsOpen(false);
    setComment('');
  };
  const handleReject = () => {
    rejectMutation({
      id: campaignId!,
      comment: comment ? comment : '조건을 만족하지 못하여 거절되었습니다.',
    });
    setIsOpen(false);
    setComment('');
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">캠페인 처리</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>캠페인 승인 / 거절</DialogTitle>
          <DialogDescription>
            코멘트를 작성 후, 승인 또는 거절 버튼을 눌러주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comment" className="text-right">
              코멘트
            </Label>
            <Input
              id="comment"
              placeholder="승인 코멘트를 입력해주세요 (선택)"
              className="col-span-3"
              value={comment}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setComment(e.target.value)
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleReject}>
            거절
          </Button>
          <Button onClick={handleApprove}>승인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
