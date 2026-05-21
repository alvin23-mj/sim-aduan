import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import LocalPagination from '@/Components/LocalPagination';

const baseStyle = {
    fontFamily: "'Telex', sans-serif",
    fontSize: '14px',
};

export default function Riwayat({ aduans = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 10;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        router.get('/pelapor/riwayat', { search }, { preserveState: true });
    };

    const handleDiperbaikiSendiri = (aduanId) => {
        if (window.confirm('Apakah Anda yakin kendala ini sudah diperbaiki sendiri? Laporan akan dipindahkan ke status Diperbaiki Sendiri (Mandiri) dan diarsipkan.')) {
            router.patch(`/aduan/${aduanId}`, { status: 'diperbaiki_sendiri' }, {
                onSuccess: () => {
                    if (window.showToast) {
                        window.showToast('Laporan berhasil diperbarui menjadi Diperbaiki Sendiri!', 'success');
                    }
                }
            });
        }
    };

    const getStatusStyle = (status) => {
        const styles = {
            menunggu_validasi: { bg: '#F1F5F9', color: '#475569', label: 'Menunggu Validasi' },
            sudah_validasi: { bg: '#EFF6FF', color: '#2563EB', label: 'Sudah Validasi' },
            sedang_pengerjaan: { bg: '#FEF3C7', color: '#D97706', label: 'Sedang Diproses' },
            selesai: { bg: '#F0FDF4', color: '#10B981', label: 'Selesai' },
            barang_rusak: { bg: '#FEF2F2', color: '#EF4444', label: 'Barang Rusak' },
            diperbaiki_sendiri: { bg: '#F5F3FF', color: '#8B5CF6', label: 'Diperbaiki Sendiri' },
        };
        return styles[status] || { bg: '#F1F5F9', color: '#475569', label: status };
    };

    return (
        <AdminLayout title="Riwayat Laporan Saya">
            <Head title="Riwayat Laporan - SIM Aduan" />

            <div style={{
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}>
                {/* Header Actions */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px',
                    borderBottom: '1px solid #F1F5F9',
                    paddingBottom: '16px',
                }}>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E293B', margin: '0 0 4px' }}>
                            Daftar Riwayat Aduan
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                            Total laporan terdaftar: <strong>{aduans.length}</strong> laporan
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Cari tiket, subjek..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    padding: '8px 12px 8px 36px',
                                    fontSize: '13px',
                                    border: '1px solid #CBD5E1',
                                    borderRadius: '6px',
                                    outline: 'none',
                                    width: '100%',
                                    maxWidth: '240px',
                                    minWidth: '160px',
                                    fontFamily: "'Telex', sans-serif",
                                    transition: 'border-color 0.15s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderColor = '#2563EB'}
                                onBlur={e => e.target.style.borderColor = '#CBD5E1'}
                            />
                            <i className="fa-solid fa-magnifying-glass" style={{
                                position: 'absolute',
                                left: '12px',
                                color: '#94A3B8',
                                fontSize: '13px',
                            }}></i>
                            <button type="submit" style={{ display: 'none' }} />
                        </form>

                        {/* Buat Aduan Button */}
                        <Link href="/pelapor/buat-aduan" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#2563EB',
                            color: '#FFFFFF',
                            padding: '9px 16px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                        onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}>
                            <i className="fa-solid fa-circle-plus"></i> Buat Laporan Baru
                        </Link>
                    </div>
                </div>

                {/* Table / List */}
                {aduans.length > 0 ? (
                    <>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: '600' }}>No. Tiket</th>
                                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: '600' }}>Subjek Kendala</th>
                                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: '600' }}>Deskripsi</th>
                                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: '600' }}>Kategori</th>
                                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: '600' }}>Tanggal Lapor</th>
                                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: '600' }}>Teknisi</th>
                                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '14px 16px', color: '#64748B', fontWeight: '600', textAlign: 'right' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    const paginated = aduans.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
                                    return paginated.map((aduan) => {
                                    const statusStyle = getStatusStyle(aduan.status);
                                    return (
                                        <tr key={aduan.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>
                                                <Link href={`/aduan/${aduan.id}`} style={{ color: '#2563EB', textDecoration: 'none', transition: 'color 0.15s' }}
                                                    onMouseEnter={e => e.currentTarget.style.color = '#1D4ED8'}
                                                    onMouseLeave={e => e.currentTarget.style.color = '#2563EB'}>
                                                    {aduan.ticket_number}
                                                </Link>
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 'bold' }}>
                                                {aduan.subject}
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#64748B', maxWidth: '300px', whiteSpace: 'normal', lineHeight: '1.4' }}>
                                                {aduan.description || '-'}
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#475569' }}>
                                                <span style={{
                                                    background: '#F1F5F9',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    color: '#475569'
                                                }}>
                                                    {aduan.category || '-'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#64748B' }}>
                                                {new Date(aduan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#334155' }}>
                                                {aduan.technician ? (
                                                    <span>
                                                        {aduan.technician}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Belum Ditugaskan</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    padding: '4px 10px',
                                                    borderRadius: '4px',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                }}>
                                                    {statusStyle.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    {aduan.status === 'menunggu_validasi' || aduan.status === 'sudah_validasi' || aduan.status === 'sedang_pengerjaan' ? (
                                                        <Link
                                                            href={`/aduan/${aduan.id}`}
                                                            title="Buka Chat Diskusi"
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                background: '#EFF6FF',
                                                                border: '1px solid #BFDBFE',
                                                                color: '#2563EB',
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s',
                                                                textDecoration: 'none'
                                                            }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2563EB'; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
                                                        >
                                                            <i className="fa-solid fa-comments" style={{ fontSize: '15px' }}></i>
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            title="Chat ditutup karena aduan sedang dikerjakan atau selesai"
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                background: '#F1F5F9',
                                                                border: '1px solid #E2E8F0',
                                                                color: '#94A3B8',
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '4px',
                                                                cursor: 'not-allowed',
                                                                opacity: 0.7
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-comment-slash" style={{ fontSize: '15px' }}></i>
                                                        </button>
                                                    )}

                                                    {aduan.status === 'barang_rusak' && aduan.is_ba_sent && (
                                                        <a
                                                            href={`/pelapor/aduan/${aduan.id}/berita-acara`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="Download / Cetak Berita Acara Kerusakan"
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                background: '#FEF2F2',
                                                                border: '1px solid #FEE2E2',
                                                                color: '#EF4444',
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s',
                                                                textDecoration: 'none'
                                                            }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#EF4444'; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#FEE2E2'; }}
                                                        >
                                                            <i className="fa-solid fa-file-contract" style={{ fontSize: '15px' }}></i>
                                                        </a>
                                                    )}

                                                    {aduan.status === 'menunggu_validasi' || aduan.status === 'sudah_validasi' ? (
                                                        <button
                                                            onClick={() => handleDiperbaikiSendiri(aduan.id)}
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                background: '#F5F3FF',
                                                                border: '1px solid #DDD6FE',
                                                                color: '#7C3AED',
                                                                padding: '6px 12px',
                                                                fontSize: '14px',
                                                                fontWeight: 'bold',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s',
                                                            }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#7C3AED'; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = '#F5F3FF'; e.currentTarget.style.color = '#7C3AED'; e.currentTarget.style.borderColor = '#DDD6FE'; }}
                                                        >
                                                            <i className="fa-solid fa-wrench" style={{ fontSize: '13px' }}></i>
                                                            Perbaiki Sendiri
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                background: '#F1F5F9',
                                                                border: '1px solid #E2E8F0',
                                                                color: '#94A3B8',
                                                                padding: '6px 12px',
                                                                fontSize: '14px',
                                                                fontWeight: 'bold',
                                                                borderRadius: '4px',
                                                                cursor: 'not-allowed',
                                                                opacity: 0.7
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-ban" style={{ fontSize: '13px' }}></i>
                                                            Perbaiki Sendiri
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                    });
                                })()}
                            </tbody>
                        </table>
                    </div>
                    <LocalPagination
                        totalItems={aduans.length}
                        currentPage={currentPage}
                        perPage={PER_PAGE}
                        onPageChange={p => setCurrentPage(p)}
                    />
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '64px 16px', color: '#94A3B8' }}>
                        <i className="fa-solid fa-receipt" style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '16px' }}></i>
                        <p style={{ margin: '0 0 16px', fontSize: '15px' }}>Tidak ada laporan aduan yang cocok dengan pencarian Anda.</p>
                        <Link href="/pelapor/buat-aduan" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#2563EB',
                            color: '#FFFFFF',
                            padding: '10px 20px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                        onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}>
                            Buat Aduan Baru
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
