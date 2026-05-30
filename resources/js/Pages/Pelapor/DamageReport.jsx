import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import SignaturePad from '@/Components/SignaturePad';

export default function PelaporDamageReport({ aduan }) {
    const [kaisikName, setKaisikName] = useState('( .................... )');
    const [kaisikSignature, setKaisikSignature] = useState(null);

    // Signature Modal States for Kepala Ruang
    const [showSignModal, setShowSignModal] = useState(false);
    const [signName, setSignName] = useState(aduan.kepala_ruang_name || '');
    const [signNip, setSignNip] = useState(aduan.kepala_ruang_nip || '');
    const [tempSignature, setTempSignature] = useState(null);

    useEffect(() => {
        const storedName = localStorage.getItem('kaisikName');
        const storedSignature = localStorage.getItem('kaisikSignature');
        if (storedName) setKaisikName(storedName);
        if (storedSignature) setKaisikSignature(storedSignature);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleSaveSignature = () => {
        const signatureToSave = tempSignature || aduan.kepala_ruang_signature;
        if (!signatureToSave) {
            alert('Silakan gambar tanda tangan terlebih dahulu.');
            return;
        }
        if (!signName.trim()) {
            alert('Silakan isi nama Kepala Ruang.');
            return;
        }

        router.post(`/aduan/${aduan.id}/sign-kepala-ruang`, {
            signature: signatureToSave,
            kepala_ruang_name: signName,
            kepala_ruang_nip: signNip
        }, {
            onSuccess: () => {
                setShowSignModal(false);
                if (window.showToast) {
                    window.showToast('Tanda tangan Kepala Ruang berhasil disimpan!', 'success');
                } else {
                    alert('Tanda tangan Kepala Ruang berhasil disimpan!');
                }
            }
        });
    };

    return (
        <AdminLayout title="Review Berita Acara Kerusakan">
            <Head title={`Review Berita Acara - ${aduan.ticket_number}`} />

            <style>
                {`
                    @media print {
                        header, aside, .no-print, .nav-header {
                            display: none !important;
                        }
                        html, body, main {
                            padding: 0 !important;
                            margin: 0 !important;
                            background: #fff !important;
                            overflow: visible !important;
                            overflow-x: hidden !important;
                        }
                        main {
                            display: block !important;
                            overflow: visible !important;
                        }
                        ::-webkit-scrollbar {
                            display: none !important;
                        }
                        .document-container {
                            border: none !important;
                            box-shadow: none !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            overflow: visible !important;
                        }
                        .signature-section {
                            overflow: visible !important;
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
                    .kop-logo {
                        width: 70px;
                        height: auto;
                    }
                    .kop-text {
                        flex: 1;
                    }
                    .kop-header-1 { font-size: 16px; font-weight: bold !important; margin-bottom: 1px; }
                    .kop-header-2 { font-size: 18px; font-weight: bold !important; margin-bottom: 1px; }
                    .kop-header-3 { font-size: 22px; font-weight: bold !important; margin-bottom: 3px; }
                    .kop-address { font-size: 10px; line-height: 1.1; font-style: normal; }

                    .doc-title-box {
                        text-align: center;
                        margin-bottom: 15px;
                    }
                    .doc-title {
                        font-size: 14px;
                        font-weight: bold !important;
                        margin-bottom: 2px;
                        text-transform: uppercase;
                    }
                    .doc-number { font-size: 12px; }

                    .content-section {
                        font-size: 12px;
                        margin-bottom: 10px;
                    }
                    .field-table {
                        width: 100%;
                        margin-bottom: 8px;
                    }
                    .field-table td {
                        padding: 1px 0;
                        vertical-align: top;
                    }
                    .label-col { width: 160px; }
                    .separator-col { width: 15px; text-align: center; }

                    .checkbox-group {
                        margin-left: 15px;
                        margin-bottom: 12px;
                    }
                    .checkbox-item {
                        display: flex;
                        align-items: flex-start;
                        gap: 8px;
                        margin-bottom: 3px;
                    }
                    .check-box {
                        width: 14px;
                        height: 14px;
                        border: 1px solid #000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        margin-top: 1px;
                    }

                    .signature-section {
                        margin-top: 30px;
                        display: flex;
                        justify-content: space-between;
                        text-align: center;
                    }
                    .signature-box {
                        width: 220px;
                    }
                    .signature-space {
                        height: 60px;
                    }
                    .signature-name {
                        font-weight: normal;
                    }
                `}
            </style>

            <div className="no-print" style={{ maxWidth: '850px', margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link 
                    href="/pelapor/riwayat"
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
                        gap: '8px',
                        textDecoration: 'none'
                    }}
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Kembali ke Riwayat
                </Link>

                <div style={{ display: 'flex', gap: '10px' }}>

                    <button 
                        onClick={handlePrint}
                        style={{
                            padding: '10px 24px',
                            background: '#2563EB',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
                            transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1D4ED8'}
                        onMouseLeave={e => e.currentTarget.style.background = '#2563EB'}
                    >
                        <i className="fa-solid fa-print"></i>
                        Cetak Berita Acara
                    </button>
                </div>
            </div>

            {/* Informational Header Alert for Pelapor (No Print) */}
            <div className="no-print" style={{ 
                maxWidth: '850px', 
                margin: '0 auto 20px', 
                background: '#EFF6FF', 
                border: '1px solid #DBEAFE', 
                padding: '14px 18px', 
                borderRadius: '6px', 
                color: '#1E40AF',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxSizing: 'border-box'
            }}>
                <i className="fa-solid fa-circle-info" style={{ fontSize: '18px', color: '#3B82F6' }}></i>
                <div style={{ fontSize: '14px', lineHeight: 1.5 }}>
                    <strong>Pratinjau Berita Acara:</strong> Ini adalah draf digital resmi kerusakan perangkat Anda. Anda dapat meninjau semua hasil pemeriksaan teknisi di bawah dan mencetaknya langsung menggunakan tombol di kanan atas.
                </div>
            </div>

            <div className="document-container">
                {/* Kop Surat */}
                <div className="kop-surat">
                    <div style={{ width: '100px', textAlign: 'left' }}>
                        <img 
                            src="/logo_nganjuk.jpg" 
                            alt="Logo Nganjuk" 
                            style={{ width: '70px', height: 'auto' }} 
                        />
                    </div>
                    <div className="kop-text">
                        <div className="kop-header-1">PEMERINTAH KABUPATEN NGANJUK</div>
                        <div className="kop-header-2">DINAS KESEHATAN</div>
                        <div className="kop-header-3">RUMAH SAKIT UMUM DAERAH NGANJUK</div>
                        <div className="kop-address">
                            Jalan Dr. Soetomo Nomor 62 Nganjuk Kode Pos 64415<br />
                            Telp. (0358) 321818, 326474, 326652, 328429 Fax. (0358) 325003<br />
                            E-mail : infoyan@rsud.nganjukkab.go.id
                        </div>
                    </div>
                    <div style={{ width: '100px' }}></div>
                </div>
                <div className="kop-line"></div>

                {/* Judul Dokumen */}
                <div className="doc-title-box">
                    <div className="doc-title">BERITA ACARA PEMERIKSAAN PERANGKAT HARDWARE / SOFTWARE</div>
                    <div className="doc-number">Nomor : {aduan.report_number || '...... / ...... / ...... / 2026'}</div>
                </div>

                <div className="content-section">
                    <p style={{ marginBottom: '12px' }}>
                        Pada hari ini {aduan.report_date ? new Date(aduan.report_date).toLocaleDateString('id-ID', { weekday: 'long' }) : '....................'} tanggal {aduan.report_date ? new Date(aduan.report_date).getDate() : '......'} bulan {aduan.report_date ? new Date(aduan.report_date).toLocaleDateString('id-ID', { month: 'long' }) : '....'} tahun {aduan.report_date ? new Date(aduan.report_date).getFullYear() : '............'}, kami yang bertanda tangan di bawah ini :
                    </p>
                    
                    <table className="field-table">
                        <tbody>
                            <tr>
                                <td className="label-col">Nama</td>
                                <td className="separator-col">:</td>
                                <td>{aduan.technician || '................................................'}</td>
                            </tr>
                            <tr>
                                <td className="label-col">Jabatan</td>
                                <td className="separator-col">:</td>
                                <td>Teknisi IT</td>
                            </tr>
                            <tr>
                                <td colSpan="3" style={{ paddingTop: '10px' }}>Bertindak untuk dan atas nama : RSUD Nganjuk</td>
                            </tr>
                        </tbody>
                    </table>

                    <p style={{ marginBottom: '12px' }}>Telah melakukan pemeriksaan terhadap :</p>
                    
                    <table className="field-table">
                        <tbody>
                            <tr>
                                <td className="label-col">Jenis Barang/Aset</td>
                                <td className="separator-col">:</td>
                                <td>{aduan.asset_name || '................................................'}</td>
                            </tr>
                            <tr>
                                <td className="label-col">Merk/Type</td>
                                <td className="separator-col">:</td>
                                <td>{aduan.asset_brand || '................................................'}</td>
                            </tr>
                            <tr>
                                <td className="label-col">Nomor Inventaris</td>
                                <td className="separator-col">:</td>
                                <td>{aduan.inventory_number || '................................................'}</td>
                            </tr>
                            <tr>
                                <td className="label-col">Lokasi Barang</td>
                                <td className="separator-col">:</td>
                                <td>{aduan.asset_location || '................................................'}</td>
                            </tr>
                            <tr>
                                <td className="label-col">Pengguna</td>
                                <td className="separator-col">:</td>
                                <td>{aduan.asset_user || aduan.name || '................................................'}</td>
                            </tr>
                        </tbody>
                    </table>

                    <p style={{ marginBottom: '12px' }}>Dengan hasil sebagai berikut :</p>
                    
                    <div style={{ fontWeight: 'normal', marginBottom: '8px' }}>1. Jenis Kerusakan :</div>
                    <div className="checkbox-group">
                        <div className="checkbox-item">
                            <div className="check-box">{aduan.damage_type === 'Hardware' ? <i className="fa-solid fa-check"></i> : ''}</div>
                            <div>Hardware : {aduan.damage_type === 'Hardware' ? (aduan.damage_chronology || 'Terlampir') : ''}</div>
                        </div>
                        <div className="checkbox-item">
                            <div className="check-box">{aduan.damage_type === 'Software' ? <i className="fa-solid fa-check"></i> : ''}</div>
                            <div>Software : {aduan.damage_type === 'Software' ? (aduan.damage_chronology || 'Terlampir') : ''}</div>
                        </div>
                        <div className="checkbox-item">
                            <div className="check-box">{aduan.damage_type === 'Lainnya' ? <i className="fa-solid fa-check"></i> : ''}</div>
                            <div>Lainnya : {aduan.damage_type === 'Lainnya' ? (aduan.damage_chronology || 'Terlampir') : '_____________________________'}</div>
                        </div>
                    </div>
                    <div style={{ fontWeight: 'normal', marginBottom: '4px' }}>2. Kronologi/Riwayat Kerusakan :</div>
                    <div style={{ marginLeft: '20px', marginBottom: '8px' }}>
                        {aduan.damage_chronology || '................................................................................................................................................'}
                    </div>

                    <div style={{ fontWeight: 'normal', marginBottom: '8px' }}>3. Tindakan yang telah dilakukan :</div>
                    <div className="checkbox-group">
                        {[
                            { key: 'Perbaikan Ringan', label: 'Perbaikan Ringan' },
                            { key: 'Perbaikan Sedang', label: 'Perbaikan Sedang' },
                            { key: 'Perbaikan Berat', label: 'Perbaikan Berat' },
                            { key: 'Tidak Dapat Diperbaiki', label: 'Tidak Dapat Diperbaiki dan disarankan untuk dimusnahkan' },
                            { key: 'Kirim ke Vendor', label: 'Disarankan untuk dikembalikan ke vendor untuk perbaikan lebih lanjut.' }
                        ].map(item => (
                            <div key={item.key} className="checkbox-item">
                                <div className="check-box">{aduan.actions_taken === item.key ? <i className="fa-solid fa-check"></i> : ''}</div>
                                <div>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ fontWeight: 'normal', marginBottom: '8px' }}>Kesimpulan dan Saran :</div>
                    <p style={{ fontSize: '13px', marginBottom: '10px' }}>Berdasarkan pemeriksaan di atas, disimpulkan bahwa unit komputer dengan nomor inventaris tersebut :</p>
                    <div className="checkbox-group">
                        {[
                            { key: 'Dapat diperbaiki dengan penggantian sparepart', label: 'Dapat diperbaiki dengan penggantian sparepart ....................' },
                            { key: 'Tidak ekonomis untuk diperbaiki / penghapusan aset', label: 'Tidak ekonomis untuk diperbaiki dan disarankan untuk dilakukan proses penghapusan aset.' },
                            { key: 'Memerlukan perbaikan lebih lanjut oleh vendor', label: 'Memerlukan perbaikan lebih lanjut oleh vendor terdaftar.' }
                        ].map(item => (
                            <div key={item.key} className="checkbox-item">
                                <div className="check-box">{aduan.recommendation === item.key ? <i className="fa-solid fa-check"></i> : ''}</div>
                                <div>{item.label}</div>
                            </div>
                        ))}
                    </div>

                    <p style={{ marginTop: '20px' }}>
                        Demikian Berita Acara ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
                    </p>

                    <div style={{ textAlign: 'right', marginTop: '30px', marginRight: '50px' }}>
                        Nganjuk, {aduan.report_date ? new Date(aduan.report_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    </div>

                    <div className="signature-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '10px' }}>
                        <div className="signature-box" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '150px' }}>
                            <div>Pelapor</div>
                            <div className="signature-space" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px 0' }}>
                                {aduan.signature ? (
                                    <img src={aduan.signature} style={{ maxHeight: '110px', maxWidth: '200px', transform: 'scale(1.3)' }} alt="TTD" />
                                ) : null}
                            </div>
                            <div className="signature-name" style={{ margin: '0 20px', paddingTop: '0' }}>
                                {aduan.name ? aduan.name : '( .................... )'}
                            </div>
                        </div>

                        {/* Signature Box Kepala Ruang */}
                        <div className="signature-box" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '150px' }}>
                            <div>Kepala Ruang</div>
                            <div className="signature-space" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px 0' }}>
                                {aduan.kepala_ruang_signature ? (
                                    <img src={aduan.kepala_ruang_signature} style={{ maxHeight: '110px', maxWidth: '200px', transform: 'scale(1.3)' }} alt="TTD Kepala Ruang" />
                                ) : (
                                    <div style={{ height: '60px' }}></div>
                                )}
                            </div>
                            <div className="signature-name" style={{ margin: '0 20px', paddingTop: '0' }}>
                                {aduan.kepala_ruang_name ? (
                                    <>
                                        <strong style={{ color: '#000' }}>{aduan.kepala_ruang_name}</strong>
                                        {aduan.kepala_ruang_nip && <div style={{ fontSize: '10px', color: '#000' }}>NIP. {aduan.kepala_ruang_nip}</div>}
                                    </>
                                ) : (
                                    '( .................... )'
                                )}
                            </div>
                        </div>

                        <div className="signature-box" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '150px' }}>
                            <div>Ka ISIK</div>
                            <div className="signature-space" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px 0' }}>
                                {kaisikSignature ? (
                                    <img src={kaisikSignature} style={{ maxHeight: '110px', maxWidth: '200px', transform: 'scale(1.3)' }} alt="TTD Ka ISIK" />
                                ) : null}
                            </div>
                            <div className="signature-name" style={{ margin: '0 20px', paddingTop: '0' }}>
                                {kaisikName}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tanda Tangan Kepala Ruang */}
            {showSignModal && (
                <div className="no-print" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.65)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: '20px'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '480px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        overflow: 'hidden', display: 'flex', flexDirection: 'column'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px', borderBottom: '1px solid #E2E8F0',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E293B', margin: 0 }}>
                                Tanda Tangan Kepala Ruang
                            </h3>
                            <button 
                                onClick={() => setShowSignModal(false)}
                                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '18px' }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                                    Nama Kepala Ruang <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input 
                                    type="text"
                                    value={signName}
                                    onChange={e => setSignName(e.target.value)}
                                    placeholder="Masukkan nama Kepala Ruang"
                                    style={{
                                        width: '100%', padding: '8px 12px', borderRadius: '6px',
                                        border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box'
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                                    NIP Kepala Ruang (Opsional)
                                </label>
                                <input 
                                    type="text"
                                    value={signNip}
                                    onChange={e => setSignNip(e.target.value)}
                                    placeholder="Masukkan NIP Kepala Ruang"
                                    style={{
                                        width: '100%', padding: '8px 12px', borderRadius: '6px',
                                        border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '5px' }}>
                                    Gambarkan Tanda Tangan <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <div style={{ borderRadius: '6px', overflow: 'hidden' }}>
                                    <SignaturePad 
                                        onSave={(val) => setTempSignature(val)}
                                        onClear={() => setTempSignature(null)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            padding: '14px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC',
                            display: 'flex', justifyContent: 'flex-end', gap: '10px'
                        }}>
                            <button 
                                onClick={() => setShowSignModal(false)}
                                style={{
                                    padding: '8px 16px', background: '#fff', color: '#475569',
                                    border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
                                }}
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleSaveSignature}
                                disabled={(!tempSignature && !aduan.kepala_ruang_signature) || !signName}
                                style={{
                                    padding: '8px 16px', 
                                    background: ((tempSignature || aduan.kepala_ruang_signature) && signName) ? '#2563EB' : '#94A3B8', 
                                    color: '#fff',
                                    border: 'none', borderRadius: '6px', 
                                    cursor: ((tempSignature || aduan.kepala_ruang_signature) && signName) ? 'pointer' : 'not-allowed', 
                                    fontSize: '14px', fontWeight: '600'
                                }}
                            >
                                Simpan TTD
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
