/* ============================================================
   Contact Us — Variant B interactivity
   Vanilla JS, no dependencies. Three independent widgets:
   the support avatar, the contact form, and the office finder.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Support avatar — click to play the intro video.
        The progress ring tracks real playback; the idle play
        button and LIVE badge toggle via the .is-playing class.
     --------------------------------------------------------- */
  (function avatar() {
    var root = document.getElementById("avatar");
    var video = document.getElementById("avatarVideo");
    if (!root || !video) return;
    var ring = root.querySelector(".avatar__ring-progress");
    var CIRCUMFERENCE = 301.6; // 2πr, r = 48 in the 100×100 viewBox

    function setProgress(p) {
      ring.style.strokeDashoffset = (CIRCUMFERENCE * (1 - p)).toFixed(1);
    }

    function play() {
      if (root.classList.contains("is-playing")) return;
      root.classList.add("is-playing");
      root.setAttribute("aria-label", "Stop support intro video");
      var p = video.play();
      // If the browser blocks playback (autoplay policy, missing codec),
      // fall back to the idle state instead of a stuck "playing" UI.
      if (p && typeof p.catch === "function") p.catch(stop);
    }

    function stop() {
      root.classList.remove("is-playing");
      root.setAttribute("aria-label", "Play support intro video");
      video.pause();
      setProgress(0);
      // Restore the poster frame. Without load(), the element would freeze
      // on the last played frame; load() returns it to its poster state.
      try { video.load(); } catch (e) {}
    }

    function toggle() {
      root.classList.contains("is-playing") ? stop() : play();
    }

    video.addEventListener("timeupdate", function () {
      if (video.duration) setProgress(video.currentTime / video.duration);
    });
    video.addEventListener("ended", stop);
    // Keep the UI honest if playback pauses for any other reason.
    video.addEventListener("pause", function () {
      if (!video.ended && video.currentTime > 0) root.classList.remove("is-playing");
    });

    root.addEventListener("click", toggle);
    root.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  })();

  /* ---------------------------------------------------------
     2. Contact form — client-side validation + success state.
     --------------------------------------------------------- */
  (function contactForm() {
    var form = document.getElementById("contactForm");
    var success = document.getElementById("formSuccess");
    if (!form || !success) return;

    var successText = document.getElementById("successText");
    var resetBtn = document.getElementById("resetForm");
    var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    function fieldEls(name) {
      return {
        input: form.querySelector('[name="' + name + '"]'),
        error: form.querySelector('[data-error-for="' + name + '"]'),
      };
    }

    function showError(name, msg) {
      var f = fieldEls(name);
      if (f.input) f.input.classList.add("is-invalid");
      if (f.error) {
        f.error.textContent = msg;
        f.error.hidden = false;
      }
    }

    function clearError(name) {
      var f = fieldEls(name);
      if (f.input) f.input.classList.remove("is-invalid");
      if (f.error) {
        f.error.textContent = "";
        f.error.hidden = true;
      }
    }

    function validate() {
      var errors = {};
      var fullName = form.fullName.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      if (!fullName) errors.fullName = "Please enter your name";
      if (!email) errors.email = "Work email is required";
      else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
      if (!message) errors.message = "Tell us how we can help";
      return errors;
    }

    // Clear a field's error as soon as the user edits it.
    ["fullName", "email", "message"].forEach(function (name) {
      var f = fieldEls(name);
      if (f.input) f.input.addEventListener("input", function () { clearError(name); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      ["fullName", "email", "message"].forEach(clearError);

      var errors = validate();
      var names = Object.keys(errors);
      if (names.length) {
        names.forEach(function (n) { showError(n, errors[n]); });
        var first = fieldEls(names[0]).input;
        if (first) first.focus();
        return;
      }

      var firstName = form.fullName.value.trim().split(" ")[0] || "there";
      successText.innerHTML =
        "Thanks, " + escapeHtml(firstName) +
        " &mdash; a member of our team will get back to you within one business day.";
      form.hidden = true;
      success.hidden = false;
    });

    resetBtn.addEventListener("click", function () {
      form.reset();
      ["fullName", "email", "message"].forEach(clearError);
      success.hidden = true;
      form.hidden = false;
      form.fullName.focus();
    });

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }
  })();

  /* ---------------------------------------------------------
     3. Office finder — tabbed list of regional offices.
     --------------------------------------------------------- */
  (function officeFinder() {
    var tabsEl = document.getElementById("officeTabs");
    var listEl = document.getElementById("officeList");
    if (!tabsEl || !listEl) return;

    var offices = [
      { label: "Global Headquarters", city: "Santa Clara, USA", addr: "5201 Great America Pkwy, Suite 441, Santa Clara, CA 95054" },
      { label: "India Headquarters", city: "Bangalore", addr: "No. 297, 1st Floor, 7th C Main, 35th Cross, 4th Block, Jayanagar, Bangalore 560011" },
      { label: "Sales & Implementation", city: "Mumbai", addr: "#102, Umang Pravadevi CHS, P M Road, Vile Parle (East), Mumbai 400057" },
      { label: "Implementation Center", city: "Pune", addr: "4th, Vascon Almonte IT Park, Chowk, Mundhwa – Kharadi Rd, near Radisson Blu, Rakshak Nagar, Kharadi, Pune, Maharashtra 411014, India" },
      { label: "Innovation & R&D", city: "Bhubaneswar", addr: "2nd Floor, 42 Sachivalaya Marg, Madhusudan Nagar, Bhubaneswar 751001" },
      { label: "Sales Office", city: "New Delhi", addr: "VAR House, A-84A/3, Paryavaran Complex, IGNOU Road, New Delhi – 110030" },
      { label: "International", city: "Edmonton, Canada", addr: "Strathcona Business Park, 3907-98 St. Ste 110, Edmonton, AB T4E 6M3" },
    ];
    // Which offices appear under each region tab (indices into `offices`).
    var regions = {
      USA: [0],
      Canada: [6],
      India: [1, 5, 2],
      "R&D": [4],
    };

    var PIN =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none">' +
      '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" stroke="var(--brand)" stroke-width="1.7"></path>' +
      '<circle cx="12" cy="10" r="2.4" stroke="var(--brand)" stroke-width="1.7"></circle></svg>';

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    function render(region) {
      var indices = regions[region] || [];
      listEl.innerHTML = indices.map(function (i) {
        var o = offices[i];
        return (
          '<div class="office-card">' +
            '<div class="office-card__head">' + PIN +
              '<div class="office-card__label">' + escapeHtml(o.label) + "</div>" +
            "</div>" +
            '<div class="office-card__city">' + escapeHtml(o.city) + "</div>" +
            '<div class="office-card__addr">' + escapeHtml(o.addr) + "</div>" +
          "</div>"
        );
      }).join("");
    }

    tabsEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".office-tab");
      if (!btn) return;
      tabsEl.querySelectorAll(".office-tab").forEach(function (t) {
        var active = t === btn;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      render(btn.dataset.tab);
    });

    render("USA"); // default region
  })();

  /* ---------------------------------------------------------
     4. Weekly support-agent name — rotates through the roster
        once per week, flipping each Monday (UTC). To change the
        roster, edit AGENT_NAMES; names cycle in array order.
     --------------------------------------------------------- */
  (function weeklyName() {
    var el = document.getElementById("avatarName");
    if (!el) return;

    var AGENT_NAMES = ["Swarnam", "Tedra", "Mahi", "Ritu"];

    // Anchor on Monday 2024-01-01 00:00 UTC so each week starts on a Monday.
    var WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    var anchor = Date.UTC(2024, 0, 1);
    var weeks = Math.floor((Date.now() - anchor) / WEEK_MS);
    var i = ((weeks % AGENT_NAMES.length) + AGENT_NAMES.length) % AGENT_NAMES.length;

    el.textContent = AGENT_NAMES[i];
  })();
})();
