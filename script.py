"""
========================================================================================
COSMETIC MARGIN OF SAFETY (MoS) & SED CALCULATION ENGINE (Python CLI / API)
Standards: SCCS 12th Rev (SCCS/1647/22), CIR, ECHA (REACH R.8), EFSA, NICNAS/AICIS, BPOM RI
========================================================================================
"""

from typing import Dict, List, Any, Optional

# SCCS STANDARDIZED EXPOSURE PARAMETERS (SCCS Notes of Guidance 12th Rev)
SCCS_PRODUCT_DEFAULTS = {
    "face_cream": {
        "name_id": "Krim Wajah (Face Cream)",
        "daily_amount_g": 1.54,
        "retention_factor": 1.0,
        "surface_area_cm2": 565,
        "frequency_day": 2.0,
        "application_type": "leave_on"
    },
    "body_lotion": {
        "name_id": "Losion Badan (Body Lotion)",
        "daily_amount_g": 7.82,
        "retention_factor": 1.0,
        "surface_area_cm2": 15670,
        "frequency_day": 1.0,
        "application_type": "leave_on"
    },
    "hand_cream": {
        "name_id": "Krim Tangan (Hand Cream)",
        "daily_amount_g": 2.16,
        "retention_factor": 1.0,
        "surface_area_cm2": 860,
        "frequency_day": 2.0,
        "application_type": "leave_on"
    },
    "sunscreen_lotion": {
        "name_id": "Tabir Surya / Sunscreen Lotion",
        "daily_amount_g": 18.0,
        "retention_factor": 1.0,
        "surface_area_cm2": 17500,
        "frequency_day": 2.0,
        "application_type": "leave_on"
    },
    "lipstick": {
        "name_id": "Lipstik / Lip Balm",
        "daily_amount_g": 0.057,
        "retention_factor": 1.0,
        "surface_area_cm2": 4.8,
        "frequency_day": 2.0,
        "application_type": "leave_on_ingested"
    },
    "eye_shadow": {
        "name_id": "Perona Mata (Eye Shadow/Eyeliner)",
        "daily_amount_g": 0.02,
        "retention_factor": 1.0,
        "surface_area_cm2": 24,
        "frequency_day": 1.0,
        "application_type": "leave_on"
    },
    "facial_cleanser": {
        "name_id": "Pembersih Wajah (Facial Cleanser)",
        "daily_amount_g": 2.0,
        "retention_factor": 0.01,
        "surface_area_cm2": 565,
        "frequency_day": 2.0,
        "application_type": "rinse_off"
    },
    "shampoo": {
        "name_id": "Sampo Rambut (Shampoo)",
        "daily_amount_g": 10.46,
        "retention_factor": 0.01,
        "surface_area_cm2": 1440,
        "frequency_day": 1.0,
        "application_type": "rinse_off"
    },
    "hair_conditioner": {
        "name_id": "Kondisioner Rambut",
        "daily_amount_g": 3.92,
        "retention_factor": 0.01,
        "surface_area_cm2": 1440,
        "frequency_day": 0.28,
        "application_type": "rinse_off"
    },
    "shower_gel": {
        "name_id": "Sabun Mandi Cair (Shower Gel)",
        "daily_amount_g": 18.67,
        "retention_factor": 0.01,
        "surface_area_cm2": 17500,
        "frequency_day": 1.0,
        "application_type": "rinse_off"
    },
    "deodorant_rollon": {
        "name_id": "Deodoran (Roll-on/Stick)",
        "daily_amount_g": 1.50,
        "retention_factor": 1.0,
        "surface_area_cm2": 200,
        "frequency_day": 1.0,
        "application_type": "leave_on"
    },
    "toothpaste_adult": {
        "name_id": "Pasta Gigi Dewasa (Toothpaste)",
        "daily_amount_g": 2.75,
        "retention_factor": 0.05,
        "surface_area_cm2": 0,
        "frequency_day": 2.0,
        "application_type": "oral_care"
    }
}

