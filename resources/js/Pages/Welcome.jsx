import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

const baseStyle = {
    fontFamily: "'Telex', sans-serif",
    fontSize: '14px',
    color: '#202124',
};

const categoryDetails = {
    'Software': {
        icon: 'fa-solid fa-laptop-code',
        color: '#8B5CF6',
        bgLight: '#F5F3FF',
        desc: 'Sistem SIM-RS, kendala aplikasi, operating system, database, atau lisensi software.'
    },
    'Hardware': {
        icon: 'fa-solid fa-desktop',
        color: '#F59E0B',
        bgLight: '#FEF3C7',
        desc: 'Kerusakan fisik PC, monitor, printer, scanner, mouse, atau komponen hardware lainnya.'
    },
    'Jaringan': {
        icon: 'fa-solid fa-network-wired',
        color: '#10B981',
        bgLight: '#ECFDF5',
        desc: 'Masalah koneksi Wi-Fi/Internet lambat atau putus, kabel LAN, atau akses server lokal.'
    },
    'Lainnya': {
        icon: 'fa-solid fa-circle-question',
        color: '#6366F1',
        bgLight: '#EEF2FF',
        desc: 'Kendala atau kebutuhan IT lainnya di unit kerja yang tidak termasuk kategori di atas.'
    }
};

const getCategoryDetail = (name) => {
    if (!name) return {
        icon: 'fa-solid fa-gears',
        color: '#3B82F6',
        bgLight: '#EFF6FF',
        desc: 'Laporkan kendala atau masalah operasional IT Anda.'
    };
    const key = Object.keys(categoryDetails).find(k => k.toLowerCase() === name.toLowerCase());
    return categoryDetails[key] || {
        icon: 'fa-solid fa-gears',
        color: '#3B82F6',
        bgLight: '#EFF6FF',
        desc: 'Laporkan kendala atau masalah operasional IT Anda.'
    };
};

