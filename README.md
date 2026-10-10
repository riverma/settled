# Settled

A pocket decision coach. Tell it what you need to decide and how much it matters; it sizes a
proven method to the stakes and walks you through to a sentence you can act on. Everything
stays on your device, no accounts, no servers.

*A little nudge toward "decided", at exactly the size the decision deserves.*

Live: <https://settled.riverma.com>

## Try it

```
npm install
npm run dev              # open the printed URL
npm run dev -- --open    # …and open it for you
```

Add `?demo` to the URL to seed a few sample decisions on a fresh install.

## How it decides

You name the decision, add options if you have them, and say how much it matters today.
The coach then routes you to one of three methods, and every path closes with **Make it real**:
a one-sentence decision plus a first step, so you leave with something you can actually do.

| Stakes | Options | Method |
|---|---|---|
| A little | any | **Good enough**: set a bar the first option that clears it wins |
| Somewhat | two or more | **Weigh it up**: three criteria, weighted, scored, summed |
| Somewhat | zero or one | **Look ahead**: 10 minutes, 10 months, 10 years, and a regret guard |
| A lot | any | **Look ahead** |

You can switch method at any point from the "A different way" link, and stop any time and
come back, because a draft is a real row like anything else.

## Habits

Things this project does the same way every time.

**Everything happens on the device.** No network calls, no analytics, no accounts.
Decisions live in IndexedDB; export hands you a plain YAML file you can keep, move, or read
in any editor. If a change would introduce a fetch, it does not belong here.
`npm run check-offline` fails the build on any network reference in `dist/`.

**The adaptive engine is a pure function.** `suggest()` in `src/lib/core/engine.ts` turns a
stakes level and an option count into exactly one method, and the routing table above is a
unit test. Nobody hand-codes a route in a screen; screens ask the engine.

**Svelte 5 state must be serialised before it touches IndexedDB.** `$state` wraps objects
in proxies, and IndexedDB structured-clones its values, so handing a proxy to `db.put`
throws `DataCloneError` silently. The store and the DB layer pass decisions through JSON
before any `put`. Same rule for `structuredClone`: use the JSON clone in the store, never
clone a proxied object.

**The open format is plain YAML and stays plain.** Exports are standard `.yaml` files with
a `settled: "1.0"` key at the top. Weigh-it-up scores are stored row-wise (row index then
score array) for readability, and flattened back to the store's `row:col` keys on import.
The format belongs to everyone: the format description and templates in `spec/` are CC0.

**The mockup is the design authority.** `mockup/Settled.html` and `spec/SPECIFICATION.md`
were signed off before the production build started, and the app was verified against the
mockup screen by screen in the browser. Screen copy is mirrored from them verbatim and
lives inline in each Svelte component, next to the markup it belongs to.
`src/lib/strings.ts` holds only what code produces at runtime: toasts, confirm bodies,
history notes.

**The design system is semantic.** The component layer is the real Ahimsa distribution, and
components use Ahimsa's semantic tokens only, never raw palette steps. The one sanctioned
deviation is the warm Day canvas (`#fbe5cd` and friends, scoped to `html.ahimsa-day`), which
is the settled look of the family apps; Night is the system theme untouched. Info waiting
for someone's answer, scores, and urgency do not ship on purpose: the barrier the system
draws around judgement is part of the method.

**Copy has no em dashes.** In app copy, use a comma, a colon, or a full stop instead.
(The specification document is prose and may use them.)

**Asset filenames are stable, and must stay that way.** GitHub Pages serves `index.html`
with `max-age=600` and offers no way to change it, so for ten minutes after a deploy a
browser can still be running the previous page. Content-hashed filenames plus a deploy that
deletes the old ones means that page asks for a file which is gone, gets a 404, and shows
nothing: it happened to Giraffy in 2026-09. Cache busting is the service worker's job here,
and its cache name is a hash of file *contents*, so stable names cost nothing. `deploy.sh`
also carries forward any file the previous deploy had and the new one does not.

**Nothing is pushed without a review.** `scripts/audit.sh` runs a security pass, and
`scripts/deploy.sh` is a dry run unless you pass `--push`.

## Layout

| Path | What it is |
|---|---|
| `src/lib/core/` | Pure logic: the adaptive engine, the decision shape. No UI, unit-tested. |
| `src/lib/screens/` | One component per screen, mirroring the mockup markup. |
| `src/lib/ui/` | The eight bottom sheets, and the toast. |
| `src/lib/` | `store.svelte.ts` (all state and actions), `db.ts` (Dexie), `formats.ts` (the plain-YAML format). |
| `src/lib/strings.ts` | Runtime-only copy: toasts, confirm bodies, history notes. |
| `public/_ahimsa/` | The real Ahimsa distribution (styles + self-hosted fonts), vendor-pinned. |
| `src/sw.js` | The service worker template; `scripts/build-sw.mjs` injects the asset list. |
| `spec/` | `SPECIFICATION.md`, the signed-off design authority. Format description and templates CC0. |
| `mockup/` | The signed-off interactive mockup the app was built from. |

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload. |
| `npm run build` | Production build, then injects the service worker asset list. |
| `npm test` | Unit tests (Vitest) over the engine and the YAML format. |
| `npm run test:e2e` | Playwright: the happy path, drafts, routing, and a plain-YAML export. |
| `npm run check` | Type and template checking (svelte-check). |
| `npm run check-licenses` | Fails on any dependency outside the free-licence allow-list. |
| `npm run check-offline` | Fails on any network reference in the built site. |
| `npm run audit` | Security pass over the repo. Run before pushing. |
| `npm run deploy` | Dry run of the deploy. Add `-- --push` to publish. |

## The decision format

A decision is one `.yaml` file: readable top to bottom, hand-editable, and deliberately the
same plain YAML as any other. The format, described in the specification's data-model
section, is CC0, so anything can read or write decisions without asking anyone. Weigh-it-up
criteria are listed with their weights, scores row-wise, and the `settled` version key says
which generation of the format a file speaks.

## Privacy

Settled collects nothing, sends nothing, and has no server to send it to.
See [PRIVACY.md](PRIVACY.md).

## Licence

The app is [AGPL-3.0-or-later](LICENSE). The decision format, its description, and the
templates in `spec/` are [CC0-1.0](spec/LICENSE), so the format belongs to everyone.