# TOXICOLOGY DATABASE (CIR, SCCS, EFSA, ECHA, NICNAS, BPOM)
INGREDIENT_DATABASE = {
    "niacinamide": {
        "inci_name": "Niacinamide",
        "synonyms": ["vitamin b3", "nicotinamide", "niasinamida"],
        "cas": "98-92-0",
        "category": "active",
        "pod_value_mg_kg_day": 215.0,
        "source": "CIR 2005 / EFSA",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 50.0,
        "regulatory_limit": "Tidak dibatasi (Umumnya s.d 5.0%)",
        "special_warnings": "Dapat ditoleransi sangat baik pada kulit normal."
    },
    "alpha_arbutin": {
        "inci_name": "Alpha-Arbutin",
        "synonyms": ["alpha arbutin", "alfa arbutin"],
        "cas": "84380-01-8",
        "category": "active",
        "pod_value_mg_kg_day": 150.0,
        "source": "SCCS/1642/22 & BPOM",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 50.0,
        "regulatory_limit": "Maksimal 2.0% pada krim wajah, 0.5% losion badan",
        "special_warnings": "Evaluasi stabilitas pelepasan metabolit hydroquinone."
    },
    "kojic_acid": {
        "inci_name": "Kojic Acid",
        "synonyms": ["asam kojat", "kojic acid"],
        "cas": "501-30-4",
        "category": "active",
        "pod_value_mg_kg_day": 7.0,
        "source": "SCCS/1637/21 & SCCS/1647/22",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 20.0,
        "regulatory_limit": "Maksimal 1.0% pada sediaan wajah dan leher (SCCS 2022)",
        "special_warnings": "Potensi efek tiroid pada dosis tinggi. Tidak untuk seluruh tubuh."
    },
    "retinol": {
        "inci_name": "Retinol",
        "synonyms": ["vitamin a", "all-trans-retinol"],
        "cas": "68-26-8",
        "category": "active",
        "pod_value_mg_kg_day": 1.0,
        "source": "SCCS/1643/22 & EFSA (3000 ug RE/day)",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 5.7,
        "regulatory_limit": "Maksimal 0.05% RE badan, 0.3% RE wajah (SCCS 2023)",
        "special_warnings": "Hindari pada wanita hamil. Wajib klaim peringatan vitamin A."
    },
    "bakuchiol": {
        "inci_name": "Bakuchiol",
        "synonyms": ["bakukiol"],
        "cas": "10309-37-2",
        "category": "active",
        "pod_value_mg_kg_day": 250.0,
        "source": "ECHA REACH Dossier / NICNAS Australia",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 25.0,
        "regulatory_limit": "Tidak dibatasi (Umumnya 0.5% - 1.0%)",
        "special_warnings": "Alternatif retinol yang fotostabil dan ramah kulit sensitif."
    },
    "ascorbic_acid": {
        "inci_name": "Ascorbic Acid",
        "synonyms": ["vitamin c", "l-ascorbic acid", "asam askorbat"],
        "cas": "50-81-7",
        "category": "active",
        "pod_value_mg_kg_day": 1000.0,
        "source": "CIR 2014 / EFSA",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 20.0,
        "regulatory_limit": "Tidak dibatasi (Umumnya 5.0% - 15.0%)",
        "special_warnings": "Waspadai iritasi asam pada konsentrasi > 10% (pH < 3.5)."
    },
    "salicylic_acid": {
        "inci_name": "Salicylic Acid",
        "synonyms": ["asam salisilat", "2-hydroxybenzoic acid", "bha"],
        "cas": "69-72-7",
        "category": "active",
        "pod_value_mg_kg_day": 250.0,
        "source": "SCCS/1601/18 & BPOM",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 50.0,
        "regulatory_limit": "Maksimal 2.0% (Leave-on), 3.0% (Rinse-off)",
        "special_warnings": "Dilarang untuk anak < 3 tahun (kecuali sampo)."
    },
    "glycolic_acid": {
        "inci_name": "Glycolic Acid",
        "synonyms": ["asam glikolat", "aha"],
        "cas": "79-14-1",
        "category": "active",
        "pod_value_mg_kg_day": 100.0,
        "source": "SCCS/0370/00 & CIR 2013",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 30.0,
        "regulatory_limit": "Maksimal 10.0% (pH sediaan ≥ 3.5)",
        "special_warnings": "Meningkatkan sensitivitas UV. Wajib gunakan tabir surya."
    },
    "phenoxyethanol": {
        "inci_name": "Phenoxyethanol",
        "synonyms": ["fenoksietanol", "2-phenoxyethanol", "optiphen"],
        "cas": "122-99-6",
        "category": "preservative",
        "pod_value_mg_kg_day": 357.0,
        "source": "SCCS/1575/16 & BPOM Annex V",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 80.0,
        "regulatory_limit": "Maksimal 1.0% (BPOM / EU Annex V Item 29)",
        "special_warnings": "Aman pada konsentrasi <= 1.0%."
    },
    "methylparaben": {
        "inci_name": "Methylparaben",
        "synonyms": ["metil paraben", "nipagin"],
        "cas": "99-76-3",
        "category": "preservative",
        "pod_value_mg_kg_day": 250.0,
        "source": "SCCS/1348/10 & BPOM Annex V",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 3.7,
        "regulatory_limit": "Maksimal 0.4% tunggal / 0.8% campuran",
        "special_warnings": "Evaluasi Hazard Index (HI) jika bersama propylparaben."
    },
    "propylparaben": {
        "inci_name": "Propylparaben",
        "synonyms": ["propil paraben", "nipasol"],
        "cas": "94-13-3",
        "category": "preservative",
        "pod_value_mg_kg_day": 100.0,
        "source": "SCCS/1514/13 & BPOM Annex V",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 3.6,
        "regulatory_limit": "Maksimal 0.14% (sebagai asam)",
        "special_warnings": "Dilarang pada leave-on area popok anak < 3 tahun."
    },
    "sodium_benzoate": {
        "inci_name": "Sodium Benzoate",
        "synonyms": ["natrium benzoat"],
        "cas": "532-32-1",
        "category": "preservative",
        "pod_value_mg_kg_day": 500.0,
        "source": "SCCS/1571/15 & CIR",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 20.0,
        "regulatory_limit": "Maksimal 0.5% pada sediaan leave-on",
        "special_warnings": "Efektif optimal pada pH asam (< 5.0)."
    },
    "ethylhexyl_methoxycinnamate": {
        "inci_name": "Ethylhexyl Methoxycinnamate",
        "synonyms": ["octinoxate", "omc", "oktinoksat"],
        "cas": "5466-77-3",
        "category": "uv_filter",
        "pod_value_mg_kg_day": 450.0,
        "source": "SCCS/1344/10 & BPOM Annex VI",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 50.0,
        "regulatory_limit": "Maksimal 10.0% (BPOM / Annex VI Filter UV)",
        "special_warnings": "Periksa kompatibilitas fotostabilitas bersama Avobenzone."
    },
    "titanium_dioxide": {
        "inci_name": "Titanium Dioxide",
        "synonyms": ["titanium dioksida", "tio2", "ci 77891"],
        "cas": "13463-67-7",
        "category": "uv_filter",
        "pod_value_mg_kg_day": 1000.0,
        "source": "SCCS/1516/13 & CIR 2019",
        "oral_absorption_percent": 10.0,
        "dermal_absorption_percent": 1.0,
        "regulatory_limit": "Maksimal 25.0% (Filter UV)",
        "special_warnings": "Bentuk nano dilarang pada semprotan inhalasi."
    },
    "zinc_oxide": {
        "inci_name": "Zinc Oxide",
        "synonyms": ["seng oksida", "zno", "ci 77947"],
        "cas": "1314-13-2",
        "category": "uv_filter",
        "pod_value_mg_kg_day": 50.0,
        "source": "SCCS/1489/12 & Annex VI",
        "oral_absorption_percent": 20.0,
        "dermal_absorption_percent": 1.0,
        "regulatory_limit": "Maksimal 25.0% (Filter UV)",
        "special_warnings": "Bentuk nano dilarang pada sediaan semprotan inhalasi."
    },
    "avobenzone": {
        "inci_name": "Butyl Methoxydibenzoylmethane",
        "synonyms": ["avobenzone", "avobenzon"],
        "cas": "70356-09-1",
        "category": "uv_filter",
        "pod_value_mg_kg_day": 450.0,
        "source": "SCCS/1347/10 & CIR 2003",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 5.0,
        "regulatory_limit": "Maksimal 5.0% (BPOM / Annex VI Filter UV)",
        "special_warnings": "Gunakan bersama fotostabilisator (Octocrylene / Bemotrizinol)."
    },
    "octocrylene": {
        "inci_name": "Octocrylene",
        "synonyms": ["oktokrilen"],
        "cas": "6197-30-4",
        "category": "uv_filter",
        "pod_value_mg_kg_day": 175.0,
        "source": "SCCS/1627/21 Final Opinion",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 2.0,
        "regulatory_limit": "Maksimal 10.0% lotion, 9.0% aerosol spray (SCCS 2021)",
        "special_warnings": "Evaluasi degradasi menjadi benzophenone."
    },
    "bemotrizinol": {
        "inci_name": "Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine",
        "synonyms": ["tinosorb s", "bemotrizinol"],
        "cas": "187393-00-6",
        "category": "uv_filter",
        "pod_value_mg_kg_day": 200.0,
        "source": "SCCS/1058/06 & BPOM Annex VI",
        "oral_absorption_percent": 10.0,
        "dermal_absorption_percent": 0.5,
        "regulatory_limit": "Maksimal 10.0% (BPOM / Annex VI Item 23)",
        "special_warnings": "Molekul besar dengan penetrasi kulit sangat minimal (< 0.5%)."
    },
    "glycerin": {
        "inci_name": "Glycerin",
        "synonyms": ["gliserin", "glycerol"],
        "cas": "56-81-5",
        "category": "humectant",
        "pod_value_mg_kg_day": 2000.0,
        "source": "CIR 2019 & OECD SIDS",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 10.0,
        "regulatory_limit": "Tidak dibatasi (GRAS)",
        "special_warnings": "Aman pada seluruh rentang formulasi kosmetik (1.0% - 50.0%)."
    },
    "hyaluronic_acid": {
        "inci_name": "Sodium Hyaluronate",
        "synonyms": ["hyaluronic acid", "asam hialuronat", "sodium hyaluronate"],
        "cas": "9067-32-7",
        "category": "humectant",
        "pod_value_mg_kg_day": 1500.0,
        "source": "CIR 2009",
        "oral_absorption_percent: 50.0",
        "dermal_absorption_percent": 5.0,
        "regulatory_limit": "Tidak dibatasi (Umumnya 0.1% - 2.0%)",
        "special_warnings": "Sangat biokompatibel dan aman."
    },
    "panthenol": {
        "inci_name": "Panthenol",
        "synonyms": ["pro-vitamin b5", "d-panthenol"],
        "cas": "81-13-0",
        "category": "humectant",
        "pod_value_mg_kg_day": 1000.0,
        "source": "CIR 2017 & EFSA",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 20.0,
        "regulatory_limit": "Tidak dibatasi (Umumnya 0.5% - 5.0%)",
        "special_warnings": "Memperbaiki barrier kulit dan menenangkan iritasi."
    },
    "tocopherol": {
        "inci_name": "Tocopherol",
        "synonyms": ["vitamin e", "tokoferol"],
        "cas": "10191-41-0",
        "category": "antioxidant",
        "pod_value_mg_kg_day": 500.0,
        "source": "CIR 2002 / EFSA",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 30.0,
        "regulatory_limit": "Tidak dibatasi (Umumnya 0.1% - 1.0%)",
        "special_warnings": "Antioksidan penstabil fase minyak."
    },
    "allantoin": {
        "inci_name": "Allantoin",
        "synonyms": ["alantoin"],
        "cas": "97-59-6",
        "category": "active",
        "pod_value_mg_kg_day": 500.0,
        "source": "CIR 2010",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 20.0,
        "regulatory_limit": "Tidak dibatasi (Umumnya 0.1% - 0.5%)",
        "special_warnings": "Menenangkan kulit dan meredakan kemerahan."
    },
    "fragrance": {
        "inci_name": "Parfum",
        "synonyms": ["fragrance", "parfum", "pewangi"],
        "cas": "N/A",
        "category": "fragrance",
        "pod_value_mg_kg_day": 50.0,
        "source": "IFRA 51st Amendment & SCCS",
        "oral_absorption_percent": 100.0,
        "dermal_absorption_percent": 50.0,
        "regulatory_limit": "Sesuai Standar IFRA (Wajib deklarasi 26 Alergen jika > 0.001%)",
        "special_warnings": "Waspadai potensi sensitisasi kontak."
    }
}


