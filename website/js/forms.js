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

  // WhatsApp booking number (international format, no +)
  var SEND_NUMBER = "213656281747";
  // Messenger page (no prefilled message support → we copy to clipboard)
  var MESSENGER_URL = "https://m.me/DjenDjen.Travel";

  // Traveler validation messages
  var TRAVELER_MSG = {
    noname: { fr: "Ajoutez au moins un voyageur.", ar: "أضف مسافراً واحداً على الأقل." },
    nopass: { fr: "Saisissez le numéro de passeport de chaque voyageur.", ar: "أدخل رقم جواز السفر لكل مسافر." }
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

  function showTravelerError(err, type, lang) {
    if (!err) return;
    err.textContent = (TRAVELER_MSG[type] || TRAVELER_MSG.noname)[lang];
    err.style.display = "block";
  }

  // At least one named traveler; passport required per traveler when international
  function validateTravelers(form) {
    var container = form.querySelector("[data-travelers]");
    if (!container) return true;
    var err = container.querySelector("[data-travelers-error]");
    var lang = currentLang();

    var namedRows = Array.prototype.filter.call(
      container.querySelectorAll("[data-traveler-row]"),
      function (row) {
        var n = row.querySelector("[data-traveler-name]");
        return n && n.value.trim();
      }
    );
    if (!namedRows.length) { showTravelerError(err, "noname", lang); return false; }

    if (container.classList.contains("is-international")) {
      var missingPass = namedRows.some(function (row) {
        var p = row.querySelector("[data-traveler-passport]");
        return !p || !p.value.trim();
      });
      if (missingPass) { showTravelerError(err, "nopass", lang); return false; }
    }

    if (err) err.style.display = "none";
    return true;
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
    if (control.matches("[data-traveler-name], [data-traveler-passport]") && control.value.trim()) {
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
      var intl = container.classList.contains("is-international");
      var clone = rows[rows.length - 1].cloneNode(true); // keeps current language
      clone.querySelectorAll("input").forEach(function (inp) {
        inp.value = "";
        inp.removeAttribute("required");        // only the first traveler's name is required
        inp.removeAttribute("aria-invalid");
        // Keep passport required while international (validated per named traveler)
        if (intl && inp.hasAttribute("data-traveler-passport")) inp.setAttribute("required", "");
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

  /* ---------- Trip scope (domestic / international) → toggle passports ---------- */
  document.querySelectorAll('[data-role="trip-scope"]').forEach(function (sel) {
    function sync() {
      var intl = sel.value === "international";
      var form = sel.closest(".request-form");
      var container = form.querySelector("[data-travelers]");
      if (!container) return;
      container.classList.toggle("is-international", intl);
      container.querySelectorAll("[data-traveler-passport]").forEach(function (p) {
        if (intl) {
          p.setAttribute("required", "");
        } else {
          p.removeAttribute("required");
          p.value = "";
          p.removeAttribute("aria-invalid");
        }
      });
      if (!intl) {
        var err = container.querySelector("[data-travelers-error]");
        if (err) err.style.display = "none";
      }
    }
    sel.addEventListener("change", sync);
    sync();
  });

  /* ---------- Children count → toggle "children ages" field ---------- */
  document.querySelectorAll('[data-role="children-count"]').forEach(function (input) {
    function sync() {
      var n = parseInt(input.value, 10) || 0;
      var form = input.closest(".request-form");
      var field = form.querySelector('[data-role="children-ages-field"]');
      var ages = form.querySelector('[data-role="children-ages"]');
      if (field) field.style.display = n > 0 ? "" : "none";
      if (ages && n <= 0) {
        ages.value = "";
        var f = ages.closest(".field");
        if (f) f.classList.remove("field--error");
      }
    }
    input.addEventListener("input", sync);
    input.addEventListener("change", sync);
    sync();
  });

  /* ---------- "Demander des infos" buttons → prefill the voyage form ---------- */
  document.querySelectorAll("[data-trip-request]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = currentLang();
      var dest = btn.getAttribute("data-dest-" + lang) || btn.getAttribute("data-dest-fr") || "";
      activateTab("voyages");
      var input = document.querySelector('.forms__panel[data-panel="voyages"] [data-role="trip-destination"]')
                || document.querySelector('[data-role="trip-destination"]');
      if (input) {
        input.value = dest;
        var f = input.closest(".field");
        if (f) f.classList.remove("field--error");
        input.removeAttribute("aria-invalid");
      }
      var section = document.getElementById("request");
      if (section) {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    });
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
          var passport = row.querySelector("[data-traveler-passport]");
          var nv = name ? name.value.trim() : "";
          var av = age ? age.value.trim() : "";
          var pv = passport ? passport.value.trim() : "";
          if (!nv && !av && !pv) return;
          var ageWord = lang === "ar" ? "العمر" : "âge";
          var passWord = lang === "ar" ? "جواز" : "passeport";
          var line = (collected.length + 1) + ". " + nv;
          if (av) line += " (" + ageWord + " " + av + ")";
          if (pv) line += " — " + passWord + ": " + pv;
          collected.push(line);
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

  /* ---------- Clipboard + toast (for Messenger) ---------- */
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }
  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch (e) { return false; }
  }

  var toastTimer = null;
  function showToast(msg) {
    var toast = document.getElementById("djToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "djToast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    // force reflow so the transition re-triggers
    void toast.offsetWidth;
    toast.classList.add("is-visible");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 3200);
  }

  /* ---------- Send (WhatsApp / Messenger) ---------- */
  function formIsValid(form) {
    var ok = validate(form);
    var okTravelers = validateTravelers(form);
    if (ok && okTravelers) return true;
    var bad = form.querySelector(".field--error input, .field--error select, .field--error textarea");
    if (bad) { bad.focus(); }
    else if (!okTravelers) {
      var t = form.querySelector("[data-traveler-name]");
      if (t) t.focus();
    }
    return false;
  }

  document.querySelectorAll(".wa-send").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var form = btn.closest(".request-form");
      if (!form) return;
      if (!formIsValid(form)) return;

      var lang = currentLang();
      var message = buildMessage(form, lang);
      var channel = btn.getAttribute("data-send") || "whatsapp";

      if (channel === "messenger") {
        // Messenger can't carry a prefilled message → copy it for the user to paste
        copyToClipboard(message);
        showToast(lang === "ar"
          ? "تم نسخ طلبك ✓ الصقه في المحادثة (Ctrl+V)"
          : "Demande copiée ✓ Collez-la dans la conversation (Ctrl+V)");
        window.open(MESSENGER_URL, "_blank", "noopener");
      } else {
        window.open("https://wa.me/" + SEND_NUMBER + "?text=" + encodeURIComponent(message), "_blank", "noopener");
      }
    });
  });
})();
