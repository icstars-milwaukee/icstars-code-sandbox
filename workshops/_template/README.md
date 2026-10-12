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

The placeholder mechanic (pick one at random, hide it, guess it) is there so
the files run. Replace the guts, keep the shape:

| File | Pass | Rule |
|---|---|---|
| `js/step-1.js` | I do | The smallest thing that works. Over ten lines means two workshops |
| `js/step-2.js` | We do | **One** new idea. A `CHECKPOINT` comment at every stop |
| `js/step-3.js` | You do | **Exactly three** TODOs, each 1–4 lines of typing |
| `js/step-3-solution.js` | key | Must actually run. This file is the test |

- [ ] `step-3.js` still runs with all three TODOs unfinished, and says in plain
      English which one to go do. A white screen plus a console error is how you
      lose somebody for the night
- [ ] Every TODO is a move they watched twice already this session
- [ ] You did your own TODOs cold, in under nine minutes, from your own
      instructions. If you couldn't, they're too big

## 3. Rewrite the pages

`index.html` and the four step pages. Markup only — the logic stays in `js/`.
Keep the `../../css/theme.css` link; **do not fork the theme.** If a component
is missing from it, add the component to `theme.css` and say so in your PR, so
the next workshop gets it too.

- [ ] Titles, headers and the one-line description on every page
- [ ] The source tree on `index.html` matches the files that are actually there
- [ ] The breadcrumb at the top of each page points at your `index.html`

## 4. Put it on the shelf

One object in `../../js/workshops.js`. Field-by-field notes are in the comment
at the top of that file.

- [ ] `slug` matches your folder name exactly
- [ ] `hook` says what they **walk out holding**, not what the topic is called
- [ ] `teaches` is five tags at most
- [ ] `status` is `"draft"` — it is not `"ready"` until a cohort has survived it

## 5. Teach it, then come back

- [ ] Taught start to finish, with real people, on the clock
- [ ] Every error anybody actually hit is now on the "When it breaks" slide
- [ ] `status` changed to `"ready"`

That last step is the one that matters. `"ready"` means *survived a cohort*,
not *finished writing*.
