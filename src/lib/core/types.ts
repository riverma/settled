// The decision record and its method work, exactly as the spec's format section describes.

export type Stakes = 'a-little' | 'somewhat' | 'a-lot';
export type Method = 'good-enough' | 'weigh-it-up' | 'look-ahead' | 'make-it-real';
export type Status = 'draft' | 'in-progress' | 'decided';

/** Everything a method captured. Keys follow the .settled.yaml file (spec §6). */
export interface Work {
  bar?: string;
  chosen?: string;
  ten_minutes?: string;
  ten_months?: string;
  ten_years?: string;
  regret_cause?: string;
  regret_guard?: string;
  criteria?: string[];
  weights?: Record<string, number>;
  scores?: Record<string, number>;
}

export interface StatusEvent {
  status: Status;
  at: string;
}

export interface Decision {
  id: string;
  question: string;
  options: string[];
  noOptions: boolean;
  stakes?: Stakes;
  method?: Method;
  work: Work;
  sentence?: string;
  first_step?: string;
  when?: string;
  status: Status;
  created: string;
  updated: string;
  statusHistory: StatusEvent[];
}

/**
 * A random id that does not assume a secure context. `crypto.randomUUID` is undefined over
 * plain HTTP (a LAN preview, for instance) and in older browsers, and a throwing New
 * decision is a dead button, so fall back to `getRandomValues`, then to time plus randomness.
 */
export function newId(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === 'function') return c.randomUUID();
  if (typeof c?.getRandomValues === 'function') {
    const b = c.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40; // version 4
    b[8] = (b[8] & 0x3f) | 0x80; // variant 10
    const hex = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function newDecision(question: string): Decision {
  const now = new Date().toISOString();
  return {
    id: newId(),
    question: question.trim(),
    options: [],
    noOptions: false,
    work: {},
    status: 'draft',
    created: now,
    updated: now,
    statusHistory: [{ status: 'draft', at: now }]
  };
}

export function methodName(m: Method | undefined): string {
  const names: Record<Method, string> = {
    'good-enough': 'Good enough',
    'weigh-it-up': 'Weigh it up',
    'look-ahead': 'Look ahead',
    'make-it-real': 'Make it real'
  };
  return m ? names[m] : '';
}

export function statusLabel(d: Decision | Pick<Decision, 'status' | 'method' | 'updated'>): string {
  if (d.status === 'decided') return 'Decided';
  if (d.status === 'in-progress' && 'method' in d && d.method) return `In progress · ${methodName(d.method)}`;
  return d.status === 'in-progress' ? 'In progress' : 'Draft';
}

export function shortDate(iso: string): string {
  const d = new Date(iso);
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getUTCDate()} ${m[d.getUTCMonth()]}`;
}