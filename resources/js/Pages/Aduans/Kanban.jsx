import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const STATUSES = [
    { id: 'menunggu_validasi', label: 'Menunggu', color: '#64748B', icon: 'fa-clock' },
    { id: 'sudah_validasi', label: 'Sudah Validasi', color: '#2563EB', icon: 'fa-user-check' },
    { id: 'sedang_pengerjaan', label: 'Sedang Pengerjaan', color: '#D97706', icon: 'fa-spinner' },
];

export default function Kanban({ aduans, technicians, categories = [], myTechnician }) {
    const { auth } = usePage().props;
    const userRole = auth.user?.role || 'admin';
    const loggedInTechName = myTechnician?.name || auth.user?.name || '';

    const [selectedAduan, setSelectedAduan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);

    const { data, setData, patch, processing, reset } = useForm({
        status: '',
        priority: '',
        technician: '',
        validator: '',
        damage_report: '',
        category: '',
        asset_name: '',
        asset_brand: '',
        inventory_number: '',
        asset_location: '',
        asset_user: '',
        damage_type: '',
        damage_chronology: '',
        actions_taken: '',
        recommendation: '',
        satisfaction: '',
    });

    const openModal = (aduan) => {
        setSelectedAduan(aduan);

        let nextStatus = aduan.status;
        if (aduan.status === 'menunggu_validasi') nextStatus = 'sudah_validasi';
        else if (aduan.status === 'sudah_validasi') nextStatus = 'sedang_pengerjaan';

        let initialTech = aduan.technician || '';
        if (userRole === 'teknisi' && aduan.status === 'sudah_validasi' && !initialTech) {
            initialTech = loggedInTechName;
        }

        setData({
            status: nextStatus,
            priority: aduan.priority || 'ringan',
            technician: initialTech,
            validator: aduan.validator || '',
            damage_report: aduan.damage_report || '',
            category: aduan.category || '',
            asset_name: aduan.asset_name || '',
            asset_brand: aduan.asset_brand || '',
            inventory_number: aduan.inventory_number || '',
            asset_location: aduan.asset_location || (aduan.unit ? `${aduan.unit}${aduan.name ? ' / ' + aduan.name : ''}` : (aduan.name || '')),
            asset_user: aduan.asset_user || aduan.name || '',
            damage_type: aduan.damage_type || '',
            damage_chronology: aduan.damage_chronology || '',
            actions_taken: aduan.actions_taken || '',
            recommendation: aduan.recommendation || '',
            satisfaction: aduan.satisfaction || 'puas',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAduan(null);
        setIsTechDropdownOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();

        if (data.status === 'sudah_validasi' && !data.validator) {
            if (window.showToast) {
                window.showToast('Silakan isi nama validator terlebih dahulu.', 'error');
            } else {
                alert('Silakan isi nama validator terlebih dahulu.');
            }
            return;
        }

        if (data.status === 'sedang_pengerjaan' && !data.technician) {
            if (window.showToast) {
                window.showToast('Silakan pilih teknisi terlebih dahulu.', 'error');
            } else {
                alert('Silakan pilih teknisi terlebih dahulu.');
            }
            return;
        }

        patch(route('aduan.update', selectedAduan.id), {
            onSuccess: () => {
                closeModal();
                if (window.showToast) {
                    window.showToast('Aduan berhasil diperbarui.', 'success');
                }
            },
        });
    };

    const getColumnAduans = (statusId) => {
        return aduans.filter(a => a.status === statusId);
    };

    return (
        <AdminLayout title="Papan Proses">
            <Head title="Papan Proses - SIM Aduan" />

            <div style={{ display: 'flex', gap: '16px', height: 'calc(100vh - 160px)', width: '100%', overflowX: 'auto', paddingBottom: '10px', WebkitOverflowScrolling: 'touch' }}>
                {STATUSES.map(status => (
                    <div key={status.id} style={{
                        flex: 1,
                        minWidth: '340px',
                        background: '#F1F5F9',
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #E2E8F0',
                    }}>
                        {/* Header Kolom */}
                        <div style={{
                            padding: '20px',
                            borderBottom: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'transparent',
                            borderTopLeftRadius: '0',
                            borderTopRightRadius: '0',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontWeight: '400', color: '#1E293B', fontSize: '18px', letterSpacing: '-0.01em' }}>{status.label}</span>
                            </div>
                            <span style={{
                                color: '#64748B',
                                fontSize: '14px',
                                fontWeight: '400'
                            }}>
                                {getColumnAduans(status.id).length}
                            </span>
                        </div>

                        {/* List Item */}
                        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {getColumnAduans(status.id).map(aduan => (
                                <div
                                    key={aduan.id}
                                    onClick={() => openModal(aduan)}
                                    className="card-hoverable"
                                    style={{
                                        background: '#fff',
                                        padding: '18px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                        <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '400', lineHeight: '1.4' }}>
                                            {aduan.ticket_number}
                                            <span style={{ margin: '0 8px', color: '#E2E8F0' }}>|</span>
                                            <span style={{ color: '#64748B' }}>{aduan.name}</span>
                                            {aduan.unit && (
                                                <>
                                                    <span style={{ margin: '0 8px', color: '#E2E8F0' }}>|</span>
                                                    <span style={{ color: '#64748B' }}>{aduan.unit}</span>
                                                </>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: '400', textAlign: 'right' }}>
                                            {new Date(aduan.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>

                                    <div style={{ fontWeight: '400', color: '#1E293B', marginBottom: '10px', fontSize: '18px', lineHeight: '1.5' }}>
                                        <div style={{ display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {aduan.description}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {aduan.priority && (
                                            <span
                                                className="capitalize"
                                                style={{
                                                    fontSize: '14px',
                                                    padding: '3px 10px',
                                                    borderRadius: '4px',
                                                    background: aduan.priority === 'berat' ? '#FEF2F2' : (aduan.priority === 'sedang' ? '#FFFBEB' : '#F0FDF4'),
                                                    color: aduan.priority === 'berat' ? '#EF4444' : (aduan.priority === 'sedang' ? '#D97706' : '#10B981'),
                                                    fontWeight: '400',
                                                    display: 'inline-block'
                                                }}
                                            >
                                                {aduan.priority}
                                            </span>
                                        )}
                                        {aduan.category && (
                                            <span style={{
                                                fontSize: '14px',
                                                padding: '3px 10px',
                                                borderRadius: '4px',
                                                background: '#EFF6FF',
                                                color: '#2563EB',
                                                fontWeight: '400',
                                                display: 'inline-block'
                                            }}>
                                                {aduan.category}
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ borderTop: '1px solid #F1F5F9', margin: '14px 0 16px' }}></div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '14px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>{aduan.validator || '-'}</span>
                                            <span style={{ color: '#E2E8F0' }}>|</span>
                                            <span>{aduan.technician || '-'}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {/* Ambil Aduan button for technician on validated aduans */}
                                            {userRole === 'teknisi' && aduan.status === 'sudah_validasi' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openModal(aduan);
                                                    }}
                                                    className="btn-action-hover"
                                                    title="Ambil Aduan"
                                                    style={{
                                                        background: '#EFF6FF',
                                                        border: '1px solid #BFDBFE',
                                                        color: '#2563EB',
                                                        padding: '6px 12px',
                                                        fontSize: '12px',
                                                        fontWeight: '400',
                                                        cursor: 'pointer',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}
                                                >
                                                    <i className="fa-solid fa-hand-holding-hand"></i>
                                                    Ambil
                                                </button>
                                            )}

                                            {/* Cetak SPK button for in-progress aduans */}
                                            {aduan.status === 'sedang_pengerjaan' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(route('aduan.spkReport', aduan.id), '_blank');
                                                    }}
                                                    className="btn-action-hover"
                                                    title="Cetak SPK"
                                                    style={{
                                                        background: '#EFF6FF',
                                                        border: '1px solid #BFDBFE',
                                                        color: '#2563EB',
                                                        width: '32px',
                                                        height: '32px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        borderRadius: '4px'
                                                    }}
                                                >
                                                    <i className="fa-solid fa-print"></i>
                                                </button>
                                            )}

                                            <button
                                                onClick={(e) => { e.stopPropagation(); /* Logic chat nanti */ }}
                                                className="btn-action-hover"
                                                style={{
                                                    background: '#F8FAFC',
                                                    border: '1px solid #E2E8F0',
                                                    color: '#64748B',
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px'
                                                }}
                                            >
                                                <i className="fa-regular fa-comment-dots" style={{ fontSize: '14px' }}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        {/* Footer info already handled above the line */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Update (Tetap Sama) */}
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
                        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '400', color: '#1E293B' }}>
                                    {selectedAduan.status === 'menunggu_validasi' ? 'Validasi Aduan' :
                                        selectedAduan.status === 'sudah_validasi' ? 'Penugasan Teknisi' : 'Update Status'}
                                </h3>
                                <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#64748B', fontWeight: '400' }}>
                                    {selectedAduan?.ticket_number}
                                    <span style={{ margin: '0 8px', color: '#E2E8F0' }}>|</span>
                                    {selectedAduan?.name}
                                    {selectedAduan?.unit && (
                                        <>
                                            <span style={{ margin: '0 8px', color: '#E2E8F0' }}>|</span>
                                            {selectedAduan?.unit}
                                        </>
                                    )}
                                </p>
                            </div>
                            <button onClick={closeModal} style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#64748B', width: '32px', height: '32px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={submit} style={{ padding: '24px' }}>

                            {/* CASE 1: DARI MENUNGGU KE SUDAH VALIDASI */}
                            {selectedAduan.status === 'menunggu_validasi' && (
                                <>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Pilih Validator</label>
                                        <select
                                            value={data.validator}
                                            onChange={e => setData('validator', e.target.value)}
                                            style={{ width: '100%', padding: '12px 14px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '14px', fontFamily: 'Telex', outline: 'none', background: '#fff', fontWeight: '400' }}
                                            required
                                        >
                                            <option value="">Pilih Validator</option>
                                            {technicians.map(tech => (
                                                <option key={tech.id} value={tech.name}>{tech.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Tentukan Prioritas</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {['ringan', 'sedang', 'berat'].map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setData('priority', p)}
                                                    style={{
                                                        flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid',
                                                        borderColor: data.priority === p ? (p === 'berat' ? '#EF4444' : p === 'sedang' ? '#F59E0B' : '#10B981') : '#E2E8F0',
                                                        background: data.priority === p ? (p === 'berat' ? '#FEF2F2' : p === 'sedang' ? '#FFFBEB' : '#F0FDF4') : '#fff',
                                                        color: data.priority === p ? (p === 'berat' ? '#EF4444' : p === 'sedang' ? '#F59E0B' : '#10B981') : '#64748B',
                                                        fontSize: '14px', fontWeight: '400', cursor: 'pointer'
                                                    }}
                                                >
                                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Kategori Aduan</label>
                                        <select
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            style={{ width: '100%', padding: '12px 14px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '14px', fontFamily: 'Telex', outline: 'none', background: '#fff', fontWeight: '400' }}
                                        >
                                            <option value="">--- Pilih Kategori ---</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* CASE 2: DARI SUDAH VALIDASI KE PENGERJAAN */}
                            {selectedAduan.status === 'sudah_validasi' && data.status === 'sedang_pengerjaan' && (
                                userRole === 'teknisi' ? (
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Teknisi Utama (Anda)</label>
                                            <div style={{
                                                background: '#EFF6FF',
                                                color: '#2563EB',
                                                padding: '12px 14px',
                                                borderRadius: '4px',
                                                border: '1px solid #BFDBFE',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <i className="fa-solid fa-user-gear"></i>
                                                {loggedInTechName}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Pilih Partner / Rekan Kerja (Opsional)</label>
                                            <div style={{
                                                border: '1px solid #E2E8F0',
                                                borderRadius: '4px',
                                                maxHeight: '180px',
                                                overflowY: 'auto',
                                                padding: '8px',
                                                background: '#fff',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6px'
                                            }}>
                                                {technicians
                                                    .filter(tech => tech.name.toLowerCase().trim() !== loggedInTechName.toLowerCase().trim())
                                                    .map(tech => {
                                                        const isChecked = data.technician.split(', ').map(s => s.trim().toLowerCase()).includes(tech.name.toLowerCase());
                                                        return (
                                                            <label
                                                                key={tech.id}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '10px',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    cursor: 'pointer',
                                                                    background: isChecked ? '#F8FAFC' : 'transparent',
                                                                    transition: 'background 0.15s',
                                                                    fontSize: '14px',
                                                                    color: '#334155'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = isChecked ? '#F8FAFC' : 'transparent'}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => {
                                                                        const current = data.technician ? data.technician.split(', ').map(s => s.trim()).filter(Boolean) : [];
                                                                        let clean = current.filter(n => n.toLowerCase() !== loggedInTechName.toLowerCase());
                                                                        if (clean.map(n => n.toLowerCase()).includes(tech.name.toLowerCase())) {
                                                                            clean = clean.filter(n => n.toLowerCase() !== tech.name.toLowerCase());
                                                                        } else {
                                                                            clean.push(tech.name);
                                                                        }
                                                                        const updated = [loggedInTechName, ...clean].filter(Boolean);
                                                                        setData('technician', updated.join(', '));
                                                                    }}
                                                                    style={{
                                                                        width: '16px',
                                                                        height: '16px',
                                                                        cursor: 'pointer',
                                                                        accentColor: '#2563EB'
                                                                    }}
                                                                />
                                                                <span>{tech.name}</span>
                                                            </label>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '14px', fontSize: '12px', color: '#64748B', background: '#F8FAFC', padding: '12px', borderRadius: '4px', border: '1px solid #F1F5F9' }}>
                                            <i className="fa-solid fa-user-check" style={{ marginRight: '8px', color: '#2563EB' }}></i>
                                            Divalidasi oleh <strong>{selectedAduan.validator}</strong>.
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Pilih Teknisi</label>
                                        {/* Custom Premium Multi-Select Dropdown */}
                                        <div style={{ position: 'relative' }}>
                                            <div 
                                                onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)}
                                                style={{
                                                    width: '100%',
                                                    minHeight: '44px',
                                                    padding: '8px 12px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #E2E8F0',
                                                    fontSize: '14px',
                                                    fontFamily: 'Telex',
                                                    outline: 'none',
                                                    background: '#fff',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '6px',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    boxSizing: 'border-box'
                                                }}
                                            >
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1 }}>
                                                    {data.technician ? (
                                                        data.technician.split(', ').map(name => (
                                                            <span 
                                                                key={name} 
                                                                style={{
                                                                    background: '#EFF6FF',
                                                                    color: '#2563EB',
                                                                    padding: '2px 8px',
                                                                    fontSize: '12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '4px',
                                                                    borderRadius: '4px',
                                                                    border: '1px solid #BFDBFE'
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const current = data.technician.split(', ').map(s => s.trim());
                                                                    const updated = current.filter(n => n !== name);
                                                                    setData('technician', updated.join(', '));
                                                                }}
                                                            >
                                                                {name}
                                                                <i className="fa-solid fa-times" style={{ fontSize: '10px', cursor: 'pointer', opacity: 0.7 }}></i>
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span style={{ color: '#94A3B8' }}>Pilih Teknisi</span>
                                                    )}
                                                </div>
                                                <i className={`fa-solid fa-chevron-${isTechDropdownOpen ? 'up' : 'down'}`} style={{ color: '#94A3B8', fontSize: '12px' }}></i>
                                            </div>

                                            {isTechDropdownOpen && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 'calc(100% + 4px)',
                                                    left: 0,
                                                    right: 0,
                                                    background: '#fff',
                                                    border: '1px solid #E2E8F0',
                                                    borderRadius: '4px',
                                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                                    zIndex: 10,
                                                    maxHeight: '200px',
                                                    overflowY: 'auto',
                                                    padding: '6px'
                                                }}>
                                                    {technicians.map(tech => {
                                                        const isSelected = data.technician ? data.technician.split(', ').map(s => s.trim()).includes(tech.name) : false;
                                                        return (
                                                            <div 
                                                                key={tech.id}
                                                                onClick={() => {
                                                                    const current = data.technician ? data.technician.split(', ').map(s => s.trim()) : [];
                                                                    const updated = isSelected 
                                                                        ? current.filter(n => n !== tech.name)
                                                                        : [...current, tech.name];
                                                                    setData('technician', updated.join(', '));
                                                                }}
                                                                style={{
                                                                    padding: '10px 12px',
                                                                    fontSize: '14px',
                                                                    color: '#334155',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '10px',
                                                                    background: isSelected ? '#F8FAFC' : 'transparent',
                                                                    transition: 'background 0.15s'
                                                                }}
                                                                onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                                                                onMouseLeave={(e) => e.currentTarget.style.background = isSelected ? '#F8FAFC' : 'transparent'}
                                                            >
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={isSelected}
                                                                    readOnly
                                                                    style={{ 
                                                                        width: '16px', 
                                                                        height: '16px', 
                                                                        cursor: 'pointer',
                                                                        accentColor: '#2563EB'
                                                                    }} 
                                                                />
                                                                <span>{tech.name}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ marginTop: '14px', fontSize: '12px', color: '#64748B', background: '#F8FAFC', padding: '12px', borderRadius: '4px', border: '1px solid #F1F5F9' }}>
                                            <i className="fa-solid fa-user-check" style={{ marginRight: '8px', color: '#2563EB' }}></i>
                                            Divalidasi oleh <strong>{selectedAduan.validator}</strong>.
                                        </div>
                                    </div>
                                )
                            )}

                            {/* CASE 3: DROPDOWN STATUS UNTUK SUDAH VALIDASI DAN PENGERJAAN */}
                            {selectedAduan.status !== 'menunggu_validasi' && !(userRole === 'teknisi' && selectedAduan.status === 'sudah_validasi') && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Ubah Status Aduan</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '14px', fontFamily: 'Telex', outline: 'none', background: '#fff' }}
                                    >
                                        <optgroup label="Proses">
                                            {selectedAduan.status === 'sudah_validasi' && (
                                                <option value="sedang_pengerjaan">Lanjut ke Pengerjaan</option>
                                            )}
                                            {selectedAduan.status === 'sedang_pengerjaan' && (
                                                <option value="sedang_pengerjaan">Tetap di Pengerjaan</option>
                                            )}
                                            <option value="sudah_validasi">
                                                {selectedAduan.status === 'sudah_validasi' ? 'Tetap di Sudah Validasi' : 'Kembali ke Sudah Validasi'}
                                            </option>
                                            <option value="menunggu_validasi">Kembali ke Menunggu</option>
                                        </optgroup>
                                        <optgroup label="Selesai (Arsipkan dari Papan)">
                                            <option value="selesai">Selesai</option>
                                            <option value="barang_rusak">Barang Rusak</option>
                                            <option value="diperbaiki_sendiri">Diperbaiki Sendiri</option>
                                        </optgroup>
                                    </select>
                                    <p style={{ marginTop: '8px', fontSize: '11px', color: '#94A3B8' }}>
                                        * Memilih status 'Selesai', 'Rusak', atau 'Mandiri' akan menghapus aduan dari Papan Proses.
                                    </p>
                                </div>
                            )}

                            {/* Detailed Damage Report Form */}
                            {data.status === 'barang_rusak' && (
                                <div style={{ 
                                    borderTop: '1px solid #F1F5F9', 
                                    paddingTop: '20px', 
                                    marginTop: '20px',
                                    background: '#EFF6FF',
                                    border: '1px solid #BFDBFE',
                                    padding: '16px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ fontSize: '14px', fontWeight: '400', color: '#1E293B', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fa-solid fa-circle-info" style={{ color: '#2563EB' }}></i>
                                        Detail Berita Acara Kerusakan
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#1E293B', margin: 0, lineHeight: '1.5' }}>
                                        Status aduan akan diubah menjadi <strong>Barang Rusak</strong>. 
                                        Pengisian lembar Berita Acara Kerusakan dapat dilanjutkan langsung melalui menu <strong>Berita Acara</strong> setelah status ini disimpan.
                                    </p>
                                </div>
                            )}

                            {/* Laporan hasil untuk status lainnya */}
                            {data.status !== 'barang_rusak' && ['selesai', 'diperbaiki_sendiri'].includes(data.status) && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Laporan Penyelesaian</label>
                                    <textarea
                                        value={data.damage_report}
                                        onChange={e => setData('damage_report', e.target.value)}
                                        placeholder="Jelaskan apa yang sudah dilakukan..."
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', height: '100px', resize: 'vertical' }}
                                    />
                                </div>
                            )}
                            {selectedAduan?.status === 'sedang_pengerjaan' && (
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '12px' }}>Tingkat Kepuasan</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {[
                                            { value: 'puas', label: 'Puas' },
                                            { value: 'tidak_puas', label: 'Tidak Puas' }
                                        ].map(opt => {
                                            const isSelected = data.satisfaction === opt.value;
                                            return (
                                                <label
                                                    key={opt.value}
                                                    onClick={() => setData('satisfaction', opt.value)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        color: '#202124',
                                                        userSelect: 'none',
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        borderRadius: '50%',
                                                        border: isSelected ? '2px solid #2563EB' : '2px solid #dadce0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxSizing: 'border-box',
                                                        transition: 'all 0.15s ease-in-out',
                                                    }}>
                                                        {isSelected && (
                                                            <div style={{
                                                                width: '10px',
                                                                height: '10px',
                                                                borderRadius: '50%',
                                                                background: '#2563EB',
                                                            }} />
                                                        )}
                                                    </div>
                                                    <span>{opt.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
                                {['sedang_pengerjaan', 'selesai'].includes(selectedAduan?.status) && (
                                    <button
                                        type="button"
                                        onClick={() => window.open(route('aduan.spkReport', selectedAduan.id), '_blank')}
                                        style={{
                                            flex: '1 1 100%',
                                            padding: '12px',
                                            borderRadius: '4px',
                                            border: '1px solid #BFDBFE',
                                            background: '#EFF6FF',
                                            color: '#2563EB',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            marginBottom: '8px'
                                        }}
                                    >
                                        <i className="fa-solid fa-print"></i>
                                        Cetak SPK
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid #E2E8F0', background: '#fff', color: '#64748B', cursor: 'pointer', fontWeight: '400', fontSize: '14px' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{ flex: 2, padding: '12px', borderRadius: '4px', border: 'none', background: '#2563EB', color: '#fff', cursor: 'pointer', fontWeight: '400', fontSize: '14px', opacity: processing ? 0.7 : 1, boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
                                >
                                    {selectedAduan.status === 'menunggu_validasi' ? 'Validasi Sekarang' :
                                        selectedAduan.status === 'sudah_validasi' && userRole === 'teknisi' ? 'Ambil & Mulai Kerja' :
                                            data.status === 'sedang_pengerjaan' ? 'Tugaskan Teknisi' :
                                                'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .card-hoverable {
                    border-radius: 0 !important;
                    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out !important;
                }
                .card-hoverable:hover {
                    background: #fff !important;
                    transform: translateY(-4px) !important;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
                }
                .btn-action-hover {
                    transition: all 0.15s ease-in-out !important;
                }
                .btn-action-hover:hover {
                    background: #EFF6FF !important;
                    color: #2563EB !important;
                    border-color: #BFDBFE !important;
                }
            `}</style>
        </AdminLayout>
    );
}
