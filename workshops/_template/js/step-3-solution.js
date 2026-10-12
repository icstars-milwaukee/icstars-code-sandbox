/* ============================================================
   STEP 3 · ANSWER KEY

   The same file with the three TODOs filled in. Two jobs:
     1. the student compares against it after trying
     2. it is the TEST. If this file does not run, the workshop
        is not finished. Open it and play a round before you
        ever teach from this folder.
   ============================================================ */

const SOURCE = ["first thing", "second thing", "third thing", "fourth thing"];

const goBtn     = document.getElementById("goBtn");
const statusEl  = document.getElementById("status");
const outEl     = document.getElementById("out");
const choicesEl = document.getElementById("choices");
const scoreEl   = document.getElementById("score");

let answer = null;
let right  = 0;
let asked  = 0;

function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
function shuffle(list)    { list.sort(function () { return Math.random() - 0.5; }); }

function newRound() {
  goBtn.disabled       = true;
  answer               = pickRandom(SOURCE);
  outEl.textContent    = "? ? ?";
  statusEl.className   = "ics-note";
  statusEl.textContent = "Which one is it?";

  const choices = [answer];
  while (choices.length < 4 && choices.length < SOURCE.length) {
    const maybe = pickRandom(SOURCE);
    if (!choices.includes(maybe)) { choices.push(maybe); }
  }
  shuffle(choices);

  choicesEl.innerHTML = "";

  // ---- TODO 1, done ---------------------------------------
  choices.forEach(function (option) {
    const btn = document.createElement("button");
    btn.className   = "ics-choice";
    btn.textContent = option;
    btn.addEventListener("click", function () { guess(btn, option); });
    choicesEl.appendChild(btn);
  });
}

function guess(button, picked) {
  outEl.textContent = answer;
  asked++;

  // ---- TODO 2, done ---------------------------------------
  if (picked === answer) {
    right++;
    button.classList.add("right");
    statusEl.className   = "ics-note success";
    statusEl.textContent = "Correct!";
  } else {
    button.classList.add("wrong");
    statusEl.className   = "ics-note error";
    statusEl.textContent = "Not quite — it was " + answer + ".";
  }

  document.querySelectorAll(".ics-choice").forEach(function (b) {
    b.disabled = true;
    if (b.textContent === answer) { b.classList.add("right"); }
  });

  // ---- TODO 3, done ---------------------------------------
  scoreEl.innerHTML = "SCORE <b>" + right + "</b> / " + asked;

  goBtn.disabled = false;
}

goBtn.addEventListener("click", newRound);

newRound();
goBtn.textContent = "Next →";
