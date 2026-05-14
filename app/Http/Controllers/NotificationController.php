<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = Notification::query();

        if ($user->role === 'admin') {
            // Admin sees notifications with role = 'admin' or without target user/role (global)
            $query->where(function($q) use ($user) {
                $q->where('role', 'admin')
                  ->orWhere('user_id', $user->id)
                  ->orWhere(function($sub) {
                      $sub->whereNull('role')->whereNull('user_id');
                  });
            });
        } elseif ($user->role === 'teknisi') {
            // Technician sees notifications specifically for them or targeted to 'teknisi' role
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('role', 'teknisi');
            });
        } else {
            // Pelapor sees notifications specifically for them or targeted to 'pelapor' role
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('role', 'pelapor');
            });
        }

        $notifications = $query->latest()->take(30)->get();
        $unreadCount = (clone $query)->whereNull('read_at')->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAsRead(Notification $notification)
    {
        $notification->update(['read_at' => now()]);
        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        $user = auth()->user();
        $query = Notification::whereNull('read_at');

        if ($user->role === 'admin') {
            $query->where(function($q) use ($user) {
                $q->where('role', 'admin')
                  ->orWhere('user_id', $user->id)
                  ->orWhere(function($sub) {
                      $sub->whereNull('role')->whereNull('user_id');
                  });
            });
        } elseif ($user->role === 'teknisi') {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('role', 'teknisi');
            });
        } else {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('role', 'pelapor');
            });
        }

        $query->update(['read_at' => now()]);
        return response()->json(['success' => true]);
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();
        return response()->json(['success' => true]);
    }

    public function destroyAll()
    {
        $user = auth()->user();
        $query = Notification::query();

        if ($user->role === 'admin') {
            $query->where(function($q) use ($user) {
                $q->where('role', 'admin')
                  ->orWhere('user_id', $user->id)
                  ->orWhere(function($sub) {
                      $sub->whereNull('role')->whereNull('user_id');
                  });
            });
        } elseif ($user->role === 'teknisi') {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('role', 'teknisi');
            });
        } else {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('role', 'pelapor');
            });
        }

        $query->delete();
        return response()->json(['success' => true]);
    }
}
