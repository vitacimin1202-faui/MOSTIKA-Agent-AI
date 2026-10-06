"""
========================================================================================
SUITE UJI VALIDASI MARGIN OF SAFETY (MoS) & SED CALCULATION ENGINE
Validasi Komprehensif Berdasarkan Standar Regulasi:
1. SCCS 12th Revision (SCCS/1647/22)
2. CIR (Cosmetic Ingredient Review)
3. ECHA REACH Guidance R.8
4. EFSA & ASEAN Cosmetic Directive / BPOM RI
========================================================================================
"""

import math
import sys
from typing import Dict, List, Any, Tuple
from script import (
    SCCS_PRODUCT_DEFAULTS,
    INGREDIENT_DATABASE,
    calculate_ingredient_mos,
    evaluate_formula,
    lookup_ingredient
)

class MoSValidationSuite:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results: List[Dict[str, Any]] = []

    def assert_almost_equal(self, actual: float, expected: float, tolerance: float = 1e-4, test_name: str = "") -> bool:
        self.tests_run += 1
        diff = abs(actual - expected)
        rel_diff = (diff / expected * 100.0) if expected != 0 else diff
        passed = diff <= tolerance or rel_diff <= 0.05  # Within 0.05% relative error
        if passed:
            self.tests_passed += 1
        
        result = {
            "test_name": test_name,
            "expected": expected,
            "actual": actual,
            "absolute_diff": diff,
            "relative_error_pct": rel_diff,
            "passed": passed
        }
        self.test_results.append(result)
        return passed

    def assert_true(self, condition: bool, test_name: str = "") -> bool:
        self.tests_run += 1
        if condition:
            self.tests_passed += 1
        self.test_results.append({
            "test_name": test_name,
            "expected": True,
            "actual": condition,
            "absolute_diff": 0.0,
            "relative_error_pct": 0.0,
            "passed": condition
        })
        return condition

    def run_all_validation_tests(self) -> Dict[str, Any]:
        print("\n" + "=" * 90)
        print(" MEMULAI PENGUJIAN VALIDASI KOMPREHENSIF SKILL MOS COSMETIC SAFETY ASSESSOR")
        print("=" * 90 + "\n")

        # ----------------------------------------------------------------------------------
        # KATEGORI 1: VALIDASI ALGORITMA MATEMATIS DASAR (SED & MOS)
        # ----------------------------------------------------------------------------------
        print("[1/5] Menguji Algoritma Matematis Dasar (SCCS Method A Deterministic Formula)...")
        
        # Test 1.1: Standard SED Calculation
        # SED = (A * 1000 * (C / 100) * (DA_p / 100) * R) / BW
        # A = 1.54 g/day, C = 1.0 %, DA_p = 50 %, R = 1.0, BW = 60 kg
        # SED = (1.54 * 1000 * 0.01 * 0.50 * 1.0) / 60 = 7.7 / 60 = 0.1283333 mg/kg/day
        res_1_1 = calculate_ingredient_mos(
            ingredient_name="Niacinamide",
            concentration_percent=1.0,
            product_category="face_cream",
            body_weight_kg=60.0,
            custom_pod_mg_kg_day=215.0,
            custom_da_percent=50.0,
            custom_abs_oral_percent=100.0
        )
        self.assert_almost_equal(res_1_1["sed_mg_kg_day"], 0.128333, tolerance=1e-4, test_name="1.1 SED Dasar Krim Wajah (1.0%, DA=50%, BW=60kg)")
        # MoS = 215.0 / 0.1283333 = 1675.3
        self.assert_almost_equal(res_1_1["mos"], 1675.3, tolerance=0.5, test_name="1.1 MoS Dasar Niacinamide")
        self.assert_true(res_1_1["is_safe"], "1.1 Status Keamanan Niacinamide (Harus AMAN)")

        # Test 1.2: Rinse-off Retention Factor (R = 0.01)
        # Sampo: A = 10.46 g/day, C = 2.0 %, DA_p = 50 %, R = 0.01, BW = 60 kg
        # SED = (10.46 * 1000 * 0.02 * 0.50 * 0.01) / 60 = 1.046 / 60 = 0.0174333 mg/kg/day
        res_1_2 = calculate_ingredient_mos(
            ingredient_name="Salicylic Acid",
            concentration_percent=2.0,
            product_category="shampoo",
            body_weight_kg=60.0,
            custom_pod_mg_kg_day=250.0,
            custom_da_percent=50.0,
            custom_abs_oral_percent=100.0
        )
        self.assert_almost_equal(res_1_2["sed_mg_kg_day"], 0.017433, tolerance=1e-4, test_name="1.2 SED Sediaan Bilas Sampo (R=0.01)")
        # MoS = 250 / 0.0174333 = 14340.3
        self.assert_almost_equal(res_1_2["mos"], 14340.3, tolerance=2.0, test_name="1.2 MoS Salicylic Acid dalam Sampo")

        # ----------------------------------------------------------------------------------
        # KATEGORI 2: VALIDASI BENCHMARK OPINI RESMI SCCS (OFFICIAL REGULATORY DOSSIERS)
        # ----------------------------------------------------------------------------------
        print("\n[2/5] Menguji Validasi Terhadap Opini Resmi SCCS (Benchmark Dossiers)...")

        # Benchmark 2.1: Phenoxyethanol (SCCS/1575/16)
        # SCCS Scenario: Face Cream 1.04%, A = 1.54 g, DA = 80%, NOAEL = 357 mg/kg/d, BW = 60 kg
        # SED = (1.54 * 1000 * 0.0104 * 0.80 * 1.0) / 60 = 12.8128 / 60 = 0.213547 mg/kg/d
        # MoS = 357 / 0.213547 = 1671.8
        res_2_1 = calculate_ingredient_mos(
            ingredient_name="Phenoxyethanol",
            concentration_percent=1.04,
            product_category="face_cream",
            body_weight_kg=60.0,
            custom_pod_mg_kg_day=357.0,
            custom_da_percent=80.0,
            custom_abs_oral_percent=100.0
        )
        self.assert_almost_equal(res_2_1["sed_mg_kg_day"], 0.213547, tolerance=1e-4, test_name="2.1 Benchmark SCCS/1575/16 Phenoxyethanol SED")
        self.assert_almost_equal(res_2_1["mos"], 1671.8, tolerance=1.0, test_name="2.1 Benchmark SCCS/1575/16 Phenoxyethanol MoS")

        # Benchmark 2.2: Kojic Acid (SCCS/1637/21)
        # Face Cream 1.0%, A = 1.54 g, DA = 20%, NOAEL = 7.0 mg/kg/d, BW = 60 kg
        # SED = (1.54 * 1000 * 0.01 * 0.20 * 1.0) / 60 = 3.08 / 60 = 0.051333 mg/kg/d
        # MoS = 7.0 / 0.051333 = 136.36
        res_2_2 = calculate_ingredient_mos(
            ingredient_name="Kojic Acid",
            concentration_percent=1.0,
            product_category="face_cream",
            body_weight_kg=60.0
        )
        self.assert_almost_equal(res_2_2["sed_mg_kg_day"], 0.051333, tolerance=1e-4, test_name="2.2 Benchmark SCCS/1637/21 Kojic Acid SED")
        self.assert_almost_equal(res_2_2["mos"], 136.4, tolerance=0.5, test_name="2.2 Benchmark SCCS/1637/21 Kojic Acid MoS")
        self.assert_true(res_2_2["is_safe"], "2.2 Status Keamanan Kojic Acid 1.0% (MoS >= 100)")

        # Benchmark 2.3: Alpha-Arbutin (SCCS/1642/22)
        # Face Cream 2.0%, A = 1.54 g, DA = 50%, NOAEL = 150.0 mg/kg/d, BW = 60 kg
        # SED = (1.54 * 1000 * 0.02 * 0.50 * 1.0) / 60 = 15.4 / 60 = 0.256667 mg/kg/d
        # MoS = 150.0 / 0.256667 = 584.4
        res_2_3 = calculate_ingredient_mos(
            ingredient_name="Alpha-Arbutin",
            concentration_percent=2.0,
            product_category="face_cream",
            body_weight_kg=60.0
        )
        self.assert_almost_equal(res_2_3["sed_mg_kg_day"], 0.256667, tolerance=1e-4, test_name="2.3 Benchmark SCCS/1642/22 Alpha-Arbutin SED")
        self.assert_almost_equal(res_2_3["mos"], 584.4, tolerance=0.5, test_name="2.3 Benchmark SCCS/1642/22 Alpha-Arbutin MoS")

        # Benchmark 2.4: Retinol Safe Limit vs Excessive Dose (SCCS/1643/22)
        # Safe SCCS Face limit: 0.3%, DA = 5.7%, NOAEL = 1.0 mg/kg/d
        # SED = (1.54 * 1000 * 0.003 * 0.057 * 1.0) / 60 = 0.26334 / 60 = 0.004389 mg/kg/d
        # MoS = 1.0 / 0.004389 = 227.8
        res_2_4a = calculate_ingredient_mos(
            ingredient_name="Retinol",
            concentration_percent=0.3,
            product_category="face_cream",
            body_weight_kg=60.0
        )
        self.assert_almost_equal(res_2_4a["sed_mg_kg_day"], 0.004389, tolerance=1e-4, test_name="2.4a Retinol 0.3% Wajah SED")
        self.assert_almost_equal(res_2_4a["mos"], 227.8, tolerance=0.5, test_name="2.4a Retinol 0.3% MoS (Aman)")
        self.assert_true(res_2_4a["is_safe"], "2.4a Retinol 0.3% Status Aman")

        # High Dose Retinol Violation: Body Lotion 0.5% (Exceeds SCCS limit 0.05%)
        # Body lotion: A = 7.82 g, C = 0.5%, DA = 5.7%, NOAEL = 1.0 mg/kg/d
        # SED = (7.82 * 1000 * 0.005 * 0.057 * 1.0) / 60 = 2.2287 / 60 = 0.037145 mg/kg/d
        # MoS = 1.0 / 0.037145 = 26.9 (< 100 -> TIDAK AMAN)
        res_2_4b = calculate_ingredient_mos(
            ingredient_name="Retinol",
            concentration_percent=0.5,
            product_category="body_lotion",
            body_weight_kg=60.0
        )
        self.assert_almost_equal(res_2_4b["sed_mg_kg_day"], 0.037145, tolerance=1e-4, test_name="2.4b Retinol 0.5% Losion SED")
        self.assert_almost_equal(res_2_4b["mos"], 26.9, tolerance=0.5, test_name="2.4b Retinol 0.5% Losion MoS (Kritis)")
        self.assert_true(not res_2_4b["is_safe"], "2.4b Retinol 0.5% Losion Status Harus TIDAK AMAN (MoS < 100)")

        # ----------------------------------------------------------------------------------
        # KATEGORI 3: VALIDASI KOREKSI BIOAVAILABILITAS ORAL (PoD_sys Adjustment)
        # ----------------------------------------------------------------------------------
        print("\n[3/5] Menguji Koreksi Bioavailabilitas Oral (Abs_oral Adjustment SCCS)...")

        # Test 3.1: Oral Absorption >= 50% -> No Correction (PoD_sys = NOAEL_oral)
        # NOAEL = 500, Abs_oral = 100% -> PoD_sys = 500
        res_3_1 = calculate_ingredient_mos(
            ingredient_name="Sodium Benzoate",
            concentration_percent=0.5,
            product_category="face_cream",
            custom_pod_mg_kg_day=500.0,
            custom_abs_oral_percent=100.0
        )
        self.assert_almost_equal(res_3_1["pod_sys_mg_kg_day"], 500.0, tolerance=1e-4, test_name="3.1 PoD_sys Tanpa Koreksi (Abs_oral=100%)")

        # Test 3.2: Oral Absorption < 50% -> Corrected: PoD_sys = NOAEL_oral * (Abs_oral / 100)
        # NOAEL = 1000.0, Abs_oral = 10.0% -> PoD_sys = 1000.0 * 0.10 = 100.0
        res_3_2 = calculate_ingredient_mos(
            ingredient_name="Titanium Dioxide",
            concentration_percent=5.0,
            product_category="sunscreen_lotion",
            custom_pod_mg_kg_day=1000.0,
            custom_abs_oral_percent=10.0,
            custom_da_percent=1.0
        )
        self.assert_almost_equal(res_3_2["pod_sys_mg_kg_day"], 100.0, tolerance=1e-4, test_name="3.2 PoD_sys Terkoreksi (Abs_oral=10%)")
        # Sunscreen: A = 18.0, C = 5.0, DA = 1.0, BW = 60
        # SED = (18.0 * 1000 * 0.05 * 0.01 * 1.0) / 60 = 9.0 / 60 = 0.15 mg/kg/d
        # MoS = 100.0 / 0.15 = 666.7
        self.assert_almost_equal(res_3_2["sed_mg_kg_day"], 0.150000, tolerance=1e-4, test_name="3.2 Titanium Dioxide SED")
        self.assert_almost_equal(res_3_2["mos"], 666.7, tolerance=0.5, test_name="3.2 Titanium Dioxide MoS")

        # ----------------------------------------------------------------------------------
        # KATEGORI 4: VALIDASI TARGET POPULASI & BOBOT BADAN (BAYI / ANAK / DEWASA)
        # ----------------------------------------------------------------------------------
        print("\n[4/5] Menguji Validasi Populasi Rentan (Infant 5kg vs Dewasa 60kg)...")

        # Test 4.1: Bayi 5.0 kg pada Sabun Mandi Cair (Shower Gel, A = 18.67 g, R = 0.01)
        # Phenoxyethanol 0.3%, DA = 80%, NOAEL = 357 mg/kg/d, BW = 5.0 kg
        # SED = (18.67 * 1000 * 0.003 * 0.80 * 0.01) / 5.0 = 0.44808 / 5.0 = 0.089616 mg/kg/d
        # MoS = 357 / 0.089616 = 3983.7
        res_4_1 = calculate_ingredient_mos(
            ingredient_name="Phenoxyethanol",
            concentration_percent=0.3,
            product_category="shower_gel",
            body_weight_kg=5.0
        )
        self.assert_almost_equal(res_4_1["sed_mg_kg_day"], 0.089616, tolerance=1e-4, test_name="4.1 Sabun Mandi Bayi (BW=5.0kg) SED")
        self.assert_almost_equal(res_4_1["mos"], 3983.7, tolerance=1.0, test_name="4.1 Sabun Mandi Bayi MoS")

        # Test 4.2: Toothpaste (5% Ingested, A = 2.75 g/day, R = 0.05, BW = 60 kg)
        # Sodium Benzoate 0.5%, DA = 100% (Ingested), NOAEL = 500 mg/kg/d
        # SED = (2.75 * 1000 * 0.005 * 1.00 * 0.05) / 60 = 0.6875 / 60 = 0.011458 mg/kg/d
        # MoS = 500 / 0.011458 = 43636.4
        res_4_2 = calculate_ingredient_mos(
            ingredient_name="Sodium Benzoate",
            concentration_percent=0.5,
            product_category="toothpaste_adult",
            body_weight_kg=60.0,
            custom_da_percent=100.0
        )
        self.assert_almost_equal(res_4_2["sed_mg_kg_day"], 0.011458, tolerance=1e-4, test_name="4.2 Pasta Gigi Dewasa SED")
        self.assert_almost_equal(res_4_2["mos"], 43636.4, tolerance=2.0, test_name="4.2 Pasta Gigi Dewasa MoS")

        # ----------------------------------------------------------------------------------
        # KATEGORI 5: VALIDASI EVALUASI FORMULA LENGKAP & HAZARD INDEX (CUMULATIVE RISK)
        # ----------------------------------------------------------------------------------
        print("\n[5/5] Menguji Evaluasi Formula Komposit & Beban Kumulatif (Hazard Index)...")

        multi_formula = [
            {"name": "Niacinamide", "concentration": 4.0},
            {"name": "Phenoxyethanol", "concentration": 0.8},
            {"name": "Alpha-Arbutin", "concentration": 2.0},
            {"name": "Salicylic Acid", "concentration": 1.5},
            {"name": "Tocopherol", "concentration": 0.5},
            {"name": "Glycerin", "concentration": 5.0}
        ]

        full_eval = evaluate_formula(multi_formula, product_category="face_cream", body_weight_kg=60.0)
        self.assert_true(full_eval["overall_formula_safe"], "5.1 Evaluasi Keseluruhan Formula Aman")
        
        # Hazard Index manual calculation check:
        # HI = sum(100 / MoS_i)
        # Let's compute exact HI:
        manual_hi = 0.0
        for ing in full_eval["ingredients_evaluated"]:
            manual_hi += (100.0 / ing["mos"])
        
        self.assert_almost_equal(full_eval["hazard_index_hi"], manual_hi, tolerance=1e-3, test_name="5.2 Konsistensi Hazard Index Formula")
        self.assert_true(full_eval["hazard_index_hi"] <= 1.0, "5.3 Hazard Index Harus <= 1.0 (Memenuhi Syarat)")

        # Summary
        success_rate = (self.tests_passed / self.tests_run) * 100.0
        print("\n" + "=" * 90)
        print(f" HASIL AKHIR PENGUJIAN VALIDASI: {self.tests_passed}/{self.tests_run} UJI LULUS ({success_rate:.2f}%)")
        print("=" * 90 + "\n")

        return {
            "total_tests": self.tests_run,
            "passed_tests": self.tests_passed,
            "failed_tests": self.tests_run - self.tests_passed,
            "success_rate_pct": success_rate,
            "details": self.test_results
        }

if __name__ == "__main__":
    suite = MoSValidationSuite()
    report = suite.run_all_validation_tests()
    if report["failed_tests"] > 0:
        print(f"PERINGATAN: Ada {report['failed_tests']} uji yang gagal!")
        sys.exit(1)
    else:
        print("SEMUA PENGUJIAN VALIDASI BERHASIL DENGAN TINGKAT AKURASI 100%!")
