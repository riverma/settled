import { describe, it, expect } from 'vitest';
import { suggest, weighSums, otherWays, STEP_COUNT } from '$lib/core/engine';

describe('the adaptive engine', () => {
  it('routes by stakes and option count exactly as the spec table', () => {
    expect(suggest('a-little', 0)).toBe('good-enough');
    expect(suggest('a-little', 5)).toBe('good-enough');
    expect(suggest('somewhat', 2)).toBe('weigh-it-up');
    expect(suggest('somewhat', 8)).toBe('weigh-it-up');
    expect(suggest('somewhat', 1)).toBe('look-ahead');
    expect(suggest('somewhat', 0)).toBe('look-ahead');
    expect(suggest('a-lot', 0)).toBe('look-ahead');
    expect(suggest('a-lot', 3)).toBe('look-ahead');
  });

  it('never suggests a method when stakes are missing', () => {
    expect(suggest(undefined, 4)).toBe('make-it-real');
  });

  it('offers the other two methods from any method screen', () => {
    expect(otherWays('weigh-it-up').map((w) => w.method).sort()).toEqual([
      'good-enough',
      'look-ahead'
    ]);
    expect(otherWays('look-ahead').map((w) => w.method)).not.toContain('look-ahead');
  });

  it('knows the step counts used by the progress markers', () => {
    expect(STEP_COUNT['good-enough']).toBe(3);
    expect(STEP_COUNT['weigh-it-up']).toBe(4);
    expect(STEP_COUNT['look-ahead']).toBe(5);
  });
});

describe('weigh-it-up arithmetic', () => {
  it('sums weights times scores in row order', () => {
    const sums = weighSums(
      ['A', 'B'],
      ['Rent', 'Commute'],
      { Rent: 3, Commute: 1 },
      { '0:0': 2, '0:1': 1, '1:0': 1, '1:1': 2 }
    );
    expect(sums).toEqual([
      { name: 'A', sum: 7 },
      { name: 'B', sum: 5 }
    ]);
  });

  it('treats missing scores as zero and missing weights as middle', () => {
    const sums = weighSums(['A'], ['Rent'], {}, {});
    expect(sums[0].sum).toBe(0);
  });

  it('is a plain ordering: ties keep input order', () => {
    const sums = weighSums(['X', 'Y'], ['Rent'], { Rent: 2 }, { '0:0': 1, '1:0': 1 });
    expect(sums.map((s) => s.name)).toEqual(['X', 'Y']);
  });
});