// Simulation-of-record equivalent of the mockup's state, on real persistence.
// Svelte 5 runes; everything reactive that the screens read.
import type { Decision, Method, Stakes, Status } from './core/types';
import { suggest } from './core/engine';
import { newDecision } from './core/types';
import { db, deleteDecisionRow, loadDecisions, loadPref, putDecision, savePref, wipeAll } from './db';
import { buildYaml, parseExport } from './formats';

export type Screen =
  | 'home' | 'new' | 'stakes'
  | 'ge-bar' | 'ge-check' | 'ge-result'
  | 'wp-1' | 'wp-2' | 'wp-3' | 'wp-4'
  | 'la-1' | 'la-2' | 'la-3' | 'la-4' | 'la-5'
  | 'real' | 'view' | 'settings';

export type Sheet = null | 'ways' | 'info' | 'export' | 'confirm-delete' | 'erase-1' | 'erase-2' | 'about' | 'import' | 'restore';

export class AppStore {
  /** the launcher's #install contract: show the install bar on first paint */
  installRequested = $state(false);
  ready = $state(false);
  theme = $state<'day' | 'night'>('day');
  decisions = $state<Decision[]>([]);
  screen = $state<Screen>('home');
  draft = $state<Decision | null>(null);
  viewId = $state<string | null>(null);
  sheet = $state<Sheet>(null);
  sheetInfo = $state<{ title: string; body: string } | null>(null);
  toastMsg = $state<string | null>(null);
  /** Session undo: the last deleted decision, restorable from the toast. */
  undo = $state<Decision | null>(null);
  /** Weigh-it-up rows. Derived from the draft's options so they can never drift. */
  get weighRows(): string[] {
    const opts = this.draft?.options ?? [];
    if (opts.length >= 2) return [...opts];
    if (opts.length === 1) return [opts[0], 'Leave it as it is'];
    return ['Do it', 'Leave it as it is'];
  }
  geIndex = $state(0);
  /** Good enough result: whether the bar was cleared by the person (not persisted). */
  geCleared = $state(false);
  exportText = $state('');
  exportName = $state('settled.yaml');
  importText = $state('');
  importError = $state('');
  importPreview = $state<Decision[] | null>(null);

  private toastTimer: ReturnType<typeof setTimeout> | undefined;

  async init(demo = false): Promise<void> {
    const [stored, theme] = await Promise.all([loadDecisions(), loadPref('theme')]);
    this.decisions = stored;
    this.theme = theme === 'night' ? 'night' : 'day';
    this.applyTheme();
    if (demo && this.decisions.length === 0) this.seedDemo();
    this.ready = true;
  }

  applyTheme(): void {
    const html = document.documentElement;
    html.classList.remove('ahimsa-day', 'ahimsa-night');
    html.classList.add(this.theme === 'night' ? 'ahimsa-night' : 'ahimsa-day');
    html.dataset.theme = this.theme;
  }

  setTheme(t: 'day' | 'night'): void {
    this.theme = t;
    this.applyTheme();
    void savePref('theme', t);
  }

  nav(s: Screen): void {
    this.screen = s;
    this.sheet = null;
  }
  get draftWork() {
    return this.draft?.work ?? {};
  }

  // ── home / list ─────────────────────────────────────────────
  sorted(): Decision[] {
    return [...this.decisions].sort((a, b) => b.updated.localeCompare(a.updated));
  }

  openDecision(id: string): void {
    const d = this.decisions.find((x) => x.id === id);
    if (!d) return;
    if (d.status !== 'decided') {
      this.draft = clone(d);
      if (d.method) {
        const first = this.firstStep(d.method);
        // Reset per-pass session state so a resumed method never inherits a stale
        // index or a stale "cleared" flag from the previous decision.
        this.geIndex = 0;
        this.geCleared = false;
        this.nav(first === undefined ? 'stakes' : first);
      } else {
        this.nav('stakes');
      }
      return;
    }
    this.viewId = id;
    this.nav('view');
  }

  private firstStep(m: Method): Screen | undefined {
    const map: Record<Method, Screen> = {
      'good-enough': 'ge-bar',
      'weigh-it-up': 'wp-1',
      'look-ahead': 'la-1',
      'make-it-real': 'real'
    };
    return map[m];
  }

  // ── new decision flow ────────────────────────────────────────
  startNew(question = ''): void {
    this.draft = newDecision(question);
    this.nav('new');
  }

