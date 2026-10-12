/* HOMEWORK — finished. The three lines never changed. */

// TODO 1, done.
const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=12";

const button = document.getElementById("loadBtn");
const cards  = document.getElementById("cards");
const count  = document.getElementById("count");

button.addEventListener("click", async function () {
  count.textContent = "Loading...";
  cards.innerHTML = "";

  // TODO 2, done — the same two lines, forever.
  const response = await fetch(API_URL);
  const posts    = await response.json();

  // TODO 3, done — same loop, different field names.
  posts.forEach(function (post) {
    const card = document.createElement("div");
    card.className = "ics-card";
    card.innerHTML =
      "<h3>" + post.title + "</h3>" +
      "<p>" + post.body + "</p>";
    cards.appendChild(card);
  });

  // TODO 4, done.
  count.textContent = posts.length + " posts loaded";
});


/* BREAK IT ON PURPOSE:

   _limit=12 -> _limit=100    the API happily gives you 100. Your page
                              is now a wall. Limits are a design choice.
   post.title -> post.name    "undefined" in every heading. The field
                              names belong to whoever wrote the API.
   drop the innerHTML quotes  a syntax error, in the console, with a
                              line number. Read it; it is information. */
