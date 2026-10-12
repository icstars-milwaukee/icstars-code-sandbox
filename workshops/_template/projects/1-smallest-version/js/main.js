/* STEP 1 · I DO — the smallest version that works.

   REPLACE THE GUTS, KEEP THE SHAPE. Every project in a workshop is
   the same four blocks:

     1. the source of truth   (a URL, a list, a file)
     2. handles to the page   (grabbed once, at the top, by id)
     3. the work              (the lines that ARE the lesson)
     4. wire it up            (and say what the page is waiting for)

   If block 3 runs past ten lines you are teaching two workshops. */

// ---- 1. WHERE THE DATA COMES FROM ------------------------
// In a real workshop this is a URL. Three strings here, so the
// template runs before you have changed anything.
const SOURCE = ["first thing", "second thing", "third thing"];

// ---- 2. THE PAGE -----------------------------------------
// Grab every element once, at the top. Students who learn this habit
// stop writing getElementById inside loops.
const goBtn    = document.getElementById("goBtn");
const statusEl = document.getElementById("status");
const outEl    = document.getElementById("out");
const countEl  = document.getElementById("count");

// ---- 3. THE WORK -----------------------------------------
function show() {
  const item = SOURCE[0];                  // 1. GET
  outEl.textContent = item;                // 2. SHOW

  statusEl.className   = "ics-note success";
  statusEl.textContent = "That worked. Nothing clever happened — that's the point.";
  countEl.textContent  = SOURCE.length + " available";
}

// ---- 4. WIRE IT UP ---------------------------------------
goBtn.addEventListener("click", show);

// Say what the page is waiting for. "Nothing happened" is the worst
// error message there is.
statusEl.textContent = "Ready. Click the button.";
countEl.textContent  = SOURCE.length + " available";


/* BREAK IT ON PURPOSE — write three of these for YOUR lesson. Each
   one should break a different thing and teach a different word:

   <change X to Y>            <what the student sees, and why>
   <delete line N>            <what the student sees, and why>
   <misspell an id>           "null is not an object" — the handle
                              never found anything to hold. */
