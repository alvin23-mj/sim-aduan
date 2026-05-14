<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Software',
            'Hardware',
            'Jaringan',
            'Lainnya',
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate([
                'name' => $cat,
            ], [
                'is_active' => true,
            ]);
        }
    }
}
