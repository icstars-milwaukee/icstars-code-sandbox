# Contributing a workshop

Read this once. The per-workshop checklist lives in
[`workshops/_template/README.md`](workshops/_template/README.md) — that's the
one you work from while building.

---

## The shape of a workshop

Every workshop is **three passes at the same artifact**:

| Pass | Who drives | The rule |
|---|---|---|
| **I do** | instructor | Hands off keyboards. Typing along means debugging instead of watching |
| **We do** | together | Keyboards up, nobody types ahead. A checkpoint after every step |
| **You do** | student | They change the app themselves — the BREAK IT ON PURPOSE list is the starting point |

Not three different topics — the **same thing**, three times, getting more real
each pass. Pass 3 fails the moment it asks for a move they haven't already
watched twice.

A workshop is 30 minutes of guided time. If yours needs 90, it is three
workshops and should be three folders under `workshops/`. The passes live in
the deck; the app stays one finished thing.

## Things that are not up for redesign

These exist so eighteen workshops written by different people still read as one
curriculum. They are also the mistake most new contributors make.

**The palette.** Ink `#161217` · ink-soft `#231C24` · paper `#FAF6F2` · red
`#D6003C` · grey `#9A9095` / `#5C5458`. Segoe UI display, Consolas mono. Every
color is already a token in `css/theme.css`. Do not introduce a sixth color, and
do not hard-code a hex that a token already covers.

**The deck `<style>` block.** The block at the top of every `REF-deck.html` is
copied byte-for-byte from the Week 6 house deck. Don't edit it. Need a new
component? Add a **second** `<style>` block underneath it, built from the same
tokens, and say in your PR what you added.

**Three slide classes.** `.ink`, `.paper`, `.redbg`. That's it.

**The deck chrome.** Brand mark top-left, `.tag` bottom-left, mono `.counter`
bottom-right, red progress `.bar`, fading `.hint`, invisible `.navzone` click
strips, swipe handler, and the `@media print` block that makes `Ctrl+P` produce
one slide per PDF page. All of it comes with the template. Keep it.

**Diagrams are ASCII** inside a `.code` block. Not SVG, not a screenshot.
They stay readable in the PDF and anybody can edit them.

**Narration lives on the slide**, written as `I say: "…"`. There is no
presenter-notes panel on purpose — what you say out loud is part of the deck,
and the next person to teach it needs to see it.

**The theme is shared, not forked.** The app links `../../css/theme.css`. If a
component you need is missing, add it to `theme.css` so the next workshop gets
it too, and say so in your PR. An app-local `css/` is for when the lesson
itself is about CSS.

## The workshop folder IS the app

```
workshops/0N-your-slug/
├── index.html        THE APP
├── js/main.js        THE APP'S CODE
├── REF-deck.html     the deck
└── playground.html   GENERATED
```

Rules for the app:

- **It opens and runs on its own.** Double-click `index.html` and it works, off
  disk, with no server. If it needs a server it does not belong here
- **One `index.html`, one `js/main.js`.** Add a `css/` only if the lesson is
  about CSS. The shared theme is `../../css/theme.css` — link it, never fork it
- **Only the lesson's code.** No score streaks, no personal bests, no loading
  spinners, no keyboard shortcuts, unless one of those IS the lesson. Every
  extra feature is something a student reads past to find the point
- **It is finished and it works.** The app is the thing there is to take apart;
  an app that does not run yet is a worksheet, and the deck already carries the
  exercise
- **The `<h1 class="ics-title">` is what it calls itself** — the live editor and
  the shelf both read it. Write it like the name of a thing, not a topic
- **End `js/main.js` with a BREAK IT ON PURPOSE list** — a few things to change
  and what each one teaches when it goes wrong. Three or four lines. This is the
  single highest-value thing in the file, because it is what turns a working
  example into something a student can interrogate:

```js
/* BREAK IT ON PURPOSE:

   delete  shuffle(choices)   the answer is always the first button.
                              That one line is the whole difficulty.
   delete the first  await    "[object Promise]" instead of a name. The
                              wait never happened, so you printed the
                              waiting.                                  */
```

Where did I do / We do / You do go? Into the **deck**, which is where it was
always taught from. The app stays one working thing, so there is always
something that runs to break. Six folders of half-finished variants was three
copies of the same code and a maintenance bill.

## The live editor

`playground.html` is a full-screen editor over the app: a sidebar you pull files
from, the code in the middle, the running app on the right.

It is **generated** — you never hand-write or hand-edit it:

