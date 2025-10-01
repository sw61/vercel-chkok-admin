import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import type { VisibilityState } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface ArticleDropDownProps {
  articleType: string;
  handleType: (type: string) => void;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
}
export default function ArticleDropDownMenu({
  articleType,
  handleType,
  columnVisibility,
  setColumnVisibility,
}: ArticleDropDownProps) {
  const headerMenu = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: '제목' },
    { id: 'authorName', label: '작성자' },
    { id: 'viewCount', label: '조회수' },
    { id: 'createdAt', label: '생성일' },
    { id: 'updatedAt', label: '업데이트일' },
  ];

  const typeValues = [
    { type: 'all', label: '전체 아티클' },
    { type: 'true', label: '활성화된 아티클' },
    { type: 'false', label: '임시저장된 아티클' },
  ];
  const navigate = useNavigate();
  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {typeValues.find((item) => item.type === articleType)?.label ||
              '아티클 필터'}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {typeValues.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.label}
              checked={articleType === item.type}
              onClick={() => handleType(item.type)}
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            항목 <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {headerMenu.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={columnVisibility[column.id] !== false}
              onCheckedChange={(value) =>
                setColumnVisibility((prev: any) => ({
                  ...prev,
                  [column.id]: value,
                }))
              }
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" onClick={() => navigate('/articles/create')}>
        아티클 작성
      </Button>
    </div>
  );
}
