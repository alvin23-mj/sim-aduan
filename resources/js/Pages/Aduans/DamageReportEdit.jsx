import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function DamageReportEdit({ aduan = {} }) {
    const { data, setData, patch, processing, errors } = useForm({
        asset_name: aduan.asset_name || '',
        asset_brand: aduan.asset_brand || '',
        inventory_number: aduan.inventory_number || '',
        asset_location: aduan.asset_location || aduan.unit || '',
        asset_user: aduan.asset_user || aduan.name || '',
        damage_type: aduan.damage_type || '',
        damage_chronology: aduan.damage_chronology || '',
        actions_taken: aduan.actions_taken || '',
        recommendation: aduan.recommendation || '',
        report_number: aduan.report_number || '',
        report_date: aduan.report_date || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(`/aduan/${aduan.id}`, {
            onSuccess: () => {
                if (window.showToast) {
                    window.showToast('Data berita acara berhasil disimpan.', 'success');
                } else {
                    alert('Data berita acara berhasil disimpan.');
                }
                router.get('/berita-acara');
            },
            onError: (err) => {
                console.error(err);
                if (window.showToast) {
                    window.showToast('Gagal menyimpan data. Pastikan semua input sudah benar.', 'error');
                } else {
                    alert('Gagal menyimpan data. Pastikan semua input sudah benar.');
                }
            }
        });
    };

    const errorStyle = {
        fontSize: '12px',
        color: '#D93025',
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    };

    return (
        <AdminLayout title="Edit Berita Acara Kerusakan">
            <Head title={`Edit Berita Acara - ${aduan.ticket_number}`} />

            <style>
                {`
                    /* Google Form Styling System for Admin Form */
                    .form-outer {
                        padding: 24px 16px;
                        background: #F0F4F9;
                        min-height: calc(100vh - 64px);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    .g-container {
                        width: 100%;
                        max-width: 680px;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        box-sizing: border-box;
                    }
                    .g-card {
                        background: #fff;
                        border: 1px solid #dadce0;
                        border-radius: 8px;
                        padding: 24px;
                        box-sizing: border-box;
                    }
                    .g-title {
                        font-size: 24px;
                        font-weight: normal;
                        color: #202124;
                        margin: 0 0 8px 0;
                        line-height: 1.25;
                    }
                    .g-subtitle {
                        font-size: 14px;
                        color: #202124;
                        line-height: 1.5;
                        margin: 0 0 16px 0;
                    }
                    .g-required-note {
                        font-size: 14px;
                        color: #D93025;
                        margin: 0;
                    }
                    .g-question-title {
                        font-size: 16px;
                        color: #202124;
                        display: block;
                        margin-bottom: 16px;
                        line-height: 1.3;
                        font-weight: normal;
                    }
                    .g-required-indicator {
                        color: #D93025;
                    }
                    .g-input-wrapper {
                        border-bottom: 1px solid #dadce0;
                        width: 50%;
                        min-width: 250px;
                        padding-bottom: 4px;
                        transition: border-bottom-color 0.2s;
                    }
                    .g-input-wrapper:focus-within {
                        border-bottom: 2px solid #2563EB;
                        padding-bottom: 3px;
                    }
                    .g-input-wrapper-full {
                        border-bottom: 1px solid #dadce0;
                        width: 100%;
                        padding-bottom: 4px;
                        transition: border-bottom-color 0.2s;
                    }
                    .g-input-wrapper-full:focus-within {
                        border-bottom: 2px solid #2563EB;
                        padding-bottom: 3px;
                    }
                    .g-input-field {
                        width: 100%;
                        border: none;
                        outline: none;
                        font-size: 14px;
                        font-family: 'Telex', sans-serif;
                        color: #202124;
                        padding: 4px 0;
                        background: transparent;
                    }
                    .g-textarea-field {
                        width: 100%;
                        border: none;
                        outline: none;
                        font-size: 14px;
                        font-family: 'Telex', sans-serif;
                        color: #202124;
                        padding: 4px 0;
                        resize: vertical;
                        background: transparent;
                    }
                    .g-select-field {
                        width: 50%;
                        min-width: 250px;
                        border: 1px solid #dadce0;
                        border-radius: 6px;
                        padding: 10px 12px;
                        font-size: 14px;
                        font-family: 'Telex', sans-serif;
                        outline: none;
                        color: #202124;
                        background: #fff;
                        cursor: pointer;
                        transition: border-color 0.2s;
                    }
                    .g-select-field:focus {
                        border-color: #2563EB;
                        border-width: 2px;
                        padding: 9px 11px;
                    }
                    .g-select-field-full {
                        width: 100%;
                        border: 1px solid #dadce0;
                        border-radius: 6px;
                        padding: 10px 12px;
                        font-size: 14px;
                        font-family: 'Telex', sans-serif;
                        outline: none;
                        color: #202124;
                        background: #fff;
                        cursor: pointer;
                        transition: border-color 0.2s;
                    }
                    .g-select-field-full:focus {
                        border-color: #2563EB;
                        border-width: 2px;
                        padding: 9px 11px;
                    }
                    .g-radio-input {
                        width: 20px;
                        height: 20px;
                        accent-color: #2563EB;
                        cursor: pointer;
                    }
                    .g-submit-btn {
                        background: #2563EB;
                        color: #fff;
                        border: none;
                        padding: 14px 24px;
                        border-radius: 6px;
                        font-size: 15px;
                        font-family: 'Telex', sans-serif;
                        cursor: pointer;
                        transition: background 0.2s;
                        box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
                        width: auto;
                    }
                    .g-submit-btn:hover {
                        background: #1D4ED8;
                    }
                `}
            </style>

            <div className="form-outer" style={{ fontFamily: "'Telex', sans-serif" }}>
                <div className="g-container">
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                        <Link
                            href="/berita-acara"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: '#E2E8F0',
                                color: '#334155',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#CBD5E1';
                                e.currentTarget.style.color = '#1E293B';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#E2E8F0';
                                e.currentTarget.style.color = '#334155';
                            }}
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            Kembali ke Daftar
                        </Link>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                        
                        {/* CARD 1: Header / Title Card */}
                        <div className="g-card">
                            <h1 className="g-title">Formulir Berita Acara: {aduan.ticket_number}</h1>
                            <p className="g-subtitle">
                                Lengkapi rincian pemeriksaan aset untuk dokumen resmi.
                            </p>
                            <div style={{ borderTop: '1px solid #dadce0', paddingTop: '12px' }}>
                                <p className="g-required-note">* Menunjukkan pertanyaan yang wajib diisi</p>
                            </div>
                        </div>

                        {/* CARD 2: Nomor Surat */}
                        <div className="g-card">
                            <label className="g-question-title">
                                Nomor Surat <span className="g-required-indicator">*</span>
                            </label>
                            <div className="g-input-wrapper-full">
                                <input 
                                    type="text" 
                                    value={data.report_number} 
                                    onChange={e => setData('report_number', e.target.value)} 
                                    placeholder="Contoh: 001/IT/V/2026" 
                                    className="g-input-field"
                                    required
                                />
                            </div>
                            {errors.report_number && (
                                <div style={errorStyle}>
                                    <i className="fa-solid fa-circle-exclamation"></i> {errors.report_number}
                                </div>
                            )}
                        </div>

                        {/* CARD 3: Tanggal Pemeriksaan */}
                        <div className="g-card">
                            <label className="g-question-title">
                                Tanggal Pemeriksaan <span className="g-required-indicator">*</span>
                            </label>
                            <div className="g-input-wrapper">
                                <input 
                                    type="date" 
                                    value={data.report_date} 
                                    onChange={e => setData('report_date', e.target.value)} 
                                    className="g-input-field"
                                    required
                                />
                            </div>
                            {errors.report_date && (
                                <div style={errorStyle}>
                                    <i className="fa-solid fa-circle-exclamation"></i> {errors.report_date}
                                </div>
                            )}
                        </div>

                        {/* CARD 4: Jenis Barang/Aset */}
                        <div className="g-card">
                            <label className="g-question-title">
                                Jenis Barang/Aset <span className="g-required-indicator">*</span>
                            </label>
                            <div className="g-input-wrapper-full">
                                <input 
                                    type="text" 
                                    value={data.asset_name} 
                                    onChange={e => setData('asset_name', e.target.value)} 
                                    placeholder="Contoh: PC, Printer" 
                                    className="g-input-field"
                                    required
                                />
                            </div>
                            {errors.asset_name && (
                                <div style={errorStyle}>
                                    <i className="fa-solid fa-circle-exclamation"></i> {errors.asset_name}
                                </div>
                            )}
                        </div>

                        {/* CARD 5: Merk/Type */}
                        <div className="g-card">
                            <label className="g-question-title">
                                Merk/Type <span className="g-required-indicator">*</span>
                            </label>
                            <div className="g-input-wrapper-full">
                                <input 
                                    type="text" 
                                    value={data.asset_brand} 
                                    onChange={e => setData('asset_brand', e.target.value)} 
                                    placeholder="Contoh: HP, ASUS" 
                                    className="g-input-field"
                                    required
                                />
                            </div>
                            {errors.asset_brand && (
                                <div style={errorStyle}>
                                    <i className="fa-solid fa-circle-exclamation"></i> {errors.asset_brand}
                                </div>
                            )}
                        </div>

                        {/* CARD 6: Nomor Inventaris */}
                        <div className="g-card">
                            <label className="g-question-title">
                                Nomor Inventaris <span className="g-required-indicator">*</span>
                            </label>
                            <div className="g-input-wrapper-full">
                                <input 
                                    type="text" 
                                    value={data.inventory_number} 
                                    onChange={e => setData('inventory_number', e.target.value)} 
                                    placeholder="No. Aset" 
                                    className="g-input-field"
                                    required
                                />
                            </div>
                            {errors.inventory_number && (
                                <div style={errorStyle}>
                                    <i className="fa-solid fa-circle-exclamation"></i> {errors.inventory_number}
                                </div>
                            )}
                        </div>

                        {/* CARD 7: Lokasi */}
                        <div className="g-card">
                            <label className="g-question-title">
                                Lokasi <span className="g-required-indicator">*</span>
                            </label>
                            <div className="g-input-wrapper-full">
                                <input 
                                    type="text" 
                                    value={data.asset_location} 
                                    onChange={e => setData('asset_location', e.target.value)} 
                                    placeholder="Contoh: Sedudo, Ruang IT" 
                                    className="g-input-field"
                                    required
                                />
                            </div>
                            {errors.asset_location && (
                                <div style={errorStyle}>
                                    <i className="fa-solid fa-circle-exclamation"></i> {errors.asset_location}
                                </div>
                            )}
                        </div>

                        {/* CARD 8: Jenis Kerusakan */}
                        <div className="g-card">
                            <label className="g-question-title">
                                Jenis Kerusakan <span className="g-required-indicator">*</span>
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {['Hardware', 'Software', 'Lainnya'].map(type => (
                                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: '#202124' }}>
                                        <input
                                            type="radio"
                                            name="damage_type"
                                            checked={data.damage_type === type}
                                            onChange={() => setData('damage_type', type)}
                                            className="g-radio-input"
                                            required
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.damage_type && (
                                <div style={errorStyle}>
                                    <i className="fa-solid fa-circle-exclamation"></i> {errors.damage_type}
                                </div>
                            )}
                        </div>

                        {/* CARD 9: Kronologi Kerusakan */}
                        <div className="g-card">
                            <label className="g-question-title">
                                Kronologi Kerusakan <span className="g-required-indicator">*</span>
                            </label>
                            <div className="g-input-wrapper-full">
                                <textarea
                                    value={data.damage_chronology}
                                    onChange={e => setData('damage_chronology', e.target.value)}
                                    placeholder="Jelaskan bagaimana kerusakan terjadi secara detail..."
                                    rows={4}
                                    className="g-textarea-field"
                                    required
                                />
                            </div>
                            {errors.damage_chronology && (
                                <div style={errorStyle}>
                                    <i className="fa-solid fa-circle-exclamation"></i> {errors.damage_chronology}
                                </div>
                            )}
                        </div>

                        {/* CARD 10: Tindakan Terakhir */}
                        <div className="g-card">
                            <label className="g-question-title">
                                Tindakan Terakhir <span className="g-required-indicator">*</span>
                            </label>
                            <select 
                                value={data.actions_taken} 
                                onChange={e => setData('actions_taken', e.target.value)} 
                                className="g-select-field-full"
                                required
                            >
                                <option value="">Pilih Tindakan</option>
                                <option value="Perbaikan Ringan">Perbaikan Ringan</option>
                                <option value="Perbaikan Sedang">Perbaikan Sedang</option>
                                <option value="Perbaikan Berat">Perbaikan Berat</option>
                                <option value="Tidak Dapat Diperbaiki">Tidak Dapat Diperbaiki</option>
                                <option value="Kirim ke Vendor">Kirim ke Vendor</option>
                            </select>
                            {errors.actions_taken && (
                                <div style={errorStyle}>
                                    <i className="fa-solid fa-circle-exclamation"></i> {errors.actions_taken}
                                </div>
                            )}
                        </div>

                        {/* CARD 11: Kesimpulan & Saran */}
                        <div className="g-card">
                            <label className="g-question-title">
                                Kesimpulan & Saran <span className="g-required-indicator">*</span>
                            </label>
                            <select 
                                value={data.recommendation} 
                                onChange={e => setData('recommendation', e.target.value)} 
                                className="g-select-field-full"
                                required
                            >
                                <option value="">Pilih Rekomendasi</option>
                                <option value="Dapat diperbaiki dengan penggantian sparepart">Dapat diperbaiki dengan penggantian sparepart</option>
                                <option value="Tidak ekonomis untuk diperbaiki / penghapusan aset">Tidak ekonomis untuk diperbaiki / penghapusan aset</option>
                                <option value="Memerlukan perbaikan lebih lanjut oleh vendor">Memerlukan perbaikan lebih lanjut oleh vendor</option>
                            </select>
                            {errors.recommendation && (
                                <div style={errorStyle}>
                                    <i className="fa-solid fa-circle-exclamation"></i> {errors.recommendation}
                                </div>
                            )}
                        </div>

                        {/* CARD 12: Tanda Tangan Pengadu */}
                        {aduan.signature && (
                            <div className="g-card">
                                <label className="g-question-title" style={{ marginBottom: '8px' }}>
                                    Tanda Tangan Pengadu (Terdaftar)
                                </label>
                                <p style={{ fontSize: '12px', color: '#5f6368', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                                    Tanda tangan ini diambil secara otomatis dari data pengaduan awal.
                                </p>
                                <div style={{ border: '1px solid #dadce0', borderRadius: '4px', overflow: 'hidden', padding: '10px', background: '#fff', display: 'inline-block' }}>
                                    <img src={aduan.signature} alt="TTD Pengadu" style={{ maxHeight: '100px', display: 'block' }} />
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-start' }}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="g-submit-btn"
                            >
                                {processing ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Berita Acara'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