def lookup_ingredient(query: str) -> Optional[Dict[str, Any]]:
    """Mencari data bahan berdasarkan INCI, sinonim, atau nama Indonesia."""
    query_clean = query.strip().lower()
    for key, data in INGREDIENT_DATABASE.items():
        if query_clean == key or query_clean == data["inci_name"].lower():
            return data
        if "cas" in data and query_clean == data["cas"]:
            return data
        for syn in data.get("synonyms", []):
            if query_clean == syn.lower() or syn.lower() in query_clean:
                return data
    return None


def calculate_ingredient_mos(
    ingredient_name: str,
    concentration_percent: float,
    product_category: str = "face_cream",
    body_weight_kg: float = 60.0,
    custom_pod_mg_kg_day: Optional[float] = None,
    custom_da_percent: Optional[float] = None,
    custom_abs_oral_percent: Optional[float] = None
) -> Dict[str, Any]:
    """Kalkulasi MoS & SED kuantitatif sesuai standar internasional."""
    prod_data = SCCS_PRODUCT_DEFAULTS.get(product_category, SCCS_PRODUCT_DEFAULTS["face_cream"])
    ing_data = lookup_ingredient(ingredient_name)

    inci = ing_data["inci_name"] if ing_data else ingredient_name
    cas = ing_data.get("cas", "N/A") if ing_data else "N/A"
    reg_limit = ing_data.get("regulatory_limit", "Lihat regulasi BPOM/SCCS") if ing_data else "Lihat regulasi BPOM/SCCS"
    warnings = ing_data.get("special_warnings", "-") if ing_data else "-"

    A = prod_data["daily_amount_g"]
    R = prod_data["retention_factor"]
    C = float(concentration_percent)
    BW = float(body_weight_kg)

    if custom_da_percent is not None:
        DA_p = float(custom_da_percent)
    elif ing_data and "dermal_absorption_percent" in ing_data:
        DA_p = float(ing_data["dermal_absorption_percent"])
    else:
        DA_p = 50.0

    sed = (A * 1000.0 * (C / 100.0) * (DA_p / 100.0) * R) / BW

    if custom_pod_mg_kg_day is not None:
        pod_oral = float(custom_pod_mg_kg_day)
        source = "Custom Input Assessor"
    elif ing_data and "pod_value_mg_kg_day" in ing_data:
        pod_oral = float(ing_data["pod_value_mg_kg_day"])
        source = ing_data.get("source", "Standard Monograph")
    else:
        pod_oral = 100.0
        source = "Default Benchmark Fallback"

    if custom_abs_oral_percent is not None:
        abs_oral = float(custom_abs_oral_percent)
    elif ing_data and "oral_absorption_percent" in ing_data:
        abs_oral = float(ing_data["oral_absorption_percent"])
    else:
        abs_oral = 50.0

    pod_sys = pod_oral if abs_oral >= 50.0 else pod_oral * (abs_oral / 100.0)
    mos = pod_sys / sed if sed > 0 else 999999.0
    is_safe = mos >= 100.0

    return {
        "ingredient_query": ingredient_name,
        "inci_name": inci,
        "cas_number": cas,
        "concentration_percent": C,
        "product_type_id": product_category,
        "product_type_name": prod_data["name_id"],
        "application_mode": "Leave-on" if R >= 0.5 else "Rinse-off",
        "retention_factor": R,
        "daily_applied_g": A,
        "body_weight_kg": BW,
        "dermal_absorption_percent": DA_p,
        "sed_mg_kg_day": round(sed, 6),
        "noael_oral_mg_kg_day": round(pod_oral, 2),
        "oral_absorption_percent": abs_oral,
        "pod_sys_mg_kg_day": round(pod_sys, 2),
        "mos": round(mos, 1),
        "is_safe": is_safe,
        "safety_status": "AMAN" if is_safe else "TIDAK AMAN",
        "regulatory_limit": reg_limit,
        "toxicology_source": source,
        "special_warnings": warnings
    }


