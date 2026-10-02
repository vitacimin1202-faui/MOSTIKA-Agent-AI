# Tugas AI Agent & Skill - [Vita Fitria Ramadhani 2506714311]

## Deskripsi Agent & Skill MOS Cosmetic Safety Assessment
Agent AI yang dilengkapi database toksikologi sehingga dapat digunakan untuk menghitung nilai Margin of Safety (MoS) dari masing-masing bahan kosmetik dalam rangka penjaminan safety assessment sesuai dengan regulasi internasional berdasarkan CIR, SCSS, ECHA, EFSA, NICNAS. 

## Struktur Project
- `skills/nama-skill/SKILL.md`: Definisi instruksi dan alur kerja skill.
- `skills/nama-skill/scripts/`: Kode eksekusi pendukung.

## Cara Menggunakan
1. Buka dan klik2x pada File "index.html" pada browser
2. Klik "Kalkulator MoS"
3. Pilih "Kategori produk" serta "Target Populasi & Berat Badan"
4. Masukkan "Nama Bahan Baku (INCI / ID)","Konsentrasi (%)","NOAEL (mg/kg/hari)" data NOAEL dapat merujuk pada tab Katalog Toksikologi
5. Klik "Hitung MoS Formula (Run AI Evaluator)"
6. Klik Tab "Dokumen DIP/CPSR"
7. Klik "Cetak/Simpan PDF Dokumen DIP"
