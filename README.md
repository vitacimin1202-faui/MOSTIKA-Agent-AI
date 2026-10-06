# Cosmetic MoS Safety Assessor - AI Agent & Interactive Web App
### Tugas Aplikasi AI dalam Farmasi Industri • Magister Ilmu Kefarmasian (Regulasi Farmasi) 2026
**Nama:** Vita Fitria Ramadhani  
**NPM:** 2506714311  
**Standar Regulasi:** SCCS 12th Revision (SCCS/1647/22), CIR, ECHA REACH Guidance R.8, EFSA, ASEAN Cosmetic Directive, BPOM RI.

---

## 🌐 Akses Publik & Deploy Online

Aplikasi ini dapat diakses secara publik dan dideploy secara online menggunakan beberapa opsi hosting statis gratis berkinerja tinggi:

### Opsi 1: GitHub Pages (Otomatis via GitHub Actions)
1. Buat repositori baru di GitHub (misal: `cosmetic-mos-safety-assessor`).
2. Hubungkan repositori lokal dan push ke GitHub:
   ```bash
   git remote add origin https://github.com/<username-anda>/<nama-repo>.git
   git branch -M main
   git push -u origin main
   ```
3. Buka tab **Settings** > **Pages** di repositori GitHub Anda.
4. Pada **Source**, pilih **GitHub Actions** (alur kerja `.github/workflows/deploy.yml` sudah siap).
5. Aplikasi akan langsung aktif secara publik di URL:  
   `https://<username-anda>.github.io/<nama-repo>/`

### Opsi 2: Vercel (Instant 1-Click Deploy)
1. Buka [Vercel](https://vercel.com/) dan impor repositori GitHub Anda.
2. File konfigurasi `vercel.json` telah disiapkan secara otomatis.
3. Klik **Deploy** dan aplikasi langsung aktif dengan HTTPS global CDN.

### Opsi 3: Netlify (Drag & Drop atau Git)
1. Buka [Netlify Drop](https://app.netlify.com/drop).
2. Seret folder repositori ini ke halaman Netlify, atau hubungkan via Git.
3. File konfigurasi `netlify.toml` telah tersedia.

---

## 🔬 Hasil Uji Validasi Ilmiah & Komputasi (Validation Test Suite)

Sistem telah diuji secara komprehensif melalui suite uji validasi otomatis (`test_validation.ps1` dan `test_validation.py`) terhadap 22 skenario pengujian analitis dan kasus baku (*gold standard benchmark*) SCCS Opinions:

- **Tingkat Kelulusan Validasi:** **100% (22 dari 22 Uji Lulus)**
- **Rata-rata Galat Relatif (*Relative Error*):** **0.0000%**
- **Dokumen Laporan Validasi Lengkap:** Silakan buka [LAPORAN_UJI_VALIDASI_SKILL_MOS.md](file:///c:/Users/user/Downloads/KULIAH%20MAGISTER%20ILMU%20KEFARMASIAN%20-%20REGULASI%20FARMASI%202026%20SEMESTER%201/APLIKASI%20AI%20DALAM%20FARMASI%20INDUSTRI/SKILL%20MOS%20COSMETIC%20ANALYSIS/LAPORAN_UJI_VALIDASI_SKILL_MOS.md)

### Cara Menjalankan Uji Validasi Secara Lokal:
Jalankan perintah berikut pada terminal PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\test_validation.ps1
```

---

## 📋 Fitur Utama Aplikasi

1. **Kalkulator MoS & Evaluator Formula Interaktif**:
   - Menghitung Dosis Paparan Sistemik ($SED$) dan Margin of Safety ($MoS$) per bahan secara otomatis.
   - Dilengkapi Preset Formula Populer (Krim Pencerah, Tabir Surya SPF 50, Serum Retinol, Gel Jerawat Salisilat, Sabun Bayi).
   - Penyesuaian otomatis untuk target populasi (Dewasa 60 kg, Bayi 5 kg, Balita 10 kg, Anak 15 kg).
2. **Visualisasi Grafik Risiko & Hazard Index (HI)**:
   - Diagram batang perbandingan MoS antar bahan terhadap garis ambang batas baku $MoS \ge 100$.
   - Speedometer / Gauge Hazard Index paparan toksikologi kumulatif sediaan.
3. **Generator Dokumen Informasi Produk (DIP / CPSR Bagian B)**:
   - Menghasilkan format resmi *Cosmetic Product Safety Report (CPSR Part B)* siap cetak atau simpan ke PDF.
4. **Katalog Toksikologi & Regulasi Bahan (60+ Bahan Baku)**:
   - Pencarian real-time bahan baku kosmetik, nomor CAS, nilai $NOAEL$, penetrasi dermal, bioavailabilitas oral, batas regulasi BPOM/EU, dan catatan khusus.
5. **Panduan Ilmiah & Formula SCCS 12th Revision**:
   - Rangkuman rumus matematis, faktor retensi, dan kriteria keberterimaan MoS.

---

## 📂 Struktur Berkas Proyek

```text
├── index.html                    # Halaman antarmuka web interaktif utama
├── style.css                     # Desain tema modern, dark mode, responsive layout & print styling
├── tools.js                      # Database toksikologi 60+ bahan & modul kalkulasi MoS/SED (JS)
├── app.js                        # Kontroller antarmuka, visualizer, filter pencarian & generator DIP
├── script.py                     # Mesin kalkulasi MoS & SED berbasis Python CLI
├── SKILL.MD                      # Definisi instruksi dan spesifikasi teknis AI Agent Skill
├── test_validation.ps1           # Suite uji validasi resmi (PowerShell runner)
├── test_validation.py            # Suite uji validasi berbasis Python
├── LAPORAN_UJI_VALIDASI_SKILL_MOS.md # Laporan hasil uji validasi komprehensif & terperinci
├── package.json                  # Metadata proyek & script pengujian
├── vercel.json                   # Konfigurasi deployment Vercel
├── netlify.toml                  # Konfigurasi deployment Netlify
├── .github/workflows/deploy.yml  # Alur kerja otomatisasi GitHub Pages
└── README.md                     # Petunjuk operasional & dokumentasi proyek
```

---

## 🚀 Panduan Penggunaan Aplikasi

1. Buka file `index.html` pada peramban web modern (Chrome, Edge, Firefox, Safari) atau akses URL publik yang telah dideploy.
2. Pada tab **Kalkulator MoS**, pilih **Kategori Produk** dan **Target Populasi**.
3. Pilih salah satu **Preset Formula** atau masukkan bahan secara manual dengan tombol **Tambah Baris Bahan** / chip **Tambah Cepat Bahan**.
4. Klik **Hitung MoS Formula (Run AI Evaluator)**.
5. Buka tab **Grafik Risiko & HI** untuk melihat distribusi profil keamanan visual.
6. Buka tab **Dokumen DIP / CPSR** dan klik **Cetak / Simpan PDF Dokumen DIP** untuk mencetak laporan resmi.
