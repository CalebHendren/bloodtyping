/**
 * "Case Studies" tab — clinical multiple-choice scenarios.
 */

import { CASES } from '../config.js';
import { announce, buildProgressDots } from './ui-helpers.js';

let order = [];
let idx = 0;
let score = 0;

export function initCases() {
  order = [...Array(CASES.length).keys()].sort(() => Math.random() - 0.5);
  idx = 0;
  score = 0;
  document.getElementById('case-score').textContent = '0';
  document.getElementById('case-total').textContent = CASES.length;
  document.getElementById('case-summary').style.display = 'none';
  buildProgressDots('case-progress', CASES.length, 'Case');
  renderCase();
}

export function initCaseControls() {
  document.getElementById('retry-cases-btn').addEventListener('click', initCases);
}

function renderCase() {
  const area = document.getElementById('case-area');
  if (idx >= CASES.length) {
    showSummary();
    return;
  }
  const c = CASES[order[idx]];
  document.getElementById('case-current').textContent = idx + 1;

  document.querySelectorAll('#case-progress .dot').forEach((d, i) => {
    d.classList.toggle('current', i === idx);
  });

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
    btn.addEventListener('click', () => submitAnswer(i, btn, c));
    optsDiv.appendChild(btn);
  });
  area.appendChild(optsDiv);

  const expDiv = document.createElement('div');
  expDiv.className = 'case-explanation';
  expDiv.id = 'case-explanation';
  expDiv.setAttribute('role', 'region');
  expDiv.setAttribute('aria-label', 'Explanation');
  area.appendChild(expDiv);

  announce('Case ' + (idx + 1) + ': ' + c.tag);
}

function submitAnswer(chosen, btn, caseData) {
  const allBtns = document.querySelectorAll('#case-area .case-opt-btn');
  if (btn.disabled) return;
  allBtns.forEach((b) => { b.disabled = true; });

  btn.setAttribute('aria-pressed', 'true');
  const correct = chosen === caseData.correct;

  if (correct) {
    score++;
    document.getElementById('case-score').textContent = String(score);
    btn.classList.add('opt-correct');
    document.querySelectorAll('#case-progress .dot')[idx].className = 'dot done-correct';
  } else {
    btn.classList.add('opt-incorrect');
    allBtns[caseData.correct].classList.add('opt-correct');
    document.querySelectorAll('#case-progress .dot')[idx].className = 'dot done-incorrect';
  }

  const expDiv = document.getElementById('case-explanation');
  expDiv.innerHTML = (correct ? '<strong>Correct!</strong> ' : '<strong>Not quite.</strong> ') + caseData.explanation;
  expDiv.classList.add('show');

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'btn btn-primary';
  nextBtn.style.marginTop = '1rem';
  nextBtn.textContent = idx < CASES.length - 1 ? 'Next Case →' : 'See Results';
  nextBtn.addEventListener('click', () => { idx++; renderCase(); });
  document.getElementById('case-area').appendChild(nextBtn);

  announce(correct ? 'Correct!' : 'Incorrect.');
}

function showSummary() {
  document.getElementById('case-area').innerHTML = '';
  document.getElementById('case-summary').style.display = '';
  document.getElementById('case-final-score').textContent = score + ' / ' + CASES.length;
  const pct = Math.round((score / CASES.length) * 100);
  const msg = document.getElementById('case-final-message');
  if      (pct === 100) msg.textContent = 'Excellent clinical reasoning! You nailed every case.';
  else if (pct >= 67)   msg.textContent = 'Strong work! Review the cases you missed and try again.';
  else                  msg.textContent = 'Keep studying the compatibility rules and give it another shot.';
  announce('Case studies complete. Score: ' + score + ' out of ' + CASES.length);
}
