import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import SignaturePad from '@/Components/SignaturePad';
import LocalPagination from '@/Components/LocalPagination';

export default function DamageReportsIndex({ aduans = [], filters = {}, technicians = [] }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [startDate, setStartDate] = useState(filters?.start_date || '');
    const [endDate, setEndDate] = useState(filters?.end_date || '');
    const isFirstRender = useRef(true);
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 10;

    const [isKaisikModalOpen, setIsKaisikModalOpen] = useState(false);
    const [kaisikName, setKaisikName] = useState('');
    const [kaisikSignature, setKaisikSignature] = useState('');
    const [selectedTechId, setSelectedTechId] = useState('');

    useEffect(() => {
        setKaisikName(localStorage.getItem('kaisikName') || '');
        setKaisikSignature(localStorage.getItem('kaisikSignature') || '');
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            setCurrentPage(1); // reset page on filter change
            handleFilter();
        }, 500);

        return () => clearTimeout(timer);
    }, [search, startDate, endDate]);

    const handleFilter = () => {
        router.get('/berita-acara', { 
            search, 
            start_date: startDate, 
            end_date: endDate 
        }, { 
            preserveState: true, 
            replace: true 
        });
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

    return (
        <AdminLayout title="Daftar Berita Acara Kerusakan">
            <Head title="Berita Acara Kerusakan" />

            <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <button 
                    onClick={() => setIsKaisikModalOpen(true)}
                    style={{ 
                        height: '40px',
                        boxSizing: 'border-box',
                        padding: '0 24px', 
                        background: '#3B82F6', 
                        color: '#fff', 
                        borderRadius: '4px', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '400',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <i className="fa-solid fa-signature"></i>
                    Atur TTD Ka ISIK
                </button>

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
                </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>

                <div className="hide-scrollbar" style={{ overflowX: 'auto' }}>
                    <table style={{ width: 'max-content', minWidth: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ ...tableHeaderStyle, width: '50px', textAlign: 'center' }}>No</th>
                                <th style={tableHeaderStyle}>Tanggal</th>
                                <th style={tableHeaderStyle}>Kode Tiket</th>
                                <th style={tableHeaderStyle}>Pelapor</th>
                                <th style={tableHeaderStyle}>Unit</th>
                                <th style={tableHeaderStyle}>Nama Barang</th>
                                <th style={tableHeaderStyle}>Merk/Type</th>
                                <th style={tableHeaderStyle}>No. Inventaris</th>
                                <th style={tableHeaderStyle}>Kerusakan</th>
                                <th style={tableHeaderStyle}>Tindakan</th>
                                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const paginated = aduans.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
                                if (paginated.length === 0) return (
                                    <tr>
                                        <td colSpan="11" style={{ ...tableCellStyle, textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                                            Tidak ada berita acara kerusakan yang tersedia.
                                        </td>
                                    </tr>
                                );
                                return paginated.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td style={{ ...tableCellStyle, color: '#94A3B8', textAlign: 'center' }}>{(currentPage - 1) * PER_PAGE + index + 1}</td>
                                    <td style={tableCellStyle}>
                                        {new Date(item.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td style={{ ...tableCellStyle, color: '#1E293B' }}>{item.ticket_number}</td>
                                    <td style={tableCellStyle}>{item.name}</td>
                                    <td style={tableCellStyle}>{item.unit || '-'}</td>
                                    <td style={tableCellStyle}>{item.asset_name || '-'}</td>
                                    <td style={tableCellStyle}>{item.asset_brand || '-'}</td>
                                    <td style={tableCellStyle}>{item.inventory_number || '-'}</td>
                                    <td style={tableCellStyle}>
                                        {item.damage_type ? (
                                            <span style={{ 
                                                padding: '3px 10px', 
                                                background: item.damage_type === 'Hardware' ? '#FEF2F2' : item.damage_type === 'Software' ? '#EFF6FF' : '#F1F5F9', 
                                                color: item.damage_type === 'Hardware' ? '#EF4444' : item.damage_type === 'Software' ? '#2563EB' : '#64748B', 
                                                borderRadius: '4px', 
                                                fontSize: '14px',
                                                fontWeight: '400',
                                                display: 'inline-block',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {item.damage_type}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td style={{ ...tableCellStyle, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.actions_taken || ''}>
                                        {item.actions_taken || '-'}
                                    </td>
                                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <Link 
                                                href={`/aduan/${item.id}/berita-acara/edit`}
                                                title="Edit Berita Acara"
                                                className="transition-all duration-150 flex items-center justify-center"
                                                style={{ 
                                                    width: '32px', height: '32px', 
                                                    textDecoration: 'none', borderRadius: '4px',
                                                    background: '#FFFBEB',
                                                    border: '1px solid #FEF3C7',
                                                    color: '#D97706'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#D97706'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#D97706'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#FFFBEB'; e.currentTarget.style.color = '#D97706'; e.currentTarget.style.borderColor = '#FEF3C7'; }}
                                            >
                                                <i className="fa-solid fa-pen-to-square" style={{ fontSize: '14px' }}></i>
                                            </Link>
                                            {/* RED BUTTON - Berita Acara */}
                                            <Link 
                                                href={`/aduan/${item.id}/berita-acara`}
                                                title="Cetak Berita Acara (Merah)"
                                                className="transition-all duration-150 flex items-center justify-center cursor-pointer"
                                                style={{ 
                                                    width: '32px', height: '32px', padding: 0, borderRadius: '4px',
                                                    background: '#FEF2F2',
                                                    border: '1px solid #FEE2E2',
                                                    color: '#EF4444'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#EF4444'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#FEE2E2'; }}
                                            >
                                                <i className="fa-solid fa-file-contract" style={{ fontSize: '14px' }}></i>
                                            </Link>

                                            {/* Kirim ke Pelapor Button */}
                                            {item.is_ba_sent ? (
                                                <button 
                                                    onClick={() => {
                                                        if (window.confirm('Kirim ulang Berita Acara Kerusakan ini ke dashboard pelapor (dengan pembaruan)?')) {
                                                            router.post(`/aduan/${item.id}/send-ba`, {}, {
                                                                onSuccess: () => {
                                                                    if (window.showToast) {
                                                                        window.showToast('Berita Acara berhasil dikirim ulang ke Pelapor!', 'success');
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    title="Kirim Ulang Berita Acara ke Pelapor (Sudah Pernah Dikirim)"
                                                    className="transition-colors flex items-center justify-center cursor-pointer"
                                                    style={{ 
                                                        width: '32px', height: '32px', padding: 0, borderRadius: '4px',
                                                        background: '#ECFDF5',
                                                        border: '1px solid #A7F3D0',
                                                        color: '#10B981'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#10B981'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#10B981'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#ECFDF5'; e.currentTarget.style.color = '#10B981'; e.currentTarget.style.borderColor = '#A7F3D0'; }}
                                                >
                                                    <i className="fa-solid fa-paper-plane" style={{ fontSize: '13px' }}></i>
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => {
                                                        if (window.confirm('Kirim Berita Acara Kerusakan ini ke dashboard pelapor?')) {
                                                            router.post(`/aduan/${item.id}/send-ba`, {}, {
                                                                onSuccess: () => {
                                                                    if (window.showToast) {
                                                                        window.showToast('Berita Acara berhasil dikirim ke Pelapor!', 'success');
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    title="Kirim Berita Acara ke Pelapor"
                                                    className="transition-colors flex items-center justify-center cursor-pointer"
                                                    style={{ 
                                                        width: '32px', height: '32px', padding: 0, borderRadius: '4px',
                                                        background: '#EFF6FF',
                                                        border: '1px solid #BFDBFE',
                                                        color: '#2563EB'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2563EB'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
                                                >
                                                    <i className="fa-solid fa-paper-plane" style={{ fontSize: '13px' }}></i>
                                                </button>
                                            )}

                                            {item.phone && (
                                                <a 
                                                    href={`https://wa.me/${item.phone.replace(/\D/g,'')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Hubungi via WhatsApp"
                                                    className="transition-all duration-150 flex items-center justify-center"
                                                    style={{ 
                                                        width: '32px', height: '32px', 
                                                        textDecoration: 'none', borderRadius: '4px',
                                                        background: '#F0FDF4',
                                                        border: '1px solid #DCFCE7',
                                                        color: '#10B981'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#10B981'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#10B981'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = '#F0FDF4'; e.currentTarget.style.color = '#10B981'; e.currentTarget.style.borderColor = '#DCFCE7'; }}
                                                >
                                                    <i className="fa-brands fa-whatsapp" style={{ fontSize: '16px' }}></i>
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                ));
                            })()}
                        </tbody>
                    </table>
                </div>
                <LocalPagination
                    totalItems={aduans.length}
                    currentPage={currentPage}
                    perPage={PER_PAGE}
                    onPageChange={p => setCurrentPage(p)}
                />
            </div>

            {/* KA ISIK TTD Modal */}
            {isKaisikModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', width: '500px', padding: '30px', borderRadius: '4px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '400' }}>Pengaturan Tanda Tangan Ka ISIK</h3>
                        
                        {/* Dropdown Pemilihan Teknisi */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Pilih Teknisi Ber-TTD Terdaftar (Opsional)</label>
                            <select 
                                value={selectedTechId}
                                onChange={(e) => {
                                    const techId = e.target.value;
                                    setSelectedTechId(techId);
                                    if (techId) {
                                        const tech = technicians.find(t => t.id === parseInt(techId, 10));
                                        if (tech) {
                                            setKaisikName(tech.name);
                                            setKaisikSignature(tech.signature || '');
                                        }
                                    } else {
                                        setKaisikName('');
                                        setKaisikSignature('');
                                    }
                                }}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '14px', outline: 'none', fontFamily: 'Telex', background: '#fff' }}
                            >
                                <option value="">--- Ketik Manual / Gambar Baru ---</option>
                                {technicians.map(tech => (
                                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Nama Lengkap Ka ISIK</label>
                            <input 
                                type="text" 
                                value={kaisikName}
                                onChange={(e) => setKaisikName(e.target.value)}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '14px', outline: 'none', fontFamily: 'Telex' }}
                                placeholder="Cth: dr. Budi Santoso"
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Tanda Tangan Digital</label>
                            {selectedTechId && kaisikSignature ? (
                                <div style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', padding: '16px', textAlign: 'center', position: 'relative' }}>
                                    <img 
                                        src={kaisikSignature} 
                                        alt="Tanda Tangan Ka ISIK" 
                                        style={{ maxHeight: '110px', display: 'block', margin: '0 auto' }} 
                                    />
                                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748B' }}>
                                        <i className="fa-solid fa-circle-check" style={{ marginRight: '5px', color: '#10B981' }}></i>
                                        Menggunakan tanda tangan terdaftar dari Manajemen Teknisi.
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTechId('');
                                            setKaisikSignature('');
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            padding: '4px 10px',
                                            background: '#FEF2F2',
                                            border: '1px solid #FEE2E2',
                                            color: '#EF4444',
                                            fontSize: '11px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Ganti / Gambar Manual
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <SignaturePad 
                                        onSave={(sig) => setKaisikSignature(sig)} 
                                        onClear={() => setKaisikSignature('')} 
                                    />
                                    {kaisikSignature && (
                                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#10B981' }}>
                                            <i className="fa-solid fa-check-circle" style={{ marginRight: '5px' }}></i>
                                            Tanda tangan manual tersimpan sementara.
                                        </div>
                                    )}
                                    {selectedTechId && !kaisikSignature && (
                                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#D97706', background: '#FFFBEB', padding: '8px 12px', border: '1px solid #FEF3C7' }}>
                                            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i>
                                            Teknisi ini belum memiliki tanda tangan terdaftar di Manajemen Teknisi. Silakan gambar secara manual di atas.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => {
                                    setIsKaisikModalOpen(false);
                                    setSelectedTechId('');
                                }}
                                style={{ padding: '10px 20px', background: '#F1F5F9', color: '#64748B', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => {
                                    localStorage.setItem('kaisikName', kaisikName);
                                    localStorage.setItem('kaisikSignature', kaisikSignature);
                                    setIsKaisikModalOpen(false);
                                    setSelectedTechId('');
                                    if (window.showToast) {
                                        window.showToast('Tanda tangan Ka ISIK berhasil disimpan untuk sesi ini!', 'success');
                                    } else {
                                        alert('Tanda tangan Ka ISIK berhasil disimpan untuk sesi ini!');
                                    }
                                }}
                                style={{ padding: '10px 20px', background: '#10B981', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                            >
                                Simpan Pengaturan
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
