import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Activities {
  id: number;
  title: string;
  company: string;
  type: string;
  statusText: string;
  createdAt: string;
  updatedAt: string;
  campaignType: string;
  currentApplications: number | null;
  approvedBy: string | null;
  approvalDate: string | null;
  recruitmentPeriod: string | null;
}
interface ActivitiesProps {
  clientsItems: Activities[];
}

export function ClientsActivitiesTable({ clientsItems }: ActivitiesProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  const sortableColumns = [
    'id',
    'nickname',
    'email',
    'statusText',
    'appliedAt',
  ];
  const columns: ColumnDef<Activities, unknown>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="has-[>svg]:px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            ID
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('id')}</div>,
      size: 50,
    },
    {
      accessorKey: 'nickname',
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="has-[>svg]:px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            닉네임
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="overflow-hidden text-ellipsis">
          {row.getValue('nickname')}
        </div>
      ),
      size: 250,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          이메일
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),
      size: 120,
    },
    {
      accessorKey: 'statusText',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          신청 상태
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('statusText')}</div>
      ),
      size: 100,
    },
    {
      accessorKey: 'appliedAt',
      header: ({ column }) => (
        <div>
          {sortableColumns.includes(column.id) && (
            <Button
              variant="ghost"
              className="has-[>svg]:px-0"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              신청일
              <ArrowUpDown />
            </Button>
          )}
        </div>
      ),
      cell: ({ row }) => {
        const fullDate = row.getValue('appliedAt') as string;
        const dateOnly = fullDate.split('T')[0];
        return <div>{dateOnly}</div>;
      },
      size: 100,
    },
  ];
  const totalColumnWidth = columns.reduce(
    (sum, column) => sum + (column.size || 100),
    0
  );

  const table = useReactTable({
    data: clientsItems,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    columnResizeMode: 'onChange',
    enableColumnResizing: false,
  });

  return (
    <div className="w-full">
      {/* 데이터 테이블 */}
      <div className="overflow-x-auto rounded-md border">
        <Table
          className="table-fixed"
          style={{ minWidth: `${totalColumnWidth}px` }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="cursor-pointer"
                  onClick={() => navigate(`/users/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ width: `${cell.column.getSize()}px` }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center whitespace-nowrap"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
