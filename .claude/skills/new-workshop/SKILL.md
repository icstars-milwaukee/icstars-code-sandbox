---
name: new-workshop
description: Create a new guided workshop in the i.c.stars Code Sandbox — scaffold workshops/0N-slug/ from the template, write the app and its deck, generate the live editor, and add it to the shelf. Use when asked to add, create, build or scaffold a workshop, lesson, or tutorial in this repo.
---

# Create a workshop in the Code Sandbox

A workshop here is **two things**: a deck you can present, and **one app that
already runs**. Nothing else. One folder:

```
workshops/0N-your-slug/
├── index.html        THE APP
├── js/main.js        THE APP'S CODE
├── REF-deck.html     the deck
└── playground.html   GENERATED — never hand-edit
```

Read `CONTRIBUTING.md` and `workshops/_template/README.md` before you start.
They are the authority; this file is the procedure.

---

## 1. Find out what the workshop is actually about

Before writing a line, settle these. Ask the user if any is unclear — guessing
here produces a workshop nobody can teach:

- **What does the student walk out holding?** A working *thing*, named. Not a
  topic. "A guessing game built out of data you never typed", not "fetch".
- **What is the data source?** Get the real endpoint. **Verify it yourself** —
  fetch the docs or the OpenAPI spec, and `curl -i` one request to confirm the
  response shape, the auth scheme, and that
  `Access-Control-Allow-Origin` is present. A workshop whose API blocks
  `file://` requests is dead on arrival, and you cannot learn that from memory.
- **What are the four words** of new vocabulary? Four. Every fifth word is a
  person who quits.
- **Does it need a key or a password?** Prefer sources that don't. If it does,
  the app must take it as an input the student types — never hardcode a
  credential, never persist one.

## 2. Scaffold

```bash
cp -r workshops/_template workshops/0N-your-slug
```

Number it for the shelf, not the calendar: `02-`, `03-`. The slug must match
the `slug` you put in the catalog later.

## 3. Write the deck

`REF-deck.html`. Twelve slides, already laid out, every placeholder in CAPS
with an HTML comment above it saying what belongs there.

**Not up for redesign:**

- The `<style>` block at the top is the house palette, copied byte-for-byte
  from the Week 6 deck. Do not edit it. Need a new component? Add a **second**
  `<style>` block below it using the existing tokens.
- Three slide classes: `.ink`, `.paper`, `.redbg`. That is the whole vocabulary.
- Diagrams are ASCII inside a `.code` block. Not SVG, not an image.
- Narration lives on the slide as `I say: "…"`. There is no notes panel.

Every `THE SCREEN SAYS:` block must be **pasted from a real run**. If you
cannot run it — no credential, no data — do not invent output. Leave the deck
unwritten, say so, and set `deck: null` in the catalog. A fabricated screen is
worse than a missing slide, because the student will compare character by
character and conclude they broke it.

## 4. Write the app

`index.html` is markup only. `js/main.js` is the lesson, in four blocks:

| Block | What goes in it |
|---|---|
| 1. the source | the URL, the list, the file |
| 2. the page | every `getElementById`, once, at the top |
| 3. the work | **the lines that ARE the lesson.** Past ten and it is two workshops |
| 4. wire it up | the listener, and a line saying what the page is waiting for |

Hard rules:

- **Only the lesson's code.** No score streaks, no personal bests, no loading
  spinners, no keyboard shortcuts, unless one of those IS the lesson. Every
  extra feature is something a student reads past to find the point.
- **It opens and runs off disk.** Double-click `index.html`. No server, no npm,
  no build step, no CDN.
- **It links `../../css/theme.css`** and never forks it. If a component is
  missing, add it to `theme.css` and say so.
- **Never die silently.** Every failure path puts a sentence on the page.
  "Nothing happened" is the worst error message there is.
- **The `<h1 class="ics-title">` is what the app calls itself** — the live
  editor and the shelf both read it.
- **End `js/main.js` with a BREAK IT ON PURPOSE list.** Three or four entries:
  what to change, and the idea it teaches when it goes wrong. This is the
  highest-value thing in the file — it turns a working example into something a
  student can interrogate. Every entry must actually do what you claim.

### The fix-it variant

When the ask is "design N functions and break one", ship the app with every
function working **except one**, and make that one the exercise:

- The broken function gets a `TODO` comment naming the **symptom**, not the
  fix: *"this prints undefined — why?"*
- **One bug, one line.** Two bugs and they cannot tell which fix worked.
- Pick a bug that teaches the thing the workshop is about. If the API returns
  arrays-of-arrays, index a row by name instead of position — the symptom is
  `undefined` everywhere, and the fix *is* the lesson.
- **The page still runs with the bug in.** They must see the wrong answer, not
  a blank screen.
- Put the answer in a comment at the bottom of the file, after the BREAK IT ON
  PURPOSE list, under a `THE FIX` heading. Looking is allowed; hunting for a
  second file is not.

## 5. Generate the live editor

```bash
python tools/build-playground.py 0N-your-slug
```

It copies the app's files into `playground.html`, because a browser on a
`file://` path cannot read a folder. **Never hand-edit that file.** Re-run the
tool after every change to the app.

## 6. Put it on the shelf

One object in `js/workshops.js`. The comment at the top of that file documents
every field. Notes that matter:

- `slug` matches the folder name exactly
- `hook` says what they walk out holding, not what the topic is called
- `teaches` is five tags at most — nine is a syllabus
- `live: true` gives the card its red **live editor** chip
- `deck: null` if you have not written one
- `status: "draft"` — it is **not** `"ready"` until a cohort has survived it.
  Never set `"ready"` yourself; you have not taught it.

## 7. Verify before you report back

Run all of these. Do not claim it works on the strength of having written it:

```bash
node --check workshops/0N-your-slug/js/main.js
python tools/build-playground.py --check          # must be clean
```

- Every `getElementById("x")` in `main.js` has a matching `id="x"` in
  `index.html`
- Every local `href`/`src` in `index.html` resolves on disk
- Open the app and the live editor in a browser. On Windows `.html` is often
  associated with the legacy `htmlfile` handler, so `Start-Process` silently
  does nothing — launch `chrome.exe` with a `file:///` URL instead
- Files are CRLF, matching the rest of the repo

Then tell the user plainly what you could **not** verify — a live API call you
had no credential for, a deck you could not write, a layout you never saw
rendered. Say which step of this list is still outstanding.
