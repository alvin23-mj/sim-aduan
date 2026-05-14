import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import SignaturePad from '@/Components/SignaturePad';

const baseStyle = {
    fontFamily: "'Telex', sans-serif",
    fontSize: '14px',
};

const errorStyle = {
    fontSize: '12px',
    color: '#EF4444',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
};

export default function BuatAduan({ categories = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        unit: '',
        category: '',
        subject: '',
        description: '',
        signature: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pelapor.store-aduan'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout title="Buat Laporan Baru">
            <Head title="Buat Laporan Baru - SIM Aduan" />

            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Intro Card */}
                    <div style={{
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E293B', margin: '0 0 8px 0' }}>
                            Formulir Pengaduan Kendala IT
                        </h3>
                        <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
                            Silakan laporkan kendala atau kerusakan perangkat/aplikasi IT di unit kerja Anda. Identitas pelapor Anda akan secara otomatis terlampir pada sistem.
                        </p>
                    </div>

                    {/* Card 1: Unit / Ruangan */}
                    <div style={{
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '10px' }}>
                            Unit / Ruangan Kerja <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <input 
                            type="text" 
                            value={data.unit} 
                            onChange={e => setData('unit', e.target.value)} 
                            placeholder="Contoh: Ruang UGD, Poli Anak, Keuangan" 
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                outline: 'none',
                                fontSize: '14px',
                                fontFamily: "'Telex', sans-serif",
                            }}
                            required
                        />
                        {errors.unit && (
                            <div style={errorStyle}>
                                <i className="fa-solid fa-circle-exclamation"></i> {errors.unit}
                            </div>
                        )}
                    </div>

                    {/* Card 2: Kategori */}
                    <div style={{
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '10px' }}>
                            Kategori Kerusakan / Kendala <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <select 
                            value={data.category} 
                            onChange={e => setData('category', e.target.value)} 
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                outline: 'none',
                                background: '#fff',
                                fontSize: '14px',
                                fontFamily: "'Telex', sans-serif",
                            }}
                            required
                        >
                            <option value="">Pilih Kategori Kendala</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <div style={errorStyle}>
                                <i className="fa-solid fa-circle-exclamation"></i> {errors.category}
                            </div>
                        )}
                    </div>

                    {/* Card 3: Uraian Kerusakan */}
                    <div style={{
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '10px' }}>
                            Uraian Kerusakan <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Jelaskan secara rinci kendala atau kerusakan yang terjadi..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                outline: 'none',
                                resize: 'vertical',
                                fontSize: '14px',
                                fontFamily: "'Telex', sans-serif",
                            }}
                            required
                        />
                        {errors.description && (
                            <div style={errorStyle}>
                                <i className="fa-solid fa-circle-exclamation"></i> {errors.description}
                            </div>
                        )}
                    </div>

                    {/* Card 5: Tanda Tangan Digital */}
                    <div style={{
                        background: '#fff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#1E293B', marginBottom: '4px' }}>
                            Tanda Tangan Digital <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                            Bubuhkan tanda tangan Anda pada area di bawah ini sebagai verifikasi keaslian pengaduan.
                        </p>
                        <div style={{ border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden', background: '#F8FAFC' }}>
                            <SignaturePad 
                                onSave={(val) => setData('signature', val)} 
                                onClear={() => setData('signature', '')} 
                            />
                        </div>
                        {errors.signature && (
                            <div style={errorStyle}>
                                <i className="fa-solid fa-circle-exclamation"></i> {errors.signature}
                            </div>
                        )}
                    </div>

                    {/* Form Submission Buttons */}
                    <div className="form-actions-mobile" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px', marginBottom: '40px' }}>
                        <button
                            type="button"
                            onClick={() => reset()}
                            style={{
                                background: '#fff',
                                border: '1px solid #CBD5E1',
                                color: '#475569',
                                padding: '10px 20px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontFamily: "'Telex', sans-serif",
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                        >
                            Reset Form
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                background: '#2563EB',
                                border: 'none',
                                color: '#fff',
                                padding: '10px 24px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontFamily: "'Telex', sans-serif",
                                transition: 'background 0.15s',
                                boxShadow: '0 2px 4px rgba(37,99,235,0.15)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; }}
                        >
                            {processing ? 'Mengirim...' : 'Kirim Laporan'}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}
