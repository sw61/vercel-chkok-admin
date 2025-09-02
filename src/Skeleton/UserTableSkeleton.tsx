import { Skeleton } from '@/components/ui/skeleton';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';

const UserTableSkeleton = () => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table className="table-fixed" style={{ minWidth: `${1000}px` }}>
        <TableHeader>
          <TableRow>
            {[80, 150, 200, 100, 120, 150, 150].map((width, idx) => (
              <TableHead key={idx} style={{ width: `${width}px` }}>
                <Skeleton className="h-4 w-3/4" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {[80, 150, 200, 100, 120, 150, 150].map((width, colIdx) => (
                <TableCell
                  key={`${rowIdx}-${colIdx}`}
                  style={{ width: `${width}px` }}
                >
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default UserTableSkeleton;
