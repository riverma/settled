import { describe, it, expect } from 'vitest';
import { buildYaml, parseExport, yamlFileName } from '$lib/formats';
import type { Decision } from '$lib/core/types';

const base: Decision = {
  id: 'abc-123',
  question: 'Should I take the new job?',
  options: [],
  noOptions: true,
  stakes: 'a-lot',
  method: 'look-ahead',
  work: {
    ten_minutes: 'Relieved, a bit scared.',
    ten_months: 'Probably glad I moved.',
    ten_years: "Won't remember the fear.",
    regret_cause: 'The team turns out to be toxic.',
    regret_guard: 'Ask to meet the team first.'
  },
  sentence: "I'm taking the job.",
  first_step: 'Reply to the offer email.',
  when: 'Monday morning',
  status: 'decided',
  created: '2026-10-08T18:10:00Z',
  updated: '2026-10-08T18:30:00Z',
  statusHistory: []
};

describe('the open plain-YAML format', () => {
  it('emits a plain YAML document with a settled version key and no custom extension', () => {
    const yaml = buildYaml([base]);
    expect(yaml).toContain('settled: "1.0"');
    expect(yaml).toContain('decisions:');
    expect(yaml).toContain('question: "Should I take the new job?"');
    expect(yaml).toContain('regret_guard: "Ask to meet the team first."');
    expect(yamlFileName(base.question)).toMatch(/^settled-.*\.yaml$/);
  });

  it('round-trips a full decision without loss', () => {
    const yaml = buildYaml([base]);
    const back = parseExport(yaml);
    expect(back.decisions).toHaveLength(1);
    const d = back.decisions[0];
    expect(d.id).toBe(base.id);
    expect(d.question).toBe(base.question);
    expect(d.stakes).toBe('a-lot');
    expect(d.method).toBe('look-ahead');
    expect(d.work.ten_minutes).toBe('Relieved, a bit scared.');
    expect(d.work.regret_guard).toBe('Ask to meet the team first.');
    expect(d.sentence).toBe("I'm taking the job.");
    expect(d.status).toBe('decided');
  });

  it('serialises weigh-it-up scores as per-row arrays', () => {
    const d: Decision = {
      ...base,
      work: {
        criteria: ['Rent', 'Commute'],
        weights: { Rent: 3, Commute: 1 },
        scores: { '0:0': 2, '0:1': 1, '1:0': 1, '1:1': 0 }
      },
      sentence: 'Taking A.'
    };
    const yaml = buildYaml([d]);
    expect(yaml).toContain('criteria:');
    expect(yaml).toContain('- { name: "Rent", weight: 3 }');
    expect(yaml).toContain('0: [2,1]');
    expect(yaml).toContain('1: [1,0]');
    const back = parseExport(yaml);
    expect(back.decisions[0].work.scores?.['1:0']).toBe(1);
  });

  it('rejects files that are not Settled exports', () => {
    expect(() => parseExport('hello: world')).toThrow();
    expect(() => parseExport('# a comment only\n')).toThrow();
    expect(() => parseExport('settled: "1.0"\ndecisions: [1, 2]')).toThrow();
  });

  it('duplicates can be imported and merged by id', () => {
    const yaml = buildYaml([base]);
    const first = parseExport(yaml);
    const second = parseExport(buildYaml([{ ...base, id: 'another' }]));
    expect(first.decisions[0].id).toBe('abc-123');
    expect(second.decisions[0].id).toBe('another');
  });
});