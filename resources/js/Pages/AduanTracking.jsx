import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

const baseStyle = {
    fontFamily: "'Telex', sans-serif",
    fontSize: '14px',
    color: '#202124',
};

export default function AduanTracking() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [trackingResults, setTrackingResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selfFixLoading, setSelfFixLoading] = useState(null); // holds aduan.id while loading

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const queryParam = params.get('query');
        if (queryParam) {
            setSearchQuery(queryParam);
            performSearch(queryParam);
        }
    }, []);

    const performSearch = async (query) => {
        if (!query.trim()) return;
        setIsSearching(true);
        setHasSearched(true);
        try {
            const response = await fetch(`/api/aduan/track?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            setTrackingResults(data.aduans ?? []);
        } catch (error) {
            console.error('Error tracking aduan:', error);
            setTrackingResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleTrackingSearch = (e) => {
        e.preventDefault();
        performSearch(searchQuery);
    };

    const handleSelfFix = async (aduan) => {
        if (!confirm(`Apakah Anda yakin aduan ${aduan.ticket_number} telah Anda perbaiki sendiri? Status akan diubah menjadi "Diperbaiki Sendiri" dan tidak dapat dikembalikan dari halaman ini.`)) return;
        setSelfFixLoading(aduan.id);
        try {
            const res = await fetch(`/api/aduan/${aduan.id}/perbaiki-sendiri`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '', 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (data.success) {
                // Update local state immediately
                setTrackingResults(prev => prev.map(a => a.id === aduan.id ? { ...a, status: 'diperbaiki_sendiri' } : a));
            } else {
                alert(data.message || 'Gagal mengubah status.');
            }
        } catch (e) {
            alert('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setSelfFixLoading(null);
        }
    };

    return (
        <>
            <Head title="Lacak Pengaduan - SIM Aduan" />

            <style>
                {`
                    .tracking-outer {
                        padding: 40px 16px;
                        background: #F0F4F9;
                        min-height: calc(100vh - 120px);
                        display: flex;
                        justify-content: center;
                    }
                    .tracking-container {
                        width: 100%;
                        max-width: 720px;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }
                    .t-card {
                        background: #fff;
                        border: 1px solid #E2E8F0;
                        border-radius: 12px;
                        padding: 32px;
                        box-sizing: border-box;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    }
                    .t-title {
                        font-size: 24px;
                        color: #0F172A;
                        margin: 0 0 6px 0;
                    }
                    .t-subtitle {
                        font-size: 14px;
                        color: #64748B;
                        margin: 0 0 24px 0;
                    }
                    .t-input-group {
                        display: flex;
                        gap: 12px;
                    }
                    .t-input-wrapper {
                        position: relative;
                        flex: 1;
                    }
                    .t-input {
                        width: 100%;
                        padding: 14px 14px 14px 44px;
                        border: 1px solid #CBD5E1;
                        border-radius: 8px;
                        font-size: 15px;
                        font-family: 'Telex', sans-serif;
                        outline: none;
                        transition: all 0.2s;
                        box-sizing: border-box;
                    }
                    .t-input:focus {
                        border-color: #2563EB;
                        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                    }
                    .t-btn {
                        background: #2563EB;
                        color: #fff;
                        border: none;
                        padding: 0 28px;
                        border-radius: 8px;
                        font-size: 15px;
                        font-family: 'Telex', sans-serif;
                        cursor: pointer;
                        transition: background 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .t-btn:hover {
                        background: #1D4ED8;
                    }
                    
                    /* Status color configs */
                    .status-badge {
                        font-size: 14px;
                        padding: 6px 14px;
                        border-radius: 6px;
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                    }

                    /* Responsive Navbar Styles */
                    .nav-middle {
                        display: flex;
                        align-items: center;
                        gap: 24px;
                    }
                    .nav-right {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .nav-hamburger {
                        display: none;
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: #475569;
                        font-size: 18px;
                        padding: 8px;
                    }
                    .mobile-dropdown-menu {
                        display: none;
                        background: #fff;
                        border-bottom: 1px solid #E2E8F0;
                        padding: 16px;
                        flex-direction: column;
                        gap: 16px;
                        position: absolute;
                        top: 60px;
                        left: 0;
                        right: 0;
                        z-index: 40;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    }
                    @media (max-width: 768px) {
                        .nav-middle {
                            display: none;
                        }
                        .nav-right {
                            display: none;
                        }
                        .nav-hamburger {
                            display: block;
                        }
                        .mobile-dropdown-menu.active {
                            display: flex;
                        }
                    }
                `}
            </style>

            <div style={{ ...baseStyle, minHeight: '100vh', background: '#F0F4F9' }}>
                {/* Header Navbar */}
                <header style={{
                    background: '#fff',
                    borderBottom: '1px solid #E5E7EB',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
                        {/* Left: Logo */}
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <div style={{
                                width: '34px', height: '34px',
                                borderRadius: '6px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                overflow: 'hidden'
                            }}>
                                <img src="/images/logo_rsud.jpeg" alt="RSUD Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 4px' }}></div>
                            <div>
                                <div style={{ fontWeight: '400', fontSize: '18px', color: '#1E293B', lineHeight: 1 }}>SIM Aduan</div>
                            </div>
                        </Link>

                        {/* Middle: Links/Tabs */}
                        <div className="nav-middle">
                            <Link
                                href="/buat-aduan"
                                style={{
                                    textDecoration: 'none',
                                    fontSize: '15px',
                                    color: '#475569',
                                    fontFamily: "'Telex', sans-serif",
                                    padding: '8px 4px',
                                    transition: 'color 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                                onMouseLeave={e => e.currentTarget.style.color = '#475569'}
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                                Form Pengaduan
                            </Link>
                            <Link
                                href="/lacak-aduan"
                                style={{
                                    textDecoration: 'none',
                                    fontSize: '15px',
                                    color: '#2563EB',
                                    fontWeight: 'bold',
                                    fontFamily: "'Telex', sans-serif",
                                    padding: '8px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                                Tracking Aduan
                            </Link>
                        </div>

                        {/* Right: Buttons */}
                        <div className="nav-right">
                            <Link
                                href="/login"
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #E2E8F0',
                                    color: '#475569',
                                    textDecoration: 'none',
                                    fontSize: '15px',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontFamily: "'Telex', sans-serif",
                                    borderRadius: '6px',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = '#F8FAFC';
                                    e.currentTarget.style.borderColor = '#CBD5E1';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = '#E2E8F0';
                                }}
                            >
                                <i className="fa-solid fa-right-to-bracket"></i>
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                style={{
                                    padding: '8px 16px',
                                    background: '#2563EB',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontSize: '15px',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.15)',
                                    fontFamily: "'Telex', sans-serif",
                                    borderRadius: '6px',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = '#1D4ED8';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = '#2563EB';
                                    e.currentTarget.style.transform = 'none';
                                }}
                            >
                                <i className="fa-solid fa-user-plus"></i>
                                Daftar
                            </Link>
                        </div>

                        {/* Hamburger Button */}
                        <button
                            className="nav-hamburger"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle Navigation Menu"
                        >
                            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                        </button>

                        {/* Mobile Dropdown Menu Panel */}
                        <div className={`mobile-dropdown-menu ${mobileMenuOpen ? 'active' : ''}`}>
                            <Link
                                href="/buat-aduan"
                                style={{
                                    textDecoration: 'none',
                                    fontSize: '15px',
                                    color: '#475569',
                                    fontFamily: "'Telex', sans-serif",
                                    padding: '8px 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                                Form Pengaduan
                            </Link>
                            <Link
                                href="/lacak-aduan"
                                style={{
                                    textDecoration: 'none',
                                    fontSize: '15px',
                                    color: '#2563EB',
                                    fontWeight: 'bold',
                                    fontFamily: "'Telex', sans-serif",
                                    padding: '8px 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                                Tracking Aduan
                            </Link>
                            <hr style={{ border: 0, borderTop: '1px solid #F1F5F9', margin: '4px 0' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Link
                                    href="/login"
                                    style={{
                                        padding: '10px',
                                        border: '1px solid #E2E8F0',
                                        color: '#475569',
                                        textDecoration: 'none',
                                        fontSize: '15px',
                                        textAlign: 'center',
                                        fontFamily: "'Telex', sans-serif",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        borderRadius: '6px',
                                    }}
                                >
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    style={{
                                        padding: '10px',
                                        background: '#2563EB',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        fontSize: '15px',
                                        textAlign: 'center',
                                        fontFamily: "'Telex', sans-serif",
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        borderRadius: '6px',
                                    }}
                                >
                                    <i className="fa-solid fa-user-plus"></i>
                                    Daftar
                                </Link>
                            </div>
                        </div>

                    </div>
                </header>

                {/* Main Content Area */}
                <section className="tracking-outer">
                    <div className="tracking-container">

                        {/* Search Input Card */}
                        <div className="t-card">
                            <h2 className="t-title">Lacak Pengaduan IT</h2>
                            <p className="t-subtitle">Lacak status penyelesaian keluhan Anda secara langsung dengan nomor tiket, nomor WhatsApp, atau nama pelapor.</p>

                            <form onSubmit={handleTrackingSearch} className="t-input-group">
                                <div className="t-input-wrapper">
                                    <i className="fa-solid fa-magnifying-glass" style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#94A3B8',
                                        fontSize: '16px',
                                    }}></i>
                                    <input
                                        type="text"
                                        placeholder="Contoh: ADU-001, 081234567, atau Bambang..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="t-input"
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={isSearching} className="t-btn">
                                    {isSearching ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin"></i>
                                            Mencari...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                            Cari
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Search Results Area */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {trackingResults.length > 0 ? (
                                trackingResults.map((aduan) => {
                                    // Status configuration
                                    let statusText = 'Menunggu Validasi';
                                    let statusColor = '#2563EB';
                                    let statusBg = '#EFF6FF';
                                    let statusIcon = 'fa-solid fa-clock';

                                    if (aduan.status === 'sudah_validasi') {
                                        statusText = 'Sudah Validasi';
                                        statusColor = '#8B5CF6';
                                        statusBg = '#F5F3FF';
                                        statusIcon = 'fa-solid fa-circle-check';
                                    } else if (aduan.status === 'sedang_pengerjaan') {
                                        statusText = 'Sedang Dikerjakan';
                                        statusColor = '#F59E0B';
                                        statusBg = '#FEF3C7';
                                        statusIcon = 'fa-solid fa-screwdriver-wrench';
                                    } else if (aduan.status === 'selesai') {
                                        statusText = 'Selesai';
                                        statusColor = '#10B981';
                                        statusBg = '#ECFDF5';
                                        statusIcon = 'fa-solid fa-circle-check';
                                    } else if (aduan.status === 'barang_rusak') {
                                        statusText = 'Barang Rusak';
                                        statusColor = '#EF4444';
                                        statusBg = '#FEF2F2';
                                        statusIcon = 'fa-solid fa-circle-xmark';
                                    } else if (aduan.status === 'diperbaiki_sendiri') {
                                        statusText = 'Diperbaiki Sendiri';
                                        statusColor = '#64748B';
                                        statusBg = '#F8FAFC';
                                        statusIcon = 'fa-solid fa-wrench';
                                    }

                                    return (
                                        <div key={aduan.id} className="t-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                                <div>
                                                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A', display: 'block' }}>{aduan.ticket_number}</span>
                                                    <span style={{ fontSize: '14px', color: '#64748B' }}>Kategori: <strong>{aduan.category}</strong></span>
                                                </div>
                                                <span className="status-badge" style={{ color: statusColor, backgroundColor: statusBg, border: `1px solid ${statusColor}22` }}>
                                                    <i className={statusIcon}></i> {statusText}
                                                </span>
                                            </div>

                                            <div style={{ borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <div>
                                                    <span style={{ display: 'block', fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Pelapor</span>
                                                    <span style={{ fontSize: '14px', color: '#1E293B' }}>{aduan.name} (Unit: {aduan.unit})</span>
                                                </div>
                                                <div>
                                                    <span style={{ display: 'block', fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Uraian Kendala</span>
                                                    <span style={{ fontSize: '14px', color: '#1E293B', lineHeight: '1.5' }}>{aduan.description}</span>
                                                </div>
                                            </div>

                                            {aduan.technician && (
                                                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                                    <div style={{ fontSize: '14px', color: '#334155', marginBottom: '8px' }}>
                                                        Teknisi Penanggung Jawab: <strong>{aduan.technician}</strong>
                                                    </div>
                                                    {aduan.response ? (
                                                        <div>
                                                            <span style={{ display: 'block', fontSize: '12px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Respon / Tindakan Medis IT</span>
                                                            <span style={{ fontSize: '14px', color: '#1E293B', lineHeight: '1.5' }}>{aduan.response}</span>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: '14px', color: '#64748B', fontStyle: 'italic' }}>Menunggu respon tindakan dari teknisi...</span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Diperbaiki Sendiri button */}
                                            {(aduan.status === 'menunggu_validasi' || aduan.status === 'sudah_validasi') && (
                                                <div style={{ paddingTop: '4px' }}>
                                                    <button
                                                        onClick={() => handleSelfFix(aduan)}
                                                        disabled={selfFixLoading === aduan.id}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            padding: '10px 20px',
                                                            background: selfFixLoading === aduan.id ? '#F1F5F9' : '#F8FAFC',
                                                            border: '1px solid #E2E8F0',
                                                            color: '#475569',
                                                            borderRadius: '6px',
                                                            fontSize: '14px',
                                                            cursor: selfFixLoading === aduan.id ? 'not-allowed' : 'pointer',
                                                            fontFamily: "'Telex', sans-serif",
                                                            transition: 'all 0.15s',
                                                        }}
                                                        onMouseEnter={e => { if (selfFixLoading !== aduan.id) { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#1E293B'; } }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#475569'; }}
                                                    >
                                                        {selfFixLoading === aduan.id
                                                            ? <><i className="fa-solid fa-spinner fa-spin"></i> Memproses...</>
                                                            : <><i className="fa-solid fa-screwdriver-wrench"></i> Saya Sudah Perbaiki Sendiri</>
                                                        }
                                                    </button>
                                                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#94A3B8' }}>Gunakan tombol ini jika kendala sudah teratasi tanpa perlu bantuan teknisi.</p>
                                                </div>
                                            )}

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#94A3B8' }}>
                                                <span>Dilaporkan via SIM Aduan</span>
                                                <span>{new Date(aduan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : hasSearched ? (
                                <div className="t-card" style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
                                    <i className="fa-solid fa-folder-open" style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '16px', display: 'block' }}></i>
                                    <h3 style={{ fontSize: '16px', color: '#334155', margin: '0 0 6px 0' }}>Tidak Menemukan Pengaduan</h3>
                                    <span>Kami tidak menemukan pengaduan dengan kata kunci "<strong>{searchQuery}</strong>". Silakan periksa kembali ketikan Anda.</span>
                                </div>
                            ) : (
                                <div className="t-card" style={{ textAlign: 'center', padding: '48px 24px', color: '#64748B' }}>
                                    <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '16px', display: 'block' }}></i>
                                    <h3 style={{ fontSize: '16px', color: '#334155', margin: '0 0 6px 0' }}>Mulai Melacak</h3>
                                    <span>Gunakan form pencarian di atas untuk memantau status penyelesaian kendala IT Anda secara real-time.</span>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* Premium Footer */}
                <footer style={{
                    background: '#0F172A',
                    color: '#94A3B8',
                    padding: '64px 24px 32px',
                    fontFamily: "'Telex', sans-serif",
                    borderTop: '1px solid #1E293B',
                }}>
                    <div style={{
                        maxWidth: '1100px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '40px',
                        marginBottom: '48px',
                    }}>
                        {/* Column 1: Brand & About */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '8px',
                                    background: '#FFFFFF',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                }}>
                                    <img src="/images/logo_rsud.jpeg" alt="RSUD Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#F1F5F9' }}>SIM Aduan</span>
                            </div>
                            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#94A3B8', margin: 0 }}>
                                Sistem Informasi Manajemen Pengaduan IT RSUD Nganjuk terpadu untuk mendukung kelancaran operasional pelayanan kesehatan di seluruh unit kerja secara cepat, tanggap, dan profesional.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <a href="https://rsud.nganjukkab.go.id" target="_blank" rel="noopener noreferrer" style={{
                                    width: '32px', height: '32px', borderRadius: '50%', background: '#1E293B',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F1F5F9',
                                    textDecoration: 'none', transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.transform = 'none'; }}>
                                    <i className="fa-solid fa-globe" style={{ fontSize: '14px', margin: 'auto' }}></i>
                                </a>
                                <a href="tel:0358321818" style={{
                                    width: '32px', height: '32px', borderRadius: '50%', background: '#1E293B',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F1F5F9',
                                    textDecoration: 'none', transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#10B981'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.transform = 'none'; }}>
                                    <i className="fa-solid fa-phone" style={{ fontSize: '14px', margin: 'auto' }}></i>
                                </a>
                                <a href="mailto:it.rsudnganjuk@gmail.com" style={{
                                    width: '32px', height: '32px', borderRadius: '50%', background: '#1E293B',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F1F5F9',
                                    textDecoration: 'none', transition: 'all 0.2s'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.transform = 'none'; }}>
                                    <i className="fa-solid fa-envelope" style={{ fontSize: '14px', margin: 'auto' }}></i>
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Tautan Pintar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tautan Pintar</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li>
                                    <Link href="/" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#3B82F6'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
                                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', marginRight: '8px' }}></i>Beranda Utama
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/buat-aduan" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#3B82F6'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
                                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', marginRight: '8px' }}></i>Form Pengaduan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/lacak-aduan" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#3B82F6'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
                                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', marginRight: '8px' }}></i>Tracking Aduan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'none', transition: 'color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#3B82F6'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
                                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', marginRight: '8px' }}></i>Portal Admin & Teknisi
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Kategori Kendala */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kategori Kendala</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li style={{ fontSize: '13px', color: '#94A3B8' }}>
                                    <i className="fa-solid fa-compact-disc" style={{ fontSize: '10px', marginRight: '8px', color: '#3B82F6' }}></i>Software & Aplikasi
                                </li>
                                <li style={{ fontSize: '13px', color: '#94A3B8' }}>
                                    <i className="fa-solid fa-server" style={{ fontSize: '10px', marginRight: '8px', color: '#10B981' }}></i>Hardware & Jaringan
                                </li>
                                <li style={{ fontSize: '13px', color: '#94A3B8' }}>
                                    <i className="fa-solid fa-database" style={{ fontSize: '10px', marginRight: '8px', color: '#F59E0B' }}></i>SIMRS & Data Integrasi
                                </li>
                                <li style={{ fontSize: '13px', color: '#94A3B8' }}>
                                    <i className="fa-solid fa-microchip" style={{ fontSize: '10px', marginRight: '8px', color: '#EC4899' }}></i>Sistem Pendukung Lainnya
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Kontak & Alamat */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#F1F5F9', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kontak Utama</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#94A3B8' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <i className="fa-solid fa-location-dot" style={{ color: '#3B82F6', marginTop: '3px', flexShrink: 0 }}></i>
                                    <span style={{ lineHeight: '1.4' }}>Jl. Dr. Soetomo No.62, Kauman, Kec. Nganjuk, Kabupaten Nganjuk, Jawa Timur 64411</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fa-solid fa-phone" style={{ color: '#10B981', flexShrink: 0 }}></i>
                                    <span>(0358) 321818</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fa-solid fa-envelope" style={{ color: '#EF4444', flexShrink: 0 }}></i>
                                    <span>it.rsudnganjuk@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom Bar */}
                    <div style={{
                        maxWidth: '1100px',
                        margin: '0 auto',
                        borderTop: '1px solid #1E293B',
                        paddingTop: '24px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '12px',
                    }}>
                        <span>
                            © {new Date().getFullYear()} <strong>SIM Aduan RSUD Nganjuk</strong>. Hak Cipta Dilindungi Undang-Undang.
                        </span>
                        <span>
                            Sub Bagian IT RSUD Nganjuk
                        </span>
                    </div>
                </footer>
            </div>
        </>
    );
}
