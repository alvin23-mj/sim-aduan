import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div style={{ marginBottom: '24px', fontSize: '14px', color: '#64748B', lineHeight: '1.5', textAlign: 'center' }}>
                Terima kasih telah mendaftar! Sebelum memulai, silakan verifikasi alamat email Anda dengan mengeklik tautan yang baru saja kami kirimkan ke email Anda. Jika tidak menerima email tersebut, kami dengan senang hati akan mengirimkan yang baru.
            </div>

            {status === 'verification-link-sent' && (
                <div style={{ marginBottom: '16px', fontSize: '14px', color: '#155724', background: '#D4EDDA', padding: '10px 14px', borderRadius: '6px', border: '1px solid #C3E6CB' }}>
                    Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                </div>
            )}

            <form onSubmit={submit}>
                <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                        {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                        <i className="fa-solid fa-paper-plane" style={{ fontSize: '13px' }}></i>
                    </button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748B',
                            cursor: 'pointer',
                            fontSize: '13px',
                            textDecoration: 'underline',
                            fontFamily: 'Telex',
                            alignSelf: 'center',
                            transition: 'color 0.15s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#334155'}
                        onMouseLeave={(e) => e.target.style.color = '#64748B'}
                    >
                        Keluar / Log Out
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
