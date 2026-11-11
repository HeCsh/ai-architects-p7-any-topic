// THE ONLY FILE THAT TALKS TO THE AI.
//
// This is the only file that changes if the AI provider or the hosting
// changes. Everything else in the project asks this file for an answer and
// never calls an AI itself.
//
// Why keep it all in one place? The AI needs a secret key, and anyone who
// sees the key can use it and run up the bill. A web page cannot keep a
// secret: every file the browser downloads can be read by whoever opens it.
// So this file only ever runs on the computer doing the hosting, never in
// the browser, and the key stays there.
//
// Today it uses Gemini, the same as Projects 3 and 4. To use something else,
// rewrite the inside of askAI below. Keep the shape the same: a prompt goes
// in, text comes out. Nothing else in the project will notice the change.

const MODEL = process.env.AI_MODEL || 'gemini-3.5-flash-lite';
const GEMINI_URL = process.env.GEMINI_URL || 'https://generativelanguage.googleapis.com/v1beta/models';

export async function askAI(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('The GEMINI_API_KEY secret is missing, so the judges cannot think. See the README.');
  }

  const res = await fetch(`${GEMINI_URL}/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
    // An AI that never answers would leave the page spinning for ever.
    // Thirty seconds is plenty for a short answer.
    signal: AbortSignal.timeout(30000),
  });
  // A free key only allows a few questions a minute, and every press of the
  // button asks each judge once. Too many presses close together get this
  // error. It is not broken, it just needs a short rest.
  if (res.status === 429) {
    console.error((await res.text()).slice(0, 1500)); // full detail for whoever runs the server
    throw new Error('The AI is getting too many questions right now. Wait a minute, then try again.');
  }
  if (!res.ok) {
    throw new Error(`The AI answered with error ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
  if (!text.trim()) throw new Error('The AI sent back an empty answer.');
  return text;
}
