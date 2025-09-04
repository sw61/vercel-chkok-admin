import { Skeleton } from '@/components/ui/skeleton';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';

const CampaignTableSkeleton = () => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table className="table-fixed" style={{ minWidth: `${1130}px` }}>
        <TableHeader>
          <TableRow>
            {[50, 250, 120, 100, 120, 120, 120, 250].map((width, idx) => (
              <TableHead key={idx} style={{ width: `${width}px` }}>
                <Skeleton className="h-4 w-3/4" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {[50, 250, 120, 100, 120, 120, 120, 250].map((width, colIdx) => (
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

export default CampaignTableSkeleton;
