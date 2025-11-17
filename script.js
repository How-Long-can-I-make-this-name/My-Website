document.addEventListener("DOMContentLoaded", () => {
  // Init lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Dynamic year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Tabs & pages
  const pages = Array.from(document.querySelectorAll(".tab-page"));
  const navButtons = Array.from(document.querySelectorAll(".js-nav-btn"));
  const tabButtons = Array.from(document.querySelectorAll(".js-tab-btn"));

  function setActivePage(pageId) {
    // Pages
    pages.forEach((page) => {
      const isActive = page.id === pageId;
      page.classList.toggle("hidden", !isActive);
      page.classList.remove("is-active", "is-inactive");
      page.classList.add(isActive ? "is-active" : "is-inactive");
    });

    // Sidebar nav
    navButtons.forEach((btn) => {
      const target = btn.getAttribute("data-page-target");
      const active = target === pageId;
      btn.classList.toggle("bg-white/10", active);
      btn.classList.toggle("ring-1", active);
      btn.classList.toggle("ring-white/20", active);
    });

    // Top tab bar
    tabButtons.forEach((btn) => {
      const target = btn.getAttribute("data-page-target");
      const active = target === pageId;
      btn.classList.toggle("bg-white/10", active);
      btn.classList.toggle("ring-1", active);
      btn.classList.toggle("ring-white/20", active);
    });
  }

  function setupTabButtons(buttons) {
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const pageId = btn.getAttribute("data-page-target");
        if (pageId) setActivePage(pageId);
      });
    });
  }

  setupTabButtons(navButtons);
  setupTabButtons(tabButtons);

  // Initial page
  setActivePage("experience");

  // Morph cards (hover/tap reveal)
  const morphCards = Array.from(document.querySelectorAll(".js-morph-card"));

  morphCards.forEach((card) => {
    const summary = card.querySelector(".js-morph-summary");
    const details = card.querySelector(".js-morph-details");
    if (!summary || !details) return;

    let open = false;

    function openCard() {
      open = true;
      summary.classList.add("hidden");
      details.classList.remove("hidden");
      card.classList.add("open");
    }

    function closeCard() {
      open = false;
      details.classList.add("hidden");
      summary.classList.remove("hidden");
      card.classList.remove("open");
    }

    // Hover for desktop
    card.addEventListener("mouseenter", () => openCard());
    card.addEventListener("mouseleave", () => closeCard());

    // Tap/click toggle for touch
    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (open) {
        closeCard();
      } else {
        openCard();
      }
    });
  });

  // Toast + clipboard copy
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");
  let toastTimeout = null;

  function showToast(label) {
    if (!toast || !toastText) return;
    toastText.textContent = `Copied ${label} to clipboard`;
    toast.classList.remove("opacity-0", "pointer-events-none");

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add("opacity-0", "pointer-events-none");
    }, 1500);
  }

  function copyText(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast(label))
        .catch(() => fallbackCopy(text, label));
    } else {
      fallbackCopy(text, label);
    }
  }

  function fallbackCopy(text, label) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast(label);
    } catch (e) {
      console.warn("Clipboard unsupported", e);
    }
  }

  const copyButtons = Array.from(document.querySelectorAll(".js-copy-btn"));
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy-text");
      const label = btn.getAttribute("data-copy-label") || "value";
      if (text) copyText(text, label);
    });
  });

  // (Optional) mini smoke checks
  console.log("[SMOKE] Pages found:", pages.map((p) => p.id));
  console.log("[SMOKE] Nav buttons:", navButtons.length, "Tab buttons:", tabButtons.length);
});
