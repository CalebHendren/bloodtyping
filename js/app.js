/**
 * Blood Typing Simulation — Application Logic
 *
 * Reads all content from ./config.js. To change questions or
 * UI copy, edit config.js — this file should not need changes.
 */

import { UI, TYPES, ANTIGENS, ANTIBODIES, PATIENTS, CASES } from './config.js';

// ========== THEME (light / dark) ==========
const THEME_KEY = 'bloodtyping-theme';

function getStoredTheme() {
  try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
}

function setStoredTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
}

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    const isDark = theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute(
      'aria-label',
      isDark ? UI.themeToggle.toLightLabel : UI.themeToggle.toDarkLabel,
    );
  }
}

function initTheme() {
  const stored = getStoredTheme();
  const theme = stored || (systemPrefersDark() ? 'dark' : 'light');
  applyTheme(theme);

  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
  });

  // Follow system changes only if user hasn't picked one explicitly.
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
    });
  }
}

// ========== UI TEXT INJECTION ==========
function injectCopy() {
  document.title = UI.appTitle + ' — Anatomy & Physiology II';
  setText('app-title', UI.appTitle);
  setText('app-subtitle', UI.appSubtitle);
  setText('footer-text', UI.footerText);
  setText('tab-learn', UI.tabs.learn);
  setText('tab-type', UI.tabs.type);
  setText('tab-match', UI.tabs.match);
  setText('tab-cases', UI.tabs.cases);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ========== COMPATIBILITY LOGIC ==========
function canReceive(recipient, donor) {
  const donorAg = ANTIGENS[donor];
  const recipAb = ANTIBODIES[recipient];
  for (const ab of recipAb) {
    if (donorAg[ab]) return false;
  }
  const recipRhNeg = !ANTIGENS[recipient].D;
  if (recipRhNeg && donorAg.D) return false;
  return true;
}

// ========== SR ANNOUNCEMENTS ==========
function announce(msg) {
  const el = document.getElementById('sr-announcements');
  if (!el) return;
  el.textContent = '';
  setTimeout(() => { el.textContent = msg; }, 80);
}

// ========== INTERPRETATION TABLE (Learn tab) ==========
function buildInterpretationTable() {
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

// ========== TABS ==========
function initTabs() {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

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
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (e) => {
      let idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') { idx = (idx + 1) % tabs.length; e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { idx = (idx - 1 + tabs.length) % tabs.length; e.preventDefault(); }
      else if (e.key === 'Home') { idx = 0; e.preventDefault(); }
      else if (e.key === 'End') { idx = tabs.length - 1; e.preventDefault(); }
      else return;
      activate(tabs[idx]);
    });
  });

  document.getElementById('start-typing-btn').addEventListener('click', () => {
    activate(document.getElementById('tab-type'));
  });

  // Init compatibility on tab activation
  const tabMatch = document.getElementById('tab-match');
  let matchInitialized = false;
  tabMatch.addEventListener('click', () => {
    if (!matchInitialized) { initMatch(); matchInitialized = true; }
  });

  // Init cases on tab activation
  const tabCases = document.getElementById('tab-cases');
  let casesInitialized = false;
  tabCases.addEventListener('click', () => {
    if (!casesInitialized) { initCases(); casesInitialized = true; }
  });
}

// ========== TYPING SIMULATION ==========
let currentPatient = null;
let wellsTested = { A: false, B: false, D: false };
let typeAnswered = false;

function initTyping() {
  const patientSelector = document.querySelector('.patient-selector');
  patientSelector.innerHTML = '';
  PATIENTS.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = p.name;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => selectPatient(i));
    patientSelector.appendChild(btn);
  });

  document.getElementById('well-a').addEventListener('click', () => testWell('A'));
  document.getElementById('well-b').addEventListener('click', () => testWell('B'));
  document.getElementById('well-d').addEventListener('click', () => testWell('D'));
}

