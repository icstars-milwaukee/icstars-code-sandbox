// TODO 1 answered:
const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=12";

const button = document.getElementById("loadBtn");
const cards  = document.getElementById("cards");
const count  = document.getElementById("count");

button.addEventListener("click", async function () {
  count.textContent = "Loading...";

  // TODO 2 answered — the same two lines, forever.
  const response = await fetch(API_URL);
  const posts    = await response.json();

  cards.innerHTML = "";

  // TODO 3 answered — same loop as Step 2, different field names.
  posts.forEach(function (post) {
    const card = document.createElement("div");
    card.className = "ics-card";
    card.innerHTML =
      "<h3>" + post.title + "</h3>" +
      "<p>" + post.body + "</p>";
    cards.appendChild(card);
  });

  count.textContent = posts.length + " posts loaded";
});
