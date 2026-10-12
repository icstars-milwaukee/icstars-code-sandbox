/* ============================================================
   THE CATALOG
   This is the only file you edit to put a workshop on the shelf.

   Add one object to WORKSHOPS, drop your folder in workshops/,
   and the front page builds the card for you. No build step,
   no npm, no JSON fetch — just a list and a loop, because this
   page is also a teaching example.

   Fields:
     n        the shelf number, as a string so "01" keeps its zero
     slug     the folder name under workshops/ — must match exactly
     title    short. It gets set in uppercase by CSS.
     track    groups the filter chips. Reuse an existing track.
     status   "ready"  someone has taught it start to finish
              "draft"  written but untested on a live cohort
              "soon"   folder exists, content does not
     minutes  how long the guided part runs
     origin   where it came from, e.g. "RFP Week 6". "" if evergreen.
     hook     one or two sentences. What they WALK OUT WITH, not
              a topic list. Compare: "fetch and JSON" (dead) vs
              "a working game out of data you never typed" (alive).
     teaches  five tags maximum. Nine tags is a syllabus.
     deck     filename of the slide deck, or null if there isn't one
     live     true if the workshop has a playground.html — its app
              in a live editor, so a student can run and break it
              without installing anything.
              Built by tools/build-playground.py

   There is deliberately no field for "extra pages". A workshop is
   one app and one deck. Anything else is not on the shelf.
   ============================================================ */

const WORKSHOPS = [

  {
    n: "01",
    slug: "01-hello-api",
    title: "Hello, API",
    track: "Front-end",
    status: "ready",
    minutes: 30,
    origin: "RFP Week 6",
    hook: "Thirty minutes from now you have a working game built out of data you never " +
          "typed. One game, three passes: ask, unwrap, show.",
    teaches: ["fetch", "JSON", "async / await", "Postman", "DOM"],
    deck: "REF-deck.html",
    live: true
  }

  /* ---- Copy this block to add the next one -------------------
  ,{
    n: "02",
    slug: "02-your-folder-name",
    title: "Workshop title",
    track: "Front-end",
    status: "soon",
    minutes: 30,
    origin: "RFP Week 7",
    hook: "What the student walks out holding.",
    teaches: ["thing", "thing", "thing"],
    deck: "REF-deck.html",
    live: true
  }
  ------------------------------------------------------------ */

];


/* ============================================================
   THE RENDER
   Everything below is plumbing. You should not need to touch it
   to add a workshop — but it is short on purpose, so read it.
   ============================================================ */
