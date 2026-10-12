/* STEP 3 · ANSWER KEY — and this file is the TEST

   THE RULE FOR WHOEVER WRITES THIS FILE:
     - exactly three TODOs. Not two, not five.
     - each one is 1-4 lines of typing.
     - each one is a move they already watched twice tonight.
     - THE PAGE STILL RUNS with all three unfinished. It says which
       one to go do. A white screen and a console error is how you
       lose somebody for the night. */

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

  // TODO 1, done.
  choicesEl.innerHTML = "";
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

  // TODO 2, done.
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

  // TODO 3, done.
  scoreEl.innerHTML = "SCORE <b>" + right + "</b> / " + asked;

  goBtn.disabled = false;
}

goBtn.addEventListener("click", newRound);

newRound();
goBtn.textContent = "Next →";


/* If this file does not play through, the workshop is not finished.
   Open it and play a round before you ever teach from this folder. */
