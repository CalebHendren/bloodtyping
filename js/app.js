/**
 * Blood Typing Simulation — entry point.
 *
 * Course content (patients, cases, headings) lives in /config.js
 * at the repo root. This module just wires the pieces together.
 */

import { initTheme } from './theme.js';
import {
  injectCopy,
  buildInterpretationTable,
  buildCompatTableHeader,
} from './ui-helpers.js';
import { initTabs } from './tabs.js';
import { initTyping } from './typing.js';
import { initMatch, initMatchControls } from './match.js';
import { initCases, initCaseControls } from './cases.js';

function boot() {
  initTheme();
  injectCopy();
  buildInterpretationTable();
  buildCompatTableHeader();

  const tabs = initTabs({
    'tab-match': initMatch,
    'tab-cases': initCases,
  });

  initTyping();
  initMatchControls();
  initCaseControls();

  document.getElementById('start-typing-btn').addEventListener('click', () => {
    tabs.activateById('tab-type');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
