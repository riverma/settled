// Every word the app says at runtime, in one place (spec §9). No em dashes here.
import type { Stakes } from './core/types';

export const STAKES: { key: Stakes; word: string; gloss: string }[] = [
  { key: 'a-little', word: 'A little', gloss: 'You would be fine either way.' },
  { key: 'somewhat', word: 'Somewhat', gloss: 'It matters, but a month from now you will have moved on.' },
  { key: 'a-lot', word: 'A lot', gloss: 'This one could change your life.' }
];

export const T = {
  // install bar: the launcher's #install contract (see install bar component)
  install: {
    prompt: 'Install Settled to keep it one tap away.',
    button: 'Install',
    ios: 'On iPhone: open Share, then Add to Home Screen.',
    generic: "Install Settled from your browser's menu to keep it one tap away.",
    installed: 'Settled is installed.'
  },
  homeLead: "What's on your mind?",
  newDecision: 'New decision',
  newTitle: 'What do you need to decide?',
  newSub: 'Sent as you write it. Nothing here is rewritten.',
  newQuestionPlaceholder: 'Should I take the new job?',
  optionsLabel: 'Options, if you have them',
  addOption: 'Add an option',
  noOptionsYet: 'No options yet',
  noOptionsNote: 'Understood. The comparison will be against leaving it as it is.',
  stakesTitle: 'How much does this one matter?',
  stakesSub: 'One question. It decides which method is lightest and still honest.',
  stakes: STAKES,
  continue: 'Continue',
  back: '← Back',
  stop: '← Stop',
  home: '← Home',
  stopForNow: 'Stop for now',
  differentWay: 'A different way',
  whyWorks: 'Why this works',
  dontAsk: 'Not now',
  keepIt: 'Keep it',
  deleteIt: 'Delete it',
  saveDecision: 'Save the decision',
  export: 'Export',
  download: 'Download',
  copy: 'Copy',
  done: 'Done'
};

export const METHOD_INFO: Record<string, { title: string; body: string }> = {
  'good-enough': {
    title: 'Satisficing',
    body: 'This is satisficing, the idea Herbert Simon won a Nobel Prize for: a good enough result, chosen quickly, beats the perfect one chosen too late, and people who settle report less regret.'
  },
  'weigh-it-up': {
    title: 'The decision matrix',
    body: 'This is a decision matrix, the method engineers use to compare real choices. Writing the trade-offs down gets them out of your head, and giving each a weight makes the comparison honest instead of swirling.'
  },
  'look-ahead': {
    title: '10/10/10 and the pre-mortem',
    body: 'This is the 10/10/10 rule (Suzy Welch) plus a pre-mortem (Gary Klein). Stepping out in time quiets emotional noise, and imagining the failure first surfaces about a third more of the risks, so fear becomes a guardable plan.'
  },
  'make-it-real': {
    title: 'The implementation intention',
    body: 'This is an implementation intention, one of the most tested results in behavior science: a decision with a first step and a time is far more likely to actually happen.'
  }
};