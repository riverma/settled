# Settled — Product Specification (v0.1)

**A pocket decision coach**
*Progressive Web App · Offline-first · No accounts, no servers*
*Home: https://settled.riverma.com*

> **Status.** This specification is written directly from `proposal/proposal-v2.md`
> (sign-off round: name **Settled**; engine **adaptive coach**; **the coin dropped**;
> v0.1 ships **three methods** — Good enough · Weigh it up · Look ahead — plus the
> Make-it-real close). No interactive mockup was built; the team chose to write the
> spec first. The spec is therefore the design authority for v0.1. A later mockup, if
> made, reconciles *to* this document unless a decision is explicitly revised here.

> **Design system: Ahimsa.** Settled is built on the **Ahimsa Design System** — a
> design language "rooted in non-harm," with two aesthetics (**Day**: warm cream,
> Fraunces; **Night**: blue-black, DM Sans). One premise governs every screen: *if a
> design pattern requires the user to lose for the product to win, this system will
> not produce it.* For a decision app this is not decoration — the system's refusals
> (no streaks, no scores-as-pressure, no manufactured urgency, no shame) are what make
> a decision coach trustworthy rather than nagging. Tokens are referenced by semantics
> only (`--surface-elevated`, `--accent-primary`, …), so the same markup renders in
> Day and Night. Companion: `research/decision-methods-research.md`.

---

## 1. Summary

Settled is a free, installable web app that helps a person make a decision and move
on. The person writes what they are deciding and, optionally, their options; the app
asks **one** question about how much it matters and — as an **adaptive coach** — walks
them through the lightest of three proven, evidence-backed methods, then closes every
session the same way: the decision in one sentence, a first step, and when the step
will happen.

It is a **coach, not a calculator.** The app has no opinion about what the person
should decide. Its only job is to lend enough structure, for long enough, to break the
stuck loop — and then get out of the way. There is no backend, no account, and no
network dependency. All data lives in an embedded local database on the device, with
first-class export / import / backup.

### The one-sentence pitch

*A pocket decision coach. Tell it what you're deciding, and it walks you through one
proven method, sized to how much it matters, so you can decide and move on.*

---

## 2. Background: why people get stuck, and what breaks the loop

The app's steps are built on the decision-science literature summarized in
`research/decision-methods-research.md`. The causes of paralysis are emotional, not
informational: **choice overload** (Iyengar & Lepper 2000), **maximizing vs.
satisficing** (Schwartz et al. 2002), **anticipatory regret** (Janis & Mann 1977),
**emotional flooding** (Kahneman 2011), and **narrow framing** (Heath & Heath 2013).

What reliably breaks the loop — and the method each move maps to:

| Break | Mechanism | Method in Settled |
|---|---|---|
| Cap the options, set a bar | satisficing (Simon 1956; Schwartz 2002) | **Good enough** |
| Externalize the trade-offs | written criteria / MCDA (Pugh 1981) | **Weigh it up** |
| Take temporal distance | 10/10/10 (Welch 2009; Liberman & Trope 1998) | **Look ahead** |
| Anticipate regret openly | pre-mortem (Klein 2007) | **Look ahead** (regret check) |
| Widen the frame | one-more-option nudge (Heath & Heath 2013) | optional step before scoring |
| Commit with a plan | implementation intentions (Gollwitzer 1999) | **Make it real** (the close) |

**Dropped from the engine:** the *coin / preference-reveal* fallback. It bordered
Ahimsa's "no gimmicks" line, and the still-torn case is already served by the
always-present *try a different way* control plus the regret check in Look ahead. It is
noted in §10 as a possible future text handout only.

---

## 3. Product principles

1. **Coach, don't decide.** The app never recommends an option or implies a "right"
   answer. It offers structure; the person is always the authority.
2. **Size the structure to the stakes.** Adding only as much method as the decision
   needs is itself the anti-paralysis move. One stakes question drives the engine.
3. **Being torn is never a failing.** No copy, no visual, no flow may imply that
   indecision is a problem with the person. Leaving mid-decision is honored.
4. **Mobile-first, offline-always.** Every feature works with zero connectivity. No
   CDNs; all assets self-hosted and cached. A build check fails on any network fetch.
