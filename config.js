/* ============================================================
 * Blood Typing Simulation — Content (EDIT THIS FILE)
 * ============================================================
 *
 * This is the ONLY file you need to edit to change the activity.
 * No coding experience required — just follow the patterns below.
 *
 * A few rules to keep things working:
 *   • Text goes inside 'quotation marks'.  Keep the quotes.
 *   • Each entry ends with a comma — even the last word inside
 *     a block, if you like. It's safer to leave the commas in.
 *   • To make a word bold inside a narrative or explanation,
 *     wrap it like this:  <strong>bold word</strong>
 *   • Lines that start with //  are notes for you. The computer
 *     ignores them, so you can change them or leave them alone.
 *
 * If something stops working after an edit, the usual culprit is
 * a missing quote, a missing comma, or a missing closing bracket.
 * Every { needs a matching } and every [ needs a matching ].
 * ============================================================ */


/* ---- 1. Title bar text ----------------------------------------
 * Shown in the page header and footer. Plain text only.
 */
export const APP_TEXT = {
  title:    'Blood Typing Simulation',
  subtitle: 'ABO & Rh Blood Group Identification — Anatomy & Physiology II',
  footer:   'Blood Typing Simulation — Anatomy & Physiology II',
};


/* ---- 2. Patients for the "Type a Sample" tab ------------------
 * Students pick a patient, run the typing assay, and identify
 * the blood type. You may add, remove, rename, or reorder entries.
 *
 *   name : whatever shows on the button (e.g. 'Patient 1',
 *          'Mrs. Alvarez', 'Sample #14')
 *   type : the patient's true blood type — must be one of:
 *          'O-'  'O+'  'A-'  'A+'  'B-'  'B+'  'AB-'  'AB+'
 */
export const PATIENTS = [
  { name: 'Patient 1', type: 'A+'  },
  { name: 'Patient 2', type: 'O-'  },
  { name: 'Patient 3', type: 'B+'  },
  { name: 'Patient 4', type: 'AB-' },
  { name: 'Patient 5', type: 'O+'  },
  { name: 'Patient 6', type: 'A-'  },
];


/* ---- 3. Clinical case studies ---------------------------------
 * Each case is one block surrounded by  {  and  } .
 * Fields inside a case:
 *
 *   tag         — a short label shown at the top of the card
 *                 (e.g. 'Emergency Department').
 *   narrative   — the story. One or two short paragraphs.
 *   question    — the multiple-choice prompt.
 *   options     — exactly four answer choices, in order.
 *   correct     — which option is right.  COUNTING STARTS AT 0:
 *                   0 = first option
 *                   1 = second option
 *                   2 = third option
 *                   3 = fourth option
 *   explanation — what students see after they answer.
 *
 * To add a case, copy an existing block, paste it after the
 * comma, and edit the fields. To remove a case, delete the
 * whole block (from {  through  },).
 */
