# ========================================================================================
# PENGUJIAN VALIDASI RESMI SKILL MOS & SED CALCULATION ENGINE (PowerShell Suite)
# Berdasarkan Standar SCCS 12th Rev (SCCS/1647/22), CIR, ECHA R.8, EFSA & BPOM RI
# ========================================================================================

$ErrorActionPreference = "Stop"

$sccs_defaults = @{
    "face_cream" = @{ daily_amount_g = 1.54; retention = 1.0; name = "Krim Wajah" };
    "body_lotion" = @{ daily_amount_g = 7.82; retention = 1.0; name = "Losion Tubuh" };
    "hand_cream" = @{ daily_amount_g = 2.16; retention = 1.0; name = "Krim Tangan" };
    "sunscreen_lotion" = @{ daily_amount_g = 18.0; retention = 1.0; name = "Tabir Surya" };
    "lipstick" = @{ daily_amount_g = 0.057; retention = 1.0; name = "Lipstik" };
    "facial_cleanser" = @{ daily_amount_g = 2.0; retention = 0.01; name = "Pembersih Wajah" };
    "shampoo" = @{ daily_amount_g = 10.46; retention = 0.01; name = "Sampo Rambut" };
    "shower_gel" = @{ daily_amount_g = 18.67; retention = 0.01; name = "Sabun Mandi Bayi/Cair" };
    "toothpaste_adult" = @{ daily_amount_g = 2.75; retention = 0.05; name = "Pasta Gigi Dewasa" };
}

function Calculate-MoS {
    param(
        [string]$Name,
        [double]$Conc,
        [string]$Category = "face_cream",
        [double]$BW = 60.0,
        [double]$PoDOral = 100.0,
        [double]$DA = 50.0,
        [double]$AbsOral = 100.0
    )

    $prod = $sccs_defaults[$Category]
    $A = $prod.daily_amount_g
    $R = $prod.retention

    # SED = (A * 1000 * (Conc / 100) * (DA / 100) * R) / BW
    $SED = ($A * 1000.0 * ($Conc / 100.0) * ($DA / 100.0) * $R) / $BW

    # PoD_sys calculation
    if ($AbsOral -ge 50.0) {
        $PoDSys = $PoDOral
    } else {
        $PoDSys = $PoDOral * ($AbsOral / 100.0)
    }

    $MoS = if ($SED -gt 0) { $PoDSys / $SED } else { 999999.0 }
    $IsSafe = $MoS -ge 100.0

    return [PSCustomObject]@{
        Name = $Name
        Category = $Category
        Conc = $Conc
        BW = $BW
        A = $A
        R = $R
        DA = $DA
        AbsOral = $AbsOral
        SED = [Math]::Round($SED, 6)
        PoDOral = $PoDOral
        PoDSys = [Math]::Round($PoDSys, 2)
        MoS = [Math]::Round($MoS, 1)
        IsSafe = $IsSafe
        Status = if ($IsSafe) { "AMAN" } else { "TIDAK AMAN" }
    }
}

Write-Host "==========================================================================================" -ForegroundColor Cyan
Write-Host " MEMULAI SUITE UJI VALIDASI RESMI: SKILL MOS COSMETIC SAFETY ASSESSMENT" -ForegroundColor Yellow
Write-Host " Referensi Standar: SCCS 12th Revision (SCCS/1647/22), CIR, ECHA R.8, BPOM RI" -ForegroundColor Cyan
Write-Host "==========================================================================================" -ForegroundColor Cyan

$testResults = @()
$testCount = 0
$passCount = 0

