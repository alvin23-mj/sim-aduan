<?php

namespace Database\Seeders;

use App\Models\Aduan;
use Illuminate\Database\Seeder;

class AduanSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'ticket_number' => 'ADU-001',
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'phone' => '08123456789',
                'unit' => 'Divisi IT',
                'subject' => 'PC Tidak Bisa Booting',
                'description' => 'PC di meja saya tidak bisa masuk ke Windows, hanya muncul layar biru. Mohon bantuan teknisi untuk pengecekan.',
                'status' => 'menunggu_validasi',
                'priority' => 'sedang',
                'technician' => null,
            ],
            [
                'ticket_number' => 'ADU-002',
                'name' => 'Siti Aminah',
                'email' => 'siti@example.com',
                'phone' => '08223344556',
                'unit' => 'Keuangan',
                'subject' => 'Error Aplikasi E-Faktur',
                'description' => 'Aplikasi e-faktur tidak bisa dibuka, muncul pesan error koneksi database. Sangat mendesak karena sedang masa pelaporan pajak.',
                'status' => 'sedang_pengerjaan',
                'priority' => 'berat',
                'technician' => 'Andi Saputra',
                'validator' => 'Admin Utama',
                'validated_at' => now(),
            ],
            [
                'ticket_number' => 'ADU-003',
                'name' => 'Andi Wijaya',
                'email' => 'andi@example.com',
                'phone' => '08556677889',
                'unit' => 'SDM',
                'subject' => 'Printer Macet (Paper Jam)',
                'description' => 'Printer di ruang SDM sering mengalami paper jam saat mencetak dokumen dalam jumlah banyak.',
                'status' => 'selesai',
                'priority' => 'ringan',
                'response' => 'Sudah dilakukan pembersihan roller printer dan penggantian sparepart penarik kertas.',
                'technician' => 'Budi Santoso',
                'validator' => 'Admin Utama',
                'validated_at' => now(),
            ],
            [
                'ticket_number' => 'ADU-004',
                'name' => 'Eka Putri',
                'email' => 'eka@example.com',
                'phone' => '08778899001',
                'unit' => 'Pemasaran',
                'subject' => 'Lupa Password Email Kantor',
                'description' => 'Saya lupa password email kantor dan tidak bisa login. Mohon reset password.',
                'status' => 'sedang_pengerjaan',
                'priority' => 'ringan',
                'technician' => 'Citra Lestari',
                'validator' => 'Admin Utama',
                'validated_at' => now(),
            ],
            [
                'ticket_number' => 'ADU-005',
                'name' => 'Hendro',
                'email' => 'hendro@example.com',
                'phone' => '08112233445',
                'unit' => 'Operasional',
                'subject' => 'Jaringan Internet Lambat',
                'description' => 'Akses internet di lantai 2 sangat lambat sejak kemarin sore, mengganggu pekerjaan tim.',
                'status' => 'menunggu_validasi',
                'priority' => 'berat',
                'technician' => null,
            ],
        ];

        foreach ($data as $aduan) {
            Aduan::create($aduan);
        }
    }
}
