import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
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
};

export default function Index({ categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 10;

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        is_active: true,
    });

    const openModal = (cat = null) => {
        if (cat) {
            setEditingCategory(cat);
            setData({
                name: cat.name,
                is_active: cat.is_active,
            });
        } else {
            setEditingCategory(null);
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
        if (editingCategory) {
            patch(route('categories.update', editingCategory.id), {
                onSuccess: () => {
                    closeModal();
                    if (window.showToast) window.showToast('Kategori berhasil diperbarui.', 'success');
                },
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => {
                    closeModal();
                    if (window.showToast) window.showToast('Kategori baru berhasil ditambahkan.', 'success');
                },
            });
        }
    };

    const deleteCat = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(route('categories.destroy', id), {
                onSuccess: () => {
                    if (window.showToast) window.showToast('Kategori berhasil dihapus.', 'success');
                },
                onError: (err) => {
                    if (window.showToast) {
                        window.showToast(err.message || 'Gagal menghapus kategori.', 'error');
                    } else if (err.message) {
                        alert(err.message);
                    }
                }
            });
        }
    };

    return (
        <AdminLayout title="Manajemen Kategori">
            <Head title="Manajemen Kategori - SIM Aduan" />

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
                    Tambah Kategori
                </button>
            </div>

            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ ...tableHeaderStyle, width: '60px', textAlign: 'center' }}>No</th>
                                <th style={tableHeaderStyle}>Nama Kategori</th>
                                <th style={{ ...tableHeaderStyle, width: '150px', textAlign: 'center' }}>Status</th>
                                <th style={{ ...tableHeaderStyle, width: '150px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const paginated = categories.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
                                if (paginated.length === 0) return (
                                    <tr>
                                        <td colSpan="4" style={{ ...tableCellStyle, textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                                            Belum ada data kategori.
                                        </td>
                                    </tr>
                                );
                                return paginated.map((cat, index) => (
                                    <tr key={cat.id}>
                                        <td style={{ ...tableCellStyle, textAlign: 'center', color: '#94A3B8' }}>{(currentPage - 1) * PER_PAGE + index + 1}</td>
                                    <td style={tableCellStyle}>{cat.name}</td>
                                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            background: cat.is_active ? '#F0FDF4' : '#F1F5F9',
                                            color: cat.is_active ? '#10B981' : '#64748B',
                                            fontSize: '13px',
                                            borderRadius: '4px',
                                            display: 'inline-block'
                                        }}>
                                            {cat.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <button 
                                                onClick={() => openModal(cat)}
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
                                                onClick={() => deleteCat(cat.id)}
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
                    totalItems={categories.length}
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
                        background: '#fff', width: '100%', maxWidth: '400px',
                        borderRadius: '4px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '400', color: '#1E293B' }}>
                                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                            </h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={submit} style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Nama Kategori</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    style={inputStyle} 
                                    placeholder="Masukkan nama kategori"
                                    required
                                />
                                {errors.name && <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
                            </div>

                            {editingCategory && (
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

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{ flex: 2, padding: '10px', background: '#2563EB', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: processing ? 0.7 : 1 }}
                                >
                                    {editingCategory ? 'Simpan Perubahan' : 'Simpan Kategori'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
