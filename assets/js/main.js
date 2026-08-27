(function () {
  "use strict";

  var root = document.documentElement;
  var toggleBtn = document.getElementById("theme-toggle");
  var STORAGE_KEY = "tomita-lab-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* noop */
    }
  }

  applyTheme(getStoredTheme());

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var effectiveCurrent = current || (prefersDark ? "dark" : "light");
      var next = effectiveCurrent === "dark" ? "light" : "dark";
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var statusEl = contactForm.querySelector(".contact-form__status");
    var submitBtn = contactForm.querySelector(".contact-form__submit");

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var accessKey = contactForm.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
        statusEl.textContent = "フォームは現在準備中です。しばらくお待ちください。";
        statusEl.setAttribute("data-state", "error");
        return;
      }

      submitBtn.disabled = true;
      statusEl.removeAttribute("data-state");
      statusEl.textContent = "送信中...";

      fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm)
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (data.success) {
            statusEl.textContent = "送信しました。ありがとうございます。";
            statusEl.setAttribute("data-state", "success");
            contactForm.reset();
          } else {
            statusEl.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
            statusEl.setAttribute("data-state", "error");
          }
        })
        .catch(function () {
          statusEl.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
          statusEl.setAttribute("data-state", "error");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
