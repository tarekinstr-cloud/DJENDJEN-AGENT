/* =====================================================================
   Djen-Djen Travel — Reusable booking request modal
   Any element with [data-booking] opens a modal form (same fields/flow
   as the visa form). The subject is read from data-subject-ar /
   data-subject-fr (optionally appended with data-dest-ar / data-dest-fr).
   Submits a text-only JSON payload to Formspree, then redirects to
   WhatsApp (0656281747) with a pre-filled message.
   Loaded after main.js so the document language is already applied.
   ===================================================================== */
(function () {
  "use strict";

  var FORMSPREE = "https://formspree.io/f/xaqgjkly";
  var BOOK_WA = "213656281747";
  function lang() { return document.documentElement.getAttribute("lang") === "ar" ? "ar" : "fr"; }

  var tpl =
    '<div class="modal__overlay" data-bk-close></div>' +
    '<div class="modal__dialog modal__dialog--lg">' +
      '<button class="modal__close" data-bk-close aria-label="Fermer">✕</button>' +
      '<h3 data-fr="Demande de réservation" data-ar="طلب حجز">طلب حجز</h3>' +
      '<p class="visa-picked" id="bkSubject"></p>' +
      '<form id="bkForm" class="visa-form">' +
        '<input type="hidden" name="_subject" value="طلب حجز - Djen-Djen Travel" />' +
        '<input type="hidden" name="نوع الطلب" id="bkType" />' +
        '<div class="field-row">' +
          '<div class="field"><label data-fr="Nom complet" data-ar="الاسم الكامل">الاسم الكامل</label><input class="input" type="text" name="الاسم الكامل" required /></div>' +
          '<div class="field"><label data-fr="Téléphone" data-ar="رقم الهاتف">رقم الهاتف</label><input class="input" type="tel" dir="ltr" name="رقم الهاتف" placeholder="0661 00 00 00" required /></div>' +
        '</div>' +
        '<div class="field-row">' +
          '<div class="field"><label data-fr="E-mail (optionnel)" data-ar="البريد الإلكتروني (اختياري)">البريد الإلكتروني (اختياري)</label><input class="input" type="email" dir="ltr" name="البريد الإلكتروني" /></div>' +
          '<div class="field"><label data-fr="N° de passeport" data-ar="رقم جواز السفر">رقم جواز السفر</label><input class="input" type="text" dir="ltr" name="رقم جواز السفر" required /></div>' +
        '</div>' +
        '<div class="field-row">' +
          '<div class="field"><label data-fr="Date de voyage souhaitée" data-ar="تاريخ السفر المرغوب">تاريخ السفر المرغوب</label><input class="input" type="date" dir="ltr" name="تاريخ السفر المرغوب" required /></div>' +
          '<div class="field"><label data-fr="Nombre de voyageurs" data-ar="عدد المسافرين">عدد المسافرين</label><input class="input" type="number" dir="ltr" min="1" value="1" name="عدد المسافرين" required /></div>' +
        '</div>' +
        '<div class="field"><label data-fr="Remarques (optionnel)" data-ar="ملاحظات (اختياري)">ملاحظات (اختياري)</label><textarea class="input" rows="3" name="ملاحظات"></textarea></div>' +
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

  // Localize the freshly-built subtree (main.js applyLang already ran on load)
  (function () {
    var ar = lang() === "ar";
    modal.querySelectorAll("[data-fr][data-ar]").forEach(function (n) {
      n.innerHTML = ar ? n.getAttribute("data-ar") : n.getAttribute("data-fr");
    });
  })();

  var form = modal.querySelector("#bkForm");
  var subjEl = modal.querySelector("#bkSubject");
  var typeInput = modal.querySelector("#bkType");
  var successEl = modal.querySelector("#bkSuccess");
  var errorEl = modal.querySelector("#bkError");
  var submitBtn = modal.querySelector("#bkSubmit");
  var waLink = modal.querySelector("#bkWa");
  var curSubAr = "", curSubFr = "";

  function openModal(sFr, sAr) {
    curSubFr = sFr; curSubAr = sAr;
    form.reset(); form.hidden = false;
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
    var first = form.querySelector("input"); if (first) first.focus();
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

    var payload = {};
    Array.prototype.forEach.call(form.elements, function (elm) {
      if (!elm.name) return;
      if (elm.type === "submit" || elm.type === "button" || elm.type === "file") return;
      payload[elm.name] = elm.value;
    });
    var nm = payload["الاسم الكامل"] || "", ph = payload["رقم الهاتف"] || "";
    var td = payload["تاريخ السفر المرغوب"] || "", tv = payload["عدد المسافرين"] || "";

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
          var msg = "السلام عليكم، " + curSubAr + ":\n• الاسم: " + nm + "\n• الهاتف: " + ph +
                    "\n• تاريخ السفر: " + td + "\n• عدد المسافرين: " + tv;
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

  // Event delegation: catches every [data-booking] element — including the
  // hero slideshow CTA and anything injected after load — regardless of the
  // order in which scripts run. Robust against re-rendered DOM.
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-booking]");
    if (!t) return;
    e.preventDefault();
    var sFr = t.getAttribute("data-subject-fr") || t.getAttribute("data-subject") || "Demande de réservation";
    var sAr = t.getAttribute("data-subject-ar") || sFr;
    var destFr = t.getAttribute("data-dest-fr"), destAr = t.getAttribute("data-dest-ar");
    if (destFr) sFr += " — " + destFr;
    if (destAr) sAr += " — " + destAr;
    openModal(sFr, sAr);
  });
})();
