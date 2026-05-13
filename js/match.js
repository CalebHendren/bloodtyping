/**
 * "Compatibility" tab — for each recipient, select all compatible
 * donor types. Scored with progress dots and a final summary.
 */

import { TYPES, canReceive } from './blood-science.js';
import { announce, buildProgressDots, buildFullCompatTable } from './ui-helpers.js';

let questions = [];
let idx = 0;
let score = 0;
let selections = new Set();

export function initMatch() {
  questions = [...TYPES].sort(() => Math.random() - 0.5);
  idx = 0;
  score = 0;
  selections = new Set();
  document.getElementById('score-num').textContent = '0';
  document.getElementById('q-total').textContent = questions.length;
  document.getElementById('match-summary').style.display = 'none';
  document.getElementById('ref-table-section').style.display = 'none';
  buildProgressDots('progress-dots', questions.length, 'Question');
  renderQuestion();
}

export function initMatchControls() {
  document.getElementById('retry-match-btn').addEventListener('click', initMatch);
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

function renderQuestion() {
  const area = document.getElementById('match-area');
  if (idx >= questions.length) {
    showSummary();
    return;
  }
  const recipient = questions[idx];
  document.getElementById('q-current').textContent = idx + 1;
  selections = new Set();

  document.querySelectorAll('#progress-dots .dot').forEach((d, i) => {
    d.classList.toggle('current', i === idx);
  });

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
  submitBtn.addEventListener('click', () => checkAnswer(recipient));
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

  announce('Question ' + (idx + 1) + ': Select compatible donors for ' + recipient);
}

function toggleDonor(type, btn) {
  if (btn.disabled) return;
  if (selections.has(type)) {
    selections.delete(type);
    btn.setAttribute('aria-pressed', 'false');
  } else {
    selections.add(type);
    btn.setAttribute('aria-pressed', 'true');
  }
}

function checkAnswer(recipient) {
  const correctDonors = new Set(TYPES.filter((d) => canReceive(recipient, d)));
  const isCorrect =
    selections.size === correctDonors.size &&
    [...selections].every((s) => correctDonors.has(s));

  const area = document.getElementById('match-area');
  const fb = document.getElementById('match-feedback');
  const allBtns = area.querySelectorAll('.donor-btn');
  const checkBtn = document.getElementById('check-match-btn');

  allBtns.forEach((b) => {
    b.disabled = true;
    const t = b.textContent;
    if (correctDonors.has(t)) {
      b.classList.add('correct-highlight');
    } else if (selections.has(t)) {
      b.classList.add('incorrect-highlight');
    }
  });

  if (isCorrect) {
    score++;
    document.getElementById('score-num').textContent = String(score);
    fb.textContent = 'Correct! ' + recipient + ' can receive from: ' + [...correctDonors].join(', ') + '.';
    fb.className = 'feedback show correct';
    document.querySelectorAll('#progress-dots .dot')[idx].className = 'dot done-correct';
  } else {
    fb.textContent = 'Not quite. ' + recipient + ' can receive from: ' + [...correctDonors].join(', ') + '.';
    fb.className = 'feedback show incorrect';
    document.querySelectorAll('#progress-dots .dot')[idx].className = 'dot done-incorrect';
  }

  checkBtn.textContent = idx < questions.length - 1 ? 'Next Question →' : 'See Results';
  checkBtn.onclick = () => { idx++; renderQuestion(); };

  announce(isCorrect ? 'Correct!' : 'Incorrect. Compatible donors are ' + [...correctDonors].join(', '));
}

function showSummary() {
  document.getElementById('match-area').innerHTML = '';
  document.getElementById('match-summary').style.display = '';
  document.getElementById('final-score').textContent = score + ' / ' + questions.length;
  const pct = Math.round((score / questions.length) * 100);
  const msg = document.getElementById('final-message');
  if      (pct === 100) msg.textContent = 'Perfect score! You have a strong understanding of blood type compatibility.';
  else if (pct >= 75)   msg.textContent = 'Great work! Review the types you missed and try again.';
  else if (pct >= 50)   msg.textContent = 'Good effort. Study the compatibility rules on the Learn tab and try again.';
  else                  msg.textContent = 'Keep practicing. Review the Learn tab for the compatibility rules.';
  announce('Activity complete. Score: ' + score + ' out of ' + questions.length);
}
