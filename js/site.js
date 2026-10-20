/* Fabritory placeholder — theme toggle. No dependencies. */
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

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
