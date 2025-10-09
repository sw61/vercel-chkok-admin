import { Suspense } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useSensors, useSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BannerPageSkeleton from '@/pages/banners/components/table/bannersPageSkeleton';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getBannersTable } from '@/services/banners/dragPage/dragTableApi';
import { useNavigate } from 'react-router-dom';
import { useUpdateBannerMutation } from '@/services/banners/dragPage/dragMutation';
import BannerDragItem from '../components/table/bannersDragItem';

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

  // 배너 목록 조회
  const { data: bannerData } = useSuspenseQuery<BannerData[]>({
    queryKey: ['bannersTable'],
    queryFn: getBannersTable,
  });
  const { mutate: updateMutation } = useUpdateBannerMutation();

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
        const updatedBanners = arrayMove(
          bannerData,
          activeIndex,
          overIndex
        ).map((item, index) => ({ ...item, displayOrder: index + 1 }));

        updateMutation(updatedBanners);
      }
    }
  };

  return (
    <div className="grid-row grid min-w-[800px] gap-10 p-6">
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
                  {bannerData.map((bannerData, index) => (
                    <BannerDragItem
                      key={bannerData.id}
                      bannerData={bannerData}
                      index={index}
                    />
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
