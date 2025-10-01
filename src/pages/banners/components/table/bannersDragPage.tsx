import { Suspense } from 'react';
import Item from './bannersDragItem';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useSensors, useSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { toast } from 'react-toastify';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BannerPageSkeleton from '@/pages/banners/components/table/bannersPageSkeleton';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  getBannersTable,
  updateBannerOrder,
} from '@/services/banners/dragPage/dragTableApi';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // 배너 목록 조회
  const { data: bannerData } = useSuspenseQuery<BannerData[]>({
    queryKey: ['bannersData'],
    queryFn: getBannersTable,
  });

  const { mutate: updateMutation } = useMutation({
    mutationFn: updateBannerOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannersData'] });
      toast.success('배너 순서 변경이 완료되었습니다.');
    },
    onError: () => {
      toast.error('배너 순서 변경을 실패했습니다.');
    },
  });

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
        const updatedBanners = arrayMove(bannerData, activeIndex, overIndex);

        updateMutation(updatedBanners); // 서버에 PATCH 요청
      }
    }
  };

  return (
    <div className="grid-row grid gap-10 p-6 min-w-[800px]">
      {/* 배너 상세 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div className="ck-title flex items-center">배너 목록</div>
            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/banners/create')}
                className="ck-body-1 cursor-pointer"
                variant="outline"
              >
                배너 추가
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <Suspense fallback={<BannerPageSkeleton />}>
          {bannerData.length === 0 ? (
            <div>데이터가 없습니다.</div>
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
        </Suspense>
      </Card>
    </div>
  );
}
