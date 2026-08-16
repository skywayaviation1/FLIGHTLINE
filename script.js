const revealItems = document.querySelectorAll(".reveal");
const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

document.querySelector("#year").textContent = new Date().getFullYear();

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";

  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation",
  );
  mobileNav.classList.toggle("open", !isOpen);
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    mobileNav.classList.remove("open");
  });
});

/* Fleet explorer: type tabs, count-up stats, and comparison bars. */
const explorer = document.querySelector(".explorer");

if (explorer) {
  const tabs = [...explorer.querySelectorAll(".explorer-tab")];
  const marker = explorer.querySelector(".tab-marker");
  const isVertical = () => window.matchMedia("(max-width: 760px)").matches;

  const keyOf = (tab) => tab.id.replace("tab-", "");

  const countUp = (el) => {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;

    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const render = (n) => {
      el.textContent = prefix + Math.round(n).toLocaleString("en-US") + suffix;
    };

    if (prefersReducedMotion) {
      render(target);
      return;
    }

    const duration = 750;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease out so the number settles rather than stopping abruptly.
      render(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const moveMarker = (index) => {
    marker.style.transform = isVertical()
      ? `translateY(${index * 100}%)`
      : `translateX(${index * 100}%)`;
  };

  const select = (index, { focus = false } = {}) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      const key = keyOf(tab);

      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;

      explorer.querySelector(`#panel-${key}`).hidden = !active;
      explorer
        .querySelector(`[data-art="${key}"]`)
        .classList.toggle("is-active", active);
      explorer
        .querySelector(`[data-dim="${key}"]`)
        .classList.toggle("is-active", active);
      explorer
        .querySelectorAll(`.bar[data-for="${key}"]`)
        .forEach((bar) => bar.classList.toggle("is-active", active));
    });

    moveMarker(index);
    explorer
      .querySelector(`#panel-${keyOf(tabs[index])}`)
      .querySelectorAll("[data-count]")
      .forEach(countUp);

    if (focus) tabs[index].focus();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (e.key in keys) {
        e.preventDefault();
        select((i + keys[e.key] + tabs.length) % tabs.length, { focus: true });
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        select(e.key === "Home" ? 0 : tabs.length - 1, { focus: true });
      }
    });
  });

  window.addEventListener("resize", () => {
    moveMarker(tabs.findIndex((tab) => tab.classList.contains("is-active")));
  });

  select(0);

  // Hold the bars at zero until the explorer is on screen, then let them grow.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    explorer.classList.add("is-charted");
  } else {
    const chart = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          explorer.classList.add("is-charted");
          chart.disconnect();
        });
      },
      { threshold: 0.2 },
    );
    chart.observe(explorer);
  }
}
