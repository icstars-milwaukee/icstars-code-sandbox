// Same two lines as Step 1 — but this URL returns a LIST.
const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";

const sprite    = document.getElementById("sprite");
const revealBtn = document.getElementById("revealBtn");
const nextBtn   = document.getElementById("nextBtn");
const answerEl  = document.getElementById("answer");
const statusEl  = document.getElementById("status");

let allPokemon = [];   // all 151, straight from the API
let mystery    = null; // the one we're hiding right now

// ---- Get the data: the same three lines, one more time ----
async function load() {
  const response = await fetch(API_URL);
  const data     = await response.json();

  // This API wraps its list inside a field called "results".
  // Square brackets [ ] means a list — so we can loop it, count it, pick from it.
  allPokemon = data.results;

  statusEl.textContent = "Loaded " + allPokemon.length + " Pokémon.";
  newMystery();
}

// ---- Pick one at random and hide it ----------------------
function newMystery() {
  // Math.random() gives 0-to-1. Times the length, rounded down, = a random slot.
  mystery = allPokemon[Math.floor(Math.random() * allPokemon.length)];

  // Each item looks like { name: "pikachu", url: ".../pokemon/25/" }.
  // We only need the number out of that url to build the picture address.
  const id = mystery.url.split("/")[6];
  sprite.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
             + id + ".png";
  sprite.alt = "Mystery Pokémon silhouette";

  // .hidden is one CSS line: filter: brightness(0) — it paints every pixel black.
  sprite.classList.add("hidden");

  answerEl.textContent = "";
  revealBtn.disabled = false;
  nextBtn.disabled = true;
}

// ---- The reveal ------------------------------------------
revealBtn.addEventListener("click", function () {
  sprite.classList.remove("hidden");     // that's the whole trick
  sprite.alt = mystery.name;
  answerEl.textContent = "It's " + mystery.name + "!";
  revealBtn.disabled = true;
  nextBtn.disabled = false;
});

nextBtn.addEventListener("click", newMystery);

load();
