/* ============================================================
   THE BUILD STEP

   Two jobs in this file:
     1. translate JSX to JavaScript as you type, so the build step stops being
        a rumour and becomes a thing you watched happen
     2. remember which install steps you have ticked

   Babel is here as a plain global (window.Babel) from a CDN script tag. It is
   the same translator Vite runs - Vite just runs it on every save, inside a
   dev server, instead of in your browser.
   ============================================================ */

/* ---- The example. Deliberately from workshop 03, so the JSX is something you
        will actually meet again rather than a toy. ------------------------- */

const EXAMPLE = `function TeamBar({ team, open, picked, onPick }) {
  return (
    <g className={picked ? "row on" : "row"} onClick={() => onPick(team)}>
      <text className="cat" x={240} y={14}>
        {team}
      </text>
      <path className="bar" d={barPath(250, open)} />
      <text className="val">{open.toLocaleString()}</text>
    </g>
  );
}`;

const jsxBox = document.getElementById("jsx");
const outBox = document.getElementById("out");
const modern = document.getElementById("modern");
const explain = document.getElementById("explain");

/* ---- Job 1: translate ------------------------------------------------------

   One call. That is genuinely all a build step does to JSX - everything else
   Vite does (serving, reloading, bundling for production) is logistics around
   this one translation. */

function translate() {
  const source = jsxBox.value;

  // "classic" turns <p/> into React.createElement("p"). "automatic" turns it
  // into _jsx("p") and imports that helper for you - which is why a modern
  // React file does not need `import React` at the top any more.
  const runtime = modern.checked ? "automatic" : "classic";

  try {
    const out = Babel.transform(source, {
      presets: [["react", { runtime }]],
      // Keep the output readable. A real build minifies this into one line,
      // which is correct for shipping and useless for learning.
      retainLines: false,
      compact: false,
    }).code;

    outBox.textContent = out;
    outBox.classList.remove("bs-error");
  } catch (err) {
    // Babel's errors carry a line and column. Read them - they are the single
    // most useful thing in the whole toolchain and most people scroll past.
    outBox.textContent = String(err.message);
    outBox.classList.add("bs-error");
  }

  explain.innerHTML = modern.checked
    ? "<strong>Automatic runtime.</strong> Every tag became <code>_jsx(...)</code>, and Babel "
      + "added the import for it at the top. This is what Vite does by default, and it is why "
      + "you no longer write <code>import React from \"react\"</code> in every file."
    : "<strong>Classic runtime.</strong> Every tag became <code>React.createElement(...)</code> - "
      + "a plain function call with three arguments: the tag, its props as an object, and its "
      + "children. <code>className</code> rather than <code>class</code>, because the second "
      + "argument is a JavaScript object and <code>class</code> is a reserved word.";
}

jsxBox.addEventListener("input", translate);
modern.addEventListener("change", translate);
document.getElementById("reset").addEventListener("click", () => {
  jsxBox.value = EXAMPLE;
  translate();
  jsxBox.focus();
});

jsxBox.value = EXAMPLE;
translate();

/* ---- Job 2: the install checklist ----------------------------------------

   Every step has a "done when" that you can check without asking anyone. That
   is the difference between a tutorial and a checklist. */

const STEPS = [
  {
    cmd: "node -v",
    why: "Vite needs Node 18 or newer. This is the one thing that fails silently and wastes an hour.",
    done: "a version number starting with v18, v20, v22 or v24. If the command is not found, Node is not installed."
  },
  {
    cmd: "npm create vite@latest my-app -- --template react",
    why: "Makes the folder, the package.json and a working App.jsx. The bare -- passes the rest through to the template.",
    done: "a my-app folder exists and contains package.json, index.html and src/App.jsx."
  },
  {
    cmd: "cd my-app && npm install",
    why: "Reads package.json, downloads everything into node_modules, writes package-lock.json.",
    done: "node_modules exists and npm printed a package count. It is big. That is normal."
  },
  {
    cmd: "npm run dev",
    why: "Starts the dev server. 'run dev' works because package.json has a scripts.dev entry - look at it.",
    done: "the terminal prints a http://localhost:5173 line and sits there. It is supposed to keep running."
  },
  {
    cmd: "open http://localhost:5173",
    why: "The app. Vite translated your JSX on the way to the browser.",
    done: "the Vite + React starter page renders."
  },
  {
    cmd: "edit src/App.jsx and save",
    why: "Change any text and save. You did not reload anything.",
    done: "the browser updated by itself. That is hot reload, and it is the reason the dev server stays running."
  }
];

const KEY = "ics-build-step-steps";
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };

const ticked = load();
const list = document.getElementById("steps");

STEPS.forEach((s, i) => {
  const id = "bs" + i;
  const li = document.createElement("li");
  li.className = "bs-step";
  li.innerHTML =
    '<label><input type="checkbox" data-id="' + id + '"' + (ticked[id] ? " checked" : "") + '>' +
    '<span><code class="bs-cmd">' + s.cmd + '</code>' +
    '<span class="bs-why">' + s.why + '</span>' +
    '<span class="bs-done"><b>Done when:</b> ' + s.done + '</span>' +
    '</span></label>';
  list.appendChild(li);
});

list.addEventListener("change", (e) => {
  if (e.target.type !== "checkbox") return;
  ticked[e.target.dataset.id] = e.target.checked;
  save(ticked);
});

/* ============================================================
   BREAK IT ON PURPOSE

   One at a time, in the box on the left.

   delete a closing tag        "Unterminated JSX contents. (9:8)" - Babel gives
   (</text> -> nothing)        you the line AND the column. This is the error you
                               will see most often all week, so meet it now on
                               purpose instead of at 11pm.

   mismatch a tag              "Expected corresponding JSX closing tag for <g>."
   (</g> -> </div>)            A different message from the one above, and worth
                               knowing apart: unterminated means you stopped
                               early, mismatched means you closed the wrong one.

   className -> class          it still compiles - and that is the trap. You get
                               {class: "cat"}, which React ignores, so your
                               styling silently vanishes. No error, no clue.
                               THIS is why JSX uses className.

   remove the ( ) after        NO ERROR AT ALL - and that is the point. It
   return                      compiles to "return;" with the JSX sitting under
                               it as dead code, so the component renders
                               nothing. A blank screen and a clean console is a
                               worse afternoon than any error message. The
                               parens are not style.

   onClick -> onclick          compiles, renders, does nothing when clicked.
                               React listens for onClick; the lowercase one is
                               an HTML attribute React does not wire up.

   {open.toLocaleString()}     drop the braces -> the words
   -> open.toLocaleString()    "open.toLocaleString()" render as literal text.
                               Braces are how you leave text and enter
                               JavaScript. That is their whole job.

   tick the modern runtime     watch React.createElement become _jsx, and an
                               import appear that you did not type. That import
                               is the thing people mean when they say "the
                               build step adds stuff".
   ============================================================ */
