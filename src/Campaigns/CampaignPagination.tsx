import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationData {
  first: boolean;
  last: boolean;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

interface PaginationProps {
  pageData: PaginationData;
  onPageChange: (page: number) => void;
} // * props 인터페이스 정의

export function CampaignPagination({
  pageData,
  onPageChange,
}: PaginationProps) {
  const { totalPages, pageNumber, first, last } = pageData;

  const pageItems = [];
  const maxVisiblePages = 9; // 최대로 보이는 페이지 개수
  let startPage = Math.max(0, pageNumber - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageItems.push(
      <PaginationItem key={i}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(i);
          }}
          isActive={i + 1 === pageNumber}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!first) onPageChange(pageNumber - 2);
            }}
            className={first ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {pageItems}
        {endPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!last) onPageChange(pageNumber);
            }}
            className={last ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
