/* ============================================================
   STEP 2 · WE DO    — one more layer, built together

   Same four blocks as step 1. One new idea, no more.
   The new idea here: pick at random, and hide the answer.

   Every CHECKPOINT comment is a place you stop talking and look
   at the room. If you can't describe the screen in one sentence,
   it isn't a checkpoint yet.
   ============================================================ */

const SOURCE = ["first thing", "second thing", "third thing", "fourth thing"];

const goBtn    = document.getElementById("goBtn");
const statusEl = document.getElementById("status");
const outEl    = document.getElementById("out");
const countEl  = document.getElementById("count");

// State lives in ONE place, named, at the top. When something is
// wrong on the page, the first question is "what is in here?"
let current = null;

// ---- the one new idea --------------------------------------
// YOU TYPE: Math.random() gives 0 to 0.999…, times the length,
// floored, is a valid index every time. Worth saying out loud —
// students will reach for this move for the rest of their lives.
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function newRound() {
  current = pickRandom(SOURCE);

  outEl.textContent    = "? ? ?";          // hidden, on purpose
  statusEl.className   = "ics-note";
  statusEl.textContent = "Something is picked. You can't see which one yet.";
  countEl.textContent  = "picked from " + SOURCE.length;

  // CHECKPOINT: the box shows ? ? ? and a new click changes
  // nothing visible. Thumbs up. Then ask: how would you prove
  // it really picked something? (Answer: reveal it.)
}

function reveal() {
  outEl.textContent    = current;
  statusEl.className   = "ics-note success";
  statusEl.textContent = "It was: " + current;

  // CHECKPOINT: reveal shows a different answer most times you
  // click. Thumbs up. That randomness is what makes step 3 a
  // game instead of a demo.
}

// Two jobs on one button, so the room sees the state machine:
// hidden -> revealed -> hidden. Real workshops usually earn a
// second button here; one is enough to make the point.
let revealed = false;
goBtn.addEventListener("click", function () {
  revealed = !revealed;
  if (revealed) { reveal(); } else { newRound(); }
  goBtn.textContent = revealed ? "New one" : "Reveal";
});

newRound();
goBtn.textContent = "Reveal";
