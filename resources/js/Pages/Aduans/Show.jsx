import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const baseStyle = {
    fontFamily: "'Telex', sans-serif",
    fontSize: '14px',
};

const statusConfig = {
    menunggu_validasi: { label: 'Menunggu', bg: '#F1F5F9', color: '#64748B', icon: 'fa-solid fa-clock' },
    sudah_validasi: { label: 'Sudah Validasi', bg: '#EFF6FF', color: '#2563EB', icon: 'fa-solid fa-user-check' },
    sedang_pengerjaan: { label: 'Pengerjaan', bg: '#FEF3C7', color: '#D97706', icon: 'fa-solid fa-spinner' },
    selesai: { label: 'Selesai', bg: '#ECFDF5', color: '#059669', icon: 'fa-solid fa-circle-check' },
    barang_rusak: { label: 'Barang Rusak', bg: '#FEF2F2', color: '#DC2626', icon: 'fa-solid fa-circle-xmark' },
    diperbaiki_sendiri: { label: 'Mandiri', bg: '#F5F3FF', color: '#7C3AED', icon: 'fa-solid fa-tools' },
};

const priorityConfig = {
    ringan:  { label: 'Ringan',  bg: '#F0FDF4', color: '#10B981', sla: '30 Menit' },
    sedang:  { label: 'Sedang',  bg: '#FFFBEB', color: '#D97706', sla: '30 Menit - 2 Hari' },
    berat:   { label: 'Berat',   bg: '#FEF2F2', color: '#EF4444', sla: '2 - 7 Hari' },
};



const fieldStyle = {
    border: '1px solid #E2E8F0',
    borderRadius: '4px',
    padding: '9px 12px',
    fontSize: '14px',
    fontFamily: "'Telex', sans-serif",
    color: '#374151',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    background: '#fff',
    transition: 'border-color 0.15s',
};

