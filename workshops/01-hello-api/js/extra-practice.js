// TODO 1: Put the posts URL in here (it's printed above the button).
const API_URL = "";

const button = document.getElementById("loadBtn");
const cards  = document.getElementById("cards");
const count  = document.getElementById("count");

button.addEventListener("click", async function () {
  count.textContent = "Loading...";

  cards.innerHTML = "";   // clear the old cards

  // TODO 2: Write the two lines you've now written twice.
  //   a) const response = ... fetch the API_URL, and await it
  //   b) const posts    = ... turn response into JSON, and await it


  // TODO 3: Loop over `posts`. For each one, build a card showing
  //         post.title in an <h3> and post.body in a <p>.
  //         Copy the shape from step-2-we-do.html, change the field names.


  // TODO 4: Uncomment this once TODO 2 works. How many posts came back?
  // count.textContent = posts.length + " posts loaded";
});
