import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F0F4F9',
            position: 'relative',
            overflow: 'hidden',
            padding: '24px',
            fontFamily: "'Telex', sans-serif",
            boxSizing: 'border-box'
        }}>
            {/* Soft decorative background circles matching Welcome Page aesthetics */}
            <div style={{
                position: 'absolute',
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0) 70%)',
                top: '-150px',
                left: '-150px',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                width: '550px',
                height: '550px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, rgba(37,99,235,0) 70%)',
                bottom: '-200px',
                right: '-150px',
                pointerEvents: 'none'
            }} />

            <div style={{
                width: '100%',
                maxWidth: '460px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '40px 32px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden'
                        }}>
                            <img src="/images/logo_rsud.jpeg" alt="RSUD Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ width: '1px', height: '28px', background: '#E2E8F0', margin: '0 4px' }}></div>
                        <span style={{ fontSize: '22px', fontWeight: '400', color: '#1E293B', letterSpacing: '-0.3px', fontFamily: "'Telex', sans-serif" }}>
                            SIM Aduan
                        </span>
                    </Link>
                    <p style={{ margin: '12px 0 0', fontSize: '14px', color: '#64748B', fontWeight: '400', lineHeight: '1.4' }}>
                        Sistem Informasi Manajemen Aduan & Layanan Teknis
                    </p>
                </div>

                <div className="guest-content-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
}
