import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
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
    background: '#fff',
};

export default function Index({ users = [] }) {
    const currentUser = usePage().props.auth.user;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const PER_PAGE = 10;

    const handleSearch = (val) => {
        setSearchQuery(val);
        setCurrentPage(1); // reset page on search
    };

    const { data, setData, post, patch, delete: destroy, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setData({
                name: user.name,
                email: user.email,
                password: '', // blank on edit unless they want to change it
            });
        } else {
            setEditingUser(null);
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
        if (editingUser) {
            patch(route('users.update', editingUser.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteUser = (id) => {
        if (id === currentUser.id) {
            alert('Anda tidak dapat menghapus akun Anda sendiri.');
            return;
        }
        if (confirm('Apakah Anda yakin ingin menghapus akun pelapor ini? Semua riwayat laporan terkait akun ini mungkin terpengaruh.')) {
            router.delete(route('users.destroy', id));
        }
    };

    // Filter and search logic
    const filteredUsers = users.filter((user) => {
        return (
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <AdminLayout title="Manajemen Akun Pelapor">
            <Head title="Manajemen Akun Pelapor - SIM Aduan" />

            {/* Top Bar with Search */}
            <div style={{ 
                marginBottom: '24px', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '16px', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
            }}>
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
                        gap: '8px',
                        height: '40px',
                        boxSizing: 'border-box'
                    }}
                >
                    <i className="fa-solid fa-user-plus"></i>
                    Tambah Akun Pelapor
                </button>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                    {/* Search Input */}
                    <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
                        <i className="fa-solid fa-magnifying-glass" style={{
                            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                            color: '#94A3B8', fontSize: '13px'
                        }}></i>
                        <input 
                            type="text" 
                            placeholder="Cari nama atau email pelapor..." 
                            value={searchQuery}
                            onChange={e => handleSearch(e.target.value)}
                            style={{ 
                                ...inputStyle, 
                                paddingLeft: '36px',
                                height: '40px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Users Table Card */}
            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ ...tableHeaderStyle, width: '60px', textAlign: 'center' }}>No</th>
                                <th style={tableHeaderStyle}>Nama Lengkap Pelapor</th>
                                <th style={tableHeaderStyle}>Alamat Email</th>
                                <th style={{ ...tableHeaderStyle, width: '150px', textAlign: 'center' }}>Role</th>
                                <th style={{ ...tableHeaderStyle, width: '180px', textAlign: 'center' }}>Tanggal Registrasi</th>
                                <th style={{ ...tableHeaderStyle, width: '150px', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const paginated = filteredUsers.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
                                if (paginated.length === 0) return (
                                    <tr>
                                        <td colSpan="6" style={{ ...tableCellStyle, textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                                            Tidak ada data akun Pelapor ditemukan.
                                        </td>
                                    </tr>
                                );
                                return paginated.map((user, index) => (
                                    <tr key={user.id}>
                                        <td style={{ ...tableCellStyle, textAlign: 'center', color: '#94A3B8' }}>{(currentPage - 1) * PER_PAGE + index + 1}</td>
                                        <td style={tableCellStyle}>
                                            <div style={{ fontWeight: '500' }}>{user.name}</div>
                                        </td>
                                        <td style={tableCellStyle}>{user.email}</td>
                                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                background: '#ECFDF5',
                                                color: '#059669',
                                                fontSize: '13px',
                                                borderRadius: '4px',
                                                display: 'inline-block',
                                                fontWeight: '500'
                                            }}>
                                                Pelapor
                                            </span>
                                        </td>
                                        <td style={{ ...tableCellStyle, textAlign: 'center', color: '#64748B' }}>
                                            {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button 
                                                    onClick={() => openModal(user)}
                                                    style={{
                                                        width: '32px', height: '32px',
                                                        background: '#F8FAFC',
                                                        border: '1px solid #E2E8F0',
                                                        color: '#2563EB',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        borderRadius: '4px'
                                                    }}
                                                    title="Edit Akun Pelapor"
                                                >
                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                </button>
                                                <button 
                                                    onClick={() => deleteUser(user.id)}
                                                    disabled={user.id === currentUser.id}
                                                    style={{
                                                        width: '32px', height: '32px',
                                                        background: user.id === currentUser.id ? '#F1F5F9' : '#FEF2F2',
                                                        border: user.id === currentUser.id ? '1px solid #E2E8F0' : '1px solid #FEE2E2',
                                                        color: user.id === currentUser.id ? '#94A3B8' : '#EF4444',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: user.id === currentUser.id ? 'not-allowed' : 'pointer',
                                                        borderRadius: '4px',
                                                        opacity: user.id === currentUser.id ? 0.6 : 1
                                                    }}
                                                    title="Hapus Akun Pelapor"
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
                    totalItems={filteredUsers.length}
                    currentPage={currentPage}
                    perPage={PER_PAGE}
                    onPageChange={p => setCurrentPage(p)}
                />
            </div>

            {/* Modal Form */}
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
                                {editingUser ? 'Edit Akun Pelapor' : 'Tambah Akun Pelapor Baru'}
                            </h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={submit} style={{ padding: '24px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    value={data.name} 
                                    onChange={e => setData('name', e.target.value)} 
                                    style={inputStyle} 
                                    placeholder="Masukkan nama lengkap pelapor"
                                    required
                                />
                                {errors.name && <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
                            </div>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Alamat Email</label>
                                <input 
                                    type="email" 
                                    value={data.email} 
                                    onChange={e => setData('email', e.target.value)} 
                                    style={inputStyle} 
                                    placeholder="pelapor@email.com"
                                    required
                                />
                                {errors.email && <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>}
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>
                                    {editingUser ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password'}
                                </label>
                                <input 
                                    type="password" 
                                    value={data.password} 
                                    onChange={e => setData('password', e.target.value)} 
                                    style={inputStyle} 
                                    placeholder={editingUser ? "Masukkan password baru jika ingin mengubah" : "Minimal 8 karakter"}
                                    required={!editingUser}
                                />
                                {errors.password && <div style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.password}</div>}
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
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
                                    {editingUser ? 'Simpan Perubahan' : 'Simpan Akun Pelapor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
