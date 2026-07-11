/* =====================================================================
   Djen-Djen Travel — Reusable booking request modal
   ONE shared modal, but the fields rendered depend on the booking TYPE
   (inferred from the subject, or forced via data-booking-type):
     • flight  (طلب تذكرة سفر)  — airports, trip type, return date, pax split
     • hotel   (طلب حجز فندق)   — destination, room/meal, docs, pax split
     • generic (Omra / trips / Réserver) — unchanged legacy fields
   Submits a text-only JSON payload to Formspree, then redirects to
   WhatsApp with a pre-filled message built dynamically from the fields.
   Loaded after main.js so the document language is already applied.
   ===================================================================== */
(function () {
  "use strict";

  var FORMSPREE = "https://formspree.io/f/xaqgjkly";
  var BOOK_WA = "213656281747";
  function lang() { return document.documentElement.getAttribute("lang") === "ar" ? "ar" : "fr"; }

  /* ---------- Reusable field fragments (match existing .field / .input) ---------- */
  var FLD = {
    name: '<div class="field"><label data-fr="Nom complet" data-ar="الاسم الكامل">الاسم الكامل</label><input class="input" type="text" name="الاسم الكامل" required /></div>',
    phone: '<div class="field"><label data-fr="Téléphone" data-ar="رقم الهاتف">رقم الهاتف</label><input class="input" type="tel" dir="ltr" name="رقم الهاتف" placeholder="0661 00 00 00" required /></div>',
    email: '<div class="field"><label data-fr="E-mail (optionnel)" data-ar="البريد الإلكتروني (اختياري)">البريد الإلكتروني (اختياري)</label><input class="input" type="email" dir="ltr" name="البريد الإلكتروني" /></div>',
    passport: '<div class="field"><label data-fr="N° de passeport" data-ar="رقم جواز السفر">رقم جواز السفر</label><input class="input" type="text" dir="ltr" name="رقم جواز السفر" required /></div>',
    date: '<div class="field"><label data-fr="Date de départ souhaitée" data-ar="تاريخ السفر المرغوب">تاريخ السفر المرغوب</label><input class="input" type="date" dir="ltr" name="تاريخ السفر المرغوب" required /></div>',
    returnDate: '<div class="field" id="bkReturnField"><label data-fr="Date de retour" data-ar="تاريخ العودة">تاريخ العودة</label><input class="input" type="date" dir="ltr" name="تاريخ العودة" /></div>',
    destination: '<div class="field"><label data-fr="Destination" data-ar="الوجهة">الوجهة</label><input class="input" type="text" name="الوجهة" data-ph-fr="Ville ou pays" data-ph-ar="المدينة أو البلد" placeholder="المدينة أو البلد" required /></div>',
    notes: '<div class="field"><label data-fr="Remarques (optionnel)" data-ar="ملاحظات (اختياري)">ملاحظات (اختياري)</label><textarea class="input" rows="3" name="ملاحظات"></textarea></div>',
    docs: '<div class="field"><label data-fr="Documents (passeport, photos…) — optionnel" data-ar="الوثائق (جواز السفر، صور…) — اختياري">الوثائق (جواز السفر، صور…) — اختياري</label>' +
          '<input type="hidden" role="uploadcare-uploader" id="bkDocs" data-public-key="7f2d6ea226a5ab97ef6e" data-multiple="true" data-multiple-max="10" data-tabs="file camera url" data-locale="fr" /></div>',
    travelers: '<div class="field"><label data-fr="Nombre de voyageurs" data-ar="عدد المسافرين">عدد المسافرين</label><input class="input" type="number" dir="ltr" min="1" value="1" name="عدد المسافرين" required /></div>',
    room: '<div class="field"><label data-fr="Type de chambre" data-ar="نوعية الغرفة">نوعية الغرفة</label>' +
          '<select class="input" name="نوعية الغرفة" required>' +
            '<option value="" disabled selected data-fr="— Choisir —" data-ar="— اختر —">— اختر —</option>' +
            '<option value="غرفة مفردة" data-fr="Chambre simple" data-ar="غرفة مفردة">غرفة مفردة</option>' +
            '<option value="غرفة مزدوجة" data-fr="Chambre double" data-ar="غرفة مزدوجة">غرفة مزدوجة</option>' +
            '<option value="غرفة ثلاثية" data-fr="Chambre triple" data-ar="غرفة ثلاثية">غرفة ثلاثية</option>' +
            '<option value="غرفة رباعية" data-fr="Chambre quadruple" data-ar="غرفة رباعية">غرفة رباعية</option>' +
          '</select></div>',
    meal: '<div class="field"><label data-fr="Type de pension" data-ar="نوعية الإعاشة">نوعية الإعاشة</label>' +
          '<select class="input" name="نوعية الإعاشة" required>' +
            '<option value="" disabled selected data-fr="— Choisir —" data-ar="— اختر —">— اختر —</option>' +
            '<option value="بدون إعاشة" data-fr="Sans pension" data-ar="بدون إعاشة">بدون إعاشة</option>' +
            '<option value="إفطار فقط" data-fr="Petit-déjeuner seul" data-ar="إفطار فقط">إفطار فقط</option>' +
            '<option value="نصف إعاشة" data-fr="Demi-pension" data-ar="نصف إعاشة">نصف إعاشة</option>' +
            '<option value="إعاشة كاملة" data-fr="Pension complète" data-ar="إعاشة كاملة">إعاشة كاملة</option>' +
          '</select></div>',
    depAirport: '<div class="field"><label data-fr="Aéroport de départ" data-ar="مطار الانطلاق">مطار الانطلاق</label>' +
          '<select class="input" name="مطار الانطلاق" required>' +
            '<option value="" disabled selected data-fr="— Choisir —" data-ar="— اختر —">— اختر —</option>' +
            '<option value="الجزائر (ALG)" data-fr="Alger (ALG)" data-ar="الجزائر (ALG)">الجزائر (ALG)</option>' +
            '<option value="قسنطينة (CZL)" data-fr="Constantine (CZL)" data-ar="قسنطينة (CZL)">قسنطينة (CZL)</option>' +
            '<option value="وهران (ORN)" data-fr="Oran (ORN)" data-ar="وهران (ORN)">وهران (ORN)</option>' +
            '<option value="عنابة (AAE)" data-fr="Annaba (AAE)" data-ar="عنابة (AAE)">عنابة (AAE)</option>' +
            '<option value="سطيف (QSF)" data-fr="Sétif (QSF)" data-ar="سطيف (QSF)">سطيف (QSF)</option>' +
            '<option value="بجاية (BJA)" data-fr="Béjaïa (BJA)" data-ar="بجاية (BJA)">بجاية (BJA)</option>' +
            '<option value="ورقلة (OGX)" data-fr="Ouargla (OGX)" data-ar="ورقلة (OGX)">ورقلة (OGX)</option>' +
            '<option value="غرداية (GHA)" data-fr="Ghardaïa (GHA)" data-ar="غرداية (GHA)">غرداية (GHA)</option>' +
            '<option value="تلمسان (TLM)" data-fr="Tlemcen (TLM)" data-ar="تلمسان (TLM)">تلمسان (TLM)</option>' +
            '<option value="أخرى" data-fr="Autre" data-ar="أخرى">أخرى</option>' +
          '</select></div>',
    arrAirport: '<div class="field"><label data-fr="Aéroport d’arrivée" data-ar="مطار الوصول">مطار الوصول</label><input class="input" type="text" name="مطار الوصول" data-ph-fr="Ex : Istanbul (IST)" data-ph-ar="مثال: إسطنبول (IST)" placeholder="مثال: إسطنبول (IST)" required /></div>',
    tripType: '<div class="field"><label data-fr="Type de trajet" data-ar="نوع الرحلة">نوع الرحلة</label>' +
          '<div class="bk-radios">' +
            '<label class="bk-radio"><input type="radio" name="نوع الرحلة" value="ذهاب وعودة" checked /> <span data-fr="Aller-retour" data-ar="ذهاب وعودة">ذهاب وعودة</span></label>' +
            '<label class="bk-radio"><input type="radio" name="نوع الرحلة" value="ذهاب فقط" /> <span data-fr="Aller simple" data-ar="ذهاب فقط">ذهاب فقط</span></label>' +
          '</div></div>',
    pax: '<div class="field-row field-row--3">' +
            '<div class="field"><label data-fr="Adultes (12+)" data-ar="البالغين (12+)">البالغين (12+)</label><input class="input" type="number" dir="ltr" min="1" value="1" name="البالغين" required /></div>' +
            '<div class="field"><label data-fr="Enfants (2-12)" data-ar="الأطفال (2-12)">الأطفال (2-12)</label><input class="input" type="number" dir="ltr" min="0" value="0" name="الأطفال" /></div>' +
            '<div class="field"><label data-fr="Bébés (-2)" data-ar="الرضع (أقل من سنتين)">الرضع (أقل من سنتين)</label><input class="input" type="number" dir="ltr" min="0" value="0" name="الرضع" /></div>' +
          '</div>'
  };
  function row(a, b) { return '<div class="field-row">' + a + b + '</div>'; }

  /* ---------- Per-type field layouts ---------- */
  function buildFields(type) {
    if (type === "flight") {
      return row(FLD.name, FLD.phone) +
             row(FLD.email, FLD.passport) +
             row(FLD.depAirport, FLD.arrAirport) +
             FLD.tripType +
             row(FLD.date, FLD.returnDate) +
             FLD.pax +
             FLD.notes;
    }
    if (type === "hotel") {
      return row(FLD.name, FLD.phone) +
             row(FLD.email, FLD.destination) +
             FLD.date +
             row(FLD.room, FLD.meal) +
             FLD.pax +
             FLD.docs +
             FLD.notes;
    }
    // generic (Omra / organized trips / Réserver) — unchanged legacy layout
    return row(FLD.name, FLD.phone) +
           row(FLD.email, FLD.passport) +
           row(FLD.date, FLD.travelers) +
           row(FLD.room, FLD.meal) +
           FLD.docs +
           FLD.notes;
  }

  function inferType(sAr, sFr) {
    var s = (sFr || "").toLowerCase();
    if ((sAr || "").indexOf("تذكرة") >= 0 || s.indexOf("billet") >= 0) return "flight";
    if ((sAr || "").indexOf("فندق") >= 0 || s.indexOf("hôtel") >= 0 || s.indexOf("hotel") >= 0) return "hotel";
    return "generic";
  }

  /* ---------- Modal shell (fields are injected per type) ---------- */
  var tpl =
    '<div class="modal__overlay" data-bk-close></div>' +
    '<div class="modal__dialog modal__dialog--lg">' +
      '<button class="modal__close" data-bk-close aria-label="Fermer">✕</button>' +
      '<h3 data-fr="Demande de réservation" data-ar="طلب حجز">طلب حجز</h3>' +
      '<p class="visa-picked" id="bkSubject"></p>' +
      '<form id="bkForm" class="visa-form">' +
        '<input type="hidden" name="_subject" value="طلب حجز - Djen-Djen Travel" />' +
        '<input type="hidden" name="نوع الطلب" id="bkType" />' +
        '<div id="bkFields"></div>' +
        '<div class="wa-actions"><button type="submit" class="btn btn--primary btn--block" id="bkSubmit" data-fr="Envoyer la demande" data-ar="إرسال الطلب">إرسال الطلب</button></div>' +
        '<p class="visa-error" id="bkError" hidden></p>' +
      '</form>' +
      '<div class="visa-success" id="bkSuccess" hidden>' +
        '<div class="modal__icon" aria-hidden="true">✅</div>' +
        '<h3 data-fr="Demande envoyée !" data-ar="تم إرسال طلبك بنجاح!">تم إرسال طلبك بنجاح!</h3>' +
        '<p data-fr="Notre équipe vous contactera bientôt. Continuez sur WhatsApp." data-ar="سيتواصل معك فريقنا قريباً. تابع عبر واتساب.">سيتواصل معك فريقنا قريباً. تابع عبر واتساب.</p>' +
        '<a class="btn btn--whatsapp btn--block" id="bkWa" target="_blank" rel="noopener"><span class="wa-icon">💬</span> <span data-fr="Continuer sur WhatsApp" data-ar="متابعة عبر واتساب">متابعة عبر واتساب</span></a>' +
      '</div>' +
    '</div>';

  var modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "bookingReqModal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.hidden = true;
  modal.innerHTML = tpl;
  document.body.appendChild(modal);

  function localize(root) {
    var ar = lang() === "ar";
    root.querySelectorAll("[data-fr][data-ar]").forEach(function (n) {
      n.innerHTML = ar ? n.getAttribute("data-ar") : n.getAttribute("data-fr");
    });
    root.querySelectorAll("[data-ph-fr][data-ph-ar]").forEach(function (i) {
      i.setAttribute("placeholder", ar ? i.getAttribute("data-ph-ar") : i.getAttribute("data-ph-fr"));
    });
  }
  localize(modal); // localize the static shell (main.js applyLang already ran)

  var form = modal.querySelector("#bkForm");
  var fieldsEl = modal.querySelector("#bkFields");
  var subjEl = modal.querySelector("#bkSubject");
  var typeInput = modal.querySelector("#bkType");
  var successEl = modal.querySelector("#bkSuccess");
  var errorEl = modal.querySelector("#bkError");
  var submitBtn = modal.querySelector("#bkSubmit");
  var waLink = modal.querySelector("#bkWa");
  var curSubAr = "", curSubFr = "";
  var builtType = null, bkUc = null, docsUrl = "";

  // Show/hide the return-date field (flight, round-trip only)
  function syncReturn() {
    var rf = fieldsEl.querySelector("#bkReturnField");
    if (!rf) return;
    var inp = rf.querySelector("input");
    var round = form.querySelector('input[name="نوع الرحلة"]:checked');
    var show = round && round.value === "ذهاب وعودة";
    rf.style.display = show ? "" : "none";
    if (inp) { inp.disabled = !show; inp.required = !!show; if (!show) inp.value = ""; }
  }

  function buildFor(type) {
    fieldsEl.innerHTML = buildFields(type);
    localize(fieldsEl);
    // (re)initialise the Uploadcare widget if this layout has a docs field
    bkUc = null;
    var docsEl = fieldsEl.querySelector("#bkDocs");
    if (docsEl && window.uploadcare) {
      try {
        bkUc = uploadcare.MultipleWidget("#bkDocs");
        bkUc.onUploadComplete(function (info) { docsUrl = (info && info.cdnUrl) ? info.cdnUrl : ""; });
        bkUc.onChange(function (val) { if (!val) docsUrl = ""; });
      } catch (e) { bkUc = null; }
    }
    // wire trip-type radios (flight)
    fieldsEl.querySelectorAll('input[name="نوع الرحلة"]').forEach(function (r) {
      r.addEventListener("change", syncReturn);
    });
    builtType = type;
  }

  function openModal(type, sFr, sAr) {
    curSubFr = sFr; curSubAr = sAr;
    if (type !== builtType) buildFor(type);
    form.reset();
    form.hidden = false;
    docsUrl = "";
    if (bkUc) { try { bkUc.value(null); } catch (e) {} }
    syncReturn();
    if (successEl) successEl.hidden = true;
    if (errorEl) errorEl.hidden = true;
    if (typeInput) typeInput.value = sAr + " / " + sFr;
    if (subjEl) {
      subjEl.setAttribute("data-fr", sFr);
      subjEl.setAttribute("data-ar", sAr);
      subjEl.textContent = lang() === "ar" ? sAr : sFr;
    }
    modal.hidden = false; modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    var first = form.querySelector("input:not([type=hidden])"); if (first) first.focus();
  }
  function closeModal() {
    modal.classList.remove("is-open"); modal.hidden = true;
    document.body.style.overflow = "";
  }
  modal.querySelectorAll("[data-bk-close]").forEach(function (b) { b.addEventListener("click", closeModal); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  function showError(detail) {
    if (!errorEl) return;
    var base = lang() === "ar" ? "تعذّر إرسال الطلب" : "Échec de l'envoi";
    errorEl.removeAttribute("data-fr"); errorEl.removeAttribute("data-ar");
    errorEl.textContent = detail ? (base + " — " + detail) : base;
    errorEl.hidden = false;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (errorEl) errorEl.hidden = true;
    var ar = lang() === "ar";
    var orig = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = ar ? "جارٍ الإرسال…" : "Envoi…"; }

    // Text-only payload; skip disabled/unchecked/file controls.
    var payload = {};
    Array.prototype.forEach.call(form.elements, function (elm) {
      if (!elm.name || elm.disabled) return;
      if (elm.type === "submit" || elm.type === "button" || elm.type === "file") return;
      if (elm.type === "radio" && !elm.checked) return;
      payload[elm.name] = elm.value;
    });
    if (docsUrl) payload["رابط الوثائق"] = docsUrl;
    var nm = payload["الاسم الكامل"] || "", ph = payload["رقم الهاتف"] || "";

    // WhatsApp message built dynamically from whichever fields this form has.
    var lines = [];
    Object.keys(payload).forEach(function (k) {
      if (k === "_subject" || k === "نوع الطلب") return;
      var v = payload[k];
      if (v === "" || v == null) return;
      lines.push("• " + k + ": " + v);
    });

    fetch(FORMSPREE, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (d) { return { ok: res.ok, status: res.status, data: d }; });
      })
      .then(function (r) {
        if (r.ok) {
          var msg = "السلام عليكم، " + curSubAr + ":\n" + lines.join("\n");
          var url = "https://wa.me/" + BOOK_WA + "?text=" + encodeURIComponent(msg);
          if (waLink) waLink.href = url;
          form.hidden = true;
          if (successEl) successEl.hidden = false;
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
      .then(function () { if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = orig; } });
  });

  // Event delegation: any [data-booking] trigger opens the modal with the
  // right field layout for its context.
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-booking]");
    if (!t) return;
    e.preventDefault();
    var sFr = t.getAttribute("data-subject-fr") || t.getAttribute("data-subject") || "Demande de réservation";
    var sAr = t.getAttribute("data-subject-ar") || sFr;
    var type = t.getAttribute("data-booking-type") || inferType(sAr, sFr);
    var destFr = t.getAttribute("data-dest-fr"), destAr = t.getAttribute("data-dest-ar");
    if (destFr) sFr += " — " + destFr;
    if (destAr) sAr += " — " + destAr;
    openModal(type, sFr, sAr);
  });
})();
