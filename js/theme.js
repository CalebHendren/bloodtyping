/**
 * Light / dark theme toggle.
 * Persists the user's choice; otherwise follows OS preference.
 */

const THEME_KEY = 'bloodtyping-theme';

const ARIA_TO_LIGHT = 'Switch to light mode';
const ARIA_TO_DARK  = 'Switch to dark mode';

function getStored() {
  try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
}

function setStored(theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
}

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function apply(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const isDark = theme === 'dark';
  toggle.setAttribute('aria-pressed', String(isDark));
  toggle.setAttribute('aria-label', isDark ? ARIA_TO_LIGHT : ARIA_TO_DARK);
}

export function initTheme() {
  apply(getStored() || (systemPrefersDark() ? 'dark' : 'light'));

  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    setStored(next);
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getStored()) apply(e.matches ? 'dark' : 'light');
    });
  }
}
