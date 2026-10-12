/* STEP 3 · YOU DO — three TODOs

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
  // TODO 1: the two lines you have now written twice.
  //   a) const response = ... fetch the API_URL, and await it
  //   b) const data     = ... turn response into JSON, and await it
  //   then keep just the list:   allPokemon = data.results;


  if (allPokemon.length === 0) {
    statusEl.className   = "ics-note error";
    statusEl.textContent = "No Pokémon yet — finish TODO 1 in js/main.js.";
    return;
  }
  newRound();
}

function newRound() {
  nextBtn.disabled = true;
  sprite.classList.add("hidden");
  statusEl.className   = "ics-note";
  statusEl.textContent = "Who's that Pokémon?";

  // The answer, plus three decoys that are not the answer.
  answer = pickRandom(allPokemon);
  const choices = [answer];
  while (choices.length < 4) {
    const maybe = pickRandom(allPokemon);
    if (!choices.includes(maybe)) { choices.push(maybe); }
  }
  shuffle(choices);

  sprite.src = SPRITES + idFromUrl(answer.url) + ".png";

  choicesEl.innerHTML = "";

  // TODO 2: build one button per choice. The same forEach shape you
  // have seen all night.
  choices.forEach(function (option) {

    // a) make a <button>:        const btn = document.createElement("button");
    // b) give it a class:        btn.className = "ics-choice";
    // c) put the name on it:     btn.textContent = option.name;
    // d) handle the click:       btn.addEventListener("click", function () {
    //                              guess(btn, option);
    //                            });
    // e) put it on the page:     choicesEl.appendChild(btn);

  });

  // Nothing built? Say so, instead of leaving an empty box.
  // (Delete this once TODO 2 works.)
  if (choicesEl.children.length === 0) {
    statusEl.className   = "ics-note error";
    statusEl.textContent = "No buttons yet — finish TODO 2.";
  }
}

function guess(button, picked) {
  sprite.classList.remove("hidden");     // the reveal
  asked++;

  // TODO 3: was it right?
  //   if picked is the same as answer: add 1 to right,
  //     button.classList.add("right"), and say "Correct!"
  //   otherwise: button.classList.add("wrong"), and say what it was.


  // Grey out every button and highlight the correct one (given).
  document.querySelectorAll(".ics-choice").forEach(function (b) {
    b.disabled = true;
    if (b.textContent === answer.name) { b.classList.add("right"); }
  });

  scoreEl.innerHTML = "SCORE <b>" + right + "</b> / " + asked;
  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", newRound);

load();


/* STUCK? The answer key is the next folder down: 3-the-game-solution.
   Looking at it is allowed. Copying it in works tonight and costs you
   next week. */