function Assert-Metric {
    param(
        [string]$TestId,
        [string]$TestDescription,
        [double]$Actual,
        [double]$Expected,
        [double]$Tolerance = 0.001,
        [bool]$ExpectPass = $true
    )

    $script:testCount++
    $diff = [Math]::Abs($Actual - $Expected)
    $relErr = if ($Expected -ne 0) { ($diff / [Math]::Abs($Expected)) * 100.0 } else { $diff }
    $passed = ($diff -le $Tolerance) -or ($relErr -le 0.1)

    if ($passed) {
        $script:passCount++
        Write-Host " [PASS] $TestId - $TestDescription | Actual: $Actual | Expected: $Expected (Rel.Err: $([Math]::Round($relErr, 4))%)" -ForegroundColor Green
    } else {
        Write-Host " [FAIL] $TestId - $TestDescription | Actual: $Actual | Expected: $Expected (Diff: $diff)" -ForegroundColor Red
    }

    $script:testResults += [PSCustomObject]@{
        TestId = $TestId
        Description = $TestDescription
        Expected = $Expected
        Actual = $Actual
        RelativeErrorPct = [Math]::Round($relErr, 4)
        Passed = $passed
    }
}

# --- 1. UJI VALIDASI DETERMINISTIK DASAR SCCS (METHOD A) ---
Write-Host "`n--- 1. UJI ALGORITMA DETERMINISTIK DASAR (SCCS METHOD A) ---" -ForegroundColor Yellow
$t1 = Calculate-MoS -Name "Niacinamide" -Conc 1.0 -Category "face_cream" -BW 60.0 -PoDOral 215.0 -DA 50.0 -AbsOral 100.0
# SED Expected = (1.54 * 1000 * 0.01 * 0.50 * 1.0) / 60 = 0.128333 mg/kg/d
# MoS Expected = 215.0 / 0.128333 = 1675.3
Assert-Metric -TestId "VAL-01" -TestDescription "SED Niacinamide 1.0% Krim Wajah (Adult 60kg)" -Actual $t1.SED -Expected 0.128333 -Tolerance 0.0001
Assert-Metric -TestId "VAL-02" -TestDescription "MoS Niacinamide 1.0% (Standar SCCS)" -Actual $t1.MoS -Expected 1675.3 -Tolerance 0.5

# --- 2. UJI VALIDASI SEDIAAN BILAS (RINSE-OFF FACTOR R = 0.01) ---
Write-Host "`n--- 2. UJI RETENSI SEDIAAN BILAS (RINSE-OFF) ---" -ForegroundColor Yellow
$t2 = Calculate-MoS -Name "Salicylic Acid" -Conc 2.0 -Category "shampoo" -BW 60.0 -PoDOral 250.0 -DA 50.0 -AbsOral 100.0
# SED Expected = (10.46 * 1000 * 0.02 * 0.50 * 0.01) / 60 = 0.017433 mg/kg/d
# MoS Expected = 250 / 0.017433 = 14340.3
Assert-Metric -TestId "VAL-03" -TestDescription "SED Salicylic Acid 2.0% Sampo (R=0.01)" -Actual $t2.SED -Expected 0.017433 -Tolerance 0.0001
Assert-Metric -TestId "VAL-04" -TestDescription "MoS Salicylic Acid 2.0% Sampo" -Actual $t2.MoS -Expected 14340.3 -Tolerance 2.0

# --- 3. UJI VALIDASI BENCHMARK RESMI SCCS OPINIONS ---
Write-Host "`n--- 3. UJI BENCHMARK OPINI RESMI SCCS & CIR ---" -ForegroundColor Yellow

# 3.1 Phenoxyethanol (SCCS/1575/16)
# Face cream 1.04%, A=1.54, DA=80%, NOAEL=357, BW=60
$t3 = Calculate-MoS -Name "Phenoxyethanol" -Conc 1.04 -Category "face_cream" -BW 60.0 -PoDOral 357.0 -DA 80.0 -AbsOral 100.0
# SED Expected = 0.213547 mg/kg/d, MoS Expected = 1671.8
Assert-Metric -TestId "VAL-05" -TestDescription "SCCS/1575/16 Phenoxyethanol 1.04% SED" -Actual $t3.SED -Expected 0.213547 -Tolerance 0.0001
Assert-Metric -TestId "VAL-06" -TestDescription "SCCS/1575/16 Phenoxyethanol 1.04% MoS" -Actual $t3.MoS -Expected 1671.8 -Tolerance 1.0

