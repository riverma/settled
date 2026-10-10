# The mockup

`Settled.html` is the interactive prototype for sign-off: every screen, every state,
and the draft copy, built from `spec/SPECIFICATION.md` (which is the authority for
the build). It is a **self-contained static file** — open it in a browser, or serve
the folder over HTTP:

```sh
cd mockup
python3 -m http.server 8000   # then open http://localhost:8000
```

**How it is made.** Giraffy's mockup ran on a proprietary "design-composer" runtime
(`support.js`, `ios-frame.jsx`, `_ds/…`) that is not available on this machine, so
this mockup is hand-built instead — but on the **Ahimsa design system proper**, per
https://ahimsa-design.riverma.com/agents:

- The vendored dist stylesheet `_ahimsa/ahimsa.css` (pinned against
  `_ahimsa/CHECKSUMS`, fonts in `_ahimsa/fonts/`) supplies both aesthetics — the
  theme class goes on `<html>` (`ahimsa-day` / `ahimsa-night`) — plus every
  component class used: `.ah-btn`, `.ah-pill`, `.ah-chip`, `.ah-card`, `.ah-field`
  (+ `--essence`), `.ah-caps`, `.ah-quote`, `.ah-mono`, `.ah-toast`, `.ah-notice`,
  `.ah-sheet`, `.ah-scrim`, `.ah-actions`, `.ah-hit`, `.ah-hdr`, `.ah-stack`,
  `.ah-list`, `.ah-rule-row` and the typography classes.
- Mock-up code references **semantics only** (checked: zero palette-step
  references in the mock's own CSS/JS); nothing is fetched over the network
  (checked).
- **One approved root override**, scoped to `html.ahimsa-day` only: Day's canvas
  takes the warm dawn the family apps use (the correction the dist's own token
  notes cite). Night keeps the system's own deep blue-black canvas untouched.
- Constraint checks are encoded where the mock lives: interactive targets ≥ 44px
  (`.ah-hit::after` set non-blocking so it never intercepts taps), equal-weight
  escapes beside every destructive action, no red, no modal on load, no
  `alert()`/`confirm()`, no `aria-live="assertive"`, no `setInterval`, no
  `beforeunload`, no `maximum-scale`.

**What you can tap through**

- Home → new decision (question + 0-8 options + "no options yet") → stakes
  (A little / Somewhat / A lot).
- The engine suggests a method; **A different way** switches it on any method screen:
  Good enough (bar → check → result), Weigh it up (criteria → weights → 0/1/2 grid →
  quiet ordering), Look ahead (10 min / 10 months / 10 years → regret check → the
  read). The 0/1/2 and 1/2/3 arithmetic is live.
- Make it real (sentence required; first step and when optional) → save → decided
  row on Home.
- A decided row opens its decision view: **Export** writes a plain `.yaml` file —
  copy or download it. **Delete** asks once, keep/delete at equal weight.
- Settings: Day/Night theme switch, backup/restore stubs, About, and the two-step
  **Erase all data**.
- **Why this works** on every method screen names the real method (satisficing,
  decision matrix, 10/10/10 + pre-mortem, implementation intention).

**Plain YAML, not a new format.** The export sheet shows the file verbatim: a
standard YAML document with a `settled:` version key inside, `.yaml` extension —
resolved 2026-10-08 per the review comment. See `spec/SPECIFICATION.md` §5.12 / §6.

**Known mockup limits** (deliberate): no persistence between reloads, no service
worker, no undo/redo, no file-open import; the in-progress resume path seeds from
the two decided rows plus one draft. All of these are build-scope, not design
decisions.