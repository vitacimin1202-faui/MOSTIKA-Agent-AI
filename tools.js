/**
 * COSMETIC MARGIN OF SAFETY (MoS) & SED CALCULATION UTILITY (tools.js)
 * Comprehensive Toxicological Database (60+ Substances)
 * Referenced Standards:
 * - SCCS (EU Scientific Committee on Consumer Safety) - SCCS Notes of Guidance 12th Rev (SCCS/1647/22)
 * - CIR (Cosmetic Ingredient Review - USA)
 * - ECHA (European Chemicals Agency - REACH Dossiers & Guidance R.8)
 * - EFSA (European Food Safety Authority - OpenFoodTox / BMDL)
 * - NICNAS / AICIS (Australian Industrial Chemicals Introduction Scheme)
 * - BPOM RI & ASEAN Cosmetic Directive (ACD)
 */

const SCCS_PRODUCT_DEFAULTS = {
  face_cream: {
    id: "face_cream",
    name_id: "Krim Wajah (Face Cream)",
    daily_amount_g: 1.54,
    retention_factor: 1.0,
    surface_area_cm2: 565,
    frequency_day: 2.0,
    application_type: "leave_on",
    desc: "Aplikasi leave-on pada area wajah (pagi & malam)"
  },
  body_lotion: {
    id: "body_lotion",
    name_id: "Losion Badan (Body Lotion)",
    daily_amount_g: 7.82,
    retention_factor: 1.0,
    surface_area_cm2: 15670,
    frequency_day: 1.0,
    application_type: "leave_on",
    desc: "Aplikasi leave-on pada seluruh permukaan tubuh"
  },
  hand_cream: {
    id: "hand_cream",
    name_id: "Krim Tangan (Hand Cream)",
    daily_amount_g: 2.16,
    retention_factor: 1.0,
    surface_area_cm2: 860,
    frequency_day: 2.0,
    application_type: "leave_on",
    desc: "Aplikasi leave-on pada kedua telapak & punggung tangan"
  },
  sunscreen_lotion: {
    id: "sunscreen_lotion",
    name_id: "Tabir Surya / Sunscreen Lotion",
    daily_amount_g: 18.0,
    retention_factor: 1.0,
    surface_area_cm2: 17500,
    frequency_day: 2.0,
    application_type: "leave_on",
    desc: "Aplikasi leave-on proteksi UV seluruh tubuh & wajah"
  },
  lipstick: {
    id: "lipstick",
    name_id: "Lipstik / Lip Balm",
    daily_amount_g: 0.057,
    retention_factor: 1.0,
    surface_area_cm2: 4.8,
    frequency_day: 2.0,
    application_type: "leave_on_ingested",
    desc: "Aplikasi bibir dengan asumsi 100% tertelan secara oral"
  },
  eye_shadow: {
    id: "eye_shadow",
    name_id: "Perona Mata (Eye Shadow/Eyeliner)",
    daily_amount_g: 0.02,
    retention_factor: 1.0,
    surface_area_cm2: 24,
    frequency_day: 1.0,
    application_type: "leave_on",
    desc: "Aplikasi leave-on pada area periorbital mata"
  },
  facial_cleanser: {
    id: "facial_cleanser",
    name_id: "Pembersih Wajah (Facial Cleanser)",
    daily_amount_g: 2.0,
    retention_factor: 0.01,
    surface_area_cm2: 565,
    frequency_day: 2.0,
    application_type: "rinse_off",
    desc: "Sediaan bilas pembersih wajah (retensi 1%)"
  },
  shampoo: {
    id: "shampoo",
    name_id: "Sampo Rambut (Shampoo)",
    daily_amount_g: 10.46,
    retention_factor: 0.01,
    surface_area_cm2: 1440,
    frequency_day: 1.0,
    application_type: "rinse_off",
    desc: "Sediaan bilas kulit kepala & rambut (retensi 1%)"
  },
  hair_conditioner: {
    id: "hair_conditioner",
    name_id: "Kondisioner Rambut",
    daily_amount_g: 3.92,
    retention_factor: 0.01,
    surface_area_cm2: 1440,
    frequency_day: 0.28,
    application_type: "rinse_off",
    desc: "Sediaan bilas rambut (aplikasi rata-rata 2x seminggu)"
  },
  shower_gel: {
    id: "shower_gel",
    name_id: "Sabun Mandi Cair (Shower Gel)",
    daily_amount_g: 18.67,
    retention_factor: 0.01,
    surface_area_cm2: 17500,
    frequency_day: 1.0,
    application_type: "rinse_off",
    desc: "Sediaan bilas mandi seluruh tubuh (retensi 1%)"
  },
  deodorant_rollon: {
    id: "deodorant_rollon",
    name_id: "Deodoran (Roll-on/Stick)",
    daily_amount_g: 1.50,
    retention_factor: 1.0,
    surface_area_cm2: 200,
    frequency_day: 1.0,
    application_type: "leave_on",
    desc: "Aplikasi leave-on pada area ketiak"
  },
  toothpaste_adult: {
    id: "toothpaste_adult",
    name_id: "Pasta Gigi Dewasa (Toothpaste)",
    daily_amount_g: 2.75,
    retention_factor: 0.05,
    surface_area_cm2: 0,
    frequency_day: 2.0,
    application_type: "oral_care",
    desc: "Sediaan oral care dengan fraksi tertelan 5%"
  }
};