function selectPatient(idx) {
  currentPatient = PATIENTS[idx];
  typeAnswered = false;
  wellsTested = { A: false, B: false, D: false };

  const selector = document.querySelector('.patient-selector');
  selector.querySelectorAll('button').forEach((b, i) => {
    b.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
  });

  ['A', 'B', 'D'].forEach((reagent) => {
    const well = document.getElementById('well-' + reagent.toLowerCase());
    const result = document.getElementById('result-' + reagent.toLowerCase());
    well.dataset.state = 'empty';
    well.disabled = false;
    well.innerHTML = '<span>Add<br>Anti-' + reagent + '</span>';
    well.setAttribute('aria-label', 'Anti-' + reagent + ' well. Activate to add reagent.');
    result.textContent = '';
    result.className = 'well-result';
  });

  const typeReveal = document.getElementById('type-reveal');
  typeReveal.innerHTML = '<span class="placeholder">Blood type will appear here after testing</span>';
  typeReveal.classList.remove('revealed');

  document.getElementById('type-answer-area').style.display = 'none';
  const fb = document.getElementById('type-feedback');
  fb.classList.remove('show', 'correct', 'incorrect');
  fb.textContent = '';

  document.getElementById('typing-instructions').textContent =
    'Activate each well to add the reagent and observe the result.';
  document.getElementById('typing-workspace').style.display = '';

  announce(currentPatient.name + ' selected. Activate each well to add reagents.');
}

function testWell(reagent) {
  if (!currentPatient || wellsTested[reagent]) return;
  wellsTested[reagent] = true;

  const well = document.getElementById('well-' + reagent.toLowerCase());
  const result = document.getElementById('result-' + reagent.toLowerCase());
  const clumps = ANTIGENS[currentPatient.type][reagent];

  well.dataset.state = 'waiting';
  well.innerHTML = '<span>…</span>';
  well.disabled = true;

  setTimeout(() => {
    if (clumps) {
      well.dataset.state = 'positive';
      well.innerHTML = '';
      well.setAttribute('aria-label', 'Anti-' + reagent + ' well. Result: agglutination detected.');
      result.textContent = 'Agglutination';
      result.className = 'well-result pos';
    } else {
      well.dataset.state = 'negative';
      well.innerHTML = '<span>Smooth</span>';
      well.setAttribute('aria-label', 'Anti-' + reagent + ' well. Result: no agglutination.');
      result.textContent = 'No clumping';
      result.className = 'well-result neg';
    }
    announce('Anti-' + reagent + ' result: ' + (clumps ? 'agglutination detected' : 'no agglutination'));
    checkAllWellsTested();
  }, 800);
}

function checkAllWellsTested() {
  if (wellsTested.A && wellsTested.B && wellsTested.D) {
    document.getElementById('typing-instructions').textContent =
      'All reagents added. Now determine the blood type based on the agglutination pattern.';
    showTypeChoices();
  }
}

function showTypeChoices() {
  const area = document.getElementById('type-answer-area');
  const choices = document.getElementById('type-choices');
  area.style.display = '';
  choices.innerHTML = '';
  const shuffled = [...TYPES].sort(() => Math.random() - 0.5);
  shuffled.forEach((t) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'donor-btn';
    btn.textContent = t;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.addEventListener('click', () => submitTypeAnswer(t, btn));
    choices.appendChild(btn);
  });
}

function submitTypeAnswer(answer, btn) {
  if (typeAnswered) return;
  typeAnswered = true;

  const buttons = document.querySelectorAll('#type-choices .donor-btn');
  buttons.forEach((b) => {
    b.setAttribute('aria-checked', 'false');
    b.disabled = true;
  });
  btn.setAttribute('aria-checked', 'true');

  const correct = answer === currentPatient.type;
  const fb = document.getElementById('type-feedback');
  fb.textContent = correct
    ? 'Correct! This sample is ' + currentPatient.type + '.'
    : 'Not quite. The correct type is ' + currentPatient.type + '. Review the agglutination pattern above.';
  fb.className = 'feedback show ' + (correct ? 'correct' : 'incorrect');

  buttons.forEach((b) => {
    if (b.textContent === currentPatient.type) {
      b.classList.add('correct-highlight');
    } else if (b === btn && !correct) {
      b.classList.add('incorrect-highlight');
    }
  });

  const typeReveal = document.getElementById('type-reveal');
  typeReveal.innerHTML = '<span class="big-type">' + currentPatient.type + '</span>';
  typeReveal.classList.add('revealed');

  announce(correct
    ? 'Correct! Blood type is ' + currentPatient.type
    : 'Incorrect. The correct blood type is ' + currentPatient.type);
}

