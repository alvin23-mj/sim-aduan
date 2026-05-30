<?php

use App\Http\Controllers\AduanController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TechnicianController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [AduanController::class, 'create'])->name('home');
Route::get('/buat-aduan', [AduanController::class, 'showForm'])->name('aduan.form');
Route::get('/lacak-aduan', [AduanController::class, 'showTracking'])->name('aduan.tracking');
Route::post('/aduan', [AduanController::class, 'store'])->name('aduan.store');
Route::get('/aduan/success', [AduanController::class, 'success'])->name('aduan.success');
Route::get('/api/aduan/track', [AduanController::class, 'track'])->name('aduan.track');
Route::get('/api/categories/active', function() {
    return response()->json(\App\Models\Category::where('is_active', true)->orderBy('name')->get());
})->name('categories.active');
Route::post('/api/aduan/{aduan}/perbaiki-sendiri', [AduanController::class, 'publicSelfFix'])->name('aduan.public-self-fix');

// Admin routes (protected)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [AduanController::class, 'index'])->name('dashboard');
    
    // Pelapor specific routes
    Route::get('/pelapor/riwayat', [AduanController::class, 'pelaporRiwayat'])->name('pelapor.riwayat');
    Route::get('/pelapor/buat-aduan', [AduanController::class, 'pelaporBuatAduan'])->name('pelapor.buat-aduan');
    Route::post('/pelapor/buat-aduan', [AduanController::class, 'pelaporStoreAduan'])->name('pelapor.store-aduan');
    Route::get('/pelapor/aduan/{aduan}/berita-acara', [AduanController::class, 'pelaporDamageReport'])->name('pelapor.damageReport');
    Route::get('/kanban', [AduanController::class, 'kanban'])->name('aduan.kanban');
    Route::get('/prioritas', [AduanController::class, 'priorityBoard'])->name('aduan.priority');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/berita-acara', [AduanController::class, 'damageReportsIndex'])->name('aduan.damageReportsIndex');
    Route::get('/aduan/{aduan}', [AduanController::class, 'show'])->name('aduan.show');
    Route::post('/aduan/{aduan}/messages', [AduanController::class, 'storeMessage'])->name('aduan.messages.store');
    Route::patch('/aduan/{aduan}', [AduanController::class, 'update'])->name('aduan.update');
    Route::get('/aduan/{aduan}/berita-acara/edit', [AduanController::class, 'damageReportEdit'])->name('aduan.damageReportEdit');
    Route::get('/aduan/{aduan}/berita-acara', [AduanController::class, 'damageReport'])->name('aduan.damageReport');
    Route::post('/aduan/{aduan}/send-ba', [AduanController::class, 'sendBA'])->name('aduan.sendBA');
    Route::post('/aduan/{aduan}/sign-kepala-ruang', [AduanController::class, 'signKepalaRuang'])->name('aduan.signKepalaRuang');
    Route::get('/aduan/{aduan}/spk', [AduanController::class, 'spkReport'])->name('aduan.spkReport');
    Route::get('/aduan/{aduan}/spk/edit', [AduanController::class, 'spkReportEdit'])->name('aduan.spkReportEdit');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/signature', [ProfileController::class, 'updateSignature'])->name('profile.signature.update');

    Route::resource('technicians', TechnicianController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('users', UserController::class);
    Route::get('/api/new-aduans', [AduanController::class, 'getNewAduansCount'])->name('api.new-aduans');
    Route::get('/alarm-settings', function () {
        return \Inertia\Inertia::render('Alarm/Index');
    })->name('alarm.settings');

    // Notifications API routes
    Route::get('/api/notifications', [NotificationController::class, 'index'])->name('api.notifications.index');
    Route::post('/api/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('api.notifications.read');
    Route::post('/api/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('api.notifications.read-all');
    Route::delete('/api/notifications/clear-all', [NotificationController::class, 'destroyAll'])->name('api.notifications.destroy-all');
    Route::delete('/api/notifications/{notification}', [NotificationController::class, 'destroy'])->name('api.notifications.destroy');
});

require __DIR__.'/auth.php';
