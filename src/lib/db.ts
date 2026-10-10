// Dexie schema. Everything lives on the device; versioned migrations carry data forward.
import Dexie, { type Table } from 'dexie';
import type { Decision, Stakes, Method, Work } from './core/types';

export interface PrefsRow {
  key: string;
  value: string | number | boolean;
}

export class SettledDB extends Dexie {
  decisions!: Table<StoredDecision, string>;
  prefs!: Table<PrefsRow, string>;

  constructor() {
    super('settled');
    this.version(1).stores({
      decisions: 'id, updated, status',
      prefs: 'key'
    });
  }
}

/** The stored shape is the Decision plus the parts Svelte needs to render rows. */
export interface StoredDecision extends Decision {
  _search?: string;
}

export const db = new SettledDB();

export async function loadDecisions(): Promise<Decision[]> {
  return db.decisions.orderBy('updated').reverse().toArray();
}

export async function loadPref(key: string): Promise<string | number | boolean | undefined> {
  const row = await db.prefs.get(key);
  return row?.value;
}

export async function savePref(key: string, value: string | number | boolean): Promise<void> {
  await db.prefs.put({ key, value });
}

export async function putDecision(d: Decision): Promise<void> {
  // Svelte 5 wraps stateful objects in proxies; IndexedDB structured-clones,
  // and a proxy throws DataCloneError. Serialise to a plain object first.
  await db.decisions.put(JSON.parse(JSON.stringify(d)));
}

export async function deleteDecisionRow(id: string): Promise<void> {
  await db.decisions.delete(id);
}

export async function wipeAll(): Promise<void> {
  await db.decisions.clear();
  await db.prefs.clear();
}

// The module-level type re-export keeps the store's imports tidy.
export type { Stakes, Method, Work };