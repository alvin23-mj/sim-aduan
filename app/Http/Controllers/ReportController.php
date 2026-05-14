<?php

namespace App\Http\Controllers;

use App\Models\Aduan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Aduan::whereIn('status', ['selesai', 'barang_rusak', 'diperbaiki_sendiri']);

        $user = auth()->user();
        if ($user && $user->role === 'teknisi') {
            $myTechnician = \App\Models\Technician::where('user_id', $user->id)->first();
            if ($myTechnician) {
                $query->where('technician', 'like', "%{$myTechnician->name}%");
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('unit', 'like', "%{$search}%")
                  ->orWhere('item_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $aduan = $query->latest()->paginate(10)->withQueryString();
        $categories = \App\Models\Category::where('is_active', true)->get();
        $technicians = \App\Models\Technician::where('is_active', true)->get(['id', 'name', 'signature']);

        return Inertia::render('Reports/Index', [
            'aduan' => $aduan,
            'filters' => $request->only(['start_date', 'end_date', 'status', 'search', 'category', 'priority']),
            'categories' => $categories,
            'technicians' => $technicians,
        ]);
    }

    public function export(Request $request)
    {
        $query = Aduan::whereIn('status', ['selesai', 'barang_rusak', 'diperbaiki_sendiri']);

        $user = auth()->user();
        if ($user && $user->role === 'teknisi') {
            $myTechnician = \App\Models\Technician::where('user_id', $user->id)->first();
            if ($myTechnician) {
                $query->where('technician', 'like', "%{$myTechnician->name}%");
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('unit', 'like', "%{$search}%")
                  ->orWhere('item_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $aduans = $query->latest()->get();

        $filename = "Laporan_Aduan_" . date('Ymd_His') . ".xls";

        return response()->streamDownload(function() use ($aduans) {
            echo "<html>";
            echo "<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head>";
            echo "<body>";
            echo "<table border='1' cellpadding='5' cellspacing='0' style=\"border-collapse: collapse; font-family: 'Lucida Sans Typewriter', monospace; font-size: 10pt;\">";
            echo "<thead>";
            echo "<tr style='color: #FFFFFF; font-weight: bold; text-align: center;'>";
            
            $columns = ['No', 'Tanggal', 'Kode Aduan', 'Pelapor', 'Unit', 'Prioritas', 'Kategori', 'Deskripsi', 'Penyelesaian', 'Validator', 'Teknisi', 'Durasi', 'Status'];
            foreach($columns as $col) {
                echo "<th style='padding: 8px; border: 1px solid #BFBFBF; background-color: #4472C4; color: #FFFFFF; font-weight: bold; text-align: center;'>{$col}</th>";
            }
            echo "</tr>";
            echo "</thead>";
            echo "<tbody>";

            foreach ($aduans as $index => $item) {
                $duration = '-';
                if ($item->created_at && $item->updated_at) {
                    $diffMins = (int) $item->created_at->diffInMinutes($item->updated_at);
                    if ($diffMins < 60) {
                        $duration = $diffMins . ' Menit';
                    } else {
                        $diffHours = (int) floor($diffMins / 60);
                        if ($diffHours < 24) {
                            $duration = $diffHours . ' Jam';
                        } else {
                            $duration = ((int) floor($diffHours / 24)) . ' Hari';
                        }
                    }
                }

                $statusLabel = $item->status === 'barang_rusak' ? 'Barang Rusak' : ($item->status === 'diperbaiki_sendiri' ? 'Diperbaiki Sendiri' : 'Selesai');
                
                echo "<tr>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: center; color: #000000;'>" . ($index + 1) . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: center; mso-number-format:\"\\@\";'>" . ($item->created_at ? $item->created_at->format('d M Y') : '-') . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: center;'>" . htmlspecialchars($item->ticket_number) . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: left;'>" . htmlspecialchars($item->name) . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: left;'>" . htmlspecialchars($item->unit ?? '-') . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: center;'>" . ucfirst(htmlspecialchars($item->priority ?? 'Ringan')) . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: center;'>" . htmlspecialchars($item->category ?? '-') . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: left;'>" . htmlspecialchars($item->description) . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: left; color: #000000;'>" . htmlspecialchars($item->damage_report ?? '-') . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: left;'>" . htmlspecialchars($item->validator ?? '-') . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: left;'>" . htmlspecialchars($item->technician ?? '-') . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: center;'>" . $duration . "</td>";
                echo "<td style='padding: 8px; border: 1px solid #BFBFBF; text-align: center;'>" . $statusLabel . "</td>";
                echo "</tr>";
            }

            echo "</tbody>";
            echo "</table>";
            echo "</body></html>";
        }, $filename);
    }
}
