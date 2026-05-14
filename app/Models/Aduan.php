<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aduan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ticket_number',
        'name',
        'email',
        'phone',
        'unit',
        'category',
        'subject',
        'description',
        'status',
        'priority',
        'validator',
        'validated_at',
        'response',
        'damage_report',
        'technician',
        'started_working_at',
        'asset_name',
        'asset_brand',
        'inventory_number',
        'asset_location',
        'asset_user',
        'damage_type',
        'damage_chronology',
        'actions_taken',
        'recommendation',
        'report_number',
        'report_date',
        'signature',
        'satisfaction',
        'kepala_ruang_name',
        'kepala_ruang_nip',
        'technician_nip',
        'kaisik_name',
        'kaisik_nip',
        'is_manual_priority',
        'is_ba_sent',
        'kepala_ruang_signature',
    ];

    protected $casts = [
        'validated_at' => 'datetime',
        'started_working_at' => 'datetime',
        'is_manual_priority' => 'boolean',
        'is_ba_sent' => 'boolean',
    ];
}
