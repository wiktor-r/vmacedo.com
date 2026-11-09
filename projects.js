/* projects.js — the site's data. Edit HERE, not in the pages.
 *
 * fields:
 *   id         file name in shots/ (without .png)
 *   name       displayed title
 *   tags       one or more ids from TAGS below — a project can sit in several
 *   active     true = "in progress", false = "paused" (archived in Nightwatch)
 *   what       what the thing is
 *   how        the mechanics, observable on screen. No motive, no advantage.
 *   decision   ONLY where a written record exists. Empty disappears from the page.
 *
 * The "decision" field used to make me invent motivation, so now it only appears where the
 * decision is written down somewhere: the project's logbook, HOUSE-THEME.md, or, for Soroban,
 * the about.md holding Victor's own requests. The source is noted in a comment alongside.
 * The other thirteen carry only what it is and how it works.
 *
 * TAGS replaced the old one-per-project `cat` (Vision, Language, Math, Logic, Affordances,
 * Morphology, System) after an affinity pass on ~/Documents/Whiteboards/portfolio-affinity.tldr,
 * 2026-08-18. Categories forced each project into exactly one box; these don't. Four projects
 * carry two tags because they sat between two clusters on the board, and that is the point —
 * the grouping is a vocabulary, not a partition.
 */

/* The seven clusters off the board, worded for the page. The whiteboard wording was
   working notes ("drill skilll into noggin"); these are the same seven groupings said
   in two or three words, because they sit in the 11px uppercase filter row. */
const TAGS = [
  { id: 'invisible-visible', label: 'Abstract made visible' },
  { id: 'drill',             label: 'Skill drills' },
  { id: 'controls',          label: 'Intuitive controls' },
  { id: 'analogy',           label: 'Analogy as interface' },
  { id: 'work-model',        label: 'Interaction models' },
  { id: 'real-problem',      label: 'Built from need' },
  { id: 'companion',         label: 'Companion pieces' }
];

