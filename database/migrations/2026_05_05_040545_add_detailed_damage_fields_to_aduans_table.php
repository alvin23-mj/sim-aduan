<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('aduans', function (Blueprint $table) {
            $table->string('asset_name')->nullable();
            $table->string('asset_brand')->nullable();
            $table->string('inventory_number')->nullable();
            $table->string('asset_location')->nullable();
            $table->string('asset_user')->nullable();
            $table->string('damage_type')->nullable(); // hardware, software, lainnya
            $table->text('damage_chronology')->nullable();
            $table->string('actions_taken')->nullable(); // perbaikan_ringan, sedang, berat, tidak_dapat_diperbaiki, vendor
            $table->string('recommendation')->nullable(); // perbaikan_sparepart, tidak_ekonomis, perbaikan_vendor
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aduans', function (Blueprint $table) {
            $table->dropColumn([
                'asset_name', 'asset_brand', 'inventory_number', 'asset_location', 
                'asset_user', 'damage_type', 'damage_chronology', 'actions_taken', 'recommendation'
            ]);
        });
    }
};