5. **Private by default.** Nothing leaves the device unless the person exports a file.
   No analytics, no accounts, no server.
6. **Warm, calm, unhurried.** One question per screen. No timers, no gamification, no
   counts-that-compete. Stakes are words, never a 1-10 slider.
7. **Honor proven methods by name.** Every method carries a short "Why this works" note
   that names the real method and its source. Transparency is an Ahimsa value and a
   user requirement.
8. **The file is the format.** Export is a small, human-readable, hand-editable file;
   a person with a text editor is a full citizen. One decision list, one file.
9. **Nothing appears unasked.** No modal on load, no tour, no notification request, no
   "update available" banner (a quiet toast only, after an action the person took).

---

## 4. Personas & core journeys

### Personas

- **Priya (quick call).** Needs to pick a lunch spot / a plan for Saturday. Low stakes;
  wants to stop deliberating and move on. → Good enough.
- **Marcus (real choice).** Three apartments, a few things that matter (rent, commute,
  light). Wants to compare without turning it into a spreadsheet. → Weigh it up.
- **Dana (the big one).** "Should I take the new job?" No tidy options, lots of
  feeling. Needs distance and a regret check. → Look ahead.
- **Sam (the reopener).** Decided last week, second-guessing now. Reopens a decided
  decision freely; nothing is locked.

### Journey A — A quick, low-stakes call (Good enough)

1. Priya opens Settled and taps **New decision**. She types *"Where to get lunch?"* and
   adds three options.
2. Stakes screen: *"How much does this one matter?"* → **A little.** The engine opens
   **Good enough**.
3. She writes her acceptance bar in her own words (*"close, cheap, open now"*), checks
   options against it, and picks the first that clears it.
4. **Make it real:** one sentence (*"Getting the noodle place."*). First step and when
   are optional; she leaves them blank. Saved. Back on Home.

### Journey B — A real choice with options (Weigh it up)

1. Marcus adds three apartments as options. Stakes → **Somewhat.** With options present,
   the engine opens **Weigh it up**.
2. Optional widen step: *"Can you think of one more option?"* — he skips it.
3. He names 2-5 things that matter, weights them, scores each option lightly (0 / 1 / 2).
4. The app shows a **quiet ordering** (a list, not a bar chart). He can **try a different
   way** at equal prominence.
