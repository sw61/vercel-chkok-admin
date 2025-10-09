import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface ArticleDropDownProps {
  articleType: string;
  handleType: (type: string) => void;
}
export default function ArticleDropDownMenu({
  articleType,
  handleType,
}: ArticleDropDownProps) {
  const typeValues = [
    { type: 'null', label: '전체 아티클' },
    { type: 'true', label: '활성화된 아티클' },
    { type: 'false', label: '비활성화된 아티클' },
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
      <Button variant="outline" onClick={() => navigate('/articles/create')}>
        아티클 작성
      </Button>
    </div>
  );
}