export const CASES = [

  {
    tag: 'Emergency Department',
    narrative:
      'A 34-year-old woman is rushed into the ED after a motor vehicle ' +
      'collision with significant internal bleeding. Her chart lists her ' +
      'blood type as <strong>A+</strong>. The blood bank reports that all ' +
      'A+ and A− units are currently allocated to surgery patients upstairs. ' +
      'The available units in the trauma cooler are: <strong>O+, B+, AB−</strong>.',
    question: 'Which of the available units can be safely transfused?',
    options: [
      'B+ — it is the closest match available',
      'O+ — it carries no A or B antigens',
      'AB− — it is Rh-negative so it is always safe',
      'None of these are safe; wait for the A+ units',
    ],
    correct: 1,
    explanation:
      '<strong>O+</strong> is the correct choice. Type O red cells carry no ' +
      'A or B antigens, so they will not trigger an ABO reaction in an A+ ' +
      'recipient, and the patient is already Rh-positive. B+ carries B ' +
      'antigens, which the patient’s anti-B antibodies would attack. ' +
      'AB− carries both A and B antigens — the B antigen alone is enough to ' +
      'cause a hemolytic reaction.',
  },

  {
    tag: 'Labor & Delivery',
    narrative:
      'A NICU nurse calls down for a small-volume transfusion for an anemic ' +
      'newborn whose cord blood typed as <strong>B−</strong>. The neonatal ' +
      'cooler currently contains: <strong>O−, O+, A−</strong>.',
    question: 'Which unit(s) can be safely given to this infant?',
    options: [
      'O− only',
      'O− or O+, since both are type O',
      'A−, since it matches the Rh factor',
      'Any of the three — neonates are immunologically immature',
    ],
    correct: 0,
    explanation:
      '<strong>O− only.</strong> The infant is B− (Rh-negative). O− red ' +
      'cells carry no A, B, or D antigens, so they are universally safe. O+ ' +
      'would introduce the D antigen to an Rh-negative recipient and risk ' +
      'sensitization — a concern that will follow this patient for life, ' +
      'especially if she is a future mother. A− carries A antigens, which ' +
      'the infant’s anti-A antibodies (acquired passively and produced ' +
      'over the first months of life) would target. Immune immaturity is ' +
      'real but does not erase transfusion-reaction risk.',
  },

  {
    tag: 'Clinical Laboratory',
    narrative:
      'You are an MLT student rotating through the blood bank. The bench tech ' +
      'hands you the typing slide below for patient <strong>#4471</strong> ' +
      'and asks you to call out the result before she enters it in the LIS:' +
      '<br><br>' +
      '• Anti-A well: <strong>agglutination</strong> (clumping)<br>' +
      '• Anti-B well: <strong>no agglutination</strong> (smooth)<br>' +
      '• Anti-D well: <strong>agglutination</strong> (clumping)',
    question: 'What blood type should be reported for patient #4471?',
    options: [
      'A−',
      'A+',
      'B+',
      'AB+',
    ],
    correct: 1,
    explanation:
      'Agglutination with anti-A means <strong>A antigens are present</strong>. ' +
      'No agglutination with anti-B means B antigens are absent. Agglutination ' +
      'with anti-D means the Rh(D) antigen is present, so the patient is ' +
      'Rh-positive. A antigens + no B antigens + Rh-positive = <strong>A+</strong>. ' +
      'Accurate result entry is critical here — a wrong type on the label can ' +
      'set up a fatal hemolytic reaction downstream.',
  },

  {
    tag: 'Operating Room',
    narrative:
      'A 58-year-old man with blood type <strong>AB+</strong> is undergoing ' +
      'open-heart surgery. Midway through the case, blood loss exceeds ' +
      'estimates and the surgical team requests additional units. The blood ' +
      'bank is running low and offers the OR nurse: ' +
      '<strong>A+, B−, O+, AB−</strong>.',
    question: 'Which of these units are safe to transfuse?',
    options: [
      'Only AB−, because it is the closest ABO match',
      'A+ and AB− only',
      'All four units are safe for this patient',
      'O+ and AB− only',
    ],
    correct: 2,
    explanation:
      '<strong>All four are safe.</strong> AB+ is the <strong>universal ' +
      'recipient</strong> for red blood cells. This patient has no anti-A, ' +
      'no anti-B, and no anti-D antibodies, so red cells carrying any ' +
      'combination of A, B, and D antigens will not provoke a reaction. ' +
      'A+ (A and D), B− (B), O+ (D only), and AB− (A and B) are all ' +
      'compatible.',
  },

  {
    tag: 'Pre-Hospital',
    narrative:
      'A paramedic crew arrives on scene at a construction-site fall. The ' +
      'patient is unconscious, has no ID, and is profoundly hypotensive. ' +
      'There is no time to type and crossmatch. The crew’s rig carries ' +
      'one type of low-titer whole blood for field transfusion.',
    question: 'Which blood type is the standard choice for an unknown ' +
              'patient in this scenario?',
    options: [
      'A+, because it is the most common blood type',
      'AB+, because it is the universal recipient type',
      'O−, because it is safe for any patient regardless of their type',
      'O+, because most people are Rh-positive anyway',
    ],
    correct: 2,
    explanation:
      'When the blood type is unknown, EMS and trauma protocols call for ' +
      '<strong>O−</strong>. With no A, B, or D antigens, O− red cells will ' +
      'not trigger a reaction regardless of the recipient’s actual ' +
      'type — including in a young female where Rh sensitization would be ' +
      'a long-term concern. (Some services use low-titer O+ whole blood for ' +
      'male trauma patients to preserve scarce O− stock, but O− remains the ' +
      'universal first reach.)',
  },

  {
    tag: 'Respiratory Care',
    narrative:
      'A respiratory therapist is at the bedside of a patient with severe ' +
      'anemia from a slow GI bleed. The patient’s blood type is ' +
      '<strong>B−</strong>, and a unit of packed red cells has just been ' +
      'hung. About ten minutes in, the patient’s SpO₂ begins ' +
      'falling, they spike a fever, and they complain of flank pain. The RT ' +
      'pages the nurse, who stops the infusion and pulls the unit to ' +
      'recheck the label.',
    question: 'Which donor unit, if hung in error, would best explain this ' +
              'acute hemolytic transfusion reaction?',
    options: [
      'B− packed cells (an exact match)',
      'O− packed cells',
      'O+ packed cells',
      'A+ packed cells',
    ],
    correct: 3,
    explanation:
      'A B− recipient carries <strong>anti-A antibodies</strong> in plasma ' +
      'and is Rh-negative. <strong>A+</strong> donor cells carry the A ' +
      'antigen (attacked by recipient anti-A) <em>and</em> the D antigen. ' +
      'This ABO mismatch is the classic cause of an acute hemolytic ' +
      'reaction — fever, flank/back pain, falling SpO₂, and ' +
      'hemoglobinuria. B− would be a perfect match. O− and O+ red cells ' +
      'carry no A or B antigens, so they would not produce this picture ' +
      '(O+ is still avoided in Rh-negative recipients for sensitization ' +
      'reasons, but it does not cause acute hemolysis).',
  },

];
