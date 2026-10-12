# Workshop template — the checklist

You are looking at a **working workshop with the words taken out.** Open
`index.html` right now: all four project folders run, the deck drives with arrow
keys, and `projects/3-the-real-thing-solution/` plays a round. Nothing here is a
blank file.

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

## 2. Fill in the project folders

```
projects/
├── 1-smallest-version/         I DO
├── 2-next-layer/               WE DO
├── 3-the-real-thing/           YOU DO · exactly 3 TODOs
└── 3-the-real-thing-solution/  the answer key
```

Each is an `index.html` (markup only) and a `js/main.js` (the lesson). Each one
**opens and runs on its own** — double-click `index.html` and it works. The
placeholder mechanic (pick one at random, hide it, guess it) is there so that is
true before you touch anything. Replace the guts, keep the shape.

`js/main.js` in `1-smallest-version/` shows the shape every project uses:

| Block | What goes in it |
|---|---|
| 1. the source | a URL, a list, a file — where the data comes from |
| 2. the page | every `getElementById`, once, at the top |
| 3. the work | **the lines that ARE the lesson.** Over ten and you have two workshops |
| 4. wire it up | the listener, and a line saying what the page is waiting for |

Rules, in order of how much they matter:

- [ ] **Only the lesson's code.** No score streaks, no personal bests, no
      loading spinners, unless one of those IS your lesson. Every extra feature
      is something a student reads past to find the point
- [ ] **The you-do folder runs with all three TODOs unfinished**, and says in
      plain English which one to go do. A white screen plus a console error is
      how you lose somebody for the night
- [ ] **Exactly three TODOs.** Not two, not five. Each 1–4 lines of typing, and
      each a move they watched twice already tonight
- [ ] **The answer-key folder plays through.** It is the test — open it and play
      a round before you ever teach from this folder
- [ ] **Every `js/main.js` ends with a BREAK IT ON PURPOSE list** — a few things
      to change and what each teaches when it goes wrong. The template has
      placeholders; replace them with three real ones for your lesson. This is
      the highest-value thing in the file
- [ ] One `CHECKPOINT` comment per stop in `2-next-layer/`, each describing the
      screen in one sentence
- [ ] The `<title>` of each `index.html` is the label the playground shows.
      Write it like one: `Step 2 · We do — The Next Layer`
- [ ] You did your own TODOs cold, in under nine minutes, from your own
      instructions. If you couldn't, they're too big

## 3. Rewrite the landing page

`index.html` — the title, the links, and the source tree so it matches the
folders that are actually there. Keep the `../../css/theme.css` link; **do not
fork the theme.** If a component is missing from it, add it to `theme.css` and
say so in your PR, so the next workshop gets it too.

- [ ] Title, header, and the one-line description
- [ ] The project links point at your folder names
- [ ] The source tree matches reality

## 4. Build the playground

`playground.html` is **generated** — don't hand-edit it. From the repo root:

```bash
python tools/build-playground.py 0N-your-slug
```

It copies every file under `projects/` into the page, because a browser on a
`file://` path cannot read a folder. Re-run it whenever you change anything in
`projects/`, and check it before review:

```bash
python tools/build-playground.py --check
```

- [ ] Every folder in the tree runs when you click it
- [ ] The folder order is your teaching order (it sorts on the number prefix,
      which is why they are numbered)
- [ ] `data-pg-storage` is your slug, not `_template` (the tool sets this)

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
