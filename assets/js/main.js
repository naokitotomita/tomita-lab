(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  var toggleBtn = document.getElementById("theme-toggle");
  var STORAGE_KEY = "tomita-lab-theme";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* ------------------------------------------------------------------
     スクロールで要素をふわっと表示
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    // 同じ親の中で並ぶ要素は少しずつ遅らせて表示する
    revealEls.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentNode.children, function (child) {
        return child.classList.contains("reveal");
      });
      var index = siblings.indexOf(el);
      if (index > 0) {
        el.style.setProperty("--delay", (index * 0.1) + "s");
      }
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ------------------------------------------------------------------
     想いの一文を1文字ずつ分割（スクロールに合わせて点灯）
     ------------------------------------------------------------------ */
  var highlightEl = document.querySelector("[data-highlight]");
  var chars = [];

  if (highlightEl && !reduceMotion) {
    var text = highlightEl.textContent;
    highlightEl.setAttribute("aria-label", text);
    highlightEl.textContent = "";
    Array.prototype.forEach.call(text, function (ch) {
      var span = document.createElement("span");
      span.className = "char";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch;
      highlightEl.appendChild(span);
      chars.push(span);
    });
  }

  /* ------------------------------------------------------------------
     スクロール連動（進捗バー・ヘッダー・パララックス・文字点灯・タイムライン）
     ------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");
  var progressBar = document.querySelector(".scroll-progress");
  var shapes = document.querySelectorAll(".shape[data-speed]");
  var timeline = document.querySelector("[data-progress]");
  var lastY = window.scrollY;
  var ticking = false;

  function clamp01(value) {
    return Math.min(1, Math.max(0, value));
  }

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var maxScroll = document.documentElement.scrollHeight - vh;

    if (progressBar) {
      progressBar.style.setProperty("--progress", maxScroll > 0 ? y / maxScroll : 0);
    }

    if (header) {
      header.classList.toggle("is-scrolled", y > 20);
      header.classList.toggle("is-hidden", y > lastY && y > vh * 0.6);
    }
    lastY = y;

    if (reduceMotion) {
      ticking = false;
      return;
    }

    if (y < vh * 1.2) {
      shapes.forEach(function (shape) {
        var speed = parseFloat(shape.getAttribute("data-speed"));
        shape.style.transform = "translate3d(0," + (y * speed) + "px,0)";
      });
    }

    if (chars.length) {
      var rect = highlightEl.getBoundingClientRect();
      var ratio = clamp01((vh * 0.85 - rect.top) / (rect.height + vh * 0.4));
      var onCount = Math.round(ratio * chars.length);
      chars.forEach(function (span, i) {
        span.classList.toggle("is-on", i < onCount);
      });
    }

    if (timeline) {
      var tRect = timeline.getBoundingClientRect();
      var tRatio = clamp01((vh * 0.75 - tRect.top) / (tRect.height || 1));
      timeline.style.setProperty("--line-progress", tRatio);
    }

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ------------------------------------------------------------------
     お問い合わせフォーム
     ------------------------------------------------------------------ */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var statusEl = contactForm.querySelector(".contact-form__status");
    var submitBtn = contactForm.querySelector(".contact-form__submit");

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var accessKey = contactForm.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === "__WEB3FORMS_ACCESS_KEY__") {
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
