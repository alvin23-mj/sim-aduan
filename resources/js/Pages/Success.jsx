import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Footer from '../Components/Footer';

const baseStyle = {
    fontFamily: "'Telex', sans-serif",
    fontSize: '14px',
};

export default function Success({ ticket }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Aduan Terkirim - SIM Aduan" />
            <div style={{ ...baseStyle, minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
                <style>{`
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
                `}</style>

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
                                    Daftar
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
                    <div style={{
                        background: '#fff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        padding: '48px 40px',
                        maxWidth: '480px',
                        width: '100%',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '64px', height: '64px',
                            background: '#EFF6FF',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <i className="fa-solid fa-circle-check" style={{ fontSize: '28px', color: '#2563EB' }}></i>
                        </div>
                        <h1 style={{ fontSize: '20px', fontWeight: 'normal', color: '#1E293B', marginBottom: '8px' }}>
                            Aduan Berhasil Dikirim
                        </h1>
                        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: '1.6' }}>
                            Terima kasih telah menyampaikan aduan Anda. Tim kami akan segera menindaklanjuti.
                        </p>

                        {ticket && (
                            <div style={{
                                background: '#EFF6FF',
                                border: '1px solid #BFDBFE',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '24px',
                            }}>
                                <div style={{ fontSize: '12px', color: '#1D4ED8', marginBottom: '6px' }}>Nomor Tiket Aduan</div>
                                <div style={{ fontSize: '22px', fontWeight: 'normal', color: '#1E293B', letterSpacing: '0.05em' }}>
                                    {ticket}
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                                    Simpan nomor ini untuk memantau status aduan
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <Link
                                href="/"
                                style={{
                                    padding: '9px 20px',
                                    background: '#2563EB',
                                    color: '#fff',
                                    borderRadius: '7px',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: 'normal',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                }}
                            >
                                <i className="fa-solid fa-plus"></i>
                                Buat Aduan Baru
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Premium Footer */}
                <Footer />
            </div>
        </>
    );
}