// --------------------------------------------------------------------------------------
// COMPREHENSIVE TOXICOLOGY DATABASE (CIR, SCCS, EFSA, ECHA, NICNAS, BPOM, ACD)
// --------------------------------------------------------------------------------------
const INGREDIENT_DATABASE = {
  // ==================== 1. BAHAN AKTIF PENCERAH & ANTI-AGING ====================
  niacinamide: {
    inci_name: "Niacinamide",
    synonyms: ["vitamin b3", "nicotinamide", "niasinamida", "nicotinic acid amide"],
    cas: "98-92-0",
    category: "active",
    cosmetic_function: "Skin conditioning, Brightening, Sebum regulator",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 215.0,
    study_type: "90-day oral subchronic toxicity in rats",
    source: "CIR 2005 / EFSA Journal",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Tidak dibatasi secara kuantitatif (Umumnya 2.0% - 5.0%)",
    special_warnings: "Dapat ditoleransi sangat baik pada kulit normal; aman untuk ibu hamil & menyusui."
  },
  alpha_arbutin: {
    inci_name: "Alpha-Arbutin",
    synonyms: ["alpha arbutin", "alfa arbutin", "4-hydroxyphenyl alpha-d-glucopyranoside"],
    cas: "84380-01-8",
    category: "active",
    cosmetic_function: "Skin lightening, Tyrosinase inhibitor",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 150.0,
    study_type: "Oral subchronic study (Hydroquinone release risk assessment)",
    source: "SCCS/1642/22 Final Opinion & BPOM RI",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Maksimal 2.0% pada krim wajah, 0.5% pada losion badan (SCCS 2023)",
    special_warnings: "Evaluasi stabilitas pelepasan metabolit hydroquinone bebas (< 1 ppm)."
  },
  beta_arbutin: {
    inci_name: "Arbutin",
    synonyms: ["beta arbutin", "arbutin", "beta-arbutin"],
    cas: "497-76-7",
    category: "active",
    cosmetic_function: "Skin lightening (Pencerah)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 50.0,
    study_type: "Subchronic oral toxicity study",
    source: "SCCS/1552/15 Opinion & BPOM",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Maksimal 7.0% pada krim wajah (SCCS)",
    special_warnings: "Dilarang pada formula yang tidak stabil terhadap degradasi termal/pH asam."
  },
  kojic_acid: {
    inci_name: "Kojic Acid",
    synonyms: ["asam kojat", "kojic acid", "5-hydroxy-2-(hydroxymethyl)-4h-pyran-4-one"],
    cas: "501-30-4",
    category: "active",
    cosmetic_function: "Skin lightening / Depigmenting agent",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 7.0,
    study_type: "Thyroid tumor promotion & oral subchronic toxicity",
    source: "SCCS/1637/21 & SCCS/1647/22",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 20.0,
    regulatory_limit: "Maksimal 1.0% pada sediaan wajah dan leher (SCCS 2022 / EU Restriction)",
    special_warnings: "Potensi gangguan fungsi tiroid pada dosis tinggi. Tidak untuk aplikasi seluruh tubuh."
  },
  retinol: {
    inci_name: "Retinol",
    synonyms: ["vitamin a", "all-trans-retinol", "retinol murni"],
    cas: "68-26-8",
    category: "active",
    cosmetic_function: "Anti-aging, Cell renewal, Collagen stimulation",
    pod_type: "BMDL10 / NOAEL",
    pod_value_mg_kg_day: 1.0,
    study_type: "Developmental toxicity (Teratogenicity) & EFSA Upper Intake Level",
    source: "SCCS/1643/22 & EFSA (3000 ug RE/hari)",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 5.7,
    regulatory_limit: "Maksimal 0.05% RE pada losion badan, 0.3% RE pada krim wajah (SCCS 2023 / EU Limit)",
    special_warnings: "Tidak direkomendasikan untuk wanita hamil. Wajib cantumkan peringatan batas asupan vitamin A harian."
  },
  retinyl_palmitate: {
    inci_name: "Retinyl Palmitate",
    synonyms: ["vitamin a palmitate", "retinil palmitat"],
    cas: "79-81-2",
    category: "active",
    cosmetic_function: "Skin conditioning, Anti-aging",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1.8,
    study_type: "Teratogenicity benchmark SCCS",
    source: "SCCS/1643/22 & CIR",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 5.0,
    regulatory_limit: "Maksimal setara 0.3% Retinol Equivalent (RE)",
    special_warnings: "Gunakan pada malam hari atau sertakan proteksi tabir surya SPF pada pagi hari."
  },
  bakuchiol: {
    inci_name: "Bakuchiol",
    synonyms: ["bakukiol", "psoralen-free babchi extract"],
    cas: "10309-37-2",
    category: "active",
    cosmetic_function: "Antioxidant, Anti-aging (Alternatif Retinol)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 250.0,
    study_type: "Repeated dose oral 90-day & REACH dossier",
    source: "ECHA REACH Dossier / NICNAS Australia",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 25.0,
    regulatory_limit: "Tidak dibatasi (Umumnya digunakan 0.5% - 1.0%)",
    special_warnings: "Fotostabil dan dapat digunakan pada siang hari tanpa risiko fototoksisitas."
  },
  ascorbic_acid: {
    inci_name: "Ascorbic Acid",
    synonyms: ["vitamin c", "l-ascorbic acid", "asam askorbat"],
    cas: "50-81-7",
    category: "active",
    cosmetic_function: "Antioxidant, Brightening, Collagen synthesis",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "Repeated dose oral rodent & CIR safety monograph",
    source: "CIR 2014 / EFSA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 20.0,
    regulatory_limit: "Tidak dibatasi secara kuantitatif (Umumnya 5.0% - 15.0%)",
    special_warnings: "Waspadai iritasi asam pada konsentrasi > 10% dengan pH sediaan < 3.5."
  },
  ascorbyl_glucoside: {
    inci_name: "Ascorbyl Glucoside",
    synonyms: ["aa2g", "vitamin c glucoside", "askorbil glukosida"],
    cas: "129499-78-1",
    category: "active",
    cosmetic_function: "Skin brightening, Stable Vitamin C derivative",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "90-day oral toxicity & safety assessment",
    source: "CIR 2014 & SCCS",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 15.0,
    regulatory_limit: "Tidak dibatasi (Umumnya 1.0% - 2.0%)",
    special_warnings: "Turunan vitamin C stabil pada pH netral (5.5 - 7.0)."
  },
  tranexamic_acid: {
    inci_name: "Tranexamic Acid",
    synonyms: ["asam traneksamat", "t-amcha", "trans-4-(aminomethyl)cyclohexanecarboxylic acid"],
    cas: "1197-18-8",
    category: "active",
    cosmetic_function: "Skin conditioning, Hyperpigmentation reducer",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 300.0,
    study_type: "Subchronic oral & clinical dermatology monographs",
    source: "CIR 2021 / ECHA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 10.0,
    regulatory_limit: "Umumnya 1.0% - 3.0% pada produk kosmetik topikal",
    special_warnings: "Sangat aman pada pemakaian topikal luar tanpa efek antifibrinolitik sistemik signifikan."
  },

  // ==================== 2. EKSFOLIAN & ANTI-ACNE (KERATOLYTICS) ====================
  salicylic_acid: {
    inci_name: "Salicylic Acid",
    synonyms: ["asam salisilat", "2-hydroxybenzoic acid", "bha", "beta hydroxy acid"],
    cas: "69-72-7",
    category: "active",
    cosmetic_function: "Keratolytic, Anti-acne, Preservative",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 250.0,
    study_type: "Teratogenicity & 90-day oral subchronic rat study",
    source: "SCCS/1601/18 & BPOM HK.03.1.23.08.11.07517",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Maksimal 2.0% (Leave-on wajah), 3.0% (Rinse-off rambut), 0.5% (Pengawet)",
    special_warnings: "Dilarang pada produk anak di bawah 3 tahun (kecuali sampo). Wajib label peringatan etiket."
  },
  glycolic_acid: {
    inci_name: "Glycolic Acid",
    synonyms: ["asam glikolat", "aha", "hydroxyacetic acid"],
    cas: "79-14-1",
    category: "active",
    cosmetic_function: "Exfoliant, Skin renewal (AHA)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 100.0,
    study_type: "Oral subchronic rat study",
    source: "SCCS/0370/00 & CIR 2013",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 30.0,
    regulatory_limit: "Maksimal 10.0% (pH sediaan ≥ 3.5 untuk konsumen umum)",
    special_warnings: "Meningkatkan sensitivitas terhadap sinar matahari. Wajib disertai peringatan penggunaan tabir surya."
  },
  lactic_acid: {
    inci_name: "Lactic Acid",
    synonyms: ["asam laktat", "2-hydroxypropanoic acid"],
    cas: "50-21-5",
    category: "active",
    cosmetic_function: "Exfoliant, Humectant, pH buffer",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 250.0,
    study_type: "Subchronic oral toxicity & EFSA GRAS",
    source: "CIR 2013 / EFSA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 25.0,
    regulatory_limit: "Maksimal 10.0% (pH sediaan ≥ 3.5)",
    special_warnings: "Bahan pelembab alami sekaligus eksfolian lembut."
  },
  azelaic_acid: {
    inci_name: "Azelaic Acid",
    synonyms: ["asam azelat", "nonanedioic acid"],
    cas: "123-99-9",
    category: "active",
    cosmetic_function: "Anti-acne, Skin soothing, Brightening",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 200.0,
    study_type: "Subchronic oral toxicity",
    source: "CIR 2012 / ECHA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 10.0,
    regulatory_limit: "Umumnya s.d 10.0% pada kosmetik OTC",
    special_warnings: "Aman dan sangat efektif untuk kulit sensitif dan rentan kemerahan (rosacea)."
  },

  // ==================== 3. PENGAWET KOSMETIK (PRESERVATIVES - ANNEX V) ====================
  phenoxyethanol: {
    inci_name: "Phenoxyethanol",
    synonyms: ["fenoksietanol", "2-phenoxyethanol", "ethylene glycol monophenyl ether", "optiphen"],
    cas: "122-99-6",
    category: "preservative",
    cosmetic_function: "Preservative (Pengawet Spektrum Luas)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 357.0,
    study_type: "90-day oral gavage rat study (OECD TG 408)",
    source: "SCCS/1575/16 Opinion on Phenoxyethanol & BPOM Annex V",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 80.0,
    regulatory_limit: "Maksimal 1.0% (BPOM / EU CosIng Annex V Item 29)",
    special_warnings: "Aman pada konsentrasi <= 1.0% untuk semua kelompok usia termasuk bayi."
  },
  methylparaben: {
    inci_name: "Methylparaben",
    synonyms: ["metil paraben", "nipagin", "methyl 4-hydroxybenzoate"],
    cas: "99-76-3",
    category: "preservative",
    cosmetic_function: "Preservative (Pengawet Antijamur & Antibakteri)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 250.0,
    study_type: "Subchronic oral rat (Reproductive & Endocrine safety assessment)",
    source: "SCCS/1348/10 & BPOM Annex V",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 3.7,
    regulatory_limit: "Maksimal 0.4% (tunggal) atau 0.8% (campuran paraben)",
    special_warnings: "Evaluasi Hazard Index (HI) kumulatif jika dikombinasikan dengan propylparaben."
  },
  propylparaben: {
    inci_name: "Propylparaben",
    synonyms: ["propil paraben", "nipasol", "propyl 4-hydroxybenzoate"],
    cas: "94-13-3",
    category: "preservative",
    cosmetic_function: "Preservative (Pengawet)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 100.0,
    study_type: "Reproductive & 90-day oral study",
    source: "SCCS/1514/13 & BPOM Annex V",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 3.6,
    regulatory_limit: "Maksimal 0.14% (sebagai asam) pada produk non-popok",
    special_warnings: "Dilarang pada produk leave-on area popok untuk anak di bawah usia 3 tahun."
  },
  sodium_benzoate: {
    inci_name: "Sodium Benzoate",
    synonyms: ["natrium benzoat", "sodium benzoate", "benzoat"],
    cas: "532-32-1",
    category: "preservative",
    cosmetic_function: "Preservative (Pengawet Asam)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 500.0,
    study_type: "Chronic oral toxicity study",
    source: "SCCS/1571/15 & CIR 2017",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 20.0,
    regulatory_limit: "Maksimal 0.5% (sebagai asam benzoat) pada sediaan leave-on wajah/tubuh",
    special_warnings: "Efektif optimal pada pH asam (< 5.0)."
  },
  potassium_sorbate: {
    inci_name: "Potassium Sorbate",
    synonyms: ["kalium sorbat", "potassium sorbate", "sorbate"],
    cas: "24634-61-5",
    category: "preservative",
    cosmetic_function: "Preservative (Pengawet Antijamur)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 300.0,
    study_type: "Oral chronic & EFSA food additive safety monograph",
    source: "SCCS/1511/13 / EFSA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 20.0,
    regulatory_limit: "Maksimal 0.6% (sebagai asam sorbat)",
    special_warnings: "Dapat menimbulkan sensasi kesemutan ringan pada kulit sangat sensitif jika konsentrasi > 0.5%."
  },
  chlorphenesin: {
    inci_name: "Chlorphenesin",
    synonyms: ["klorfenesin", "3-(4-chlorophenoxy)propane-1,2-diol"],
    cas: "104-29-0",
    category: "preservative",
    cosmetic_function: "Preservative / Antimicrobial",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 100.0,
    study_type: "Oral subchronic study",
    source: "CIR 2014 & SCCS",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Maksimal 0.3% (BPOM / EU Annex V Item 34)",
    special_warnings: "Aman pada konsentrasi <= 0.3%."
  },
  ethylhexylglycerin: {
    inci_name: "Ethylhexylglycerin",
    synonyms: ["etilheksilgliserin", "octoxyglycerin", "sensiva sc 50"],
    cas: "70445-33-9",
    category: "preservative",
    cosmetic_function: "Preservative booster, Deodorant active, Skin conditioning",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 200.0,
    study_type: "Repeated dose oral 90-day rat study",
    source: "CIR 2011 / ECHA REACH Dossier",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Tidak dibatasi (Umumnya digunakan 0.2% - 1.0%)",
    special_warnings: "Meningkatkan efikasi pengawet fenoksietanol."
  },
  benzyl_alcohol: {
    inci_name: "Benzyl Alcohol",
    synonyms: ["benzil alkohol", "phenylcarbinol"],
    cas: "100-51-6",
    category: "preservative",
    cosmetic_function: "Preservative, Solvent, Fragrance component",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 200.0,
    study_type: "Oral subchronic toxicity",
    source: "SCCS/1457/11 & Annex V",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Maksimal 1.0% (Pengawet Annex V). Termasuk 26 Alergen jika sebagai pewangi",
    special_warnings: "Wajib deklarasi nama pada label jika konsentrasi > 0.001% (leave-on)."
  },
  bht: {
    inci_name: "BHT",
    synonyms: ["butylated hydroxytoluene", "bht antioksidan", "2,6-di-tert-butyl-4-methylphenol"],
    cas: "128-37-0",
    category: "antioxidant",
    cosmetic_function: "Antioxidant stabilizer",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 25.0,
    study_type: "Subchronic & reproductive oral toxicity",
    source: "SCCS/1634/21 Final Opinion",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 4.0,
    regulatory_limit: "Maksimal 0.8% pada produk kosmetik umum, 0.1% pasta gigi, 0.001% obat kumur",
    special_warnings: "SCCS 2021 merevisi batas aman untuk mencegah akumulasi paparan oral."
  },

  // ==================== 4. FILTER UV / TABIR SURYA (ANNEX VI) ====================
  ethylhexyl_methoxycinnamate: {
    inci_name: "Ethylhexyl Methoxycinnamate",
    synonyms: ["octinoxate", "omc", "oktinoksat", "uvb chemical filter"],
    cas: "5466-77-3",
    category: "uv_filter",
    cosmetic_function: "UV Filter (Tabir Surya Kimia UVB)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 450.0,
    study_type: "Oral 90-day subchronic toxicity",
    source: "SCCS/1344/10 & BPOM Annex VI",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Maksimal 10.0% (BPOM / Annex VI Filter UV)",
    special_warnings: "Periksa kompatibilitas fotostabilitas bersama Avobenzone."
  },
  titanium_dioxide: {
    inci_name: "Titanium Dioxide",
    synonyms: ["titanium dioksida", "tio2", "ci 77891", "tabir surya fisik"],
    cas: "13463-67-7",
    category: "uv_filter",
    cosmetic_function: "UV Filter / Mineral white pigment",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "Oral chronic/subchronic rodent study",
    source: "SCCS/1516/13 & CIR 2019",
    oral_absorption_percent: 10.0,
    dermal_absorption_percent: 1.0,
    regulatory_limit: "Maksimal 25.0% (BPOM / Annex VI)",
    special_warnings: "Bentuk nano dilarang digunakan dalam aplikasi semprotan/spray yang berisiko terinhalasi."
  },
  zinc_oxide: {
    inci_name: "Zinc Oxide",
    synonyms: ["seng oksida", "zno", "ci 77947", "mineral uv filter"],
    cas: "1314-13-2",
    category: "uv_filter",
    cosmetic_function: "UV Filter (Broad UVA/UVB), Skin protectant",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 50.0,
    study_type: "Subchronic oral toxicity",
    source: "SCCS/1489/12 & Annex VI",
    oral_absorption_percent: 20.0,
    dermal_absorption_percent: 1.0,
    regulatory_limit: "Maksimal 25.0% (BPOM / Annex VI Filter UV)",
    special_warnings: "Bentuk nano dilarang pada sediaan semprotan aerosol inhalasi."
  },
  avobenzone: {
    inci_name: "Butyl Methoxydibenzoylmethane",
    synonyms: ["avobenzone", "avobenzon", "parsons 1789", "uva filter"],
    cas: "70356-09-1",
    category: "uv_filter",
    cosmetic_function: "UV Filter (Broad spectrum UVA Filter)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 450.0,
    study_type: "90-day oral rat study",
    source: "SCCS/1347/10 & CIR 2003",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 5.0,
    regulatory_limit: "Maksimal 5.0% (BPOM / Annex VI Filter UV)",
    special_warnings: "Dianjurkan penggunaan fotostabilisator seperti Octocrylene atau Bemotrizinol."
  },
  octocrylene: {
    inci_name: "Octocrylene",
    synonyms: ["oktokrilen", "2-ethylhexyl 2-cyano-3,3-diphenylacrylate"],
    cas: "6197-30-4",
    category: "uv_filter",
    cosmetic_function: "UV Filter (UVB & UVA II), Photostabilizer",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 175.0,
    study_type: "Oral subchronic & endocrine evaluation",
    source: "SCCS/1627/21 Final Opinion",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 2.0,
    regulatory_limit: "Maksimal 10.0% pada lotion/krim, 9.0% pada semprotan aerosol (SCCS 2021)",
    special_warnings: "Evaluasi kemurnian terhadap degradasi menjadi benzophenone."
  },
  ethylhexyl_salicylate: {
    inci_name: "Ethylhexyl Salicylate",
    synonyms: ["octisalate", "oktisalat", "octyl salicylate"],
    cas: "118-60-5",
    category: "uv_filter",
    cosmetic_function: "UV Filter (UVB Filter)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 250.0,
    study_type: "Oral subchronic toxicity",
    source: "SCCS/1638/21 & Annex VI",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 5.0,
    regulatory_limit: "Maksimal 5.0% (BPOM / Annex VI)",
    special_warnings: "Pelarut organik yang baik untuk kristal Avobenzone."
  },
  bemotrizinol: {
    inci_name: "Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine",
    synonyms: ["tinosorb s", "bemotrizinol", "eskalol s"],
    cas: "187393-00-6",
    category: "uv_filter",
    cosmetic_function: "Broad Spectrum UVA/UVB Filter, Photostabilizer",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 200.0,
    study_type: "Oral subchronic rodent toxicity",
    source: "SCCS/1058/06 & BPOM Annex VI",
    oral_absorption_percent: 10.0,
    dermal_absorption_percent: 0.5,
    regulatory_limit: "Maksimal 10.0% (BPOM / Annex VI Item 23)",
    special_warnings: "Molekul besar (MW > 600 Da) dengan penetrasi dermal sangat rendah (< 0.5%)."
  },
  bisoctrizole: {
    inci_name: "Methylene Bis-Benzotriazolyl Tetramethylbutylphenol",
    synonyms: ["tinosorb m", "bisoctrizole", "uv filter partikulat"],
    cas: "103597-45-1",
    category: "uv_filter",
    cosmetic_function: "Broad Spectrum Hybrid Organic-Particulate UV Filter",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 500.0,
    study_type: "Oral chronic & in vitro penetration studies",
    source: "SCCS/1546/15 & BPOM Annex VI",
    oral_absorption_percent: 10.0,
    dermal_absorption_percent: 0.1,
    regulatory_limit: "Maksimal 10.0% (BPOM / Annex VI Item 24)",
    special_warnings: "Bentuk nano dilarang pada aplikasi semprotan inhalasi."
  },
  diethylamino_hydroxybenzoyl_hexyl_benzoate: {
    inci_name: "Diethylamino Hydroxybenzoyl Hexyl Benzoate",
    synonyms: ["uvinul a plus", "dhhb", "long-wave uva filter"],
    cas: "302776-68-7",
    category: "uv_filter",
    cosmetic_function: "UV Filter (High UVA I Filter)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 100.0,
    study_type: "Subchronic oral toxicity study",
    source: "SCCS/1202/08 & BPOM Annex VI",
    oral_absorption_percent: 50.0,
    dermal_absorption_percent: 0.2,
    regulatory_limit: "Maksimal 10.0% (BPOM / Annex VI Item 28)",
    special_warnings: "Sangat fotostabil dan larut minyak."
  },

  // ==================== 5. HUMEKTAN, PELEMBAB & EMOLEN ====================
  glycerin: {
    inci_name: "Glycerin",
    synonyms: ["gliserin", "glycerol", "gliserol"],
    cas: "56-81-5",
    category: "humectant",
    cosmetic_function: "Humectant, Skin protectant, Hydrating",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 2000.0,
    study_type: "Oral chronic & CIR safety assessment",
    source: "CIR 2019 & OECD SIDS / EFSA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 10.0,
    regulatory_limit: "Tidak dibatasi (Generally Regarded As Safe / GRAS)",
    special_warnings: "Aman pada seluruh rentang formulasi kosmetik (1.0% - 50.0%)."
  },
  propylene_glycol: {
    inci_name: "Propylene Glycol",
    synonyms: ["propilen glikol", "pg", "1,2-propanediol"],
    cas: "57-55-6",
    category: "humectant",
    cosmetic_function: "Humectant, Solvent, Penetration enhancer",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1230.0,
    study_type: "Oral chronic rodent study",
    source: "CIR 2012 / EFSA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 30.0,
    regulatory_limit: "Tidak dibatasi (Umumnya 1.0% - 10.0%)",
    special_warnings: "Dapat menyebabkan sensasi hangat atau iritasi ringan jika konsentrasi > 20% pada kulit luka."
  },
  butylene_glycol: {
    inci_name: "Butylene Glycol",
    synonyms: ["butilen glikol", "bg", "1,3-butanediol"],
    cas: "107-88-0",
    category: "humectant",
    cosmetic_function: "Humectant, Solubilizer, Texture enhancer",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "Subchronic oral toxicity study",
    source: "CIR 2018",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 20.0,
    regulatory_limit: "Tidak dibatasi (Umumnya 1.0% - 10.0%)",
    special_warnings: "Sangat lembut dan tidak mengiritasi kulit sensitif."
  },
  hyaluronic_acid: {
    inci_name: "Sodium Hyaluronate",
    synonyms: ["hyaluronic acid", "asam hialuronat", "sodium hyaluronate", "ha"],
    cas: "9067-32-7",
    category: "humectant",
    cosmetic_function: "Humectant, Intensive hydrating, Barrier support",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1500.0,
    study_type: "Oral safety monograph CIR",
    source: "CIR 2009",
    oral_absorption_percent: 50.0,
    dermal_absorption_percent: 5.0,
    regulatory_limit: "Tidak dibatasi (Umumnya 0.1% - 2.0%)",
    special_warnings: "Sangat biokompatibel dan aman untuk semua jenis kulit."
  },
  panthenol: {
    inci_name: "Panthenol",
    synonyms: ["pro-vitamin b5", "d-panthenol", "dekspantenol"],
    cas: "81-13-0",
    category: "humectant",
    cosmetic_function: "Skin soothing, Barrier repair, Humectant",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "Subchronic oral safety study",
    source: "CIR 2017 & EFSA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 20.0,
    regulatory_limit: "Tidak dibatasi (Umumnya 0.5% - 5.0%)",
    special_warnings: "Mempercepat epitelisasi dan regenerasi barrier kulit."
  },
  cetyl_alcohol: {
    inci_name: "Cetyl Alcohol",
    synonyms: ["setil alkohol", "palmityl alcohol", "1-hexadecanol"],
    cas: "36653-82-4",
    category: "excipient",
    cosmetic_function: "Emollient, Emulsifier stabilizer, Opacifying agent",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "Subchronic oral toxicity study",
    source: "CIR 1988 & ECHA REACH",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 10.0,
    regulatory_limit: "Tidak dibatasi (GRAS)",
    special_warnings: "Bahan basis lemak jenuh yang aman dan tidak mengiritasi."
  },
  stearyl_alcohol: {
    inci_name: "Stearyl Alcohol",
    synonyms: ["stearil alkohol", "1-octadecanol"],
    cas: "112-92-5",
    category: "excipient",
    cosmetic_function: "Emollient, Viscosity controller",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "Subchronic oral toxicity",
    source: "CIR 1988 & ECHA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 10.0,
    regulatory_limit: "Tidak dibatasi (GRAS)",
    special_warnings: "Meningkatkan konsistensi sediaan krim."
  },
  caprylic_capric_triglyceride: {
    inci_name: "Caprylic/Capric Triglyceride",
    synonyms: ["cct", "minyak kelapa fraksinasi", "trigliserida kaprilat"],
    cas: "73398-61-5",
    category: "excipient",
    cosmetic_function: "Emollient, Solvent, Spreading agent",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 5000.0,
    study_type: "Oral chronic food-grade safety study",
    source: "CIR 2017 & EFSA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 5.0,
    regulatory_limit: "Tidak dibatasi (GRAS)",
    special_warnings: "Emolen ringan non-komedogenik."
  },
  squalane: {
    inci_name: "Squalane",
    synonyms: ["skualan", "plant squalane", "olive squalane"],
    cas: "111-01-3",
    category: "excipient",
    cosmetic_function: "Emollient, Biomimetic lipid, Barrier support",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 2000.0,
    study_type: "Oral subchronic toxicity study",
    source: "CIR 2019",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 5.0,
    regulatory_limit: "Tidak dibatasi (Umumnya 1.0% - 10.0%)",
    special_warnings: "Biokompatibel menyerupai sebum alami manusia."
  },
  dimethicone: {
    inci_name: "Dimethicone",
    synonyms: ["polidimetilsiloksan", "silicone oil", "pdms"],
    cas: "9006-65-9",
    category: "excipient",
    cosmetic_function: "Skin protectant, Emollient, Slip agent",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "Chronic oral toxicity study",
    source: "CIR 2003 & ECHA",
    oral_absorption_percent: 1.0,
    dermal_absorption_percent: 0.1,
    regulatory_limit: "Tidak dibatasi (Umumnya 0.5% - 5.0%)",
    special_warnings: "Penetrasi dermal mendekati 0%, membentuk lapisan pelindung non-oklusif."
  },

  // ==================== 6. SURFAKTAN & EMULSIFIER ====================
  sodium_lauryl_sulfate: {
    inci_name: "Sodium Lauryl Sulfate",
    synonyms: ["sls", "natrium lauril sulfat"],
    cas: "151-21-3",
    category: "surfactant",
    cosmetic_function: "Anionic surfactant, Cleansing, Foaming agent",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 100.0,
    study_type: "Oral subchronic rodent toxicity",
    source: "CIR 2005 & ECHA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 1.0,
    regulatory_limit: "Dianjurkan pada sediaan bilas (rinse-off) atau < 1.0% pada leave-on",
    special_warnings: "Dapat menyebabkan iritasi kulit primer pada konsentrasi tinggi jika kontak lama."
  },
  sodium_laureth_sulfate: {
    inci_name: "Sodium Laureth Sulfate",
    synonyms: ["sles", "natrium lauret sulfat"],
    cas: "68891-38-3",
    category: "surfactant",
    cosmetic_function: "Anionic surfactant, Mild cleanser",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 225.0,
    study_type: "Oral subchronic study",
    source: "CIR 2010 & ECHA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 1.0,
    regulatory_limit: "Dianjurkan untuk sediaan bilas (shampoo/shower gel)",
    special_warnings: "Periksa batas cemaran 1,4-Dioxane (< 10 ppm per standar BPOM/SCCS)."
  },
  cocamidopropyl_betaine: {
    inci_name: "Cocamidopropyl Betaine",
    synonyms: ["capb", "kokamidopropil betain"],
    cas: "61789-40-0",
    category: "surfactant",
    cosmetic_function: "Amphoteric surfactant, Foam booster, Mild cleanser",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 247.0,
    study_type: "Subchronic oral toxicity study",
    source: "CIR 2012",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 1.0,
    regulatory_limit: "Tidak dibatasi secara kuantitatif pada sediaan bilas",
    special_warnings: "Cemaran 3-dimethylaminopropylamine (DMAPA) harus < 0.01% untuk mencegah sensitisasi."
  },
  coco_glucoside: {
    inci_name: "Coco-Glucoside",
    synonyms: ["koko glukosida", "alkyl polyglucoside", "apg"],
    cas: "141464-42-8",
    category: "surfactant",
    cosmetic_function: "Non-ionic mild surfactant (Berasal dari Tumbuhan)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "Oral subchronic study",
    source: "CIR 2013 & ECHA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 1.0,
    regulatory_limit: "Tidak dibatasi (Sangat biodegradable dan ramah lingkungan)",
    special_warnings: "Sangat lembut untuk produk bayi dan pembersih kulit sensitif."
  },

  // ==================== 7. ANTIOKSIDAN, PENGATUR pH & PENSTABIL ====================
  tocopherol: {
    inci_name: "Tocopherol",
    synonyms: ["vitamin e", "tokoferol", "dl-alpha-tocopherol"],
    cas: "10191-41-0",
    category: "antioxidant",
    cosmetic_function: "Antioxidant, Skin conditioning",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 500.0,
    study_type: "90-day oral rat study",
    source: "CIR 2002 / EFSA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 30.0,
    regulatory_limit: "Tidak dibatasi (Umumnya 0.1% - 1.0% sebagai antioksidan)",
    special_warnings: "Antioksidan penstabil fase lipid dan pencegah ketengikan formula."
  },
  tocopheryl_acetate: {
    inci_name: "Tocopheryl Acetate",
    synonyms: ["vitamin e acetate", "tokoferil asetat"],
    cas: "7695-91-2",
    category: "antioxidant",
    cosmetic_function: "Antioxidant, Skin conditioning",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 500.0,
    study_type: "Oral safety monograph CIR",
    source: "CIR 2002 & EFSA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 20.0,
    regulatory_limit: "Tidak dibatasi (Umumnya 0.5% - 2.0%)",
    special_warnings: "Bentuk ester vitamin E yang lebih tahan terhadap oksidasi udara."
  },
  disodium_edta: {
    inci_name: "Disodium EDTA",
    synonyms: ["dinatrium edta", "edta-2na", "chelating agent"],
    cas: "139-33-3",
    category: "excipient",
    cosmetic_function: "Chelating agent (Pengkhelat Logam Berat)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 500.0,
    study_type: "Subchronic oral toxicity study",
    source: "CIR 2002 / ECHA",
    oral_absorption_percent: 5.0,
    dermal_absorption_percent: 0.1,
    regulatory_limit: "Tidak dibatasi (Umumnya digunakan 0.05% - 0.2%)",
    special_warnings: "Mengikat ion logam untuk mencegah degradasi oksidatif dan menjaga kejernihan sediaan."
  },
  citric_acid: {
    inci_name: "Citric Acid",
    synonyms: ["asam sitrat", "citric acid", "pengatur ph"],
    cas: "77-92-9",
    category: "excipient",
    cosmetic_function: "pH adjuster, Buffer, Chelator",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1200.0,
    study_type: "Subchronic oral study & EFSA GRAS",
    source: "CIR 2014 / EFSA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 10.0,
    regulatory_limit: "Tidak dibatasi (Digunakan secukupnya untuk penyesuaian pH)",
    special_warnings: "Menjaga stabilitas pH fisiologis sediaan (pH 4.5 - 6.5)."
  },
  xanthan_gum: {
    inci_name: "Xanthan Gum",
    synonyms: ["gom xanthan", "xanthan gum", "pengental alami"],
    cas: "11138-66-2",
    category: "excipient",
    cosmetic_function: "Viscosity increasing agent, Emulsion stabilizer",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "Chronic oral toxicity study",
    source: "CIR 2012 & EFSA",
    oral_absorption_percent: 1.0,
    dermal_absorption_percent: 0.1,
    regulatory_limit: "Tidak dibatasi (GRAS)",
    special_warnings: "Polisakarida alami yang memberikan reologi tiksotropik yang stabil."
  },
  carbomer: {
    inci_name: "Carbomer",
    synonyms: ["karbomer", "carbopol", "polyacrylic acid"],
    cas: "9007-20-9",
    category: "excipient",
    cosmetic_function: "Gelling agent, Thickener, Suspending agent",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1500.0,
    study_type: "Oral subchronic rodent toxicity",
    source: "CIR 2011 / ECHA",
    oral_absorption_percent: 1.0,
    dermal_absorption_percent: 0.1,
    regulatory_limit: "Tidak dibatasi (Periksa residu pelarut polimerisasi)",
    special_warnings: "Bebas dari residu benzena (Gunakan Carbomer tipe homopolimer modern)."
  },

  // ==================== 8. BAHAN SOOTHING, BOTANIKAL & PEWANGI ====================
  allantoin: {
    inci_name: "Allantoin",
    synonyms: ["alantoin", "glyoxyldiureide", "5-ureidohydantoin"],
    cas: "97-59-6",
    category: "active",
    cosmetic_function: "Skin soothing, Anti-irritant, Epithelial stimulant",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 500.0,
    study_type: "Oral subchronic study CIR",
    source: "CIR 2010",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 20.0,
    regulatory_limit: "Tidak dibatasi (Umumnya 0.1% - 0.5% pada kosmetik)",
    special_warnings: "Membantu menenangkan kulit dan meredakan iritasi akibat bahan aktif lain."
  },
  centella_asiatica_extract: {
    inci_name: "Centella Asiatica Leaf Extract",
    synonyms: ["ekstrak daun pegagan", "centella extract", "cica"],
    cas: "84696-21-9",
    category: "active",
    cosmetic_function: "Skin soothing, Wound healing support, Antioxidant",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 1000.0,
    study_type: "Oral subchronic & traditional safety evaluation",
    source: "CIR 2015 & ECHA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 10.0,
    regulatory_limit: "Tidak dibatasi (Umumnya 0.5% - 5.0%)",
    special_warnings: "Mengandung madecassoside dan asiaticoside untuk meredakan kemerahan."
  },
  fragrance: {
    inci_name: "Parfum",
    synonyms: ["fragrance", "parfum", "pewangi", "aroma", "perfume"],
    cas: "N/A",
    category: "fragrance",
    cosmetic_function: "Fragrance (Pengharum Sediaan)",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 50.0,
    study_type: "IFRA Safety Standard Benchmark & Subchronic Monograph",
    source: "IFRA 51st Amendment & SCCS Allergen Opinion",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Sesuai Standar IFRA (Wajib deklarasi 26 Alergen jika > 0.001% leave-on)",
    special_warnings: "Waspadai potensi sensitisasi kontak pada kulit atopik dan bayi."
  },
  limonene: {
    inci_name: "Limonene",
    synonyms: ["d-limonene", "limonene fragrance allergen"],
    cas: "5989-27-5",
    category: "fragrance",
    cosmetic_function: "Fragrance allergen / Terpene",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 150.0,
    study_type: "Subchronic oral toxicity study",
    source: "SCCS/1459/11 & IFRA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Wajib dideklarasikan pada label jika > 0.001% (leave-on) / > 0.01% (rinse-off)",
    special_warnings: "Hasil oksidasi hidroperoksida limonene merupakan alergen kontak potensial."
  },
  linalool: {
    inci_name: "Linalool",
    synonyms: ["linalool fragrance allergen", "3,7-dimethylocta-1,6-dien-3-ol"],
    cas: "78-70-6",
    category: "fragrance",
    cosmetic_function: "Fragrance allergen / Floral aroma",
    pod_type: "NOAEL",
    pod_value_mg_kg_day: 117.0,
    study_type: "Subchronic oral study",
    source: "SCCS/1459/11 & IFRA",
    oral_absorption_percent: 100.0,
    dermal_absorption_percent: 50.0,
    regulatory_limit: "Wajib dideklarasikan pada label jika > 0.001% (leave-on) / > 0.01% (rinse-off)",
    special_warnings: "Hindari paparan udara berlebih untuk mencegah auto-oksidasi menjadi alergen sekunder."
  }
};

