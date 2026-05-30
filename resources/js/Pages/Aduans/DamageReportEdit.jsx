import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function DamageReportEdit({ aduan = {} }) {
    const { data, setData, patch, processing, errors } = useForm({
        asset_name: aduan.asset_name || '',
        asset_brand: aduan.asset_brand || '',
        inventory_number: aduan.inventory_number || '',
        asset_location: aduan.asset_location || aduan.unit || '',
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

    const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none' };
    const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' };
    const cardStyle = { background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' };
    
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
                    .back-btn-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                    @media (max-width: 1200px) {
                        .back-btn-container {
                            position: static !important;
                            margin-bottom: 16px !important;
                        }
                    }
                `}
            </style>

            <div style={{ position: 'relative', width: '100%' }}>
                <div className="back-btn-container">
                    <Link
                        href="/berita-acara"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#64748B',
                            fontSize: '14px',
                            textDecoration: 'none',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            background: '#fff',
                            padding: '8px 16px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '6px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#0F172A'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748B'; }}
                    >
                        <i className="fa-solid fa-arrow-left"></i> Kembali ke Daftar
                    </Link>
                </div>

                <div style={{ maxWidth: '770px', margin: '0 auto', paddingBottom: '40px' }}>
                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Header Card */}
                    <div style={{
                        background: '#fff', padding: '30px', borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
                        display: 'flex', flexDirection: 'column', gap: '12px'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>Formulir Berita Acara: {aduan.ticket_number}</h3>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Lengkapi rincian pemeriksaan aset untuk dokumen resmi.</p>
                    </div>

                    {/* Informasi Surat & Tanggal */}
                    <div style={cardStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Nomor Surat <span style={{color: '#D93025'}}>*</span></label>
                                <input 
                                    type="text" 
                                    value={data.report_number} 
                                    onChange={e => setData('report_number', e.target.value)} 
                                    placeholder="Contoh: 001/IT/V/2026" 
                                    style={inputStyle}
                                    required
                                />
                                {errors.report_number && <div style={errorStyle}><i className="fa-solid fa-circle-exclamation"></i> {errors.report_number}</div>}
                            </div>
                            <div>
                                <label style={labelStyle}>Tanggal Pemeriksaan <span style={{color: '#D93025'}}>*</span></label>
                                <input 
                                    type="date" 
                                    value={data.report_date} 
                                    onChange={e => setData('report_date', e.target.value)} 
                                    style={inputStyle}
                                    required
                                />
                                {errors.report_date && <div style={errorStyle}><i className="fa-solid fa-circle-exclamation"></i> {errors.report_date}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Detail Aset */}
                    <div style={cardStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={labelStyle}>Jenis Barang/Aset <span style={{color: '#D93025'}}>*</span></label>
                                <input 
                                    type="text" 
                                    value={data.asset_name} 
                                    onChange={e => setData('asset_name', e.target.value)} 
                                    placeholder="Contoh: PC, Printer" 
                                    style={inputStyle}
                                    required
                                />
                                {errors.asset_name && <div style={errorStyle}><i className="fa-solid fa-circle-exclamation"></i> {errors.asset_name}</div>}
                            </div>
                            <div>
                                <label style={labelStyle}>Merk/Type <span style={{color: '#D93025'}}>*</span></label>
                                <input 
                                    type="text" 
                                    value={data.asset_brand} 
                                    onChange={e => setData('asset_brand', e.target.value)} 
                                    placeholder="Contoh: HP, ASUS" 
                                    style={inputStyle}
                                    required
                                />
                                {errors.asset_brand && <div style={errorStyle}><i className="fa-solid fa-circle-exclamation"></i> {errors.asset_brand}</div>}
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Nomor Inventaris <span style={{color: '#D93025'}}>*</span></label>
                                <input 
                                    type="text" 
                                    value={data.inventory_number} 
                                    onChange={e => setData('inventory_number', e.target.value)} 
                                    placeholder="No. Aset" 
                                    style={inputStyle}
                                    required
                                />
                                {errors.inventory_number && <div style={errorStyle}><i className="fa-solid fa-circle-exclamation"></i> {errors.inventory_number}</div>}
                            </div>
                            <div>
                                <label style={labelStyle}>Lokasi <span style={{color: '#D93025'}}>*</span></label>
                                <input 
                                    type="text" 
                                    value={data.asset_location} 
                                    onChange={e => setData('asset_location', e.target.value)} 
                                    placeholder="Contoh: Sedudo, Ruang IT" 
                                    style={inputStyle}
                                    required
                                />
                                {errors.asset_location && <div style={errorStyle}><i className="fa-solid fa-circle-exclamation"></i> {errors.asset_location}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Kerusakan */}
                    <div style={cardStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Jenis Kerusakan <span style={{color: '#D93025'}}>*</span></label>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    {['Hardware', 'Software', 'Lainnya'].map(type => (
                                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>
                                            <input
                                                type="radio"
                                                name="damage_type"
                                                checked={data.damage_type === type}
                                                onChange={() => setData('damage_type', type)}
                                                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#2563EB' }}
                                                required
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                                {errors.damage_type && <div style={errorStyle}><i className="fa-solid fa-circle-exclamation"></i> {errors.damage_type}</div>}
                            </div>
                            
                            <div>
                                <label style={labelStyle}>Kronologi Kerusakan <span style={{color: '#D93025'}}>*</span></label>
                                <textarea
                                    value={data.damage_chronology}
                                    onChange={e => setData('damage_chronology', e.target.value)}
                                    placeholder="Jelaskan bagaimana kerusakan terjadi secara detail..."
                                    rows={3}
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                    required
                                />
                                {errors.damage_chronology && <div style={errorStyle}><i className="fa-solid fa-circle-exclamation"></i> {errors.damage_chronology}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Tindakan & Saran */}
                    <div style={cardStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            <div>
                                <label style={labelStyle}>Tindakan Terakhir <span style={{color: '#D93025'}}>*</span></label>
                                <select 
                                    value={data.actions_taken} 
                                    onChange={e => setData('actions_taken', e.target.value)} 
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Pilih Tindakan</option>
                                    <option value="Perbaikan Ringan">Perbaikan Ringan</option>
                                    <option value="Perbaikan Sedang">Perbaikan Sedang</option>
                                    <option value="Perbaikan Berat">Perbaikan Berat</option>
                                    <option value="Tidak Dapat Diperbaiki">Tidak Dapat Diperbaiki</option>
                                    <option value="Kirim ke Vendor">Kirim ke Vendor</option>
                                </select>
                                {errors.actions_taken && <div style={errorStyle}><i className="fa-solid fa-circle-exclamation"></i> {errors.actions_taken}</div>}
                            </div>

                            <div>
                                <label style={labelStyle}>Kesimpulan & Saran <span style={{color: '#D93025'}}>*</span></label>
                                <select 
                                    value={data.recommendation} 
                                    onChange={e => setData('recommendation', e.target.value)} 
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Pilih Rekomendasi</option>
                                    <option value="Dapat diperbaiki dengan penggantian sparepart">Dapat diperbaiki dengan penggantian sparepart</option>
                                    <option value="Tidak ekonomis untuk diperbaiki / penghapusan aset">Tidak ekonomis untuk diperbaiki / penghapusan aset</option>
                                    <option value="Memerlukan perbaikan lebih lanjut oleh vendor">Memerlukan perbaikan lebih lanjut oleh vendor</option>
                                </select>
                                {errors.recommendation && <div style={errorStyle}><i className="fa-solid fa-circle-exclamation"></i> {errors.recommendation}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Tanda Tangan Pengadu */}
                    {aduan.signature && (
                        <div style={cardStyle}>
                            <label style={labelStyle}>Tanda Tangan Pengadu (Terdaftar)</label>
                            <p style={{ margin: '0 0 16px 0', color: '#64748B', fontSize: '13px' }}>
                                Tanda tangan ini diambil secara otomatis dari data pengaduan awal.
                            </p>
                            <div style={{ border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden', padding: '10px', background: '#F8FAFC', display: 'inline-block' }}>
                                <img src={aduan.signature} alt="TTD Pengadu" style={{ maxHeight: '100px', display: 'block' }} />
                            </div>
                        </div>
                    )}

                    {/* Actions Card */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <Link
                            href="/berita-acara"
                            style={{ padding: '10px 20px', background: '#fff', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            style={{ padding: '10px 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan Berita Acara'}
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </AdminLayout>
    );
}
