/* js/main.js
   ONE JOB: put the calculator on the page, and run the proof table.

   Everything below was loaded by the <script> tags in index.html, in this
   order - because each one needs the one above it:

       js/lib/math.js               add, subtract, divide
       js/components/Readout.js     the answer, or no answer
       js/components/Calculator.js  the screen
       js/main.js                   this file

   Plain <script> tags rather than import, because this page has to work when
   you double-click it, and a browser opening a file off your disk refuses to
   load a local module. Workshop 04 is the one that explains that properly. */

(function () {

  /* ---- 1 · the screen ---- */

  const root = document.getElementById("calc");
  if (root) {
    ReactDOM.createRoot(root).render(React.createElement(ICS.Calculator));
  }

  /* ---- 2 · the proof table ----

     Here is the thing worth noticing. This runs the SAME three functions the
     calculator runs - with no screen, no buttons and nobody clicking.

     That is only possible because the arithmetic lives in lib/ and RETURNS
     its answer instead of drawing it. Work you can check without a human is
     work you can trust, and it is why that split exists. */

  const CASES = [
    ["add",      2,  3],
    ["add",     -4,  4],
    ["subtract", 10, 3],
    ["subtract", 3, 10],    // order of inputs matters here, unlike add
    ["divide",   10, 2],
    ["divide",    7, 2],
    ["divide",   10, 0],    // the one with no answer
  ];

  const table = document.getElementById("proof");
  if (table) {
    table.innerHTML = CASES.map(function (c) {
      const name = c[0], x = c[1], y = c[2];
      const got = ICS[name](x, y);
      const shown = got === null ? "null" : String(got);
      const note = got === null ? "divide said it has no answer" : "";
      return "<tr" + (got === null ? ' class="cx-rownull"' : "") + ">"
           + "<td><code>" + name + "(" + x + ", " + y + ")</code></td>"
           + "<td><code>" + shown + "</code></td>"
           + "<td>" + note + "</td></tr>";
    }).join("");
  }

})();

/* ============================================================
   BREAK IT ON PURPOSE

   Open js/lib/math.js in the live editor. One change at a time, then put it
   back. Every one of these was run before it went on this list.

   delete  return  from add         Every sum shows "undefined". The function
                                    still RAN - it just handed nothing back.
                                    A function with no return is a machine
                                    with no output chute.

   change add's body to  a - b      Every addition is now wrong and NOTHING
                                    complains. No error, no warning, no red
                                    text. Wrong answers are the quietest bug
                                    there is, which is the entire reason the
                                    proof table exists.

   in subtract, swap it to  b - a   subtract(10, 3) starts giving -7. The
                                    ORDER of the inputs is part of what a
                                    function promises. add survives this one;
                                    subtract does not.

   delete divide's guard - the      Try 10 ÷ 0: the screen says "Infinity".
   whole  if (b === 0)  line        That is JavaScript's honest answer and a
                                    useless one for a person reading it.

   make divide  return 0  instead   Worse, and this is the one to sit with.
   of  null                         10 ÷ 0 now shows "0", which looks like a
                                    real answer. Nothing marks it as wrong.
                                    Show it to someone and they will believe
                                    it. That is why null is there.

   in Calculator.js, delete both    Type 10 and 2, press +, get "102". An
   Number() calls                   input gives you text, always, and + glues
                                    text together instead of adding it.
   ============================================================ */
