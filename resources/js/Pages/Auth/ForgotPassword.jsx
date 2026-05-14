import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div style={{ marginBottom: '24px', fontSize: '14px', color: '#64748B', lineHeight: '1.5', textAlign: 'center' }}>
                Lupa kata sandi Anda? Tidak masalah. Beritahu kami alamat email Anda dan kami akan mengirimkan tautan pemulihan kata sandi melalui email.
            </div>

            {status && (
                <div style={{ marginBottom: '16px', fontSize: '14px', color: '#155724', background: '#D4EDDA', padding: '10px 14px', borderRadius: '6px', border: '1px solid #C3E6CB' }}>
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Alamat Email</label>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="nama@email.com"
                        required
                        style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            background: '#FFFFFF',
                            color: '#0F172A',
                            fontSize: '14px',
                            fontFamily: 'Telex',
                            outline: 'none',
                            transition: 'border-color 0.15s, box-shadow 0.15s',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#2563EB';
                            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#D1D5DB';
                            e.target.style.boxShadow = 'none';
                        }}
                    />

                    <InputError message={errors.email} style={{ marginTop: '6px', color: '#DC2626', fontSize: '13px' }} />
                </div>

                <div style={{ marginTop: '28px' }}>
                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#2563EB',
                            color: '#fff',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '15px',
                            fontFamily: 'Telex',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: processing ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#1D4ED8';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#2563EB';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.2)';
                        }}
                    >
                        {processing ? 'Memproses...' : 'Kirim Link Pemulihan'}
                        <i className="fa-solid fa-paper-plane" style={{ fontSize: '13px' }}></i>
                    </button>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                    <Link
                        href={route('login')}
                        style={{
                            fontSize: '13px',
                            color: '#2563EB',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            transition: 'color 0.15s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#1D4ED8'}
                        onMouseLeave={(e) => e.target.style.color = '#2563EB'}
                    >
                        <i className="fa-solid fa-arrow-left" style={{ fontSize: '12px' }}></i>
                        Kembali Ke Halaman Masuk
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
