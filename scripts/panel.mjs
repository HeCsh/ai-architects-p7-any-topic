// The panel.
//
// Asks every judge in config.json, then combines their scores into one
// verdict. Judges have different characters and different rubrics, so they
// often disagree. The verdict is how the panel settles it.

import { judgeIt } from './judge.mjs';

// ---------- Three ways to reach a verdict ----------
//
// Pick one with "verdict" in config.json. They give different answers for
// the same scores, and that is the point: try all three on a submission the
// judges disagree about and see which feels fairest.

// Add them up and share them out. Every judge counts the same.
function average(scores) {
  const total = scores.reduce((sum, s) => sum + s, 0);
  return { score: Math.round((total / scores.length) * 10) / 10, why: 'The average of all the scores.' };
}

// The lowest score wins. To do well, a submission has to convince every
// judge, not just most of them.
function strictest(scores) {
  return { score: Math.min(...scores), why: 'The lowest score. Every judge had to be convinced.' };
}

// Each judge votes high (7 to 10), middle (4 to 6) or low (1 to 3). The
// group with the most votes wins, and the verdict is the average of the
// judges in it. A judge who wildly disagrees with the rest is left out.
function band(score) {
  if (score >= 7) return 'high';
  if (score >= 4) return 'middle';
  return 'low';
}

function majority(scores) {
  const groups = { high: [], middle: [], low: [] };
  for (const s of scores) groups[band(s)].push(s);
  const biggest = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  const [name, members] = biggest[0];

  // If no group has more votes than every other (three judges, three
  // different groups), nobody has a majority. Take the middle score instead,
  // so the verdict sits between the two extremes.
  if (members.length === biggest[1][1].length) {
    const middle = [...scores].sort((a, b) => a - b)[Math.floor(scores.length / 2)];
    return { score: middle, why: 'No majority, so the middle score.' };
  }

  const { score } = average(members);
  return { score, why: `${members.length} of ${scores.length} judges scored it ${name}.` };
}

const METHODS = { average, strictest, majority };

export function verdict(method, scores) {
  const pick = METHODS[method];
  if (!pick) {
    throw new Error(`"verdict" in config.json is "${method}". It must be "average", "strictest" or "majority".`);
  }
  return { method, ...pick(scores) };
}

// ---------- Run the whole panel ----------

export async function runPanel(config, submission) {
  // Check the setting before asking anybody, so a typo in config.json is
  // spotted straight away rather than after waiting for three AI answers.
  verdict(config.verdict, [5]);

  // All judges think at the same time. Asking them one after another would
  // make the page three times slower.
  const results = await Promise.all(
    config.judges.map((judge) => judgeIt(config, judge, submission))
  );

  // One judge refusing is enough to stop the panel. If a judge spotted that
  // this is about a person, the others' scores must not appear either, or
  // the person would get rated anyway.
  const refusals = results.filter((r) => r.refused);
  if (refusals.length) {
    for (const r of results) {
      if (!r.refused) {
        r.refused = true;
        r.score = null;
        r.reason = 'Not scored, because another judge turned this one down.';
      }
    }
    return {
      results,
      verdict: { method: config.verdict, score: null, why: refusals[0].reason },
    };
  }

  return { results, verdict: verdict(config.verdict, results.map((r) => r.score)) };
}
