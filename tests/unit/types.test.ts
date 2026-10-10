import { describe, it, expect } from 'vitest';
import { newId, newDecision } from '$lib/core/types';

describe('newId', () => {
  it('returns a UUID when crypto.randomUUID exists', () => {
    // jsdom/node provide crypto.randomUUID in vitest's environment
    const id = newId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('never throws and is unique across calls', () => {
    const a = newId();
    const b = newId();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
    expect(a).not.toBe(b);
  });

  it('falls back when randomUUID is missing (getRandomValues still available)', () => {
    const c = globalThis.crypto;
    const hasUUID = typeof c?.randomUUID === 'function';
    if (!hasUUID) {
      // already a randomUUID-less environment; the getRandomValues branch applies
      const id = newId();
      expect(id).toMatch(/^[0-9a-f]{8}-/);
      return;
    }
    // Otherwise, exercise the getRandomValues UUID-v4 branch directly by masking it.
    const original = c.randomUUID;
    (c as unknown as { randomUUID?: unknown }).randomUUID = undefined;
    try {
      const id = newId();
      // getRandomValues branch produces a UUID v4 string
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    } finally {
      (c as unknown as { randomUUID?: unknown }).randomUUID = original;
    }
  });
});

describe('newDecision', () => {
  it('builds a decision with a real id, trimmed question, and draft status', () => {
    const d = newDecision('  Should I go?  ');
    expect(d.id).toBeTruthy();
    expect(d.question).toBe('Should I go?');
    expect(d.status).toBe('draft');
    expect(d.statusHistory).toHaveLength(1);
    expect(d.work).toEqual({});
    expect(d.options).toEqual([]);
  });
});