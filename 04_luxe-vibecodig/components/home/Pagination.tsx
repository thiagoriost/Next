'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigatePage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', String(page));
      }
      router.push(`${pathname}?${params.toString()}`);
      // Scroll back to the market section
      document.getElementById('market-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [router, pathname, searchParams]
  );

  if (totalPages <= 1) return null;

  // Build page number list with ellipsis
  const getPageNumbers = (): (number | '...')[] => {
    const delta = 1;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    const pages: (number | '...')[] = [1];
    if (range[0] > 2) pages.push('...');
    pages.push(...range);
    if (range[range.length - 1] < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      {/* Count label */}
      <p className="text-sm text-[#5C706D]">
        Showing page <span className="font-semibold text-[#19322F]">{currentPage}</span> of{' '}
        <span className="font-semibold text-[#19322F]">{totalPages}</span> — {totalCount} properties total
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => navigatePage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#19322F]/10 bg-white text-[#5C706D] hover:border-[#006655] hover:text-[#006655] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-[#5C706D] text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => navigatePage(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
              className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                p === currentPage
                  ? 'bg-[#19322F] text-white shadow-sm'
                  : 'border border-[#19322F]/10 bg-white text-[#5C706D] hover:border-[#006655] hover:text-[#006655]'
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => navigatePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#19322F]/10 bg-white text-[#5C706D] hover:border-[#006655] hover:text-[#006655] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
