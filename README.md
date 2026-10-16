# i.c.stars\* Code Sandbox

A growing library of guided tech learning workshops from **i.c.stars Milwaukee**.

**Live site:** https://icstars-milwaukee.github.io/icstars-code-sandbox/

A workshop here is **one app that already runs**, sometimes with a deck beside
it. Small enough to read in a sitting, and nothing to install to start.

The house default is no server, no npm, no build step and no accounts — 01 holds
that line completely. Where a workshop has to break it, the shelf says so and
the workshop says why:

| Workshop | Needs |
|---|---|
| 01 Hello, API | nothing. Double-click it. |
| 02 Molson Data | a team password (it queries the real Cycle 21 gateway) |
| 03 The Honest Dashboard | the network, for React from a CDN. No account, no data. |
| 04 The Build Step | **npm.** It is a real Vite project — one click in CodeSandbox, or `npm install && npm run dev`. |

---

## What's on the shelf

| # | Workshop | Track | Time | Status |
|---|---|---|---|---|
| 01 | [Who's That Pokemon?](workshops/01-hello-api/) — a guessing game built out of `fetch` | Front-end | 30 min | ready · live editor |
| 02 | [Molson Data](workshops/02-molson-data/) — one `SELECT` to the Cycle 21 gateway, rows on the page | Data | 30 min | draft · live editor |
| 03 | [The Honest Dashboard](workshops/03-honest-dashboard/) — rows in, a readable screen out, and an answer box that refuses | Front-end | 45 min | draft · live editor |
| 04 | [The Build Step](workshops/04-the-build-step/) — a real Vite app: Hello World → Profile → Data | Front-end | 60 min | draft · deck · **CodeSandbox** |

The front page builds this list from [`js/workshops.js`](js/workshops.js), which
is the single file you edit to add a workshop.

## The shape of a workshop

```
workshops/01-hello-api/
├── index.html        THE APP
├── js/main.js        THE APP'S CODE
├── css/*.css         only if the lesson needs its own styles
├── REF-deck.html     the deck — optional, self-contained, arrow keys drive it
└── playground.html   GENERATED — the app in a live editor
```

Only 01 has a deck so far. A workshop without one is still a workshop; set
`deck: null` on its card.

**The workshop folder is the app.** Double-click `index.html` and it runs, off
disk, no server. That is the source of truth and what students end up editing.

Only the lesson's code belongs in it. No score streaks, no personal bests, no
loading spinners, unless one of those *is* the lesson — every extra feature is
something a student reads past to find the point.

`js/main.js` ends with a **BREAK IT ON PURPOSE** list: a few things to change,
and what each one teaches when it goes wrong. Delete an `await` and you get
`[object Promise]` — you printed the waiting instead of the thing. Better than a
paragraph about promises, and it costs one keystroke.

## One workshop is a real npm project

**04 The Build Step** is the exception, and deliberately so: you cannot teach what
`npm install` is for inside a folder that never needs it. It is a real Vite React
app — `index.html`, `package.json`, `vite.config.js`, and `src/` with
`pages/`, `components/` and `api/` in it.

That means **no live editor for that one** — a playground inlines files, and a
Vite project has to be bundled first. Its card carries `live: false` and a
`deck`, and `tools/build-playground.py` skips any folder containing a
`package.json` and says so:

```
04-the-build-step      skipped (npm project - opens in CodeSandbox)
```

### Opening it in CodeSandbox

The card does this for you, but the URL is worth knowing:

```
https://codesandbox.io/p/github/icstars-milwaukee/icstars-code-sandbox/main
  ?file=/workshops/04-the-build-step/src/App.jsx
```

That is the **documented** import form — the whole repo, as a Devbox, which is
what a Vite project needs. Three things then happen on their own:
`/.codesandbox/tasks.json` installs workshop 04, starts its dev server on
5173, and `?file=` opens `App.jsx` so you land on the right file.

You get the whole library in the file tree, not just the one folder. That is a
fair trade for a link that is guaranteed to work.

> If you ever want workshop 04 to open **on its own**, with nothing else in the
> tree, it needs to be its own repository — CodeSandbox imports a repo, not a
> subdirectory of one. Worth doing if the extra folders ever confuse a room;
> not worth doing before then.

Or skip CodeSandbox entirely: `npm install && npm run dev` inside
`workshops/04-the-build-step`.

## The live editor

`playground.html` is a full-screen editor over the app: a sidebar you pull files
from, the code in the middle, the running app on the right, a console under it.
The sidebar searches both file names and file contents. Every run rebuilds the
preview from scratch, errors land in the console with the line number from *your*
line 1, edits are kept per file across a refresh, and **Reset all** puts
everything back.

It is generated, because a browser on a `file://` path cannot read a folder — so
the page cannot discover the app's files at runtime.
`tools/build-playground.py` copies them in:

```bash
python tools/build-playground.py              # build every workshop
python tools/build-playground.py 01-hello-api # build one
python tools/build-playground.py --check      # exits 1 if any is stale
```

That is one generated file, derived from the real app — not a second copy of the
code to maintain. **Re-run it after you change the app.**

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
css/playground.css      the live editor
css/library.css         front-door-only styling

js/workshops.js         THE CATALOG — add your workshop here
js/preview-core.js      the engine — no dependencies
js/playground.js        the sidebar, editor and console

tools/build-playground.py   regenerates each playground.html

workshops/_template/            copy this to start a new one (it runs as-is)
workshops/01-hello-api/         fetch, JSON, async/await, DOM
workshops/02-molson-data/       SELECT, query params, API tokens
workshops/03-honest-dashboard/  React from a CDN, chart decisions, refusals
workshops/04-the-build-step/    a real Vite app — JSX, components, pages, APIs
```

## Adding a workshop

Copy `workshops/_template/` and work through the checklist in its `README.md`.
The short version:

1. Copy the template folder to `workshops/0N-your-slug/`
2. Rewrite the app: `index.html` and `js/main.js`, lesson code only
3. End `js/main.js` with a BREAK IT ON PURPOSE list — and **check every claim in
   it actually happens.** A list that promises the wrong error message is worse
   than no list
4. Keep or delete `REF-deck.html`. If you keep it, **don't touch its `<style>`
   block**; if you delete it, set `deck: null` on the card
5. Run `python tools/build-playground.py 0N-your-slug`
6. Add one object to `js/workshops.js`, with `live: true`
7. Name the `DEL-` it unblocks in the RFP crosswalk — a workshop that can't name
   its deliverable is a topic, and topics don't go on the shelf
8. Teach it to real people, then set `status: "ready"`

Full rules, including the parts of the house style that are not up for
redesign, are in [CONTRIBUTING.md](CONTRIBUTING.md).

## House style, in one paragraph

Ink `#161217`, paper `#FAF6F2`, red `#D6003C`. Segoe UI for display, Consolas
for code. Three slide backgrounds and no more. The deck runs **I do → We do →
You do** against the app; the app itself stays finished and small, so there is
always something that works to take apart. Errors are information, never a
verdict on the student. Nobody gets handed forty new words on night one.

## Deploying

GitHub Pages, serving `main` from the repository root. Nothing to build, so a
push is a deploy. `.nojekyll` is required — without it Pages hides any directory
whose name starts with an underscore, which would make `workshops/_template/`
a 404.

`tools/build-playground.py` is an *authoring* tool, not part of serving the
site. Run it with `--check` in review so a stale `playground.html` cannot slip
through.

## Where these fit in the cycle

Each workshop exists to unblock a specific RFP deliverable, not to cover a topic.
The crosswalk — every `DEL-` against the workshop and live editor that serves it,
plus the gaps still to build — lives with the RFP repos as
`GUIDED-LEARNING-MAP.md`.

Short version as of now: 01 and 02 serve week 6–7's data and API work, 03 and 04
serve week 8's React prototype (`DEL-1023`). Weeks 9–12 have no workshop yet.

---

i.c.stars\* Milwaukee · RFP Tech Learning
