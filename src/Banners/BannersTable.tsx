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
import { Card } from "@/components/ui/card";

interface Banner {
  id: number;
  title: string;
  bannerUrl: string;
  redirectUrl: string;
  description: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomColumnMeta {
  label?: string;
}
interface BannerDataTableProps {
  bannerData: Banner[];
}

export default function BannersTable({ bannerData }: BannerDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();

  // columns 재정의: id, title, campaignType, approvalStatus, approvalComment, approvalDate, createdAt 순서
  const columns: ColumnDef<Banner, unknown>[] = [
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
      accessorKey: "title",
      header: ({ column }) => (
        <div>
          <Button
            variant="ghost"
            className="has-[>svg]:px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            배너 이름
            <ArrowUpDown />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
      meta: { label: "배너 이름" } as CustomColumnMeta,
    },
    {
      accessorKey: "position",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          배너 위치
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("position")}</div>
      ),
      meta: { label: "배너 위치" } as CustomColumnMeta,
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
        const dateOnly =
          typeof fullDate === "string" ? fullDate.split("T")[0] : "";
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
          업데이트일
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => {
        const fullDate = row.getValue("updatedAt") as string;
        const dateOnly =
          typeof fullDate === "string" ? fullDate.split("T")[0] : "";
        return <div>{dateOnly}</div>;
      },
      meta: { label: "업데이트일" } as CustomColumnMeta,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="has-[>svg]:px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          설명
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
      meta: { label: "설명" } as CustomColumnMeta,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const banner = row.original as Banner;

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
                  navigator.clipboard.writeText(banner.title.toString())
                }
                className="ck-body-1"
              >
                <Copy />
                이름 복사하기
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate(`/banners/${banner.id}`)}
                className="ck-body-1"
              >
                <Settings />
                배너 상세 정보
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const table = useReactTable({
    data: bannerData,
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
    <Card className="w-full px-6 py-4">
      <div className="mb-2 flex items-center justify-between">
        {/* 테이블 헤더 카테고리 */}
        <div>
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

        {/* 배너 이름 검색창 */}
        <Input
          placeholder="배너 이름 검색"
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="pr-20"
        />
      </div>
      {/* 테이블 데이터 */}
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
                            header.getContext(),
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
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="ck-body-1 h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="ck-caption-1 text-ck-gray-600 flex-1">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2"></div>
      </div>
    </Card>
  );
}