const WORKS = [
  {
    id: 'munselltools', name: 'MunsellTools', tags: ['drill'], active: true,
    what: 'A flat-lit 3D scene with one tool per variable of the Munsell system: hue is the gear, value is the plumb bob, chroma is the pump.',
    how: 'You hold a tool, point it at a surface and drip. Each touch steps one notch along that variable and only that one; with shift the tool runs backwards and sucks the step back out. Keys 1, 2 and 3 switch tools.',
    decision: 'The scene never shades.'   // recorded: Victor's instruction, MunsellTools
  },
  {
    id: 'dimensions', name: 'Dimensions of Colour', tags: ['companion'], active: false,
    what: "A readable reconstruction of David Briggs's material on colour, which existed scattered across an old site. Chapters 1 to 4, personal use.",
    how: 'A navigable table of contents opens the chapters like notebook pages, in the order the subject builds itself.',
    decision: ''
  },

  {
    id: 'unparse', name: 'Unparse', tags: ['invisible-visible', 'drill'], active: true,
    what: 'A game where you assemble the syntactic structure of a sentence by fitting pieces together, instead of drawing the tree with lines and labels.',
    how: 'Pieces join through a pair of gestures — pick and merge — and there is a phase for marking the word class. A ladder of levels controls what shows up.',
    decision: 'The roguelike systems were built and then removed, in July 2026, along with the decision to keep a single core system and no sentence with two possible analyses.'   // recorded: Unparse logbook
  },
  {
    id: 'tensemachine', name: 'Tense Machine', tags: ['invisible-visible'], active: false,
    what: 'A verb tense console built around a single sentence: BOB EATS THE BURGER.',
    how: 'Side arrows change the tense, vertical arrows change the aspect, A and D change the voice, and the sentence rewrites itself on every change. A timeline marks past, present and future around now, and Tab opens the conjugation table.',
    decision: ''
  },

  {
    id: 'spatialmath', name: 'SpatialMath', tags: ['invisible-visible', 'controls'], active: true,
    what: 'A spatial notation for the power–root–logarithm triad, where each role has a body: the base is a sphere, the exponent is a cone, the result is a target.',
    how: 'On one screen you write the symbol by hand and a pause closes the reading — the ink is replaced, where it stands, by the character that was recognised, and the shape reassembles beside it. On another, six identities: two roles appear in the expression, clicking the small capsule makes it grow until it matches its twin, the pair cancels out, and the third role stays written.',
    decision: 'The notation is for algebra, not for music, and the axioms are hand gestures.'   // recorded: SpatialMath logbook/lab-notes
  },
  {
    id: 'soroban', name: 'Soroban', tags: ['companion'], active: false,
    what: 'Japanese abacus, with a textbook and a fingering practice app.',
    how: 'Each operation is broken into discrete movements you walk through one at a time, one per slide, instead of jumping straight to the result.',
    decision: 'On tens complements the abacus has to show why that is happening, not just execute it; and the dark theme colours hold for both themes.'   // recorded: Soroban about.md
  },
  {
    id: 'cartesiancommander', name: 'Cartesian Commander', tags: ['drill'], active: false,
    what: 'Cartesian coordinates with no marker: position is the deformation two numeric ridges make where they cross.',
    how: 'Two controls regulate the deformation — intensity, from trough to hump, and width, from tight to spread. Arrows or H and L move in X, shift-arrows or A and F move in Y, and holding both walks the diagonal. There is a free mode, a target-hitting mode, and a chase mode where you survive.',
    decision: ''
  },

  {
    id: 'formdrill', name: 'FormDrill', tags: ['drill'], active: false,
    what: 'A logical form drill: recognising the structure of an argument separately from the subject it talks about.',
    how: 'Short repeated exercises, with the form swapping its content underneath.',
    decision: "The corrections made while building this drill became the rules used in the ones after it: when the design is wrong, you change the structure of the exercise, you don't add a hint or a scenario around it."   // recorded: drill rules written out of FormDrill
  },
  {
    id: 'readformula', name: 'Read the Formula', tags: ['drill'], active: false,
    what: 'Propositional logic read back into Portuguese: a capital letter is a whole sentence, and the legend below says which one.',
    how: 'The formula sits on top and the available sentences below; you assemble the reading by picking sentences, check it, and can take one choice back without resetting the rest.',
    decision: ''
  },
  {
    id: 'warehousechamber', name: 'Warehouse Chamber', tags: ['analogy'], active: false,
    what: 'Computer-assisted proof dressed as a warehouse, with tactics in place of typed commands.',
    how: 'The tactics are cards — rw swaps for a coin, rfl checks whether both sides are identical — and the terms are coins stamped for that chamber. You pick the card, pick the coin, hit FEED, and a mechanical arm executes the step. There is undo, and an archive on the side.',
    decision: ''
  },

  {
    id: 'vimnav', name: 'VimNav', tags: ['controls'], active: false,
    what: "Practice for Vim's navigation movements over a grid of characters.",
    how: 'Each movement scale has its colour — cream for character, purple for word, amber for line — and each key has a symbol standing where the action points: h near the grid, b further out, 0 at the edge. The symbol performs the movement instead of describing it, and its glow says whether the action is available.',
    decision: 'Distance in space encodes the reach of the movement, and the symbol does the action instead of explaining it — a pattern recorded as transferable along with Tetris Rotation.'   // recorded: HOUSE-THEME.md
  },
  {
    id: 'tetrisrotation', name: 'Tetris Rotation', tags: ['controls'], active: false,
    what: "An experiment on Tetris's three rotations, which share the same input space: counter-clockwise, 180 and clockwise.",
    how: 'Each rotation has its own colour and body — blue counter-clockwise, green 180, orange clockwise — and the body turns in the direction it represents when the rotation is possible.',
    decision: 'The colours of the pieces and the rotations are content, not theme: they survive any skin change, because changing them would change what the screen teaches.'   // recorded: HOUSE-THEME.md
  },
  {
    id: 'keyview', name: 'Keyview', tags: ['controls'], active: true,
    what: 'Typing practice with three fixed acts per round.',
    how: 'Every round is the same thing: type three words, name three keys on the map using the arrows and confirming, and take down three enemies sitting on them. Home row mode, with speed, accuracy and score measured, and the current key hidden until you slip.',
    decision: ''
  },
  {
    id: 'emojimodifierhint', name: 'Emoji Modifier Hint', tags: ['controls'], active: false,
    what: 'An ordinary to-do list with a shortcut-learning layer on top.',
    how: 'Hold a modifier and pause: it shows up as a symbol — ⌘ becomes 🍎, ⇧ becomes ⬆️, ⌘⇧ becomes both together. Every mouse gesture plays back the keys it would have replaced.',
    decision: ''
  },

  {
    id: 'cardinalearth', name: 'Cardinal Earth', tags: ['drill', 'controls'], active: false,
    what: 'Geography over the globe, with one target country per round.',
    how: 'You navigate with arrows or WASD — shift slow, ctrl fast — and take a scan to lock the position; the screen shows the distance to the centre of the crosshair, the hit and the streak. There is a cardinal mode with north up, map styles, grid, borders and compass, plus level, next appearance and due date for each target.',
    decision: ''
  },
  {
    id: 'modview', name: 'ModView', tags: ['invisible-visible'], active: false,
    what: 'Nemonic: the modifier keys as parts of a face.',
    how: 'Each modifier adds a fixed part — CTRL puts on a top hat, SHIFT puts on glasses, ALT puts on a moustache, WIN puts on a bow tie — and holding two assembles both at once. You can see the sixteen combinations side by side.',
    decision: ''
  },

  {
    id: 'desktopshell', name: 'DesktopShell', tags: ['work-model'], active: true,
    what: 'A desktop paradigm where the desktop is a half-open book and the windows are pages.',
    how: 'Windows behave like sheets: they turn, rest against each other and overlap like pages, instead of floating like independent rectangles.',
    decision: 'It left the house design system after having been built in it, because depth, light and material are the subject of the piece and the system forbids exactly that. What stayed were the motion curves and the rule of animating only transform and opacity.'   // recorded: HOUSE-THEME.md, quoting Victor
  },
  {
    id: 'nightwatch', name: 'Nightwatch', tags: ['real-problem'], active: true,
    what: 'The app that manages all these projects. The categories and states on this site come out of it.',
    how: "A list of folders with one note per folder, and categories that work as labels: you drag a project into one to archive it there, pin it with a click, and multiple selection uses ⌘ and ⇧. Whatever leaves the list goes to the Mac's Trash — it doesn't disappear.",
    decision: 'Archiving has a deliberate 30-second wait, aimed at compulsive checking rather than at the file. Category as folder was tested and reverted to label.'   // recorded: Nightwatch project.md
  },
  {
    id: 'doorman', name: 'Doorman', tags: ['real-problem'], active: false,
    what: 'A doorman standing in front of time-consuming sites.',
    how: 'To get in: a countdown and a written task — one line per thing, and the clock only starts when you confirm. Forty seconds to get in, eighty to leave wandering.',
    decision: ''
  },
  {
    id: 'nightflute', name: 'Night Flute', tags: ['companion'], active: false,
    what: 'An instrument played in the dark, with a night sky and a serif by candlelight.',
    how: '',
    decision: 'It stays outside the house design system: the night sky and the serif are not a theme applied on top, they are the instrument.'   // recorded: HOUSE-THEME.md
  }
];
