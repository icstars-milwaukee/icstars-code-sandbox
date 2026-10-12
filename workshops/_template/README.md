# Workshop template — the checklist

You are looking at a **working app with the words taken out.** Open
`index.html` right now: it runs, and the deck drives with arrow keys. Nothing
here is a blank file.

Copy the folder first:

```
workshops/_template/  ->  workshops/0N-your-slug/
```

Then work down this list. It is ordered on purpose.

---

## 1. Write the deck first

`REF-deck.html`. Not because the deck is the deliverable — because writing
twelve slides is what tells you whether you have one workshop or three. The
**I do → We do → You do** passes live here, against the app.

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

## 2. Rewrite the app

`index.html` (markup) and `js/main.js` (the lesson). The whole workshop is these
two files. `js/main.js` shows the shape to keep:

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
- [ ] **It opens and runs off disk.** Double-click `index.html`. If it needs a
      server, it does not belong here
- [ ] **It is finished.** The app is the thing there is to take apart. The
      exercise lives in the deck and in the list below
- [ ] **End `js/main.js` with a BREAK IT ON PURPOSE list** — a few things to
      change and what each teaches when it goes wrong. The template has
      placeholders; replace them with three or four real ones. This is the
      highest-value thing in the file
- [ ] Every item on that list actually does what you claim. Try them
- [ ] The `<h1 class="ics-title">` is what the app calls itself — the live
      editor and the shelf both read it
- [ ] Delete the `.ics-note` box that says "this is the template"

## 3. Build the live editor

`playground.html` is **generated** — don't hand-edit it. From the repo root:

```bash
python tools/build-playground.py 0N-your-slug
```

It copies your app's files into the page, because a browser on a `file://` path
cannot read a folder. Re-run it whenever you change the app, and check it before
review:

```bash
python tools/build-playground.py --check
```

- [ ] It runs the app on load
- [ ] Editing `js/main.js` and pressing Run changes what you see
- [ ] `data-pg-storage` is your slug (the tool sets this)

## 4. Put it on the shelf

One object in `../../js/workshops.js`. Field-by-field notes are in the comment
at the top of that file.

- [ ] `slug` matches your folder name exactly
- [ ] `live: true`, so the card gets its **live editor** chip
- [ ] `hook` says what they **walk out holding**, not what the topic is called
- [ ] `teaches` is five tags at most
- [ ] `status` is `"draft"` — it is not `"ready"` until a cohort has survived it

## 5. Teach it, then come back

- [ ] Taught start to finish, with real people, on the clock
- [ ] Every error anybody actually hit is now on the "When it breaks" slide
- [ ] Anything they broke by accident that taught them something is now on the
      BREAK IT ON PURPOSE list
- [ ] `status` changed to `"ready"`

That last step is the one that matters. `"ready"` means *survived a cohort*,
not *finished writing*.
