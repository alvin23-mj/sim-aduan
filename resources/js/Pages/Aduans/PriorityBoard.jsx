import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const PRIORITIES = [
    { id: 'ringan', label: 'Ringan', color: '#10B981', bg: '#F0FDF4', icon: 'fa-leaf' },
    { id: 'sedang', label: 'Sedang', color: '#D97706', bg: '#FFFBEB', icon: 'fa-bolt' },
    { id: 'berat', label: 'Berat', color: '#EF4444', bg: '#FEF2F2', icon: 'fa-fire' },
];

export default function PriorityBoard({ aduans }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const formatDuration = (startedAt, aduan) => {
        if (aduan && aduan.frozen_minutes !== null && aduan.frozen_minutes !== undefined) {
            return `${aduan.frozen_minutes}m`;
        }
        if (!startedAt) return '-';
        const start = new Date(startedAt);
        const diff = Math.floor((currentTime - start) / 1000); // in seconds
        
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        
        if (h > 0) return `${h}j ${m}m`;
        return `${m}m`;
    };

    const isOverdue = (aduan) => {
        if (aduan.priority_reason) return false;
        if (!aduan.started_working_at) return false;
        const start = new Date(aduan.started_working_at);
        const minutes = (currentTime - start) / 60000;
        const hours = minutes / 60;
        
        if (aduan.priority === 'ringan' && minutes >= 30) return true;
        if (aduan.priority === 'sedang' && hours >= 48) return true;
        if (aduan.priority === 'berat' && hours >= 168) return true;
        return false;
    };

    const getColumnAduans = (pId) => {
        return aduans.filter(a => a.priority === pId);
    };

    return (
        <AdminLayout title="Prioritas Pengerjaan">
            <Head title="Prioritas Pengerjaan - SIM Aduan" />

            <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 160px)', width: '100%', overflowX: 'auto', paddingBottom: '10px' }}>
                {PRIORITIES.map(p => (
                    <div key={p.id} style={{
                        flex: 1,
                        minWidth: '340px',
                        background: '#F1F5F9',
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #E2E8F0',
                    }}>
                        {/* Header Kolom */}
                        <div style={{
                            padding: '20px',
                            borderBottom: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'transparent',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontWeight: '400', color: '#1E293B', fontSize: '18px', letterSpacing: '-0.01em' }}>{p.label}</span>
                            </div>
                            <span style={{
                                color: '#64748B',
                                fontSize: '14px',
                                fontWeight: '400'
                            }}>
                                {getColumnAduans(p.id).length}
                            </span>
                        </div>

                        {/* List Item */}
                        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {getColumnAduans(p.id).map(aduan => {
                                const overdue = isOverdue(aduan);
                                return (
                                    <div
                                        key={aduan.id}
                                        onClick={() => router.get(`/aduan/${aduan.id}`)}
                                        className="card-hoverable"
                                        style={{
                                            background: '#fff',
                                            padding: '18px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                            <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '400', lineHeight: '1.4' }}>
                                                {aduan.ticket_number}
                                                <span style={{ margin: '0 8px', color: '#E2E8F0' }}>|</span>
                                                <span style={{ color: '#64748B' }}>{aduan.name}</span>
                                                {aduan.unit && (
                                                    <>
                                                        <span style={{ margin: '0 8px', color: '#E2E8F0' }}>|</span>
                                                        <span style={{ color: '#64748B' }}>{aduan.unit}</span>
                                                    </>
                                                )}
                                            </div>
                                            <div style={{ 
                                                fontSize: '14px', 
                                                fontWeight: '400', 
                                                color: overdue ? '#EF4444' : '#2563EB',
                                                background: overdue ? '#FEF2F2' : '#EFF6FF',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                {overdue && <i className="fa-solid fa-triangle-exclamation"></i>}
                                                {formatDuration(aduan.started_working_at, aduan)}
                                            </div>
                                        </div>

                                        <div style={{ fontWeight: '400', color: '#1E293B', marginBottom: '10px', fontSize: '18px', lineHeight: '1.5' }}>
                                            <div style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {aduan.description}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {aduan.category && (
                                                <span style={{
                                                    fontSize: '14px',
                                                    padding: '3px 10px',
                                                    borderRadius: '4px',
                                                    background: '#EFF6FF',
                                                    color: '#2563EB',
                                                    fontWeight: '400',
                                                    display: 'inline-block'
                                                }}>
                                                    {aduan.category}
                                                </span>
                                            )}
                                            {overdue && (
                                                <span style={{ 
                                                    fontSize: '14px', 
                                                    padding: '3px 10px', 
                                                    borderRadius: '4px', 
                                                    background: '#FEF2F2', 
                                                    color: '#EF4444', 
                                                    fontWeight: '400' 
                                                }}>
                                                    Overdue
                                                </span>
                                            )}
                                            {aduan.priority_reason && (
                                                <span style={{ 
                                                    fontSize: '14px', 
                                                    padding: '3px 10px', 
                                                    borderRadius: '4px', 
                                                    background: '#F0FDF4', 
                                                    color: '#166534', 
                                                    fontWeight: '400',
                                                    display: 'inline-block',
                                                    maxWidth: '220px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                                title={`Alasan: ${aduan.priority_reason}`}>
                                                    Alasan: {aduan.priority_reason}
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ borderTop: '1px solid #F1F5F9', margin: '14px 0 16px' }}></div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <div style={{ fontSize: '14px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>{aduan.validator || '-'}</span>
                                                <span style={{ color: '#E2E8F0' }}>|</span>
                                                <span>{aduan.technician || '-'}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {aduan.priority !== 'ringan' && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            let reason = '';
                                                            if (aduan.priority === 'sedang') {
                                                                reason = prompt('Masukkan alasan memindahkan kembali ke prioritas Ringan (agar tidak dianggap Overdue):');
                                                                if (reason === null) return; // User cancelled
                                                                if (!reason.trim()) {
                                                                    alert('Alasan harus diisi!');
                                                                    return;
                                                                }
                                                            }
                                                            router.patch(`/aduan/${aduan.id}`, { 
                                                                priority: aduan.priority === 'berat' ? 'sedang' : 'ringan',
                                                                is_manual_priority: true,
                                                                priority_reason: reason || null
                                                            });
                                                        }}
                                                        className="btn-action-hover"
                                                        title="Turunkan Prioritas"
                                                        style={{ 
                                                            background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#64748B', 
                                                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer', borderRadius: '4px' 
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-chevron-left" style={{ fontSize: '12px' }}></i>
                                                    </button>
                                                )}
                                                {aduan.priority !== 'berat' && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.patch(`/aduan/${aduan.id}`, { 
                                                                priority: aduan.priority === 'ringan' ? 'sedang' : 'berat',
                                                                is_manual_priority: true 
                                                            });
                                                        }}
                                                        className="btn-action-hover"
                                                        title="Naikkan Prioritas"
                                                        style={{ 
                                                            background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#64748B', 
                                                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer', borderRadius: '4px' 
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    className="btn-action-hover"
                                                    style={{ 
                                                        background: '#F8FAFC', 
                                                        border: '1px solid #E2E8F0', 
                                                        color: '#64748B', 
                                                        width: '32px', 
                                                        height: '32px', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        borderRadius: '4px'
                                                    }}
                                                >
                                                    <i className="fa-regular fa-comment-dots" style={{ fontSize: '14px' }}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .card-hoverable {
                    border-radius: 0 !important;
                    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out !important;
                }
                .card-hoverable:hover {
                    background: #fff !important;
                    transform: translateY(-4px) !important;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
                }
                .btn-action-hover {
                    transition: all 0.15s ease-in-out !important;
                }
                .btn-action-hover:hover {
                    background: #EFF6FF !important;
                    color: #2563EB !important;
                    border-color: #BFDBFE !important;
                }
            `}</style>
        </AdminLayout>
    );
}