  questionInput(v: string): void {
    if (this.draft) this.draft.question = v;
  }
  addOption(): void {
    if (!this.draft) return;
    if (this.draft.options.length >= 8) return;
    this.draft.noOptions = false;
    this.draft.options.push('');
    this.draftWork;
  }
  setOption(i: number, v: string): void {
    if (this.draft) this.draft.options[i] = v;
  }
  removeOption(i: number): void {
    this.draft?.options.splice(i, 1);
  }
  toggleNoOptions(): void {
    if (!this.draft) return;
    this.draft.noOptions = !this.draft.noOptions;
    // Keep any options the person has already typed. `noOptions` means "I am just
    // thinking", and the engine treats an empty options list the same way; erasing
    // silently would throw away their words.
  }

  toStakes(): void {
    if (!this.draft?.question.trim()) {
      this.toast('A question first. It can be small.');
      return;
    }
    this.draft.status = 'draft';
    this.nav('stakes');
  }

  setStakes(s: Stakes): void {
    if (this.draft) {
      this.draft.stakes = s;
      this.draft.status = 'in-progress';
    }
  }

  startMethod(): void {
    if (!this.draft?.stakes) return;
    const m = suggest(this.draft.stakes, this.draft.options.length);
    this.draft.method = m;
    this.prepMethod(m);
    const first = this.firstStep(m);
    this.geIndex = 0;
    this.geCleared = false;
    if (first) this.nav(first);
  }

  prepMethod(m: Method): void {
    if (m === 'weigh-it-up') {
      const w = this.draftWork;
      w.criteria ??= [];
      if (w.criteria.length === 0) w.criteria = ['', ''];
      w.weights ??= {};
      w.scores ??= {};
    }
  }

  switchMethod(m: Method): void {
    if (!this.draft) return;
    this.draft.method = m;
    this.prepMethod(m);
    const first = this.firstStep(m);
    this.geIndex = 0;
    this.geCleared = false;
    if (first) this.nav(first);
    this.toast(`Switched to ${m === 'good-enough' ? 'Good enough' : m === 'weigh-it-up' ? 'Weigh it up' : 'Look ahead'}. What you wrote stays when the method can use it.`);
  }

  // ── good enough ─────────────────────────────────────────────
  geBar(v: string): void {
    if (this.draft) this.draft.work.bar = v;
  }
  geToCheck(): void {
    if (!this.draftWork.bar?.trim()) {
      this.toast('The bar first. One line is enough.');
      return;
    }
    this.geIndex = 0;
    this.geCleared = false;
    this.nav('ge-check');
  }
  geCurrentOption(): string | null {
    const opts = this.draft?.options ?? [];
    if (opts.length === 0) return null;
    return opts[this.geIndex] ?? null;
  }
  geAnswer(answer: 'yes' | 'no' | 'notsure'): void {
    const opts = this.draft?.options ?? [];
    if (opts.length === 0) {
      if (answer === 'yes') {
        // No options: nothing to name. Track the outcome in session state only so
        // nothing internal leaks into the persisted decision or the export.
        this.geCleared = true;
        this.nav('ge-result');
      } else if (answer === 'notsure') {
        this.stopNow();
        this.toast('Kept open. A decision is not a deadline.');
      } else {
        this.geCleared = false;
        this.nav('ge-result');
      }
      return;
    }
    const cur = opts[this.geIndex];
    if (answer === 'yes') {
      this.draft!.work.chosen = cur;
      this.geCleared = true;
      this.nav('ge-result');
    } else if (answer === 'notsure') {
      this.geIndex += 1;
      if (this.geIndex >= opts.length) this.nav('ge-result');
    } else {
      this.geIndex += 1;
      if (this.geIndex >= opts.length) this.nav('ge-result');
    }
  }

