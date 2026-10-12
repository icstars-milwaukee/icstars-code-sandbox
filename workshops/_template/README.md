# Workshop template — the checklist

You are looking at a **working workshop with the words taken out.** Open
`index.html` right now: every page runs, the deck drives with arrow keys, and
`step-3-you-do-solution.html` plays a round. Nothing here is a blank file.

Copy the folder first:

```
workshops/_template/  ->  workshops/0N-your-slug/
```

Then work down this list. It is ordered on purpose.

---

## 1. Write the deck first

`REF-deck.html`. Not because the deck is the deliverable — because writing
twelve slides is what tells you whether you have one workshop or three.

Every placeholder is in CAPS and every slide has an HTML comment above it
saying what belongs there. Work top to bottom.

**Two things are not up for redesign:**

- The `<style>` block at the top of the file is the house palette, copied
  byte-for-byte from the Week 6 deck. Do not edit it, do not add colors to it.
  Need something new? Add a **second** `<style>` block below it, using the
  existing tokens (`var(--red)`, `var(--ink)`, …).
- Three slide classes exist: `.ink`, `.paper`, `.redbg`. That's the whole
  vocabulary. A fourth background is a different school's deck.

Check as you go:

- [ ] The minutes on slide 2 add up to the number on slide 1, and you have
      actually run a clock against it
- [ ] Slide 3 is one honest number, and the words "everything else is decoration"
      are still true after you wrote the rest
- [ ] Slide 4 has **four** words. Four. Every fifth word is a person who quits
- [ ] Every code block uses `I TYPE:` / `YOU TYPE:` / `THE SCREEN SAYS:` and the
      screen output is pasted from a **real run**, not from memory
- [ ] Narration lives on the slide as `I say: "…"`. There is no presenter-notes
      panel and that's deliberate — what you say is part of the deck
- [ ] Every We-do step ends in `Checkpoint: … Thumbs up.`
- [ ] Diagrams are ASCII inside a `.code` block. Not SVG, not an image
- [ ] `Ctrl+P` gives you one slide per PDF page with nothing cut off

## 2. Fill in the three passes

Each step page carries a **live sandbox**: an editor, a running preview, and a
console. The code lives in the page as two blocks of plain text — the starter
the student sees, and the answer behind the Solution button:

```html
<script type="text/plain" data-sb-js>        ... starter ...  </script>
<script type="text/plain" data-sb-solution>  ... answer  ...  </script>
```

**Change `data-sb-storage` on every sandbox** from `TEMPLATE-rename-me/step-N`
to `your-slug/step-N`. It's the key a student's work is saved under; leave it
and your workshop fights the template for the same slot. Same for
`data-pg-storage` in `playground.html` — though the tool sets that one for you.

The placeholder mechanic (pick one at random, hide it, guess it) is there so
everything runs before you touch it. Replace the guts, keep the shape:

| Page / file | Pass | Rule |
|---|---|---|
| `step-1-i-do.html` + `js/step-1.js` | I do | The smallest thing that works. Over ten lines means two workshops |
| `step-2-we-do.html` + `js/step-2.js` | We do | **One** new idea. A `CHECKPOINT` comment at every stop |
| `step-3-you-do.html` + `js/step-3.js` | You do | **Exactly three** TODOs, each 1–4 lines of typing |
| `step-3-you-do-solution.html` + `js/step-3-solution.js` | key | Must actually play through. This is the test |

Keep the `js/` files matching the blocks in the pages. Students should end up
editing real files in VS Code; the sandbox is there so night one isn't spent on
file paths. Full sandbox contract is in the root `CONTRIBUTING.md`.

- [ ] The step-3 starter still runs with all three TODOs unfinished, and says in
      plain English which one to go do. A white screen plus a console error is
      how you lose somebody for the night
- [ ] Every TODO is a move they watched twice already this session
- [ ] You did your own TODOs cold, in the sandbox, in under nine minutes, from
      your own instructions. If you couldn't, they're too big
- [ ] `data-sb-storage` renamed on all four pages
- [ ] Every id your code reaches for exists in that page's `data-sb-html` block

## 3. Rewrite the pages

`index.html` and the four step pages. Markup only — the logic stays in `js/`.
Keep the `../../css/theme.css` link; **do not fork the theme.** If a component
is missing from it, add the component to `theme.css` and say so in your PR, so
the next workshop gets it too.

- [ ] Titles, headers and the one-line description on every page
- [ ] The source tree on `index.html` matches the files that are actually there
- [ ] The breadcrumb at the top of each page points at your `index.html`

## 4. Build the playground

`playground.html` is **generated** — don't hand-edit it. From the repo root:

```bash
python tools/build-playground.py 0N-your-slug
```

It reads your step pages and writes the file tree: one runnable folder per page,
built from the blocks you already wrote. Re-run it whenever you change a step
page, and check it before review:

```bash
python tools/build-playground.py --check
```

- [ ] Every folder in the tree runs when you click it
- [ ] The folder order matches your teaching order (it follows the link order in
      your `index.html` — fix it there, not in the tool)

## 5. Put it on the shelf

One object in `../../js/workshops.js`. Field-by-field notes are in the comment
at the top of that file.

- [ ] `slug` matches your folder name exactly
- [ ] `live: true`, so the card gets its **live editor** chip
- [ ] `hook` says what they **walk out holding**, not what the topic is called
- [ ] `teaches` is five tags at most
- [ ] `status` is `"draft"` — it is not `"ready"` until a cohort has survived it

## 6. Teach it, then come back

- [ ] Taught start to finish, with real people, on the clock
- [ ] Every error anybody actually hit is now on the "When it breaks" slide
- [ ] `status` changed to `"ready"`

That last step is the one that matters. `"ready"` means *survived a cohort*,
not *finished writing*.
