# The Settled decision format

A decision is one plain YAML file. Readable top to bottom, hand-editable in any editor,
and exactly the same YAML as anything else. This description, the templates it refers to,
and the data model in `SPECIFICATION.md` §6 are public domain (CC0): any tool may read,
write, or study a decision file without asking anyone, and Settled itself has no right to
lock a decision in.

Everything in the file is data someone wrote or the app computed from it. Nothing is
encoded, hashed, or compressed.

## Shape

```yaml
settled: "1.0"
decisions:
  - id: f3fa9c8e-01
    question: "Should I take the new job?"
    status: decided
    stakes: a-lot
    method: look-ahead
    options: ["Stay", "Take it"]
    work:
      ten_minutes: "Relieved, a bit scared."
      ten_months: "Probably glad I moved."
      ten_years: "Won't remember the fear."
      regret_cause: "The team turns out to be toxic."
      regret_guard: "Ask to meet the team first."
    sentence: "I'm taking the job."
    first_step: "Reply to the offer email."
    when: "Monday morning"
    created: "2026-10-08T18:10:00Z"
    updated: "2026-10-09T09:22:00Z"
```

## Rules

- The file starts with `settled: "1.0"`, the version of the format it speaks.
- `decisions` is a list. A single-decision export may hold one; a backup holds them all.
- `id` is the decision's stable identity. Importing a file with an id you already have
  keeps what you already have: export files are additive, never overwriting.
- `status` is one of `in-progress`, `decided`, `shelved`.
- `stakes` is one of `a-little`, `somewhat`, `a-lot`; `method` is one of `good-enough`,
  `weigh-it-up`, `look-ahead`, `make-it-real`.
- `work` holds whatever the method produced:
  - `good-enough`: `bar` (the sentence that set the bar), `checked` (ids), `picker` (id).
  - `weigh-it-up`: `criteria` (names), `weights` and `scores` row-wise
    (`0: [2, 1]` means option 0 scored 2 on criterion 0 and 1 on criterion 1).
  - `look-ahead`: `ten_minutes`, `ten_months`, `ten_years`, `regret_cause`, `regret_guard`.
- Every export also carries each decision's `work` ledger keys.

Importing is forgiving: unknown keys are carried along untouched, and missing keys are
simply absent.

## Licence

CC0-1.0 (see `LICENSE` in this directory). The app itself is AGPL: the format is open so
your decisions are yours; the app is free so a fork stays free.
