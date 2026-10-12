/* ============================================================
   STEP 3 · YOU DO    — exactly three TODOs

   THE RULE FOR WHOEVER WRITES THIS FILE:
     - exactly three TODOs. Not two, not five.
     - each one is 1-4 lines of typing.
     - the page still RUNS with all three unfinished. It just
       tells the student which one to go do. A white screen and
       a console error is how you lose somebody for the night.
     - every TODO is a move they already watched twice tonight.
   ============================================================ */

const SOURCE = ["first thing", "second thing", "third thing", "fourth thing"];

const goBtn     = document.getElementById("goBtn");
const statusEl  = document.getElementById("status");
const outEl     = document.getElementById("out");
const choicesEl = document.getElementById("choices");
const scoreEl   = document.getElementById("score");

let answer = null;
let right  = 0;    // how many you got right
let asked  = 0;    // how many you've been asked

function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
function shuffle(list)    { list.sort(function () { return Math.random() - 0.5; }); }

// ---- 1. START A ROUND (given — this is step 2's code) ------
function newRound() {
  goBtn.disabled       = true;
  answer               = pickRandom(SOURCE);
  outEl.textContent    = "? ? ?";
  statusEl.className   = "ics-note";
  statusEl.textContent = "Which one is it?";

  // The answer plus up to three decoys that aren't the answer.
  const choices = [answer];
  while (choices.length < 4 && choices.length < SOURCE.length) {
    const maybe = pickRandom(SOURCE);
    if (!choices.includes(maybe)) { choices.push(maybe); }
  }
  shuffle(choices);

  choicesEl.innerHTML = "";

  // ---- TODO 1: build one button per choice ----------------
  // The same forEach shape you've seen twice already tonight.
  choices.forEach(function (option) {

    // a) make a <button> and put it in a variable called btn
    //      hint: document.createElement("button")

    // b) give it the class:   btn.className = "ics-choice";

    // c) put the text on it:  btn.textContent = option;

    // d) on click, call guess:
    //      btn.addEventListener("click", function () { guess(btn, option); });

    // e) put it on the page:  choicesEl.appendChild(btn);

  });

  // Nothing got built? Say so in plain English instead of
  // leaving an empty box. (Delete this once TODO 1 works.)
  if (choicesEl.children.length === 0) {
    statusEl.className   = "ics-note error";
    statusEl.textContent = "No buttons yet — finish TODO 1 in js/step-3.js.";
  }
}

// ---- 2. HANDLE A GUESS -------------------------------------
function guess(button, picked) {
  outEl.textContent = answer;      // the reveal
  asked++;

  // ---- TODO 2: was it right? -----------------------------
  // If picked is the same as answer: add 1 to right, give the
  // button .classList.add("right"), and say "Correct!"
  // Otherwise: .classList.add("wrong"), and say what it really was.
  //
  // if (picked === answer) {
  //   ...
  // } else {
  //   ...
  // }

  // Grey out every button and highlight the correct one (given).
  document.querySelectorAll(".ics-choice").forEach(function (b) {
    b.disabled = true;
    if (b.textContent === answer) { b.classList.add("right"); }
  });

  // ---- TODO 3: put the score on the page -----------------
  // scoreEl.innerHTML = "SCORE <b>" + ... + "</b> / " + ...;

  goBtn.disabled = false;
}

goBtn.addEventListener("click", newRound);

newRound();
goBtn.textContent = "Next →";
