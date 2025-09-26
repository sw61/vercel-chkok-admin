import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
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

interface Company {
  id: number;
  userId: number;
  companyName: string;
  businessRegistrationNumber: string;
  createdAt: string;
  updatedAt: string;
}
interface CompanyDataTableProps {
  companyData: Company[];
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
}

export function CompanyTable({
  companyData,
  columnFilters,
  setColumnFilters,
  columnVisibility,
  setColumnVisibility,
}: CompanyDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  const columns: ColumnDef<Company, unknown>[] = [
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
      accessorKey: 'companyName',
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="has-[>svg]:px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            회사 이름
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('companyName')}</div>,

      size: 80,
    },
    {
      accessorKey: 'businessRegistrationNumber',
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="has-[>svg]:px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            사업자 등록 번호
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="lowercase">
          {row.getValue('businessRegistrationNumber')}
        </div>
      ),

      size: 150,
    },

    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="has-[>svg]:px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            생성일
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const fullDate = row.getValue('createdAt') as string;
        const dateOnly = fullDate.split('T')[0];
        return <div>{dateOnly}</div>;
      },
      size: 100,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="has-[>svg]:px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            업데이트일
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const fullDate = row.getValue('updatedAt') as string;
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
    data: companyData,
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
                  onClick={() => navigate(`/users/${row.original.userId}`)}
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
                  신청 인원이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
