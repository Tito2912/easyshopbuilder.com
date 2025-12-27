/* ==========================================================================
   EasyShopBuilder — Single global script (Enhanced Professional Edition)
   - Burger menu (ARIA)
   - FAQ accordion
   - Cookie banner (RGPD) + GA4 conditional load
   - Language redirect (non-FR -> EN) + manual override
   - Blog search (client-side)
   - Lazy YouTube (nocookie) embed
   - Newsletter -> Google Sheets (Apps Script) with honeypot, delay, reCAPTCHA v3 hooks
   - Premium scroll animations & enhanced interactions
   ========================================================================== */

(() => {
  "use strict";

  document.documentElement.classList.add("js-enabled");

  /* ---------------------------
     Small DOM helpers
  ----------------------------*/
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const mediaMatches = (query, fallback = false) => {
    if (typeof window.matchMedia !== "function") return fallback;
    return window.matchMedia(query).matches;
  };
  const runWhenIdle = (cb, timeout = 1000) => {
    if ("requestIdleCallback" in window) {
      return window.requestIdleCallback(cb, { timeout });
    }
    return window.setTimeout(cb, timeout);
  };
  const getPageId = () => (document.body ? document.body.getAttribute("data-page") || "" : "");
  const pageIdIncludes = (chunk) => {
    if (!chunk) return false;
    return getPageId().toLowerCase().includes(String(chunk).toLowerCase());
  };
  const onFirstInteraction = (cb, fallbackDelay = 5000) => {
    let done = false;
    const events = ["pointerdown", "touchstart", "keydown", "wheel"];
    const cleanup = () => events.forEach((event) => window.removeEventListener(event, handler));
    const handler = () => {
      if (done) return;
      done = true;
      cleanup();
      cb();
    };
    events.forEach((event) =>
      window.addEventListener(event, handler, { once: true, passive: true })
    );
    window.setTimeout(handler, fallbackDelay);
  };
  const onReady = (cb) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", cb);
    } else {
      cb();
    }
  };

  /* ---------------------------
     Safe storage helpers (localStorage can throw in hardened contexts)
  ----------------------------*/
  const storage = (() => {
    try {
      const ls = window.localStorage;
      const testKey = "__esb_ls_test__";
      ls.setItem(testKey, "1");
      ls.removeItem(testKey);
      return ls;
    } catch {
      return null;
    }
  })();

  const getStorageItem = (key) => {
    if (!storage) return null;
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  };

  const setStorageItem = (key, value) => {
    if (!storage) return;
    try {
      storage.setItem(key, value);
    } catch {
      /* ignore quota/storage errors */
    }
  };

  /* ---------------------------
     Footer year
  ----------------------------*/
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------
     Burger menu (mobile + desktop ARIA)
  ----------------------------*/
  const navToggle = $(".nav__toggle");
  const navMenu = $("#navMenu");
  if (navToggle && navMenu) {
    const setExpanded = (state) => {
      navToggle.setAttribute("aria-expanded", String(state));
      if (state) {
        navMenu.classList.add("is-open");
      } else {
        navMenu.classList.remove("is-open");
      }
    };
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      setExpanded(!expanded);
    });
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        setExpanded(false);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setExpanded(false);
    });
  }

  /* ---------------------------
     FAQ accordion (data-accordion scope)
  ----------------------------*/
  $$('[data-accordion] .faq__item').forEach((item) => {
    const btn = $(".faq__q", item);
    const ans = $(".faq__a", item);
    if (!btn || !ans) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (!open) {
        item.classList.add("is-open");
      } else {
        item.classList.remove("is-open");
      }
    });
  });

  /* ---------------------------
     Language redirect (non-FR -> EN)
     Rules:
     - If HTML lang starts with 'fr' AND user has no manual override
       AND navigator.languages does NOT include a 'fr' locale,
       redirect to the EN mirror path.
     - Manual override via click on .lang-switch__item sets localStorage 'esb-lang'
       ('fr' or 'en') and is respected across pages.
  ----------------------------*/
  const LANG_KEY = "esb-lang";
  const htmlLang = document.documentElement.lang || "";
  const normaliseLang = (value) => (value || "").toLowerCase();
  const baseLang = (value) => {
    const normalized = normaliseLang(value);
    const dashIndex = normalized.indexOf("-");
    return dashIndex > -1 ? normalized.slice(0, dashIndex) : normalized;
  };
  const langOverride = baseLang(getStorageItem(LANG_KEY));

  // Attach override on language switch links
  $$(".lang-switch__item").forEach((a) => {
    a.addEventListener("click", () => {
      const targetLang = a.getAttribute("hreflang") || "";
      const overrideValue = baseLang(targetLang);
      if (overrideValue) setStorageItem(LANG_KEY, overrideValue);
    });
  });

  const isFrenchUA = (() => {
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    return langs.some((l) => l && l.toLowerCase().startsWith("fr"));
  })();

  // Map FR path -> EN path
  const mapToEN = (path) => {
    const clean = path.replace(/[#?].*$/, "");
    switch (clean) {
      case "/":
      case "/index.html":
        return "/en/";
      case "/blog":
      case "/blog.html":
        return "/en/blog";
      case "/blog-shopify":
      case "/blog-shopify.html":
        return "/en/blog-shopify";
      case "/mentions-legales":
      case "/mentions-legales.html":
        return "/en/legal-notice";
      case "/politique-de-confidentialite":
      case "/politique-de-confidentialite.html":
        return "/en/privacy-policy";
      default:
        // If already under /en, keep it; otherwise prefix /en
        return clean.startsWith("/en/") ? clean : `/en${clean.endsWith("/") ? clean : clean + ""}`;
    }
  };

  if (normaliseLang(htmlLang).startsWith("fr")) {
    const onFRPage = !location.pathname.startsWith("/en/");
    if (onFRPage && !isFrenchUA && (!langOverride || langOverride !== "fr")) {
      // Avoid redirect loops: if we are already on EN, or override=fr, do nothing
      const target = mapToEN(location.pathname) + location.search + location.hash;
      // Use replace() to avoid polluting history
      location.replace(target);
    }
  }

  /* ---------------------------
     Blog search (client-side)
  ----------------------------*/
  const initBlogSearch = () => {
    const searchForm = $("#blogSearch");
    const searchInput = $("#blogSearch #q");
    const searchScope = $("[data-search-scope]");
    const noResults = $("#noResults");
    if (!searchForm || !searchInput || !searchScope) return;

    const cards = $$("[data-search-scope] .card");
    const syncFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");
        if (query) searchInput.value = query;
      } catch {
        /* ignore malformed query */
      }
    };
    const syncUrl = () => {
      if (!window.history || !window.history.replaceState) return;
      try {
        const url = new URL(window.location.href);
        const value = (searchInput.value || "").trim();
        if (value) {
          url.searchParams.set("q", value);
        } else {
          url.searchParams.delete("q");
        }
        window.history.replaceState({}, "", url);
      } catch {
        /* ignore URL errors */
      }
    };
    const filter = () => {
      const q = (searchInput.value || "").trim().toLowerCase();
      let shown = 0;
      cards.forEach((card) => {
        const title = (card.getAttribute("data-title") || "").toLowerCase();
        const tags = (card.getAttribute("data-tags") || "").toLowerCase();
        const ok = !q || title.includes(q) || tags.includes(q);
        card.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      if (noResults) noResults.hidden = shown !== 0;
    };
    syncFromUrl();
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      syncUrl();
      filter();
    });
    searchInput.addEventListener("input", () => {
      filter();
      syncUrl();
    });
    filter();
  };
  if (pageIdIncludes("blog")) {
    onReady(() => runWhenIdle(initBlogSearch, 800));
  }

  /* ---------------------------
     Lazy YouTube (nocookie embed)
  ----------------------------*/
  const initLazyYouTube = () => {
    $$(".video-thumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-video");
        if (!url) return;
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.paddingTop = "56.25%";
        wrapper.style.borderRadius = "16px";
        wrapper.style.overflow = "hidden";
        wrapper.style.boxShadow = "0 8px 30px rgba(0,0,0,.12)";
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.loading = "lazy";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
        iframe.referrerPolicy = "no-referrer";
        iframe.sandbox = "allow-scripts allow-same-origin allow-presentation";
        iframe.style.position = "absolute";
        iframe.style.inset = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        wrapper.appendChild(iframe);
        btn.replaceWith(wrapper);
      });
    });
  };
  onReady(() => {
    if (!$(".video-thumb")) return;
    runWhenIdle(initLazyYouTube, 1200);
  });

  /* ---------------------------
     Premium Scroll Animations
  ----------------------------*/
  const initScrollAnimations = () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = mediaMatches('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion) return;

    const animatableElements = $$('[data-animate]');
    if (!animatableElements.length) return;

    if (!("IntersectionObserver" in window)) {
      animatableElements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.classList.remove('will-animate');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatableElements.forEach(el => {
      el.classList.add('will-animate');
      observer.observe(el);
    });
  };

  /* ---------------------------
     Enhanced Hover Effects
  ----------------------------*/
  const initEnhancedInteractions = () => {
    const prefersReducedMotion = mediaMatches('(prefers-reduced-motion: reduce)');
    const precisePointer = mediaMatches('(pointer:fine)', true);
    if (prefersReducedMotion || !precisePointer) return;

    // Add ripple effect to buttons
    $$('.btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        if (this.classList.contains('btn--disabled')) return;
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s linear;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Enhanced card interactions
    $$('.card, .benefit, .feature, .usecase').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  };

  /* ---------------------------
     Deferred HTML5 videos (hero + resources)
  ----------------------------*/
  const initDelayedVideos = () => {
    const videos = $$("video[data-delayed-src]");
    if (!videos.length) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loadVideo = (video) => {
      if (!video) return;
      const handled = video.dataset.loaded === "true" || video.dataset.loaded === "skipped";
      if (handled) return;
      if (prefersReducedMotion && video.hasAttribute("data-prefer-static")) {
        video.dataset.loaded = "skipped";
        return;
      }

      const delayedSrc = video.getAttribute("data-delayed-src");
      if (delayedSrc) video.src = delayedSrc;
      $$("source[data-delayed-src]", video).forEach((source) => {
        source.src = source.getAttribute("data-delayed-src");
      });

      try {
        video.load();
      } catch {
        /* ignore load errors */
      }

      if (video.autoplay) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      }
      video.dataset.loaded = "true";
    };

    const observeVisibility = () => {
      if (!("IntersectionObserver" in window)) {
        runWhenIdle(() => videos.forEach((video) => loadVideo(video)), 1500);
        return;
      }
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadVideo(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "200px" }
      );
      videos.forEach((video) => io.observe(video));
    };

    const attachInteractionFallbacks = () => {
      videos.forEach((video) => {
        const trigger = () => loadVideo(video);
        video.addEventListener("pointerdown", trigger, { once: true });
        video.addEventListener("play", trigger, { once: true });
        video.addEventListener("keydown", trigger, { once: true });
      });
    };

    observeVisibility();
    attachInteractionFallbacks();

    // Absolute safety net so background video eventually loads after first paint
    window.setTimeout(() => videos.forEach((video) => loadVideo(video)), 6000);
  };

  onReady(() => {
    if (!$(".js-delayed-video")) return;
    runWhenIdle(initDelayedVideos, 900);
  });

  /* ---------------------------
     Cookie banner (opt-in) + GA4 conditional
  ----------------------------*/
  const CONSENT_KEY = "esb-consent-v1";
  const CONSENT_LOG_KEY = "esb-consent-log";
  const GA_ID = "G-9SRRTG6649";
  const cookieBanner = $("#cookieBanner");
  const cookieForm = $("#cookieForm");

  const getConsent = () => {
    try { return JSON.parse(getStorageItem(CONSENT_KEY) || "null"); }
    catch { return null; }
  };

  const saveConsent = (consent) => {
    setStorageItem(CONSENT_KEY, JSON.stringify(consent));
    // Append to local log
    let log = [];
    try { log = JSON.parse(getStorageItem(CONSENT_LOG_KEY) || "[]"); } catch {}
    log.push({ ts: new Date().toISOString(), consent, path: location.pathname });
    setStorageItem(CONSENT_LOG_KEY, JSON.stringify(log.slice(-100))); // keep last 100
  };

  const showBanner = () => cookieBanner && (cookieBanner.hidden = false);
  const hideBanner = () => cookieBanner && (cookieBanner.hidden = true);

  const injectGA4 = () => {
    if (!GA_ID) return;
    // Guard: do not double-inject
    if (window.__gaInjected) return;
    window.__gaInjected = true;

    // Stub gtag to queue calls until script loads
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;

    // Consent default: denied
    gtag("consent", "default", {
      ad_user_data: "denied",
      ad_personalization: "denied",
      ad_storage: "denied",
      analytics_storage: "denied"
    });

    // Load GA4
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    s.referrerPolicy = "no-referrer";
    document.head.appendChild(s);

    // Initialize
    gtag("js", new Date());
    gtag("config", GA_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    // If consent already granted, update now (otherwise cookieForm will update below)
    const c = getConsent();
    if (c && c.analytics === true) {
      gtag("consent", "update", { analytics_storage: "granted" });
    }
  };

  // Initialize banner state
  const currentConsent = getConsent();
  if (!currentConsent) {
    showBanner();
  } else {
    hideBanner();
    if (currentConsent.analytics === true) {
      injectGA4(); // load analytics now
      if (window.gtag) window.gtag("consent", "update", { analytics_storage: "granted" });
    }
  }

  if (cookieForm) {
    const analyticsCheckbox = cookieForm.elements["analytics"];

    const apply = (choice) => {
      const consent = {
        necessary: true,
        analytics: choice,
        ts: new Date().toISOString(),
        ver: "1.0.0"
      };
      saveConsent(consent);
      hideBanner();
      if (choice === true) {
        injectGA4();
        if (window.gtag) window.gtag("consent", "update", { analytics_storage: "granted" });
      } else {
        // If GA was loaded previously, update to denied
        if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
      }
    };

    cookieForm.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      e.preventDefault();
      const action = btn.getAttribute("data-action");
      if (action === "accept") apply(true);
      if (action === "reject") apply(false);
      if (action === "save") apply(!!(analyticsCheckbox && analyticsCheckbox.checked));
    });
  }

  // Expose a simple API to reopen the banner (optional link)
  window.CookieConsent = {
    open: () => showBanner(),
    read: () => getConsent()
  };

  /* ---------------------------
     Newsletter -> Google Sheets (Apps Script)
     Requirements:
     - Form has id="newsletterForm"
     - data-endpoint="https://script.google.com/macros/s/XXXXXXXX/exec" (Apps Script Web App URL)
     - Honeypot input name="website" (hidden)
     - Button id="newsletterSubmit"
     - Optional reCAPTCHA v3: <div id="recaptcha-container" data-sitekey="SITE_KEY"></div>
  ----------------------------*/
  const initNewsletterForm = () => {
    const newsletterForm = $("#newsletterForm");
    if (!newsletterForm) return;

    const endpoint = newsletterForm.getAttribute("data-endpoint") || "";
    const hp = newsletterForm.querySelector('input[name="website"]');
    const emailInput = newsletterForm.querySelector('input[name="email"]');
    const submitBtn = $("#newsletterSubmit");
    const msg = $(".form__msg", newsletterForm);

    const setMsg = (text, ok = false) => {
      if (!msg) return;
      msg.textContent = text;
      msg.style.color = ok ? "var(--primary)" : "var(--muted)";
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      setTimeout(() => { submitBtn.disabled = false; }, 1500);
    }

    const recaptchaBox = $("#recaptcha-container");
    const recaptchaKey = recaptchaBox ? (recaptchaBox.getAttribute("data-sitekey") || "") : "";
    if (recaptchaKey) {
      const recaptchaScript = document.createElement("script");
      recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaKey)}`;
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      document.head.appendChild(recaptchaScript);
    }

    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (submitBtn) submitBtn.disabled = true;

      if (hp && hp.value.trim() !== "") {
        return;
      }
      const email = emailInput ? emailInput.value.trim() : "";
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMsg(document.documentElement.lang.startsWith("fr") ? "Veuillez saisir un e-mail valide." : "Please enter a valid email.");
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      if (!endpoint) {
        setMsg(document.documentElement.lang.startsWith("fr")
          ? "Endpoint Apps Script manquant. Suivez le README pour connecter Google Sheets."
          : "Missing Apps Script endpoint. See README to connect Google Sheets.");
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      let token = "";
      try {
        if (recaptchaKey && window.grecaptcha && window.grecaptcha.execute) {
          token = await window.grecaptcha.execute(recaptchaKey, { action: "newsletter_signup" });
        }
      } catch { /* ignore token errors */ }

      const payload = {
        email,
        lang: htmlLang || (document.body.getAttribute("data-page") || "").includes("-fr") ? "fr" : "en",
        ts: new Date().toISOString(),
        recaptchaToken: token
      };

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "omit",
          cache: "no-store",
          referrerPolicy: "no-referrer"
        });
        if (!res.ok) throw new Error(String(res.status));
        const okText = document.documentElement.lang.startsWith("fr")
          ? "Merci ! Vérifiez votre boîte mail (ou vos spams)."
          : "Thank you! Check your inbox (and spam).";
        setMsg(okText, true);
        newsletterForm.reset();
      } catch (err) {
        const errText = document.documentElement.lang.startsWith("fr")
          ? "Erreur d'envoi. Réessayez plus tard."
          : "Submission error. Please try again later.";
        setMsg(errText);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  };
  onReady(() => {
    if (!$("#newsletterForm")) return;
    runWhenIdle(initNewsletterForm, 1500);
  });

  /* ---------------------------
     Enable "open cookies" link if present
     (e.g., in footer we can attach data-open-cookie)
  ----------------------------*/
  $$('[data-open-cookie]').forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.CookieConsent.open();
    });
  });

  /* ---------------------------
     Initialize Premium Features
  ----------------------------*/
  const hasEnhancementTargets =
    document.querySelector("[data-animate]") ||
    document.querySelector(".btn") ||
    document.querySelector(".card") ||
    document.querySelector(".benefit") ||
    document.querySelector(".feature") ||
    document.querySelector(".usecase");

  if (hasEnhancementTargets) {
    onFirstInteraction(() => {
      runWhenIdle(() => {
        initScrollAnimations();
        initEnhancedInteractions();
        document.body.classList.add('loaded');
      }, 300);
    }, 5200);
  }

  /* ---------------------------
     Add CSS for ripple animation
  ----------------------------*/
  runWhenIdle(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }, 1000);

  /* ---------------------------
     IndexNow ping for Bing
     (runs once per deployment in production)
  ----------------------------*/
  const pingIndexNow = () => {
    const INDEXNOW_KEY = "0a7b6f0b2db44eac9fd12d34a41ae9c3";
    const storageKey = "esb-indexnow";
    const hostOk = /(?:^|\.)easyshopbuilder\.com$/i.test(window.location.hostname);
    if (!hostOk || !storage) return;
    const stampDate = (() => {
      const parsed = new Date(document.lastModified);
      if (Number.isNaN(parsed.getTime())) return "";
      return parsed.toISOString().slice(0, 10);
    })();
    let cachedStamp = "";
    try {
      const cached = JSON.parse(getStorageItem(storageKey) || "{}");
      cachedStamp = cached.stamp || "";
      if (stampDate && cachedStamp && stampDate <= cachedStamp) return;
    } catch {
      /* ignore stale cache */
    }
    const sitemapUrl = `${window.location.origin}/sitemap-index.xml`;
    const endpoint = `https://www.bing.com/indexnow?url=${encodeURIComponent(sitemapUrl)}&key=${INDEXNOW_KEY}`;
    fetch(endpoint, { method: "GET", mode: "no-cors", keepalive: true }).catch(() => {});
    try {
      setStorageItem(storageKey, JSON.stringify({ stamp: stampDate || cachedStamp || "pending", ts: Date.now() }));
    } catch {
      /* ignore storage quota */
    }
  };

  window.addEventListener("load", () => {
    window.setTimeout(pingIndexNow, 1500);
  });

})();