// ========== COMPATIBILITY MATCHING ==========
let matchQuestions = [];
let matchIdx = 0;
let matchScore = 0;
let matchSelections = new Set();

function initMatch() {
  matchQuestions = [...TYPES].sort(() => Math.random() - 0.5);
  matchIdx = 0;
  matchScore = 0;
  matchSelections = new Set();
  document.getElementById('score-num').textContent = '0';
  document.getElementById('q-total').textContent = matchQuestions.length;
  document.getElementById('match-summary').style.display = 'none';
  document.getElementById('ref-table-section').style.display = 'none';
  buildProgressDots('progress-dots', matchQuestions.length, 'Question');
  renderMatchQuestion();
}

function buildProgressDots(containerId, count, label) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' current' : '');
    dot.setAttribute('aria-label', label + ' ' + (i + 1));
    container.appendChild(dot);
  }
}

function renderMatchQuestion() {
  const area = document.getElementById('match-area');
  if (matchIdx >= matchQuestions.length) {
    showMatchSummary();
    return;
  }
  const recipient = matchQuestions[matchIdx];
  document.getElementById('q-current').textContent = matchIdx + 1;
  matchSelections = new Set();

  const dots = document.querySelectorAll('#progress-dots .dot');
  dots.forEach((d, i) => d.classList.toggle('current', i === matchIdx));

  area.innerHTML = '';

  const prompt = document.createElement('div');
  prompt.className = 'match-prompt';
  prompt.innerHTML =
    'A patient with blood type <span class="highlight">' + recipient +
    '</span> needs a transfusion.<br>Select <strong>all</strong> compatible donor types:';
  area.appendChild(prompt);

  const options = document.createElement('div');
  options.className = 'donor-options';
  options.setAttribute('role', 'group');
  options.setAttribute('aria-label', 'Select compatible donors for ' + recipient);
  TYPES.forEach((t) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'donor-btn';
    btn.textContent = t;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => toggleDonor(t, btn));
    options.appendChild(btn);
  });
  area.appendChild(options);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'btn btn-primary';
  submitBtn.textContent = 'Check Answer';
  submitBtn.id = 'check-match-btn';
  submitBtn.addEventListener('click', () => checkMatchAnswer(recipient));
  const btnRow = document.createElement('div');
  btnRow.className = 'btn-row';
  btnRow.style.justifyContent = 'center';
  btnRow.appendChild(submitBtn);
  area.appendChild(btnRow);

  const fb = document.createElement('div');
  fb.className = 'feedback';
  fb.id = 'match-feedback';
  fb.setAttribute('role', 'alert');
  area.appendChild(fb);

  announce('Question ' + (matchIdx + 1) + ': Select compatible donors for ' + recipient);
}

function toggleDonor(type, btn) {
  if (btn.disabled) return;
  if (matchSelections.has(type)) {
    matchSelections.delete(type);
    btn.setAttribute('aria-pressed', 'false');
  } else {
    matchSelections.add(type);
    btn.setAttribute('aria-pressed', 'true');
  }
}

