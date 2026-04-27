import { cn } from "../lib/utils";

interface PaginationProps {
    page: number;
    totalPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    page,
    totalPerPage,
    totalItems,
    onPageChange,
    className,
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / totalPerPage);

    if (totalItems <= totalPerPage) return null;

    const getPageNumbers = (): (number | "...")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages: (number | "...")[] = [1];

        if (page > 4) pages.push("...");

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        if (page < totalPages - 3) pages.push("...");

        pages.push(totalPages);
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav
            className={cn("flex items-center justify-center gap-1 py-4", className)}
            aria-label="Paginación"
        >
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                aria-label="Página anterior"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div className="hidden items-center gap-1 sm:flex">
                {pageNumbers.map((p, i) =>
                    p === "..." ? (
                        <span key={`ellipsis-${i}`} className="flex h-10 w-10 items-center justify-center text-sm text-gray-400">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                                p === page
                                    ? "bg-primary text-white"
                                    : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                            )}
                            aria-current={p === page ? "page" : undefined}
                        >
                            {p}
                        </button>
                    )
                )}
            </div>

            <span className="flex items-center px-3 text-sm text-gray-500 sm:hidden">
                {page} / {totalPages}
            </span>

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                aria-label="Página siguiente"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </nav>
    );
}
