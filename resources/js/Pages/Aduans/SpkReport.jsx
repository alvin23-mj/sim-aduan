import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function SpkReport({ aduan, technicians = [] }) {
    const { data, setData, patch, processing, errors } = useForm({
        unit: aduan.unit || '',
        asset_name: aduan.asset_name || '',
        asset_brand: aduan.asset_brand || '',
        description: aduan.description || '',
        damage_chronology: aduan.damage_chronology || '',
        actions_taken: aduan.actions_taken || '',
        priority: aduan.priority || 'ringan',
        satisfaction: aduan.satisfaction || 'puas',
        recommendation: aduan.recommendation || '',
        report_number: aduan.report_number || '',
        kepala_ruang_name: aduan.kepala_ruang_name || '',
        kepala_ruang_nip: aduan.kepala_ruang_nip || '',
        technician_nip: aduan.technician_nip || '',
        kaisik_name: aduan.kaisik_name || '',
        kaisik_nip: aduan.kaisik_nip || '',
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [kaisikName, setKaisikName] = useState('........................................');
    const [kaisikSignature, setKaisikSignature] = useState(null);
    const [selectedTechnicianName, setSelectedTechnicianName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('kaisikName');
        const storedSignature = localStorage.getItem('kaisikSignature');
        if (storedName) {
            setKaisikName(storedName);
            if (!aduan.kaisik_name) {
                setData(d => ({ ...d, kaisik_name: storedName }));
            }
        }
        if (storedSignature) setKaisikSignature(storedSignature);
    }, [aduan]);

    // Extract list of technicians assigned to this aduan
    const assignedTechnicians = aduan.technician 
        ? aduan.technician.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    useEffect(() => {
        if (assignedTechnicians.length > 0) {
            setSelectedTechnicianName(assignedTechnicians[0]);
        }
    }, [aduan]);

    const selectedTechObj = technicians.find(
        t => t.name.toLowerCase().trim() === selectedTechnicianName.toLowerCase().trim()
    );
    const selectedTechSignature = selectedTechObj?.signature || null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout title="Surat Perintah Kerja (SPK)">
            <Head title={`Surat Perintah Kerja - ${aduan.ticket_number}`} />

            <style>
                {`
                    @media print {
                        header, aside, .no-print, .nav-header {
                            display: none !important;
                        }
                        main {
                            padding: 0 !important;
                            margin: 0 !important;
                            background: #fff !important;
                        }
                        .document-container {
                            border: none !important;
                            box-shadow: none !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                    }
                    .document-container {
                        max-width: 850px;
                        margin: 0 auto;
                        background: #fff;
                        padding: 30px 50px;
                        border: 1px solid #E2E8F0;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        font-family: 'Telex', sans-serif;
                        color: #000;
                        line-height: 1.2;
                    }
                    .kop-surat {
                        display: flex;
                        align-items: center;
                        padding-bottom: 5px;
                        text-align: center;
                    }
                    .kop-line {
                        border-top: 2px solid #000;
                        border-bottom: 1px solid #000;
                        height: 5px;
                        margin-bottom: 15px;
                    }
                    .kop-logo-left {
                        width: 110px;
                        text-align: left;
                    }
                    .kop-logo-right {
                        width: 110px;
                        text-align: right;
                    }
                    .kop-text {
                        flex: 1;
                        text-align: center;
                    }
                    .kop-header-1 { font-size: 16px; font-weight: bold !important; margin: 0; }
                    .kop-header-2 { font-size: 18px; font-weight: bold !important; margin: 2px 0 0 0; }
                    .kop-header-3 { font-size: 22px; font-weight: bold !important; margin: 2px 0 0 0; }
                    .kop-address { font-size: 10px; margin: 4px 0 0 0; line-height: 1.2; }
                    .kop-sub { font-size: 15px; font-weight: bold !important; text-align: center; margin: 5px 0 15px 0; text-decoration: none !important; }

                    .doc-title-box {
                        text-align: center;
                        margin-bottom: 15px;
                    }
                    .doc-title-border {
                        border: 1px solid #000;
                        padding: 5px 25px;
                        display: inline-block;
                        font-size: 14px;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                    .doc-number { font-size: 12px; margin-top: 5px; }

                    .field-table {
                        width: 100%;
                        margin-bottom: 15px;
                        font-size: 13px;
                        border-collapse: collapse;
                    }
                    .field-table td {
                        padding: 4px 0;
                        vertical-align: top;
                    }
                    .label-col { width: 220px; font-weight: bold; }
                    .separator-col { width: 15px; text-align: center; }
                    .value-col { border-bottom: 1px dotted #000; }

                    .section-title {
                        font-size: 13px;
                        font-weight: bold;
                        margin-top: 12px;
                        margin-bottom: 4px;
                    }
                    .section-content {
                        font-size: 13px;
                        margin-left: 20px;
                        margin-bottom: 8px;
                        border-bottom: 1px dotted #000;
                        min-height: 22px;
                        line-height: 1.3;
                    }
                    .checkbox-row {
                        display: flex;
                        gap: 30px;
                        margin-left: 20px;
                        margin-bottom: 10px;
                        font-size: 13px;
                    }
                    .checkbox-item {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .check-box {
                        width: 14px;
                        height: 14px;
                        border: 1px solid #000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                    }

                    .signature-section {
                        margin-top: 25px;
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                        text-align: center;
                        font-size: 13px;
                    }
                    .signature-box {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        height: 130px;
                    }
                    .signature-space {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .signature-img {
                        max-height: 60px;
                        max-width: 130px;
                        object-fit: contain;
                    }
                    .signature-name {
                        font-weight: bold;
                    }
                `}
            </style>

            <div className="no-print" style={{ maxWidth: '850px', margin: '0 auto 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                        onClick={() => window.history.back()}
                        style={{
                            padding: '10px 24px',
                            background: '#fff',
                            color: '#64748B',
                            border: '1px solid #E2E8F0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        Kembali
                    </button>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            style={{
                                padding: '10px 24px',
                                background: '#2563EB',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                            Edit SPK
                        </button>

                        <button 
                            onClick={handlePrint}
                            style={{
                                padding: '10px 24px',
                                background: '#1E293B',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <i className="fa-solid fa-print"></i>
                            Cetak Surat Perintah Kerja
                        </button>
                    </div>
                </div>

                {/* Multi-technician selector in no-print top bar */}
                {assignedTechnicians.length > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#EFF6FF', padding: '14px', border: '1px solid #BFDBFE' }}>
                        <i className="fa-solid fa-users-gear" style={{ color: '#2563EB', fontSize: '18px' }}></i>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#1E40AF', fontWeight: 'bold', textTransform: 'uppercase' }}>Ditemukan Lebih dari 1 Teknisi</p>
                            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#1E293B' }}>Pilih nama petugas/teknisi untuk memunculkan tanda tangan digital mereka:</p>
                        </div>
                        <select
                            value={selectedTechnicianName}
                            onChange={(e) => setSelectedTechnicianName(e.target.value)}
                            style={{ height: '38px', padding: '0 12px', fontSize: '13px', border: '1px solid #93C5FD', outline: 'none', background: '#fff', fontFamily: 'Telex', minWidth: '180px' }}
                        >
                            {assignedTechnicians.map((name, i) => (
                                <option key={i} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Document body */}
            <div className="document-container">
                {/* Kop Surat */}
                <div className="kop-surat">
                    <div className="kop-logo-left">
                        <img src="/logo_nganjuk.jpg" alt="Logo Nganjuk" style={{ height: '80px', width: 'auto' }} />
                    </div>
                    <div className="kop-text">
                        <div className="kop-header-1">PEMERINTAH KABUPATEN NGANJUK</div>
                        <div className="kop-header-2">DINAS KESEHATAN</div>
                        <div className="kop-header-3">RUMAH SAKIT UMUM DAERAH NGANJUK</div>
                        <div className="kop-address">
                            Jl. Dr. Soetomo No. 62 Tel. (0358) 321818, 326474, 326652, 328429<br />
                            Fax. (0358) 325003 NGANJUK 64415
                        </div>
                    </div>
                    <div className="kop-logo-right" style={{ overflow: 'visible' }}>
                        <img src="/images/logo_rsud.jpeg" alt="Logo RSUD" style={{ height: '80px', width: 'auto', transform: 'translateX(35px)' }} />
                    </div>
                </div>
                <div className="kop-line"></div>
                <div className="kop-sub">Instalasi Sistem Informasi dan Komunikasi</div>

                {/* Judul Dokumen */}
                <div className="doc-title-box">
                    <div className="doc-title-border">SURAT PERINTAH KERJA</div>
                    <div className="doc-number">NO. {aduan.report_number || '..............................................................'}</div>
                </div>

                {/* Detail Form Fields */}
                <table className="field-table">
                    <tbody>
                        <tr>
                            <td className="label-col">Ruang / Instalasi</td>
                            <td className="separator-col">:</td>
                            <td className="value-col">{aduan.unit || ''}</td>
                        </tr>
                        <tr>
                            <td className="label-col">Nama barang</td>
                            <td className="separator-col">:</td>
                            <td className="value-col">{aduan.asset_name || ''}</td>
                        </tr>
                        <tr>
                            <td className="label-col">Tipe</td>
                            <td className="separator-col">:</td>
                            <td className="value-col">{aduan.asset_brand || ''}</td>
                        </tr>
                        <tr>
                            <td className="label-col">Tanggal Permintaan</td>
                            <td className="separator-col">:</td>
                            <td className="value-col">
                                {aduan.created_at && new Date(aduan.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </td>
                        </tr>
                        <tr>
                            <td className="label-col">Kerusakan Awal</td>
                            <td className="separator-col">:</td>
                            <td className="value-col">{aduan.description || ''}</td>
                        </tr>
                        <tr>
                            <td className="label-col">Tanggal Mulai Kerja</td>
                            <td className="separator-col">:</td>
                            <td className="value-col">
                                {aduan.started_working_at ? new Date(aduan.started_working_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                            </td>
                        </tr>
                        <tr>
                            <td className="label-col">Tanggal Selesai Kerja</td>
                            <td className="separator-col">:</td>
                            <td className="value-col">
                                {aduan.updated_at ? new Date(aduan.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Analisa Kerusakan */}
                <div className="section-title">1. Analisa Kerusakan</div>
                <div className="section-content">
                    {aduan.damage_chronology || ''}
                </div>

                {/* Tindak Lanjut */}
                <div className="section-title">2. Tindak Lanjut</div>
                <div className="section-content">
                    {aduan.actions_taken || ''}
                </div>

                {/* Tingkat Kerusakan */}
                <div className="section-title">3. Tingkat Kerusakan</div>
                <div className="checkbox-row">
                    <div className="checkbox-item">
                        <div className="check-box">{aduan.priority === 'ringan' ? '✔' : ''}</div>
                        <span>Ringan</span>
                    </div>
                    <div className="checkbox-item">
                        <div className="check-box">{aduan.priority === 'sedang' ? '✔' : ''}</div>
                        <span>Sedang</span>
                    </div>
                    <div className="checkbox-item">
                        <div className="check-box">{aduan.priority === 'berat' ? '✔' : ''}</div>
                        <span>Berat</span>
                    </div>
                </div>

                {/* Komentar / Saran (Client Satisfaction) */}
                <div className="section-title">4. Komentar / Saran</div>
                <div className="checkbox-row">
                    <div className="checkbox-item">
                        <div className="check-box">{aduan.satisfaction === 'puas' ? '✔' : ''}</div>
                        <span>Puas</span>
                    </div>
                    <div className="checkbox-item">
                        <div className="check-box">{aduan.satisfaction === 'tidak_puas' ? '✔' : ''}</div>
                        <span>Tidak Puas</span>
                    </div>
                </div>

                {/* Saran */}
                <div className="section-title">5. Saran</div>
                <div className="section-content">
                    {aduan.recommendation || ''}
                </div>

                {/* Signature Block */}
                <div style={{ textStyle: 'normal', textAlign: 'right', marginRight: '40px', marginTop: '20px', fontSize: '13px' }}>
                    Nganjuk, {aduan.updated_at ? new Date(aduan.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '........................'}
                </div>

                <div className="signature-section">
                    <div className="signature-box">
                        <div>Kepala Ruang</div>
                        <div className="signature-space"></div>
                        <div>
                            <div className="signature-name">
                                {aduan.kepala_ruang_name || '........................................'}
                            </div>
                            <div style={{ fontSize: '11px', marginTop: '3px' }}>
                                NIP. {aduan.kepala_ruang_nip || '........................................'}
                            </div>
                        </div>
                    </div>
                    <div className="signature-box">
                        <div>Petugas ISIK RS</div>
                        <div className="signature-space">
                            {selectedTechSignature ? (
                                <img src={selectedTechSignature} className="signature-img" alt="Ttd Teknisi" />
                            ) : null}
                        </div>
                        <div>
                            <div className="signature-name">
                                {selectedTechnicianName || '........................................'}
                            </div>
                            <div style={{ fontSize: '11px', marginTop: '3px' }}>
                                NIP. {aduan.technician_nip || '........................................'}
                            </div>
                        </div>
                    </div>
                    <div className="signature-box">
                        <div>Ka. ISIK RS</div>
                        <div className="signature-space">
                            {kaisikSignature ? (
                                <img src={kaisikSignature} className="signature-img" alt="Ttd Ka ISIK" />
                            ) : null}
                        </div>
                        <div>
                            <div className="signature-name">
                                {aduan.kaisik_name || kaisikName || '........................................'}
                            </div>
                            <div style={{ fontSize: '11px', marginTop: '3px' }}>
                                NIP. {aduan.kaisik_nip || '........................................'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit SPK Modal */}
            {isEditModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    fontFamily: "'Telex', sans-serif"
                }}>
                    <div style={{
                        background: '#fff',
                        width: '100%',
                        maxWidth: '650px',
                        maxHeight: '90vh',
                        borderRadius: '8px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid #F1F5F9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1E293B' }}>Edit Form SPK</h3>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#94A3B8' }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            patch(route('aduan.update', aduan.id), {
                                onSuccess: () => setIsEditModalOpen(false)
                            });
                        }} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '60vh' }}>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {/* Report Number */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Nomor Surat (NO. SPK)</label>
                                        <input 
                                            type="text" 
                                            value={data.report_number}
                                            onChange={e => setData('report_number', e.target.value)}
                                            placeholder="Contoh: 005/SPK/ISIK/2026"
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>
                                    
                                    {/* Ruang / Instalasi */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Ruang / Instalasi</label>
                                        <input 
                                            type="text" 
                                            value={data.unit}
                                            onChange={e => setData('unit', e.target.value)}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {/* Nama Barang */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Nama Barang</label>
                                        <input 
                                            type="text" 
                                            value={data.asset_name}
                                            onChange={e => setData('asset_name', e.target.value)}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>

                                    {/* Tipe */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Tipe / Merk</label>
                                        <input 
                                            type="text" 
                                            value={data.asset_brand}
                                            onChange={e => setData('asset_brand', e.target.value)}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                {/* Kerusakan Awal */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Kerusakan Awal</label>
                                    <textarea 
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={2}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                                    />
                                </div>

                                {/* Analisa Kerusakan */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>1. Analisa Kerusakan</label>
                                    <textarea 
                                        value={data.damage_chronology}
                                        onChange={e => setData('damage_chronology', e.target.value)}
                                        rows={2}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                                    />
                                </div>

                                {/* Tindak Lanjut */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>2. Tindak Lanjut</label>
                                    <textarea 
                                        value={data.actions_taken}
                                        onChange={e => setData('actions_taken', e.target.value)}
                                        rows={2}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    {/* Tingkat Kerusakan (Priority) */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>3. Tingkat Kerusakan</label>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            {['ringan', 'sedang', 'berat'].map(p => (
                                                <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', textTransform: 'capitalize' }}>
                                                    <input 
                                                        type="radio" 
                                                        name="priority" 
                                                        value={p} 
                                                        checked={data.priority === p}
                                                        onChange={() => setData('priority', p)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    {p}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tingkat Kepuasan */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>4. Tingkat Kepuasan</label>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            {[
                                                { value: 'puas', label: 'Puas' },
                                                { value: 'tidak_puas', label: 'Tidak Puas' }
                                            ].map(s => (
                                                <label key={s.value} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                                                    <input 
                                                        type="radio" 
                                                        name="satisfaction" 
                                                        value={s.value} 
                                                        checked={data.satisfaction === s.value}
                                                        onChange={() => setData('satisfaction', s.value)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    {s.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Saran */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>5. Saran</label>
                                    <textarea 
                                        value={data.recommendation}
                                        onChange={e => setData('recommendation', e.target.value)}
                                        rows={2}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                                    />
                                </div>

                                {/* Section Tanda Tangan & NIP */}
                                <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '16px', marginTop: '8px' }}>
                                    <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 'bold', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Informasi Tanda Tangan & NIP
                                    </h4>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                        {/* Kepala Ruang Name */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Nama Kepala Ruang</label>
                                            <input 
                                                type="text" 
                                                value={data.kepala_ruang_name}
                                                onChange={e => setData('kepala_ruang_name', e.target.value)}
                                                placeholder="Contoh: dr. Budi Santoso"
                                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                            />
                                        </div>

                                        {/* Kepala Ruang NIP */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>NIP Kepala Ruang</label>
                                            <input 
                                                type="text" 
                                                value={data.kepala_ruang_nip}
                                                onChange={e => setData('kepala_ruang_nip', e.target.value)}
                                                placeholder="Contoh: 19800101 200501 1 001"
                                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                        {/* Petugas Name (Readonly) */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Nama Petugas/Teknisi</label>
                                            <input 
                                                type="text" 
                                                value={selectedTechnicianName || aduan.technician || ''}
                                                disabled
                                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '14px', outline: 'none', background: '#F8FAFC', color: '#64748B' }}
                                            />
                                        </div>

                                        {/* Petugas NIP (Technician) */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>NIP Petugas/Teknisi</label>
                                            <input 
                                                type="text" 
                                                value={data.technician_nip}
                                                onChange={e => setData('technician_nip', e.target.value)}
                                                placeholder="Contoh: 19850202 201001 2 002"
                                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        {/* Ka. ISIK Name */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>Nama Ka. ISIK RS</label>
                                            <input 
                                                type="text" 
                                                value={data.kaisik_name}
                                                onChange={e => setData('kaisik_name', e.target.value)}
                                                placeholder="Contoh: Ari, S.Kom"
                                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                            />
                                        </div>

                                        {/* Ka. ISIK NIP */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>NIP Ka. ISIK RS</label>
                                            <input 
                                                type="text" 
                                                value={data.kaisik_nip}
                                                onChange={e => setData('kaisik_nip', e.target.value)}
                                                placeholder="Contoh: 19780303 200801 1 003"
                                                style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div style={{
                                padding: '16px 24px',
                                borderTop: '1px solid #F1F5F9',
                                display: 'flex',
                                justifyContent: 'end',
                                gap: '12px',
                                background: '#F8FAFC',
                                borderBottomLeftRadius: '8px',
                                borderBottomRightRadius: '8px'
                            }}>
                                <button 
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    style={{ padding: '8px 16px', background: '#fff', color: '#475569', border: '1px solid #D1D5DB', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    style={{ padding: '8px 20px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
