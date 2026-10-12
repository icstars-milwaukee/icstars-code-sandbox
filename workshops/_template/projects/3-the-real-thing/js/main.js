/* STEP 3 · YOU DO — three TODOs

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

  choicesEl.innerHTML = "";

  // TODO 1: build one button per choice.
  choices.forEach(function (option) {

    // a) const btn = document.createElement("button");
    // b) btn.className = "ics-choice";
    // c) btn.textContent = option;
    // d) btn.addEventListener("click", function () { guess(btn, option); });
    // e) choicesEl.appendChild(btn);

  });

  // (Delete this once TODO 1 works.)
  if (choicesEl.children.length === 0) {
    statusEl.className   = "ics-note error";
    statusEl.textContent = "No buttons yet — finish TODO 1 in js/main.js.";
  }
}

function guess(button, picked) {
  outEl.textContent = answer;
  asked++;

  // TODO 2: was it right? Add 1 to `right`, mark the button
  //   .classList.add("right") or ("wrong"), and say so in statusEl.


  // Grey out every button and highlight the right one (given).
  document.querySelectorAll(".ics-choice").forEach(function (b) {
    b.disabled = true;
    if (b.textContent === answer) { b.classList.add("right"); }
  });

  // TODO 3: put the score on the page.
  //   scoreEl.innerHTML = "SCORE <b>" + ... + "</b> / " + ...;

  goBtn.disabled = false;
}

goBtn.addEventListener("click", newRound);

newRound();
goBtn.textContent = "Next →";


/* STUCK? The answer key is the next folder: 3-the-real-thing-solution. */
