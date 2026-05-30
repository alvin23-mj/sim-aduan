import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Pagination from '@/Components/Pagination';

const cardStyle = {
    background: '#fff',
    borderRadius: '4px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
};

const tableHeaderStyle = {
    padding: '12px 14px',
    textAlign: 'left',
    borderBottom: '1px solid #E2E8F0',
    fontSize: '14px',
    fontWeight: '400',
    color: '#64748B',
    background: '#F8FAFC',
    whiteSpace: 'nowrap'
};

const tableCellStyle = {
    padding: '12px 14px',
    borderBottom: '1px solid #E2E8F0',
    fontSize: '14px',
    color: '#1E293B',
    fontWeight: '400',
    whiteSpace: 'nowrap'
};

export default function Index({ aduan, filters = {}, categories = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [status, setStatus] = useState(filters.status || '');
    const [category, setCategory] = useState(filters.category || '');
    const [priority, setPriority] = useState(filters.priority || '');

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get('/reports', { 
                search: search,
                start_date: startDate, 
                end_date: endDate, 
                status: status,
                category: category,
                priority: priority,
            }, { preserveState: true, replace: true });
        }, 500);

        return () => clearTimeout(timer);
    }, [search, startDate, endDate, status, category, priority]);

    const getStatusStyle = (status) => {
        const styles = {
            'selesai': { bg: '#F0FDF4', text: '#10B981', label: 'Selesai' },
            'barang_rusak': { bg: '#FEF2F2', text: '#EF4444', label: 'Barang Rusak' },
            'diperbaiki_sendiri': { bg: '#F5F3FF', text: '#8B5CF6', label: 'Mandiri' },
        };
        return styles[status] || { bg: '#F1F5F9', text: '#64748B', label: status };
    };

    return (
        <AdminLayout title="Laporan Aduan">
            <Head title="Laporan Aduan - SIM Aduan" />

            <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <a 
                    href={`/reports/export?search=${search}&start_date=${startDate}&end_date=${endDate}&status=${status}&category=${category}&priority=${priority}`}
                    style={{
                        height: '40px',
                        boxSizing: 'border-box',
                        padding: '0 24px',
                        background: '#10B981',
                        color: '#fff',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '400',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        textDecoration: 'none'
                    }}
                >
                    <i className="fa-solid fa-file-excel"></i>
                    Ekspor
                </a>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                    <div style={{ width: '350px', maxWidth: '100%', position: 'relative' }}>
                        <i className="fa-solid fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }}></i>
                        <input 
                            type="text" 
                            placeholder="Kode Tiket, Pelapor, Unit, Barang..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ height: '40px', boxSizing: 'border-box', width: '100%', padding: '9px 12px 9px 35px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', fontFamily: 'Telex' }}
                        />
                    </div>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)}
                        style={{ height: '40px', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', fontFamily: 'Telex' }}
                    />
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)}
                        style={{ height: '40px', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', fontFamily: 'Telex' }}
                    />
                    <select 
                        value={priority} 
                        onChange={e => setPriority(e.target.value)}
                        style={{ height: '40px', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', background: '#fff', fontFamily: 'Telex', minWidth: '150px' }}
                    >
                        <option value="">Semua Prioritas</option>
                        <option value="ringan">Ringan</option>
                        <option value="sedang">Sedang</option>
                        <option value="berat">Berat</option>
                    </select>
                    <select 
                        value={category} 
                        onChange={e => setCategory(e.target.value)}
                        style={{ height: '40px', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', background: '#fff', fontFamily: 'Telex', minWidth: '150px' }}
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <select 
                        value={status} 
                        onChange={e => setStatus(e.target.value)}
                        style={{ height: '40px', boxSizing: 'border-box', padding: '9px 12px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', background: '#fff', fontFamily: 'Telex', minWidth: '180px' }}
                    >
                        <option value="">Semua Status</option>
                        <option value="selesai">Selesai</option>
                        <option value="barang_rusak">Barang Rusak</option>
                        <option value="diperbaiki_sendiri">Diperbaiki Sendiri</option>
                    </select>
                </div>
            </div>

            <div style={cardStyle}>
                <div className="hide-scrollbar" style={{ overflowX: 'auto' }}>
                    <table style={{ width: 'max-content', minWidth: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ ...tableHeaderStyle, width: '50px', textAlign: 'center' }}>No</th>
                                <th style={tableHeaderStyle}>Tanggal</th>
                                <th style={tableHeaderStyle}>Kode Aduan</th>
                                <th style={tableHeaderStyle}>Pelapor</th>
                                <th style={tableHeaderStyle}>Unit</th>
                                <th style={tableHeaderStyle}>Prioritas</th>
                                <th style={tableHeaderStyle}>Kategori</th>
                                <th style={tableHeaderStyle}>Deskripsi</th>
                                <th style={tableHeaderStyle}>Penyelesaian</th>
                                <th style={tableHeaderStyle}>Validator</th>
                                <th style={tableHeaderStyle}>Teknisi</th>
                                <th style={tableHeaderStyle}>Durasi</th>
                                <th style={tableHeaderStyle}>Status</th>
                                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aduan.data.length > 0 ? aduan.data.map((item, index) => {
                                const statusStyle = getStatusStyle(item.status);
                                const getPriorityColor = (p) => {
                                    const val = (p || '').toLowerCase();
                                    if (val === 'berat') return { bg: '#FEF2F2', text: '#EF4444' };
                                    if (val === 'sedang') return { bg: '#FFFBEB', text: '#D97706' };
                                    return { bg: '#F0FDF4', text: '#10B981' };
                                };
                                const pStyle = getPriorityColor(item.priority);
                                
                                const getDuration = (start, end) => {
                                    if (!start || !end) return '-';
                                    const diff = new Date(end) - new Date(start);
                                    if (diff < 0) return '-';
                                    const mins = Math.floor(diff / 60000);
                                    if (mins < 60) return `${mins} Menit`;
                                    
                                    const hours = Math.floor(mins / 60);
                                    const remainingMins = mins % 60;
                                    
                                    if (hours < 24) {
                                        if (remainingMins === 0) return `${hours} Jam`;
                                        return `${hours} Jam ${remainingMins} Menit`;
                                    }
                                    
                                    const days = Math.floor(hours / 24);
                                    const remainingHours = hours % 24;
                                    
                                    let result = `${days} Hari`;
                                    if (remainingHours > 0) result += ` ${remainingHours} Jam`;
                                    if (remainingMins > 0) result += ` ${remainingMins} Menit`;
                                    return result;
                                };
                                const duration = getDuration(item.created_at, item.updated_at);

                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td style={{ ...tableCellStyle, color: '#94A3B8', textAlign: 'center' }}>{((aduan.current_page - 1) * aduan.per_page) + (index + 1)}</td>
                                        <td style={tableCellStyle}>
                                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td style={{ ...tableCellStyle, color: '#1E293B' }}>{item.ticket_number}</td>
                                        <td style={tableCellStyle}>{item.name}</td>
                                        <td style={tableCellStyle}>{item.unit || '-'}</td>
                                        <td style={tableCellStyle}>
                                            <span 
                                                className="capitalize"
                                                style={{ 
                                                    fontSize: '14px', 
                                                    padding: '3px 10px', 
                                                    borderRadius: '4px', 
                                                    background: pStyle.bg, 
                                                    color: pStyle.text,
                                                    display: 'inline-block',
                                                    fontWeight: '400',
                                                }}
                                            >
                                                {item.priority || 'Ringan'}
                                            </span>
                                        </td>
                                        <td style={tableCellStyle}>
                                            {item.category && (
                                                <span style={{ 
                                                    fontSize: '14px', 
                                                    padding: '3px 10px', 
                                                    borderRadius: '4px', 
                                                    background: '#EFF6FF', 
                                                    color: '#2563EB',
                                                    display: 'inline-block',
                                                    fontWeight: '400'
                                                }}>
                                                    {item.category}
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ ...tableCellStyle, maxWidth: '250px', whiteSpace: 'normal', lineHeight: '1.4' }}>
                                            {item.description}
                                        </td>
                                        <td style={{ ...tableCellStyle, maxWidth: '250px', whiteSpace: 'normal', lineHeight: '1.4' }}>
                                            {item.damage_report || '-'}
                                        </td>
                                        <td style={tableCellStyle}>{item.validator || '-'}</td>
                                        <td style={tableCellStyle}>{item.technician || '-'}</td>
                                        <td style={tableCellStyle}>{duration}</td>
                                        <td style={tableCellStyle}>
                                            <span style={{
                                                padding: '3px 10px',
                                                background: statusStyle.bg,
                                                color: statusStyle.text,
                                                fontSize: '14px',
                                                borderRadius: '4px',
                                                display: 'inline-block',
                                                fontWeight: '400'
                                            }}>
                                                {statusStyle.label}
                                            </span>
                                        </td>
                                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button 
                                                    onClick={() => {
                                                        if (confirm(`Apakah Anda yakin ingin mengembalikan aduan ${item.ticket_number} ke Papan Proses (Sedang Pengerjaan)?`)) {
                                                            router.patch(`/aduan/${item.id}`, { status: 'sedang_pengerjaan' });
                                                        }
                                                    }}
                                                    title="Kembalikan ke Papan Proses"
                                                    style={{ 
                                                        width: '32px', height: '32px', padding: 0, borderRadius: '4px',
                                                        background: '#F1F5F9',
                                                        border: '1px solid #E2E8F0',
                                                        color: '#475569',
                                                        cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'all 0.15s'
                                                    }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.background = '#E2E8F0';
                                                        e.currentTarget.style.borderColor = '#CBD5E1';
                                                        e.currentTarget.style.color = '#0F172A';
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.background = '#F1F5F9';
                                                        e.currentTarget.style.borderColor = '#E2E8F0';
                                                        e.currentTarget.style.color = '#475569';
                                                    }}
                                                >
                                                    <i className="fa-solid fa-rotate-left" style={{ fontSize: '14px' }}></i>
                                                </button>
                                                {/* BLUE BUTTON - SPK Redirect */}
                                                <button 
                                                    onClick={() => router.get(`/aduan/${item.id}/spk`)}
                                                    title="Cetak Surat Perintah Kerja / SPK (Biru)"
                                                    style={{ 
                                                        width: '32px', height: '32px', padding: 0, borderRadius: '4px',
                                                        background: '#EFF6FF',
                                                        border: '1px solid #DBEAFE',
                                                        color: '#2563EB',
                                                        cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'all 0.15s'
                                                    }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.background = '#2563EB';
                                                        e.currentTarget.style.borderColor = '#2563EB';
                                                        e.currentTarget.style.color = '#fff';
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.background = '#EFF6FF';
                                                        e.currentTarget.style.borderColor = '#DBEAFE';
                                                        e.currentTarget.style.color = '#2563EB';
                                                    }}
                                                >
                                                    <i className="fa-solid fa-print" style={{ fontSize: '14px' }}></i>
                                                </button>
                                                {item.status === 'barang_rusak' && (
                                                    <button 
                                                        onClick={() => router.get(`/aduan/${item.id}/berita-acara`)}
                                                        title="Berita Acara (Merah)"
                                                        style={{ 
                                                            width: '32px', height: '32px', padding: 0, borderRadius: '4px',
                                                            background: '#FEF2F2',
                                                            border: '1px solid #FEE2E2',
                                                            color: '#EF4444',
                                                            cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'all 0.15s'
                                                        }}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.background = '#EF4444';
                                                            e.currentTarget.style.borderColor = '#EF4444';
                                                            e.currentTarget.style.color = '#fff';
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.background = '#FEF2F2';
                                                            e.currentTarget.style.borderColor = '#FEE2E2';
                                                            e.currentTarget.style.color = '#EF4444';
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-file-contract" style={{ fontSize: '14px' }}></i>
                                                    </button>
                                                )}
                                                {item.phone && (
                                                    <a 
                                                        href={`https://wa.me/${item.phone.replace(/\D/g,'')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="WhatsApp"
                                                        style={{ 
                                                            width: '32px', height: '32px', 
                                                            textDecoration: 'none', borderRadius: '4px',
                                                            background: '#F0FDF4',
                                                            border: '1px solid #DCFCE7',
                                                            color: '#10B981',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'all 0.15s'
                                                        }}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.background = '#10B981';
                                                            e.currentTarget.style.borderColor = '#10B981';
                                                            e.currentTarget.style.color = '#fff';
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.background = '#F0FDF4';
                                                            e.currentTarget.style.borderColor = '#DCFCE7';
                                                            e.currentTarget.style.color = '#10B981';
                                                        }}
                                                    >
                                                        <i className="fa-brands fa-whatsapp" style={{ fontSize: '16px' }}></i>
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="14" style={{ ...tableCellStyle, textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                                        Tidak ada data laporan yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination links={aduan.links} />
            </div>

        </AdminLayout>
    );
}
