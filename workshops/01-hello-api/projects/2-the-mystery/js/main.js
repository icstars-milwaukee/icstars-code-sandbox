/* STEP 2 · WE DO — a random mystery.

   Same two fetch lines as step 1. One new idea: this URL returns a
   LIST, and a list is something you can pick from at random. */

const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";
const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

const sprite    = document.getElementById("sprite");
const revealBtn = document.getElementById("revealBtn");
const nextBtn   = document.getElementById("nextBtn");
const answerEl  = document.getElementById("answer");
const statusEl  = document.getElementById("status");

let allPokemon = [];     // all 151, straight from the API
let mystery    = null;   // the one being hidden right now

async function load() {
  const response = await fetch(API_URL);
  const data     = await response.json();

  // This API wraps its list in a field called "results". Square
  // brackets [ ] mean a list — so you can loop it, count it, and
  // pick from it. That sentence is why a game is possible at all.
  allPokemon = data.results;

  statusEl.textContent = "Loaded " + allPokemon.length + " Pokémon.";
  newMystery();
}

function newMystery() {
  // Math.random() gives 0 to 0.999…; times the length, floored, is
  // a valid slot every time. You will use this for the rest of your life.
  mystery = allPokemon[Math.floor(Math.random() * allPokemon.length)];

  // Each item is { name: "pikachu", url: ".../pokemon/25/" }. Only the
  // number out of that url is needed to build the picture address.
  const id = mystery.url.split("/")[6];
  sprite.src = SPRITES + id + ".png";
  sprite.alt = "Mystery Pokémon silhouette";

  // .hidden is one line of CSS: filter: brightness(0). It paints
  // every pixel black. That is the entire silhouette effect.
  sprite.classList.add("hidden");

  answerEl.textContent = "";
  revealBtn.disabled = false;
  nextBtn.disabled = true;
}

revealBtn.addEventListener("click", function () {
  sprite.classList.remove("hidden");        // that is the whole trick
  sprite.alt = mystery.name;
  answerEl.textContent = "It's " + mystery.name + "!";
  revealBtn.disabled = true;
  nextBtn.disabled = false;
});

nextBtn.addEventListener("click", newMystery);

load();


/* BREAK IT ON PURPOSE:

   limit=151 -> limit=3       the mystery repeats constantly. Random
                              needs something to be random across.
   delete .results            "allPokemon.length is undefined" — you
                              kept the envelope instead of the letter.
   split("/")[6] -> [5]       a broken image. The number was in slot 6.
   remove the classList.add   no silhouette — it just shows you the answer. */
