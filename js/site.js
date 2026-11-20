/* Fabritory placeholder — theme toggle, hero rewrite line, hero stack, launch countdown.
   No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  var darkMq = window.matchMedia("(prefers-color-scheme: dark)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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

  /* Hero stack: deposit the strata bottom-up once, then leave them alone. The top
     stratum sweeps in last, the way the layer being printed does. CSS holds the
     finished state, so nothing moves when motion is reduced. */
  var stack = document.querySelector(".stack");
  if (stack) {
    var layers = stack.children;
    var count = layers.length;
    for (var i = 0; i < count; i++) {
      layers[i].style.setProperty("--d", ((count - 1 - i) * 0.045).toFixed(3) + "s");
    }
    if (count) layers[0].style.setProperty("--d", ((count - 1) * 0.045 + 0.1).toFixed(3) + "s");
    stack.classList.add("printing");
  }

  /* Hero: retype the last line of the headline through a few endings.
     The markup already holds the first ending, so the line reads correctly before this runs. */
  var rwText = document.querySelector(".rw-text");
  var rwCaret = document.querySelector(".rw-caret");
  var endings = ["Many materials.", "No painting.", "No assembly.", "Hard and soft.", "One part, done."];

  if (rwText && rwCaret && !reduceMotion.matches) {
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

    // Let the strata finish printing before the headline starts rewriting itself.
    next(erase, reduceMotion.matches ? 2100 : 2600);
    rwCaret.classList.add("blink");
  } else if (rwCaret) {
    rwCaret.classList.add("blink");
  }

  /* Launch section: days remaining until 1 February 2027. */
  var daysEl = document.getElementById("launch-days");
  var daysLabel = document.querySelector(".readout-label");
  if (daysEl) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var days = Math.ceil((new Date(2027, 1, 1) - today) / 86400000);
    if (days > 0) {
      daysEl.textContent = String(days);
      if (daysLabel) daysLabel.textContent = days === 1 ? "day to go" : "days to go";
    } else {
      daysEl.textContent = "Live";
      if (daysLabel) daysLabel.textContent = "the service is open";
    }
  }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