```bash
python tools/build-playground.py                # build all
python tools/build-playground.py 0N-your-slug   # build yours
python tools/build-playground.py --check        # fail if stale
```

A browser on a `file://` path cannot read a folder, so the page cannot discover
your files at runtime. The tool copies every text file in the workshop folder —
except the deck, the README and `playground.html` itself — into plain-text
blocks it can read. That is one generated file derived from the real app, rather
than a second copy of the code to keep in sync.

Re-run it after you touch the app, and run `--check` before you ask for review.

Two details if you ever read the generated file: each block is a
`<script type="text/plain" data-pg-file="...">`, so angle brackets and quotes
survive as typed; and a block that must *contain* the text `</script>` has it
written as `<\/script>`, because the HTML parser ends a script element at the
first one regardless of `type`. The tool handles that, and `js/preview-core.js`
puts the slash back.

## Writing rules that are worth more than they look

- **No build step, by default.** No npm, no bundler, no framework. The student
  must be able to open the file and see it work, and to be handed a zip offline.
  Workshop 01 holds this line completely and it is still the target.

  **If a workshop has to break it**, say so on the card and in the README's
  needs-table, and pick one of two shapes.

  *Still runs off disk:* load the library from a CDN as a plain `<script>` - a
  browser on a `file://` path refuses to load a *local* module, so `import` is
  not available to you. Workshop 03 is this shape, and it keeps its live editor.

  *A real npm project:* only when the toolchain IS the subject. Workshop 04 is a
  real Vite app, because you cannot teach what `npm install` is for inside a
  folder that never needs it. Such a folder has a `package.json`, which means
  `build-playground.py` skips it, so the card needs `live: false` and a
  `deck`. Do not reach for this shape to avoid writing plain JavaScript.
- **No signup walls, by default.** Free, no-key sample APIs. A login screen on
  night one costs you half the room. [PokeAPI](https://pokeapi.co/) and
  [JSONPlaceholder](https://jsonplaceholder.typicode.com/) are known-good.
  Workshop 02 is the exception - it queries the real Cycle 21 gateway, so it
  needs a team password. Anything touching client data earns that exception;
  nothing else does, and this repo is public.
- **Check your BREAK IT list.** Every entry claims a specific thing happens.
  Run each one and confirm it does. Two of workshop 04's entries were wrong on
  the first draft - the error messages did not match - and a list that promises
  the wrong error is worse than no list at all
- **Four words of new vocabulary, maximum.** People quit this subject because
  somebody handed them forty words on night one
- **One honest number early.** "Three lines." "Two files." Then say that
  everything else is decoration, and make that true
- **Paste real output.** Every `THE SCREEN SAYS:` block is copied from a run
  you actually did. Students compare character by character and they will
  catch you
- **Break it on purpose while they watch.** Meet the 404 together, in company,
  not alone at 11pm when it feels like proof they can't do this
- **An error is information, never a verdict.** Pre-empt the four errors you
  have genuinely watched people hit, on the "When it breaks" slide, with the
  exact text on the left and plain English on the right
- **Never let the page die silently.** A page with unfinished TODOs must still
  render and say which TODO to go do. "Nothing happened" is the worst error
  message there is
- **Say STUCK.** It's in every deck because it has to be said out loud by an
  instructor before a room believes it

## Statuses

In `js/workshops.js`:

- `"soon"` — the folder exists, the content doesn't. Renders a dashed card with
  nothing to click
- `"draft"` — written, opens, runs. Nobody has taught it to a live cohort
- `"ready"` — **survived a cohort.** Not "finished writing"

Don't skip `draft`. The gap between "it works on my machine" and "it works with
eleven people on hotel wifi" is where every workshop problem lives.

## Pull requests

Name the branch after the workshop: `workshop/07-state-and-props`.

In the PR body, three lines:

1. What the student walks out holding
2. How long it ran when you timed it
3. Anything you added to the shared `theme.css`, and why it belongs there

Then, before you request review, open these yourself:

- [ ] `index.html` at the repo root — your card is on the shelf and its links work
- [ ] Your `REF-deck.html` — arrows drive it, `Ctrl+P` gives clean pages
- [ ] **Your app, opened directly off disk** — double-clicked, not served
- [ ] Your `playground.html` — it runs on load, and Run works after an edit
- [ ] Every item on your BREAK IT ON PURPOSE list actually does what it says
- [ ] `python tools/build-playground.py --check` is clean

---

i.c.stars\* Milwaukee · RFP Tech Learning
