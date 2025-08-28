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
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInterceptor from "@/lib/axios-interceptors";

interface MarkdownData {
  id: number;
  title: string;
  viewCount: number;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomColumnMeta {
  label?: string;
}

const columns: ColumnDef<MarkdownData>[] = [
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
    size: 50,
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
          문서 제목
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="overflow-hidden text-ellipsis">
        {row.getValue("title")}
      </div>
    ),
    meta: { label: "문서 제목" } as CustomColumnMeta,
    size: 200,
  },
  {
    accessorKey: "authorName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        문서 제작자
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("authorName")}</div>
    ),
    meta: { label: "문서 제작자" } as CustomColumnMeta,
    size: 120,
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
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("createdAt")}</div>
    ),
    meta: { label: "생성일" } as CustomColumnMeta,
    size: 150,
  },
  {
    accessorKey: "viewCount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="has-[>svg]:px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        조회수
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("viewCount")}</div>,
    meta: { label: "조회수" } as CustomColumnMeta,
    size: 80,
  },
];

// ColumnDef의 size 합계 계산
const totalColumnWidth = columns.reduce(
  (sum, column) => sum + (column.size || 100),
  0,
);

export default function MarkdownTable() {
  const [markdownData, setMarkdownData] = useState<MarkdownData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();

  const getMarkdownData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInterceptor.get("/api/admin/markdowns");
      const data = response.data.data.markdowns;
      console.log("API 응답 데이터:", data); // 디버깅용 로그
      if (Array.isArray(data)) {
        setMarkdownData(data);
      } else {
        console.error("API 응답이 배열이 아닙니다:", data);
        setMarkdownData([]);
        setError("서버에서 잘못된 데이터 형식을 받았습니다.");
      }
    } catch (error) {
      console.error("마크다운 데이터를 가져오는데 실패했습니다:", error);
      setMarkdownData([]);
      setError("마크다운 데이터를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMarkdownData();
  }, []);

  const table = useReactTable({
    data: markdownData,
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

  if (isLoading) {
    return <div>스켈레톤 UI</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
                  className="cursor-pointer"
                  onClick={() => navigate(`/documents/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="overflow-hidden whitespace-nowrap"
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
                  className="h-24 text-center whitespace-nowrap"
                >
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <Button onClick={() => navigate("/documents/create")}>
          마크다운 문서 생성하러 가기
        </Button>
      </div>
    </div>
  );
}