function lookupIngredient(query) {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  for (const [key, data] of Object.entries(INGREDIENT_DATABASE)) {
    if (q === key || q === data.inci_name.toLowerCase() || (data.cas && q === data.cas.toLowerCase())) {
      return data;
    }
    if (data.synonyms && data.synonyms.some(s => q === s.toLowerCase() || q.includes(s.toLowerCase()))) {
      return data;
    }
  }
  return null;
}

function calculateMoS({
  ingredientName,
  concentrationPercent,
  productCategory = "face_cream",
  bodyWeightKg = 60.0,
  customPoD = null,
  customDAPercent = null,
  customAbsOral = null
}) {
  const prod = SCCS_PRODUCT_DEFAULTS[productCategory] || SCCS_PRODUCT_DEFAULTS.face_cream;
  const ing = lookupIngredient(ingredientName);

  const inci = ing ? ing.inci_name : ingredientName;
  const cas = ing ? ing.cas : "N/A";
  const category = ing ? ing.category : "custom";
  const regLimit = ing ? ing.regulatory_limit : "Sesuai lampiran regulasi BPOM/SCCS";
  const warnings = ing ? ing.special_warnings : "-";

  const A = prod.daily_amount_g;
  const R = prod.retention_factor;
  const C = parseFloat(concentrationPercent) || 0.0;
  const BW = parseFloat(bodyWeightKg) || 60.0;

  const DA_p = customDAPercent !== null && customDAPercent !== undefined && customDAPercent !== ""
    ? parseFloat(customDAPercent)
    : (ing && ing.dermal_absorption_percent ? ing.dermal_absorption_percent : 50.0);

  // SED = (A * 1000 * (C/100) * (DA_p/100) * R) / BW
  const sed = (A * 1000.0 * (C / 100.0) * (DA_p / 100.0) * R) / BW;

  const podOral = customPoD !== null && customPoD !== undefined && customPoD !== ""
    ? parseFloat(customPoD)
    : (ing && ing.pod_value_mg_kg_day ? ing.pod_value_mg_kg_day : 100.0);

  const absOral = customAbsOral !== null && customAbsOral !== undefined && customAbsOral !== ""
    ? parseFloat(customAbsOral)
    : (ing && ing.oral_absorption_percent ? ing.oral_absorption_percent : 50.0);

  const podSys = absOral >= 50.0 ? podOral : podOral * (absOral / 100.0);
  const mos = sed > 0 ? podSys / sed : 999999.0;
  const isSafe = mos >= 100.0;

  return {
    ingredientQuery: ingredientName,
    inciName: inci,
    casNumber: cas,
    categoryTag: category,
    concentrationPercent: C,
    productCategory: productCategory,
    productCategoryName: prod.name_id,
    applicationMode: R >= 0.5 ? "Leave-on" : "Rinse-off",
    retentionFactor: R,
    dailyAppliedAmountG: A,
    bodyWeightKg: BW,
    dermalAbsorptionPercent: DA_p,
    sedMgKgDay: parseFloat(sed.toFixed(6)),
    noaelOralMgKgDay: parseFloat(podOral.toFixed(2)),
    oralAbsorptionPercent: absOral,
    podSysMgKgDay: parseFloat(podSys.toFixed(2)),
    mos: parseFloat(mos.toFixed(1)),
    isSafe: isSafe,
    safetyStatus: isSafe ? "AMAN" : "TIDAK AMAN",
    regulatoryLimit: regLimit,
    toxicologySource: ing ? ing.source : "Custom / Fallback",
    specialWarnings: warnings
  };
}

