import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { playSynthesizedAlarm, stopSynthesizedAlarm } from '@/Components/AlarmSynth';
import SignaturePad from '@/Components/SignaturePad';

const baseStyle = {
    fontFamily: "'Telex', sans-serif",
    fontSize: '14px',
};

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'fa-solid fa-gauge-high' },
    { href: '/kanban', label: 'Proses Pengerjaan', icon: 'fa-solid fa-columns' },
    { href: '/prioritas', label: 'Prioritas Pengerjaan', icon: 'fa-solid fa-layer-group' },
    { href: '/reports', label: 'Laporan', icon: 'fa-solid fa-file-export' },
    { href: '/berita-acara', label: 'Berita Acara', icon: 'fa-solid fa-file-contract' },
    { href: '/technicians', label: 'Manajemen Teknisi', icon: 'fa-solid fa-user-gear' },
    { href: '/users', label: 'Manajemen Pelapor', icon: 'fa-solid fa-users-gear' },
    { href: '/categories', label: 'Manajemen Kategori', icon: 'fa-solid fa-tags' },
    { href: '/alarm-settings', label: 'Pengaturan Alarm', icon: 'fa-solid fa-bell' },
    { href: '/pelapor/riwayat', label: 'Riwayat Laporan', icon: 'fa-solid fa-clock-rotate-left' },
    { href: '/pelapor/buat-aduan', label: 'Buat Aduan Baru', icon: 'fa-solid fa-circle-plus' },
];

