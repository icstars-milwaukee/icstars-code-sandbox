/* STEP 2 · WE DO — one more layer, built together.

   ONE new idea. Not two. Here it is: pick at random, and hide it.

   Every CHECKPOINT comment is a place you stop talking and look at
   the room. If you cannot describe the screen in one sentence, it is
   not a checkpoint yet. */

const SOURCE = ["first thing", "second thing", "third thing", "fourth thing"];

const goBtn    = document.getElementById("goBtn");
const statusEl = document.getElementById("status");
const outEl    = document.getElementById("out");
const countEl  = document.getElementById("count");

// State lives in ONE place, named, at the top. When the page is
// wrong, the first question is always "what is in here?"
let current  = null;
let revealed = false;

// Math.random() gives 0 to 0.999…; times the length, floored, is a
// valid slot every time. Say this one out loud.
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function newRound() {
  current = pickRandom(SOURCE);

  outEl.textContent    = "? ? ?";          // hidden, on purpose
  statusEl.className   = "ics-note";
  statusEl.textContent = "Something is picked. You can't see which one yet.";
  countEl.textContent  = "picked from " + SOURCE.length;

  // CHECKPOINT: the box shows ? ? ? and clicking changes nothing you
  // can see. Thumbs up. Then ask: how would you PROVE it picked
  // something? (Answer: reveal it. That is the rest of this step.)
}

function reveal() {
  outEl.textContent    = current;
  statusEl.className   = "ics-note success";
  statusEl.textContent = "It was: " + current;

  // CHECKPOINT: Reveal shows a different answer most times you click.
  // Thumbs up. That randomness is what makes step 3 a game.
}

goBtn.addEventListener("click", function () {
  revealed = !revealed;
  if (revealed) { reveal(); } else { newRound(); }
  goBtn.textContent = revealed ? "New one" : "Reveal";
});

newRound();
goBtn.textContent = "Reveal";


/* BREAK IT ON PURPOSE — write three for YOUR lesson. */
