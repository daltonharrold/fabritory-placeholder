/* Fabritory placeholder — theme toggle, hero rewrite line, launch countdown. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  var darkMq = window.matchMedia("(prefers-color-scheme: dark)");
  var themeButtons = document.querySelectorAll(".theme button");

  function effectiveTheme() {
    return root.dataset.theme || (darkMq.matches ? "dark" : "light");
  }

  function syncThemeButtons() {
    var t = effectiveTheme();
    themeButtons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.t === t)); });
  }

  themeButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      root.dataset.theme = b.dataset.t;
      try { localStorage.setItem("fb-theme", b.dataset.t); } catch (e) {}
      syncThemeButtons();
    });
  });
  darkMq.addEventListener("change", syncThemeButtons);
  syncThemeButtons();

  /* Hero: retype the last line of the headline through a few endings.
     The markup already holds the first ending, so the line reads correctly before this runs. */
  var rwText = document.querySelector(".rw-text");
  var rwCaret = document.querySelector(".rw-caret");
  var endings = ["Many materials.", "No painting.", "No assembly.", "Hard and soft.", "One part, done."];

  if (rwText && rwCaret && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var text = rwText.textContent;
    var idx = endings.indexOf(text);
    var timer = null;
    var pending = null;

    if (idx < 0) { idx = 0; text = endings[0]; rwText.textContent = text; }

    var hold = function () {
      rwCaret.classList.add("blink");
      next(erase, 2100);
    };

    var erase = function () {
      rwCaret.classList.remove("blink");
      if (!text.length) {
        idx = (idx + 1) % endings.length;
        next(type, 340);
        return;
      }
      text = text.slice(0, -1);
      rwText.textContent = text;
      next(erase, 28);
    };

    var type = function () {
      var full = endings[idx];
      if (text.length === full.length) { hold(); return; }
      text = full.slice(0, text.length + 1);
      rwText.textContent = text;
      next(type, 46 + Math.random() * 46);
    };

    function next(fn, ms) {
      pending = fn;
      timer = setTimeout(function () { pending = null; fn(); }, ms);
    }

    // A background tab throttles timers into a stutter, so park the cycle until it's visible again.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        clearTimeout(timer);
      } else if (pending) {
        var resume = pending;
        pending = null;
        timer = setTimeout(resume, 400);
      }
    });

    hold();
  } else if (rwCaret) {
    rwCaret.classList.add("blink");
  }

  /* Launch section: days remaining until 1 January 2027. */
  var daysEl = document.getElementById("launch-days");
  var daysLabel = document.querySelector(".launch-num-label");
  if (daysEl) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var days = Math.ceil((new Date(2027, 0, 1) - today) / 86400000);
    if (days > 0) {
      daysEl.textContent = String(days);
      if (daysLabel) daysLabel.textContent = (days === 1 ? "day" : "days") + " until January 2027";
    } else {
      daysEl.textContent = "Live";
      if (daysLabel) daysLabel.textContent = "Fabritory has launched";
    }
  }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
