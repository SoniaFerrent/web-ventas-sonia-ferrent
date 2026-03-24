(function () {
  const DISMISS_KEY = "langBannerDismissed";
  const ENGLISH_PATH_PREFIX = "/en";

  if (window.location.pathname.startsWith(ENGLISH_PATH_PREFIX)) return;
  if (window.localStorage.getItem(DISMISS_KEY)) return;

  function shouldShowForLanguage() {
    const lang = (navigator.language || "").toLowerCase();
    return lang.startsWith("en");
  }

  async function shouldShowForCountry() {
    try {
      const response = await fetch("/api/lang-banner-country", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) return false;

      const data = await response.json();
      return !!data.country && data.country.toUpperCase() !== "ES";
    } catch (_error) {
      return false;
    }
  }

  function injectStyles() {
    if (document.getElementById("lang-banner-style")) return;

    const style = document.createElement("style");
    style.id = "lang-banner-style";
    style.textContent = [
      ".lang-banner{position:fixed;top:0;left:0;right:0;z-index:9999;background:#F66F19;color:#fff;font-family:'Montserrat',sans-serif;font-size:14px;display:flex;align-items:center;justify-content:center;padding:10px 20px;gap:12px;box-shadow:0 8px 24px rgba(0,0,0,.12);}",
      ".lang-banner a{color:#fff;font-weight:700;text-decoration:underline;white-space:nowrap;}",
      ".lang-banner button{margin-left:auto;background:none;border:none;color:#fff;font-size:18px;cursor:pointer;line-height:1;}",
      ".lang-banner-offset{scroll-margin-top:56px;}",
      "body.has-lang-banner{padding-top:48px;}",
      "@media(max-width:640px){.lang-banner{padding:10px 14px;justify-content:flex-start;flex-wrap:wrap;}.lang-banner button{margin-left:0;position:absolute;top:12px;right:12px;}body.has-lang-banner{padding-top:72px;}}",
    ].join("");
    document.head.appendChild(style);
  }

  function showBanner() {
    if (document.getElementById("lang-banner")) return;

    injectStyles();

    const banner = document.createElement("div");
    banner.id = "lang-banner";
    banner.className = "lang-banner";
    banner.innerHTML =
      '<span>Are you visiting from outside Spain?</span>' +
      '<a href="/en">View this page in English &rarr;</a>' +
      '<button type="button" aria-label="Dismiss English language banner">✕</button>';

    banner.querySelector("button").addEventListener("click", function () {
      window.localStorage.setItem(DISMISS_KEY, "true");
      document.body.classList.remove("has-lang-banner");
      banner.remove();
    });

    document.body.prepend(banner);
    document.body.classList.add("has-lang-banner");
  }

  async function initBanner() {
    const show = shouldShowForLanguage() || (await shouldShowForCountry());
    if (show) showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBanner, { once: true });
  } else {
    initBanner();
  }
})();