(function () {
  const shelf   = document.getElementById("shelf");
  const filters = document.getElementById("filters");
  const count   = document.getElementById("count");
  const search  = document.getElementById("search");
  let   track   = "All";                       // which chip is pressed
  let   query   = "";                          // what is in the search box

  /* Never drop user-ish text straight into innerHTML. Build the
     node and set .textContent — the browser escapes it for free. */
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls)  node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function link(label, href, primary) {
    const a = el("a", primary ? "wlink primary" : "wlink", label);
    a.href = href;
    return a;
  }

  function card(w) {
    const base = "workshops/" + w.slug + "/";
    const c = el("article", "wcard");

    const top = el("div", "wcard-top");
    top.appendChild(el("span", "wnum", w.n));

    const chips = el("div", "wchips");
    chips.appendChild(el("span", "chip " + w.status,
                         w.status === "soon" ? "coming soon" : w.status));
    /* The signal that matters most to a student with no laptop set
       up: can I do this right here, in the browser? It is a link,
       not a label — clicking "live editor" opens the playground,
       because that is what anyone reading it expects. */
    if (w.live && w.status !== "soon") {
      const chip = el("a", "chip live", "live editor");
      chip.href  = base + "playground.html";
      chip.title = "Open the app's files in an editor, already running";
      chips.appendChild(chip);
    }
    top.appendChild(chips);
    c.appendChild(top);

    c.appendChild(el("h3", null, w.title));

    /* Build the meta line out of the parts that exist, so a
       workshop with no origin doesn't show a dangling dot. */
    const meta = [w.track, w.minutes + " min"];
    if (w.origin) meta.push(w.origin);
    c.appendChild(el("p", "wmeta", meta.join(" · ")));

    c.appendChild(el("p", "whook", w.hook));

    if (w.teaches && w.teaches.length) {
      const tags = el("div", "wteaches");
      w.teaches.forEach(function (t) { tags.appendChild(el("span", null, t)); });
      c.appendChild(tags);
    }

    const links = el("div", "wlinks");
    if (w.status === "soon") {
      links.appendChild(el("span", "wmeta", "Nothing to open yet."));
    } else {
      /* index.html at a workshop root IS the app — the card runs
         the thing rather than landing on a page about it. */
      links.appendChild(link("Run the app", base + "index.html", true));
      if (w.live) links.appendChild(link("Live editor ▸", base + "playground.html"));
      if (w.deck) links.appendChild(link("Deck", base + w.deck));
    }
    c.appendChild(links);

    return c;
  }

  /* The dashed card at the end of the shelf. It is a real link to
     the template, so "where do I start a new one" is never a
     question somebody has to ask in Slack. */
  function ghost() {
    const c = el("article", "wcard ghost");
    const top = el("div", "wcard-top");
    top.appendChild(el("span", "wnum", "+"));
    const chips = el("div", "wchips");
    chips.appendChild(el("span", "chip soon", "template"));
    top.appendChild(chips);
    c.appendChild(top);
    c.appendChild(el("h3", null, "The next workshop"));
    c.appendChild(el("p", "wmeta", "workshops/_template/"));
    c.appendChild(el("p", "whook",
      "Copy the template folder, rename it, rewrite the deck and the app. " +
      "The checklist inside tells you what good looks like."));
    const links = el("div", "wlinks");
    links.appendChild(link("Open the template", "workshops/_template/index.html"));
    links.appendChild(link("How to add one", "#add"));
    c.appendChild(links);
    return c;
  }

  /* Everything a card shows, lowercased, in one string — so the
     search matches what the reader can actually see, including the
     tags and the hook, not just the title. */
  function haystack(w) {
    return [w.n, w.title, w.track, w.origin, w.hook, w.slug]
             .concat(w.teaches || [])
             .join(" ")
             .toLowerCase();
  }

  function paint() {
    const shown = WORKSHOPS.filter(function (w) {
      if (track !== "All" && w.track !== track) return false;
      return !query || haystack(w).indexOf(query) > -1;
    });

    shelf.textContent = "";                  // clear, then rebuild
    shown.forEach(function (w) { shelf.appendChild(card(w)); });

    if (!shown.length) {
      shelf.appendChild(el("div", "shelf-empty", query
        ? "Nothing matches “" + query + "”" +
          (track === "All" ? "." : " on the " + track + " track.")
        : "No workshops on the " + track + " track yet. Yours could be the first."));
    }
    /* The template is not a search result, so it only sits at the
       end of the unfiltered shelf. */
    if (track === "All" && !query) shelf.appendChild(ghost());

    if (query || track !== "All") {
      count.textContent = shown.length + " of " + WORKSHOPS.length + " workshops";
      return;
    }
    const ready = WORKSHOPS.filter(function (w) { return w.status === "ready"; }).length;
    count.textContent = WORKSHOPS.length + " workshop" + (WORKSHOPS.length === 1 ? "" : "s")
                      + " · " + ready + " classroom-tested";
  }

  if (search) {
    search.addEventListener("input", function () {
      query = search.value.trim().toLowerCase();
      paint();
    });
    search.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { search.value = ""; query = ""; paint(); }
    });
  }

  /* One chip per track, discovered from the catalog — so a new
     track appears here the moment the first workshop claims it. */
  function buildFilters() {
    const tracks = ["All"];
    WORKSHOPS.forEach(function (w) {
      if (tracks.indexOf(w.track) === -1) tracks.push(w.track);
    });

    tracks.forEach(function (t) {
      const b = el("button", "lib-chip", t);
      b.type = "button";
      b.setAttribute("aria-pressed", String(t === track));
      b.addEventListener("click", function () {
        track = t;
        filters.querySelectorAll(".lib-chip").forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === b));
        });
        paint();
      });
      filters.appendChild(b);
    });

    /* One track and nothing to filter against — hide the row
       rather than show a single pointless button. */
    if (tracks.length < 3) filters.style.display = "none";
  }

  buildFilters();
  paint();
})();
