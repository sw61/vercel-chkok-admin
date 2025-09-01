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
import { ArrowUpDown, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import axiosInterceptor from "@/lib/axios-interceptors";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import MarkdownTableSkeleton from "../Skeleton/MakrdownTableSkeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    cell: ({ row }) => {
      const fullDate = row.getValue("createdAt") as string;
      const date = fullDate.split("T")[0];
      return <div>{date}</div>;
    },
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchKey, setSearchKey] = useState<string>("");
  const headerMenu = [
    { id: "id", label: "ID" },
    { id: "title", label: "문서 제목" },
    { id: "authorName", label: "문서 제작자" },
    { id: "createdAt", label: "생성일" },
    { id: "viewCount", label: "조회수" },
  ];
  const navigate = useNavigate();

  const getMarkdownData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get("/api/admin/markdowns");
      const data = response.data.data.markdowns;
      setMarkdownData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = async () => {
    try {
      const response = await axiosInterceptor.get(
        `/api/admin/markdowns/search?title=${searchKey}`,
      );
      const data = response.data.data.markdowns;
      setMarkdownData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEnterSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
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
    return <MarkdownTableSkeleton />;
  }

  return (
    <Card className="w-full p-6">
      <div className="mb-2 flex justify-between">
        <div className="flex gap-4">
          <div>
            {/* 테이블 헤더 카테고리 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  항목 <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {headerMenu.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={columnVisibility[column.id] !== false}
                    onCheckedChange={(value) =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [column.id]: value,
                      }))
                    }
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/documents/create")}
          >
            마크다운 문서 생성하러 가기
          </Button>
        </div>

        {/* 검색창 */}
        <div className="ck-caption-1 relative">
          <Input
            placeholder="문서 제목 검색"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="pr-12"
            onKeyDown={handleEnterSearch}
          />
          <button
            className="absolute top-0 right-0 h-full w-10 cursor-pointer"
            onClick={handleSearch}
          >
            <Search />
          </button>
        </div>
      </div>
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
    </Card>
  );
}