def evaluate_formula(
    formula_items: List[Dict[str, Any]],
    product_category: str = "face_cream",
    body_weight_kg: float = 60.0
) -> Dict[str, Any]:
    """Mengevaluasi seluruh formula kosmetik."""
    results = []
    all_safe = True
    inv_mos_sum = 0.0

    for item in formula_items:
        name = item.get("name") or item.get("inci_name")
        conc = float(item.get("concentration", 0.0))
        res = calculate_ingredient_mos(
            ingredient_name=name,
            concentration_percent=conc,
            product_category=product_category,
            body_weight_kg=body_weight_kg,
            custom_pod_mg_kg_day=item.get("noael"),
            custom_da_percent=item.get("da_percent")
        )
        if not res["is_safe"]:
            all_safe = False
        if res["mos"] > 0:
            inv_mos_sum += (1.0 / res["mos"]) * 100.0
        results.append(res)

    prod_name = SCCS_PRODUCT_DEFAULTS.get(product_category, {}).get("name_id", product_category)

    return {
        "product_category": product_category,
        "product_name": prod_name,
        "target_body_weight_kg": body_weight_kg,
        "overall_formula_safe": all_safe,
        "hazard_index_hi": round(inv_mos_sum, 4),
        "ingredients_evaluated": results
    }


