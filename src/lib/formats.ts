// The open file format: plain YAML, no custom extension (spec §6, resolved 2026-10-08).
// One document: a small header plus a list of decisions. Readable top to bottom by a
// human, re-importable without loss. `settled:` carries the version for migration.
import { parse as parseYaml } from 'yaml';
import type { Decision, Status, Work } from './core/types';

const FORMAT_VERSION = '1.0';

export interface ParsedExport {
  version: string;
  decisions: Decision[];
}

function y(q: unknown): string {
  return JSON.stringify(String(q ?? ''));
}

/** Serialise decisions to the open plain-YAML document (spec §6.1). */
export function buildYaml(decisions: Decision[]): string {
  const L: string[] = [];
  L.push('# A Settled export: your decisions, in plain YAML.');
  L.push('# Read it top to bottom, or re-import it at https://settled.riverma.com');
  L.push(`settled: ${y(FORMAT_VERSION)}`);
  L.push(`exported: ${y(new Date().toISOString())}`);
  L.push('decisions:');
  for (const d of decisions) {
    L.push(`  - id: ${y(d.id)}`);
    L.push(`    question: ${y(d.question)}`);
    L.push(`    options: ${d.options.length ? JSON.stringify(d.options) : '[]'}${d.noOptions ? '  # empty = just thinking' : ''}`);
    if (d.stakes) L.push(`    stakes: ${d.stakes}`);
    if (d.method) L.push(`    method: ${d.method}`);
    const w = d.work ?? {};
    const wk = Object.keys(w).filter(
      (k) => !['criteria', 'weights', 'scores', 'rowsSeeded'].includes(k)
    );
    if (wk.length || w.criteria) {
      L.push('    work:');
      if (w.criteria) {
        L.push('      criteria:');
        w.criteria.forEach((c) =>
          L.push(`        - { name: ${y(c)}, weight: ${w.weights?.[c] ?? 2} }`)
        );
      }
      if (w.scores && Object.keys(w.scores).length) {
        L.push('      scores:');
        const byRow: Record<string, number[]> = {};
        Object.keys(w.scores).forEach((k) => {
          const [ri, ci] = k.split(':').map(Number);
          (byRow[ri] ??= [])[ci] = w.scores![k];
        });
        Object.keys(byRow)
          .sort((a, b) => Number(a) - Number(b))
          .forEach((ri) => L.push(`        ${ri}: ${JSON.stringify(byRow[ri].map((x) => +x))}`));
      }
      const wmap: Record<string, string> = {
        bar: 'bar', chosen: 'chosen', ten_minutes: 'ten_minutes', ten_months: 'ten_months',
        ten_years: 'ten_years', regret_cause: 'regret_cause', regret_guard: 'regret_guard'
      };
      wk.forEach((k) =>
        L.push(`      ${wmap[k] ?? k}: ${y((w as Record<string, unknown>)[k])}`)
      );
    }
    L.push(`    sentence: ${y(d.sentence ?? '')}`);
    L.push(`    first_step: ${y(d.first_step ?? '')}`);
    L.push(`    when: ${y(d.when ?? '')}`);
    L.push(`    status: ${d.status}`);
    L.push(`    created: ${y(d.created)}`);
    L.push(`    updated: ${y(d.updated)}`);
  }
  return L.join('\n') + '\n';
}

const STAKES = ['a-little', 'somewhat', 'a-lot'] as const;
const METHODS = ['good-enough', 'weigh-it-up', 'look-ahead', 'make-it-real'] as const;
const STATUSES = ['draft', 'in-progress', 'decided'] as const;

function norm(u: Partial<Decision>): Decision | null {
  if (!u || typeof u.id !== 'string' || typeof u.question !== 'string') return null;
  const now = new Date().toISOString();
  const d: Decision = {
    id: u.id,
    question: u.question.trim(),
    options: Array.isArray(u.options) ? u.options.map(String).filter(Boolean) : [],
    noOptions: u.noOptions === true,
    stakes: (STAKES as readonly string[]).includes(u.stakes ?? '') ? (u.stakes as Decision['stakes']) : undefined,
    method: (METHODS as readonly string[]).includes(u.method ?? '') ? (u.method as Decision['method']) : undefined,
    work: (u.work ?? {}) as Work,
    sentence: typeof u.sentence === 'string' ? u.sentence : undefined,
    first_step: typeof u.first_step === 'string' ? u.first_step : undefined,
    when: typeof u.when === 'string' ? u.when : undefined,
    status: (STATUSES as readonly string[]).includes(u.status ?? '') ? (u.status as Status) : 'draft',
    created: typeof u.created === 'string' ? u.created : now,
    updated: typeof u.updated === 'string' ? u.updated : now,
    statusHistory: Array.isArray(u.statusHistory) ? u.statusHistory : []
  };
  // a bare question with empty options and no metadata is a draft, not a binary
  if (d.options.length === 0 && !d.noOptions && d.status !== 'draft') d.noOptions = true;
  // the export writes scores row-wise (0: [2,1]); flatten back to the store's ri:ci keys
  const raw = d.work.scores;
  if (raw && Object.keys(raw).length) {
    const flat: Record<string, number> = {};
    for (const [ri, row] of Object.entries(raw)) {
      if (!Array.isArray(row)) continue;
      flat[ri] = flat[ri] ?? 0;
      row.forEach((v, ci) => (flat[`${ri}:${ci}`] = Number(v) || 0));
      delete flat[ri];
    }
    d.work.scores = flat;
  }
  return d;
}

export function parseExport(text: string): ParsedExport {
  let doc: unknown;
  try {
    doc = parseYaml(text);
  } catch (e) {
    throw new Error(`This is not readable YAML. ${String(e)}`);
  }
  const root = doc as { settled?: unknown; decisions?: unknown };
  if (!root || typeof root !== 'object') throw new Error('An empty file has nothing to import.');
  const version = String(root.settled ?? '0');
  if (!Array.isArray(root.decisions)) throw new Error('There is no decisions list in this file.');
  const decisions: Decision[] = [];
  for (const item of root.decisions) {
    const d = norm(item as Partial<Decision>);
    if (d) decisions.push(d);
  }
  if (!decisions.length) throw new Error('Nothing in this file is a Settled decision.');
  return { version, decisions };
}

export function yamlFileName(question: string): string {
  const slug = question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return `settled-${slug || 'decision'}.yaml`;
}