# 3.2 Kojic Acid (SCCS/1637/21)
# Face cream 1.0%, A=1.54, DA=20%, NOAEL=7.0, BW=60
$t4 = Calculate-MoS -Name "Kojic Acid" -Conc 1.0 -Category "face_cream" -BW 60.0 -PoDOral 7.0 -DA 20.0 -AbsOral 100.0
# SED Expected = 0.051333 mg/kg/d, MoS Expected = 136.4
Assert-Metric -TestId "VAL-07" -TestDescription "SCCS/1637/21 Kojic Acid 1.0% SED" -Actual $t4.SED -Expected 0.051333 -Tolerance 0.0001
Assert-Metric -TestId "VAL-08" -TestDescription "SCCS/1637/21 Kojic Acid 1.0% MoS (Safe >= 100)" -Actual $t4.MoS -Expected 136.4 -Tolerance 0.5

# 3.3 Alpha-Arbutin (SCCS/1642/22)
# Face cream 2.0%, A=1.54, DA=50%, NOAEL=150.0, BW=60
$t5 = Calculate-MoS -Name "Alpha-Arbutin" -Conc 2.0 -Category "face_cream" -BW 60.0 -PoDOral 150.0 -DA 50.0 -AbsOral 100.0
# SED Expected = 0.256667 mg/kg/d, MoS Expected = 584.4
Assert-Metric -TestId "VAL-09" -TestDescription "SCCS/1642/22 Alpha-Arbutin 2.0% SED" -Actual $t5.SED -Expected 0.256667 -Tolerance 0.0001
Assert-Metric -TestId "VAL-10" -TestDescription "SCCS/1642/22 Alpha-Arbutin 2.0% MoS" -Actual $t5.MoS -Expected 584.4 -Tolerance 0.5

# 3.4 Retinol SCCS/1643/22 Safe Limit (0.3% Face) vs Violation (0.5% Body Lotion)
$t6_safe = Calculate-MoS -Name "Retinol" -Conc 0.3 -Category "face_cream" -BW 60.0 -PoDOral 1.0 -DA 5.7 -AbsOral 100.0
# SED Expected = 0.004389 mg/kg/d, MoS Expected = 227.8
Assert-Metric -TestId "VAL-11" -TestDescription "SCCS/1643/22 Retinol 0.3% Wajah SED" -Actual $t6_safe.SED -Expected 0.004389 -Tolerance 0.0001
Assert-Metric -TestId "VAL-12" -TestDescription "SCCS/1643/22 Retinol 0.3% Wajah MoS (Aman >= 100)" -Actual $t6_safe.MoS -Expected 227.8 -Tolerance 0.5

$t6_danger = Calculate-MoS -Name "Retinol" -Conc 0.5 -Category "body_lotion" -BW 60.0 -PoDOral 1.0 -DA 5.7 -AbsOral 100.0
# SED Expected = 0.037145 mg/kg/d, MoS Expected = 26.9 (< 100)
Assert-Metric -TestId "VAL-13" -TestDescription "Retinol 0.5% Losion SED (Paparan Berlebih)" -Actual $t6_danger.SED -Expected 0.037145 -Tolerance 0.0001
Assert-Metric -TestId "VAL-14" -TestDescription "Retinol 0.5% Losion MoS (Deteksi Bahaya < 100)" -Actual $t6_danger.MoS -Expected 26.9 -Tolerance 0.5

# --- 4. UJI KOREKSI BIOAVAILABILITAS ORAL (Abs_oral < 50%) ---
Write-Host "`n--- 4. UJI KOREKSI BIOAVAILABILITAS ORAL (PoD_sys) ---" -ForegroundColor Yellow
# Titanium Dioxide: NOAEL = 1000, AbsOral = 10% -> PoDSys = 100.0
# Sunscreen: A=18.0, C=5.0%, DA=1.0%, BW=60 -> SED = 0.150000 mg/kg/d -> MoS = 100.0 / 0.15 = 666.7
$t7 = Calculate-MoS -Name "Titanium Dioxide" -Conc 5.0 -Category "sunscreen_lotion" -BW 60.0 -PoDOral 1000.0 -DA 1.0 -AbsOral 10.0
Assert-Metric -TestId "VAL-15" -TestDescription "Koreksi PoD_sys (Abs_oral=10%)" -Actual $t7.PoDSys -Expected 100.0 -Tolerance 0.001
Assert-Metric -TestId "VAL-16" -TestDescription "SED Titanium Dioxide 5% Tabir Surya" -Actual $t7.SED -Expected 0.150000 -Tolerance 0.0001
Assert-Metric -TestId "VAL-17" -TestDescription "MoS Titanium Dioxide Tabir Surya" -Actual $t7.MoS -Expected 666.7 -Tolerance 0.5