export default function Welcome({ categories = [] }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleCategorySelect = (categoryName) => {
        window.location.href = `/buat-aduan?category=${encodeURIComponent(categoryName)}`;
    };

    return (
        <>
            <Head title="SIM Aduan - Portal Pengaduan RSUD Nganjuk" />

            <style>
                {`
                    /* Modern Premium Layout Styles */
                    .hero-outer {
                        background: #FFFFFF;
                        border-bottom: 1px solid #E2E8F0;
                    }
                    .hero-container {
                        max-width: 1100px;
                        margin: 0 auto;
                        padding: 60px 24px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 48px;
                        box-sizing: border-box;
                    }
                    @media (max-width: 768px) {
                        .hero-container {
                            flex-direction: column-reverse;
                            padding: 40px 16px;
                            text-align: center;
                            gap: 32px;
                        }
                    }
                    .hero-text-content {
                        flex: 1;
                        text-align: left;
                    }
                    @media (max-width: 768px) {
                        .hero-text-content {
                            text-align: center;
                        }
                    }
                    .hero-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        background: #EFF6FF;
                        color: #2563EB;
                        padding: 6px 14px;
                        border-radius: 6px;
                        font-size: 12px;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                        margin-bottom: 20px;
                        border: 1px solid #DBEAFE;
                    }
                    @media (max-width: 768px) {
                        .hero-badge {
                            margin: 0 auto 20px auto;
                        }
                    }
                    .hero-main-title {
                        font-size: 38px;
                        line-height: 1.25;
                        color: #0F172A;
                        margin: 0 0 16px 0;
                    }
                    @media (max-width: 768px) {
                        .hero-main-title {
                            font-size: 28px;
                        }
                    }
                    .hero-main-subtitle {
                        font-size: 15px;
                        color: #475569;
                        line-height: 1.6;
                        margin: 0 0 28px 0;
                    }
                    .hero-cta-btn {
                        background: #2563EB;
                        color: #fff;
                        border: none;
                        padding: 12px 28px;
                        font-size: 15px;
                        font-family: 'Telex', sans-serif;
                        font-weight: 500;
                        border-radius: 6px;
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1);
                        transition: all 0.2s ease;
                        text-decoration: none;
                    }
                    .hero-cta-btn:hover {
                        background: #1D4ED8;
                        transform: translateY(-1px);
                        box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -2px rgba(37, 99, 235, 0.15);
                    }
                    .hero-image-side {
                        flex: 1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .hero-lottie-side {
                        width: 100%;
                        max-width: 480px;
                        aspect-ratio: 1.2;
                    }

                    /* Categories Section */
                    .cat-outer {
                        padding: 60px 0;
                        background: #F8FAFC;
                        border-bottom: 1px solid #E2E8F0;
                    }
                    .cat-container {
                        max-width: 1100px;
                        margin: 0 auto;
                        padding: 0 24px;
                        box-sizing: border-box;
                    }
                    .cat-header {
                        text-align: center;
                        margin-bottom: 40px;
                    }
                    .cat-title {
                        font-size: 24px;
                        color: #0F172A;
                        margin: 0 0 8px 0;
                    }
                    .cat-subtitle {
                        font-size: 14px;
                        color: #64748B;
                        margin: 0;
                    }
                    .cat-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                        gap: 20px;
                    }
                    .cat-card {
                        background: #fff;
                        border: 1px solid #E2E8F0;
                        border-radius: 12px;
                        padding: 24px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        box-sizing: border-box;
                    }
                    .cat-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.04);
                    }
                    .cat-card-icon {
                        width: 48px;
                        height: 48px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                        margin-bottom: 16px;
                    }
                    .cat-card-title {
                        font-size: 21px;
                        color: #0F172A;
                        margin: 0 0 12px 0;
                    }
                    .cat-card-desc {
                        font-size: 15px;
                        color: #64748B;
                        line-height: 1.6;
                        margin: 0;
                    }
                    .cat-card-action {
                        font-size: 13px;
                        color: #2563EB;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        transition: gap 0.2s;
                    }
                    .cat-card:hover .cat-card-action {
                        gap: 10px;
                    }

                    /* Steps/Tata Cara Section */
                    .steps-outer {
                        background: #FFFFFF;
                        padding: 60px 0;
                        border-bottom: 1px solid #E2E8F0;
                    }
                    .steps-container {
                        max-width: 1100px;
                        margin: 0 auto;
                        padding: 0 24px;
                        box-sizing: border-box;
                    }
                    .steps-header {
                        text-align: center;
                        margin-bottom: 48px;
                    }
                    .steps-title {
                        font-size: 24px;
                        color: #0F172A;
                        margin: 0 0 8px 0;
                    }
                    .steps-subtitle {
                        font-size: 14px;
                        color: #64748B;
                        margin: 0;
                    }
                    .steps-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                        gap: 24px;
                        position: relative;
                        margin-top: 16px;
                    }
                    .step-card {
                        background: #F8FAFC;
                        border: 1px solid #E2E8F0;
                        border-radius: 12px;
                        padding: 24px;
                        text-align: center;
                        position: relative;
                        box-sizing: border-box;
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }
                    .step-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 16px rgba(0,0,0,0.03);
                    }
                    .step-number {
                        position: absolute;
                        top: -15px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 30px;
                        height: 30px;
                        background: #2563EB;
                        color: #fff;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
                    }
                    .step-icon-wrapper {
                        width: 50px;
                        height: 50px;
                        border-radius: 10px;
                        background: #EFF6FF;
                        color: #2563EB;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                        margin: 10px auto 16px auto;
                    }
                    .step-card-title {
                        font-size: 21px;
                        color: #0F172A;
                        margin: 0 0 12px 0;
                    }
                    .step-card-desc {
                        font-size: 15px;
                        color: #64748B;
                        line-height: 1.6;
                        margin: 0;
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                        </div>

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
                                    color: '#475569',
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

                {/* Hero Section */}
                <section className="hero-outer">
                    <div className="hero-container">
                        <div className="hero-text-content">
                            <span className="hero-badge">
                                <i className="fa-solid fa-circle-check"></i> Layanan Pengaduan IT RSUD Nganjuk
                            </span>
                            <h1 className="hero-main-title">
                                Layanan Pengaduan IT Cepat & Tanggap
                            </h1>
                            <p className="hero-main-subtitle">
                                Laporkan kendala perangkat keras, perangkat lunak, maupun jaringan di unit kerja Anda dengan mudah. Tim teknisi kami siap merespon dan menyelesaikan masalah Anda secara profesional.
                            </p>
                            <Link
                                href="/buat-aduan"
                                className="hero-cta-btn"
                            >
                                Buat Laporan Baru <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                        <div className="hero-image-side">
                            <div className="hero-lottie-side">
                                <lottie-player
                                    src="/Trouble.json"
                                    background="transparent"
                                    speed="1"
                                    loop
                                    autoplay
                                ></lottie-player>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="cat-outer">
                    <div className="cat-container">
                        <div className="cat-header">
                            <h2 className="cat-title">Pilih Kategori Kendala</h2>
                            <p className="cat-subtitle">Klik pada salah satu kategori untuk langsung melapor pengaduan</p>
                        </div>

                        <div className="cat-grid">
                            {categories.map((cat) => {
                                const detail = getCategoryDetail(cat.name);
                                return (
                                    <div
                                        key={cat.id}
                                        className="cat-card"
                                        onClick={() => handleCategorySelect(cat.name)}
                                    >
                                        <h3 className="cat-card-title">{cat.name}</h3>
                                        <p className="cat-card-desc">{detail.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="steps-outer">
                    <div className="steps-container">
                        <div className="steps-header">
                            <h2 className="steps-title">Alur Proses Pengaduan</h2>
                            <p className="steps-subtitle">Sangat mudah melapor dan melacak kendala IT Anda dalam 4 langkah</p>
                        </div>

                        <div className="steps-grid">
                            {/* Step 1 */}
                            <div className="step-card">
                                <div className="step-number">1</div>
                                <div className="step-icon-wrapper">
                                    <i className="fa-solid fa-layer-group"></i>
                                </div>
                                <h3 className="step-card-title">Pilih Kategori</h3>
                                <p className="step-card-desc">
                                    Pilih kategori kendala (Software, Hardware, Jaringan, Lainnya) pada pilihan di atas.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="step-card">
                                <div className="step-number">2</div>
                                <div className="step-icon-wrapper">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </div>
                                <h3 className="step-card-title">Isi Formulir</h3>
                                <p className="step-card-desc">
                                    Lengkapi identitas diri Anda dan jelaskan uraian kendala IT secara rincian dan jelas.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="step-card">
                                <div className="step-number">3</div>
                                <div className="step-icon-wrapper">
                                    <i className="fa-solid fa-signature"></i>
                                </div>
                                <h3 className="step-card-title">Tanda Tangan</h3>
                                <p className="step-card-desc">
                                    Bubuhkan tanda tangan digital langsung pada area pad yang tersedia sebagai validitas.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="step-card">
                                <div className="step-number">4</div>
                                <div className="step-icon-wrapper">
                                    <i className="fa-solid fa-paper-plane"></i>
                                </div>
                                <h3 className="step-card-title">Kirim & Pantau</h3>
                                <p className="step-card-desc">
                                    Kirim laporan dan tim teknisi kami akan segera menangani. Pantau status penyelesaiannya.
                                </p>
                            </div>
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
