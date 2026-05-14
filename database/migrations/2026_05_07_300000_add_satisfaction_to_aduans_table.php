<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('aduans', function (Blueprint $table) {
            $table->string('satisfaction')->nullable()->after('response');
        });
    }

    public function down(): void
    {
        Schema::table('aduans', function (Blueprint $table) {
            $table->dropColumn('satisfaction');
        });
    }
};
