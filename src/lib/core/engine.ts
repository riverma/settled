// The adaptive engine: a small, deterministic function of stakes and option count
// (spec §5.1, Appendix A). It is a suggestion, never a sentence.

import type { Method, Stakes } from './types';

export function suggest(stakes: Stakes | undefined, optionCount: number): Method {
  if (!stakes) return 'make-it-real';
  if (stakes === 'a-little') return 'good-enough';
  if (stakes === 'somewhat') return optionCount >= 2 ? 'weigh-it-up' : 'look-ahead';
  return 'look-ahead'; // a-lot
}

export const STEP_COUNT: Record<Method, number> = {
  'good-enough': 3, // bar, check, result
  'weigh-it-up': 4, // criteria, weights, scores, ordering
  'look-ahead': 5, // 10m, 10mo, 10y, regret, read
  'make-it-real': 1
};

export interface WayDescription {
  method: Method;
  title: string;
  why: string;
}

/** "A different way" sheet (spec §5.5): the other two methods, with honest reasons. */
export function otherWays(current: Method | undefined): WayDescription[] {
  const map: Record<string, WayDescription[]> = {
    'good-enough': [
      { method: 'weigh-it-up', title: 'Weigh it up', why: 'For a slower pass, when you want the trade-offs on paper.' },
      { method: 'look-ahead', title: 'Look ahead', why: 'For the long view, when feelings are loud.' }
    ],
    'weigh-it-up': [
      { method: 'good-enough', title: 'Good enough', why: 'For the quick version. A bar, not a spreadsheet.' },
      { method: 'look-ahead', title: 'Look ahead', why: 'For the long view, when feelings are loud.' }
    ],
    'look-ahead': [
      { method: 'good-enough', title: 'Good enough', why: 'For the quick version. A bar, not a spreadsheet.' },
      { method: 'weigh-it-up', title: 'Weigh it up', why: 'For a slower pass, when you want the trade-offs on paper.' }
    ],
    'make-it-real': []
  };
  return map[current ?? 'make-it-real'] ?? [];
}

/** Weigh-it-up arithmetic (unit-tested). Scores are 0..2; weights 1..3. */
export function weighSums(
  rows: string[],
  criteria: string[],
  weights: Record<string, number>,
  scores: Record<string, number>
): { name: string; sum: number }[] {
  return rows.map((name, ri) => {
    let total = 0;
    criteria.forEach((c, ci) => {
      const w = weights[c] ?? 2;
      total += w * (scores[`${ri}:${ci}`] ?? 0);
    });
    return { name, sum: total };
  });
}