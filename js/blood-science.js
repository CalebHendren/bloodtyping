/**
 * Blood science constants and compatibility logic.
 *
 * These are biological facts, not configuration — they should not
 * change unless the underlying science does. Course content
 * (patients, cases, copy) lives in /config.js at the repo root.
 */

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

export function canReceive(recipient, donor) {
  const donorAg = ANTIGENS[donor];
  for (const ab of ANTIBODIES[recipient]) {
    if (donorAg[ab]) return false;
  }
  if (!ANTIGENS[recipient].D && donorAg.D) return false;
  return true;
}
