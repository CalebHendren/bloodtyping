/**
 * Small shared UI helpers: text injection, SR announcements,
 * progress dots, and the two tables derived from the blood science.
 */

import { APP_TEXT } from '../config.js';
import { TYPES, ANTIGENS, canReceive } from './blood-science.js';

export function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

export function announce(msg) {
  const el = document.getElementById('sr-announcements');
  if (!el) return;
  el.textContent = '';
  setTimeout(() => { el.textContent = msg; }, 80);
}

export function injectCopy() {
  document.title = APP_TEXT.title + ' — Anatomy & Physiology II';
  setText('app-title',    APP_TEXT.title);
  setText('app-subtitle', APP_TEXT.subtitle);
  setText('footer-text',  APP_TEXT.footer);
}

export function buildProgressDots(containerId, count, label) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' current' : '');
    dot.setAttribute('aria-label', label + ' ' + (i + 1));
    container.appendChild(dot);
  }
}

export function buildInterpretationTable() {
  const tbody = document.getElementById('interpretation-tbody');
  if (!tbody) return;
  TYPES.forEach((t) => {
    const ag = ANTIGENS[t];
    const tr = document.createElement('tr');
    const tdType = document.createElement('td');
    tdType.textContent = t;
    tr.appendChild(tdType);
    ['A', 'B', 'D'].forEach((key) => {
      const td = document.createElement('td');
      if (ag[key]) {
        td.className = 'check';
        td.innerHTML = '<span aria-label="Agglutination">&#x2713;</span>';
      } else {
        td.className = 'cross';
        td.innerHTML = '<span aria-label="No agglutination">&#x2717;</span>';
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

export function buildCompatTableHeader() {
  const thead = document.getElementById('compat-thead-row');
  if (!thead) return;
  thead.innerHTML = '<th scope="col">Recipient ↓ / Donor →</th>';
  TYPES.forEach((t) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = t;
    thead.appendChild(th);
  });
}

export function buildFullCompatTable() {
  const tbody = document.getElementById('compat-tbody');
  if (tbody.children.length > 0) return;
  TYPES.forEach((r) => {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = r;
    tr.appendChild(th);
    TYPES.forEach((d) => {
      const td = document.createElement('td');
      if (canReceive(r, d)) {
        td.innerHTML = '<span class="check" aria-label="Compatible">&#x2713;</span>';
      } else {
        td.innerHTML = '<span class="cross" aria-label="Incompatible">&#x2717;</span>';
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
