import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import SignaturePad from '@/Components/SignaturePad';

export default function SpkEdit({ aduan = {}, technicians = [] }) {
    const { data, setData, patch, processing, errors } = useForm({
        unit: aduan?.unit || '',
        asset_name: aduan?.asset_name || '',
        asset_brand: aduan?.asset_brand || '',
        description: aduan?.description || '',
        damage_chronology: aduan?.damage_chronology || '',
        actions_taken: aduan?.actions_taken || '',
        priority: aduan?.priority || 'ringan',
        satisfaction: aduan?.satisfaction || 'puas',
        recommendation: aduan?.recommendation || '',
        report_number: aduan?.report_number || '',
        kepala_ruang_name: aduan?.kepala_ruang_name || '',
        kepala_ruang_nip: aduan?.kepala_ruang_nip || '',
        kepala_ruang_signature: aduan?.kepala_ruang_signature || null,
        technician_nip: aduan?.technician_nip || '',
        kaisik_name: aduan?.kaisik_name || '',
        kaisik_nip: aduan?.kaisik_nip || '',
    });

    const [showSignModal, setShowSignModal] = useState(false);
    const [tempSignature, setTempSignature] = useState(null);

    const assignedTechnicians = aduan?.technician
        ? aduan.technician.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    const selectedTechnicianName = assignedTechnicians.length > 0 ? assignedTechnicians[0] : '';

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('aduan.update', aduan.id), {
            onSuccess: () => {
                window.location.href = route('aduan.spkReport', aduan.id);
            }
        });
    };

    return (
        <AdminLayout title="Edit Form SPK">
            <Head title={`Edit SPK - ${aduan.ticket_number}`} />

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
                        href={route('aduan.spkReport', aduan.id)}
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
                        <i className="fa-solid fa-arrow-left"></i> Kembali ke SPK
                    </Link>
                </div>

                <div style={{ maxWidth: '770px', margin: '0 auto', paddingBottom: '40px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Header Card */}
                    <div style={{
                        background: '#fff', padding: '30px', borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
                        display: 'flex', flexDirection: 'column', gap: '12px'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1E293B' }}>Edit Form SPK</h3>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '14px' }}>Silakan perbarui data Surat Perintah Kerja (SPK) di bawah ini.</p>
                    </div>

                    {/* Identitas Card */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Nomor Surat (NO. SPK)</label>
                                <input
                                    type="text"
                                    value={data.report_number}
                                    onChange={e => setData('report_number', e.target.value)}
                                    placeholder="Contoh: 005/SPK/ISIK/2026"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Ruang / Instalasi</label>
                                <input
                                    type="text"
                                    value={data.unit}
                                    onChange={e => setData('unit', e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Detail Barang Card */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Nama Barang</label>
                                <input
                                    type="text"
                                    value={data.asset_name}
                                    onChange={e => setData('asset_name', e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Tipe / Merk</label>
                                <input
                                    type="text"
                                    value={data.asset_brand}
                                    onChange={e => setData('asset_brand', e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kerusakan Awal Card */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Kerusakan Awal</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                        />
                    </div>

                    {/* Analisa Kerusakan Card */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>1. Analisa Kerusakan</label>
                        <textarea
                            value={data.damage_chronology}
                            onChange={e => setData('damage_chronology', e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                        />
                    </div>

                    {/* Tindak Lanjut Card */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>2. Tindak Lanjut</label>
                        <textarea
                            value={data.actions_taken}
                            onChange={e => setData('actions_taken', e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                        />
                    </div>

                    {/* Penilaian Card */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '12px' }}>3. Tingkat Kerusakan</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {[
                                        { value: 'ringan', label: 'Ringan' },
                                        { value: 'sedang', label: 'Sedang' },
                                        { value: 'berat', label: 'Berat' }
                                    ].map(p => (
                                        <label key={p.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={p.value}
                                                checked={data.priority === p.value}
                                                onChange={() => setData('priority', p.value)}
                                                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#2563EB' }}
                                            />
                                            {p.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '12px' }}>4. Tingkat Kepuasan</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {[
                                        { value: 'puas', label: 'Puas' },
                                        { value: 'tidak_puas', label: 'Tidak Puas' }
                                    ].map(s => (
                                        <label key={s.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#334155' }}>
                                            <input
                                                type="radio"
                                                name="satisfaction"
                                                value={s.value}
                                                checked={data.satisfaction === s.value}
                                                onChange={() => setData('satisfaction', s.value)}
                                                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#2563EB' }}
                                            />
                                            {s.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Saran Card */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>5. Saran</label>
                        <textarea
                            value={data.recommendation}
                            onChange={e => setData('recommendation', e.target.value)}
                            rows={3}
                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                        />
                    </div>

                    {/* Informasi Tanda Tangan & NIP Card */}
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)' }}>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 'bold', color: '#1E293B' }}>
                            Informasi Tanda Tangan & NIP
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Nama Kepala Ruang</label>
                                <input
                                    type="text"
                                    value={data.kepala_ruang_name}
                                    onChange={e => setData('kepala_ruang_name', e.target.value)}
                                    placeholder="Contoh: dr. Budi Santoso"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>NIP Kepala Ruang</label>
                                <input
                                    type="text"
                                    value={data.kepala_ruang_nip}
                                    onChange={e => setData('kepala_ruang_nip', e.target.value)}
                                    placeholder="Contoh: 19800101 200501 1 001"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Tanda Tangan Kepala Ruang</label>
                            <button
                                type="button"
                                onClick={() => setShowSignModal(true)}
                                style={{
                                    padding: '10px 20px',
                                    background: data.kepala_ruang_signature ? '#F0FDF4' : '#F8FAFC',
                                    color: data.kepala_ruang_signature ? '#166534' : '#475569',
                                    border: `1px solid ${data.kepala_ruang_signature ? '#BBF7D0' : '#E2E8F0'}`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontWeight: '500',
                                    width: 'fit-content'
                                }}
                            >
                                <i className={`fa-solid ${data.kepala_ruang_signature ? 'fa-check-circle' : 'fa-pen-nib'}`}></i>
                                {data.kepala_ruang_signature ? 'TTD Tersimpan (Klik untuk Edit)' : 'Tambah Tanda Tangan Kepala Ruang'}
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Nama Petugas/Teknisi</label>
                                <input
                                    type="text"
                                    value={selectedTechnicianName || aduan.technician || ''}
                                    disabled
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '14px', outline: 'none', background: '#F8FAFC', color: '#94A3B8' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>NIP Petugas/Teknisi</label>
                                <input
                                    type="text"
                                    value={data.technician_nip}
                                    onChange={e => setData('technician_nip', e.target.value)}
                                    placeholder="Contoh: 19850202 201001 2 002"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>Nama Ka. ISIK RS</label>
                                <input
                                    type="text"
                                    value={data.kaisik_name}
                                    onChange={e => setData('kaisik_name', e.target.value)}
                                    placeholder="Contoh: Ari, S.Kom"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1E293B', marginBottom: '8px' }}>NIP Ka. ISIK RS</label>
                                <input
                                    type="text"
                                    value={data.kaisik_nip}
                                    onChange={e => setData('kaisik_nip', e.target.value)}
                                    placeholder="Contoh: 19780303 200801 1 003"
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <Link
                            href={route('aduan.spkReport', aduan.id)}
                            style={{ padding: '10px 20px', background: '#fff', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            style={{ padding: '10px 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
            </div>

            {/* Modal Tanda Tangan Kepala Ruang */}
            {showSignModal && (
                <div style={{
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
                                type="button"
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
                                type="button"
                                onClick={() => setShowSignModal(false)}
                                style={{
                                    padding: '8px 16px', background: '#fff', color: '#475569',
                                    border: '1px solid #E2E8F0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
                                }}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (tempSignature) {
                                        setData('kepala_ruang_signature', tempSignature);
                                        setShowSignModal(false);
                                    } else {
                                        alert('Silakan gambar tanda tangan terlebih dahulu.');
                                    }
                                }}
                                disabled={!tempSignature}
                                style={{
                                    padding: '8px 16px',
                                    background: tempSignature ? '#2563EB' : '#94A3B8',
                                    color: '#fff',
                                    border: 'none', borderRadius: '6px',
                                    cursor: tempSignature ? 'pointer' : 'not-allowed',
                                    fontSize: '14px', fontWeight: '600'
                                }}
                            >
                                Terapkan TTD
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
