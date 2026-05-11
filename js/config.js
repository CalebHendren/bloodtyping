/**
 * Blood Typing Simulation — Content Configuration
 * ------------------------------------------------------------
 * This is the single source of truth for the activity's content.
 * Edit this file to change patients, case studies, or UI copy.
 *
 * Sections:
 *   - UI:        Title, subtitle, footer, and instructional copy.
 *   - TYPES:     The set of blood types used throughout the app.
 *   - ANTIGENS:  Antigen profile for each type (factual; only
 *                edit if adding hypothetical types).
 *   - ANTIBODIES: Plasma antibodies for each type (factual).
 *   - PATIENTS:  The "Type a Sample" exercise roster. Each entry
 *                shows up as a selectable patient.
 *   - CASES:     Clinical case studies (multiple choice). The
 *                "correct" field is a 0-based index into options.
 *
 * All other behavior (compatibility matching, reagent reactions,
 * compatibility reference table) is derived automatically from
 * TYPES + ANTIGENS + ANTIBODIES — you do not need to maintain a
 * separate answer key.
 */

export const UI = {
  appTitle: 'Blood Typing Simulation',
  appSubtitle: 'ABO & Rh Blood Group Identification — Anatomy & Physiology II',
  footerText: 'Blood Typing Simulation — Anatomy & Physiology II',
  tabs: {
    learn: 'Learn',
    type: 'Type a Sample',
    match: 'Compatibility',
    cases: 'Case Studies',
  },
  themeToggle: {
    toLightLabel: 'Switch to light mode',
    toDarkLabel: 'Switch to dark mode',
  },
};

export const TYPES = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const ANTIGENS = {
  'A+':  { A: true,  B: false, D: true  },
  'A-':  { A: true,  B: false, D: false },
  'B+':  { A: false, B: true,  D: true  },
  'B-':  { A: false, B: true,  D: false },
  'AB+': { A: true,  B: true,  D: true  },
  'AB-': { A: true,  B: true,  D: false },
  'O+':  { A: false, B: false, D: true  },
  'O-':  { A: false, B: false, D: false },
};

export const ANTIBODIES = {
  'A+':  ['B'],
  'A-':  ['B'],
  'B+':  ['A'],
  'B-':  ['A'],
  'AB+': [],
  'AB-': [],
  'O+':  ['A', 'B'],
  'O-':  ['A', 'B'],
};

// Patients shown in the "Type a Sample" exercise.
// Add, remove, or reorder entries freely. `type` must be one of TYPES.
export const PATIENTS = [
  { name: 'Patient 1', type: 'A+' },
  { name: 'Patient 2', type: 'O-' },
  { name: 'Patient 3', type: 'B+' },
  { name: 'Patient 4', type: 'AB-' },
  { name: 'Patient 5', type: 'O+' },
  { name: 'Patient 6', type: 'A-' },
];

