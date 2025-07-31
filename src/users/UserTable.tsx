"use client";

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
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Settings,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface User {
  id: number;
  name: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}
interface CustomColumnMeta {
  label?: string;
}
interface UserDataTableProps {
  userData: User[];
}

export function UserTable({ userData }: UserDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  // columns 재정의: nickname, email, role, createdAt, updatedAt 순서
  const columns: ColumnDef<User, unknown>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="has-[>svg]:px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
      meta: { label: "id" } as CustomColumnMeta,
    },
    {
      accessorKey: "nickname",
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="has-[>svg]:px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            닉네임
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("nickname")}</div>,
      meta: { label: "닉네임" } as CustomColumnMeta,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          이메일
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
      meta: { label: "이메일" } as CustomColumnMeta,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          역할
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("role")}</div>,
      meta: { label: "역할" } as CustomColumnMeta,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          생성일
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const fullDate = row.getValue("createdAt") as string;
        const dateOnly = fullDate.split("T")[0];
        return <div>{dateOnly}</div>;
      },
      meta: { label: "생성일" } as CustomColumnMeta,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          갱신일
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const fullDate = row.getValue("updatedAt") as string;
        const dateOnly = fullDate.split("T")[0];
        return <div>{dateOnly}</div>;
      },
      meta: { label: "갱신일" } as CustomColumnMeta,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original as User;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(user.email.toString())
                }
              >
                <Copy />
                이메일 복사하기
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate(`/users/${user.id}`)}>
                <Settings />
                사용자 상세 정보
              </DropdownMenuItem>
              {/* <DropdownMenuItem>임시 버튼</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
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
  });

  return (
    <div className="w-full">
      <div className="flex items-center">
        <Input
          placeholder="이메일 검색"
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              항목 <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {(column.columnDef.meta as CustomColumnMeta)?.label ||
                      column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2"></div>
      </div>
    </div>
  );
}