5. **Make it real:** sentence + first step (*"email the landlord"*) + when (*"tomorrow
   morning"*). Saved.

### Journey C — A big, emotionally loud decision (Look ahead)

1. Dana writes *"Should I take the new job?"* and skips options ("I just need to think").
2. Stakes → **A lot.** With no options, the engine opens **Look ahead**.
3. *10/10/10:* how will she feel in 10 minutes / 10 months / 10 years, for each side.
4. *Regret check:* if it went wrong, the most likely cause — and can she guard against it?
5. **Make it real:** sentence + first step + when. Saved.

### Journey D — Reopen a decided decision

1. Sam taps a **Decided** row on Home. It reopens freely (nothing is locked), keeping its
   history. He can change the sentence, run a different method, or leave it as is.

---

## 5. Feature specification

### 5.1 The adaptive engine

The engine is a small, deterministic function of two inputs — **stakes** (A little /
Somewhat / A lot) and **option count** (0 = "just thinking" / 2-8) — producing a
**suggested** method. The suggestion is never binding.

| Stakes | Options present (2-8) | No options ("just thinking") |
|---|---|---|
| **A little** | Good enough | Good enough |
| **Somewhat** | Weigh it up | Look ahead |
| **A lot** | Look ahead *(offer Weigh it up to compare)* | Look ahead |

Rules:

- Exactly **one** stakes question is ever asked: *"How much does this one matter?"* with
  three warm word-options. Never a numeric slider.
- The suggested method opens, but a **try a different way** control sits on every method
  screen, equal in visual weight to continue. Choosing it offers the other two methods.
- A **stop for now** control sits beside it, equal weight; leaving keeps the draft and
  returns to Home. Leaving weighs the same as continuing.
- When options exist, one optional **widen** step precedes scoring/selection: *"Can you
  think of one more option?"* — phrased as curiosity, never homework; skippable.
- The engine holds **no opinion** beyond which method is lightest; it never scores,
  ranks, or recommends an option.

### 5.2 Method — Good enough (satisficing)

*Real method: satisficing (Herbert Simon). Best for small stakes, "just move on."*

Screens:
1. **Set the bar.** A free-text field: *"What would make an option good enough?"*
   (e.g. "close, cheap, open now"). No fixed criteria, no scoring.
2. **Check & pick.** Options are listed; the person marks the first that clears the bar
   and selects it. If there are no options, the bar itself becomes the decision test
   ("the first thing that clears this is my answer").
3. → **Make it real.**

"Why this works" note: names Simon / bounded rationality; one short paragraph on why
"good enough, then act" beats chasing the best.

### 5.3 Method — Weigh it up (weighted criteria matrix)

*Real method: weighted decision / Pugh matrix (MCDA). Best for 2-8 options, real stakes.*

Screens:
1. **What matters.** Add 2-5 criteria in the person's own words.
2. **How much each matters.** A light weight per criterion (three steps: *a little /
   some / a lot* — words, mapped internally to 1 / 2 / 3; never shown as a slider).
3. **Score the options.** For each option × criterion, a light **0 / 1 / 2** ("not
   really / sort of / yes"). Deliberately coarse; not fussy numbers.
4. **The ordering.** A quiet, honest list of options from highest to lowest weighted
   sum. **Not** a percentage bar chart, not a scoreboard, no "winner" language. Copy
   frames it as *"here's how they line up — you decide."*
5. → **Make it real.**

Scoring is internal arithmetic only; the number is never presented as a verdict on the
person or the option's worth.

### 5.4 Method — Look ahead (10/10/10 + regret check)

*Real method: 10/10/10 (Suzy Welch) + pre-mortem (Gary Klein). Best for binary /
emotionally loud / no-options decisions.*

Screens:
1. **Ten minutes.** How will you feel about each side in 10 minutes?
2. **Ten months.** Same question, 10 months out.
3. **Ten years.** Same question, 10 years out. (Each is one short free-text reflection;
   none required to proceed.)
4. **Regret check.** *"Imagine it went wrong. What's the most likely cause — and can you
   guard against it?"* Two short fields; the second converts fear into an action item.
5. → **Make it real.**

"Why this works" note names temporal distance (Welch / Liberman & Trope) and the
pre-mortem (Klein), with the ~30%-more-risks-surfaced finding, in plain language.

### 5.5 Make it real (the close, always)

*Real method: implementation intentions (Gollwitzer). Always runs; closes every
decision.*

A single card with three fields:
- **The decision, in one sentence.** (Required — the only required field in the app.)
- **First step.** (Optional.)
- **When.** (Optional; a gentle **plain-text** field, e.g. "Monday morning" — never a
  date picker, never a reminder, **no notifications, ever.**)

On save, the decision's status becomes **Decided** and the person returns to Home.

### 5.6 Home

- Opens here. A warm prompt (*"What's on your mind?"*) and a **New decision** entry.
- **Recent decisions** as calm rows, newest first, each showing its question and status
  (**Draft · In progress · Decided**). A Decided row also shows its one-sentence
  decision.
- **No count badges, no "N this week", no streaks, no scores.** Tapping a row resumes
  it; Decided rows reopen freely (§5.9).
- **Empty state:** one warm line inviting the first decision and one example chip
  ("Take the new job?"). No tour, no modal.

### 5.7 New decision

A single screen:
- A large **question** field.
- An editable **options** list (0-8), with an explicit *"No options yet — I just need to
  think"* state that carries equal weight to adding options.
- A **skip / continue** trail at equal prominence.

### 5.8 Stakes

One screen, one question: *"How much does this one matter?"* — **A little / Somewhat / A
lot**, as three equal chips. No default pre-selected; no slider; no numbers.

### 5.9 Decision lifecycle

- **Draft** — started, not yet past stakes (or left before a method completed).
- **In progress** — a method is underway; closing mid-session keeps the draft at this
  status.
- **Decided** — Make it real saved with a sentence.
- Nothing is ever **locked.** Any decision reopens from Home, keeps its prior content,
  and can be re-run through any method or edited. Reopening is passive — no "Is it still
  right?" nagging in v0.1 (noted as a gentle v1+ idea in §10).

### 5.10 Method info — "Why this works"

Each method screen links to a one-paragraph note that **names the real method and its
source** (§5.2-5.5). Opens inline (a sheet), never a modal on load. Transparent by
design.

### 5.11 Settings

- **Aesthetic:** Day / Night toggle (writes the theme class on `<html>`).
- **Export / Import / Back up** (§5.12).
- **Why "Settled"** — a short note on the name.
- **About** — author credit, licence (AGPL-3.0), and the privacy story in plain words.
- **Erase all data** — asked twice, **back up first** offered on the way (mirroring
  Giraffy). The one action undo does not cover. Rendered with warmth, never a red alarm
  (there is no red token in Ahimsa).

### 5.12 Export, import, backup

- **Export is first-class.** One small, human-readable file listing every decision —
  question, options, stakes, method used, the sentence, the first step, the when,
  status, timestamps. Stored wherever the person wants; re-importable.
- **Format: plain YAML, not a new format** (see §6). One standard `.yaml` document, a
  small header plus a list of decisions. A `settled:` version key inside lets any YAML
  tool read the file and lets the app migrate older files forward; no custom extension,
  nothing nonstandard.
- **Backup = the whole app state** in one file; **restore replaces it exactly** and is
  undoable. On browsers with the File System Access API (desktop Chromium) the app may
  offer to keep a copy in a chosen folder; where absent (every phone) it says so plainly
  and keeps the one-tap export.

### 5.13 Undo / redo

App-wide session undo / redo for destructive or lossy actions (deleting a decision,
restoring a backup, erasing options). Each add/remove is one step. Erase-all is the one
action undo does not cover (hence the two confirmations). No `beforeunload` prompt.

---

## 6. The open file format (plain YAML)

A single YAML 1.2 document: a small header plus a list of decisions. **Plain YAML, no
custom extension** — anything that reads YAML reads a Settled file. Designed to be read
top-to-bottom by a human and re-imported without loss.

### 6.1 Example

```yaml
# A Settled export — your decisions, in plain text.
# Read it top to bottom, or re-import it at https://settled.riverma.com
settled: "1.0"
exported: 2026-10-08T18:30:00Z
decisions:
  - id: 7f3b9e2a-...
    question: "Should I take the new job?"
    options: []                 # empty = "just thinking"
    stakes: a-lot               # a-little | somewhat | a-lot
    method: look-ahead          # good-enough | weigh-it-up | look-ahead
    work:                       # method-specific, all optional
      ten_minutes: "Relieved, a bit scared."
      ten_months: "Probably glad I moved."
      ten_years: "Won't remember the fear."
      regret_cause: "The team turns out toxic."
      regret_guard: "Ask to meet the team first."
    sentence: "I'm taking the job."
    first_step: "Reply to the offer email."
    when: "Monday morning"
    status: decided             # draft | in-progress | decided
    created: 2026-10-08T18:10:00Z
    updated: 2026-10-08T18:30:00Z
```

A **Weigh it up** decision instead carries:

```yaml
    options: ["Apartment A", "Apartment B", "Apartment C"]
    method: weigh-it-up
    work:
      criteria:
        - { name: "Rent",    weight: 3 }   # 1=a little 2=some 3=a lot
        - { name: "Commute", weight: 2 }
        - { name: "Light",   weight: 1 }
      scores:                              # option index -> [score per criterion], 0|1|2
        0: [2, 1, 2]
        1: [1, 2, 1]
        2: [0, 2, 2]
```

A **Good enough** decision carries `work.bar: "close, cheap, open now"` and
`work.chosen: <option index or free text>`.

### 6.2 Schema rules

- `settled` version key is required; the importer migrates older versions forward.
- `question` and `id` are required per decision; everything else may be absent (a Draft
  may have only those two).
- `stakes` ∈ {`a-little`, `somewhat`, `a-lot`}; `method` ∈ {`good-enough`,
  `weigh-it-up`, `look-ahead`}; `status` ∈ {`draft`, `in-progress`, `decided`}.
- Unknown keys are preserved on round-trip where practical (hand annotations survive).
- The format description + JSON Schema are published under **CC0** at the permanent spec
  URL so any tool can read/write a Settled file; the app and this spec are AGPL-3.0.

---

## 7. Information architecture & screens

```
Home ("What's on your mind?")
  ├── New decision ──► Stakes ──► Method screen(s) ──► Make it real ──► saved
  │        │             │            │  (try a different way / stop for now
  │        │             │            │   on every screen, equal weight)
  │        └─ options (0-8) / "just thinking"
  └── Recent decisions (Draft · In progress · Decided) ──► resume / reopen

Settings (Day/Night · Export/Import/Back up · Why "Settled" · About · Erase all)
Method info sheet ("Why this works") — reachable from any method screen
```

Screen inventory (v0.1): **Home · New decision · Stakes · Good enough · Weigh it up ·
Look ahead · Make it real · Method info · Settings/About.**

Each method gets **one** calm surface mood via `.ah-surface--<gradient>` (Good enough =
warm; Weigh it up = paper; Look ahead = twilight) — one gradient per screen, never per
step.

---

## 8. Technical architecture

Requirements here are normative; specific libraries are **recommendations with
reasoning** — substitute equivalents that meet the same requirement. There is no
mockup; the build is produced directly from this spec.

**Design system: Ahimsa.** Link one stylesheet (`ahimsa-day.css` / `ahimsa-night.css`),
put the theme class on `<html>`, copy `fonts/` locally (including the `OFL-*.txt`
files). Reference **semantic tokens only**. Never load a font, script, or stylesheet
over a network. Never set `maximum-scale` / `user-scalable=no`. Use only classes that
exist in the system (§ Ahimsa SKILL); do not invent `.ah-badge` / `.ah-alert`.

### 8.1 App shell / UI framework

**Requirement:** a small, fast, installable SPA; bundle < 200 KB gzipped excluding
fonts; **no runtime network requests**.

**Recommendation: Svelte + Vite.** Compiler-based, minimal runtime, smallest bundle —
ideal for mostly-static calm screens with one small wizard. (Matches the family: Giraffy
and Treasured.)

### 8.2 Local database

**Requirement:** embedded, durable, transactional local storage for decisions and
settings, with **versioned schema migrations**. In the browser: **IndexedDB**.

**Recommendation: Dexie.js** (~25 KB) for its migration system — the schema *will*
evolve and user data must survive every upgrade. (`idb` is acceptable but lacks
migrations; raw IndexedDB is foot-guns; SQLite-WASM is overkill.)

**Content Security Policy** (in `index.html`, since a static host sets no headers): the
load-bearing directive is **`connect-src 'none'`** — the browser enforces that the app
makes no network request of any kind. Plus `script-src 'self'`, `style-src 'self'
'unsafe-inline'`, `img-src 'self' data:`, `font-src 'self'`, `base-uri 'none'`,
`form-action 'none'`.

### 8.3 YAML

**Requirement:** parse/emit YAML 1.2, round-tripping hand-edited files gracefully.
**Recommendation: `yaml` (eemeli/yaml)** for comment preservation and precise error
positions (powering friendly import-error messages).

### 8.4 Service worker / PWA plumbing

**Requirement:** precached app shell; **100% offline**; versioned cache-busting; a quiet
"update available" toast (never a banner on load); `manifest.webmanifest` with `display:
standalone`, maskable icons, Day/Night theme colors; `file_handlers` for
`.yaml`; `launch_handler` focus-existing. Installability verified on iOS
Safari (A2HS), Android Chrome, desktop Chrome/Edge. Web Share → copy-to-clipboard
fallback everywhere. **Recommendation: Workbox** at build time only (no runtime network
dependency).

### 8.5 Supporting pieces

- **IDs:** `crypto.randomUUID()` — no library.
- **Import validation:** **Ajv** against the published `settled.schema.json` (same schema
  as the permanent spec URL), so app, hand-editors, and third parties validate alike.
- **Offline guarantee:** a build-time `check-offline` that **fails the build on any
  `fetch`/CDN reference** (§ proposal). Plus a `check-licence` for headers.
- **Testing:** **Vitest** on the correctness-critical cores — the engine's
  stakes→method mapping, Weigh-it-up arithmetic/ordering, and YAML round-tripping — and
  **Playwright** for one happy-path E2E (new decision → each method → make it real →
  export → re-import).
- **Build:** **Vite** (pairs with Svelte + Workbox; hashed assets for the SW precache).

### 8.6 Hosting & openness

- Any static host over HTTPS. Target: **settled.riverma.com** (CNAME on the existing
  riverma.com zone; GitHub Pages / Codeberg Pages, per family practice). Treat the
  domain as permanent once installs exist — a move orphans local data.
- Add a tile to the **`apps` index** (`apps.riverma.com`): preview image, tile order,
  manifest, per the `apps` repo AGENTS release discipline (CHANGELOG + version string in
  `index.html`, `sw.js` `VERSION`, and `CHANGELOG` links kept in lockstep; update the
  `ASSETS` precache list on any asset change; GitHub release on minor/major bumps).
- **Licence:** app + spec **AGPL-3.0-or-later**; the plain-YAML format description,
  JSON Schema, and templates additionally **CC0**. Credit line *"Created with ♥ by Rishi
  Verma. © 2026."* on About.

**Explicit non-requirements:** no backend, no accounts, no notifications, no real-time
sync, no analytics.

---

## 9. Non-functional requirements

- **Accessibility:** WCAG 2.1 AA. Full keyboard operability; visible focus
  (`--focus-ring`); every interactive element a real element with an accessible name at a
  44px target (`.ah-hit` if the painted control is smaller), acting on pointer-up so a
  mis-touch can abort; no drag/hover/path-gesture requirement; running prose at
  `--size-reading` (≥16px). Respects `prefers-reduced-motion` and
  `prefers-color-scheme`.
- **Tone:** sentence case, short declarative sentences, no exclamation marks, no
  ALL-CAPS, **no emoji, no icon set** (a few restrained unicode glyphs `←`, `×`, `+`, `·`
  only, set in the type, never coloured). **No em dashes in app copy** (this document
  uses them; the app restructures or uses a comma / middle dot / colon). A single
  `strings` file so every word is tunable; structured for future i18n.
- **Ahimsa hard constraints (restated as acceptance criteria):** emit nothing that
  appears on its own (no `alert`/`confirm`, no modal on load, no banner, no push, no
  `role="alert"` / `aria-live="assertive"`, no `setInterval`, no autoplay, no
  `beforeunload`, no `autofocus`); **never emit red**; every leaving/destructive action
  has an **equal-weight warm escape** ("Keep it" / "Not now"), never confirmshaming;
  **no numbers as pressure** (no streaks, scores-as-verdict, countdowns, "only N left");
  one gradient per screen; never claim what cannot be verified; never fail silently.
- **Performance:** first load < 3s on a mid-range phone over 3G; < 100ms step
  transitions; the decisions list virtualizes past ~200 rows.
- **Privacy:** no telemetry of any kind. The privacy story is stated plainly on About.
- **Content sensitivity:** decisions may be personal; no OS-level previews (there are no
  notifications), and an optional app-open PIN is future work (§10).

---

## 10. Out of scope for v0.1 (parking lot)

- **The coin / preference-reveal** as an optional end-of-session **text handout** ("if
  you're still torn, try this") — dropped from v0.1; revisit only if wanted.
- **Full WRAP walk** (Widen · Reality-test · Attain distance · Prepare to be wrong) as a
  "long form" method for big life decisions.
- **Pros / cons** as the simplest two-column method (the matrix generalizes it).
- **Criteria templates** ("money / time / people / health") offered in Weigh it up.
- **Gentle reopen** of decided decisions ("Is it still right?" — passive, never a
  notification).
- **Share one decision's sentence** as plain text (no account needed).
- **Optional app-open PIN / biometric lock.**
- **Localization beyond English.**
- **LLM-assisted coaching** — the engine is deliberately deterministic and offline in
  v0.1.

---

## 11. Decisions & remaining open questions

**Resolved (proposal v2 sign-off):**

| Question | Decision |
|---|---|
| Name & brand | **Settled** — single-word, in-family; subdomain `settled.riverma.com`; built on **Ahimsa** (Day/Night). |
| Engine shape | **Adaptive coach** — one stakes question + option count select the lightest method; suggestion, never a sentence. |
| The coin | **Dropped** from the product; noted as a possible future text handout only (§10). |
| v0.1 method scope | **Three methods** — Good enough (satisficing) · Weigh it up (weighted matrix) · Look ahead (10/10/10 + regret check) — plus **Make it real** (implementation intention) as the universal close. |
| Stakes granularity | **Three words** — A little / Somewhat / A lot. No slider, no numbers. |
| Weigh-it-up scoring | **0 / 1 / 2** per option-criterion; criteria weights as three words (1/2/3 internal). |
| Privacy & storage | On-device IndexedDB; no accounts, no network; `connect-src 'none'`; first-class export/import/backup. |
| Licence | App + spec **AGPL-3.0-or-later**; the plain-YAML export format + schema also **CC0**. |

**Still open (small, non-blocking — confirm during build):**

1. ~~**Export extension/format**~~ — **resolved 2026-10-08: plain YAML** with a `.yaml`
   extension and a `settled:` version key inside; no custom format (§5.12, §6).
2. **Name trademark sanity check** on "Settled" (quick search before the tile ships).
3. **Exact "Why this works" copy** for each method (one paragraph each) — draft at build,
   keep in the `strings` file.
4. **Surface moods** — confirm the three gradient choices (warm / paper / twilight) read
   well in both Day and Night.
5. **Whether to build a mockup after all** before coding, or go straight to the Svelte
   build from this spec. (Spec-first was chosen; a mockup remains optional.)

---

## Appendix A — Engine mapping (reference data)

```
suggest(stakes, optionCount):
  if stakes == "a-little":                      return "good-enough"
  if stakes == "somewhat":
      return optionCount >= 2 ? "weigh-it-up" : "look-ahead"
  if stakes == "a-lot":
      # look-ahead is primary; offer weigh-it-up when options exist
      return "look-ahead"   # + offerCompare = (optionCount >= 2)
```

Every method screen renders, at equal weight: **continue**, **try a different way**
(→ pick either of the other two), **stop for now** (→ save draft, Home).

## Appendix B — Deliverables checklist for the build

- [ ] PWA shell (manifest, Workbox SW, 100% offline, installable, `.yaml`
      `file_handlers`, focus-existing `launch_handler`)
- [ ] Ahimsa Day/Night wiring (self-hosted Fraunces + DM Sans; theme class toggle;
      semantic tokens only; one gradient per method screen)
- [ ] Home (calm rows, statuses, empty state, no counts/streaks)
- [ ] New decision (question + 0-8 options + "just thinking") and Stakes (3 chips)
- [ ] Adaptive engine (Appendix A) with `try a different way` / `stop for now` on every
      method screen + unit tests on the mapping
- [ ] **Good enough** (bar → check & pick) + "Why this works"
- [ ] **Weigh it up** (criteria → weights → 0/1/2 scores → quiet ordering, no scoreboard)
      + arithmetic unit tests + "Why this works"
- [ ] **Look ahead** (10/10/10 → regret check) + "Why this works"
- [ ] **Make it real** (sentence required; first step + when optional; no date picker,
      no notifications)
- [ ] Decision model + lifecycle (Draft/In progress/Decided; reopen freely) with Dexie
      migrations
- [ ] Export / import / backup (YAML, Ajv-validated, round-trip-safe) + undo/redo +
      Erase all (two sheets, back up first)
- [ ] Export-format spec page + JSON Schema + hand-author template (CC0); permanent URL
- [ ] Settings/About (Day/Night, Why "Settled", AGPL link, privacy in plain words)
- [ ] `check-offline` + `check-licence` build gates; Vitest cores + one Playwright E2E
- [ ] `apps` index tile (preview, order, manifest) + release discipline (CHANGELOG,
      version strings, `sw.js` VERSION + ASSETS, GitHub release on minor/major)
```