// Clinical case study questions.
// `correct` is a 0-based index into `options`.
// `narrative` and `explanation` accept simple inline HTML
// (e.g. <strong>) for emphasis.
export const CASES = [
  {
    tag: 'Emergency Department',
    narrative: 'A 34-year-old woman is rushed into the ED after a car accident with significant internal bleeding. Her blood type is <strong>A+</strong>. The blood bank reports that all A+ and A− units are currently allocated to surgery patients upstairs. Available units in the emergency cooler: <strong>O+, B+, AB−</strong>.',
    question: 'Which of the available units can be safely transfused?',
    options: [
      'B+ — it is the closest match available',
      'O+ — it carries no A or B antigens',
      'AB− — it is Rh-negative so it is always safe',
      'None of these are safe; wait for A+ units',
    ],
    correct: 1,
    explanation: '<strong>O+</strong> is the correct choice. Type O red blood cells carry no A or B antigens, so they will not trigger an ABO reaction in an A+ recipient. Since the patient is Rh-positive, receiving Rh-positive blood is also safe. B+ carries B antigens, which the patient’s anti-B antibodies would attack. AB− carries both A and B antigens — the B antigen would cause a reaction.',
  },
  {
    tag: 'Labor & Delivery',
    narrative: 'A newborn’s cord blood is typed as <strong>B−</strong>. The infant needs a small-volume transfusion due to anemia. The hospital’s neonatal blood supply currently has: <strong>O−, O+, A−</strong>.',
    question: 'Which unit(s) can be safely given to this infant?',
    options: [
      'O− only',
      'O− or O+, since both are type O',
      'A−, since it matches the Rh factor',
      'Any of the three, since neonates are immunologically immature',
    ],
    correct: 0,
    explanation: '<strong>O− only.</strong> The infant is B− (Rh-negative). O− red cells carry no A, B, or D antigens, making it universally compatible. O+ would introduce the D antigen to an Rh-negative recipient, risking sensitization. A− carries A antigens, which would react with anti-A antibodies. Neonatal immune immaturity does not eliminate transfusion reaction risk.',
  },
  {
    tag: 'Community Blood Drive',
    narrative: 'During a campus blood drive, a student donor is typed as <strong>O−</strong>. The blood bank coordinator explains that this donation is especially valuable because of its universal compatibility.',
    question: 'Why is O− considered the universal red blood cell donor type?',
    options: [
      'O− blood contains universal antibodies that help any recipient',
      'O− red blood cells lack A, B, and D antigens, so no recipient will mount an immune response against them',
      'O− blood has a special protein coating that prevents all immune reactions',
      'O− is the most common blood type, so most recipients are already familiar with it',
    ],
    correct: 1,
    explanation: 'O− red blood cells carry <strong>no A, B, or Rh(D) antigens</strong> on their surface. Since transfusion reactions are caused by recipient antibodies attacking foreign antigens on donor cells, O− cells have nothing for any recipient’s antibodies to target. This makes them safe for virtually any patient in an emergency when there is no time to type and crossmatch.',
  },
  {
    tag: 'Surgical Suite',
    narrative: 'A 58-year-old man with blood type <strong>AB+</strong> is undergoing open-heart surgery. Midway through the procedure, blood loss exceeds estimates. The surgical team requests additional units. The blood bank has run low and can only offer: <strong>A+, B−, O+, AB−</strong>.',
    question: 'Which of these units are safe to transfuse? Select the best answer.',
    options: [
      'Only AB−, because it is the closest ABO match',
      'A+ and AB− only',
      'All four units are safe for this patient',
      'O+ and AB− only',
    ],
    correct: 2,
    explanation: '<strong>All four are safe.</strong> AB+ is the <strong>universal recipient</strong> for red blood cells. The patient has no anti-A, no anti-B, and no anti-D antibodies, so red cells carrying any combination of A, B, and/or D antigens will not provoke a reaction. A+ (has A and D), B− (has B), O+ (has D only), and AB− (has A and B) are all compatible.',
  },
  {
    tag: 'Trauma Center',
    narrative: 'An unconscious patient arrives by helicopter after a construction accident. There is no time to type their blood. The trauma team needs to begin a transfusion immediately.',
    question: 'What blood type should the team reach for in this emergency?',
    options: [
      'A+, because it is the most common blood type',
      'AB+, because it is the universal recipient type',
      'O−, because it is safe for any patient regardless of their blood type',
      'O+, because most people are Rh-positive anyway',
    ],
    correct: 2,
    explanation: 'In an emergency with an <strong>unknown blood type</strong>, the standard protocol is to transfuse <strong>O−</strong> red blood cells. With no A, B, or D antigens, O− cells will not trigger a reaction regardless of the patient’s actual type. While O+ is sometimes used for male trauma patients at some institutions, O− is the safest universal choice and the standard first reach in most protocols.',
  },
  {
    tag: 'Outpatient Clinic',
    narrative: 'A patient with blood type <strong>B+</strong> needs a scheduled transfusion for chronic anemia. The clinic’s refrigerator contains: <strong>B+, B−, A+, O−</strong>. The nurse wants to confirm the safe options before beginning.',
    question: 'Which units are compatible for this patient?',
    options: [
      'B+ only — always use an exact match when available',
      'B+ and B− only',
      'B+, B−, and O−',
      'B+, B−, O−, and A+',
    ],
    correct: 2,
    explanation: 'A <strong>B+</strong> patient can safely receive: <strong>B+</strong> (exact match), <strong>B−</strong> (same ABO, Rh-negative is always safe for Rh-positive recipients), and <strong>O−</strong> (universal donor, no A/B/D antigens). <strong>A+</strong> is not compatible because the patient’s anti-A antibodies would attack the A antigen.',
  },
];
