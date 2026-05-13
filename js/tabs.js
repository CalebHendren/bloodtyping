/**
 * Tab navigation. Accepts a map of tab IDs to first-activation
 * callbacks for lazy initialisation of each tab's content.
 */

export function initTabs(onFirstActivate = {}) {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const fired = new Set();

  function activate(tab, focus = true) {
    tabs.forEach((t) => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    if (focus) tab.focus();

    panels.forEach((p) => {
      p.classList.remove('active');
      p.hidden = true;
    });
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.classList.add('active');
    panel.hidden = false;

    const cb = onFirstActivate[tab.id];
    if (cb && !fired.has(tab.id)) {
      fired.add(tab.id);
      cb();
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (e) => {
      let idx = tabs.indexOf(tab);
      if      (e.key === 'ArrowRight') { idx = (idx + 1) % tabs.length; e.preventDefault(); }
      else if (e.key === 'ArrowLeft')  { idx = (idx - 1 + tabs.length) % tabs.length; e.preventDefault(); }
      else if (e.key === 'Home')       { idx = 0; e.preventDefault(); }
      else if (e.key === 'End')        { idx = tabs.length - 1; e.preventDefault(); }
      else return;
      activate(tabs[idx]);
    });
  });

  return { activate, activateById: (id) => activate(document.getElementById(id)) };
}
