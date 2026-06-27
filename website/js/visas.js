/* =====================================================================
   Djen-Djen Travel — Visas page (sidebar + accordion)
   Renders the country list and per-country collapsible visa rows.
   Runs after main.js so the document language (FR/AR) is already set;
   nodes carry data-fr/data-ar so the language switch keeps working.
   ===================================================================== */
(function () {
  "use strict";

  var WA = "https://wa.me/213661417571";

  function lang() { return document.documentElement.getAttribute("lang") === "ar" ? "ar" : "fr"; }

  // Required documents (indicative) — shown for every visa
  var DOCS = [
    ["Passeport valide (+6 mois)", "جواز سفر ساري المفعول (+6 أشهر)"],
    ["2 photos d'identité récentes", "صورتان شمسيتان حديثتان"],
    ["Réservation vol + hôtel", "حجز الطيران والفندق"],
    ["Relevé bancaire récent", "كشف حساب بنكي حديث"]
  ];

  // [type_fr, type_ar, price, delai_fr, delai_ar]
  var COUNTRIES = [
    { f: "🇪🇬", fr: "Égypte", ar: "مصر", v: [
      ["Lettre de garantie", "خطاب ضمان", "4 500", "3 jours", "3 أيام"]
    ]},
    { f: "🇶🇦", fr: "Qatar", ar: "قطر", v: [
      ["Visa 1 mois", "فيزا 1 شهر", "9 000", "2 jours", "يومان"]
    ]},
    { f: "🇯🇴", fr: "Jordanie", ar: "الأردن", v: [
      ["Visa 1 mois / 3 mois", "فيزا 1شهر/3أشهر", "1 500", "24 h", "24 ساعة"]
    ]},
    { f: "🇦🇪", fr: "Émirats", ar: "الإمارات", v: [
      ["Dubaï 1 mois, entrée unique", "دبي 1شهر دخول واحد", "24 500", "7–10 jours", "7-10 أيام"],
      ["Dubaï 2 mois, entrée unique", "دبي 2شهر دخول واحد", "41 000", "7–10 jours", "7-10 أيام"],
      ["Dubaï 1 mois, entrées multiples", "دبي 1شهر دخولات متعددة", "40 000", "7–10 jours", "7-10 أيام"],
      ["Dubaï 2 mois, entrées multiples", "دبي 2شهر دخولات متعددة", "60 000", "7–10 jours", "7-10 أيام"],
      ["Prolongation visa 30 jours", "تمديد فيزا 30 يوم", "75 000", "7–10 jours", "7-10 أيام"]
    ]},
    { f: "🇹🇷", fr: "Turquie", ar: "تركيا", v: [
      ["Visa électronique", "فيزا إلكترونية", "17 000", "24 h", "24 ساعة"],
      ["Visa sticker", "فيزا ملصق", "3 000", "selon le RDV", "حسب الموعد"]
    ]},
    { f: "🇹🇭", fr: "Thaïlande", ar: "تايلاند", v: [
      ["e-Visa 1 mois", "إي-فيزا 1شهر", "18 000", "30 jours", "30 يوم"]
    ]},
    { f: "🇸🇬", fr: "Singapour", ar: "سنغافورة", v: [
      ["Visa 1 mois", "فيزا 1 شهر", "30 000", "15 jours", "15 يوم"]
    ]},
    { f: "🇮🇩", fr: "Indonésie", ar: "إندونيسيا", v: [
      ["Visa 60 jours", "فيزا 60 يوم", "24 000", "8–10 jours", "8-10 أيام"]
    ]},
    { f: "🇦🇿", fr: "Azerbaïdjan", ar: "أذربيجان", v: [
      ["e-Visa 30 jours", "إي-فيزا 30 يوم", "12 000", "5–6 jours", "5-6 أيام"]
    ]},
    { f: "🇴🇲", fr: "Oman", ar: "عُمان", v: [
      ["e-Visa 1 mois", "إي-فيزا 1 شهر", "21 000", "3–7 jours", "3-7 أيام"],
      ["e-Visa 8 jours", "إي-فيزا 8 أيام", "10 000", "10 jours", "10 أيام"]
    ]},
    { f: "🇦🇲", fr: "Arménie", ar: "أرمينيا", v: [
      ["Visa 21 jours / 3 mois", "فيزا 21يوم/3أشهر", "5 000", "5–10 jours", "5-10 أيام"]
    ]},
    { f: "🇸🇦", fr: "Arabie Saoudite", ar: "السعودية", v: [
      ["Visa touristique 90 jours", "فيزا سياحية 90 يوم", "33 000", "selon le RDV", "حسب الموعد"]
    ]},
    { f: "🇨🇳", fr: "Chine", ar: "الصين", v: [
      ["Visa sticker — 1ère demande", "فيزا ملصق - طلب أول", "13 000", "10 jours", "10 أيام"],
      ["Visa sticker — renouvellement", "فيزا ملصق - تجديد", "6 500", "10 jours", "10 أيام"]
    ]},
    { f: "🇰🇷", fr: "Corée", ar: "كوريا", v: [
      ["Visa sticker", "فيزا ملصق", "12 000", "5 jours", "5 أيام"]
    ]},
    { f: "🇷🇺", fr: "Russie", ar: "روسيا", v: [
      ["Visa 1 mois", "فيزا 1 شهر", "64 000", "15 jours", "15 يوم"]
    ]},
    { f: "🇨🇦", fr: "Canada", ar: "كندا", v: [
      ["Visa touristique", "فيزا سياحية", "50 000", "variable", "متغيرة"]
    ]}
  ];

  var sidebar = document.getElementById("visaSidebar");
  var panel = document.getElementById("visaPanel");
  if (!sidebar || !panel) return;

  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  // Bilingual text node: keeps data-fr/data-ar so the FR/AR switch updates it
  function bil(e, fr, ar) {
    e.setAttribute("data-fr", fr);
    e.setAttribute("data-ar", ar);
    e.textContent = (lang() === "ar" ? ar : fr);
    return e;
  }
  function flag(ch) { var s = el("span", "flag"); s.textContent = ch; s.setAttribute("aria-hidden", "true"); return s; }

  COUNTRIES.forEach(function (c, i) {
    // --- Sidebar button ---
    var btn = el("button", "visa-country" + (i === 0 ? " is-active" : ""));
    btn.type = "button";
    btn.setAttribute("data-idx", i);
    btn.appendChild(flag(c.f));
    btn.appendChild(bil(el("span"), c.fr, c.ar));
    btn.addEventListener("click", function () { select(i); });
    sidebar.appendChild(btn);

    // --- Panel section ---
    var sec = el("div", "visa-panel__section" + (i === 0 ? " is-active" : ""));
    sec.setAttribute("data-idx", i);

    var title = el("h2", "visa-panel__title");
    title.appendChild(flag(c.f));
    title.appendChild(bil(el("span"), c.fr, c.ar));
    sec.appendChild(title);

    c.v.forEach(function (v, j) {
      var row = el("details", "visa-row");
      if (i === 0 && j === 0) row.open = true;

      var sum = el("summary");
      sum.appendChild(bil(el("span", "visa-row__type"), v[0], v[1]));
      var price = el("span", "visa-row__price");
      price.setAttribute("data-fr", "<bdi>" + v[2] + "</bdi> DZD");
      price.setAttribute("data-ar", "<bdi>" + v[2] + "</bdi> دج");
      price.innerHTML = "<bdi>" + v[2] + "</bdi> " + (lang() === "ar" ? "دج" : "DZD");
      sum.appendChild(price);
      row.appendChild(sum);

      var body = el("div", "visa-row__body");

      var meta = el("p", "visa-row__meta");
      meta.appendChild(document.createTextNode("⏱ "));
      var lbl = el("strong"); bil(lbl, "Délai : ", "المدة: ");
      meta.appendChild(lbl);
      meta.appendChild(bil(el("span"), v[3], v[4]));
      body.appendChild(meta);

      var docsH = el("p", "visa-docs-h");
      bil(docsH, "Documents requis :", "الوثائق المطلوبة:");
      body.appendChild(docsH);

      var ul = el("ul", "visa-docs");
      DOCS.forEach(function (doc) { ul.appendChild(bil(el("li"), doc[0], doc[1])); });
      body.appendChild(ul);

      var a = el("a", "btn btn--whatsapp");
      a.href = WA; a.target = "_blank"; a.rel = "noopener";
      var ic = el("span", "wa-icon"); ic.textContent = "💬"; a.appendChild(ic);
      a.appendChild(document.createTextNode(" "));
      a.appendChild(bil(el("span"), "Demander sur WhatsApp", "اطلب عبر واتساب"));
      body.appendChild(a);

      row.appendChild(body);
      sec.appendChild(row);
    });

    panel.appendChild(sec);
  });

  function select(idx) {
    sidebar.querySelectorAll(".visa-country").forEach(function (b) {
      b.classList.toggle("is-active", +b.getAttribute("data-idx") === idx);
    });
    panel.querySelectorAll(".visa-panel__section").forEach(function (s) {
      s.classList.toggle("is-active", +s.getAttribute("data-idx") === idx);
    });
  }
})();