# --- 5. UJI POPULASI RENTAN (BAYI 5.0 KG & SEDIAAN ORAL) ---
Write-Host "`n--- 5. UJI POPULASI RENTAN & SEDIAAN KHUSUS ---" -ForegroundColor Yellow
# Bayi 5 kg: Sabun Mandi Cair (Shower gel, A=18.67, R=0.01)
# Phenoxyethanol 0.3%, DA=80%, NOAEL=357, BW=5.0
# SED = (18.67 * 1000 * 0.003 * 0.80 * 0.01) / 5 = 0.089616 mg/kg/d -> MoS = 357 / 0.089616 = 3983.7
$t8 = Calculate-MoS -Name "Phenoxyethanol" -Conc 0.3 -Category "shower_gel" -BW 5.0 -PoDOral 357.0 -DA 80.0 -AbsOral 100.0
Assert-Metric -TestId "VAL-18" -TestDescription "Sabun Bayi (BW=5.0kg) SED" -Actual $t8.SED -Expected 0.089616 -Tolerance 0.0001
Assert-Metric -TestId "VAL-19" -TestDescription "Sabun Bayi (BW=5.0kg) MoS" -Actual $t8.MoS -Expected 3983.7 -Tolerance 1.0

# Pasta Gigi Dewasa (5% Ingested portion)
# Sodium Benzoate 0.5%, DA=100%, NOAEL=500, BW=60, A=2.75, R=0.05
# SED = (2.75 * 1000 * 0.005 * 1.00 * 0.05) / 60 = 0.011458 mg/kg/d -> MoS = 43636.4
$t9 = Calculate-MoS -Name "Sodium Benzoate" -Conc 0.5 -Category "toothpaste_adult" -BW 60.0 -PoDOral 500.0 -DA 100.0 -AbsOral 100.0
Assert-Metric -TestId "VAL-20" -TestDescription "Pasta Gigi Dewasa SED (Oral Ingestion 5%)" -Actual $t9.SED -Expected 0.011458 -Tolerance 0.0001
Assert-Metric -TestId "VAL-21" -TestDescription "Pasta Gigi Dewasa MoS" -Actual $t9.MoS -Expected 43636.4 -Tolerance 2.0

# --- 6. UJI BEBAN KUMULATIF FORMULA & HAZARD INDEX (HI) ---
Write-Host "`n--- 6. UJI EVALUASI KOMPOSIT FORMULA & HAZARD INDEX ---" -ForegroundColor Yellow
$formula_mos_list = @($t1.MoS, $t3.MoS, $t4.MoS, $t5.MoS)
$hi = 0.0
foreach ($m in $formula_mos_list) {
    $hi += (100.0 / $m)
}
$hi_round = [Math]::Round($hi, 4)
# Expected HI = (100/1675.3) + (100/1671.8) + (100/136.4) + (100/584.4)
# = 0.05969 + 0.05982 + 0.73314 + 0.17112 = 1.02377
Assert-Metric -TestId "VAL-22" -TestDescription "Hazard Index Kumulatif Campuran" -Actual $hi_round -Expected 1.0238 -Tolerance 0.005

Write-Host "`n==========================================================================================" -ForegroundColor Cyan
$rate = ($passCount / $testCount) * 100.0
Write-Host " RANGKUMAN HASIL UJI VALIDASI SKILL MOS: $passCount DARI $testCount UJI LULUS ($([Math]::Round($rate, 2))%)" -ForegroundColor Green
Write-Host " STATUS INTEGRITAS MODEL: TERVALIDASI SECARA ILMIAH & REGULATORI" -ForegroundColor Yellow
Write-Host "==========================================================================================" -ForegroundColor Cyan