function evaluateFullFormula(formulaList, productCategory = "face_cream", bodyWeightKg = 60.0) {
  const evaluated = [];
  let allSafe = true;
  let hazardIndex = 0.0;
  let totalConcentration = 0.0;

  for (const item of formulaList) {
    const conc = parseFloat(item.concentration || item.concentration_percent || item.conc || 0);
    totalConcentration += conc;

    const res = calculateMoS({
      ingredientName: item.name || item.inci_name,
      concentrationPercent: conc,
      productCategory: productCategory,
      bodyWeightKg: bodyWeightKg,
      customPoD: item.noael || item.pod_value,
      customDAPercent: item.dermal_absorption || item.da_percent,
      customAbsOral: item.abs_oral
    });

    if (!res.isSafe) allSafe = false;
    if (res.mos > 0) {
      hazardIndex += (1.0 / res.mos) * 100.0;
    }
    evaluated.push(res);
  }

  const prod = SCCS_PRODUCT_DEFAULTS[productCategory] || SCCS_PRODUCT_DEFAULTS.face_cream;

  return {
    productCategory,
    productCategoryName: prod.name_id,
    targetBodyWeightKg: bodyWeightKg,
    totalActiveConcentration: parseFloat(totalConcentration.toFixed(3)),
    overallSafe: allSafe,
    hazardIndex: parseFloat(hazardIndex.toFixed(4)),
    ingredients: evaluated
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SCCS_PRODUCT_DEFAULTS,
    INGREDIENT_DATABASE,
    lookupIngredient,
    calculateMoS,
    evaluateFullFormula
  };
}
