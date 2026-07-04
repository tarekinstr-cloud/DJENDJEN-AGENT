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
  var AE_CANCEL_COND = [
    ["Annulation uniquement avant l'entrée dans le pays", "الإلغاء قبل دخول البلاد فقط"],
    ["Aucun remboursement après l'entrée", "لا استرجاع بعد الدخول"]
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
  var TR_STICKER_DOCS = [
    ["Passeport", "جواز سفر"],
    ["Photo biométrique 5×5 cm", "صورة بيومترية 5×5 سم"],
    ["Acte de naissance", "شهادة ميلاد"],
    ["Attestation de travail ou registre de commerce", "شهادة عمل أو سجل تجاري"],
    ["3 fiches de paie", "3 كشوف راتب"],
    ["Affiliation CNAS", "انتساب CNAS"],
    ["Relevé bancaire ou postal des 6 derniers mois", "كشف بنكي أو بريدي 6 أشهر الأخيرة"],
    ["Réservation d'hôtel (agence)", "حجز فندق (الوكالة)"],
    ["Réservation de billet (agence)", "حجز تذكرة (الوكالة)"],
    ["Formulaire (agence)", "استمارة (الوكالة)"]
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
  var QA_RES_DOCS = [["Passeport", "جواز سفر"], ["Photo fond blanc", "صورة خلفية بيضاء"]];
  var QA_RES_COND = [["Paiement de 1 650 QAR à l'agent après la visite médicale", "يتم دفع 1,650 ريال قطري للوكيل بعد اجتياز الفحص الطبي"]];

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

  var TH_DOCS = [
    ["Scan du passeport", "سكان جواز السفر"],
    ["Photo d'identité", "صورة شمسية"],
    ["Justificatif de résidence en français", "وثيقة إقامة بالفرنسية"],
    ["Billet confirmé", "تذكرة مؤكدة"],
    ["Relevé bancaire (2000 €)", "كشف حساب بنكي 2000 يورو"]
  ];
  var SG_DOCS = [
    ["Scan du passeport (imprimé)", "سكان جواز السفر (مطبوع)"],
    ["Photo d'identité (par photographe)", "صورة شمسية من مصور"],
    ["Réservation d'hôtel provisoire", "حجز فندق مؤقت"],
    ["Billet télex", "بيليه تيليكس"],
    ["Registre de commerce ou attestation de travail", "RC أو شهادة عمل"]
  ];
  var RU_DOCS = [
    ["Passeport", "جواز السفر"],
    ["Photo d'identité", "صورة شمسية"],
    ["Acte de naissance", "عقد الميلاد"],
    ["Attestation originale + copie", "الشهادة الأصلية + نسخة"]
  ];
  var CA_ADM_DOCS = [
    ["Passeport", "جواز السفر"],
    ["Photo", "صورة"],
    ["Acte de naissance", "عقد الميلاد"],
    ["Attestation originale + copie", "الشهادة الأصلية + نسخة"]
  ];
  var CA_CAQ_DOCS = [
    ["Passeport", "جواز السفر"],
    ["Photo", "صورة"],
    ["Lettre d'admission", "وثيقة القبول"]
  ];
  var CA_PERMIS_DOCS = [
    ["Passeport", "جواز السفر"],
    ["Photo", "صورة"],
    ["Acte de naissance", "عقد الميلاد"],
    ["Fiche familiale", "الفيش العائلي"],
    ["Lettre d'admission", "وثيقة القبول"],
    ["CAQ", "CAQ"],
    ["Dossier du garant", "ملف الكفيل"]
  ];
  var AM_DOCS = [
    ["Scan du passeport", "سكان جواز السفر"],
    ["Photo d'identité récente", "صورة شمسية حديثة"],
    ["Billet aller-retour (optionnel)", "تذكرة ذهاب وإياب (اختياري)"],
    ["Réservation d'hôtel", "حجز فندق"]
  ];
  var CN_DOCS1 = [
    ["Scan du passeport", "سكان جواز السفر"],
    ["Photo Full HD (par photographe)", "صورة Full HD من مصور"],
    ["Numéro de téléphone", "رقم الهاتف"],
    ["Attestation de travail ou registre de commerce (RC)", "شهادة عمل أو RC"],
    ["Relevé bancaire récent (+3000 €) avec cachet de la banque", "كشف بنكي حديث (+3000 يورو) مع ختم البنك"],
    ["Casier judiciaire récent", "صحيفة سوابق حديثة"]
  ];
  var CN_DOCS2 = [
    ["Scan du passeport", "سكان جواز السفر"],
    ["Photo Full HD (par photographe)", "صورة Full HD من مصور"],
    ["Attestation de travail ou registre de commerce (RC)", "شهادة عمل أو RC"],
    ["Relevé bancaire récent", "كشف بنكي حديث"],
    ["Casier judiciaire récent", "صحيفة سوابق حديثة"]
  ];
  var CN_COND1 = [
    ["Frais consulaires non inclus — paiement par carte bancaire uniquement", "الرسوم القنصلية غير مشمولة — دفع بالبطاقة البنكية فقط"]
  ];

  // [type_fr, type_ar, price, delai_fr, delai_ar, docs?, conditions?]
  var COUNTRIES = [
    { f: "🇪🇬", fr: "Égypte", ar: "مصر", v: [
      ["Lettre de garantie", "خطاب ضمان", "4 500", "3 jours", "3 أيام", EG_DOCS, EG_COND]
    ]},
    { f: "🇶🇦", fr: "Qatar", ar: "قطر", v: [
      ["Visa 1 mois", "فيزا 1 شهر", "9 000", "2–4 jours", "2-4 أيام", QA_DOCS, QA_COND],
      ["Résidence Qatar — professions supérieures (hommes)", "إقامة قطر - مهن عليا (رجال)", "95 000", "selon le RDV", "حسب الموعد", QA_RES_DOCS, QA_RES_COND],
      ["Résidence Qatar — professions supérieures (femmes)", "إقامة قطر - مهن عليا (نساء)", "140 000", "selon le RDV", "حسب الموعد", QA_RES_DOCS, QA_RES_COND]
    ]},
    { f: "🇯🇴", fr: "Jordanie", ar: "الأردن", v: [
      ["Visa 1 mois / 3 mois", "فيزا 1شهر/3أشهر", "1 500", "24 h", "24 ساعة", JO_DOCS, JO_COND]
    ]},
    { f: "🇦🇪", fr: "Émirats", ar: "الإمارات", v: [
      ["Dubaï 1 mois, entrée unique", "دبي 1شهر دخول واحد", "24 500", "7–10 jours", "7-10 أيام", UAE_DOCS, UAE_COND],
      ["Dubaï 2 mois, entrée unique", "دبي 2شهر دخول واحد", "41 000", "7–10 jours", "7-10 أيام", UAE_DOCS, UAE_COND],
      ["Dubaï 1 mois, entrées multiples", "دبي 1شهر دخولات متعددة", "40 000", "7–10 jours", "7-10 أيام", UAE_DOCS, UAE_COND],
      ["Dubaï 2 mois, entrées multiples", "دبي 2شهر دخولات متعددة", "60 000", "7–10 jours", "7-10 أيام", UAE_DOCS, UAE_COND],
      ["Prolongation visa 30 jours", "تمديد فيزا 30 يوم", "75 000", "7–10 jours", "7-10 أيام", VISA_COPY_DOCS, UAE_COND],
      ["Dubaï 30 jours Express", "دبي 30 يوم Express", "25 000", "3–5 jours", "3-5 أيام", UAE_DOCS, UAE_COND],
      ["Annulation visa Dubaï avant l'entrée", "إلغاء فيزا دبي قبل الدخول", "12 000", "7–10 jours", "7-10 أيام", VISA_COPY_DOCS, AE_CANCEL_COND],
      ["Dubaï 30 jours, enfants de moins de 12 ans", "دبي 30 يوم للأطفال أقل من 12", "12 500", "7–10 jours", "7-10 أيام", UAE_DOCS, UAE_COND]
    ]},
    { f: "🇹🇷", fr: "Turquie", ar: "تركيا", v: [
      ["Visa électronique", "فيزا إلكترونية", "17 000", "24 h", "24 ساعة", TR_EVISA_DOCS, TR_EVISA_COND],
      ["Visa sticker", "فيزا ملصق", "3 000", "selon le RDV", "حسب الموعد", TR_STICKER_DOCS]
    ]},
    { f: "🇹🇭", fr: "Thaïlande", ar: "تايلاند", v: [
      ["e-Visa 1 mois", "إي-فيزا 1شهر", "18 000", "20–25 jours ouvrables", "20-25 يوم عمل", TH_DOCS]
    ]},
    { f: "🇸🇬", fr: "Singapour", ar: "سنغافورة", v: [
      ["Visa 1 mois", "فيزا 1 شهر", "30 000", "10–15 jours ouvrables", "10-15 يوم عمل", SG_DOCS]
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
      ["Visa 21 jours / 3 mois", "فيزا 21يوم/3أشهر", "5 000", "5–7 jours ouvrables", "5-7 أيام عمل", AM_DOCS]
    ]},
    { f: "🇸🇦", fr: "Arabie Saoudite", ar: "السعودية", v: [
      ["Visa touristique 90 jours", "فيزا سياحية 90 يوم", "33 000", "selon le RDV", "حسب الموعد", SA_DOCS, SA_COND]
    ]},
    { f: "🇨🇳", fr: "Chine", ar: "الصين", v: [
      ["Visa sticker — 1ère demande", "فيزا ملصق - طلب أول", "13 000", "10 jours ouvrables (présence du client le jour du dépôt)", "10 أيام عمل (الزبون يحضر يوم الإيداع)", CN_DOCS1, CN_COND1],
      ["Visa sticker — renouvellement", "فيزا ملصق - تجديد", "6 500", "10 jours", "10 أيام", CN_DOCS2]
    ]},
    { f: "🇰🇷", fr: "Corée", ar: "كوريا", v: [
      ["Visa sticker", "فيزا ملصق", "12 000", "5 jours", "5 أيام"]
    ]},
    { f: "🇷🇺", fr: "Russie", ar: "روسيا", v: [
      ["Visa 1 mois", "فيزا 1 شهر", "64 000", "15 jours", "15 يوم", RU_DOCS]
    ]},
    { f: "🇨🇦", fr: "Canada", ar: "كندا", note: ["Visa d'études", "تأشيرة دراسة"], v: [
      ["Admission", "قبول", "20 000", "variable", "متغيرة", CA_ADM_DOCS],
      ["CAQ", "CAQ", "10 000", "variable", "متغيرة", CA_CAQ_DOCS],
      ["Permis d'étude", "تصريح دراسة", "20 000", "variable", "متغيرة", CA_PERMIS_DOCS]
    ]},
    { f: "🇱🇧", fr: "Liban", ar: "لبنان", v: [
      ["Visa sticker", "فيزا ملصق", "20 000", "5–10 jours", "5-10 أيام", LB_DOCS, LB_COND]
    ]},
    { f: "🇹🇿", fr: "Tanzanie", ar: "تنزانيا", v: [
      ["e-Visa Zanzibar 30 jours", "إي-فيزا زنجبار 30 يوم", "16 000", "7–15 jours", "7-15 يوم", TZ_DOCS, NOREFUND]
    ]},
    { f: "🇧🇩", fr: "Bangladesh", ar: "بنغلاديش", v: [
      ["Visa d'affaires sticker 30 jours", "فيزا تجارية ملصق 30 يوم", "7 000", "15–20 jours", "15-20 يوم", BD_DOCS, BD_COND]
    ]},
    { f: "🇯🇵", fr: "Japon", ar: "اليابان", v: [
      ["Visa touristique sticker", "فيزا سياحية ملصق", "3 000", "10 jours", "10 أيام", JP_DOCS, JP_COND]
    ]},
    { f: "🇻🇳", fr: "Vietnam", ar: "فيتنام", v: [
      ["e-Visa 30 jours, entrée unique", "إي-فيزا 30 يوم دخول واحد", "12 000", "7–10 jours", "7-10 أيام", VN_DOCS, NOREFUND],
      ["e-Visa 90 jours, entrées multiples", "إي-فيزا 90 يوم متعدد", "23 000", "7–10 jours", "7-10 أيام", VN_DOCS, NOREFUND]
    ]},
    { f: "🇺🇿", fr: "Ouzbékistan", ar: "أوزبكستان", v: [
      ["e-Visa 30 jours", "إي-فيزا 30 يوم", "10 000", "3–5 jours", "3-5 أيام", UZ_DOCS, NOREFUND]
    ]},
    { f: "🇪🇹", fr: "Éthiopie", ar: "إثيوبيا", v: [
      ["e-Visa 30 jours, entrée unique", "إي-فيزا 30 يوم دخول واحد", "22 000", "5 jours", "5 أيام", ET_DOCS, NOREFUND]
    ]},
    { f: "🇲🇬", fr: "Madagascar", ar: "مدغشقر", v: [
      ["e-Visa 15 jours", "إي-فيزا 15 يوم", "12 000", "5 jours", "5 أيام", MG_DOCS, NOREFUND],
      ["e-Visa 30 jours", "إي-فيزا 30 يوم", "15 500", "5 jours", "5 أيام", MG_DOCS, NOREFUND],
      ["e-Visa 60 jours", "إي-فيزا 60 يوم", "17 000", "5 jours", "5 أيام", MG_DOCS, NOREFUND],
      ["e-Visa 90 jours", "إي-فيزا 90 يوم", "20 500", "5 jours", "5 أيام", MG_DOCS, NOREFUND]
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

    if (c.note) {
      var note = el("p", "visa-panel__note");
      bil(note, c.note[0], c.note[1]);
      sec.appendChild(note);
    }

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

      var a = el("button", "btn btn--whatsapp");
      a.type = "button";
      var ic = el("span", "wa-icon"); ic.textContent = "💬"; a.appendChild(ic);
      a.appendChild(document.createTextNode(" "));
      a.appendChild(bil(el("span"), "Demander sur WhatsApp", "اطلب عبر واتساب"));
      a.addEventListener("click", function () { openVisaModal(c, v); });
      body.appendChild(a);

      row.appendChild(body);
      sec.appendChild(row);
    });

    panel.appendChild(sec);
  });

  /* ---------- Visa application modal ---------- */
  var BOOK_WA = "213656281747"; // booking WhatsApp for the post-submit redirect
  var modal = document.getElementById("visaModal");
  var vForm = document.getElementById("visaForm");
  var vPicked = document.getElementById("visaPicked");
  var vSuccess = document.getElementById("visaSuccess");
  var vError = document.getElementById("visaError");
  var vSubmit = document.getElementById("visaSubmitBtn");
  var vCountry = document.getElementById("visaCountryInput");
  var vType = document.getElementById("visaTypeInput");
  var vWaLink = document.getElementById("visaWaLink");

  // Uploadcare widget — collects the CDN URL of the uploaded document(s).
  // The widget displays the uploaded files so the user gets a confirmation
  // before submitting. The URL is sent to Formspree as "رابط الوثائق".
  var visaUc = null, visaDocsUrl = "";
  if (window.uploadcare) {
    try {
      visaUc = uploadcare.MultipleWidget("#visaDocs");
      visaUc.onUploadComplete(function (info) { visaDocsUrl = (info && info.cdnUrl) ? info.cdnUrl : ""; });
      visaUc.onChange(function (val) { if (!val) visaDocsUrl = ""; });
    } catch (e) { visaUc = null; }
  }

  function openVisaModal(c, v) {
    if (!modal) return;
    var ar = lang() === "ar";
    if (vForm) { vForm.reset(); vForm.hidden = false; }
    visaDocsUrl = "";
    if (visaUc) { try { visaUc.value(null); } catch (e) {} }
    if (vSuccess) vSuccess.hidden = true;
    if (vError) vError.hidden = true;
    if (vCountry) vCountry.value = c.ar + " / " + c.fr;
    if (vType) vType.value = v[1] + " / " + v[0];
    if (vPicked) {
      vPicked.setAttribute("data-fr", "Pays : " + c.fr + " — Type : " + v[0]);
      vPicked.setAttribute("data-ar", "الدولة: " + c.ar + " — النوع: " + v[1]);
      vPicked.textContent = ar ? ("الدولة: " + c.ar + " — النوع: " + v[1]) : ("Pays : " + c.fr + " — Type : " + v[0]);
    }
    modal.setAttribute("data-c-ar", c.ar);
    modal.setAttribute("data-t-ar", v[1]);
    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    var first = vForm && vForm.querySelector("input");
    if (first) first.focus();
  }
  function closeVisaModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.style.overflow = "";
  }
  // expose for the row buttons (closure within IIFE — assigned to outer name)
  window.openVisaModal = openVisaModal;

  if (modal) {
    modal.querySelectorAll("[data-visa-close]").forEach(function (b) {
      b.addEventListener("click", closeVisaModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeVisaModal();
    });
  }

  if (vForm) {
    function showError(detail) {
      if (!vError) return;
      var base = lang() === "ar" ? "تعذّر إرسال الطلب" : "Échec de l'envoi";
      vError.removeAttribute("data-fr");
      vError.removeAttribute("data-ar");
      vError.textContent = detail ? (base + " — " + detail) : base;
      vError.hidden = false;
    }

    vForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!vForm.checkValidity()) { vForm.reportValidity(); return; }
      if (vError) vError.hidden = true;
      var ar = lang() === "ar";
      var orig = vSubmit ? vSubmit.innerHTML : "";
      if (vSubmit) { vSubmit.disabled = true; vSubmit.textContent = ar ? "جارٍ الإرسال…" : "Envoi…"; }

      // Build a TEXT-ONLY payload (Formspree free plan rejects file attachments
      // via AJAX). The file input is skipped; documents are collected on WhatsApp.
      var payload = {};
      Array.prototype.forEach.call(vForm.elements, function (elm) {
        if (!elm.name) return;
        if (elm.type === "file" || elm.type === "submit" || elm.type === "button") return;
        payload[elm.name] = elm.value;
      });

      if (visaDocsUrl) payload["رابط الوثائق"] = visaDocsUrl;
      var nm = payload["الاسم الكامل"] || "";
      var ph = payload["رقم الهاتف"] || "";
      var cAr = (modal && modal.getAttribute("data-c-ar")) || "";
      var tAr = (modal && modal.getAttribute("data-t-ar")) || "";

      fetch(vForm.action, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return { ok: res.ok, status: res.status, data: data };
          });
        })
        .then(function (r) {
          if (r.ok) {
            var msg = "السلام عليكم، طلب تأشيرة:\n• الدولة: " + cAr + "\n• نوع التأشيرة: " + tAr +
                      "\n• الاسم: " + nm + "\n• الهاتف: " + ph +
                      (visaDocsUrl ? "\n• الوثائق: " + visaDocsUrl : "");
            var url = "https://wa.me/" + BOOK_WA + "?text=" + encodeURIComponent(msg);
            if (vWaLink) vWaLink.href = url;
            if (vForm) vForm.hidden = true;
            if (vSuccess) vSuccess.hidden = false;
            window.open(url, "_blank", "noopener");
          } else {
            var detail = "";
            if (r.data && r.data.errors && r.data.errors.length) {
              detail = r.data.errors.map(function (x) { return x.message || x.field; }).join(" • ");
            } else if (r.data && r.data.error) {
              detail = r.data.error;
            } else {
              detail = "HTTP " + r.status;
            }
            showError(detail);
          }
        })
        .catch(function (err) {
          showError((err && err.message) ? err.message : (lang() === "ar" ? "تحقّق من اتصال الإنترنت" : "Vérifiez la connexion"));
        })
        .then(function () { if (vSubmit) { vSubmit.disabled = false; vSubmit.innerHTML = orig; } });
    });
  }

  function select(idx) {
    sidebar.querySelectorAll(".visa-country").forEach(function (b) {
      b.classList.toggle("is-active", +b.getAttribute("data-idx") === idx);
    });
    panel.querySelectorAll(".visa-panel__section").forEach(function (s) {
      s.classList.toggle("is-active", +s.getAttribute("data-idx") === idx);
    });
  }
})();
