# i.c.stars\* Code Sandbox

A growing library of guided tech learning workshops from **i.c.stars Milwaukee**.

**Live site:** https://icstars-milwaukee.github.io/icstars-code-sandbox/

A workshop here is two things: a **deck you can present**, and a handful of
**project folders that already run**. One folder per pass, each small enough to
read in a sitting. No server, no npm, no build step, no accounts.

---

## What's on the shelf

| # | Workshop | Track | Time | Status |
|---|---|---|---|---|
| 01 | [Hello, API](workshops/01-hello-api/) — a Pokémon guessing game built out of `fetch` | Front-end | 30 min | ready · live editor |

The front page builds this list from [`js/workshops.js`](js/workshops.js), which
is the single file you edit to add a workshop.

## The shape of a workshop

```
workshops/01-hello-api/
├── index.html          the landing page
├── REF-deck.html       the deck — self-contained, arrow keys drive it
├── playground.html     GENERATED — the projects in a live editor
└── projects/
    ├── 1-one-pokemon/          I DO    · index.html + js/main.js
    ├── 2-the-mystery/          WE DO
    ├── 3-the-game/             YOU DO  · exactly 3 TODOs
    ├── 3-the-game-solution/    the answer key, and it plays
    ├── 4-another-api/          homework
    └── 4-another-api-solution/
```

**The project folders are the workshop.** Each one opens and runs on its own —
double-click `index.html` and it works. That is the source of truth, and it is
what students should end up editing in VS Code.

Each `js/main.js` ends with a short **BREAK IT ON PURPOSE** list: a few things
to change, and what each one teaches when it goes wrong. Delete an `await` and
you get `[object Promise]` — you printed the waiting instead of the thing.
Better than a paragraph about promises, and it costs one keystroke.

## The playground

`playground.html` puts a workshop's folders in a tree with an editor and a live
preview. Click a folder and it runs; click a file and it opens; edit and press
**Run**. Every run rebuilds the preview from scratch, errors land in the console
with the line number from *your* line 1, edits are kept per file across a
refresh, and **Reset all** puts everything back.

It is generated, because a browser on a `file://` path cannot read a folder — so
the page cannot discover those files at runtime.
`tools/build-playground.py` copies them in:

```bash
python tools/build-playground.py              # build every workshop
python tools/build-playground.py 01-hello-api # build one
python tools/build-playground.py --check      # exits 1 if any is stale
```

That is one generated file, derived from the real folders — not a second copy
of the code to maintain. **Re-run it after you change anything under
`projects/`.**

## Running it locally

Clone it and open `index.html`. That's the whole setup.

```bash
git clone https://github.com/icstars-milwaukee/icstars-code-sandbox.git
cd icstars-code-sandbox
start index.html        # Windows.  macOS: open index.html
```

Every path is relative, so the site works identically from a `file://` URL and
from GitHub Pages. Students can be handed a zip. Note that Windows often
associates `.html` with the legacy `htmlfile` handler rather than a browser — if
double-clicking does nothing, drag the file onto Chrome.

## Layout

```
index.html              the front door
CONTRIBUTING.md         how to add a workshop, and the house rules
.nojekyll               keeps GitHub Pages from hiding workshops/_template/

css/theme.css           the house theme — shared by every workshop
css/playground.css      the file tree, editor and console
css/library.css         front-door-only styling

js/workshops.js         THE CATALOG — add your workshop here
js/preview-core.js      the engine — no dependencies
js/playground.js        the file tree, built from the paths

tools/build-playground.py   regenerates each playground.html

workshops/_template/    copy this to start a new one (it runs as-is)
workshops/01-hello-api/ fetch, JSON, async/await, DOM
```

## Adding a workshop

Copy `workshops/_template/` and work through the checklist in its `README.md`.
The short version:

1. Copy the template folder to `workshops/0N-your-slug/`
2. Rewrite `REF-deck.html` — **don't touch its `<style>` block**
3. Fill in the `projects/` folders (I do → We do → You do, plus the answer key)
4. Run `python tools/build-playground.py 0N-your-slug`
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
push is a deploy. `.nojekyll` is required — without it Pages hides any directory
whose name starts with an underscore, which would make `workshops/_template/`
a 404.

`tools/build-playground.py` is an *authoring* tool, not part of serving the
site. Run it with `--check` in review so a stale `playground.html` cannot slip
through.

---

i.c.stars\* Milwaukee · RFP Tech Learning
