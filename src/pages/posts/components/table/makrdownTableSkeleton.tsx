import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

// 테이블 컬럼의 너비를 유지하기 위해 원본 컴포넌트에서 가져온 값
const columns = [
  { size: 50 }, // ID
  { size: 200 }, // 문서 제목
  { size: 120 }, // 문서 제작자
  { size: 150 }, // 생성일
  { size: 80 }, // 조회수
];

const totalColumnWidth = columns.reduce((sum, column) => sum + column.size, 0);

export default function MarkdownTableSkeleton() {
  return (
    <Card className="w-full p-6">
      {/* 상단 버튼 및 검색창 */}
      <div className="mb-2 flex justify-between">
        {/* 버튼 스켈레톤 */}
        <Skeleton className="h-10 w-48" />
        {/* 검색창 스켈레톤 */}
        <div className="ck-caption-1 relative">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="absolute top-0 right-0 h-10 w-10" />
        </div>
      </div>

      {/* 테이블 스켈레톤 */}
      <div className="overflow-x-auto rounded-md border">
        <Table
          className="table-fixed"
          style={{ minWidth: `${totalColumnWidth}px` }}
        >
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  style={{ width: `${column.size}px` }}
                  className="whitespace-nowrap"
                >
                  <Skeleton className="mx-auto h-6 w-3/4" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 5개의 로우를 임의로 생성하여 스켈레톤 표시 */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className="overflow-hidden whitespace-nowrap"
                    style={{ width: `${column.size}px` }}
                  >
                    <Skeleton className="mx-auto h-4 w-4/5" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
