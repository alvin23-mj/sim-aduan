import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SignaturePad from '@/Components/SignaturePad';

const baseStyle = {
    fontFamily: "'Telex', sans-serif",
    fontSize: '14px',
    color: '#202124',
};

const errorStyle = {
    fontSize: '12px',
    color: '#D93025',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
};

export default function AduanForm({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '', // repurposed for WhatsApp
        unit: '',
        category: '',
        description: '',
        signature: '',
    });

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category');
        if (cat) {
            setData('category', cat);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('aduan.store'));
    };

    return (
        <>
            <Head title="Buat Aduan Baru - SIM Aduan" />

            <style>
                {`
                    /* Google Form Styling System */
                    .form-outer {
                        padding: 40px 16px;
                        background: #F0F4F9;
                        min-height: calc(100vh - 120px);
                        display: flex;
                        justify-content: center;
                    }
                    .g-container {
                        width: 100%;
                        max-width: 640px;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    .g-card {
                        background: #fff;
                        border: 1px solid #dadce0;
                        border-radius: 8px;
                        padding: 24px;
                        box-sizing: border-box;
                    }
                    .g-title {
                        font-size: 32px;
                        font-weight: normal;
                        color: #202124;
                        margin: 0 0 8px 0;
                        line-height: 1.25;
                    }
                    .g-subtitle {
                        font-size: 14px;
                        color: #202124;
                        line-height: 1.5;
                        margin: 0 0 16px 0;
                    }
                    .g-required-note {
                        font-size: 14px;
                        color: #D93025;
                        margin: 0;
                    }
                    .g-question-title {
                        font-size: 16px;
                        color: #202124;
                        display: block;
                        margin-bottom: 16px;
                        line-height: 1.3;
                    }
                    .g-required-indicator {
                        color: #D93025;
                    }
                    .g-input-wrapper {
                        border-bottom: 1px solid #dadce0;
                        width: 100%;
                        max-width: 480px;
                        padding-bottom: 4px;
                        transition: border-bottom-color 0.2s;
                    }
                    .g-input-wrapper:focus-within {
                        border-bottom: 2px solid #2563EB;
                        padding-bottom: 3px;
                    }
                    .g-input-wrapper-full {
                        border-bottom: 1px solid #dadce0;
                        width: 100%;
                        padding-bottom: 4px;
                        transition: border-bottom-color 0.2s;
                    }
                    .g-input-wrapper-full:focus-within {
                        border-bottom: 2px solid #2563EB;
                        padding-bottom: 3px;
                    }
                    .g-input-field {
                        width: 100%;
                        border: none;
                        outline: none;
                        font-size: 14px;
                        font-family: 'Telex', sans-serif;
                        color: #202124;
                        padding: 4px 0;
                    }
                    .g-textarea-field {
                        width: 100%;
                        border: none;
                        outline: none;
                        font-size: 14px;
                        font-family: 'Telex', sans-serif;
                        color: #202124;
                        padding: 4px 0;
                        resize: vertical;
                    }
                    .g-select-field {
                        width: 100%;
                        max-width: 480px;
                        border: 1px solid #dadce0;
                        border-radius: 6px;
                        padding: 10px 12px;
                        font-size: 14px;
                        font-family: 'Telex', sans-serif;
                        outline: none;
                        color: #202124;
                        background: #fff;
                        cursor: pointer;
                        transition: border-color 0.2s;
                    }
                    .g-select-field:focus {
                        border-color: #2563EB;
                        border-width: 2px;
                        padding: 9px 11px;
                    }
                    .g-submit-btn {
                        background: #2563EB;
                        color: #fff;
                        border: none;
                        padding: 10px 24px;
                        border-radius: 6px;
                        font-size: 14px;
                        font-family: 'Telex', sans-serif;
                        cursor: pointer;
                        transition: background 0.2s;
                        box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
                    }
                    .g-submit-btn:hover {
                        background: #1D4ED8;
                    }
                    .g-clear-btn {
                        background: none;
                        border: none;
                        color: #2563EB;
                        font-size: 14px;
                        font-family: 'Telex', sans-serif;
                        cursor: pointer;
                        padding: 8px 16px;
                        transition: background 0.2s;
                        border-radius: 6px;
                    }
                    .g-clear-btn:hover {
                        background: rgba(37,99,235,0.05);
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
                                    color: '#2563EB',
                                    fontWeight: 'bold',
                                    fontFamily: "'Telex', sans-serif",
                                    padding: '8px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
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
                                    color: '#2563EB',
                                    fontWeight: 'bold',
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

                {/* Standing Form Page Content */}
                <section className="form-outer">
                    <div className="g-container">
                        <form onSubmit={handleSubmit}>

                            {/* CARD 1: Header / Title Card */}
                            <div className="g-card">
                                <h1 className="g-title">Form Pengaduan SIM Aduan</h1>
                                <p className="g-subtitle">
                                    Silakan isi formulir di bawah ini dengan lengkap untuk melaporkan kendala, keluhan, atau kerusakan aset IT pada unit kerja Anda.
                                </p>
                                <div style={{ borderTop: '1px solid #dadce0', paddingTop: '12px' }}>
                                    <p className="g-required-note">* Menunjukkan pertanyaan yang wajib diisi</p>
                                </div>
                            </div>

                            {/* CARD 2: Nama Lengkap */}
                            <div className="g-card" style={{ marginTop: '12px' }}>
                                <label className="g-question-title">
                                    Nama Lengkap <span className="g-required-indicator">*</span>
                                </label>
                                <div className="g-input-wrapper">
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Jawaban Anda"
                                        className="g-input-field"
                                        required
                                    />
                                </div>
                                {errors.name && (
                                    <div style={errorStyle}>
                                        <i className="fa-solid fa-circle-exclamation"></i> {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* CARD 3: Unit / Ruangan */}
                            <div className="g-card" style={{ marginTop: '12px' }}>
                                <label className="g-question-title">
                                    Unit / Ruangan Kerja <span className="g-required-indicator">*</span>
                                </label>
                                <div className="g-input-wrapper">
                                    <input
                                        type="text"
                                        value={data.unit}
                                        onChange={e => setData('unit', e.target.value)}
                                        placeholder="Jawaban Anda"
                                        className="g-input-field"
                                        required
                                    />
                                </div>
                                {errors.unit && (
                                    <div style={errorStyle}>
                                        <i className="fa-solid fa-circle-exclamation"></i> {errors.unit}
                                    </div>
                                )}
                            </div>

                            {/* CARD 4: Nomor WhatsApp */}
                            <div className="g-card" style={{ marginTop: '12px' }}>
                                <label className="g-question-title">
                                    Nomor WhatsApp <span className="g-required-indicator">*</span>
                                </label>
                                <div className="g-input-wrapper">
                                    <input
                                        type="text"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="Jawaban Anda (Contoh: 08123456789)"
                                        className="g-input-field"
                                        required
                                    />
                                </div>
                                {errors.email && (
                                    <div style={errorStyle}>
                                        <i className="fa-solid fa-circle-exclamation"></i> {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* CARD 5: Kategori */}
                            <div className="g-card" style={{ marginTop: '12px' }}>
                                <label className="g-question-title">
                                    Kategori Kerusakan <span className="g-required-indicator">*</span>
                                </label>
                                <select
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="g-select-field"
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <div style={errorStyle}>
                                        <i className="fa-solid fa-circle-exclamation"></i> {errors.category}
                                    </div>
                                )}
                            </div>

                            {/* CARD 6: Uraian Kerusakan */}
                            <div className="g-card" style={{ marginTop: '12px' }}>
                                <label className="g-question-title">
                                    Uraian Kerusakan <span className="g-required-indicator">*</span>
                                </label>
                                <div className="g-input-wrapper-full">
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Jelaskan secara rinci kendala atau kerusakan yang terjadi..."
                                        rows={3}
                                        className="g-textarea-field"
                                        required
                                    />
                                </div>
                                {errors.description && (
                                    <div style={errorStyle}>
                                        <i className="fa-solid fa-circle-exclamation"></i> {errors.description}
                                    </div>
                                )}
                            </div>

                            {/* CARD 7: Tanda Tangan Digital */}
                            <div className="g-card" style={{ marginTop: '12px' }}>
                                <label className="g-question-title" style={{ marginBottom: '8px' }}>
                                    Tanda Tangan Digital <span className="g-required-indicator">*</span>
                                </label>
                                <p style={{ fontSize: '12px', color: '#5f6368', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                                    Bubuhkan tanda tangan Anda pada area di bawah ini sebagai bukti validitas laporan.
                                </p>
                                <div style={{ border: '1px solid #dadce0', borderRadius: '4px', overflow: 'hidden' }}>
                                    <SignaturePad
                                        onSave={(val) => setData('signature', val)}
                                        onClear={() => setData('signature', '')}
                                    />
                                </div>
                                {errors.signature && (
                                    <div style={errorStyle}>
                                        <i className="fa-solid fa-circle-exclamation"></i> {errors.signature}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons Section */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 4px' }}>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="g-submit-btn"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setData({
                                            name: '',
                                            email: '',
                                            unit: '',
                                            category: '',
                                            description: '',
                                            signature: '',
                                        });
                                    }}
                                    className="g-clear-btn"
                                >
                                    Kosongkan formulir
                                </button>
                            </div>

                        </form>
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