export default function Show({ aduan, technicians = [], messages = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const userRole = user ? user.role : null;

    const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);
    const { data, setData, patch, processing, errors } = useForm({
        status:        aduan.status,
        priority:      aduan.priority || '',
        response:      aduan.response || '',
        damage_report: aduan.damage_report || '',
        technician:    aduan.technician || '',
        validator:     aduan.validator || '',
    });

    const chatForm = useForm({
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('aduan.update', aduan.id));
    };

    const handleSendChat = (e) => {
        e.preventDefault();
        if (!chatForm.data.message.trim()) return;

        chatForm.post(route('aduan.messages.store', aduan.id), {
            onSuccess: () => {
                chatForm.reset('message');
                const chatContainer = document.getElementById('chat-messages-container');
                if (chatContainer) {
                    setTimeout(() => {
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    }, 50);
                }
            }
        });
    };

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        const chatContainer = document.getElementById('chat-messages-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages.length]);

    // Polling messages every 4 seconds to simulate real-time chat
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['messages'] });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const st = statusConfig[aduan.status] || statusConfig.menunggu_validasi;
    const pr = aduan.priority ? priorityConfig[aduan.priority] : null;

    return (
        <AdminLayout title={`Detail Aduan — ${aduan.ticket_number}`}>
            <Head title={`Detail ${aduan.ticket_number} - SIM Aduan`} />

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', color: '#94A3B8', fontSize: '14px' }}>
                <Link href="/dashboard" style={{ color: '#2563EB', textDecoration: 'none' }}>
                    <i className="fa-solid fa-gauge-high" style={{ marginRight: '4px', fontSize: '14px' }}></i>
                    Dashboard
                </Link>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px' }}></i>
                <span style={{ color: '#475569', fontWeight: 'normal' }}>{aduan.ticket_number}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px' }}>

                {/* LEFT: Detail Aduan */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Header Card */}
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fa-solid fa-file-lines" style={{ color: '#2563EB', fontSize: '14px' }}></i>
                                <span style={{ fontWeight: 'normal', fontSize: '14px', color: '#1E293B' }}>Informasi Aduan</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {pr && (
                                    <span style={{ background: pr.bg, color: pr.color, padding: '4px 12px', borderRadius: '4px', fontSize: '14px', fontWeight: '400' }}>
                                        <i className="fa-solid fa-flag" style={{ marginRight: '6px', fontSize: '12px' }}></i>
                                        {pr.label} ({pr.sla})
                                    </span>
                                )}
                                <span style={{ background: st.bg, color: st.color, padding: '4px 10px', borderRadius: '4px', fontSize: '14px', fontWeight: 'normal', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <i className={st.icon} style={{ fontSize: '12px' }}></i>
                                    {st.label}
                                </span>
                            </div>
                        </div>
                        <div style={{ padding: '20px' }}>
                            <div style={{ fontSize: '16px', fontWeight: 'normal', color: '#1E293B', marginBottom: '12px' }}>
                                {aduan.subject}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '3px' }}>Nomor Tiket</div>
                                    <div style={{ fontWeight: 'normal', color: '#2563EB', fontFamily: 'monospace', fontSize: '14px' }}>{aduan.ticket_number}</div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '3px' }}>Tanggal Masuk</div>
                                    <div style={{ fontSize: '14px', color: '#374151' }}>
                                        {new Date(aduan.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', marginBottom: '16px', display: 'flex', gap: '40px' }}>
                                <div>
                                    <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '3px' }}>Validator</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'normal', color: '#1E293B' }}>
                                        <i className="fa-solid fa-user-check" style={{ marginRight: '6px', color: '#64748B' }}></i>
                                        {aduan.validator || 'Belum divalidasi'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '3px' }}>Teknisi Penanggung Jawab</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'normal', color: '#1E293B' }}>
                                        <i className="fa-solid fa-user-gear" style={{ marginRight: '6px', color: '#64748B' }}></i>
                                        {aduan.technician || 'Belum ditugaskan'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                                <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '8px' }}>Uraian Aduan</div>
                                <div style={{ fontSize: '18px', color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                                    {aduan.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tanggapan Admin (jika sudah ada) */}
                    {aduan.response && (
                        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '4px', padding: '20px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'normal', color: '#1D4ED8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                <i className="fa-solid fa-reply"></i>
                                Tanggapan Admin
                            </div>
                            <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                                {aduan.response}
                            </div>
                        </div>
                    )}

                    {/* Laporan Kerusakan (jika ada) */}
                    {aduan.damage_report && (
                        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '4px', padding: '20px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'normal', color: '#92400E', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                Laporan Kerusakan
                            </div>
                            <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                                {aduan.damage_report}
                            </div>
                        </div>
                    )}

                    {/* Chat Box */}
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden', display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
                        {/* Chat Header */}
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <i className="fa-solid fa-comments" style={{ color: '#2563EB', fontSize: '16px' }}></i>
                                <span style={{ fontWeight: '600', fontSize: '15px', color: '#1E293B' }}>Diskusi Aduan (Grup Chat)</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <span style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Admin</span>
                                <span style={{ background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Teknisi</span>
                                <span style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>Pelapor</span>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div 
                            id="chat-messages-container" 
                            style={{ 
                                padding: '20px', 
                                maxHeight: '350px', 
                                overflowY: 'auto', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '14px',
                                background: '#FAFAFA',
                                minHeight: '180px'
                            }}
                        >
                            {messages.length > 0 ? (
                                messages.map((msg) => {
                                    const isMe = user && msg.user_id === user.id;
                                    const msgRole = msg.user ? msg.user.role : 'pelapor';
                                    
                                    // Set style based on sender's role
                                    let badgeStyle = { bg: '#E2E8F0', text: '#475569', label: 'Pelapor' };
                                    if (msgRole === 'admin') {
                                        badgeStyle = { bg: '#FEF2F2', text: '#EF4444', label: 'Admin' };
                                    } else if (msgRole === 'teknisi') {
                                        badgeStyle = { bg: '#F5F3FF', text: '#7C3AED', label: 'Teknisi' };
                                    } else if (msgRole === 'pelapor') {
                                        badgeStyle = { bg: '#ECFDF5', text: '#059669', label: 'Pelapor' };
                                    }

                                    return (
                                        <div 
                                            key={msg.id} 
                                            style={{ 
                                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                                maxWidth: '75%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: isMe ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            {/* Sender Header */}
                                            {!isMe && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '12px' }}>
                                                    <span style={{ fontWeight: '600', color: '#475569' }}>{msg.user ? msg.user.name : 'User'}</span>
                                                    <span style={{ 
                                                        background: badgeStyle.bg, 
                                                        color: badgeStyle.text, 
                                                        padding: '1px 6px', 
                                                        borderRadius: '3px', 
                                                        fontSize: '10px', 
                                                        fontWeight: 'bold' 
                                                    }}>
                                                        {badgeStyle.label}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Message Bubble */}
                                            <div 
                                                style={{ 
                                                    padding: '10px 14px', 
                                                    borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                                                    background: isMe ? '#2563EB' : '#ffffff',
                                                    color: isMe ? '#ffffff' : '#1E293B',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                    fontSize: '14px',
                                                    lineHeight: '1.5',
                                                    whiteSpace: 'pre-wrap',
                                                    border: isMe ? 'none' : '1px solid #E2E8F0'
                                                }}
                                            >
                                                {msg.message}
                                            </div>

                                            {/* Timestamp */}
                                            <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                                                {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '40px 10px', color: '#94A3B8', margin: 'auto' }}>
                                    <i className="fa-solid fa-comments" style={{ fontSize: '32px', color: '#CBD5E1' }}></i>
                                    <span style={{ fontSize: '13px', textAlign: 'center' }}>Belum ada obrolan di aduan ini. Tulis pesan Anda di bawah!</span>
                                </div>
                            )}
                        </div>

                        {/* Chat Input or Closed Message */}
                        {aduan.status === 'menunggu_validasi' || aduan.status === 'sudah_validasi' || aduan.status === 'sedang_pengerjaan' ? (
                            <form onSubmit={handleSendChat} style={{ padding: '14px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '10px', background: '#ffffff' }}>
                                <input 
                                    type="text"
                                    placeholder="Ketik pesan Anda disini..."
                                    value={chatForm.data.message}
                                    onChange={e => chatForm.setData('message', e.target.value)}
                                    disabled={chatForm.processing}
                                    style={{
                                        flex: 1,
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '6px',
                                        padding: '10px 14px',
                                        fontSize: '14px',
                                        fontFamily: 'Telex',
                                        outline: 'none',
                                        transition: 'border-color 0.15s'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                                />
                                <button 
                                    type="submit"
                                    disabled={chatForm.processing || !chatForm.data.message.trim()}
                                    style={{
                                        background: (chatForm.processing || !chatForm.data.message.trim()) ? '#93C5FD' : '#2563EB',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '0 18px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        cursor: (chatForm.processing || !chatForm.data.message.trim()) ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        transition: 'background 0.15s'
                                    }}
                                >
                                    {chatForm.processing ? (
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-paper-plane"></i>
                                            Kirim
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div style={{ padding: '16px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC', textAlign: 'center', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}>
                                <i className="fa-solid fa-lock" style={{ color: '#94A3B8', fontSize: '14px' }}></i>
                                <span>Diskusi chat ditutup karena aduan sedang dikerjakan atau sudah selesai.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Info Pelapor + Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Info Pelapor */}
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-user" style={{ color: '#2563EB', fontSize: '14px' }}></i>
                            <span style={{ fontWeight: 'normal', fontSize: '14px', color: '#1E293B' }}>Data Pelapor</span>
                        </div>
                        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { icon: 'fa-solid fa-user-circle', label: 'Nama', value: aduan.name },
                                { icon: 'fa-solid fa-envelope', label: 'Email', value: aduan.email },
                                { icon: 'fa-solid fa-phone', label: 'Telepon', value: aduan.phone || '-' },
                                { icon: 'fa-solid fa-building', label: 'Unit', value: aduan.unit || '-' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <i className={item.icon} style={{ color: '#94A3B8', fontSize: '14px', marginTop: '1px', width: '14px' }}></i>
                                    <div>
                                        <div style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '2px' }}>{item.label}</div>
                                        <div style={{ fontSize: '14px', color: '#374151' }}>{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Update */}
                    {userRole !== 'pelapor' && (
                        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fa-solid fa-pen-to-square" style={{ color: '#2563EB', fontSize: '14px' }}></i>
                            <span style={{ fontWeight: 'normal', fontSize: '14px', color: '#1E293B' }}>Perbarui Status</span>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'normal', color: '#475569', marginBottom: '6px' }}>Status</label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    style={fieldStyle}
                                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                                >
                                    <option value="menunggu_validasi">Menunggu</option>
                                    <option value="sudah_validasi">Sudah Validasi</option>
                                    <option value="sedang_pengerjaan">Pengerjaan</option>
                                    <option value="selesai">Selesai</option>
                                    <option value="barang_rusak">Barang Rusak</option>
                                    <option value="diperbaiki_sendiri">Mandiri</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'normal', color: '#475569', marginBottom: '6px' }}>
                                    Prioritas 
                                    {data.priority && <span style={{ marginLeft: '8px', fontWeight: 'normal', color: '#94A3B8' }}>SLA: {priorityConfig[data.priority].sla}</span>}
                                </label>
                                <select
                                    value={data.priority}
                                    onChange={e => setData('priority', e.target.value)}
                                    style={fieldStyle}
                                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                                >
                                    <option value="">Pilih prioritas</option>
                                    <option value="ringan">Ringan (30 Mnt)</option>
                                    <option value="sedang">Sedang (30 Mnt - 2 Hari)</option>
                                    <option value="berat">Berat (2 - 7 Hari)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'normal', color: '#475569', marginBottom: '6px' }}>Validator</label>
                                <input
                                    type="text"
                                    value={data.validator}
                                    onChange={e => setData('validator', e.target.value)}
                                    placeholder="Nama validator"
                                    style={fieldStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'normal', color: '#475569', marginBottom: '6px' }}>Teknisi</label>
                                {/* Custom Premium Multi-Select Dropdown */}
                                <div style={{ position: 'relative' }}>
                                    <div 
                                        onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)}
                                        style={{
                                            width: '100%',
                                            minHeight: '40px',
                                            padding: '6px 12px',
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
                                            maxHeight: '180px',
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
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'normal', color: '#475569', marginBottom: '6px' }}>Tanggapan Admin</label>
                                <textarea
                                    value={data.response}
                                    onChange={e => setData('response', e.target.value)}
                                    rows={4}
                                    placeholder="Tulis tanggapan untuk pelapor..."
                                    style={{ ...fieldStyle, resize: 'vertical', lineHeight: '1.6' }}
                                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'normal', color: '#475569', marginBottom: '6px' }}>Laporan Kerusakan</label>
                                <textarea
                                    value={data.damage_report}
                                    onChange={e => setData('damage_report', e.target.value)}
                                    rows={3}
                                    placeholder="Catatan kerusakan (jika ada)..."
                                    style={{ ...fieldStyle, resize: 'vertical', lineHeight: '1.6' }}
                                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                                    onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    background: processing ? '#93C5FD' : '#2563EB',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '10px',
                                    fontSize: '14px',
                                    fontFamily: "'Telex', sans-serif",
                                    fontWeight: 'normal',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                    width: '100%',
                                    transition: 'background 0.15s',
                                }}
                            >
                                {processing ? (
                                    <><i className="fa-solid fa-spinner fa-spin"></i> Menyimpan...</>
                                ) : (
                                    <><i className="fa-solid fa-floppy-disk"></i> Simpan Perubahan</>
                                )}
                            </button>
                        </form>
                    </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
