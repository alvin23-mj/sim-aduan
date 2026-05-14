<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Technician;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TechnicianController extends Controller
{
    public function index()
    {
        return Inertia::render('Technicians/Index', [
            'technicians' => Technician::with('user')->orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'specialty' => 'nullable|string|max:255',
            'signature' => 'nullable|string',
            'email' => 'nullable|string|email|max:255|unique:users,email',
            'password' => 'nullable|string|min:8|required_with:email',
        ]);

        $userId = null;
        if (!empty($validated['email'])) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'teknisi',
            ]);
            $userId = $user->id;
        }

        Technician::create([
            'user_id' => $userId,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'specialty' => $validated['specialty'],
            'signature' => $validated['signature'],
        ]);

        return redirect()->back()->with('success', 'Teknisi baru dan akun login berhasil ditambahkan');
    }

    public function update(Request $request, Technician $technician)
    {
        $userId = $technician->user_id;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'specialty' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'signature' => 'nullable|string',
            'email' => [
                'nullable',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password' => 'nullable|string|min:8',
        ]);

        if (!empty($validated['email'])) {
            if ($userId) {
                // Update existing user
                $user = User::find($userId);
                if ($user) {
                    $userData = [
                        'name' => $validated['name'],
                        'email' => $validated['email'],
                    ];
                    if (!empty($validated['password'])) {
                        $userData['password'] = Hash::make($validated['password']);
                    }
                    $user->update($userData);
                }
            } else {
                // Create new user login account
                $request->validate([
                    'password' => 'required|string|min:8',
                ]);
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'role' => 'teknisi',
                ]);
                $technician->user_id = $user->id;
            }
        } else {
            // If email is emptied, delete linked user account if it existed
            if ($userId) {
                $user = User::find($userId);
                if ($user) {
                    $user->delete();
                }
                $technician->user_id = null;
            }
        }

        $technician->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'specialty' => $validated['specialty'],
            'is_active' => $validated['is_active'],
            'signature' => $validated['signature'],
        ]);

        return redirect()->back()->with('success', 'Data teknisi dan akun berhasil diperbarui');
    }

    public function destroy(Technician $technician)
    {
        // cascade onDelete is set up on the foreign key, but let's make sure linked user is also explicitly deleted just in case
        if ($technician->user_id) {
            $user = User::find($technician->user_id);
            if ($user) {
                $user->delete();
            }
        }

        $technician->delete();

        return redirect()->back()->with('success', 'Teknisi dan akun terkait berhasil dihapus');
    }
}