function checkMatchAnswer(recipient) {
  const correctDonors = new Set(TYPES.filter((d) => canReceive(recipient, d)));
  const isCorrect =
    matchSelections.size === correctDonors.size &&
    [...matchSelections].every((s) => correctDonors.has(s));

  const area = document.getElementById('match-area');
  const fb = document.getElementById('match-feedback');
  const allBtns = area.querySelectorAll('.donor-btn');
  const checkBtn = document.getElementById('check-match-btn');

  allBtns.forEach((b) => {
    b.disabled = true;
    const t = b.textContent;
    if (correctDonors.has(t)) {
      b.classList.add('correct-highlight');
    } else if (matchSelections.has(t)) {
      b.classList.add('incorrect-highlight');
    }
  });

  if (isCorrect) {
    matchScore++;
    document.getElementById('score-num').textContent = String(matchScore);
    fb.textContent =
      'Correct! ' + recipient + ' can receive from: ' + [...correctDonors].join(', ') + '.';
    fb.className = 'feedback show correct';
    document.querySelectorAll('#progress-dots .dot')[matchIdx].className = 'dot done-correct';
  } else {
    fb.textContent =
      'Not quite. ' + recipient + ' can receive from: ' + [...correctDonors].join(', ') + '.';
    fb.className = 'feedback show incorrect';
    document.querySelectorAll('#progress-dots .dot')[matchIdx].className = 'dot done-incorrect';
  }

  checkBtn.textContent = matchIdx < matchQuestions.length - 1 ? 'Next Question →' : 'See Results';
  checkBtn.onclick = () => { matchIdx++; renderMatchQuestion(); };

  announce(isCorrect
    ? 'Correct!'
    : 'Incorrect. Compatible donors are ' + [...correctDonors].join(', '));
}

function showMatchSummary() {
  document.getElementById('match-area').innerHTML = '';
  const summary = document.getElementById('match-summary');
  summary.style.display = '';
  document.getElementById('final-score').textContent =
    matchScore + ' / ' + matchQuestions.length;
  const pct = Math.round((matchScore / matchQuestions.length) * 100);
  const msg = document.getElementById('final-message');
  if (pct === 100) msg.textContent = 'Perfect score! You have a strong understanding of blood type compatibility.';
  else if (pct >= 75) msg.textContent = 'Great work! Review the types you missed and try again.';
  else if (pct >= 50) msg.textContent = 'Good effort. Study the compatibility rules on the Learn tab and try again.';
  else msg.textContent = 'Keep practicing. Review the Learn tab for the compatibility rules.';
  announce('Activity complete. Score: ' + matchScore + ' out of ' + matchQuestions.length);
}

function buildFullCompatTable() {
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

function buildCompatTableHeader() {
  const thead = document.getElementById('compat-thead-row');
  if (!thead) return;
  // Header pattern: corner + each donor type
  thead.innerHTML = '<th scope="col">Recipient ↓ / Donor →</th>';
  TYPES.forEach((t) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = t;
    thead.appendChild(th);
  });
}

// ========== CASE STUDIES ==========
let caseIdx = 0;
let caseScore = 0;
let caseOrder = [];

function initCases() {
  caseOrder = [...Array(CASES.length).keys()].sort(() => Math.random() - 0.5);
  caseIdx = 0;
  caseScore = 0;
  document.getElementById('case-score').textContent = '0';
  document.getElementById('case-total').textContent = CASES.length;
  document.getElementById('case-summary').style.display = 'none';
  buildProgressDots('case-progress', CASES.length, 'Case');
  renderCase();
}

