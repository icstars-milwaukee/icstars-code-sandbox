/* ============================================================
   WHO'S THAT POKÉMON?

   The whole app. Ninety lines, and only three of them are new:

     const response = await fetch(URL);     // 1. ASK
     const data     = await response.json();// 2. UNWRAP
     sprite.src     = ...;                  // 3. SHOW

   Everything else is a random pick, a loop that makes buttons, and
   counting. A game is just:  data + a random pick + a click handler.
   ============================================================ */

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";
const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

// Grab every element once, at the top, by its id. Learn this habit
// and you stop writing getElementById inside loops.
const sprite    = document.getElementById("sprite");
const choicesEl = document.getElementById("choices");
const statusEl  = document.getElementById("status");
const scoreEl   = document.getElementById("score");
const nextBtn   = document.getElementById("nextBtn");

// State lives in ONE place, named, at the top. When the page is
// wrong, the first question is always "what is in here?"
let allPokemon = [];
let answer     = null;
let right      = 0;   // how many you got right
let asked      = 0;   // how many you have been asked


// ---- 1. GET THE DATA ---------------------------------------
// async = "there is a wait inside this function."
// await = "pause right here until the data comes back."
async function load() {
  const response = await fetch(API_URL);     // 1. ASK    — go get it
  const data     = await response.json();    // 2. UNWRAP — open the envelope

  // This API wraps its list in a field called "results". Square
  // brackets [ ] mean a list — so you can loop it, count it, and
  // pick from it. That sentence is why a game is possible at all.
  allPokemon = data.results;

  newRound();
}


// ---- 2. START A ROUND --------------------------------------
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

  // 3. SHOW — each item is { name: "pikachu", url: ".../pokemon/25/" },
  // and only the number out of that url is needed for the picture.
  sprite.src = SPRITES + idFromUrl(answer.url) + ".png";

  // One button per choice. Same forEach shape, every time.
  choicesEl.innerHTML = "";
  choices.forEach(function (option) {
    const btn = document.createElement("button");
    btn.className   = "ics-choice";
    btn.textContent = option.name;
    btn.addEventListener("click", function () { guess(btn, option); });
    choicesEl.appendChild(btn);
  });
}


// ---- 3. HANDLE A GUESS -------------------------------------
function guess(button, picked) {
  // .hidden is one line of CSS: filter: brightness(0). It paints
  // every pixel black. Taking it off is the whole reveal.
  sprite.classList.remove("hidden");
  asked++;

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

  // Grey out every button and highlight the correct one.
  document.querySelectorAll(".ics-choice").forEach(function (b) {
    b.disabled = true;
    if (b.textContent === answer.name) { b.classList.add("right"); }
  });

  scoreEl.innerHTML = "SCORE <b>" + right + "</b> / " + asked;
  nextBtn.disabled = false;
}


// ---- little helpers (nothing new to learn here) -------------
function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
function shuffle(list)    { list.sort(function () { return Math.random() - 0.5; }); }

// "https://pokeapi.co/api/v2/pokemon/25/"  ->  "25"
function idFromUrl(url)   { return url.split("/")[6]; }

nextBtn.addEventListener("click", newRound);

load();


/* ============================================================
   BREAK IT ON PURPOSE
   Change one thing, press Run, and read what happens. Each of
   these teaches one idea faster than a paragraph about it.

   delete  shuffle(choices)      the answer is always the first
                                 button. That one line is the
                                 entire difficulty of the game.

   limit=151  ->  limit=3        the same Pokémon over and over.
                                 Random needs something to be
                                 random across.

   delete the first  await       "[object Promise]" instead of a
                                 name. The wait never happened, so
                                 you printed the waiting.

   delete  async                 "await is only valid in async
                                 functions." The two words are a
                                 pair; you never get one alone.

   delete  .results              "allPokemon.length is undefined".
                                 You kept the envelope instead of
                                 the letter inside it.

   split("/")[6]  ->  [5]        broken images. The number lives in
                                 slot 6 of that address, not 5.

   choices.length < 4  ->  < 2   a coin flip. Four choices was a
                                 design decision, not a law.
   ============================================================ */
