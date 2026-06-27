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

  // Required documents (indicative) — default list when a visa has no override
  var DOCS = [
    ["Passeport valide (+6 mois)", "جواز سفر ساري المفعول (+6 أشهر)"],
    ["2 photos d'identité récentes", "صورتان شمسيتان حديثتان"],
    ["Réservation vol + hôtel", "حجز الطيران والفندق"],
    ["Relevé bancaire récent", "كشف حساب بنكي حديث"]
  ];

  // --- Reusable bits ---
  var NOREFUND = [["Aucun remboursement", "لا استرجاع"]];
  var VISA_COPY_DOCS = [["Copie du visa original", "نسخة الفيزا الأصلية"]];

  // --- Per-country document & condition sets ---
  var UAE_DOCS = [
    ["Scan complet du passeport", "سكان جواز كامل"],
    ["Photo récente, fond blanc", "صورة حديثة خلفية بيضاء"],
    ["Acte de mariage (pour les couples)", "عقد زواج للزوجين"],
    ["Acte de naissance (pour les enfants)", "شهادة ميلاد للأطفال"],
    ["Billet d'avion aller-retour (source Amadeus)", "تذكرة طيران ذهاب إياب source Amadeus"],
    ["Réservation d'hôtel provisoire", "حجز فندق مؤقت"],
    ["Couverture complète du passeport (full passport cover)", "غلاف جواز كامل full passport cover"]
  ];
  var UAE_COND = [
    ["Passeport valide 6 mois au-delà de la durée du visa", "جواز صالح 6 أشهر فوق مدة الفيزا"],
    ["L'octroi du visa relève du gouvernement de Dubaï", "قرار المنح من حكومة دبي"],
    ["Aucun remboursement", "لا استرجاع"],
    ["Amende de 50 AED par jour", "غرامة 50 AED يومياً"],
    ["Date de voyage au moins 15 jours après la demande", "تاريخ السفر بعد 15 يوم من الطلب"],
    ["Billets et réservations authentiques", "تذاكر وحجوزات أصلية"]
  ];

  var JO_DOCS = [
    ["Passeport valide", "جواز سفر ساري المفعول"]
  ];
  var JO_COND = [
    ["Quitter le pays avant l'expiration du visa, sous peine d'une amende de 100 000 à 2 000 000 dinars", "يجب مغادرة البلاد قبل انتهاء الفيزا وإلا غرامة من 100,000 إلى 2,000,000 دينار"]
  ];

  var TR_EVISA_DOCS = [
    ["Scan du passeport", "سكان جواز"],
    ["Scan d'un visa Schengen / UK / Irlande / USA valide, ou d'un titre de séjour", "سكان فيزا شنغن أو UK أو إيرلاندا أو USA سارية المفعول أو تصريح إقامة"]
  ];
  var TR_EVISA_COND = [
    ["Réservé aux 35–50 ans uniquement", "للأعمار بين 35 و50 سنة فقط"],
    ["Le visa Schengen / UK / Irlande / USA doit être valide", "فيزا شنغن/UK/إيرلاندا/USA يجب أن تكون سارية المفعول"]
  ];

  var LB_DOCS = [
    ["Passeport", "جواز سفر"],
    ["Acte de naissance", "شهادة ميلاد"],
    ["2 photos d'identité", "صورتان شمسيتان"],
    ["Attestation de travail ou registre de commerce", "شهادة عمل أو سجل تجاري"],
    ["3 fiches de paie", "3 كشوف راتب"],
    ["Relevé bancaire en devise étrangère", "كشف بنكي بالعملة الأجنبية"],
    ["Réservation d'hôtel et billet d'avion", "حجز فندق وتذكرة طيران"]
  ];
  var LB_COND = [
    ["Le dossier doit être envoyé à l'agence", "يجب إرسال الملف للوكالة"],
    ["La durée de séjour ne doit pas dépasser la durée du visa", "مدة الإقامة لا تتجاوز مدة الفيزا"]
  ];

  var AZ_DOCS = [["Scan du passeport", "سكان جواز"], ["Réservation d'hôtel", "حجز فندق"]];
  var AZ_COND_REFUS = [["Aucun remboursement en cas de refus", "لا استرجاع في حالة الرفض"]];

  var ID_DOCS1 = [
    ["Passeport", "جواز سفر"],
    ["Photo fond blanc", "صورة خلفية بيضاء"],
    ["Billet aller-retour", "تذكرة ذهاب إياب"],
    ["Réservation d'hôtel", "حجز فندق"],
    ["Relevé bancaire +2000 $", "كشف بنكي +2000$"],
    ["Formulaire obligatoire", "استمارة إلزامية"]
  ];
  var ID_DOCS2 = [
    ["Scan du passeport JPG (valide 6 mois)", "سكان جواز JPG (صالح 6 أشهر)"],
    ["Photo prise par le photographe", "صورة مصدر المصور"],
    ["Relevé bancaire +2000 $", "كشف بنكي +2000$"]
  ];
  var ID_COND2 = [["Aucune réservation avant le visa", "لا حجز قبل الفيزا"], ["Aucun remboursement", "لا استرجاع"]];

  var QA_DOCS = [
    ["Scan du passeport", "سكان جواز"],
    ["Photo d'identité", "صورة شمسية"],
    ["Acte de naissance (moins de 18 ans)", "شهادة ميلاد للأقل من 18"],
    ["E-mail et mot de passe", "إيميل وكلمة مرور"]
  ];
  var QA_COND = [
    ["Passeport valide 6 mois", "جواز صالح 6 أشهر"],
    ["Aucun remboursement", "لا استرجاع"],
    ["Amende de 100 QAR par jour", "غرامة 100 ريال قطري يومياً"]
  ];

  var EG_DOCS = [
    ["Scan du passeport (valide 6 mois)", "سكان جواز (صالح 6 أشهر)"],
    ["Billet aller-retour confirmé", "تذكرة ذهاب إياب مؤكدة"]
  ];
  var EG_COND = [
    ["Envoyer le dossier 4 jours avant le voyage", "إرسال الملف 4 أيام قبل السفر"],
    ["Air Algérie / Turkish Airlines : 48 h avant le voyage", "للخطوط الجزائرية والتركية 48 ساعة قبل السفر"]
  ];

  var OM_DOCS = [["Scan du passeport", "سكان جواز"], ["Photo fond blanc", "صورة خلفية بيضاء"]];
  var OM_EXT_COND = [
    ["Demande 5 jours avant l'expiration du visa", "الطلب قبل 5 أيام من انتهاء الفيزا"],
    ["Prolongation uniquement pour un visa émis sur la même plateforme", "التمديد فقط للفيزا الصادرة من نفس المنصة"]
  ];

  var SA_DOCS = [
    ["Scan du passeport (valide 6 mois)", "سكان جواز (صالح 6 أشهر)"],
    ["2 photos fond blanc", "صورتان خلفية بيضاء"],
    ["Attestation de travail / registre de commerce / retraite", "شهادة عمل أو سجل تجاري أو شهادة تقاعد"],
    ["Acte de naissance", "شهادة ميلاد"],
    ["Acte de mariage", "عقد زواج"],
    ["Fiche familiale (pour les familles)", "فيشة عائلية للعائلات"],
    ["Relevé bancaire (200 000 DZD)", "كشف بنكي 200,000 دج"],
    ["Étudiants : certificat de scolarité", "للطلاب: شهادة مدرسية"],
    ["Réservation d'hôtel (agence)", "حجز فندق (الوكالة)"],
    ["Billet d'avion (agence)", "تذكرة طيران (الوكالة)"],
    ["Formulaire + assurance, moins de 50 ans (agence)", "استمارة + تأمين للأقل من 50 سنة (الوكالة)"],
    ["Rendez-vous (agence)", "موعد (الوكالة)"]
  ];
  var SA_COND = [["Aucune réservation avant le visa", "لا حجز قبل الفيزا"], ["Aucun remboursement", "لا استرجاع"]];

  var TZ_DOCS = [["Scan du passeport", "سكان جواز"], ["Photo fond blanc", "صورة خلفية بيضاء"], ["Billet d'avion", "تذكرة طيران"]];

  var BD_DOCS = [
    ["Scan du passeport (valide 6 mois)", "سكان جواز (صالح 6 أشهر)"],
    ["2 photos fond blanc", "صورتان خلفية بيضاء"],
    ["Attestation de travail ou registre de commerce", "شهادة عمل أو سجل تجاري"],
    ["Réservation d'hôtel", "حجز فندق"],
    ["Lettre d'invitation", "دعوة"],
    ["Formulaire", "استمارة"]
  ];
  var BD_COND = [["Aucune réservation avant le visa", "لا حجز قبل الفيزا"], ["Le client paie les frais de rendez-vous", "العميل يدفع رسوم الموعد"]];

  var JP_DOCS = [
    ["Passeport (2 pages vierges)", "جواز سفر (صفحتان فارغتان)"],
    ["Photo d'identité prise par le photographe", "صورة هوية مصدر المصور"],
    ["Formulaire (agence)", "استمارة (الوكالة)"],
    ["Réservation d'hôtel provisoire (agence)", "حجز فندق مؤقت (الوكالة)"],
    ["Billet d'avion (agence)", "تذكرة طيران (الوكالة)"],
    ["Rendez-vous (agence)", "موعد (الوكالة)"]
  ];
  var JP_COND = [
    ["Frais consulaires à la remise : 3 000 DZD", "دفع رسوم القنصلية يوم الاستلام 3,000 دج"],
    ["Dépôt du dossier en personne à l'ambassade", "إيداع الملف شخصياً في السفارة"]
  ];

  var VN_DOCS = [["Scan du passeport", "سكان جواز"], ["Photo récente", "صورة حديثة"], ["Billet d'avion", "تذكرة طيران"]];
  var UZ_DOCS = [["Scan du passeport", "سكان جواز"], ["Photo récente", "صورة حديثة"], ["Date de voyage", "تاريخ السفر"]];
  var ET_DOCS = [["Scan du passeport", "سكان جواز"], ["Photo fond blanc", "صورة خلفية بيضاء"], ["Date de voyage", "تاريخ السفر"]];
  var MG_DOCS = [["Scan du passeport", "سكان جواز"], ["Photo fond blanc", "صورة خلفية بيضاء"], ["Date de voyage", "تاريخ السفر"]];

  // [type_fr, type_ar, price, delai_fr, delai_ar, docs?, conditions?]
  var COUNTRIES = [
    { f: "🇪🇬", fr: "Égypte", ar: "مصر", v: [
      ["Lettre de garantie", "خطاب ضمان", "4 500", "3 jours", "3 أيام", EG_DOCS, EG_COND]
    ]},
    { f: "🇶🇦", fr: "Qatar", ar: "قطر", v: [
      ["Visa 1 mois", "فيزا 1 شهر", "9 000", "2–4 jours", "2-4 أيام", QA_DOCS, QA_COND]
    ]},
    { f: "🇯🇴", fr: "Jordanie", ar: "الأردن", v: [
      ["Visa 1 mois / 3 mois", "فيزا 1شهر/3أشهر", "1 500", "24 h", "24 ساعة", JO_DOCS, JO_COND]
    ]},
    { f: "🇦🇪", fr: "Émirats", ar: "الإمارات", v: [
      ["Dubaï 1 mois, entrée unique", "دبي 1شهر دخول واحد", "24 500", "7–10 jours", "7-10 أيام", UAE_DOCS, UAE_COND],
      ["Dubaï 2 mois, entrée unique", "دبي 2شهر دخول واحد", "41 000", "7–10 jours", "7-10 أيام", UAE_DOCS, UAE_COND],
      ["Dubaï 1 mois, entrées multiples", "دبي 1شهر دخولات متعددة", "40 000", "7–10 jours", "7-10 أيام", UAE_DOCS, UAE_COND],
      ["Dubaï 2 mois, entrées multiples", "دبي 2شهر دخولات متعددة", "60 000", "7–10 jours", "7-10 أيام", UAE_DOCS, UAE_COND],
      ["Prolongation visa 30 jours", "تمديد فيزا 30 يوم", "75 000", "7–10 jours", "7-10 أيام", VISA_COPY_DOCS, UAE_COND]
    ]},
    { f: "🇹🇷", fr: "Turquie", ar: "تركيا", v: [
      ["Visa électronique", "فيزا إلكترونية", "17 000", "24 h", "24 ساعة", TR_EVISA_DOCS, TR_EVISA_COND],
      ["Visa sticker", "فيزا ملصق", "3 000", "selon le RDV", "حسب الموعد"]
    ]},
    { f: "🇹🇭", fr: "Thaïlande", ar: "تايلاند", v: [
      ["e-Visa 1 mois", "إي-فيزا 1شهر", "18 000", "30 jours", "30 يوم"]
    ]},
    { f: "🇸🇬", fr: "Singapour", ar: "سنغافورة", v: [
      ["Visa 1 mois", "فيزا 1 شهر", "30 000", "15 jours", "15 يوم"]
    ]},
    { f: "🇮🇩", fr: "Indonésie", ar: "إندونيسيا", v: [
      ["Visa sticker 60 jours", "فيزا ملصق 60 يوم", "24 000", "12 jours", "12 يوم", ID_DOCS1, NOREFUND],
      ["e-Visa 60 jours", "إي-فيزا 60 يوم", "20 000", "15 jours", "15 يوم", ID_DOCS2, ID_COND2]
    ]},
    { f: "🇦🇿", fr: "Azerbaïdjan", ar: "أذربيجان", v: [
      ["e-Visa 30 jours", "إي-فيزا 30 يوم", "12 000", "3–5 jours", "3-5 أيام", AZ_DOCS, AZ_COND_REFUS],
      ["e-Visa 30 jours Express", "إي-فيزا 30 يوم Express", "19 000", "24 h", "24 ساعة", AZ_DOCS, NOREFUND]
    ]},
    { f: "🇴🇲", fr: "Oman", ar: "عُمان", v: [
      ["e-Visa 30 jours", "إي-فيزا 30 يوم", "21 000", "5 jours", "5 أيام", OM_DOCS, NOREFUND],
      ["e-Visa 10 jours touristique", "إي-فيزا 10 يوم سياحية", "10 000", "5 jours", "5 أيام", OM_DOCS, NOREFUND],
      ["Prolongation e-Visa 30 jours", "تمديد إي-فيزا 30 يوم", "25 000", "5 jours", "5 أيام", VISA_COPY_DOCS, OM_EXT_COND]
    ]},
    { f: "🇦🇲", fr: "Arménie", ar: "أرمينيا", v: [
      ["Visa 21 jours / 3 mois", "فيزا 21يوم/3أشهر", "5 000", "5–10 jours", "5-10 أيام"]
    ]},
    { f: "🇸🇦", fr: "Arabie Saoudite", ar: "السعودية", v: [
      ["Visa touristique 90 jours", "فيزا سياحية 90 يوم", "33 000", "selon le RDV", "حسب الموعد", SA_DOCS, SA_COND]
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
    ]},
    { f: "🇱🇧", fr: "Liban", ar: "لبنان", v: [
      ["Visa sticker", "فيزا ملصق", "20 000", "5–10 jours", "5-10 أيام", LB_DOCS, LB_COND]
    ]},
    { f: "🇹🇿", fr: "Tanzanie", ar: "تنزانيا", v: [
      ["e-Visa Zanzibar 30 jours", "إي-فيزا زنجبار 30 يوم", "14 000", "7–15 jours", "7-15 يوم", TZ_DOCS, NOREFUND]
    ]},
    { f: "🇧🇩", fr: "Bangladesh", ar: "بنغلاديش", v: [
      ["Visa d'affaires sticker 30 jours", "فيزا تجارية ملصق 30 يوم", "5 000", "15–20 jours", "15-20 يوم", BD_DOCS, BD_COND]
    ]},
    { f: "🇯🇵", fr: "Japon", ar: "اليابان", v: [
      ["Visa touristique sticker", "فيزا سياحية ملصق", "3 000", "10 jours", "10 أيام", JP_DOCS, JP_COND]
    ]},
    { f: "🇻🇳", fr: "Vietnam", ar: "فيتنام", v: [
      ["e-Visa 30 jours, entrée unique", "إي-فيزا 30 يوم دخول واحد", "10 000", "7–10 jours", "7-10 أيام", VN_DOCS, NOREFUND],
      ["e-Visa 90 jours, entrées multiples", "إي-فيزا 90 يوم متعدد", "20 000", "7–10 jours", "7-10 أيام", VN_DOCS, NOREFUND]
    ]},
    { f: "🇺🇿", fr: "Ouzbékistan", ar: "أوزبكستان", v: [
      ["e-Visa 30 jours", "إي-فيزا 30 يوم", "8 000", "3–5 jours", "3-5 أيام", UZ_DOCS, NOREFUND]
    ]},
    { f: "🇪🇹", fr: "Éthiopie", ar: "إثيوبيا", v: [
      ["e-Visa 30 jours, entrée unique", "إي-فيزا 30 يوم دخول واحد", "19 000", "5 jours", "5 أيام", ET_DOCS, NOREFUND]
    ]},
    { f: "🇲🇬", fr: "Madagascar", ar: "مدغشقر", v: [
      ["e-Visa 15 jours", "إي-فيزا 15 يوم", "10 000", "5 jours", "5 أيام", MG_DOCS, NOREFUND],
      ["e-Visa 30 jours", "إي-فيزا 30 يوم", "13 500", "5 jours", "5 أيام", MG_DOCS, NOREFUND],
      ["e-Visa 60 jours", "إي-فيزا 60 يوم", "15 000", "5 jours", "5 أيام", MG_DOCS, NOREFUND],
      ["e-Visa 90 jours", "إي-فيزا 90 يوم", "18 500", "5 jours", "5 أيام", MG_DOCS, NOREFUND]
    ]}
  ];

  // ISO codes (same order as COUNTRIES) for flagcdn.com images
  var CODES = ["eg", "qa", "jo", "ae", "tr", "th", "sg", "id", "az", "om", "am", "sa", "cn", "kr", "ru", "ca", "lb", "tz", "bd", "jp", "vn", "uz", "et", "mg"];

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
  function flag(code, dim) {
    var im = el("img", "flag");
    im.src = "https://flagcdn.com/" + dim + "/" + code + ".png";
    im.alt = "flag";
    im.loading = "lazy";
    return im;
  }

  COUNTRIES.forEach(function (c, i) {
    // --- Sidebar button ---
    var btn = el("button", "visa-country" + (i === 0 ? " is-active" : ""));
    btn.type = "button";
    btn.setAttribute("data-idx", i);
    btn.appendChild(flag(CODES[i], "24x18"));
    btn.appendChild(bil(el("span"), c.fr, c.ar));
    btn.addEventListener("click", function () { select(i); });
    sidebar.appendChild(btn);

    // --- Panel section ---
    var sec = el("div", "visa-panel__section" + (i === 0 ? " is-active" : ""));
    sec.setAttribute("data-idx", i);

    var title = el("h2", "visa-panel__title");
    title.appendChild(flag(CODES[i], "48x36"));
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
      var docs = v[5] || DOCS;            // per-visa override, else default list
      docs.forEach(function (doc) { ul.appendChild(bil(el("li"), doc[0], doc[1])); });
      body.appendChild(ul);

      // Conditions (only when provided for this visa)
      var conds = v[6];
      if (conds && conds.length) {
        var condH = el("p", "visa-docs-h");
        bil(condH, "Conditions :", "الشروط:");
        body.appendChild(condH);
        var cul = el("ul", "visa-conds");
        conds.forEach(function (cd) { cul.appendChild(bil(el("li"), cd[0], cd[1])); });
        body.appendChild(cul);
      }

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
