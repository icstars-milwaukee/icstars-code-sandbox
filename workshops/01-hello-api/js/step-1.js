/* ============================================================================
   STEP 1 · I DO  —  js/step-1.js
   ============================================================================

   INSTRUCTOR: this file is the live demo. You make FOUR edits on screen,
   in this order. Everything else is already here — don't touch it.

     EDIT 1  (line ~38)  the URL            → "which computer am I asking?"
     EDIT 2  (line ~52)  ASK     + UNWRAP   → the two lines that never change
     EDIT 3  (line ~62)  SHOW the text      → data on the page
     EDIT 4  (line ~72)  SHOW the picture   → nesting, and the "whoa" moment

   Each edit is wrapped in a banner like this so it's obvious on a projector:

       // >>>>>>>>>>>>>>>>>>>> EDIT 1 <<<<<<<<<<<<<<<<<<<<

   HOW THIS SCAFFOLDS THE APP (say this out loud at the end):
     EDIT 2 is the entire data layer of the finished game — js/game.js
       does exactly this, once, for a list of 151 instead of one Pokémon.
     EDIT 4 is the game's silhouette. Same sprite URL, one CSS class on top.
     So: Step 1 is the app. Steps 2 and 3 only add a random pick and buttons.
   ========================================================================= */


// --- The parts of the page we control (already wired up for you) ----------
const button = document.getElementById("loadBtn");
const output  = document.getElementById("output");
const sprite  = document.getElementById("sprite");


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> EDIT 1 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// The exact URL we just tested in Postman. Paste it here and say:
//   "same address as Postman — the browser can ask for it too."
const API_URL = "https://pokeapi.co/api/v2/pokemon/25";
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// "When the button is clicked, run this function."
// `async` = "there is a wait inside this function."
button.addEventListener("click", async function () {
  output.textContent = "Loading...";


  // >>>>>>>>>>>>>>>>>>>>>>>>>>> EDIT 2 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // THE TWO LINES. These never change — not tonight, not in React, not ever.
  // `await` = "pause right here until the data comes back."

  const response = await fetch(API_URL);     // 1. ASK    — go get it
  const pokemon  = await response.json();    // 2. UNWRAP — open the envelope

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  // >>>>>>>>>>>>>>>>>>>>>>>>>>> EDIT 3 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // 3. SHOW — put the data on the page. Add these lines one at a time and
  //    refresh between them, so they watch each field appear.

  output.textContent =
    "name:   " + pokemon.name + "\n" +
    "id:     " + pokemon.id + "\n" +
    "weight: " + pokemon.weight + "\n" +
    "type:   " + pokemon.types[0].type.name;

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  // >>>>>>>>>>>>>>>>>>>>>>>>>>> EDIT 4 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // The picture is NOT special. It's a field holding a URL, handed to an
  // <img>. Count the dots out loud: sprites, then front_default.
  // That's NESTING — and this one line becomes the game's silhouette.

  sprite.src = pokemon.sprites.front_default;
  sprite.alt = pokemon.name;

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
});
