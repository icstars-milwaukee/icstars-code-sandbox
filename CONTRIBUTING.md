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
- [ ] The whole folder from a `file://` path, not just a local server

---

i.c.stars\* Milwaukee · RFP Tech Learning
