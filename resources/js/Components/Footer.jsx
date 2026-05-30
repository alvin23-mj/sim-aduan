import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Footer({ categories: initialCategories }) {
    const [categories, setCategories] = useState(initialCategories || []);

    useEffect(() => {
        if (!initialCategories || initialCategories.length === 0) {
            fetch('/api/categories/active')
                .then(res => res.json())
                .then(data => {
                    setCategories(data || []);
                })
                .catch(err => console.error('Error fetching active categories:', err));
        } else {
            setCategories(initialCategories);
        }
    }, [initialCategories]);

    // Filter categories that are active (is_active !== false/0)
    const activeCategories = categories.filter(c => c.is_active !== false && c.is_active !== 0 && c.is_active !== '0');

    return (
        <footer style={{
            background: '#0F172A',
            color: '#94A3B8',
            padding: '64px 24px 32px',
            fontFamily: "'Telex', sans-serif",
            borderTop: '1px solid #1E293B',
            width: '100%',
            boxSizing: 'border-box',
        }}>
            <style>
                {`
                    .footer-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 40px;
                        margin-bottom: 48px;
                        justify-items: center;
                    }
                    .footer-brand {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .footer-logo-wrapper {
                        width: 38px;
                        height: 38px;
                        border-radius: 8px;
                        background: #FFFFFF;
                        padding: 2px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    .footer-logo {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                    .footer-title {
                        font-size: 20px;
                        font-weight: bold;
                        color: #F1F5F9;
                    }
                    .footer-desc {
                        font-size: 14px;
                        line-height: 1.6;
                        color: #94A3B8;
                        margin: 0;
                    }
                    .footer-col {
                        display: flex;
                        flex-direction: column;
                        gap: 16px;
                    }
                    .footer-col-title {
                        font-size: 15px;
                        font-weight: 600;
                        color: #F1F5F9;
                        margin: 0;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .footer-list {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                    .footer-link {
                        font-size: 14px;
                        color: #94A3B8;
                        text-decoration: none;
                        transition: all 0.2s ease;
                        display: inline-flex;
                        align-items: center;
                    }
                    .footer-link:hover {
                        color: #3B82F6;
                        transform: translateX(4px);
                    }
                    .footer-bottom {
                        border-top: 1px solid #1E293B;
                        padding-top: 24px;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        align-items: center;
                        gap: 16px;
                        font-size: 14px;
                    }
                `}
            </style>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div className="footer-grid">
                    {/* Column 1: Brand & About */}
                    <div className="footer-col">
                        <div className="footer-brand">
                            <div className="footer-logo-wrapper">
                                <img src="/images/logo_rsud.jpeg" alt="RSUD Logo" className="footer-logo" />
                            </div>
                            <span className="footer-title">SIM Aduan</span>
                        </div>
                        <p className="footer-desc">
                            Sistem Informasi Manajemen Pengaduan IT RSUD Nganjuk terpadu untuk mendukung kelancaran operasional pelayanan kesehatan di seluruh unit kerja secara cepat, tanggap, dan profesional.
                        </p>
                    </div>

                    {/* Column 2: Tautan Pintar */}
                    <div className="footer-col">
                        <h3 className="footer-col-title">Tautan Pintar</h3>
                        <ul className="footer-list">
                            <li>
                                <Link href="/" className="footer-link">
                                    Beranda Utama
                                </Link>
                            </li>
                            <li>
                                <Link href="/buat-aduan" className="footer-link">
                                    Form Pengaduan
                                </Link>
                            </li>
                            <li>
                                <Link href="/lacak-aduan" className="footer-link">
                                    Tracking Aduan
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="footer-link">
                                    Portal Admin & Teknisi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Kategori Kendala */}
                    <div className="footer-col">
                        <h3 className="footer-col-title">Kategori Kendala</h3>
                        <ul className="footer-list">
                            {activeCategories.map(category => (
                                <li key={category.id}>
                                    <Link href={`/buat-aduan?category=${encodeURIComponent(category.name)}`} className="footer-link">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                            {activeCategories.length === 0 && (
                                <li style={{ fontSize: '14px', color: '#64748B', fontStyle: 'italic' }}>
                                    Tidak ada kategori aktif
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom Bar */}
                <div className="footer-bottom">
                    <span>
                        © {new Date().getFullYear()} <strong>SIM Aduan RSUD Nganjuk</strong>. Hak Cipta Dilindungi Undang-Undang.
                    </span>
                    <span style={{ color: '#64748B' }}>
                        Sub Bagian IT RSUD Nganjuk
                    </span>
                </div>
            </div>
        </footer>
    );
}