if __name__ == "__main__":
    test_formula = [
        {"name": "Niacinamide", "concentration": 4.0},
        {"name": "Phenoxyethanol", "concentration": 0.8},
        {"name": "Alpha-Arbutin", "concentration": 2.0},
        {"name": "Salicylic Acid", "concentration": 1.5},
        {"name": "Kojic Acid", "concentration": 0.8},
        {"name": "Tocopherol", "concentration": 0.5}
    ]

    report = evaluate_formula(test_formula, product_category="face_cream", body_weight_kg=60.0)
    print("=" * 115)
    print(f"LAPORAN MARGIN OF SAFETY (MoS) - {report['product_name'].upper()}")
    print("=" * 115)
    print(f"{'Nama Bahan Baku':<22} | {'Kons.%':<7} | {'SED (mg/kg/d)':<14} | {'NOAEL':<8} | {'PoD_sys':<8} | {'MoS':<9} | {'Status':<10}")
    print("-" * 115)
    for ing in report["ingredients_evaluated"]:
        print(f"{ing['inci_name']:<22} | {ing['concentration_percent']:<7.2f} | {ing['sed_mg_kg_day']:<14.6f} | {ing['noael_oral_mg_kg_day']:<8.1f} | {ing['pod_sys_mg_kg_day']:<8.1f} | {ing['mos']:<9.1f} | {ing['safety_status']:<10}")
    print("=" * 115)
    print(f"Status Keseluruhan Formula: {'AMAN (MEMENUHI SYARAT)' if report['overall_formula_safe'] else 'TIDAK AMAN'}")
    print(f"Hazard Index (HI): {report['hazard_index_hi']}")
