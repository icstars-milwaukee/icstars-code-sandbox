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
| **You do** | student | Exactly three TODOs in a file that already runs |

Not three different topics — the **same thing**, three times, getting more real
each pass. Pass 3 fails the moment it asks for a move they haven't already
watched twice.

A workshop is 30 minutes of guided time. If yours needs 90, it is three
workshops and should be three folders.

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

**The theme is shared, not forked.** Workshop pages link
`../../css/theme.css`. If a component you need is missing, add it to
`theme.css` so the next workshop gets it too. A workshop-local stylesheet is
for genuinely one-off things (see `workshops/01-hello-api/css/game.css`).

## The two live-code surfaces

Both run on one engine, `js/preview-core.js`. They exist because the first ten
minutes of a workshop are the ones you lose — to a file path, a wrong folder, an
editor nobody has opened before. These remove that and leave the lesson.

| | Where | What it holds |
|---|---|---|
| **Sandbox** | every step page | one file, with the blanks still in it |
| **Playground** | one per workshop | the whole file tree, already working |

The playground is the "break it and see" surface: folders down the left, click
one and it runs, click a file and it opens. It is **generated** from the
workshop's own pages — you never hand-write it:

```bash
python tools/build-playground.py                # build all
python tools/build-playground.py 0N-your-slug   # build yours
python tools/build-playground.py --check        # fail if stale
```

Each runnable folder comes from a page that already exists: a sandbox step page
becomes an `index.html` built from its `data-sb-html` block plus its starter
code, and a plain runnable page (a finished build, a homework page) comes in
whole with the `js/` and `css/` files it references. Project order follows the
order your workshop's `index.html` links them in, so fix the order there.

Re-run the tool after you touch a step page, and run `--check` before you ask
for review.

## The sandbox

Code on the left, the running page on the right, a console underneath.

You write three blocks of plain text; `js/sandbox.js` builds the rest.

```html
<div data-sb data-sb-file="js/step-1.js" data-sb-storage="0N-your-slug/step-1">

  <script type="text/plain" data-sb-html>
    <div class="ics-out" id="output">Nothing yet.</div>
  </script>

  <script type="text/plain" data-sb-js>
    // the starter code the student sees
  </script>

  <script type="text/plain" data-sb-solution>
    // the answer. Omit this block and the Solution button disappears.
  </script>

</div>

<script src="../../js/preview-core.js"></script>
<script src="../../js/sandbox.js"></script>
```

Link `css/sandbox.css` in the `<head>` alongside `theme.css`, load
`js/preview-core.js` **before** `js/sandbox.js`, and that's the whole
integration.

- **`type="text/plain"`** means the browser neither runs nor parses the block,
  so angle brackets and quotes survive exactly as typed
- **`data-sb-storage`** must be unique per sandbox — it is the localStorage key
  that keeps a student's work across a refresh. Use `your-slug/step-N`. If you
  copy the template and forget to change it, two workshops fight over one key
- **Indent the blocks** to match your markup; the common indent is stripped
- **The starter must run.** Every run rebuilds the preview from scratch, so a
  student never debugs leftover state — but a starter that throws on load
  teaches nothing. Have it say what to go do instead
- **Errors report the student's own line number**, counted from line 1 of their
  code. Don't defeat that by wrapping their code in anything
- The `data-sb-html` block is shown under the editor behind a "the markup this
  code runs against" toggle, because *"where does `sprite` come from?"* is the
  most common question at a sandbox
- A block that must *contain* the text `</script>` writes it as `<\/script>` —
  the HTML parser ends a `<script>` element at the first one regardless of
  `type`. That is the only escape in the format, and the generator handles it

The sandbox is not a replacement for VS Code. Keep the same code on disk in
`js/`, and say so on the page — students need to end up editing real files.

## Writing rules that are worth more than they look

- **No build step.** No npm, no bundler, no framework. The student must be able
  to open the file and see it work, and to be handed a zip offline
- **No signup walls.** Free, no-key sample APIs. A login screen on night one
  costs you half the room. [PokeAPI](https://pokeapi.co/) and
  [JSONPlaceholder](https://jsonplaceholder.typicode.com/) are known-good
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
- [ ] Your `step-3-you-do.html` — runs with the TODOs unfinished and says which one to do
- [ ] Your `step-3-you-do-solution.html` — actually plays through
- [ ] Your `playground.html` — every folder runs when clicked
- [ ] `python tools/build-playground.py --check` is clean
- [ ] The whole folder from a `file://` path, not just a local server

---

i.c.stars\* Milwaukee · RFP Tech Learning
