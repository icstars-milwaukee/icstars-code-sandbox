# i.c.stars\* Code Sandbox

A growing library of guided tech learning workshops from **i.c.stars Milwaukee**.

**Live site:** https://icstars-milwaukee.github.io/icstars-code-sandbox/

Every workshop in here is three things: a **deck you can present**, a **set of
files that run in a browser**, and a **finished build** to compare against. No
servers, no npm, no build step, no accounts — a browser and VS Code. Each one
ends with the student holding something that works.

---

## What's on the shelf

| # | Workshop | Track | Time | Status |
|---|---|---|---|---|
| 01 | [Hello, API](workshops/01-hello-api/) — a Pokémon guessing game built out of `fetch` | Front-end | 30 min | ready |

The front page builds this list from [`js/workshops.js`](js/workshops.js), which
is the single file you edit to add a workshop.

## Running it locally

Clone it and open `index.html`. That's the whole setup.

```bash
git clone https://github.com/icstars-milwaukee/icstars-code-sandbox.git
cd icstars-code-sandbox
start index.html        # Windows.  macOS: open index.html
```

Every path in the repo is relative, so the site works identically from a
`file://` URL and from GitHub Pages. Students can be handed a zip.

## Layout

```
index.html              the front door
CONTRIBUTING.md         how to add a workshop, and the house rules
.nojekyll               keeps GitHub Pages from hiding workshops/_template/

css/theme.css           the house theme — shared by every workshop
css/library.css         front-door-only styling
js/workshops.js         THE CATALOG — add your workshop here

workshops/_template/    copy this to start a new one (it runs as-is)
workshops/01-hello-api/ fetch, JSON, async/await, DOM
```

## Adding a workshop

Copy `workshops/_template/` and work through the checklist in its `README.md`.
The short version:

1. Copy the template folder to `workshops/0N-your-slug/`
2. Rewrite `REF-deck.html` — **don't touch its `<style>` block**
3. Fill in the three passes (I do → We do → You do) and the answer key
4. Add one object to `js/workshops.js`
5. Teach it to real people, then set `status: "ready"`

Full rules, including the parts of the house style that are not up for
redesign, are in [CONTRIBUTING.md](CONTRIBUTING.md).

## House style, in one paragraph

Ink `#161217`, paper `#FAF6F2`, red `#D6003C`. Segoe UI for display, Consolas
for code. Three slide backgrounds and no more. Every workshop is **I do → We do
→ You do** against the *same artifact*, with a checkpoint after every we-do step
and exactly three TODOs in the you-do. Errors are information, never a verdict
on the student. Nobody gets handed forty new words on night one.

## Deploying

GitHub Pages, serving `main` from the repository root. Nothing to build, so a
push is a deploy. `.nojekyll` is required — without it Pages hides any directory
whose name starts with an underscore, which would make `workshops/_template/`
a 404.

---

i.c.stars\* Milwaukee · RFP Tech Learning
