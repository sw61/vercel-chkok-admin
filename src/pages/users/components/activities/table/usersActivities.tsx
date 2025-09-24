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
  campaignId: number;
  maxApplicants: number;
}

interface ActivitiesProps {
  userItems: Activities[];
}

export function UsersActivitiesTable({ userItems }: ActivitiesProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  const sortableColumns = [
    'id',
    'title',
    'type',
    'company',
    'maxApplicants',
    'statusText',
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
      accessorKey: 'title',
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="has-[>svg]:px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            캠페인 제목
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="overflow-hidden text-ellipsis">
          {row.getValue('title')}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          방문형 / 배송형
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('type')}</div>
      ),
      size: 150,
    },
    {
      accessorKey: 'company',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          회사명
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('company')}</div>
      ),
      size: 150,
    },

    {
      accessorKey: 'statusText',
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
              상태
              <ArrowUpDown />
            </Button>
          )}
        </div>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('statusText')}</div>
      ),
      size: 100,
    },
    {
      accessorKey: 'maxApplicants',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          최대 지원자 수
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('maxApplicants')}</div>
      ),
      size: 100,
    },
  ];
  const totalColumnWidth = columns.reduce(
    (sum, column) => sum + (column.size || 100),
    0
  );

  const table = useReactTable({
    data: userItems,
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
                  onClick={() =>
                    navigate(`/campaigns/${row.original.campaignId}`)
                  }
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
                  활동 내역이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
