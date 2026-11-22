# Fahri Faqih — Portfolio

Website portfolio statis dengan HTML, CSS, JavaScript, dan Supabase.

## File utama
- `index.html` — halaman portfolio publik
- `style.css` — tampilan responsif dan styling dashboard admin
- `script.js` — pemuatan project, filter kategori, dan lightbox
- `admin.html` / `admin.js` — dashboard login, upload, dan hapus project
- `supabase.js` — konfigurasi Supabase

## Menjalankan
Upload semua file ke hosting statis (misalnya GitHub Pages, Netlify, atau Vercel). Pastikan konfigurasi Supabase tetap benar, tabel `projects` tersedia, dan bucket Storage `portofolio` sudah dibuat dengan kebijakan akses yang sesuai.

Catatan: Supabase anon key memang digunakan di sisi browser. Jangan pernah menaruh `service_role` key di website. Pastikan Row Level Security (RLS) dan Storage policies membatasi operasi upload/hapus hanya untuk admin yang terautentikasi.
