/* ============================================================
   Who's That Pokémon? — the finished game.

   Read it in this order:
     1. state      — what the game knows
     2. render()   — draw the screen from state
     3. load()     — get data from the API, put it in state
     4. newRound() and guess() — the game itself

   That order is on purpose. It is how React works.
   ============================================================ */

const API_URL    = "https://pokeapi.co/api/v2/pokemon?limit=151";
const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

// --- The parts of the page we control ---------------------------
const spriteEl  = document.getElementById("sprite");
const choicesEl = document.getElementById("choices");
const statusEl  = document.getElementById("status");
const scoreEl   = document.getElementById("score");
const streakEl  = document.getElementById("streak");
const bestEl    = document.getElementById("best");
const nextBtn   = document.getElementById("nextBtn");
const resetBtn  = document.getElementById("resetBtn");

// --- 1. STATE: everything the game needs to know ---------------
// Change state, then call render(). Never the other way around.
const state = {
  all:     [],     // all 151, from the API
  answer:  null,   // the Pokémon being hidden
  choices: [],     // the four options on screen
  picked:  null,   // what the player clicked, or null mid-round
  right:   0,
  asked:   0,
  streak:  0,
  best:    0,
  loading: true,
  error:   ""
};

// --- 2. RENDER: turn state into HTML ---------------------------
function render() {
  // Still waiting on the API.
  if (state.loading) {
    statusEl.className = "ics-note";
    statusEl.textContent = "Loading 151 Pokémon...";
    choicesEl.innerHTML = "";
    return;
  }

  // Something went wrong (no wifi, API down, typo in the URL).
  if (state.error) {
    statusEl.className = "ics-note error";
    statusEl.textContent = "Could not load the Pokémon: " + state.error;
    choicesEl.innerHTML = "";
    nextBtn.disabled = true;
    return;
  }

  // The picture: a silhouette until they've guessed.
  spriteEl.src = SPRITE_BASE + idFromUrl(state.answer.url) + ".png";
  spriteEl.classList.toggle("hidden", state.picked === null);
  spriteEl.alt = state.picked === null ? "Mystery Pokémon silhouette" : state.answer.name;

  // The message.
  if (state.picked === null) {
    statusEl.className = "ics-note";
    statusEl.textContent = "Who's that Pokémon?";
  } else if (state.picked === state.answer) {
    statusEl.className = "ics-note success";
    statusEl.textContent = "Correct — it's " + state.answer.name + "!";
  } else {
    statusEl.className = "ics-note error";
    statusEl.textContent = "Nope, that was " + state.answer.name + ".";
  }

  // The four buttons.
  choicesEl.innerHTML = "";
  state.choices.forEach(function (option) {
    const btn = document.createElement("button");
    btn.className = "ics-choice";
    btn.textContent = option.name;

    if (state.picked !== null) {
      btn.disabled = true;                                   // round is over
      if (option === state.answer)      { btn.classList.add("right"); }
      else if (option === state.picked) { btn.classList.add("wrong"); }
    } else {
      btn.addEventListener("click", function () { guess(option); });
    }
    choicesEl.appendChild(btn);
  });

  // The scoreboard.
  scoreEl.innerHTML = "SCORE <b>" + state.right + "</b> / " + state.asked;
  streakEl.textContent = state.streak >= 2 ? "streak " + state.streak + " 🔥" : "";
  bestEl.textContent   = state.best   >= 2 ? "best " + state.best : "";
  nextBtn.disabled = state.picked === null;
}

// --- 3. LOAD: the same three lines from Step 1 ------------------
async function load() {
  try {
    const response = await fetch(API_URL);

    // fetch() does NOT throw on a 404 or 500. We have to check ourselves.
    if (!response.ok) {
      throw new Error("server replied " + response.status);
    }

    const data  = await response.json();
    state.all   = data.results;
    state.loading = false;
    newRound();                 // newRound() calls render() for us
  } catch (err) {
    state.loading = false;
    state.error   = err.message;
    render();
  }
}

// --- 4. THE GAME -----------------------------------------------
function newRound() {
  state.answer  = pickRandom(state.all);
  state.choices = [state.answer];
  while (state.choices.length < 4) {
    const maybe = pickRandom(state.all);
    if (!state.choices.includes(maybe)) { state.choices.push(maybe); }
  }
  shuffle(state.choices);
  state.picked = null;          // nothing guessed yet this round
  render();
}

function guess(option) {
  state.picked = option;
  state.asked++;

  if (option === state.answer) {
    state.right++;
    state.streak++;
    if (state.streak > state.best) { state.best = state.streak; }
  } else {
    state.streak = 0;
  }
  render();
}

// --- helpers ---------------------------------------------------
function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
function shuffle(list)    { list.sort(function () { return Math.random() - 0.5; }); }

// "https://pokeapi.co/api/v2/pokemon/25/"  ->  "25"
function idFromUrl(url)   { return url.split("/")[6]; }

// --- wiring ----------------------------------------------------
nextBtn.addEventListener("click", newRound);

resetBtn.addEventListener("click", function () {
  state.right = 0;
  state.asked = 0;
  state.streak = 0;
  state.best = 0;
  newRound();
});

// Keyboard play: press 1-4 to answer. Small touch, big difference.
document.addEventListener("keydown", function (event) {
  if (state.loading || state.error) { return; }
  if (event.key === "Enter" && state.picked !== null) { newRound(); return; }

  const slot = Number(event.key);
  if (slot >= 1 && slot <= 4 && state.picked === null) {
    guess(state.choices[slot - 1]);
  }
});

// --- Kick everything off ---------------------------------------
render();   // draw the "Loading..." state immediately
load();     // then go get the real data
