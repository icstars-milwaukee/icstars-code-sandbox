# i.c.stars\* Code Sandbox

A growing library of guided tech learning workshops from **i.c.stars Milwaukee**.

**Live site:** https://icstars-milwaukee.github.io/icstars-code-sandbox/

Every workshop in here is three things: a **deck you can present**, a **live
editor** the student types real code into, and a **finished build** to compare
against. No install, no npm, no build step, no accounts. Each one ends with the
student holding something that works.

Nobody installs anything to do a workshop. There are two live-code surfaces:

- **The sandbox** — on every step page. One file, with the blanks still in it:
  editor on the left, the running page on the right, a console underneath.
- **The playground** — one per workshop (`playground.html`). The whole file tree
  down the left side, already working. Click a folder and it runs; click a file
  and it opens; delete a line and press Run to find out what it was holding up.
  **Reset all** puts everything back. Open it from the red **live editor** chip
  on any card on the front page.

The same code sits on disk in each workshop's `js/` folder for anyone working in
VS Code — that's still where students should end up. The editors exist so the
first ten minutes of a session go to the lesson instead of to a file path.

---

## What's on the shelf

| # | Workshop | Track | Time | Status |
|---|---|---|---|---|
| 01 | [Hello, API](workshops/01-hello-api/) — a Pokémon guessing game built out of `fetch` | Front-end | 30 min | ready · live editor |

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
css/sandbox.css         the one-file editor
css/playground.css      the file tree
css/library.css         front-door-only styling
js/workshops.js         THE CATALOG — add your workshop here
js/preview-core.js      the shared engine — no dependencies
js/sandbox.js           one editor, one file  (step pages)
js/playground.js        a file tree, many files (per workshop)
tools/build-playground.py   regenerates each playground.html

workshops/_template/    copy this to start a new one (it runs as-is)
workshops/01-hello-api/ fetch, JSON, async/await, DOM
```

## Adding a workshop

Copy `workshops/_template/` and work through the checklist in its `README.md`.
The short version:

1. Copy the template folder to `workshops/0N-your-slug/`
2. Rewrite `REF-deck.html` — **don't touch its `<style>` block**
3. Fill in the three passes (I do → We do → You do) and the answer key. Each
   step page is a sandbox: a starter block and an answer block, as plain text
4. Run `python tools/build-playground.py` — it builds your `playground.html`
5. Add one object to `js/workshops.js`, with `live: true`
6. Teach it to real people, then set `status: "ready"`

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
push is a deploy. `tools/build-playground.py` is an *authoring* tool, not part
of serving the site — it writes a file you commit. Run it with `--check` in
review to catch a `playground.html` that has gone stale:

```bash
python tools/build-playground.py --check   # exits 1 if any is out of date
```
 `.nojekyll` is required — without it Pages hides any directory
whose name starts with an underscore, which would make `workshops/_template/`
a 404.

---

i.c.stars\* Milwaukee · RFP Tech Learning
