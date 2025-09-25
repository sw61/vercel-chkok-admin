import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
  type ColumnFiltersState,
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

interface Campaign {
  id: number;
  title: string;
  campaignType: string;
  recruitmentStartDate: string;
  approvalStatus: string;
  approvalComment: string;
  approvalDate: string;
  createdAt: string;
  category: {
    type: string;
    name: string;
  };
}

interface CampaignDataTableProps {
  campaignData: Campaign[];
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
}

const columns: ColumnDef<Campaign>[] = [
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
          캠페인 이름
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="overflow-hidden text-ellipsis">
        {row.getValue('title')}
      </div>
    ),
    size: 250,
  },
  {
    accessorKey: 'campaignType',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        캠페인 유형
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('campaignType')}</div>
    ),
    size: 120,
  },
  {
    accessorKey: 'categoryType',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        방문/배송
        <ArrowUpDown />
      </Button>
    ),
    accessorFn: (row) => row.category.type,
    cell: ({ row }) => <div>{row.getValue('categoryType')}</div>,

    size: 120,
  },
  {
    accessorKey: 'categoryName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        카테고리
        <ArrowUpDown />
      </Button>
    ),
    accessorFn: (row) => row.category.name,
    cell: ({ row }) => <div>{row.getValue('categoryName')}</div>,

    size: 120,
  },
  {
    accessorKey: 'approvalStatus',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        처리 상태
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('approvalStatus')}</div>
    ),
    size: 100,
  },
  {
    accessorKey: 'recruitmentStartDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        모집 시작일
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('recruitmentStartDate')}</div>,

    size: 120,
  },

  {
    accessorKey: 'productShortInfo',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        상품 간단 소개
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="overflow-hidden text-ellipsis">
        {row.getValue('productShortInfo')}
      </div>
    ),
    size: 250,
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const campaign = row.original as Campaign;
  //     const navigate = useNavigate();

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem
  //             onClick={() =>
  //               navigator.clipboard.writeText(campaign.title.toString())
  //             }
  //           >
  //             <Copy />
  //             이름 복사하기
  //           </DropdownMenuItem>
  //           <DropdownMenuItem
  //             onClick={() => navigate(`/campaigns/${campaign.id}`)}
  //           >
  //             <Settings />
  //             캠페인 상세 정보
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  //   size: 50,
  // },
];

// ColumnDef의 size 합계 계산
const totalColumnWidth = columns.reduce(
  (sum, column) => sum + (column.size || 100),
  0
);

export function CampaignsTable({
  campaignData,
  columnFilters,
  setColumnFilters,
  columnVisibility,
  setColumnVisibility,
}: CampaignDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();

  const table = useReactTable({
    data: campaignData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    columnResizeMode: 'onChange',
    enableColumnResizing: false,
  });

  return (
    <div className="w-full">
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
                  onClick={() => navigate(`/campaigns/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="overflow-hidden whitespace-nowrap"
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