  // ── weigh it up ─────────────────────────────────────────────
  critInput(i: number, v: string): void {
    const c = this.draftWork.criteria ?? (this.draftWork.criteria = []);
    c[i] = v;
  }
  addCrit(): void {
    const c = this.draftWork.criteria ?? (this.draftWork.criteria = []);
    if (c.length < 5) c.push('');
  }
  removeCrit(i: number): void {
    const hadScores = Object.keys(this.draftWork.scores ?? {}).length > 0;
    this.draftWork.criteria?.splice(i, 1);
    // Removing a criterion shifts every column to the left, so the stored scores no
    // longer line up. Clear them rather than silently mis-scoring, but say so.
    this.draftWork.scores = {};
    if (hadScores) {
      this.toast('Criterion removed. The fit marks were cleared so they are not misaligned.');
    }
  }
  wpToWeights(): void {
    const c = (this.draftWork.criteria ?? []).map((x) => x.trim()).filter(Boolean);
    if (c.length < 2) {
      this.toast('Two things that matter at least. That is the honest minimum.');
      return;
    }
    this.draftWork.criteria = c;
    this.nav('wp-2');
  }
  setWeight(c: string, w: number): void {
    (this.draftWork.weights ??= {})[c] = w;
  }
  wpToScores(): void {
    const missing = this.draftWork.criteria?.filter((c) => !this.draftWork.weights?.[c]);
    if (missing?.length) {
      this.toast('Every thing that matters needs a weight. Even a little is one.');
      return;
    }
    this.nav('wp-3');
  }
  scoreCell(key: string): void {
    const scores = (this.draftWork.scores ??= {});
    scores[key] = ((scores[key] ?? 0) + 1) % 3;
  }
  wpToRank(): void {
    this.nav('wp-4');
  }

  // ── look ahead ──────────────────────────────────────────────
  laInput(k: 'ten_minutes' | 'ten_months' | 'ten_years' | 'regret_cause' | 'regret_guard', v: string): void {
    if (!this.draft) return;
    if (v.trim()) this.draft.work[k] = v.trim();
  }
  laNext(): void {
    const m: Screen[] = ['la-1', 'la-2', 'la-3', 'la-4', 'la-5'];
    const i = m.indexOf(this.screen);
    if (i >= 0 && i < 4) this.nav(m[i + 1]);
    else this.nav('real');
  }

  // ── make it real ────────────────────────────────────────────
  realInput(k: 'sentence' | 'first_step' | 'when', v: string): void {
    if (!this.draft) return;
    (this.draft as unknown as Record<string, string>)[k] = v;
  }
  async saveDecision(): Promise<void> {
    const d = this.draft;
    if (!d) return;
    if (!d.sentence?.trim()) {
      this.toast('The sentence first. One honest line.');
      return;
    }
    d.status = 'decided';
    d.updated = new Date().toISOString();
    this.recordStatus(d, 'decided', d.updated);
    await putDecision(d);
    const i = this.decisions.findIndex((x) => x.id === d.id);
    if (i >= 0) this.decisions[i] = d;
    else this.decisions.push(d);
    this.draft = null;
    this.nav('home');
    this.toast('Saved. The decision is yours to reopen any time.');
  }

  /** the launcher's #install contract, reachable from Settings too */
  askInstall() {
    this.installRequested = true;
  }

  async stopNow(): Promise<void> {
    const d = this.draft;
    if (d) {
      if (this.isEmptyDraft(d)) {
        // Nothing was written yet: leaving is abandoning, not saving. Do not keep a
        // blank row that has no title and nothing to resume.
        this.draft = null;
        this.nav('home');
        return;
      }
      d.status = d?.stakes ? 'in-progress' : 'draft';
      d.updated = new Date().toISOString();
      this.recordStatus(d, d.status, d.updated);
      await putDecision(d);
      const i = this.decisions.findIndex((x) => x.id === d.id);
      if (i >= 0) this.decisions[i] = d;
      else this.decisions.push(d);
    }
    this.draft = null;
    this.nav('home');
    this.toast('Kept as a draft. Nothing you wrote is lost.');
  }

  /** Append a status event without repeating the last one, so history stays bounded. */
  private recordStatus(d: Decision, status: Status, at: string): void {
    const last = d.statusHistory[d.statusHistory.length - 1];
    if (!last || last.status !== status) d.statusHistory.push({ status, at });
  }

  /** True when the draft holds nothing a person wrote: no question, options, or work. */
  private isEmptyDraft(d: Decision): boolean {
    const hasQuestion = !!d.question.trim();
    const hasOptions = d.options.some((o) => o.trim() !== '');
    const hasWork = Object.values(d.work ?? {}).some(
      (v) => typeof v === 'string' ? v.trim() !== '' : Array.isArray(v) ? v.some((x) => typeof x === 'string' && x.trim() !== '') : v != null
    );
    return !hasQuestion && !hasOptions && !hasWork;
  }

  // ── view / export / delete ──────────────────────────────────
  viewed(): Decision | null {
    return this.decisions.find((x) => x.id === this.viewId) ?? null;
  }

