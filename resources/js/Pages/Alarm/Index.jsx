import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { playSynthesizedAlarm, stopSynthesizedAlarm } from '@/Components/AlarmSynth';

export default function AlarmSettings() {
    // 1. Local Storage based configuration state
    const [enabled, setEnabled] = useState(() => {
        const val = localStorage.getItem('alarm_enabled');
        return val !== null ? val === 'true' : true;
    });

    const [ringtone, setRingtone] = useState(() => {
        return localStorage.getItem('alarm_ringtone') || 'beep';
    });

    const [duration, setDuration] = useState(() => {
        const val = localStorage.getItem('alarm_duration');
        return val !== null && val !== '' ? parseInt(val, 10) : 10;
    });

    const [delayMinutes, setDelayMinutes] = useState(() => {
        const val = localStorage.getItem('alarm_delay');
        return val !== null && val !== '' ? parseInt(val, 10) : 0;
    });

    const [isPlayingPreview, setIsPlayingPreview] = useState(false);

    // Helper functions for state change
    const handleDurationChange = (val) => {
        if (val === '') {
            setDuration('');
        } else {
            const num = parseInt(val, 10);
            if (!isNaN(num)) {
                setDuration(num >= 1 ? num : 1);
            }
        }
    };

    const handleDelayChange = (val) => {
        if (val === '') {
            setDelayMinutes('');
        } else {
            const num = parseInt(val, 10);
            if (!isNaN(num)) {
                setDelayMinutes(num >= 0 ? num : 0);
            }
        }
    };

    // 2. Persist state changes to localStorage
    useEffect(() => {
        localStorage.setItem('alarm_enabled', enabled);
    }, [enabled]);

    useEffect(() => {
        localStorage.setItem('alarm_ringtone', ringtone);
    }, [ringtone]);

    useEffect(() => {
        localStorage.setItem('alarm_duration', duration === '' ? '10' : duration.toString());
    }, [duration]);

    useEffect(() => {
        localStorage.setItem('alarm_delay', delayMinutes === '' ? '0' : delayMinutes.toString());
    }, [delayMinutes]);

    // 3. Cleanup sound when component unmounts
    useEffect(() => {
        return () => {
            stopSynthesizedAlarm();
        };
    }, []);

    // 4. Handle Preview Play
    const togglePreview = () => {
        if (isPlayingPreview) {
            stopSynthesizedAlarm();
            setIsPlayingPreview(false);
        } else {
            setIsPlayingPreview(true);
            playSynthesizedAlarm(ringtone, duration);
            
            // Auto stop preview state when duration completes
            setTimeout(() => {
                setIsPlayingPreview(false);
            }, duration * 1000);
        }
    };

    const containerStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '10px 0',
        fontFamily: "'Telex', sans-serif"
    };

    const cardStyle = {
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    };

    const groupStyle = {
        marginBottom: '24px',
        paddingBottom: '24px',
        borderBottom: '1px solid #F1F5F9'
    };

    const titleStyle = {
        fontSize: '21px',
        fontWeight: '400',
        color: '#1E293B',
        marginBottom: '8px',
        letterSpacing: '-0.02em'
    };

    const subtitleStyle = {
        fontSize: '14px',
        color: '#64748B',
        marginBottom: '24px'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        color: '#334155',
        marginBottom: '8px',
        fontWeight: '400'
    };

    const selectStyle = {
        width: '100%',
        padding: '12px 14px',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        fontSize: '14px',
        outline: 'none',
        background: '#fff',
        fontFamily: "'Telex', sans-serif"
    };

    return (
        <AdminLayout title="Pengaturan Alarm & Notifikasi">
            <Head title="Pengaturan Alarm - SIM Aduan" />

            <div style={containerStyle}>
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F1F5F9', pb: '16px', marginBottom: '24px' }}>
                        <div>
                            <h2 style={titleStyle}>Konfigurasi Alarm Aduan</h2>
                            <p style={subtitleStyle}>Sesuaikan cara sistem memperingatkan Anda saat pengaduan baru masuk di portal publik.</p>
                        </div>
                    </div>

                    {/* SECTION 1: SYSTEM ACTIVE STATE TOGGLE */}
                    <div style={groupStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '15px', color: '#1E293B', fontWeight: '400' }}>Aktifkan Alarm Suara</h4>
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>
                                    Mainkan suara alarm otomatis jika ada aduan masuk dengan status menunggu validasi.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEnabled(!enabled)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    border: '1px solid',
                                    borderColor: enabled ? '#10B981' : '#CBD5E1',
                                    background: enabled ? '#F0FDF4' : '#F8FAFC',
                                    color: enabled ? '#10B981' : '#64748B',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                }}
                            >
                                <i className={`fa-solid ${enabled ? 'fa-bell' : 'fa-bell-slash'}`} style={{ marginRight: '8px' }}></i>
                                {enabled ? 'Aktif' : 'Nonaktif'}
                            </button>
                        </div>
                    </div>

                    {/* SECTION 2: RINGTONE CHOICE */}
                    <div style={groupStyle}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'flex-end' }}>
                            <div>
                                <label style={labelStyle}>Pilih Nada Dering (Ringtone)</label>
                                <select 
                                    value={ringtone} 
                                    onChange={(e) => {
                                        setRingtone(e.target.value);
                                        stopSynthesizedAlarm();
                                        setIsPlayingPreview(false);
                                    }} 
                                    style={selectStyle}
                                >
                                    <option value="beep">Beep Klasik (Alarm Standar)</option>
                                    <option value="siren">Sirene Patroli (Loud & Urgent)</option>
                                    <option value="chime">Lonceng Digital (Soft & Melodic)</option>
                                    <option value="radar">Sinyal Radar (Warning Pulse)</option>
                                </select>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={togglePreview}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        border: '1px solid',
                                        borderColor: isPlayingPreview ? '#EF4444' : '#2563EB',
                                        background: isPlayingPreview ? '#FEF2F2' : '#EFF6FF',
                                        color: isPlayingPreview ? '#EF4444' : '#2563EB',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.15s'
                                    }}
                                >
                                    <i className={`fa-solid ${isPlayingPreview ? 'fa-stop' : 'fa-play'}`}></i>
                                    {isPlayingPreview ? 'Hentikan Tes' : 'Uji Coba Nada'}
                                </button>
                            </div>
                        </div>

                        {/* Soundwave Micro-animation when testing sound */}
                        {isPlayingPreview && (
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginTop: '14px', height: '16px', paddingLeft: '4px' }}>
                                <span style={{ fontSize: '11px', color: '#2563EB', marginRight: '8px' }}>Memutar contoh nada dering...</span>
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div 
                                        key={i} 
                                        style={{ 
                                            width: '3px', 
                                            background: '#2563EB', 
                                            height: '100%',
                                            animation: `soundwave 0.5s ease-in-out infinite alternate`,
                                            animationDelay: `${i * 0.1}s`
                                        }} 
                                    />
                                ))}
                                <style>{`
                                    @keyframes soundwave {
                                        0% { height: 3px; }
                                        100% { height: 16px; }
                                    }
                                `}</style>
                            </div>
                        )}
                    </div>

                    {/* SECTION 3: SOUND DURATION */}
                    <div style={groupStyle}>
                        <label style={labelStyle}>Durasi Bunyi Alarm</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input 
                                type="number"
                                min="1"
                                placeholder="Misal: 10"
                                value={duration} 
                                onChange={(e) => handleDurationChange(e.target.value)} 
                                style={{ ...selectStyle, paddingRight: '70px' }}
                            />
                            <span style={{
                                position: 'absolute',
                                right: '14px',
                                fontSize: '14px',
                                color: '#64748B',
                                pointerEvents: 'none'
                            }}>
                                Detik
                            </span>
                        </div>
                        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                            * Menentukan seberapa lama nada dering berbunyi sebelum berhenti secara otomatis bila tidak segera direspons.
                        </p>
                    </div>

                    {/* SECTION 4: TRIGGER DELAY THRESHOLD */}
                    <div style={{ marginBottom: 0 }}>
                        <label style={labelStyle}>Batas Waktu Penundaan Alarm setelah Aduan Masuk</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input 
                                type="number"
                                min="0"
                                placeholder="Misal: 2"
                                value={delayMinutes} 
                                onChange={(e) => handleDelayChange(e.target.value)} 
                                style={{ ...selectStyle, paddingRight: '70px' }}
                            />
                            <span style={{
                                position: 'absolute',
                                right: '14px',
                                fontSize: '14px',
                                color: '#64748B',
                                pointerEvents: 'none'
                            }}>
                                Menit
                            </span>
                        </div>
                        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                            * Jika diatur selain 0, alarm hanya akan berbunyi apabila ada aduan masuk yang didiamkan (menunggu validasi) selama lebih dari durasi waktu di atas.
                        </p>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
