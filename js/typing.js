/**
 * "Type a Sample" tab — pick a patient, add three reagents,
 * observe agglutination, then identify the blood type.
 */

import { PATIENTS } from '../config.js';
import { TYPES, ANTIGENS } from './blood-science.js';
import { announce } from './ui-helpers.js';

const REAGENT_DELAY_MS = 800;

let currentPatient = null;
let wellsTested = { A: false, B: false, D: false };
let typeAnswered = false;

export function initTyping() {
  const selector = document.querySelector('.patient-selector');
  selector.innerHTML = '';
  PATIENTS.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = p.name;
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => selectPatient(i));
    selector.appendChild(btn);
  });

  document.getElementById('well-a').addEventListener('click', () => testWell('A'));
  document.getElementById('well-b').addEventListener('click', () => testWell('B'));
  document.getElementById('well-d').addEventListener('click', () => testWell('D'));
}

function selectPatient(idx) {
  currentPatient = PATIENTS[idx];
  typeAnswered = false;
  wellsTested = { A: false, B: false, D: false };

  document.querySelector('.patient-selector').querySelectorAll('button').forEach((b, i) => {
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
    if (wellsTested.A && wellsTested.B && wellsTested.D) {
      document.getElementById('typing-instructions').textContent =
        'All reagents added. Now determine the blood type based on the agglutination pattern.';
      showTypeChoices();
    }
  }, REAGENT_DELAY_MS);
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
