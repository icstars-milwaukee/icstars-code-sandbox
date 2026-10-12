/* STEP 3 · ANSWER KEY — the three TODOs, filled in

   A game is just:  data  +  a random pick  +  a click handler.
   Steps 1 and 2 built the first two. This adds the click. */

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";
const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

const sprite    = document.getElementById("sprite");
const choicesEl = document.getElementById("choices");
const statusEl  = document.getElementById("status");
const scoreEl   = document.getElementById("score");
const nextBtn   = document.getElementById("nextBtn");

let allPokemon = [];
let answer     = null;
let right      = 0;   // how many you got right
let asked      = 0;   // how many you have been asked

function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
function shuffle(list)    { list.sort(function () { return Math.random() - 0.5; }); }
function idFromUrl(url)   { return url.split("/")[6]; }


async function load() {
  // TODO 1, done.
  const response = await fetch(API_URL);
  const data     = await response.json();
  allPokemon     = data.results;

  newRound();
}

function newRound() {
  nextBtn.disabled = true;
  sprite.classList.add("hidden");
  statusEl.className   = "ics-note";
  statusEl.textContent = "Who's that Pokémon?";

  answer = pickRandom(allPokemon);
  const choices = [answer];
  while (choices.length < 4) {
    const maybe = pickRandom(allPokemon);
    if (!choices.includes(maybe)) { choices.push(maybe); }
  }
  shuffle(choices);

  sprite.src = SPRITES + idFromUrl(answer.url) + ".png";

  // TODO 2, done.
  choicesEl.innerHTML = "";
  choices.forEach(function (option) {
    const btn = document.createElement("button");
    btn.className   = "ics-choice";
    btn.textContent = option.name;
    btn.addEventListener("click", function () { guess(btn, option); });
    choicesEl.appendChild(btn);
  });
}

function guess(button, picked) {
  sprite.classList.remove("hidden");
  asked++;

  // TODO 3, done.
  if (picked === answer) {
    right++;
    button.classList.add("right");
    statusEl.className   = "ics-note success";
    statusEl.textContent = "Correct!";
  } else {
    button.classList.add("wrong");
    statusEl.className   = "ics-note error";
    statusEl.textContent = "Not quite — it was " + answer.name + ".";
  }

  document.querySelectorAll(".ics-choice").forEach(function (b) {
    b.disabled = true;
    if (b.textContent === answer.name) { b.classList.add("right"); }
  });

  scoreEl.innerHTML = "SCORE <b>" + right + "</b> / " + asked;
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", newRound);

load();


/* BREAK IT ON PURPOSE — this one is finished, so take it apart:

   delete shuffle(choices)    the answer is always the first button.
                              That one line is the whole difficulty.
   choices.length < 4 -> < 2  a coin flip. Four choices is a design
                              decision, not a rule of the universe.
   picked === answer -> ==    still works here. Ask why `===` is the
                              habit anyway, and when `==` bites. */
