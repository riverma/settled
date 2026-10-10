# Changelog

Notable changes to Settled. The format follows [Keep a Changelog](https://keepachangelog.com),
and versions follow [Semantic Versioning](https://semver.org).

## [Unreleased]

## [0.2.0] - 2026-10-10

### Fixed

- **Leaving a blank decision no longer saves an empty draft.** Tapping New decision and
  then going Home without writing anything now discards the draft, so empty untitled rows
  no longer appear on the home list.
- **Good enough resume no longer lands on the wrong option.** The option cursor is reset
  when a decision is reopened, so a resumed decision never shows a blank or stale option.
- **The widen nudge now actually adds a scoreable option.** Adding an option inside Weigh
  it up keeps the scoring matrix and the final ordering in step with the options list.
- **"The act" is no longer saved as a chosen option.** A no-options Good enough "yes" no
  longer writes an internal marker into the decision or the export.
- **Removing a criterion says why the fit marks cleared.** The scores reset is no longer
  silent, and a status history recording no longer grows unbounded on reopen and save.

### Changed

- **Screen copy now reads as decision language.** The Good enough bar screen asks you to
  name the smallest bar the decision would be glad to clear; the New and Stakes screens
  stop using the word "sent" and stop name-dropping methods before they exist; the Look
  ahead first horizon reads "each way it could go" instead of assuming two sides; and the
  decision view shows the stakes in words, not the raw key.
- **Settings gains a "Why 'Settled'" note.** The name is explained, and the version string
  stays visible.

## [0.1.1] - 2026-10-10

### Fixed

- **New decision opens outside a secure context.** The decision id no longer depends on
  `crypto.randomUUID`, which is absent over plain HTTP (a LAN preview, for instance) and in
  older browsers; the app now falls back to `crypto.getRandomValues`, then to a time-based
  id, so the New decision button always opens the question screen.

### Removed

- The "Take the new job?" example chip on the empty Home screen. Home now simply invites
  the first decision, and the spec and mockup were updated to match.

## [0.1.0] - 2026-10-09

### Added

- **The adaptive coach.** Name the decision, add options, say how much it matters (a little,
  somewhat, a lot), and Settled routes you to a method sized to the stakes: Good enough for
  small calls, Weigh it up for real trade-offs, Look ahead for the big ones.
- **Three methods, one close.** Every path ends in Make it real: a one-sentence decision and
  a first step, so you leave decided. "A different way" switches method at any step without
  losing what you wrote.
- **Drafts are real rows.** Stop for now from any step and the decision stays on the home
  screen, in progress, ready to resume exactly where you left it.
- **A plain-YAML open format.** Export every decision to a standard `.yaml` file with a
  `settled` version key; import merges files back in by id, keeping what you already have.
  No accounts, no format lock-in.
- **Lifecycle care.** Every decision has a history; undo restores an erased card; erasing
  everything asks twice and offers an export first.
- **A pocket PWA.** Installs, runs offline on a warm Day theme or a calm Night theme, and
  works with no network at all once loaded.

[0.2.0]: https://github.com/riverma/settled/releases/tag/v0.2.0
[0.1.1]: https://github.com/riverma/settled/releases/tag/v0.1.1
[0.1.0]: https://github.com/riverma/settled/releases/tag/v0.1.0
