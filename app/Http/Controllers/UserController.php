<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::where('role', 'pelapor')->orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'pelapor',
        ]);

        return redirect()->back()->with('success', 'Akun Pelapor baru berhasil ditambahkan');
    }

    public function update(Request $request, User $user)
    {
        if ($user->role !== 'pelapor') {
            abort(403, 'Aksi tidak diizinkan. Manajemen ini hanya dikhususkan untuk Pelapor.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        return redirect()->back()->with('success', 'Data akun Pelapor berhasil diperbarui');
    }

    public function destroy(User $user)
    {
        if ($user->role !== 'pelapor') {
            abort(403, 'Aksi tidak diizinkan. Manajemen ini hanya dikhususkan untuk Pelapor.');
        }

        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Akun Pelapor berhasil dihapus');
    }
}