export default function AdminLayout({ children, title }) {
    const currentPath = window.location.pathname;
    const user = usePage().props.auth.user;
    const userRole = user?.role || 'admin';
    const filteredNavItems = navItems.filter((item) => {
        if (userRole === 'admin') {
            return !['/pelapor/riwayat', '/pelapor/buat-aduan'].includes(item.href);
        }
        if (userRole === 'teknisi') {
            return ['/dashboard', '/kanban', '/prioritas', '/reports', '/berita-acara'].includes(item.href);
        }
        if (userRole === 'pelapor') {
            return ['/dashboard', '/pelapor/riwayat', '/pelapor/buat-aduan'].includes(item.href);
        }
        return true;
    });

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const isManagementActive = ['/technicians', '/users', '/categories'].includes(currentPath);
    const [isManagementOpen, setIsManagementOpen] = useState(isManagementActive);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [toast, setToast] = useState(null);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [technicianSignature, setTechnicianSignature] = useState(user?.technician?.signature || '');

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) setSidebarOpen(false);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (user?.technician?.signature) {
            setTechnicianSignature(user.technician.signature);
        }
    }, [user?.technician?.signature]);

    const handleSaveSignature = async (sigBase64) => {
        try {
            const res = await fetch('/profile/signature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken()
                },
                body: JSON.stringify({ signature: sigBase64 })
            });
            const data = await res.json();
            if (data.success) {
                setTechnicianSignature(sigBase64);
                window.showToast?.('Tanda tangan Anda berhasil disimpan!', 'success');
                setIsSignatureModalOpen(false);
            } else {
                window.showToast?.(data.message || 'Gagal menyimpan tanda tangan.', 'error');
            }
        } catch (err) {
            console.error("Error saving signature:", err);
            window.showToast?.('Terjadi kesalahan saat menyimpan tanda tangan.', 'error');
        }
    };

    const handleClearSignature = () => {
        setTechnicianSignature('');
    };

    const { flash } = usePage().props;

    useEffect(() => {
        window.showToast = (message, type = 'success') => {
            // Silently do nothing, toasts are disabled
        };

        return () => {
            window.showToast = null;
        };
    }, []);

    useEffect(() => {
        // Flash messages no longer trigger toast
    }, [flash]);


    const getCsrfToken = () => {
        const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
        if (match) return decodeURIComponent(match[2]);
        return null;
    };

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await fetch(`/api/notifications/${id}/read`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken() 
                }
            });
            fetchNotifications();
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await fetch('/api/notifications/read-all', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken() 
                }
            });
            fetchNotifications();
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const handleDeleteNotification = async (id, e) => {
        e.stopPropagation();
        try {
            await fetch(`/api/notifications/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken() 
                }
            });
            fetchNotifications();
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    const handleClearAll = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus semua riwayat notifikasi?")) return;
        try {
            await fetch('/api/notifications/clear-all', {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken() 
                }
            });
            fetchNotifications();
        } catch (err) {
            console.error("Failed to clear notifications:", err);
        }
    };

    // Auto close profile and notifications dropdowns on window clicks
    useEffect(() => {
        const closeDropdowns = () => {
            setProfileMenuOpen(false);
            setNotificationsOpen(false);
        };
        window.addEventListener('click', closeDropdowns);
        return () => window.removeEventListener('click', closeDropdowns);
    }, []);

    // Alarm Background Poller States
    const [alertData, setAlertData] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const lastTriggeredIdsRef = useRef([]);

    useEffect(() => {
        const checkNewAduans = async () => {
            // Also fetch notifications on each tick
            fetchNotifications();

            if (userRole !== 'admin') {
                stopSynthesizedAlarm();
                setAlertData(null);
                return;
            }

            const enabled = localStorage.getItem('alarm_enabled') !== 'false';
            if (!enabled) {
                stopSynthesizedAlarm();
                setAlertData(null);
                return;
            }

            const ringtone = localStorage.getItem('alarm_ringtone') || 'beep';
            const duration = parseInt(localStorage.getItem('alarm_duration') || '10', 10);
            const delay = parseInt(localStorage.getItem('alarm_delay') || '0', 10);

            try {
                const res = await fetch('/api/new-aduans');
                const data = await res.json();
                const pendingAduans = data.new_aduans || [];

                if (pendingAduans.length === 0) {
                    stopSynthesizedAlarm();
                    setAlertData(null);
                    lastTriggeredIdsRef.current = [];
                    setIsMuted(false);
                    return;
                }

                // Filter based on delayMinutes (created_at older than delay)
                const now = new Date();
                const triggeringAduans = pendingAduans.filter(aduan => {
                    const ageMinutes = (now - new Date(aduan.created_at)) / 60000;
                    return ageMinutes >= delay;
                });

                if (triggeringAduans.length > 0) {
                    const triggeringIds = triggeringAduans.map(a => a.id);
                    const hasNewIds = triggeringIds.some(id => !lastTriggeredIdsRef.current.includes(id));

                    if (hasNewIds) {
                        setIsMuted(false);
                        lastTriggeredIdsRef.current = triggeringIds;
                        playSynthesizedAlarm(ringtone, duration);
                    }

                    setAlertData({
                        count: triggeringAduans.length,
                        delay: delay
                    });
                } else {
                    stopSynthesizedAlarm();
                    setAlertData(null);
                }
            } catch (err) {
                console.error("Failed to fetch pending complaints:", err);
            }
        };

        checkNewAduans();
        const pollInterval = setInterval(checkNewAduans, 30000);

        return () => {
            clearInterval(pollInterval);
            stopSynthesizedAlarm();
        };
    }, []);

    const handleMute = () => {
        stopSynthesizedAlarm();
        setIsMuted(true);
    };

    const handleSidebarToggle = () => {
        setSidebarOpen(prev => !prev);
    };

    const closeSidebarOnMobile = () => {
        if (isMobile) setSidebarOpen(false);
    };

    return (
        <div style={{ ...baseStyle, display: 'flex', height: '100vh', background: '#F1F5F9', overflow: 'hidden' }}>
            {/* Mobile Backdrop */}
            {isMobile && (
                <div
                    className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`admin-sidebar ${isMobile ? (sidebarOpen ? 'sidebar-open' : '') : ''}`}
                style={{
                    width: isMobile ? '260px' : (sidebarOpen ? '240px' : '64px'),
                    minWidth: isMobile ? '260px' : (sidebarOpen ? '240px' : '64px'),
                    background: '#fff',
                    borderRight: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: isMobile ? undefined : 'width 0.2s ease',
                    overflow: 'hidden',
                    zIndex: isMobile ? 30 : 10,
                    flexShrink: 0,
                }}>
                {/* Logo */}
                <div style={{
                    padding: '0 16px',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    height: '60px',
                    flexShrink: 0,
                }}>
                    <div style={{
                        width: '34px', height: '34px',
                        borderRadius: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden'
                    }}>
                        <img src="/images/logo_rsud.jpeg" alt="RSUD Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {(sidebarOpen || isMobile) && (
                        <>
                            <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 4px' }}></div>
                            <div>
                                <div style={{ fontWeight: '400', fontSize: '18px', color: '#1E293B', lineHeight: 1 }}>SIM Aduan</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '4px' }}>
                        {filteredNavItems.reduce((acc, item) => {
                            const isManagementItem = ['/technicians', '/users', '/categories'].includes(item.href);
                            
                            if (isManagementItem) {
                                if (!acc.some(i => i.isDropdownGroup)) {
                                    acc.push({
                                        isDropdownGroup: true,
                                        label: 'Manajemen Data',
                                        icon: 'fa-solid fa-folder-open',
                                        items: filteredNavItems.filter(i => ['/technicians', '/users', '/categories'].includes(i.href))
                                    });
                                }
                            } else {
                                acc.push(item);
                            }
                            return acc;
                        }, []).map((item) => {
                            if (item.isDropdownGroup) {
                                if (item.items.length === 0) return null;
                                const isGroupActive = item.items.some(subItem => currentPath === subItem.href || currentPath.startsWith(subItem.href));
                                return (
                                    <div key="management-dropdown" style={{ marginBottom: '2px' }}>
                                        {/* Dropdown Header */}
                                        <button
                                            onClick={() => setIsManagementOpen(!isManagementOpen)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                gap: '10px',
                                                padding: '12px 10px',
                                                borderRadius: '4px',
                                                background: isGroupActive && !isManagementOpen ? '#EFF6FF' : 'transparent',
                                                color: isGroupActive ? '#2563EB' : '#475569',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontFamily: "'Telex', sans-serif",
                                                textAlign: 'left',
                                                transition: 'background 0.15s',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                outline: 'none',
                                            }}
                                            onMouseEnter={e => {
                                                if (!(isGroupActive && !isManagementOpen)) e.currentTarget.style.background = '#F1F5F9';
                                            }}
                                            onMouseLeave={e => {
                                                if (!(isGroupActive && !isManagementOpen)) e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <i className={item.icon} style={{ fontSize: '14px', width: '18px', textAlign: 'center', flexShrink: 0, color: isGroupActive ? '#2563EB' : '#64748B' }}></i>
                                                {(sidebarOpen || isMobile) && <span style={{ fontWeight: isGroupActive ? '600' : '400' }}>{item.label}</span>}
                                            </div>
                                            {(sidebarOpen || isMobile) && (
                                                <i className="fa-solid fa-chevron-down" style={{
                                                    fontSize: '11px',
                                                    transition: 'transform 0.2s ease',
                                                    transform: isManagementOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    color: '#94A3B8'
                                                }}></i>
                                            )}
                                        </button>

                                        {/* Dropdown Content */}
                                        {isManagementOpen && (
                                            <div style={{
                                                paddingLeft: (sidebarOpen || isMobile) ? '16px' : '0px',
                                                marginTop: '2px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px',
                                                transition: 'all 0.2s ease'
                                            }}>
                                                {item.items.map((subItem) => {
                                                    const isSubActive = currentPath === subItem.href || currentPath.startsWith(subItem.href);
                                                    return (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            onClick={closeSidebarOnMobile}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                padding: '10px 12px',
                                                                borderRadius: '4px',
                                                                background: isSubActive ? '#2563EB' : 'transparent',
                                                                color: isSubActive ? '#fff' : '#64748B',
                                                                textDecoration: 'none',
                                                                fontSize: '14px',
                                                                transition: 'background 0.15s',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                            }}
                                                            onMouseEnter={e => {
                                                                if (!isSubActive) e.currentTarget.style.background = '#F8FAFC';
                                                            }}
                                                            onMouseLeave={e => {
                                                                if (!isSubActive) e.currentTarget.style.background = 'transparent';
                                                            }}
                                                        >
                                                            <i className={subItem.icon} style={{ fontSize: '12px', width: '16px', textAlign: 'center', flexShrink: 0 }}></i>
                                                            {(sidebarOpen || isMobile) && <span>{subItem.label.replace('Manajemen ', '')}</span>}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            const isActive = currentPath === item.href || (item.href !== '/dashboard' && currentPath.startsWith(item.href));
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={closeSidebarOnMobile}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '12px 10px',
                                        borderRadius: '4px',
                                        marginBottom: '2px',
                                        background: isActive ? '#2563EB' : 'transparent',
                                        color: isActive ? '#fff' : '#475569',
                                        textDecoration: 'none',
                                        transition: 'background 0.15s',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) e.currentTarget.style.background = '#F1F5F9';
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <i className={item.icon} style={{ fontSize: '14px', width: '18px', textAlign: 'center', flexShrink: 0 }}></i>
                                    {(sidebarOpen || isMobile) && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
                {/* Logout Button */}
                <div style={{
                    padding: '12px 10px',
                    borderTop: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        onClick={closeSidebarOnMobile}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 10px',
                            width: '100%',
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontFamily: "'Telex', sans-serif",
                            textAlign: 'left',
                            borderRadius: '4px',
                            transition: 'background 0.15s',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = '#FEF2F2';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <i className="fa-solid fa-right-from-bracket" style={{ fontSize: '14px', width: '18px', textAlign: 'center', flexShrink: 0 }}></i>
                        {(sidebarOpen || isMobile) && <span>Keluar</span>}
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="admin-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                {/* Floating Alarm Notification Alert (Bottom Right) */}
                {userRole === 'admin' && alertData && (
                    <div style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        background: 'rgba(255, 241, 242, 0.95)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid #FDA4AF',
                        borderRadius: '8px',
                        padding: '20px',
                        width: '380px',
                        maxWidth: 'calc(100vw - 48px)',
                        boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.15), 0 10px 10px -5px rgba(239, 68, 68, 0.05)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        fontFamily: "'Telex', sans-serif",
                        animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: '#FFE4E6',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <i className="fa-solid fa-bell fa-bounce" style={{ color: '#EF4444', fontSize: '18px' }}></i>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#9F1239', marginBottom: '4px' }}>
                                    Aduan Baru Menunggu Validasi!
                                </div>
                                <div style={{ fontSize: '13px', color: '#9F1239', lineHeight: '1.4' }}>
                                    Ada <strong>{alertData.count}</strong> aduan belum divalidasi yang masuk lebih dari <strong>{alertData.delay}</strong> menit yang lalu!
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #FECDD3', paddingTop: '12px' }}>
                            {!isMuted && (
                                <button
                                    onClick={handleMute}
                                    style={{
                                        background: '#FFE4E6',
                                        border: '1px solid #FDA4AF',
                                        color: '#E11D48',
                                        padding: '8px 14px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        borderRadius: '4px',
                                        transition: 'background 0.15s',
                                        fontFamily: "'Telex', sans-serif"
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FECDD3'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#FFE4E6'}
                                >
                                    <i className="fa-solid fa-volume-xmark" style={{ marginRight: '6px' }}></i>
                                    Matikan Suara
                                </button>
                            )}
                            <Link
                                href="/kanban"
                                style={{
                                    background: '#2563EB',
                                    border: 'none',
                                    color: '#FFFFFF',
                                    padding: '8px 14px',
                                    fontSize: '12px',
                                    textDecoration: 'none',
                                    borderRadius: '4px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    transition: 'background 0.15s',
                                    fontFamily: "'Telex', sans-serif"
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                                onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
                            >
                                <i className="fa-solid fa-columns" style={{ marginRight: '6px' }}></i>
                                Buka Papan Proses
                            </Link>
                        </div>
                    </div>
                )}
                {/* Header */}
                <header className="admin-header" style={{
                    background: '#fff',
                    borderBottom: '1px solid #E2E8F0',
                    padding: '0 24px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={handleSidebarToggle}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#64748B', padding: '6px', borderRadius: '4px',
                                display: 'flex', alignItems: 'center',
                            }}
                        >
                            <i className="fa-solid fa-bars" style={{ fontSize: '16px' }}></i>
                        </button>
                        {title && (
                            <span style={{ fontSize: isMobile ? '16px' : '21px', fontWeight: 'normal', color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '140px' : 'none' }}>
                                {title}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

                        {userRole === 'teknisi' && (
                            <button
                                onClick={() => setIsSignatureModalOpen(true)}
                                title="Gambar Tanda Tangan Saya"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '7px 10px',
                                    background: '#2563EB',
                                    color: '#FFFFFF',
                                    borderRadius: '4px',
                                    border: 'none',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s',
                                    fontFamily: "'Telex', sans-serif"
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                                onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
                            >
                                <i className="fa-solid fa-signature" style={{ fontSize: '13px', color: '#FFFFFF' }}></i>
                                <span className="header-btn-label">Ttd Saya</span>
                            </button>
                        )}

                        {/* Notification Bell Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setNotificationsOpen(!notificationsOpen);
                                    setProfileMenuOpen(false); // close profile menu
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    color: '#64748B',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '4px',
                                    outline: 'none',
                                }}
                            >
                                <i className="fa-solid fa-bell" style={{ fontSize: '18px', color: unreadCount > 0 ? '#2563EB' : '#64748B' }}></i>
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '2px',
                                        right: '2px',
                                        background: '#EF4444',
                                        color: '#fff',
                                        borderRadius: '4px',
                                        width: '16px',
                                        height: '16px',
                                        fontSize: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown Menu Panel */}
                            {notificationsOpen && (
                                <div 
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 12px)',
                                        right: '-10px',
                                        background: '#fff',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '4px',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        zIndex: 100,
                                        width: '380px',
                                        maxWidth: 'calc(100vw - 20px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Panel Header */}
                                    <div style={{
                                        padding: '14px 16px',
                                        borderBottom: '1px solid #F1F5F9',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: '#F8FAFC',
                                    }}>
                                        <span style={{ fontSize: '14px', color: '#1E293B' }}>Notifikasi</span>
                                        {unreadCount > 0 && (
                                            <button 
                                                onClick={handleMarkAllAsRead}
                                                style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                                            >
                                                Tandai semua dibaca
                                            </button>
                                        )}
                                    </div>

                                    {/* Panel Body (Scrollable List) */}
                                    <div className="hide-scrollbar" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => {
                                                const isUnread = !notif.read_at;
                                                
                                                // Icon config based on type
                                                let iconClass = "fa-solid fa-bell";
                                                let iconBg = "#EFF6FF";
                                                let iconColor = "#2563EB";

                                                if (notif.type === 'new_aduan') {
                                                    iconClass = "fa-solid fa-plus-circle";
                                                    iconBg = "#F0FDF4";
                                                    iconColor = "#10B981";
                                                } else if (notif.type === 'status_change') {
                                                    iconClass = "fa-solid fa-circle-right";
                                                    iconBg = "#FFFBEB";
                                                    iconColor = "#D97706";
                                                } else if (notif.type === 'technician_assigned') {
                                                    iconClass = "fa-solid fa-user-gear";
                                                    iconBg = "#F5F3FF";
                                                    iconColor = "#8B5CF6";
                                                } else if (notif.type === 'priority_change') {
                                                    iconClass = "fa-solid fa-triangle-exclamation";
                                                    iconBg = "#FEF2F2";
                                                    iconColor = "#EF4444";
                                                }

                                                return (
                                                    <div 
                                                        key={notif.id}
                                                        onClick={() => {
                                                            if (isUnread) handleMarkAsRead(notif.id);
                                                            setNotificationsOpen(false);
                                                            if (notif.aduan_id) {
                                                                if (userRole === 'pelapor') {
                                                                    window.location.href = `/pelapor/riwayat`;
                                                                } else {
                                                                    window.location.href = `/kanban`;
                                                                }
                                                            }
                                                        }}
                                                        style={{
                                                            padding: '14px 16px',
                                                            borderBottom: '1px solid #F1F5F9',
                                                            display: 'flex',
                                                            gap: '12px',
                                                            background: isUnread ? '#F0F7FF' : '#fff',
                                                            cursor: 'pointer',
                                                            position: 'relative',
                                                            transition: 'background 0.15s',
                                                        }}
                                                        onMouseEnter={e => e.currentTarget.style.background = isUnread ? '#E0EFFF' : '#F8FAFC'}
                                                        onMouseLeave={e => e.currentTarget.style.background = isUnread ? '#F0F7FF' : '#fff'}
                                                    >
                                                        {/* Left Icon */}
                                                        <div style={{
                                                            width: '36px',
                                                            height: '36px',
                                                            borderRadius: '4px',
                                                            background: iconBg,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}>
                                                            <i className={iconClass} style={{ color: iconColor, fontSize: '16px' }}></i>
                                                        </div>

                                                        {/* Text Content */}
                                                        <div style={{ flex: 1, paddingRight: '20px' }}>
                                                            <div style={{ fontSize: '14px', color: '#1E293B', marginBottom: '3px', fontWeight: isUnread ? 'bold' : 'normal' }}>
                                                                {notif.title}
                                                            </div>
                                                            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.4' }}>
                                                                {notif.message}
                                                            </div>
                                                            <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '6px' }}>
                                                                {new Date(notif.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={(e) => handleDeleteNotification(notif.id, e)}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '12px',
                                                                top: '12px',
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#94A3B8',
                                                                cursor: 'pointer',
                                                                padding: '4px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                opacity: 0.6,
                                                                borderRadius: '4px',
                                                            }}
                                                            onMouseEnter={e => {
                                                                e.currentTarget.style.opacity = '1';
                                                                e.currentTarget.style.color = '#EF4444';
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.currentTarget.style.opacity = '0.6';
                                                                e.currentTarget.style.color = '#94A3B8';
                                                            }}
                                                        >
                                                            <i className="fa-regular fa-trash-can" style={{ fontSize: '12px' }}></i>
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={{ padding: '40px 16px', textAlign: 'center', color: '#94A3B8' }}>
                                                <i className="fa-regular fa-bell-slash" style={{ fontSize: '28px', color: '#CBD5E1', marginBottom: '12px', display: 'block' }}></i>
                                                <span style={{ fontSize: '13px' }}>Tidak ada riwayat notifikasi</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Panel Footer */}
                                    {notifications.length > 0 && (
                                        <div style={{
                                            padding: '10px 16px',
                                            borderTop: '1px solid #F1F5F9',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            background: '#F8FAFC',
                                        }}>
                                            <button
                                                onClick={handleClearAll}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#EF4444',
                                                    fontSize: '13px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: 0
                                                }}
                                            >
                                                <i className="fa-regular fa-trash-can"></i>
                                                Bersihkan Semua Notifikasi
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }}></div>

                        <style>{`
                            @keyframes pulseRed {
                                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                                100% { transform: scale(1.1); box-shadow: 0 0 0 4px rgba(239, 68, 68, 0); }
                            }
                            @keyframes toastSlideIn {
                                from {
                                    transform: translateY(-20px);
                                    opacity: 0;
                                }
                                to {
                                    transform: translateY(0);
                                    opacity: 1;
                                }
                            }
                        `}</style>

                        {/* User Profile Dropdown (No Arrow) */}
                        <div style={{ position: 'relative' }}>
                            <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setProfileMenuOpen(!profileMenuOpen);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    padding: '6px 8px',
                                    userSelect: 'none',
                                    borderRadius: '4px',
                                    transition: 'background 0.15s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{
                                    width: '32px', height: '32px',
                                    background: '#EFF6FF',
                                    borderRadius: '4px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    border: '1px solid #BFDBFE',
                                }}>
                                    <i className="fa-solid fa-user" style={{ fontSize: '13px', color: '#2563EB' }}></i>
                                </div>
                                <div className="header-user-name" style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '14px', color: '#1E293B', fontWeight: '400', lineHeight: '1.2' }}>
                                        {user?.name}
                                    </div>
                                </div>
                            </div>

                            {/* Dropdown Menu Popup (No Caret/Arrow) */}
                            {profileMenuOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 6px)',
                                    right: 0,
                                    background: '#fff',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '4px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                    zIndex: 50,
                                    minWidth: '150px',
                                    padding: '4px 0',
                                    animation: 'fadeInShort 0.15s ease-out'
                                }}>
                                    {/* Link ke Profil */}
                                    <Link
                                        href="/profile"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 14px',
                                            fontSize: '14px',
                                            color: '#334155',
                                            textDecoration: 'none',
                                            transition: 'background 0.15s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <i className="fa-solid fa-user" style={{ fontSize: '14px', width: '16px', color: '#64748B' }}></i>
                                        Profil
                                    </Link>

                                    {/* Pembatas */}
                                    <div style={{ height: '1px', background: '#F1F5F9', margin: '4px 0' }}></div>

                                    {/* Link Keluar */}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 14px',
                                            width: '100%',
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '14px',
                                            color: '#EF4444',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontFamily: "'Telex', sans-serif",
                                            transition: 'background 0.15s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <i className="fa-solid fa-right-from-bracket" style={{ fontSize: '14px', width: '16px', color: '#EF4444' }}></i>
                                        Keluar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="admin-content-area" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {children}
                </main>
            </div>
            {/* Toast rendering removed */}
            {isSignatureModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 10000, padding: '20px'
                }}>
                    <div style={{
                        background: '#fff', width: '100%', maxWidth: '450px',
                        borderRadius: '4px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
                        fontFamily: "'Telex', sans-serif"
                    }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1E293B' }}>
                                Tanda Tangan Digital Saya
                            </h3>
                            <button onClick={() => setIsSignatureModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '8px', fontWeight: '500' }}>Tanda Tangan Saat Ini</label>
                                {technicianSignature ? (
                                    <div style={{ position: 'relative', border: '1px solid #E2E8F0', padding: '10px', background: '#F8FAFC', textAlign: 'center', borderRadius: '4px' }}>
                                        <img 
                                            src={technicianSignature} 
                                            alt="Tanda Tangan Saya" 
                                            style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} 
                                        />
                                        <button
                                            type="button"
                                            onClick={handleClearSignature}
                                            style={{
                                                position: 'absolute', top: '8px', right: '8px',
                                                background: '#FEF2F2', border: '1px solid #FEE2E2',
                                                color: '#EF4444', fontSize: '11px', padding: '4px 10px',
                                                cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold'
                                            }}
                                        >
                                            Hapus & Buat Baru
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <SignaturePad 
                                            onSave={(sig) => handleSaveSignature(sig)}
                                            onClear={() => handleClearSignature()}
                                        />
                                        <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px', margin: 0, textAlign: 'center' }}>
                                            Gunakan kursor atau layar sentuh untuk menandatangani, lalu klik **Simpan**.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsSignatureModalOpen(false)}
                                    style={{ flex: 1, padding: '10px', background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569', cursor: 'pointer', fontSize: '14px', borderRadius: '4px', fontWeight: 'bold' }}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
