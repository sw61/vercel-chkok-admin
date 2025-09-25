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

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}
interface UserDataTableProps {
  userData: User[];
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  handleSortChange: (sort: string, direction: string) => void;
}

export function UserTable({
  userData,
  columnFilters,
  setColumnFilters,
  columnVisibility,
  setColumnVisibility,
  handleSortChange,
}: UserDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  const sortableColumns = [
    'id',
    'nickname',
    'email',
    'role',
    'createdAt',
    'updatedAt',
  ];
  const columns: ColumnDef<User, unknown>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <div>
          {sortableColumns.includes(column.id) && (
            <Button
              variant="ghost"
              className="has-[>svg]:px-0"
              onClick={() => handleSortChange(column.id, 'ASC')}
            >
              ID
              <ArrowUpDown />
            </Button>
          )}
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('id')}</div>,
      size: 50,
    },
    {
      accessorKey: 'nickname',
      header: ({ column }) => (
        <div>
          {sortableColumns.includes(column.id) && (
            <Button
              variant="ghost"
              className="has-[>svg]:px-0"
              onClick={() => handleSortChange(column.id, 'ASC')}
            >
              닉네임
              <ArrowUpDown />
            </Button>
          )}
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('nickname')}</div>,

      size: 80,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <div>
          {sortableColumns.includes(column.id) && (
            <Button
              variant="ghost"
              className="has-[>svg]:px-0"
              onClick={() => handleSortChange(column.id, 'ASC')}
            >
              이메일
              <ArrowUpDown />
            </Button>
          )}
        </div>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),

      size: 150,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <div>
          {sortableColumns.includes(column.id) && (
            <Button
              variant="ghost"
              className="has-[>svg]:px-0"
              onClick={() => handleSortChange(column.id, 'ASC')}
            >
              권한
              <ArrowUpDown />
            </Button>
          )}
        </div>
      ),

      cell: ({ row }) => {
        const roleMap: Record<string, string> = {
          USER: '사용자',
          CLIENT: '클라이언트',
          ADMIN: '관리자',
        };
        const role = row.getValue('role') as string;
        return <div>{roleMap[role]}</div>;
      },
      size: 100,
    },
    {
      accessorKey: 'active',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          계정 상태
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{row.getValue('active') ? '활성화' : '비활성화'}</div>
      ),
      size: 100,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <div>
          {sortableColumns.includes(column.id) && (
            <Button
              variant="ghost"
              className="has-[>svg]:px-0"
              onClick={() => handleSortChange(column.id, 'ASC')}
            >
              생성일
              <ArrowUpDown />
            </Button>
          )}
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
          {sortableColumns.includes(column.id) && (
            <Button
              variant="ghost"
              className="has-[>svg]:px-0"
              onClick={() => handleSortChange(column.id, 'ASC')}
            >
              업데이트일
              <ArrowUpDown />
            </Button>
          )}
        </div>
      ),
      cell: ({ row }) => {
        const fullDate = row.getValue('updatedAt') as string;
        const dateOnly = fullDate.split('T')[0];
        return <div>{dateOnly}</div>;
      },
      size: 100,
    },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const user = row.original as User;

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
    //               navigator.clipboard.writeText(user.email.toString())
    //             }
    //           >
    //             <Copy />
    //             이메일 복사하기
    //           </DropdownMenuItem>

    //           <DropdownMenuItem onClick={() => navigate(`/users/${user.id}`)}>
    //             <Settings />
    //             사용자 상세 정보
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    //   size: 50,
    // },
  ];
  const totalColumnWidth = columns.reduce(
    (sum, column) => sum + (column.size || 100),
    0
  );

  const table = useReactTable({
    data: userData,
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
