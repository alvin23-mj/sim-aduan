import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import SignaturePad from '@/Components/SignaturePad';
import LocalPagination from '@/Components/LocalPagination';

const cardStyle = {
    background: '#fff',
    borderRadius: '4px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
};

const tableHeaderStyle = {
    padding: '16px',
    fontSize: '14px',
    fontWeight: '400',
    color: '#64748B',
    border: '1px solid #E2E8F0',
    textAlign: 'left',
    background: '#F8FAFC',
};

const tableCellStyle = {
    padding: '16px',
    fontSize: '14px',
    color: '#1E293B',
    border: '1px solid #E2E8F0',
    fontWeight: '400',
};

const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Telex',
    fontWeight: '400',
    background: '#fff',
};

export default function Index({ technicians }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTechnician, setEditingTechnician] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 10;

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        phone: '',
        specialty: '',
        is_active: true,
        signature: '',
        email: '',
        password: '',
    });

    const openModal = (tech = null) => {
        if (tech) {
            setEditingTechnician(tech);
            setData({
                name: tech.name,
                phone: tech.phone || '',
                specialty: tech.specialty || '',
                is_active: tech.is_active,
                signature: tech.signature || '',
                email: tech.user?.email || '',
                password: '',
            });
        } else {
            setEditingTechnician(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingTechnician) {
            patch(route('technicians.update', editingTechnician.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('technicians.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteTech = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus teknisi ini? Jika ada akun login terkait, akun tersebut juga akan dihapus.')) {
            router.delete(route('technicians.destroy', id));
        }
    };

    return (
        <AdminLayout title="Manajemen Teknisi">
            <Head title="Manajemen Teknisi - SIM Aduan" />

            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-start' }}>
                <button 
                    onClick={() => openModal()}
                    style={{ 
                        padding: '10px 24px', 
                        background: '#2563EB', 
                        color: '#fff', 
                        borderRadius: '4px', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '400',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <i className="fa-solid fa-plus"></i>
                    Tambah Teknisi
                </button>
            </div>

            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ ...tableHeaderStyle, width: '60px', textAlign: 'center' }}>No</th>
                                <th style={tableHeaderStyle}>Nama Teknisi</th>
                                <th style={tableHeaderStyle}>Akun Login</th>
                                <th style={tableHeaderStyle}>Spesialisasi</th>
                                <th style={tableHeaderStyle}>No. WhatsApp</th>
                                <th style={{ ...tableHeaderStyle, width: '140px', textAlign: 'center' }}>Tanda Tangan</th>
                                <th style={{ ...tableHeaderStyle, width: '120px', textAlign: 'center' }}>Status</th>
                                <th style={{ ...tableHeaderStyle, width: '150px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const paginated = technicians.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
                                if (paginated.length === 0) return (
                                    <tr>
                                        <td colSpan="8" style={{ ...tableCellStyle, textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                                            Belum ada data teknisi.
                                        </td>
                                    </tr>
                                );
                                return paginated.map((tech, index) => (
                                    <tr key={tech.id}>
                                        <td style={{ ...tableCellStyle, textAlign: 'center', color: '#94A3B8' }}>{(currentPage - 1) * PER_PAGE + index + 1}</td>
                                    <td style={tableCellStyle}>
                                        <div style={{ fontWeight: '500' }}>{tech.name}</div>
                                    </td>
                                    <td style={tableCellStyle}>
                                        {tech.user ? (
                                            <div>
                                                <div style={{ fontWeight: '500', color: '#1E293B' }}>
                                                    {tech.user.email}
                                                </div>
                                                <span style={{ fontSize: '10px', background: '#ECFDF5', color: '#059669', padding: '1px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px', fontWeight: '500' }}>Aktif</span>
                                            </div>
                                        ) : (
                                            <span style={{ color: '#94A3B8', fontSize: '13px', fontStyle: 'italic' }}>Belum memiliki akun</span>
                                        )}
                                    </td>
                                    <td style={tableCellStyle}>{tech.specialty || '-'}</td>
                                    <td style={tableCellStyle}>{tech.phone || '-'}</td>
                                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                        {tech.signature ? (
                                            <div style={{ display: 'inline-block', padding: '4px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                                                <img 
                                                    src={tech.signature} 
                                                    alt={`Ttd ${tech.name}`} 
                                                    style={{ maxHeight: '35px', maxWidth: '100px', display: 'block', objectFit: 'contain', margin: '0 auto' }} 
                                                />
                                            </div>
                                        ) : (
                                            <span style={{ color: '#94A3B8', fontSize: '13px' }}>Belum ada</span>
                                        )}
                                    </td>
                                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            background: tech.is_active ? '#F0FDF4' : '#F1F5F9',
                                            color: tech.is_active ? '#10B981' : '#64748B',
                                            fontSize: '13px',
                                            borderRadius: '4px',
                                            display: 'inline-block'
                                        }}>
                                            {tech.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <button 
                                                onClick={() => openModal(tech)}
                                                style={{
                                                    width: '32px', height: '32px',
                                                    background: '#F8FAFC',
                                                    border: '1px solid #E2E8F0',
                                                    color: '#2563EB',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </button>
                                            <button 
                                                onClick={() => deleteTech(tech.id)}
                                                style={{
                                                    width: '32px', height: '32px',
                                                    background: '#FEF2F2',
                                                    border: '1px solid #FEE2E2',
                                                    color: '#EF4444',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                <i className="fa-regular fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                    </tr>
                                ));
                            })()}
                        </tbody>
                    </table>
                </div>
                <LocalPagination
                    totalItems={technicians.length}
                    currentPage={currentPage}
                    perPage={PER_PAGE}
                    onPageChange={p => setCurrentPage(p)}
                />
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 100, padding: '20px'
                }}>
                    <div style={{
                        background: '#fff', width: '100%', maxWidth: '450px',
                        borderRadius: '4px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '400', color: '#1E293B' }}>
                                {editingTechnician ? 'Edit Teknisi' : 'Tambah Teknisi Baru'}
                            </h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={submit} style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    style={inputStyle} 
                                    placeholder="Masukkan nama teknisi"
                                    required
                                />
                                {errors.name && <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Spesialisasi</label>
                                <input 
                                    type="text" 
                                    value={data.specialty} 
                                    onChange={e => setData('specialty', e.target.value)} 
                                    style={inputStyle} 
                                    placeholder="Contoh: Hardware, Jaringan"
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>No. WhatsApp</label>
                                <input 
                                    type="text" 
                                    value={data.phone} 
                                    onChange={e => setData('phone', e.target.value)} 
                                    style={inputStyle} 
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>

                            {/* Akun Login Teknisi */}
                            <div style={{ margin: '24px 0 16px', borderTop: '1px dashed #E2E8F0', paddingTop: '16px' }}>
                                <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '500', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Akun Akses Aplikasi (Opsional)</h4>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Alamat Email</label>
                                    <input 
                                        type="email" 
                                        value={data.email} 
                                        onChange={e => setData('email', e.target.value)} 
                                        style={inputStyle} 
                                        placeholder="teknisi@email.com"
                                    />
                                    {errors.email && <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>}
                                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Kosongkan jika teknisi tidak memerlukan akun login.</div>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>
                                        {editingTechnician ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password'}
                                    </label>
                                    <input 
                                        type="password" 
                                        value={data.password} 
                                        onChange={e => setData('password', e.target.value)} 
                                        style={inputStyle} 
                                        placeholder={editingTechnician ? "Masukkan password baru" : "Minimal 8 karakter"}
                                        required={!!data.email && !editingTechnician}
                                    />
                                    {errors.password && <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.password}</div>}
                                </div>
                            </div>

                            {/* Tanda Tangan Digital Pad */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Tanda Tangan Digital</label>
                                {data.signature ? (
                                    <div style={{ position: 'relative', border: '1px solid #E2E8F0', padding: '10px', background: '#F8FAFC', textAlign: 'center' }}>
                                        <img 
                                            src={data.signature} 
                                            alt="Pratinjau Tanda Tangan" 
                                            style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }} 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setData('signature', '')}
                                            style={{
                                                position: 'absolute', top: '5px', right: '5px',
                                                background: '#FEF2F2', border: '1px solid #FEE2E2',
                                                color: '#EF4444', fontSize: '11px', padding: '2px 8px',
                                                cursor: 'pointer', borderRadius: '4px'
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ) : (
                                    <SignaturePad 
                                        onSave={(sig) => setData('signature', sig)}
                                        onClear={() => setData('signature', '')}
                                    />
                                )}
                            </div>

                            {editingTechnician && (
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#1E293B' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={data.is_active} 
                                            onChange={e => setData('is_active', e.target.checked)} 
                                        />
                                        Status Aktif
                                    </label>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '12px', paddingBottom: '12px' }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer', fontSize: '14px', borderRadius: '4px' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{ flex: 2, padding: '10px', background: '#2563EB', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: processing ? 0.7 : 1, borderRadius: '4px' }}
                                >
                                    {editingTechnician ? 'Simpan Perubahan' : 'Simpan Teknisi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
