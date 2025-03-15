'use client';

import { useCallback } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentPage: number;
  updatePage: (page: number) => void;
};

const TablePagination = ({ className = '', pagination, currentPage = 1, updatePage }: Props) => {
  const handleChangePage = useCallback(
    (page: number) => {
      updatePage(page);
    },
    [updatePage],
  );

  const renderPages = () => {
    const { totalPages } = pagination;
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => handleChangePage(i)} isActive={currentPage === i}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handleChangePage(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (currentPage > 3) {
        pages.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(
            <PaginationItem key={i}>
              <PaginationLink onClick={() => handleChangePage(i)} isActive={currentPage === i}>
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handleChangePage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    return pages;
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => (currentPage > 1 ? handleChangePage(currentPage - 1) : null)}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={cn(currentPage <= 1 ? 'cursor-default opacity-50' : '')}
          />
        </PaginationItem>

        <div className="hidden md:flex">{renderPages()}</div>

        <div className="flex items-center md:hidden">
          <Select
            value={currentPage.toString()}
            onValueChange={(value) => handleChangePage(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Page" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <SelectItem key={page} value={page.toString()}>
                  {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < pagination.totalPages ? handleChangePage(currentPage + 1) : null
            }
            aria-disabled={currentPage >= pagination.totalPages}
            tabIndex={currentPage >= pagination.totalPages ? -1 : undefined}
            className={cn(currentPage >= pagination.totalPages ? 'cursor-default opacity-50' : '')}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
