  /* ============================================================
 A game is just:   data  +  a random pick  +  a click handler
 You already built the first two in Step 2. Tonight you add the click.
 ============================================================ */

  const API_URL = "https://pokeapi.co/api/v2/pokemon?limit=151";

  const sprite    = document.getElementById("sprite");
  const choicesEl = document.getElementById("choices");
  const statusEl  = document.getElementById("status");
  const scoreEl   = document.getElementById("score");
  const nextBtn   = document.getElementById("nextBtn");

  let allPokemon = [];
  let right = 0;    // how many you got right
  let asked = 0;    // how many you've been asked

  // ---- 1. GET THE DATA -------------------------------------
  async function load() {
// TODO 1: The two lines you've now written twice tonight.
//   a) const response = ... fetch the API_URL, and await it
//   b) const data     = ... turn response into JSON, and await it
//   Then uncomment this, which keeps just the list:
// allPokemon = data.results;

if (allPokemon.length === 0) {
  statusEl.className = "ics-note error";
  statusEl.textContent = "No Pokémon yet — finish TODO 1 in the code.";
  return;
}
statusEl.textContent = "Loaded " + allPokemon.length + " Pokémon. Guess away!";
newRound();
  }

  // ---- 2. START A ROUND (given — this is Step 2's code) -----
  function newRound() {
nextBtn.disabled = true;
sprite.classList.add("hidden");
statusEl.className = "ics-note";
statusEl.textContent = "Who's that Pokémon?";

// The answer, plus three decoys that aren't the answer.
const answer  = pickRandom(allPokemon);
const choices = [answer];
while (choices.length < 4) {
  const maybe = pickRandom(allPokemon);
  if (!choices.includes(maybe)) { choices.push(maybe); }
}
shuffle(choices);

sprite.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
           + idFromUrl(answer.url) + ".png";

// ---- TODO 2: build one button per choice -----------------
// This is the SAME forEach shape you've seen all night.
choicesEl.innerHTML = "";
choices.forEach(function (option) {

  // a) make a <button> element and put it in a variable called btn
  //      hint: document.createElement("button")

  // b) give it   btn.className = "ics-choice";

  // c) put the name on it:   btn.textContent = option.name;

  // d) when it's clicked, call guess():
  //      btn.addEventListener("click", function () { guess(btn, option, answer); });

  // e) add it to the page:   choicesEl.appendChild(btn);

});
  }

  // ---- 3. HANDLE A GUESS ------------------------------------
  function guess(button, picked, answer) {
sprite.classList.remove("hidden");   // the big reveal
asked++;

// ---- TODO 3: did they get it right? ----------------------
// If picked is the same as answer:  add 1 to right,
//   give the button  .classList.add("right")  and say "Correct!"
// Otherwise: give the button  .classList.add("wrong")  and say what it really was.
//
// if (picked === answer) {
//   ...
// } else {
//   ...
// }

// Grey out every button and highlight the correct one (given).
document.querySelectorAll(".ics-choice").forEach(function (b) {
  b.disabled = true;
  if (b.textContent === answer.name) { b.classList.add("right"); }
});

scoreEl.innerHTML = "SCORE <b>" + right + "</b> / " + asked;
nextBtn.disabled = false;
  }

  // ---- little helpers (nothing new to learn here) ------------
  function pickRandom(list) { return list[Math.floor(Math.random() * list.length)]; }
  function shuffle(list)    { list.sort(function () { return Math.random() - 0.5; }); }

  // "https://pokeapi.co/api/v2/pokemon/25/"  ->  "25"
  function idFromUrl(url)   { return url.split("/")[6]; }

  nextBtn.addEventListener("click", newRound);

  load();
