/* ============================================================
   STEP 1 · I DO    — the smallest version that works

   This file ships with a PLACEHOLDER MECHANIC so the template
   runs the moment you open it. Keep the shape, replace the guts.

   The shape is always the same four blocks:
     1. the source of truth (a URL, a list, a file)
     2. handles to the elements on the page
     3. the state
     4. one function that fills the page, called once at the end

   EDIT markers are for the live demo: type them in order, in
   front of the room, and the page gets more alive at each one.
   ============================================================ */

// ---- 1. WHERE THE DATA COMES FROM --------------------------
// EDIT 1: in a real workshop this is a URL, a filename, an API key.
// Here it is three strings, so the template has nothing to break.
const SOURCE = ["first thing", "second thing", "third thing"];

// ---- 2. THE PAGE -------------------------------------------
// Grab every element once, at the top, by its id. Students who
// learn this habit stop writing getElementById inside loops.
const goBtn    = document.getElementById("goBtn");
const statusEl = document.getElementById("status");
const outEl    = document.getElementById("out");
const countEl  = document.getElementById("count");

// ---- 3. THE WORK -------------------------------------------
// EDIT 2: the three-ish lines that ARE this workshop. If this
// function is longer than about ten lines, you are teaching two
// workshops and should split them.
function show() {
  const item = SOURCE[0];                 // 1. GET
  outEl.textContent = item;               // 2. SHOW

  statusEl.className   = "ics-note success";
  statusEl.textContent = "That worked. Nothing clever happened — that's the point.";
  countEl.textContent  = SOURCE.length + " available";
}

// ---- 4. WIRE IT UP -----------------------------------------
// EDIT 3: the one line that connects the button to the work.
goBtn.addEventListener("click", show);

// Say what the page is waiting for, so a blank screen is never
// ambiguous. "Nothing happened" is the worst error message there is.
statusEl.textContent = "Ready. Click the button.";
countEl.textContent  = SOURCE.length + " available";
