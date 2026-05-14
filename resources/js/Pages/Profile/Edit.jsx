import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

const pageStyle = {
    fontFamily: "'Telex', sans-serif",
};

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout title="Pengaturan Profil">
            <Head title="Profil Saya - SIM Aduan" />

            <div style={pageStyle} className="space-y-6 max-w-5xl">
                {/* Profile Information Card */}
                <div className="bg-white p-6 border border-slate-200 rounded sm:p-8">
                    <div className="max-w-xl">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </div>

                {/* Update Password Card */}
                <div className="bg-white p-6 border border-slate-200 rounded sm:p-8">
                    <div className="max-w-xl">
                        <UpdatePasswordForm />
                    </div>
                </div>

                {/* Delete Account Card */}
                <div className="bg-white p-6 border border-slate-200 rounded sm:p-8">
                    <div className="max-w-xl">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
