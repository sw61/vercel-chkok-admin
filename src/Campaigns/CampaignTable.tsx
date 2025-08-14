"use client";

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
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Settings, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface Campaign {
  id: number;
  title: string;
  campaignType: string;
  approvalStatus: "APPROVED" | "REJECTED" | "PENDING" | string;
  approvalComment: string;
  approvalDate: string;
  createdAt: string;
}

interface CustomColumnMeta {
  label?: string;
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
    size: 38,
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
    size: 89,
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
          캠페인 이름
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
    meta: { label: "캠페인 이름" } as CustomColumnMeta,
    size: 317,
  },
  {
    accessorKey: "campaignType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        캠페인 유형
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("campaignType")}</div>
    ),
    meta: { label: "캠페인 유형" } as CustomColumnMeta,
    size: 152,
  },
  {
    accessorKey: "approvalStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        처리 상태
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const statusMap: Record<string, string> = {
        APPROVED: "승인됨",
        REJECTED: "거절됨",
        PENDING: "대기중",
      };
      const status = row.getValue("approvalStatus") as string;
      return <div>{statusMap[status] || "알 수 없음"}</div>;
    },
    meta: { label: "처리 상태" } as CustomColumnMeta,
    size: 127,
  },
  {
    accessorKey: "approvalDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        처리일
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const fullDate = row.getValue("approvalDate") as string;
      const dateOnly =
        typeof fullDate === "string" ? fullDate.split("T")[0] : "";
      return <div>{dateOnly}</div>;
    },
    meta: { label: "처리일" } as CustomColumnMeta,
    size: 190,
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
    size: 190,
  },
  {
    accessorKey: "approvalComment",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        처리 코멘트
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("approvalComment")}</div>,
    meta: { label: "처리 코멘트" } as CustomColumnMeta,
    size: 380,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const campaign = row.original as Campaign;
      const navigate = useNavigate();

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
                navigator.clipboard.writeText(campaign.title.toString())
              }
            >
              <Copy />
              이름 복사하기
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
            >
              <Settings />
              캠페인 상세 정보
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 62,
  },
];

// ColumnDef의 size 합계 계산
const totalColumnWidth = columns.reduce(
  (sum, column) => sum + (column.size || 100),
  0,
); // 1545px

export function CampaignTable({
  campaignData,
  columnFilters,
  setColumnFilters,
  columnVisibility,
  setColumnVisibility,
}: CampaignDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

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
    columnResizeMode: "onChange",
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
                    <TableCell
                      key={cell.id}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ width: `${cell.column.getSize()}px` }}
                    >
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
                  className="h-12 overflow-hidden text-center text-ellipsis whitespace-nowrap"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-2">
        <div className="ck-caption-1 text-ck-gray-600 flex-1">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  );
}
