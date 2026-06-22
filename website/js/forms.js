/* =====================================================================
   Djen-Djen Travel — Request forms → WhatsApp
   - Tab switching for the multi-service forms block
   - Per-form validation (reuses .field--error)
   - Builds a ready-to-send WhatsApp message from the form fields and
     opens the chosen office's chat (Office 1 / Office 2)
   Works on any page that contains these elements; harmless if absent.
   ===================================================================== */
(function () {
  "use strict";

  // Office WhatsApp numbers (international format, no +)
  var OFFICES = {
    "1": "213661417571",
    "2": "213656281747"
  };

  var htmlEl = document.documentElement;
  function currentLang() { return htmlEl.getAttribute("lang") === "ar" ? "ar" : "fr"; }

  /* ---------- Tabs ---------- */
  var tabs = document.querySelectorAll(".forms__tab");
  var panels = document.querySelectorAll(".forms__panel");

  function activateTab(name) {
    tabs.forEach(function (t) {
      t.setAttribute("aria-selected", t.getAttribute("data-tab") === name ? "true" : "false");
    });
    panels.forEach(function (p) {
      p.classList.toggle("is-active", p.getAttribute("data-panel") === name);
    });
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { activateTab(t.getAttribute("data-tab")); });
  });

  /* ---------- Open a tab from the URL hash (#req=billets) ---------- *
   * Used by the navbar links (Billets / Hôtels / Visas). Works on load
   * and on hash change; scrolls to the request section once opened.    */
  function openTabFromHash() {
    var m = (location.hash || "").match(/req=([a-z]+)/i);
    if (!m) return;
    var name = m[1].toLowerCase();
    var panel = document.querySelector('.forms__panel[data-panel="' + name + '"]');
    if (!panel) return; // page doesn't have this tab
    activateTab(name);
    var section = document.getElementById("request");
    if (section) {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }
  if (panels.length) {
    window.addEventListener("hashchange", openTabFromHash);
    openTabFromHash();
  }

  /* ---------- Validation ---------- */
  function validate(form) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (control) {
      if (control.disabled) return;            // skip hidden/disabled fields
      var field = control.closest(".field");
      if (!field) return;
      if (!String(control.value).trim()) {
        field.classList.add("field--error");
        control.setAttribute("aria-invalid", "true");
        ok = false;
      } else {
        field.classList.remove("field--error");
        control.removeAttribute("aria-invalid");
      }
    });
    return ok;
  }

  // At least one named traveler (for forms that list travelers)
  function validateTravelers(form) {
    var container = form.querySelector("[data-travelers]");
    if (!container) return true;
    var hasName = Array.prototype.some.call(
      container.querySelectorAll("[data-traveler-name]"),
      function (i) { return i.value.trim(); }
    );
    var err = container.querySelector("[data-travelers-error]");
    if (err) err.style.display = hasName ? "none" : "block";
    return hasName;
  }

  // Clear field error as the user types/changes (delegated → covers dynamic rows)
  document.addEventListener("input", function (e) {
    var control = e.target;
    if (!control.matches || !control.matches(".request-form input, .request-form select, .request-form textarea")) return;
    if (control.hasAttribute("required") && String(control.value).trim()) {
      var field = control.closest(".field");
      if (field) field.classList.remove("field--error");
      control.removeAttribute("aria-invalid");
    }
    if (control.matches("[data-traveler-name]") && control.value.trim()) {
      var c = control.closest("[data-travelers]");
      var err = c && c.querySelector("[data-travelers-error]");
      if (err) err.style.display = "none";
    }
  });

  /* ---------- Dynamic travelers (add / remove) ---------- */
  document.querySelectorAll("[data-add-traveler]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var container = btn.closest("[data-travelers]");
      var list = container.querySelector("[data-travelers-list]");
      var rows = list.querySelectorAll("[data-traveler-row]");
      var clone = rows[rows.length - 1].cloneNode(true); // keeps current language
      clone.querySelectorAll("input").forEach(function (inp) {
        inp.value = "";
        inp.removeAttribute("required");        // only the first traveler is required
        inp.removeAttribute("aria-invalid");
      });
      list.appendChild(clone);
      var firstInput = clone.querySelector("input");
      if (firstInput) firstInput.focus();
    });
  });

  document.querySelectorAll("[data-travelers-list]").forEach(function (list) {
    list.addEventListener("click", function (e) {
      var rm = e.target.closest("[data-remove-traveler]");
      if (!rm) return;
      var rows = list.querySelectorAll("[data-traveler-row]");
      if (rows.length <= 1) return;             // keep at least one traveler
      rm.closest("[data-traveler-row]").remove();
    });
  });

  /* ---------- Trip type → toggle return date ---------- */
  document.querySelectorAll('[data-role="trip-type"]').forEach(function (sel) {
    function sync() {
      var oneway = sel.value === "oneway";
      var form = sel.closest(".request-form");
      var field = form.querySelector('[data-role="return-date-field"]');
      var input = form.querySelector('[data-role="return-date"]');
      if (field) field.style.display = oneway ? "none" : "";
      if (input) {
        input.disabled = oneway;
        if (oneway) { input.value = ""; var f = input.closest(".field"); if (f) f.classList.remove("field--error"); }
      }
    }
    sel.addEventListener("change", sync);
    sync();
  });

  /* ---------- Build message ---------- */
  function fieldLabel(field, lang) {
    var label = field.querySelector("label");
    if (label) {
      var v = label.getAttribute("data-" + lang);
      if (v) return v.replace(/&amp;/g, "&");
    }
    var c = field.querySelector("input, select, textarea");
    return c ? (c.getAttribute("name") || "") : "";
  }

  function controlValue(control) {
    if (control.tagName === "SELECT") {
      var opt = control.options[control.selectedIndex];
      return opt ? opt.text.trim() : "";
    }
    return String(control.value).trim();
  }

  function buildMessage(form, lang) {
    var lines = [];
    var title = form.getAttribute("data-wa-title-" + lang);
    if (title) { lines.push(title); lines.push(""); }

    // Walk fields and the travelers block in document order
    form.querySelectorAll(".field, [data-travelers]").forEach(function (node) {
      // Travelers block → numbered list
      if (node.hasAttribute("data-travelers")) {
        var collected = [];
        node.querySelectorAll("[data-traveler-row]").forEach(function (row) {
          var name = row.querySelector("[data-traveler-name]");
          var age = row.querySelector("[data-traveler-age]");
          var nv = name ? name.value.trim() : "";
          var av = age ? age.value.trim() : "";
          if (!nv && !av) return;
          var ageWord = lang === "ar" ? "العمر" : "âge";
          collected.push((collected.length + 1) + ". " + nv + (av ? " (" + ageWord + " " + av + ")" : ""));
        });
        if (collected.length) {
          lines.push("");
          lines.push(lang === "ar" ? "المسافرون:" : "Voyageurs :");
          collected.forEach(function (l) { lines.push(l); });
          lines.push("");
        }
        return;
      }
      // Skip fields nested inside the travelers block (handled above)
      if (node.closest("[data-travelers]")) return;

      var control = node.querySelector("input, select, textarea");
      if (!control || control.disabled) return;
      var val = controlValue(control);
      if (!val) return;
      lines.push("• " + fieldLabel(node, lang) + ": " + val);
    });

    var footer = lang === "ar"
      ? "\nأُرسلت من موقع جن جن للسياحة والأسفار"
      : "\nEnvoyé depuis le site Djen-Djen Travel";
    lines.push(footer);
    return lines.join("\n");
  }

  /* ---------- Send to WhatsApp ---------- */
  document.querySelectorAll(".wa-send").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var form = btn.closest(".request-form");
      if (!form) return;
      var ok = validate(form);
      var okTravelers = validateTravelers(form);
      if (!ok || !okTravelers) {
        var bad = form.querySelector(".field--error input, .field--error select, .field--error textarea");
        if (bad) { bad.focus(); }
        else if (!okTravelers) {
          var t = form.querySelector("[data-traveler-name]");
          if (t) t.focus();
        }
        return;
      }
      var lang = currentLang();
      var office = btn.getAttribute("data-office");
      var number = OFFICES[office];
      var text = encodeURIComponent(buildMessage(form, lang));
      window.open("https://wa.me/" + number + "?text=" + text, "_blank", "noopener");
    });
  });
})();
