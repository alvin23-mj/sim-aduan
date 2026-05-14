import React from 'react';

/**
 * Client-side pagination component.
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current active page (1-indexed)
 * @param {number} perPage - Items per page (default 10)
 * @param {function} onPageChange - Callback: (page) => void
 */
export default function LocalPagination({ totalItems, currentPage, perPage = 10, onPageChange }) {
    const totalPages = Math.ceil(totalItems / perPage);
    if (totalPages <= 1) return null;

    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, totalItems);

    // Build page number list with ellipsis
    const getPages = () => {
        const pages = [];
        const delta = 2;
        const left = currentPage - delta;
        const right = currentPage + delta;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= left && i <= right)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    const btnBase = {
        minWidth: '34px',
        height: '34px',
        padding: '0 10px',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        background: '#fff',
        color: '#475569',
        fontSize: '13px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Telex', sans-serif",
        transition: 'all 0.15s',
        userSelect: 'none',
    };

    const btnActive = {
        ...btnBase,
        background: '#1E293B',
        color: '#fff',
        borderColor: '#1E293B',
        cursor: 'default',
    };

    const btnDisabled = {
        ...btnBase,
        color: '#CBD5E1',
        borderColor: '#E2E8F0',
        cursor: 'not-allowed',
        opacity: 0.6,
    };

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '14px 16px',
            borderTop: '1px solid #F1F5F9',
            background: '#FAFAFA',
        }}>
            {/* Info text */}
            <span style={{ fontSize: '13px', color: '#64748B' }}>
                Menampilkan <strong>{from}</strong>–<strong>{to}</strong> dari <strong>{totalItems}</strong> data
            </span>

            {/* Page buttons */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {/* Prev */}
                <button
                    style={currentPage === 1 ? btnDisabled : btnBase}
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    onMouseEnter={e => { if (currentPage !== 1) { e.currentTarget.style.background = '#F1F5F9'; } }}
                    onMouseLeave={e => { if (currentPage !== 1) { e.currentTarget.style.background = '#fff'; } }}
                >
                    <i className="fa-solid fa-chevron-left" style={{ fontSize: '11px' }}></i>
                </button>

                {/* Page numbers */}
                {getPages().map((page, idx) =>
                    page === '...' ? (
                        <span key={`ellipsis-${idx}`} style={{ ...btnBase, cursor: 'default', color: '#94A3B8' }}>…</span>
                    ) : (
                        <button
                            key={page}
                            style={page === currentPage ? btnActive : btnBase}
                            onClick={() => page !== currentPage && onPageChange(page)}
                            onMouseEnter={e => { if (page !== currentPage) e.currentTarget.style.background = '#F1F5F9'; }}
                            onMouseLeave={e => { if (page !== currentPage) e.currentTarget.style.background = '#fff'; }}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    style={currentPage === totalPages ? btnDisabled : btnBase}
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    onMouseEnter={e => { if (currentPage !== totalPages) { e.currentTarget.style.background = '#F1F5F9'; } }}
                    onMouseLeave={e => { if (currentPage !== totalPages) { e.currentTarget.style.background = '#fff'; } }}
                >
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '11px' }}></i>
                </button>
            </div>
        </div>
    );
}