function renderCase() {
  const area = document.getElementById('case-area');
  if (caseIdx >= CASES.length) {
    showCaseSummary();
    return;
  }
  const c = CASES[caseOrder[caseIdx]];
  document.getElementById('case-current').textContent = caseIdx + 1;

  const dots = document.querySelectorAll('#case-progress .dot');
  dots.forEach((d, i) => d.classList.toggle('current', i === caseIdx));

  area.innerHTML = '';

  const narDiv = document.createElement('div');
  narDiv.className = 'case-narrative';
  narDiv.innerHTML = '<span class="case-tag">' + c.tag + '</span><p>' + c.narrative + '</p>';
  area.appendChild(narDiv);

  const qDiv = document.createElement('div');
  qDiv.className = 'case-question';
  qDiv.textContent = c.question;
  area.appendChild(qDiv);

  const optsDiv = document.createElement('div');
  optsDiv.className = 'case-options';
  optsDiv.setAttribute('role', 'group');
  optsDiv.setAttribute('aria-label', 'Answer choices');
  c.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'case-opt-btn';
    btn.setAttribute('aria-pressed', 'false');
    const letter = String.fromCharCode(65 + i);
    btn.innerHTML = '<strong>' + letter + '.</strong> ' + opt;
    btn.addEventListener('click', () => submitCaseAnswer(i, btn, c));
    optsDiv.appendChild(btn);
  });
  area.appendChild(optsDiv);

  const expDiv = document.createElement('div');
  expDiv.className = 'case-explanation';
  expDiv.id = 'case-explanation';
  expDiv.setAttribute('role', 'region');
  expDiv.setAttribute('aria-label', 'Explanation');
  area.appendChild(expDiv);

  announce('Case ' + (caseIdx + 1) + ': ' + c.tag);
}

function submitCaseAnswer(chosen, btn, caseData) {
  const allBtns = document.querySelectorAll('#case-area .case-opt-btn');
  if (btn.disabled) return;
  allBtns.forEach((b) => { b.disabled = true; });

  btn.setAttribute('aria-pressed', 'true');
  const correct = chosen === caseData.correct;

  if (correct) {
    caseScore++;
    document.getElementById('case-score').textContent = String(caseScore);
    btn.classList.add('opt-correct');
    document.querySelectorAll('#case-progress .dot')[caseIdx].className = 'dot done-correct';
  } else {
    btn.classList.add('opt-incorrect');
    allBtns[caseData.correct].classList.add('opt-correct');
    document.querySelectorAll('#case-progress .dot')[caseIdx].className = 'dot done-incorrect';
  }

  const expDiv = document.getElementById('case-explanation');
  expDiv.innerHTML = (correct ? '<strong>Correct!</strong> ' : '<strong>Not quite.</strong> ') + caseData.explanation;
  expDiv.classList.add('show');

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'btn btn-primary';
  nextBtn.style.marginTop = '1rem';
  nextBtn.textContent = caseIdx < CASES.length - 1 ? 'Next Case →' : 'See Results';
  nextBtn.addEventListener('click', () => { caseIdx++; renderCase(); });
  document.getElementById('case-area').appendChild(nextBtn);

  announce(correct ? 'Correct!' : 'Incorrect.');
}

function showCaseSummary() {
  document.getElementById('case-area').innerHTML = '';
  document.getElementById('case-summary').style.display = '';
  document.getElementById('case-final-score').textContent = caseScore + ' / ' + CASES.length;
  const pct = Math.round((caseScore / CASES.length) * 100);
  const msg = document.getElementById('case-final-message');
  if (pct === 100) msg.textContent = 'Excellent clinical reasoning! You nailed every case.';
  else if (pct >= 67) msg.textContent = 'Strong work! Review the cases you missed and try again.';
  else msg.textContent = 'Keep studying the compatibility rules and give it another shot.';
  announce('Case studies complete. Score: ' + caseScore + ' out of ' + CASES.length);
}

// ========== BOOT ==========
function boot() {
  initTheme();
  injectCopy();
  buildInterpretationTable();
  buildCompatTableHeader();
  initTabs();
  initTyping();

  document.getElementById('retry-match-btn').addEventListener('click', initMatch);
  document.getElementById('retry-cases-btn').addEventListener('click', initCases);
  document.getElementById('show-ref-btn').addEventListener('click', (e) => {
    const section = document.getElementById('ref-table-section');
    const btn = e.currentTarget;
    const isHidden = section.style.display === 'none' || !section.style.display;
    section.style.display = isHidden ? '' : 'none';
    btn.setAttribute('aria-expanded', String(isHidden));
    btn.textContent = isHidden ? 'Hide Reference Table' : 'View Reference Table';
    if (isHidden) buildFullCompatTable();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
