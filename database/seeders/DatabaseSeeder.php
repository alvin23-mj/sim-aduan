<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Teknisi User
        User::create([
            'name' => 'Teknisi Robby',
            'email' => 'teknisi@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'teknisi',
        ]);

        // Pelapor User
        User::create([
            'name' => 'Pelapor Unit',
            'email' => 'pelapor@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'pelapor',
        ]);

        $this->call([
            CategorySeeder::class,
            AduanSeeder::class,
        ]);
    }
}
