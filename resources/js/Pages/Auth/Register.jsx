import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun" />

            <form onSubmit={submit}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Nama Lengkap</label>

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Masukkan nama lengkap Anda"
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

                    <InputError message={errors.name} style={{ marginTop: '6px', color: '#DC2626', fontSize: '13px' }} />
                </div>

                <div style={{ marginTop: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Alamat Email</label>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
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

                <div style={{ marginTop: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Kata Sandi</label>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Minimal 8 karakter"
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

                    <InputError message={errors.password} style={{ marginTop: '6px', color: '#DC2626', fontSize: '13px' }} />
                </div>

                <div style={{ marginTop: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '400', color: '#475569', marginBottom: '8px' }}>Konfirmasi Kata Sandi</label>

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Ulangi kata sandi Anda"
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

                    <InputError message={errors.password_confirmation} style={{ marginTop: '6px', color: '#DC2626', fontSize: '13px' }} />
                </div>

                <div style={{ marginTop: '32px' }}>
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
                        {processing ? 'Memproses...' : 'Daftarkan Akun'}
                        <i className="fa-solid fa-user-plus" style={{ fontSize: '14px' }}></i>
                    </button>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>Sudah punya akun? </span>
                    <Link
                        href={route('login')}
                        style={{
                            fontSize: '13px',
                            color: '#2563EB',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            marginLeft: '4px',
                            transition: 'color 0.15s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#1D4ED8'}
                        onMouseLeave={(e) => e.target.style.color = '#2563EB'}
                    >
                        Masuk Sekarang
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
