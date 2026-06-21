/* =====================================================================
   Djen-Djen Travel — UI behaviour
   1. Language switch (FR ⇄ AR) with dir mirroring + persistence
   2. Mobile nav toggle
   3. Booking confirmation modal
   4. Lightweight form validation (focus / error states)
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- 1. Language switch ---------- */
  var STORAGE_KEY = "djendjen.lang";
  var htmlEl = document.documentElement;
  var langButtons = document.querySelectorAll(".lang-switch [data-lang]");

  function applyLang(lang) {
    var isAr = lang === "ar";
    htmlEl.setAttribute("lang", lang);
    htmlEl.setAttribute("dir", isAr ? "rtl" : "ltr");

    // Swap text content for every translatable node
    document.querySelectorAll("[data-fr][data-ar]").forEach(function (node) {
      var val = isAr ? node.getAttribute("data-ar") : node.getAttribute("data-fr");
      if (val !== null) node.innerHTML = val;
    });

    // Swap placeholders
    document.querySelectorAll("[data-ph-fr][data-ph-ar]").forEach(function (input) {
      input.setAttribute("placeholder", isAr ? input.getAttribute("data-ph-ar") : input.getAttribute("data-ph-fr"));
    });

    // Reflect pressed state on switch
    langButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () { applyLang(btn.getAttribute("data-lang")); });
  });

  // Initialise from saved preference (default = FR)
  var saved = "fr";
  try { saved = localStorage.getItem(STORAGE_KEY) || "fr"; } catch (e) {}
  applyLang(saved);

  /* ---------- 2. Mobile nav ---------- */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 3. Booking modal ---------- */
  var modal = document.getElementById("bookingModal");
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    var btn = modal.querySelector("[data-close-modal]");
    if (btn) btn.focus();
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-open-modal]").forEach(function (el) {
    el.addEventListener("click", openModal);
  });
  document.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  var confirmPay = document.getElementById("confirmPay");
  if (confirmPay) {
    confirmPay.addEventListener("click", function () {
      var isAr = htmlEl.getAttribute("lang") === "ar";
      alert(isAr
        ? "شكرًا لك! تمّ استلام طلبك. سيتصل بك فريقنا قريبًا لإتمام الدفع."
        : "Merci ! Votre demande est enregistrée. Notre équipe vous contactera pour finaliser le paiement.");
      closeModal();
    });
  }

  /* ---------- 4. Form validation ---------- */
  var form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("input[required]").forEach(function (input) {
        var field = input.closest(".field");
        if (!input.value.trim()) {
          field.classList.add("field--error");
          input.setAttribute("aria-invalid", "true");
          valid = false;
        } else {
          field.classList.remove("field--error");
          input.removeAttribute("aria-invalid");
        }
      });
      if (valid) openModal();
    });

    // Clear error as the user types
    form.querySelectorAll("input[required]").forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.value.trim()) {
          input.closest(".field").classList.remove("field--error");
          input.removeAttribute("aria-invalid");
        }
      });
    });
  }
})();
