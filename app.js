/**
 * COSMETIC MOS SAFETY ASSESSOR - INTERACTIVE APPLICATION CONTROLLER (app.js)
 * v2.4 Pro Edition
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Preset Formula Library
  const PRESETS = {
    brightening_cream: {
      name: "Krim Pencerah Wajah (Face Cream)",
      category: "face_cream",
      bw: "60",
      ingredients: [
        { name: "Niacinamide", conc: 4.0, noael: 215.0 },
        { name: "Phenoxyethanol", conc: 0.8, noael: 357.0 },
        { name: "Alpha-Arbutin", conc: 2.0, noael: 150.0 },
        { name: "Salicylic Acid", conc: 1.5, noael: 250.0 },
        { name: "Tocopherol", conc: 0.5, noael: 500.0 },
        { name: "Glycerin", conc: 5.0, noael: 2000.0 }
      ]
    },
    sunscreen_spf50: {
      name: "Tabir Surya SPF 50 (Sunscreen Lotion)",
      category: "sunscreen_lotion",
      bw: "60",
      ingredients: [
        { name: "Ethylhexyl Methoxycinnamate", conc: 7.5, noael: 450.0 },
        { name: "Titanium Dioxide", conc: 5.0, noael: 1000.0 },
        { name: "Avobenzone", conc: 3.0, noael: 450.0 },
        { name: "Tocopherol", conc: 0.5, noael: 500.0 },
        { name: "Phenoxyethanol", conc: 0.8, noael: 357.0 },
        { name: "Glycerin", conc: 4.0, noael: 2000.0 }
      ]
    },
    antiaging_retinol: {
      name: "Serum Anti-Aging Retinol (Leave-on)",
      category: "face_cream",
      bw: "60",
      ingredients: [
        { name: "Retinol", conc: 0.2, noael: 1.0 },
        { name: "Tocopherol", conc: 0.5, noael: 500.0 },
        { name: "Sodium Hyaluronate", conc: 0.5, noael: 1500.0 },
        { name: "Phenoxyethanol", conc: 0.6, noael: 357.0 },
        { name: "Glycerin", conc: 5.0, noael: 2000.0 }
      ]
    },
    acne_clarifying: {
      name: "Gel Anti-Jerawat Asam Salisilat 2.0%",
      category: "face_cream",
      bw: "60",
      ingredients: [
        { name: "Salicylic Acid", conc: 2.0, noael: 250.0 },
        { name: "Niacinamide", conc: 2.0, noael: 215.0 },
        { name: "Allantoin", conc: 0.3, noael: 500.0 },
        { name: "Glycerin", conc: 3.0, noael: 2000.0 },
        { name: "Phenoxyethanol", conc: 0.5, noael: 357.0 }
      ]
    },
    daily_body_lotion: {
      name: "Losion Pelembab Tubuh (Body Lotion)",
      category: "body_lotion",
      bw: "60",
      ingredients: [
        { name: "Glycerin", conc: 8.0, noael: 2000.0 },
        { name: "Niacinamide", conc: 2.0, noael: 215.0 },
        { name: "Tocopherol", conc: 0.5, noael: 500.0 },
        { name: "Cetyl Alcohol", conc: 3.0, noael: 1000.0 },
        { name: "Methylparaben", conc: 0.3, noael: 250.0 },
        { name: "Phenoxyethanol", conc: 0.5, noael: 357.0 }
      ]
    },
    baby_gentle_wash: {
      name: "Sabun Mandi Bayi Lembut (Bayi 5 kg)",
      category: "shower_gel",
      bw: "5",
      ingredients: [
        { name: "Glycerin", conc: 3.0, noael: 2000.0 },
        { name: "Tocopherol", conc: 0.1, noael: 500.0 },
        { name: "Allantoin", conc: 0.2, noael: 500.0 },
        { name: "Phenoxyethanol", conc: 0.3, noael: 357.0 }
      ]
    }
  };

  // 3. DOM Elements
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const navTabs = document.querySelectorAll(".nav-tab");
  const tabContents = document.querySelectorAll(".tab-content");
  
  // Tab 1 Elements
  const presetSelect = document.getElementById("presetSelect");
  const productCategorySelect = document.getElementById("productCategory");
  const targetPopulationSelect = document.getElementById("targetPopulation");
  const ingredientsTbody = document.getElementById("ingredientsTbody");
  const addIngBtn = document.getElementById("addIngBtn");
  const runMoSBtn = document.getElementById("runMoSBtn");
  const resetBtn = document.getElementById("resetBtn");
  const resultsTbody = document.getElementById("resultsTbody");
  const remarksList = document.getElementById("remarksList");

  // Summary Metrics
  const dispA = document.getElementById("dispA");
  const dispR = document.getElementById("dispR");
  const dispSSA = document.getElementById("dispSSA");
  const dispBW = document.getElementById("dispBW");
  const dispTotalConc = document.getElementById("dispTotalConc");
  const concProgressFill = document.getElementById("concProgressFill");
  
  const overallStatusCard = document.getElementById("overallStatusCard");
  const overallStatusTitle = document.getElementById("overallStatusTitle");
  const overallStatusDesc = document.getElementById("overallStatusDesc");
  const statusIcon = document.getElementById("statusIcon");
  const dispHI = document.getElementById("dispHI");
  const hiBadge = document.getElementById("hiBadge");
  const dispMinMoS = document.getElementById("dispMinMoS");
  const dispMinMoSIng = document.getElementById("dispMinMoSIng");
  const minMosBadge = document.getElementById("minMosBadge");

  // Tab 2 Visualizer Elements
  const mosBarChart = document.getElementById("mosBarChart");
  const gaugeHIVal = document.getElementById("gaugeHIVal");
  const riskDistList = document.getElementById("riskDistList");

  // Tab 3 CPSR Dossier Elements
  const openCpsrTabBtn = document.getElementById("openCpsrTabBtn");
  const printDossierBtn = document.getElementById("printDossierBtn");
  const dossierProdName = document.getElementById("dossierProdName");
  const dossierTargetBW = document.getElementById("dossierTargetBW");
  const dossierDailyA = document.getElementById("dossierDailyA");
  const dossierRetention = document.getElementById("dossierRetention");
  const dossierStampStatus = document.getElementById("dossierStampStatus");
  const dossierTbody = document.getElementById("dossierTbody");
  const dossierConclusionBox = document.getElementById("dossierConclusionBox");

  // Tab 4 Database Elements
  const dbSearchInput = document.getElementById("dbSearchInput");
  const dbFilterChips = document.querySelectorAll(".filter-chip");
  const dbTbody = document.getElementById("dbTbody");

  // Export Tools
  const exportCsvBtn = document.getElementById("exportCsvBtn");

  // Current Evaluation State
  let currentEvaluationData = null;

  // 4. Tab Switching Logic
  navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTabId = tab.getAttribute("data-tab");
      switchTab(targetTabId);
    });
  });

  function switchTab(tabId) {
    navTabs.forEach(t => t.classList.toggle("active", t.getAttribute("data-tab") === tabId));
    tabContents.forEach(c => c.classList.toggle("active", c.id === tabId));
    
    if (tabId === "tab-visualizer") {
      renderVisualizer();
    } else if (tabId === "tab-cpsr") {
      renderCpsrDossier();
    } else if (tabId === "tab-database") {
      renderDatabaseTable();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  if (openCpsrTabBtn) {
    openCpsrTabBtn.addEventListener("click", () => {
      switchTab("tab-cpsr");
    });
  }

  // 5. Theme Toggle Logic
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");
    if (window.lucide) window.lucide.createIcons();
  });

  // 6. Update SCCS Parameters Display
  function updateSccsBanner() {
    const cat = productCategorySelect.value;
    const bw = parseFloat(targetPopulationSelect.value) || 60.0;
    const prod = SCCS_PRODUCT_DEFAULTS[cat] || SCCS_PRODUCT_DEFAULTS.face_cream;

    dispA.textContent = `${prod.daily_amount_g} g/hari`;
    dispR.textContent = `${prod.retention_factor} (${prod.retention_factor >= 0.5 ? "Leave-on" : "Rinse-off"})`;
    dispSSA.textContent = prod.surface_area_cm2 > 0 ? `${prod.surface_area_cm2.toLocaleString()} cm²` : "Area Khusus";
    dispBW.textContent = `${bw.toFixed(1)} kg`;
  }

  productCategorySelect.addEventListener("change", () => {
    updateSccsBanner();
    calculateAndRender();
  });

  targetPopulationSelect.addEventListener("change", () => {
    updateSccsBanner();
    calculateAndRender();
  });

  // 7. Quick Add Chip Buttons
  document.querySelectorAll(".chip-btn").forEach(chip => {
    chip.addEventListener("click", () => {
      const ingName = chip.getAttribute("data-add");
      const match = lookupIngredient(ingName);
      
      let defaultConc = 1.0;
      if (ingName === "Phenoxyethanol") defaultConc = 0.8;
      else if (ingName === "Niacinamide") defaultConc = 4.0;
      else if (ingName === "Salicylic Acid") defaultConc = 1.5;
      else if (ingName === "Alpha-Arbutin") defaultConc = 2.0;
      else if (ingName === "Retinol") defaultConc = 0.2;
      else if (ingName === "Titanium Dioxide") defaultConc = 5.0;
      else if (ingName === "Zinc Oxide") defaultConc = 5.0;
      else if (ingName === "Ascorbic Acid") defaultConc = 5.0;
      else if (ingName === "Sodium Hyaluronate") defaultConc = 0.5;
      else if (ingName === "Parfum") defaultConc = 0.3;

      const newRow = createBuilderRow({
        name: match ? match.inci_name : ingName,
        conc: defaultConc,
        noael: match ? match.pod_value_mg_kg_day : ""
      });
      ingredientsTbody.appendChild(newRow);
      calculateAndRender();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // 8. Create Builder Table Row
  function createBuilderRow(item = { name: "", conc: "", noael: "" }) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <input type="text" class="table-input ing-name-input" placeholder="Ketik nama bahan (INCI/ID)" value="${item.name}">
      </td>
      <td>
        <input type="number" step="0.01" min="0.001" max="100" class="table-input ing-conc-input" placeholder="%" value="${item.conc}">
      </td>
      <td>
        <input type="number" step="0.1" min="0.001" class="table-input ing-noael-input" placeholder="Otomatis / Isi" value="${item.noael || ''}">
      </td>
      <td style="text-align: center;">
        <button type="button" class="btn-icon-danger del-row-btn" title="Hapus baris">
          <i data-lucide="trash-2"></i>
        </button>
      </td>
    `;

    const nameInput = tr.querySelector(".ing-name-input");
    const noaelInput = tr.querySelector(".ing-noael-input");
    const delBtn = tr.querySelector(".del-row-btn");

    nameInput.addEventListener("input", (e) => {
      const match = lookupIngredient(e.target.value);
      if (match && match.pod_value_mg_kg_day && !noaelInput.value) {
        noaelInput.value = match.pod_value_mg_kg_day;
      }
    });

    delBtn.addEventListener("click", () => {
      tr.remove();
      calculateAndRender();
      if (window.lucide) window.lucide.createIcons();
    });

    tr.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", () => {
        calculateAndRender();
      });
    });

    return tr;
  }

  // 9. Load Formula Preset
  function loadPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) return;

    productCategorySelect.value = preset.category;
    targetPopulationSelect.value = preset.bw;
    ingredientsTbody.innerHTML = "";

    preset.ingredients.forEach(item => {
      const row = createBuilderRow(item);
      ingredientsTbody.appendChild(row);
    });

    updateSccsBanner();
    calculateAndRender();
    if (window.lucide) window.lucide.createIcons();
  }

  presetSelect.addEventListener("change", (e) => {
    if (e.target.value !== "custom") {
      loadPreset(e.target.value);
    }
  });

  addIngBtn.addEventListener("click", () => {
    const newRow = createBuilderRow({ name: "", conc: "", noael: "" });
    ingredientsTbody.appendChild(newRow);
    if (window.lucide) window.lucide.createIcons();
  });

  resetBtn.addEventListener("click", () => {
    ingredientsTbody.innerHTML = "";
    ingredientsTbody.appendChild(createBuilderRow({ name: "Niacinamide", conc: 2.0, noael: 215.0 }));
    presetSelect.value = "custom";
    calculateAndRender();
    if (window.lucide) window.lucide.createIcons();
  });

  runMoSBtn.addEventListener("click", () => {
    calculateAndRender();
    document.querySelector(".table-card").scrollIntoView({ behavior: "smooth" });
  });

  // 10. Extract Form Data
  function getFormData() {
    const rows = ingredientsTbody.querySelectorAll("tr");
    const items = [];

    rows.forEach(r => {
      const name = r.querySelector(".ing-name-input").value.trim();
      const conc = parseFloat(r.querySelector(".ing-conc-input").value);
      const noaelVal = r.querySelector(".ing-noael-input").value.trim();
      const noael = noaelVal ? parseFloat(noaelVal) : null;

      if (name && !isNaN(conc) && conc > 0) {
        items.push({
          name: name,
          concentration: conc,
          noael: noael
        });
      }
    });

    return items;
  }

  // 11. Core Calculate & Render Routine
  function calculateAndRender() {
    const formulaItems = getFormData();
    const category = productCategorySelect.value;
    const bw = parseFloat(targetPopulationSelect.value) || 60.0;

    const evaluation = evaluateFullFormula(formulaItems, category, bw);
    currentEvaluationData = evaluation;

    // Update Concentration Meter Bar
    const totalConc = evaluation.totalActiveConcentration;
    dispTotalConc.textContent = `${totalConc.toFixed(2)}%`;
    concProgressFill.style.width = `${Math.min(totalConc, 100)}%`;
    if (totalConc > 100) {
      concProgressFill.style.background = "#ef4444";
      dispTotalConc.style.color = "#ef4444";
    } else {
      concProgressFill.style.background = "linear-gradient(90deg, #10b981, #06b6d4)";
      dispTotalConc.style.color = "var(--accent-cyan)";
    }

    // Render Table Rows
    resultsTbody.innerHTML = "";
    remarksList.innerHTML = "";

    if (evaluation.ingredients.length === 0) {
      resultsTbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
            Silakan tambahkan bahan baku formula untuk melihat kalkulasi Margin of Safety (MoS).
          </td>
        </tr>
      `;
      overallStatusCard.className = "card status-hero-card";
      overallStatusTitle.textContent = "MENUNGGU FORMULA";
      overallStatusDesc.textContent = "Tambahkan bahan baku di panel kiri untuk memulai evaluasi.";
      dispHI.textContent = "0.0000";
      dispMinMoS.textContent = "-";
      dispMinMoSIng.textContent = "-";
      return;
    }

    let minMoS = 99999999;
    let minMoSIngName = "";

    evaluation.ingredients.forEach(item => {
      if (item.mos < minMoS) {
        minMoS = item.mos;
        minMoSIngName = `${item.inciName} (${item.concentrationPercent}%)`;
      }

      const tr = document.createElement("tr");
      const statusBadge = item.isSafe
        ? `<span class="badge-status badge-safe"><i data-lucide="check"></i> AMAN</span>`
        : `<span class="badge-status badge-danger"><i data-lucide="alert-triangle"></i> TIDAK AMAN</span>`;

      tr.innerHTML = `
        <td>
          <strong style="color: var(--text-primary);">${item.inciName}</strong>
          ${item.casNumber !== "N/A" ? `<br><small style="color: var(--text-muted); font-size: 0.68rem;">CAS: ${item.casNumber}</small>` : ""}
        </td>
        <td class="font-mono">${item.concentrationPercent.toFixed(2)} %</td>
        <td>${item.productCategoryName.split(" (")[0]}</td>
        <td><span style="font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; background: var(--bg-primary);">${item.applicationMode}</span></td>
        <td class="font-mono" style="color: var(--accent-teal);">${item.sedMgKgDay.toFixed(6)}</td>
        <td class="font-mono">${item.noaelOralMgKgDay.toFixed(1)}</td>
        <td class="font-mono">${item.podSysMgKgDay.toFixed(1)}</td>
        <td class="font-mono" style="font-weight: 800; font-size: 0.88rem; color: ${item.isSafe ? 'var(--accent-emerald)' : '#ef4444'};">
          ${item.mos >= 10000 ? item.mos.toLocaleString() : item.mos.toFixed(1)}
        </td>
        <td>${statusBadge}</td>
      `;
      resultsTbody.appendChild(tr);

      // Render Remarks Cards
      const remarkCard = document.createElement("div");
      remarkCard.className = `remark-card ${item.isSafe ? '' : 'danger'}`;
      remarkCard.innerHTML = `
        <div class="remark-head">
          <span>${item.inciName} (${item.concentrationPercent}%) • MoS: ${item.mos >= 10000 ? item.mos.toLocaleString() : item.mos.toFixed(1)}</span>
          <span style="font-size: 0.68rem; color: var(--text-muted);">${item.toxicologySource}</span>
        </div>
        <div class="remark-reg">Batas Regulasi BPOM/SCCS: ${item.regulatoryLimit}</div>
        <div class="remark-desc">${item.specialWarnings}</div>
      `;
      remarksList.appendChild(remarkCard);
    });

    // Update Summary Header Cards
    dispHI.textContent = evaluation.hazardIndex.toFixed(4);
    if (evaluation.hazardIndex <= 1.0) {
      hiBadge.textContent = "HI ≤ 1.0 (Aman)";
      hiBadge.className = "metric-pill badge-safe";
    } else {
      hiBadge.textContent = "HI > 1.0 (Waspada)";
      hiBadge.className = "metric-pill badge-danger";
    }

    dispMinMoS.textContent = minMoS >= 10000 ? minMoS.toLocaleString() : minMoS.toFixed(1);
    dispMinMoSIng.textContent = minMoSIngName;
    if (minMoS >= 100) {
      minMosBadge.textContent = "MoS ≥ 100";
      minMosBadge.className = "metric-pill badge-safe";
    } else {
      minMosBadge.textContent = "MoS < 100";
      minMosBadge.className = "metric-pill badge-danger";
    }

    if (evaluation.overallSafe) {
      overallStatusCard.className = "card status-hero-card safe";
      overallStatusTitle.textContent = "FORMULA AMAN";
      overallStatusDesc.textContent = "Seluruh bahan baku memiliki MoS ≥ 100 sesuai standar SCCS/ECHA/BPOM.";
      statusIcon.setAttribute("data-lucide", "shield-check");
    } else {
      overallStatusCard.className = "card status-hero-card danger";
      overallStatusTitle.textContent = "PERLU REFORMULASI";
      overallStatusDesc.textContent = "Terdapat bahan dengan MoS < 100 atau melebihi batas regulasi.";
      statusIcon.setAttribute("data-lucide", "shield-alert");
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // 12. Render Visualizer Charts (Tab 2)
  function renderVisualizer() {
    if (!currentEvaluationData || !currentEvaluationData.ingredients.length) {
      mosBarChart.innerHTML = `<p class="text-muted" style="text-align: center; padding: 2rem;">Belum ada data formula untuk ditampilkan.</p>`;
      return;
    }

    mosBarChart.innerHTML = "";
    riskDistList.innerHTML = "";

    gaugeHIVal.textContent = currentEvaluationData.hazardIndex.toFixed(4);

    currentEvaluationData.ingredients.forEach(item => {
      // Horizontal Log-Scaled Bar
      const logMoS = Math.log10(Math.max(item.mos, 1));
      const maxLog = Math.log10(10000); // 4.0
      const widthPercent = Math.min(Math.max((logMoS / maxLog) * 100, 5), 100);

      const barRow = document.createElement("div");
      barRow.className = "chart-bar-row";
      barRow.innerHTML = `
        <div class="chart-bar-meta">
          <span><strong>${item.inciName}</strong> (${item.concentrationPercent}%)</span>
          <span class="font-mono" style="color: ${item.isSafe ? 'var(--accent-emerald)' : '#ef4444'}; font-weight: 700;">
            MoS: ${item.mos >= 10000 ? item.mos.toLocaleString() : item.mos.toFixed(1)} ${item.isSafe ? '✓' : '⚠️'}
          </span>
        </div>
        <div class="chart-track">
          <div class="chart-bar-fill ${item.isSafe ? 'safe' : 'danger'}" style="width: ${widthPercent}%;"></div>
        </div>
      `;
      mosBarChart.appendChild(barRow);

      // Risk Distribution List
      const riskFraction = item.mos > 0 ? ((1.0 / item.mos) * 100) : 0;
      const riskItem = document.createElement("div");
      riskItem.className = "remark-card";
      riskItem.innerHTML = `
        <div class="remark-head">
          <span>${item.inciName}</span>
          <span class="font-mono" style="color: var(--accent-cyan);">Fraksi HI: ${riskFraction.toFixed(4)}</span>
        </div>
        <div class="remark-desc">SED: ${item.sedMgKgDay.toFixed(6)} mg/kg/d • PoD_sys: ${item.podSysMgKgDay.toFixed(1)} mg/kg/d</div>
      `;
      riskDistList.appendChild(riskItem);
    });
  }

  // 13. Render Official CPSR Part B Dossier (Tab 3)
  function renderCpsrDossier() {
    if (!currentEvaluationData || !currentEvaluationData.ingredients.length) return;

    dossierProdName.textContent = currentEvaluationData.productCategoryName;
    dossierTargetBW.textContent = `${currentEvaluationData.targetBodyWeightKg} kg`;
    
    const prod = SCCS_PRODUCT_DEFAULTS[currentEvaluationData.productCategory] || SCCS_PRODUCT_DEFAULTS.face_cream;
    dossierDailyA.textContent = `${prod.daily_amount_g} g/hari`;
    dossierRetention.textContent = `${prod.retention_factor}`;

    if (currentEvaluationData.overallSafe) {
      dossierStampStatus.textContent = "MEMENUHI SYARAT (AMAN)";
      dossierStampStatus.style.color = "#059669";
      dossierConclusionBox.innerHTML = `
        <p>Berdasarkan seluruh perhitungan paparan sistemik (<strong>SED</strong>) dan evaluasi data toksikologi baku (<strong>SCCS / CIR / ECHA</strong>), sediaan kosmetik ini disimpulkan: 
        <br><strong>MEMENUHI SYARAT KEAMANAN KOSMETIKA (SAFE FOR HUMAN HEALTH)</strong> untuk diedarkan dan digunakan oleh konsumen sesuai petunjuk penggunaan normal.</p>
      `;
    } else {
      dossierStampStatus.textContent = "PERLU REFORMULASI (TIDAK AMAN)";
      dossierStampStatus.style.color = "#dc2626";
      dossierConclusionBox.innerHTML = `
        <p style="color: #b91c1c;"><strong>PERINGATAN PENILAI KEAMANAN:</strong> Formula mengandung bahan dengan Margin of Safety ($MoS$) &lt; 100 atau melebihi konsentrasi batas maksimum regulasi BPOM RI / EU Annex. Sediaan <strong>TIDAK LAYAK DIEDARKAN</strong> sebelum dilakukan penyesuaian konsentrasi (Reformulasi).</p>
      `;
    }

    dossierTbody.innerHTML = "";
    currentEvaluationData.ingredients.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${item.inciName}</strong></td>
        <td>${item.concentrationPercent.toFixed(2)} %</td>
        <td>${item.sedMgKgDay.toFixed(6)}</td>
        <td>${item.noaelOralMgKgDay.toFixed(1)}</td>
        <td>${item.podSysMgKgDay.toFixed(1)}</td>
        <td><strong>${item.mos >= 10000 ? item.mos.toLocaleString() : item.mos.toFixed(1)}</strong></td>
        <td style="color: ${item.isSafe ? '#059669' : '#dc2626'}; font-weight: 700;">${item.safetyStatus}</td>
      `;
      dossierTbody.appendChild(tr);
    });
  }

  printDossierBtn.addEventListener("click", () => {
    window.print();
  });

  // 14. Render Database Explorer Table (Tab 4)
  function renderDatabaseTable(query = "", categoryFilter = "all") {
    dbTbody.innerHTML = "";
    const q = query.trim().toLowerCase();

    for (const [key, item] of Object.entries(INGREDIENT_DATABASE)) {
      if (categoryFilter !== "all" && item.category !== categoryFilter) {
        continue;
      }

      const inci = item.inci_name || item.inciName || key;
      const matchName = inci.toLowerCase().includes(q) || (item.cas && item.cas.toLowerCase().includes(q));
      const matchSyn = item.synonyms && item.synonyms.some(s => s.toLowerCase().includes(q));

      if (q && !matchName && !matchSyn) {
        continue;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <strong style="color: var(--text-primary);">${inci}</strong>
          ${item.synonyms ? `<br><small style="color: var(--text-muted); font-size: 0.7rem;">Sinonim: ${item.synonyms.slice(0, 3).join(", ")}</small>` : ""}
        </td>
        <td class="font-mono">${item.cas || "-"}</td>
        <td><span style="font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; background: var(--bg-primary);">${item.cosmetic_function || "-"}</span></td>
        <td class="font-mono" style="font-weight: 700; color: var(--accent-emerald);">${item.pod_value_mg_kg_day || item.noael || "-"}</td>
        <td class="font-mono">${item.dermal_absorption_percent || 50}%</td>
        <td style="font-size: 0.75rem; color: var(--accent-teal);">${item.regulatory_limit || "Sesuai regulasi"}</td>
        <td style="font-size: 0.72rem; color: var(--text-secondary);">${item.source || "-"}</td>
      `;
      dbTbody.appendChild(tr);
    }
  }

  dbSearchInput.addEventListener("input", (e) => {
    const activeChip = document.querySelector(".filter-chip.active");
    const cat = activeChip ? activeChip.getAttribute("data-filter") : "all";
    renderDatabaseTable(e.target.value, cat);
  });

  dbFilterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      dbFilterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.getAttribute("data-filter");
      renderDatabaseTable(dbSearchInput.value, cat);
    });
  });

  // 15. Export CSV Logic
  exportCsvBtn.addEventListener("click", () => {
    if (!currentEvaluationData || !currentEvaluationData.ingredients.length) {
      alert("Belum ada data evaluasi untuk diekspor.");
      return;
    }

    const headers = [
      "Nama Bahan Baku",
      "Konsentrasi (%)",
      "Jenis Produk",
      "Penggunaan",
      "SED (mg/kg/hari)",
      "NOAEL (mg/kg/hari)",
      "PoD_sys (mg/kg/hari)",
      "MoS",
      "Status Keamanan",
      "Batas Regulasi BPOM/SCCS"
    ];

    const rows = currentEvaluationData.ingredients.map(item => [
      `"${item.inciName}"`,
      item.concentrationPercent,
      `"${item.productCategoryName}"`,
      `"${item.applicationMode}"`,
      item.sedMgKgDay,
      item.noaelOralMgKgDay,
      item.podSysMgKgDay,
      item.mos,
      `"${item.safetyStatus}"`,
      `"${item.regulatoryLimit}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Margin_of_Safety_Kosmetik_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // 16. Initial Load
  loadPreset("brightening_cream");
  renderDatabaseTable();
});
