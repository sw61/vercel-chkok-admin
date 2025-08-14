import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface ItemProps {
  banner: BannerData;
}

const Item = ({ banner }: ItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: banner.id.toString(),
  });
  const navigate = useNavigate();

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex w-full flex-col rounded-xl border bg-white px-4 py-2 ${
        isDragging ? "opacity-50 shadow-lg" : "opacity-100"
      }`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : undefined,
      }}
      onClick={() => navigate(`/banners/${banner.id}`)}
    >
      <div className="flex items-center">
        <img
          src={banner.bannerUrl}
          alt={banner.title}
          className="h-36 w-64 rounded-md"
        />
        <div className="flex w-full items-center justify-between p-6">
          <div className="flex flex-col gap-2">
            <div className="ck-title">{banner.title}</div>
            <div className="ck-body-2">배너 위치 : {banner.position}</div>
            <div className="ck-body-2">설명 : {banner.description}</div>
          </div>
          <div className="ck-body-1 flex items-center">
            <span className="bg-ck-blue-500 flex h-10 w-12 items-center justify-center rounded-full text-white">
              # {banner.displayOrder}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