  openExport(): void {
    const d = this.viewed();
    if (!d) return;
    this.exportName = `settled-${slug(d.question)}.yaml`;
    this.exportText = buildYaml([d]);
    this.sheet = 'export';
  }

  openImport(): void {
    this.importText = '';
    this.importError = '';
    this.importPreview = null;
    this.sheet = 'import';
  }

  parseImport(text: string): void {
    this.importError = '';
    this.importPreview = null;
    try {
      const parsed = parseExport(text);
      this.importPreview = parsed.decisions;
    } catch (e) {
      this.importError = e instanceof Error ? e.message : 'That file could not be read.';
    }
  }

  async commitImport(): Promise<void> {
    if (!this.importPreview) return;
    let added = 0;
    for (const d of this.importPreview) {
      const existing = this.decisions.find((x) => x.id === d.id);
      if (existing) continue; // merge-by-id keeps the device copy; nothing is overwritten
      this.decisions.push(d);
      await putDecision(d);
      added += 1;
    }
    this.sheet = null;
    this.toast(added === 0 ? 'Nothing new to add; this file was already here.' : `Added ${added}. They are yours, on this device.`);
  }

  async exportAll(): Promise<void> {
    this.exportText = buildYaml(this.decisions);
    this.exportName = 'settled-backup.yaml';
    this.sheet = 'export';
  }

  requestDelete(): void {
    this.sheet = 'confirm-delete';
  }

  async doDelete(): Promise<void> {
    const d = this.viewed();
    if (!d) return;
    this.undo = clone(d);
    this.decisions = this.decisions.filter((x) => x.id !== d.id);
    await deleteDecisionRow(d.id);
    this.sheet = null;
    this.viewId = null;
    this.nav('home');
    this.toastUndo('Deleted. Nothing else changed.', d);
  }

  async undoDelete(): Promise<void> {
    if (!this.undo) return;
    this.decisions.push(this.undo);
    await putDecision(this.undo);
    this.undo = null;
  }

  // ── erase all ───────────────────────────────────────────────
  async doErase(): Promise<void> {
    await wipeAll();
    this.decisions = [];
    this.draft = null;
    this.sheet = null;
    this.nav('home');
    this.toast('Everything is gone, and that was the point.');
  }

  // ── toast ───────────────────────────────────────────────────
  toast(msg: string): void {
    clearTimeout(this.toastTimer);
    this.toastMsg = msg;
    this.toastTimer = setTimeout(() => (this.toastMsg = null), 2600);
  }

  toastUndo(_msg: string, d: Decision): void {
    this.toast(`Deleted. Nothing else changed.  ·  Undo?`);
    this.undo = d;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.undo = null), 6000);
  }

  // ── info / ways sheets ──────────────────────────────────────
  openInfo(title: string, body: string): void {
    this.sheetInfo = { title, body };
    this.sheet = 'info';
  }

  // ── demo seed (the ?demo path used by tests and screenshots) ─
  private seedDemo(): void {
    const now = new Date('2026-10-08T18:30:00Z').toISOString();
    const d1: Decision = {
      id: 'demo-1', question: 'Should I take the new job?', options: [], noOptions: true,
      stakes: 'a-lot', method: 'look-ahead',
      work: { ten_minutes: 'Relieved, a bit scared.', ten_months: 'Probably glad I moved.', ten_years: "Won't remember the fear.", regret_cause: 'The team turns out to be toxic.', regret_guard: 'Ask to meet the team first.' },
      sentence: "I'm taking the job.", first_step: 'Reply to the offer email.', when: 'Monday morning',
      status: 'decided', created: now, updated: now, statusHistory: []
    };
    const d2: Decision = {
      id: 'demo-2', question: 'Where to get lunch?', options: ['The noodle place', 'The sandwich bar', 'The salad place'], noOptions: false,
      stakes: 'a-little', method: 'good-enough',
      work: { bar: 'Close, cheap, open now.', chosen: 'The noodle place' },
      sentence: 'Getting the noodle place.', first_step: '', when: '',
      status: 'decided', created: now, updated: now, statusHistory: []
    };
    const d3: Decision = {
      id: 'demo-3', question: 'Should I move to Lisbon?', options: [], noOptions: true,
      status: 'draft', work: {}, created: now, updated: now, statusHistory: []
    };
    this.decisions = [d1, d2, d3];
    void Promise.all(this.decisions.map((d) => putDecision(d)));
  }
}

function clone(d: Decision): Decision {
  return JSON.parse(JSON.stringify(d)) as Decision;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'decision';
}

export const app = new AppStore();