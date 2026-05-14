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
            $table->string('status')->default('menunggu_validasi')->change();
            $table->string('validator')->nullable()->after('priority');
            $table->timestamp('validated_at')->nullable()->after('validator');
        });
    }

    public function down(): void
    {
        Schema::table('aduans', function (Blueprint $table) {
            $table->dropColumn(['validator', 'validated_at']);
        });
    }
};
