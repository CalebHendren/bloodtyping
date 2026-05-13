# Blood Typing Simulation

An interactive, browser-based simulation for teaching **ABO & Rh blood typing**
and **transfusion compatibility** in Anatomy & Physiology II for allied-health
programs (nursing, vet tech, dental hygiene, medical lab tech, EMT/paramedic,
respiratory care). Built as a zero-dependency static site so it can be hosted
directly from GitHub Pages.

## Features

- **Learn** — Reference reagent protocol and an auto-generated interpretation
  table.
- **Type a Sample** — Pick a patient, add anti-A / anti-B / anti-D reagents,
  observe agglutination, then identify the blood type.
- **Compatibility** — For each recipient, select all compatible RBC donor
  types; scored with progress dots and a final summary.
- **Case Studies** — Multiple-choice clinical scenarios drawn from the
  settings allied-health students will work in (ED, NICU, OR, blood bank,
  pre-hospital, respiratory care).
- Light / dark theme that follows the OS preference and persists.
- Keyboard-navigable, screen-reader friendly, and tested against WCAG 2.1 AA
  contrast requirements.

## Project structure

```
.
├── index.html                # Markup, landmarks, ARIA scaffolding
├── config.js                 # ← EDIT THIS to change content
├── css/
│   └── styles.css            # All styles. Light + dark theme via CSS variables.
└── js/
    ├── app.js                # Entry point (boot/wiring only)
    ├── blood-science.js      # TYPES, ANTIGENS, ANTIBODIES, canReceive()
    ├── theme.js              # Light/dark toggle
    ├── tabs.js               # ARIA tab navigation
    ├── ui-helpers.js         # Shared DOM helpers, derived tables
    ├── typing.js             # "Type a Sample" tab logic
    ├── match.js              # "Compatibility" tab logic
    └── cases.js              # "Case Studies" tab logic
```

Everything is plain HTML / CSS / ES modules. There is **no build step** and
no package manager.

## Editing course content

All editable content lives in **`config.js`** at the repo root, in a format
designed for non-coders. The file contains three sections:

| Section     | What it controls                                              |
| ----------- | ------------------------------------------------------------- |
| `APP_TEXT`  | App title, subtitle, and footer.                              |
| `PATIENTS`  | Roster shown in the **Type a Sample** tab.                    |
| `CASES`     | Clinical scenarios in the **Case Studies** tab.               |

The interpretation table on the Learn tab and the full compatibility reference
table are **derived automatically** from the blood science in
`js/blood-science.js` — there is no separate answer key to maintain.

### Add or change a patient

```js
export const PATIENTS = [
  { name: 'Patient 1',  type: 'A+'  },
  { name: 'Mrs. Alvarez', type: 'AB-' },   // ← new entry
];
```

`type` must be one of: `O-`, `O+`, `A-`, `A+`, `B-`, `B+`, `AB-`, `AB+`.

### Add or change a case study

```js
export const CASES = [
  {
    tag: 'Emergency Department',
    narrative: 'A 34-year-old woman ... <strong>A+</strong> ...',
    question: 'Which of the available units can be safely transfused?',
    options: [
      'B+ — it is the closest match available',
      'O+ — it carries no A or B antigens',
      'AB− — it is Rh-negative so it is always safe',
      'None of these are safe; wait for A+ units',
    ],
    correct: 1,                            // 0-based index of the right option
    explanation: '<strong>O+</strong> is the correct choice ...',
  },
];
```

`narrative` and `explanation` accept simple inline HTML (`<strong>`, `<em>`,
`<br>`) for emphasis.

## Running locally

Because `js/app.js` is loaded as an ES module, opening `index.html` directly
via `file://` will not work in most browsers (CORS blocks module imports).
Serve the directory over HTTP instead:

```sh
# Python 3
python3 -m http.server 8000

# Or Node
npx serve .
```

Then open <http://localhost:8000/>.

## Deploying to GitHub Pages

1. Push to a GitHub repository.
2. In **Settings → Pages**, set:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main` (or whichever you publish from), folder `/ (root)`
3. The simulation will be available at
   `https://<user>.github.io/<repo>/`.

No additional configuration is required — the site is fully static.

## Accessibility

The simulation targets **WCAG 2.1 AA** / **Section 508** conformance so it
can be used in U.S. higher-education contexts:

- Semantic landmarks (`<header>`, `<main>`, `<footer>`), heading hierarchy,
  table captions and scoped headers.
- Skip-to-content link.
- ARIA tabs with full arrow / Home / End keyboard support.
- All interactive elements are real `<button>`s with explicit `type="button"`,
  visible focus rings, and accessible names.
- Color is never the sole signal for results — every status is paired with
  text ("Agglutination" / "No clumping") and a symbol.
- `aria-live` regions announce reagent reactions, question changes, and
  scores to screen readers.
- Light- and dark-theme palettes both meet 4.5:1 contrast for body text and
  3:1 for UI components and graphical objects.
- Respects `prefers-reduced-motion` (disables the agglutination animation)
  and `prefers-color-scheme` (initial theme).
- Supports Windows High Contrast / `forced-colors` mode.

## Browser support

Any modern browser that supports ES modules (Chrome ≥ 61, Firefox ≥ 60,
Safari ≥ 11, Edge ≥ 16). No transpilation or polyfills required.

## License

See [LICENSE](LICENSE).
