import { useState, useEffect } from "react";
import Item from "./BannersDragItem";
import { DndContext, type DragEndEvent, type DragStartEvent, type UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useSensors, useSensor, MouseSensor, TouchSensor } from "@dnd-kit/core";
import axiosInterceptor from "@/lib/axios-interceptors";
import PulseLoader from "react-spinners/PulseLoader";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";

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

export default function BannersDragpage() {
  const [bannerData, setBannerData] = useState<BannerData[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // 배너 이미지 목록 조회
  const getBannersTable = async () => {
    try {
      const response = await axiosInterceptor.get("/api/banners");
      const data = response.data.data;
      // displayOrder 기준으로 정렬
      setBannerData(data.sort((a: BannerData, b: BannerData) => a.displayOrder - b.displayOrder));
    } catch (error) {
      console.error("배너 목록 조회 중 오류 발생:", error);
    }
  };

  // 배너 순서 업데이트 (PATCH 요청)
  const updateBannerOrder = async (updatedBanners: BannerData[]) => {
    try {
      const requestBody = {
        banners: updatedBanners.map((banner, index) => ({
          id: banner.id,
          displayOrder: index + 1, // 1부터 시작
        })),
      };
      const response = await axiosInterceptor.patch("/api/banners/order", requestBody);
      toast.success("배너 순서 변경이 완료되었습니다.");
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("배너 순서 업데이트 중 오류 발생");
    }
  };

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
  // 드래그 시작 함수
  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };
  // 드래그 종료 함수
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const activeIndex = bannerData.findIndex((item) => item.id === Number(active.id));
      const overIndex = bannerData.findIndex((item) => item.id === Number(over.id));
      if (activeIndex !== -1 && overIndex !== -1) {
        // 새로운 배열 생성 및 displayOrder 업데이트
        const updatedBanners = arrayMove(bannerData, activeIndex, overIndex).map((banner, index) => ({
          ...banner,
          displayOrder: index + 1, // 1부터 시작
        }));

        setBannerData(updatedBanners); // 로컬 상태 업데이트
        updateBannerOrder(updatedBanners); // 서버에 PATCH 요청
      }
    }
    setActiveId(null);
  };

  useEffect(() => {
    getBannersTable();
  }, []);

  if (!bannerData.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <PulseLoader />
      </div>
    );
  }

  return (
    <Card className="w-full flex px-6 py-4">
      <div className="flex flex-col gap-4 w-full rounded-xl">
        <div className="ck-sub-title-1">배너 목록</div>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext items={bannerData.map((item) => item.id.toString())}>
            {bannerData.map((banner) => (
              <Item key={banner.id} banner={banner} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </Card>
  );
}
