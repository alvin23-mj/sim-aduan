<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('aduans', function (Blueprint $table) {
            $table->string('kepala_ruang_name')->nullable()->after('satisfaction');
            $table->string('kepala_ruang_nip')->nullable()->after('kepala_ruang_name');
            $table->string('technician_nip')->nullable()->after('kepala_ruang_nip');
            $table->string('kaisik_name')->nullable()->after('technician_nip');
            $table->string('kaisik_nip')->nullable()->after('kaisik_name');
        });
    }

    public function down(): void
    {
        Schema::table('aduans', function (Blueprint $table) {
            $table->dropColumn([
                'kepala_ruang_name',
                'kepala_ruang_nip',
                'technician_nip',
                'kaisik_name',
                'kaisik_nip'
            ]);
        });
    }
};
