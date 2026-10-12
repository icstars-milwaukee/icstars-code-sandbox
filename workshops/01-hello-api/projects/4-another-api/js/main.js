/* HOMEWORK — the same move, somebody else's data.

   No Pokémon here. If the three lines work against an API you have
   never seen, you did not memorise this workshop — you learned it. */

// TODO 1: the posts URL. It is printed on the page above the button.
const API_URL = "";

const button = document.getElementById("loadBtn");
const cards  = document.getElementById("cards");
const count  = document.getElementById("count");

button.addEventListener("click", async function () {
  count.textContent = "Loading...";
  cards.innerHTML = "";          // clear the old cards

  // TODO 2: the two lines. Third time.
  //   a) const response = ... fetch the API_URL, and await it
  //   b) const posts    = ... turn response into JSON, and await it


  // TODO 3: loop over `posts`. For each one build a card showing
  //   post.title in an <h3> and post.body in a <p>. It is the same
  //   forEach shape as the guess buttons, with different field names.
  //     const card = document.createElement("div");
  //     card.className = "ics-card";
  //     card.innerHTML = "<h3>" + post.title + "</h3>" + ...
  //     cards.appendChild(card);


  // TODO 4: uncomment once TODO 2 works.
  // count.textContent = posts.length + " posts loaded";
});


/* Notice what did NOT change: fetch, await, .json(). Notice what did:
   the URL, and the field names. That is the whole transfer. */
