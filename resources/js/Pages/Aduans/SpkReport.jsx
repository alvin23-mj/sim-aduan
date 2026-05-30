import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function SpkReport({ aduan = {}, technicians = [] }) {
    const [kaisikName, setKaisikName] = useState('');
    const [kaisikSignature, setKaisikSignature] = useState(null);
    const [selectedTechnicianName, setSelectedTechnicianName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('kaisikName');
        const storedSignature = localStorage.getItem('kaisikSignature');
        if (storedName) {
            setKaisikName(storedName);
        }
        if (storedSignature) setKaisikSignature(storedSignature);
    }, [aduan]);

    // Extract list of technicians assigned to this aduan
    const assignedTechnicians = aduan?.technician 
        ? aduan.technician.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    useEffect(() => {
        if (assignedTechnicians.length > 0) {
            setSelectedTechnicianName(assignedTechnicians[0]);
        }
    }, [aduan]);

    const selectedTechObj = Array.isArray(technicians) ? technicians.find(
        t => t?.name && selectedTechnicianName && t.name.toLowerCase().trim() === selectedTechnicianName.toLowerCase().trim()
    ) : null;
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
                    .value-col { border-bottom: none; }

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
                        border-bottom: none;
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
                        align-items: center;
                    }
                    .signature-space {
                        height: 75px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 5px;
                    }
                    .signature-img {
                        max-height: 65px;
                        max-width: 140px;
                        object-fit: contain;
                    }
                    .signature-name {
                        font-weight: bold;
                    }
                    @media (max-width: 640px) {
                        .btn-text { display: none; }
                        .action-btn { padding: 10px 14px !important; }
                    }
                    .report-page-container {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }
                    .action-bar-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 100%;
                        flex-wrap: nowrap;
                        gap: 10px;
                    }
                    .right-btns-wrapper {
                        display: flex;
                        gap: 10px;
                        flex-wrap: nowrap;
                        flex-shrink: 0;
                    }
                    @media (min-width: 1350px) {
                        .report-page-container {
                            position: relative;
                        }
                        .action-bar-container {
                            position: absolute;
                            left: 0;
                            right: 0;
                            top: 0;
                            pointer-events: none;
                        }
                        .back-btn-wrapper, .right-btns-wrapper {
                            pointer-events: auto;
                        }
                        .document-container {
                            margin-top: 0 !important;
                        }
                    }
                    @media (max-width: 1350px) {
                        .action-bar-container {
                            max-width: 850px;
                            margin: 0 auto;
                        }
                    }
                `}
            </style>

            <div className="report-page-container">
                <div className="no-print action-bar-container">
                    <div className="back-btn-wrapper">
                        <Link 
                            href={route('reports.index')}
                            className="action-btn"
                            style={{
                                height: '42px',
                                boxSizing: 'border-box',
                                padding: '0 24px',
                                background: '#fff',
                                color: '#64748B',
                                border: '1px solid #E2E8F0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                textDecoration: 'none'
                            }}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            <span className="btn-text">Kembali</span>
                        </Link>
                    </div>

                    <div className="right-btns-wrapper">
                        <Link 
                            href={route('aduan.spkReportEdit', aduan.id)}
                            className="action-btn"
                            style={{
                                height: '42px',
                                boxSizing: 'border-box',
                                padding: '0 24px',
                                background: '#2563EB',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                textDecoration: 'none'
                            }}
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                            <span className="btn-text">Edit SPK</span>
                        </Link>

                        <button 
                            onClick={handlePrint}
                            className="action-btn"
                            style={{
                                height: '42px',
                                boxSizing: 'border-box',
                                padding: '0 24px',
                                background: '#1E293B',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <i className="fa-solid fa-print"></i>
                            <span className="btn-text">Cetak Surat Perintah Kerja</span>
                        </button>
                    </div>
                </div>

            <div className="no-print" style={{ maxWidth: '850px', margin: '0 auto 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

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
                    <div className="doc-number">NO. {aduan.report_number || ''}</div>
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
                    Nganjuk, {aduan.updated_at ? new Date(aduan.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                </div>

                <div className="signature-section">
                    <div className="signature-box">
                        <div>Kepala Ruang</div>
                        <div className="signature-space">
                            {aduan.kepala_ruang_signature ? (
                                <img src={aduan.kepala_ruang_signature} className="signature-img" alt="Ttd Kepala Ruang" />
                            ) : null}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="signature-name">
                                {aduan.kepala_ruang_name || ''}
                            </div>
                            {aduan.kepala_ruang_nip ? (
                                <div style={{ fontSize: '11px', marginTop: '3px', textAlign: 'center' }}>
                                    NIP. {aduan.kepala_ruang_nip}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="signature-box">
                        <div>Petugas ISIK RS</div>
                        <div className="signature-space">
                            {selectedTechSignature ? (
                                <img src={selectedTechSignature} className="signature-img" alt="Ttd Teknisi" />
                            ) : null}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="signature-name">
                                {selectedTechnicianName || ''}
                            </div>
                            {aduan.technician_nip ? (
                                <div style={{ fontSize: '11px', marginTop: '3px', textAlign: 'center' }}>
                                    NIP. {aduan.technician_nip}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="signature-box">
                        <div>Ka. ISIK RS</div>
                        <div className="signature-space">
                            {kaisikSignature ? (
                                <img src={kaisikSignature} className="signature-img" alt="Ttd Ka ISIK" />
                            ) : null}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="signature-name">
                                {aduan.kaisik_name || kaisikName || ''}
                            </div>
                            {aduan.kaisik_nip ? (
                                <div style={{ fontSize: '11px', marginTop: '3px', textAlign: 'center' }}>
                                    NIP. {aduan.kaisik_nip}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>

            </div>
        </AdminLayout>
    );
}
