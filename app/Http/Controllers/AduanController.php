<?php

namespace App\Http\Controllers;

use App\Models\Aduan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AduanController extends Controller
{
    public function create()
    {
        $categories = \App\Models\Category::where('is_active', true)->orderBy('name')->get();
        return Inertia::render('Welcome', [
            'categories' => $categories
        ]);
    }

    public function showForm()
    {
        $categories = \App\Models\Category::where('is_active', true)->orderBy('name')->get();
        return Inertia::render('AduanForm', [
            'categories' => $categories
        ]);
    }

    public function showTracking()
    {
        return Inertia::render('AduanTracking');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'nullable|string|max:255',
            'email'       => 'nullable|string|max:255',
            'phone'       => 'nullable|string|max:30',
            'unit'        => 'nullable|string|max:255',
            'category'    => 'nullable|string|max:255',

            'subject'     => 'nullable|string|max:255',
            'description' => 'required|string',
            'signature'   => 'nullable|string',
        ]);

        $validated['name'] = $validated['name'] ?? 'Anonim';
        $validated['email'] = $validated['email'] ?? 'pelapor@anonim.com';
        
        if (auth()->check()) {
            $validated['user_id'] = auth()->id();
        }

        if (empty($validated['subject'])) {
            $validated['subject'] = \Illuminate\Support\Str::limit($validated['description'], 50);
        }

        $nextNumber = (Aduan::max('id') ?? 0) + 1;
        $validated['ticket_number'] = 'ADU-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        $validated['status'] = 'menunggu_validasi';

        $aduan = Aduan::create($validated);

        // Record notification
        try {
            \App\Models\Notification::create([
                'title' => 'Aduan Baru Masuk',
                'message' => "Aduan baru dengan tiket {$aduan->ticket_number} dari pelapor {$aduan->name} (Unit: " . ($aduan->unit ?? '-') . ") berhasil masuk.",
                'type' => 'new_aduan',
                'aduan_id' => $aduan->id,
                'role' => 'admin',
            ]);

            if ($aduan->user_id) {
                \App\Models\Notification::create([
                    'title' => 'Aduan Berhasil Dikirim',
                    'message' => "Aduan Anda dengan nomor tiket {$aduan->ticket_number} sedang menunggu validasi oleh Admin.",
                    'type' => 'new_aduan',
                    'aduan_id' => $aduan->id,
                    'user_id' => $aduan->user_id,
                    'role' => 'pelapor',
                ]);
            }
        } catch (\Exception $e) {
            \Log::error("Failed to create notification: " . $e->getMessage());
        }

        return redirect()->route('aduan.success', ['ticket' => $aduan->ticket_number]);
    }

    public function success(Request $request)
    {
        return Inertia::render('Success', [
            'ticket' => $request->query('ticket'),
        ]);
    }

    public function index()
    {
        $user = auth()->user();
        if ($user->role === 'pelapor') {
            $stats = [
                'total'             => (int) Aduan::where('user_id', $user->id)->count(),
                'menunggu_validasi' => (int) Aduan::where('user_id', $user->id)->where('status', 'menunggu_validasi')->count(),
                'sudah_validasi'    => (int) Aduan::where('user_id', $user->id)->where('status', 'sudah_validasi')->count(),
                'sedang_pengerjaan' => (int) Aduan::where('user_id', $user->id)->where('status', 'sedang_pengerjaan')->count(),
                'selesai'           => (int) Aduan::where('user_id', $user->id)->where('status', 'selesai')->count(),
            ];
            
            $recent_aduans = Aduan::where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get();

            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'recent_aduans' => $recent_aduans,
                'role' => 'pelapor'
            ]);
        }

        $stats = [
            'total'             => (int) Aduan::count(),
            'menunggu_validasi' => (int) Aduan::where('status', 'menunggu_validasi')->count(),
            'sudah_validasi'    => (int) Aduan::where('status', 'sudah_validasi')->count(),
            'sedang_pengerjaan' => (int) Aduan::where('status', 'sedang_pengerjaan')->count(),
            'selesai'           => (int) Aduan::where('status', 'selesai')->count(),
            'barang_rusak'      => (int) Aduan::where('status', 'barang_rusak')->count(),
            'diperbaiki_sendiri' => (int) Aduan::where('status', 'diperbaiki_sendiri')->count(),
        ];

        $dayNamesIndonesian = [
            'Monday'    => 'Senin',
            'Tuesday'   => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday'  => 'Kamis',
            'Friday'    => 'Jumat',
            'Saturday'  => 'Sabtu',
            'Sunday'    => 'Minggu',
        ];

        $weeklyChart = [
            'labels'             => [],
            'masuk'              => [],
            'selesai'            => [],
            'barang_rusak'       => [],
            'diperbaiki_sendiri' => [],
        ];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateStr = $date->toDateString();
            
            $englishDay = $date->format('l');
            $indonesianDay = $dayNamesIndonesian[$englishDay] ?? $englishDay;
            $weeklyChart['labels'][] = $indonesianDay;

             $weeklyChart['masuk'][]              = (int) Aduan::whereDate('created_at', $dateStr)->count();
             $weeklyChart['selesai'][]            = (int) Aduan::whereDate('updated_at', $dateStr)->where('status', 'selesai')->count();
             $weeklyChart['barang_rusak'][]       = (int) Aduan::whereDate('updated_at', $dateStr)->where('status', 'barang_rusak')->count();
             $weeklyChart['diperbaiki_sendiri'][] = (int) Aduan::whereDate('updated_at', $dateStr)->where('status', 'diperbaiki_sendiri')->count();
         }
        
        return Inertia::render('Dashboard', [
            'stats'        => $stats,
            'weekly_chart' => $weeklyChart,
            'role'         => $user->role
        ]);
    }

    public function pelaporRiwayat(\Illuminate\Http\Request $request)
    {
        $user = auth()->user();
        $query = Aduan::where('user_id', $user->id);

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('ticket_number', 'like', "%{$request->search}%")
                  ->orWhere('subject', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        $aduans = $query->latest()->get();

        return Inertia::render('Pelapor/Riwayat', [
            'aduans' => $aduans,
            'filters' => $request->only(['search'])
        ]);
    }

    public function pelaporBuatAduan()
    {
        $categories = \App\Models\Category::where('is_active', true)->orderBy('name')->get();
        return Inertia::render('Pelapor/BuatAduan', [
            'categories' => $categories
        ]);
    }

    public function pelaporStoreAduan(\Illuminate\Http\Request $request)
    {
        $user = auth()->user();
        $validated = $request->validate([
            'unit'        => 'nullable|string|max:255',
            'category'    => 'nullable|string|max:255',
            'subject'     => 'nullable|string|max:255',
            'description' => 'required|string',
            'signature'   => 'nullable|string',
        ]);

        $validated['user_id'] = $user->id;
        $validated['name'] = $user->name;
        $validated['email'] = $user->email;
        $validated['phone'] = $user->phone ?? '-';
        
        if (empty($validated['subject'])) {
            $validated['subject'] = \Illuminate\Support\Str::limit($validated['description'], 50);
        }

        $nextNumber = (Aduan::max('id') ?? 0) + 1;
        $validated['ticket_number'] = 'ADU-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);
        $validated['status'] = 'menunggu_validasi';

        $aduan = Aduan::create($validated);

         // Record notification
         try {
             \App\Models\Notification::create([
                 'title' => 'Aduan Baru Masuk',
                 'message' => "Aduan baru dengan tiket {$aduan->ticket_number} dari pelapor {$aduan->name} (Unit: " . ($aduan->unit ?? '-') . ") berhasil masuk.",
                 'type' => 'new_aduan',
                 'aduan_id' => $aduan->id,
                 'role' => 'admin',
             ]);
 
             if ($aduan->user_id) {
                 \App\Models\Notification::create([
                     'title' => 'Aduan Berhasil Dikirim',
                     'message' => "Aduan Anda dengan nomor tiket {$aduan->ticket_number} sedang menunggu validasi oleh Admin.",
                     'type' => 'new_aduan',
                     'aduan_id' => $aduan->id,
                     'user_id' => $aduan->user_id,
                     'role' => 'pelapor',
                 ]);
             }
         } catch (\Exception $e) {
             \Log::error("Failed to create notification: " . $e->getMessage());
         }

        return redirect()->route('pelapor.riwayat')->with('success', "Aduan berhasil dibuat dengan nomor tiket {$aduan->ticket_number}!");
    }

    public function kanban()
    {
        $aduans = Aduan::latest()->get();
        $technicians = \App\Models\Technician::where('is_active', true)->orderBy('name')->get();
        $categories = \App\Models\Category::where('is_active', true)->orderBy('name')->get();
        $myTechnician = \App\Models\Technician::where('user_id', auth()->id())->first();
        return Inertia::render('Aduans/Kanban', compact('aduans', 'technicians', 'categories', 'myTechnician'));
    }

    public function show(Aduan $aduan)
    {
        $technicians = \App\Models\Technician::where('is_active', true)->orderBy('name')->get();
        
        $messages = \App\Models\AduanMessage::with('user')
            ->where('aduan_id', $aduan->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Aduans/Show', compact('aduan', 'technicians', 'messages'));
    }

    public function storeMessage(Request $request, Aduan $aduan)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $message = \App\Models\AduanMessage::create([
            'aduan_id' => $aduan->id,
            'user_id' => auth()->id(),
            'message' => $validated['message'],
        ]);

        // When a new chat is sent, create notifications for other roles
        try {
            $user = auth()->user();
            
            // If the sender is pelapor, notify admin and assigned technician (if any)
            if ($user->role === 'pelapor') {
                // To Admin
                \App\Models\Notification::create([
                    'title' => 'Pesan Baru Pelapor',
                    'message' => "{$user->name} mengirim pesan di tiket {$aduan->ticket_number}: \"" . \Illuminate\Support\Str::limit($validated['message'], 50) . "\"",
                    'type' => 'status_change',
                    'aduan_id' => $aduan->id,
                    'role' => 'admin',
                ]);

                // To assigned Technician (if any)
                if ($aduan->technician) {
                    $techs = explode(', ', $aduan->technician);
                    foreach ($techs as $techName) {
                        $tech = \App\Models\Technician::where('name', $techName)->first();
                        if ($tech && $tech->user_id) {
                            \App\Models\Notification::create([
                                'title' => 'Pesan Baru Pelapor',
                                'message' => "{$user->name} mengirim pesan di tiket {$aduan->ticket_number} yang Anda tangani.",
                                'type' => 'status_change',
                                'aduan_id' => $aduan->id,
                                'user_id' => $tech->user_id,
                                'role' => 'teknisi',
                            ]);
                        }
                    }
                }
            }
            // If sender is admin, notify pelapor and assigned technician
            elseif ($user->role === 'admin') {
                if ($aduan->user_id) {
                    \App\Models\Notification::create([
                        'title' => 'Pesan Baru Admin',
                        'message' => "Admin mengirim pesan di tiket {$aduan->ticket_number}: \"" . \Illuminate\Support\Str::limit($validated['message'], 50) . "\"",
                        'type' => 'status_change',
                        'aduan_id' => $aduan->id,
                        'user_id' => $aduan->user_id,
                        'role' => 'pelapor',
                    ]);
                }

                if ($aduan->technician) {
                    $techs = explode(', ', $aduan->technician);
                    foreach ($techs as $techName) {
                        $tech = \App\Models\Technician::where('name', $techName)->first();
                        if ($tech && $tech->user_id) {
                            \App\Models\Notification::create([
                                'title' => 'Pesan Baru Admin',
                                'message' => "Admin mengirim pesan di tiket {$aduan->ticket_number} yang Anda tangani.",
                                'type' => 'status_change',
                                'aduan_id' => $aduan->id,
                                'user_id' => $tech->user_id,
                                'role' => 'teknisi',
                            ]);
                        }
                    }
                }
            }
            // If sender is teknisi, notify admin and pelapor
            elseif ($user->role === 'teknisi') {
                // To Admin
                \App\Models\Notification::create([
                    'title' => 'Pesan Baru Teknisi',
                    'message' => "Teknisi {$user->name} mengirim pesan di tiket {$aduan->ticket_number}: \"" . \Illuminate\Support\Str::limit($validated['message'], 50) . "\"",
                    'type' => 'status_change',
                    'aduan_id' => $aduan->id,
                    'role' => 'admin',
                ]);

                // To Pelapor
                if ($aduan->user_id) {
                    \App\Models\Notification::create([
                        'title' => 'Pesan Baru Teknisi',
                        'message' => "Teknisi {$user->name} mengirim pesan di tiket {$aduan->ticket_number}: \"" . \Illuminate\Support\Str::limit($validated['message'], 50) . "\"",
                        'type' => 'status_change',
                        'aduan_id' => $aduan->id,
                        'user_id' => $aduan->user_id,
                        'role' => 'pelapor',
                    ]);
                }
            }
        } catch (\Exception $e) {
            \Log::error("Failed to notify chat message: " . $e->getMessage());
        }

        return back();
    }

    public function update(Request $request, Aduan $aduan)
    {
        $validated = $request->validate([
            'status'        => 'sometimes|required|in:menunggu_validasi,sudah_validasi,sedang_pengerjaan,selesai,barang_rusak,diperbaiki_sendiri',
            'priority'      => 'nullable|in:ringan,sedang,berat',
            'response'      => 'nullable|string',
            'damage_report' => 'nullable|string',
            'technician'    => 'nullable|string|max:255',
            'validator'     => 'nullable|string|max:255',
            'category'      => 'nullable|string|max:255',
            'asset_name'        => 'nullable|string|max:255',
            'asset_brand'       => 'nullable|string|max:255',
            'inventory_number'  => 'nullable|string|max:255',
            'asset_location'    => 'nullable|string|max:255',
            'asset_user'        => 'nullable|string|max:255',
            'damage_type'       => 'nullable|string|max:255',
            'damage_chronology' => 'nullable|string',
            'actions_taken'     => 'nullable|string|max:255',
            'report_number'     => 'nullable|string|max:255',
            'report_date'       => 'nullable|date',
            'satisfaction'      => 'nullable|string|in:puas,tidak_puas',
            'is_manual_priority'=> 'nullable|boolean',
            'unit'              => 'nullable|string|max:255',
            'description'       => 'nullable|string',
            'recommendation'    => 'nullable|string',
            'kepala_ruang_name' => 'nullable|string|max:255',
            'kepala_ruang_nip'  => 'nullable|string|max:255',
            'technician_nip'    => 'nullable|string|max:255',
            'kaisik_name'       => 'nullable|string|max:255',
            'kaisik_nip'        => 'nullable|string|max:255',
        ]);

        $oldStatus = $aduan->status;
        $oldTechnician = $aduan->technician;
        $oldPriority = $aduan->priority;

        if (isset($validated['validator']) && empty($aduan->validated_at)) {
            $validated['validated_at'] = now();
        }

        if (isset($validated['status']) && $validated['status'] === 'sedang_pengerjaan' && empty($aduan->started_working_at)) {
            $validated['started_working_at'] = now();
        }

        if (isset($validated['is_manual_priority'])) {
            $validated['is_manual_priority'] = (bool) $validated['is_manual_priority'];
        }

        $aduan->update($validated);

        // Record notifications for updates
        try {
            // 1. Status changed
            if ($oldStatus !== $aduan->status) {
                $statusLabels = [
                    'menunggu_validasi' => 'Menunggu Validasi',
                    'sudah_validasi' => 'Sudah Validasi',
                    'sedang_pengerjaan' => 'Sedang Pengerjaan',
                    'selesai' => 'Selesai',
                    'barang_rusak' => 'Barang Rusak',
                    'diperbaiki_sendiri' => 'Diperbaiki Sendiri',
                ];
                $from = $statusLabels[$oldStatus] ?? $oldStatus;
                $to = $statusLabels[$aduan->status] ?? $aduan->status;

                // For Admin
                \App\Models\Notification::create([
                    'title' => 'Status Aduan Diperbarui',
                    'message' => "Status tiket {$aduan->ticket_number} diubah dari \"{$from}\" menjadi \"{$to}\".",
                    'type' => 'status_change',
                    'aduan_id' => $aduan->id,
                    'role' => 'admin',
                ]);

                // For Pelapor (if reporter is registered)
                if ($aduan->user_id) {
                    \App\Models\Notification::create([
                        'title' => 'Status Aduan Diperbarui',
                        'message' => "Status aduan Anda dengan nomor tiket {$aduan->ticket_number} kini \"{$to}\".",
                        'type' => 'status_change',
                        'aduan_id' => $aduan->id,
                        'user_id' => $aduan->user_id,
                        'role' => 'pelapor',
                    ]);
                }

                // For assigned Technician (if assigned)
                if ($aduan->technician) {
                    $tech = \App\Models\Technician::where('name', $aduan->technician)->first();
                    if ($tech && $tech->user_id) {
                        \App\Models\Notification::create([
                            'title' => 'Status Aduan Diperbarui',
                            'message' => "Status tiket {$aduan->ticket_number} yang Anda tangani diubah menjadi \"{$to}\".",
                            'type' => 'status_change',
                            'aduan_id' => $aduan->id,
                            'user_id' => $tech->user_id,
                            'role' => 'teknisi',
                        ]);
                    }
                }
            }

            // 2. Technician assigned/changed
            if ($oldTechnician !== $aduan->technician && !empty($aduan->technician)) {
                // For Admin
                \App\Models\Notification::create([
                    'title' => 'Teknisi Ditugaskan',
                    'message' => "Teknisi \"{$aduan->technician}\" ditugaskan untuk menangani tiket {$aduan->ticket_number}.",
                    'type' => 'technician_assigned',
                    'aduan_id' => $aduan->id,
                    'role' => 'admin',
                ]);

                // For Pelapor (if reporter is registered)
                if ($aduan->user_id) {
                    \App\Models\Notification::create([
                        'title' => 'Teknisi Ditugaskan',
                        'message' => "Teknisi \"{$aduan->technician}\" telah ditugaskan untuk menangani aduan Anda {$aduan->ticket_number}.",
                        'type' => 'technician_assigned',
                        'aduan_id' => $aduan->id,
                        'user_id' => $aduan->user_id,
                        'role' => 'pelapor',
                    ]);
                }

                // For newly assigned Technician
                $tech = \App\Models\Technician::where('name', $aduan->technician)->first();
                if ($tech && $tech->user_id) {
                    \App\Models\Notification::create([
                        'title' => 'Tugas Baru Ditugaskan',
                        'message' => "Anda telah ditugaskan untuk menangani tiket aduan {$aduan->ticket_number}.",
                        'type' => 'technician_assigned',
                        'aduan_id' => $aduan->id,
                        'user_id' => $tech->user_id,
                        'role' => 'teknisi',
                    ]);
                }
            }

            // 3. Priority changed
            if ($oldPriority !== $aduan->priority && !empty($aduan->priority)) {
                // For Admin
                \App\Models\Notification::create([
                    'title' => 'Prioritas Aduan Diubah',
                    'message' => "Prioritas tiket {$aduan->ticket_number} diset menjadi \"{$aduan->priority}\".",
                    'type' => 'priority_change',
                    'aduan_id' => $aduan->id,
                    'role' => 'admin',
                ]);

                // For Pelapor (if reporter is registered)
                if ($aduan->user_id) {
                    \App\Models\Notification::create([
                        'title' => 'Prioritas Aduan Diubah',
                        'message' => "Prioritas aduan Anda {$aduan->ticket_number} telah diubah menjadi \"{$aduan->priority}\".",
                        'type' => 'priority_change',
                        'aduan_id' => $aduan->id,
                        'user_id' => $aduan->user_id,
                        'role' => 'pelapor',
                    ]);
                }

                // For assigned Technician (if assigned)
                if ($aduan->technician) {
                    $tech = \App\Models\Technician::where('name', $aduan->technician)->first();
                    if ($tech && $tech->user_id) {
                        \App\Models\Notification::create([
                            'title' => 'Prioritas Tugas Diubah',
                            'message' => "Prioritas tiket {$aduan->ticket_number} yang Anda tangani diubah menjadi \"{$aduan->priority}\".",
                            'type' => 'priority_change',
                            'aduan_id' => $aduan->id,
                            'user_id' => $tech->user_id,
                            'role' => 'teknisi',
                        ]);
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::error("Failed to record update notification: " . $e->getMessage());
        }

        return back()->with('success', 'Aduan berhasil diperbarui.');
    }

    public function priorityBoard()
    {
        $aduans = Aduan::where('status', 'sedang_pengerjaan')->get();

        foreach ($aduans as $aduan) {
            if (!$aduan->started_working_at) continue;

            $minutes = $aduan->started_working_at->diffInMinutes(now());
            $hours = $aduan->started_working_at->diffInHours(now());
            $changed = false;

            if (!$aduan->is_manual_priority) {
                if ($aduan->priority === 'ringan' && $minutes >= 30) {
                    $aduan->priority = 'sedang';
                    $changed = true;
                } elseif ($aduan->priority === 'sedang' && $hours >= 48) {
                    $aduan->priority = 'berat';
                    $changed = true;
                }
            }

            if ($changed) {
                $aduan->save();
            }
        }

        // Refresh data after potential updates
        $aduans = Aduan::where('status', 'sedang_pengerjaan')->get();

        return Inertia::render('Aduans/PriorityBoard', compact('aduans'));
    }

    public function damageReport(Aduan $aduan)
    {
        return Inertia::render('Aduans/DamageReport', compact('aduan'));
    }

    public function pelaporDamageReport(Aduan $aduan)
    {
        return Inertia::render('Pelapor/DamageReport', compact('aduan'));
    }

    public function spkReport(Aduan $aduan)
    {
        $technicians = \App\Models\Technician::where('is_active', true)->get(['id', 'name', 'signature']);
        return Inertia::render('Aduans/SpkReport', [
            'aduan' => $aduan,
            'technicians' => $technicians,
        ]);
    }

    public function damageReportsIndex(\Illuminate\Http\Request $request)
    {
        $query = Aduan::where('status', 'barang_rusak');

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('ticket_number', 'like', "%{$request->search}%")
                  ->orWhere('name', 'like', "%{$request->search}%")
                  ->orWhere('unit', 'like', "%{$request->search}%")
                  ->orWhere('asset_name', 'like', "%{$request->search}%")
                  ->orWhere('report_number', 'like', "%{$request->search}%");
            });
        }

        if ($request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $aduans = $query->latest()->get();
        $technicians = \App\Models\Technician::where('is_active', true)->get(['id', 'name', 'signature']);

        return Inertia::render('Aduans/DamageReportsIndex', [
            'aduans' => $aduans,
            'filters' => $request->only(['search', 'start_date', 'end_date']),
            'technicians' => $technicians,
        ]);
    }

    public function damageReportEdit(Aduan $aduan)
    {
        return Inertia::render('Aduans/DamageReportEdit', compact('aduan'));
    }

    public function sendBA(Aduan $aduan)
    {
        $aduan->update([
            'is_ba_sent' => true
        ]);

        // Generate a targeted notification for the Pelapor
        if ($aduan->user_id) {
            try {
                \App\Models\Notification::create([
                    'user_id' => $aduan->user_id,
                    'role' => 'pelapor',
                    'title' => 'Berita Acara Kerusakan Dikirim',
                    'message' => "Berita Acara Kerusakan untuk aduan {$aduan->ticket_number} telah dikirim ke dashboard Anda.",
                    'type' => 'status_change',
                    'aduan_id' => $aduan->id,
                ]);
            } catch (\Exception $e) {
                \Log::error("Failed to create send-ba notification: " . $e->getMessage());
            }
        }

        return redirect()->back();
    }

    public function signKepalaRuang(\Illuminate\Http\Request $request, Aduan $aduan)
    {
        $request->validate([
            'signature' => 'required|string',
            'kepala_ruang_name' => 'nullable|string',
            'kepala_ruang_nip' => 'nullable|string',
        ]);

        $updateData = [
            'kepala_ruang_signature' => $request->signature,
            'kepala_ruang_name' => $request->kepala_ruang_name,
            'kepala_ruang_nip' => $request->kepala_ruang_nip,
        ];

        $aduan->update($updateData);

        return redirect()->back();
    }

    public function getNewAduansCount()
    {
        $newAduans = Aduan::where('status', 'menunggu_validasi')->get(['id', 'created_at']);
        return response()->json([
            'new_aduans' => $newAduans,
        ]);
    }

    public function track(\Illuminate\Http\Request $request)
    {
        $query = $request->query('query');
        if (empty($query)) {
            return response()->json(['aduans' => []]);
        }

        // Search by ticket_number, email (repurposed for WhatsApp), or name
        $aduans = Aduan::where('ticket_number', $query)
            ->orWhere('email', 'like', "%{$query}%")
            ->orWhere('name', 'like', "%{$query}%")
            ->latest()
            ->limit(10)
            ->get(['id', 'ticket_number', 'name', 'unit', 'category', 'description', 'status', 'priority', 'technician', 'response', 'created_at']);

        return response()->json([
            'aduans' => $aduans
        ]);
    }

    public function publicSelfFix(\Illuminate\Http\Request $request, Aduan $aduan)
    {
        // Only allow if status is still pending validation
        $allowedStatuses = ['menunggu_validasi', 'sudah_validasi'];
        if (!in_array($aduan->status, $allowedStatuses)) {
            return response()->json(['success' => false, 'message' => 'Status aduan tidak dapat diubah.'], 422);
        }

        $aduan->update(['status' => 'diperbaiki_sendiri']);

        try {
            \App\Models\Notification::create([
                'title' => 'Aduan Diperbaiki Sendiri',
                'message' => "Pelapor melaporkan bahwa aduan {$aduan->ticket_number} telah diperbaiki sendiri.",
                'type' => 'status_change',
                'aduan_id' => $aduan->id,
                'role' => 'admin',
            ]);
        } catch (\Exception $e) {
            \Log::error("publicSelfFix notification error: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Status berhasil diubah menjadi Diperbaiki Sendiri.']);
    }
}
