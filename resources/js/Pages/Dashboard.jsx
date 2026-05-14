import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';
import LocalPagination from '@/Components/LocalPagination';

const baseStyle = {
    fontFamily: "'Telex', sans-serif",
    fontSize: '14px',
};

export default function Dashboard({ stats, recent_aduans = [], weekly_chart = null, role = 'admin' }) {
    const isPelapor = role === 'pelapor';
    const chartRef = useRef(null);
    const [dashPage, setDashPage] = useState(1);
    const DASH_PER_PAGE = 10;

    const statCards = isPelapor 
        ? [
            { label: 'Total Aduan Saya', value: stats.total || 0, icon: 'fa-solid fa-inbox', color: '#1E293B', bg: '#F8FAFC' },
            { label: 'Menunggu Validasi', value: stats.menunggu_validasi || 0, icon: 'fa-solid fa-clock', color: '#64748B', bg: '#F1F5F9' },
            { label: 'Sedang Diproses', value: stats.sedang_pengerjaan || 0, icon: 'fa-solid fa-spinner', color: '#D97706', bg: '#FEF3C7' },
            { label: 'Selesai', value: stats.selesai || 0, icon: 'fa-solid fa-circle-check', color: '#10B981', bg: '#F0FDF4' },
          ]
        : [
            { label: 'Total Aduan', value: stats.total || 0, icon: 'fa-solid fa-inbox', color: '#1E293B', bg: '#F8FAFC' },
            { label: 'Menunggu', value: stats.menunggu_validasi || 0, icon: 'fa-solid fa-clock', color: '#64748B', bg: '#F1F5F9' },
            { label: 'Sudah Divalidasi', value: stats.sudah_validasi || 0, icon: 'fa-solid fa-user-check', color: '#2563EB', bg: '#EFF6FF' },
            { label: 'Sedang Pengerjaan', value: stats.sedang_pengerjaan || 0, icon: 'fa-solid fa-spinner', color: '#D97706', bg: '#FEF3C7' },
          ];

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

    useEffect(() => {
        if (isPelapor) return;

        const loadEcharts = async () => {
            if (!window.echarts) {
                await new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js';
                    script.async = true;
                    script.onload = () => resolve();
                    document.body.appendChild(script);
                });
            }

            if (chartRef.current && window.echarts) {
                const myChart = window.echarts.init(chartRef.current);
                
                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        textStyle: {
                            fontFamily: 'Telex'
                        }
                    },
                    legend: {
                        data: ['Aduan Masuk', 'Selesai', 'Barang Rusak', 'Diperbaiki Sendiri'],
                        textStyle: {
                            fontFamily: 'Telex',
                            color: '#475569',
                            fontSize: 12
                        },
                        bottom: 0,
                        itemGap: 24
                    },
                    grid: {
                        top: '12%',
                        bottom: '15%',
                        left: '4%',
                        right: '4%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: weekly_chart?.labels || [],
                        axisLabel: {
                            fontFamily: 'Telex',
                            fontSize: 12,
                            color: '#475569'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#E2E8F0'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            fontFamily: 'Telex',
                            fontSize: 12,
                            color: '#475569'
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#F1F5F9'
                            }
                        }
                    },
                    series: [
                        {
                            name: 'Aduan Masuk',
                            type: 'bar',
                            barGap: 0.15,
                            barWidth: '15%',
                            data: weekly_chart?.masuk || [],
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#3B82F6' },
                                        { offset: 1, color: '#2563EB' }
                                    ]
                                },
                                borderRadius: [4, 4, 0, 0]
                            }
                        },
                        {
                            name: 'Selesai',
                            type: 'bar',
                            barWidth: '15%',
                            data: weekly_chart?.selesai || [],
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#10B981' },
                                        { offset: 1, color: '#059669' }
                                    ]
                                },
                                borderRadius: [4, 4, 0, 0]
                            }
                        },
                        {
                            name: 'Barang Rusak',
                            type: 'bar',
                            barWidth: '15%',
                            data: weekly_chart?.barang_rusak || [],
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#EF4444' },
                                        { offset: 1, color: '#DC2626' }
                                    ]
                                },
                                borderRadius: [4, 4, 0, 0]
                            }
                        },
                        {
                            name: 'Diperbaiki Sendiri',
                            type: 'bar',
                            barWidth: '15%',
                            data: weekly_chart?.diperbaiki_sendiri || [],
                            itemStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                        { offset: 0, color: '#8B5CF6' },
                                        { offset: 1, color: '#7C3AED' }
                                    ]
                                },
                                borderRadius: [4, 4, 0, 0]
                            }
                        }
                    ]
                };

                myChart.setOption(option);

                const handleResize = () => {
                    myChart.resize();
                };
                window.addEventListener('resize', handleResize);

                return () => {
                    window.removeEventListener('resize', handleResize);
                    myChart.dispose();
                };
            }
        };

        loadEcharts();
    }, [weekly_chart, isPelapor]);

    return (
        <AdminLayout title={isPelapor ? "Dashboard Pelapor" : "Dashboard Admin"}>
            <Head title="Dashboard - SIM Aduan" />

            {/* Welcome banner for Pelapor */}
            {isPelapor && (
                <div style={{
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                    borderRadius: '8px',
                    padding: '24px',
                    color: '#FFFFFF',
                    marginBottom: '24px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' }}>
                        Selamat Datang di Portal Pengaduan IT RSUD Nganjuk
                    </h2>
                    <p style={{ fontSize: '14px', margin: 0, opacity: 0.9, lineHeight: '1.6' }}>
                        Gunakan akun pelapor Anda untuk membuat laporan kendala IT secara praktis tanpa mengisi data berulang kali. Pantau proses pengerjaan secara langsung di dashboard ini.
                    </p>
                </div>
            )}

            {/* Stat Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '28px',
            }}>
                {statCards.map((s, i) => (
                    <div key={i} style={{
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '24px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        <div style={{
                            width: '52px', height: '52px',
                            background: s.bg,
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <i className={s.icon} style={{ color: s.color, fontSize: '20px' }}></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px', fontWeight: '500' }}>
                                {s.label}
                            </div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1E293B', lineHeight: 1 }}>
                                {s.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Admin Chart Section */}
            {!isPelapor && (
                <div style={{
                    background: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    marginBottom: '28px'
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E293B', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Telex', sans-serif" }}>
                        <i className="fa-solid fa-chart-bar" style={{ color: '#2563EB' }}></i>
                        Grafik Penanganan Laporan Mingguan (7 Hari Terakhir)
                    </h3>
                    <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
                </div>
            )}

            {/* Pelapor Recent Activity Section */}
            {isPelapor && (
                <div style={{
                    background: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        borderBottom: '1px solid #F1F5F9',
                        paddingBottom: '14px',
                    }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>
                            <i className="fa-solid fa-list-check" style={{ marginRight: '8px', color: '#3B82F6' }}></i>
                            Laporan Terbaru Saya
                        </h3>
                        <Link href="/pelapor/riwayat" style={{
                            fontSize: '13px',
                            color: '#2563EB',
                            textDecoration: 'none',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#1D4ED8'}
                        onMouseLeave={e => e.currentTarget.style.color = '#2563EB'}>
                            Lihat Semua Riwayat <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px' }}></i>
                        </Link>
                    </div>

                    {recent_aduans.length > 0 ? (
                        <>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: '600' }}>No. Tiket</th>
                                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: '600' }}>Subjek Kendala</th>
                                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: '600' }}>Kategori</th>
                                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: '600' }}>Tanggal Lapor</th>
                                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: '600' }}>Status</th>
                                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: '600', textAlign: 'right' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(() => {
                                        const paginated = recent_aduans.slice((dashPage - 1) * DASH_PER_PAGE, dashPage * DASH_PER_PAGE);
                                        return paginated.map((aduan) => {
                                        const statusStyle = getStatusStyle(aduan.status);
                                        return (
                                            <tr key={aduan.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#1E293B' }}>
                                                    {aduan.ticket_number}
                                                </td>
                                                <td style={{ padding: '14px 16px', color: '#334155' }}>
                                                    {aduan.subject}
                                                </td>
                                                <td style={{ padding: '14px 16px', color: '#64748B' }}>
                                                    {aduan.category || '-'}
                                                </td>
                                                <td style={{ padding: '14px 16px', color: '#64748B' }}>
                                                    {new Date(aduan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                                                                href={`/aduan/${aduan.id}/berita-acara`}
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

                                                        <Link href={`/aduan/${aduan.id}`} style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            background: '#F1F5F9',
                                                            border: '1px solid #E2E8F0',
                                                            color: '#475569',
                                                            padding: '6px 12px',
                                                            fontSize: '14px',
                                                            fontWeight: 'bold',
                                                            textDecoration: 'none',
                                                            borderRadius: '4px',
                                                            transition: 'all 0.15s',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2563EB'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
                                                            Detail
                                                        </Link>
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
                            totalItems={recent_aduans.length}
                            currentPage={dashPage}
                            perPage={DASH_PER_PAGE}
                            onPageChange={p => setDashPage(p)}
                        />
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '48px 16px', color: '#94A3B8' }}>
                            <i className="fa-solid fa-paste" style={{ fontSize: '36px', color: '#CBD5E1', marginBottom: '14px' }}></i>
                            <p style={{ margin: '0 0 16px', fontSize: '14px' }}>Anda belum pernah membuat laporan aduan.</p>
                            <Link href="/pelapor/buat-aduan" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#2563EB',
                                color: '#FFFFFF',
                                padding: '10px 18px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                borderRadius: '4px',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                            onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}>
                                <i className="fa-solid fa-circle-plus"></i> Buat Laporan Pertama Anda
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
