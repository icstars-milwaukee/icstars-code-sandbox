/* STEP 1 · I DO — one Pokémon on the page.

   Three lines do the work. They are the same three lines in every
   project in this workshop:  ASK, UNWRAP, SHOW. */

const API_URL = "https://pokeapi.co/api/v2/pokemon/25";

const button = document.getElementById("loadBtn");
const output = document.getElementById("output");
const sprite = document.getElementById("sprite");

// async = "there is a wait inside this function."
button.addEventListener("click", async function () {
  output.textContent = "Loading...";

  // await = "pause right here until the data comes back."
  const response = await fetch(API_URL);     // 1. ASK    — go get it
  const pokemon  = await response.json();    // 2. UNWRAP — open the envelope

  // 3. SHOW — put the data on the page.
  output.textContent =
    "name:   " + pokemon.name + "\n" +
    "id:     " + pokemon.id + "\n" +
    "weight: " + pokemon.weight + "\n" +
    "type:   " + pokemon.types[0].type.name;

  // The picture is not special. It is a field holding a URL, handed
  // to an <img>. Count the dots: sprites, then front_default.
  // That is NESTING, and this line becomes the silhouette in step 2.
  sprite.src = pokemon.sprites.front_default;
  sprite.alt = pokemon.name;
});


/* BREAK IT ON PURPOSE — each of these teaches one thing:

   change 25 to 99999         there is no Pokémon 99999. A 404 is the
                              API telling you so, clearly. Meet one here.
   delete the first `await`    you get "[object Promise]" — the wait
                              never happened, so you printed the waiting.
   change front_default to foo a broken image. foo is undefined, and
                              undefined is not an address.
   delete `async`              "await is only valid in async functions."
                              The two words come as a pair.                */
