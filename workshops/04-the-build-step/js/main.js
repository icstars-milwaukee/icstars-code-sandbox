/* ============================================================
   THE BUILD STEP

   Four jobs in this file:
     1. translate JSX to JavaScript as you type, and RUN the result, so the
        build step stops being a rumour and becomes a thing you watched happen
     2. show the same page broken into components, with the folder that holds
        them, and let you hover one to find it on screen
     3. (in index.html) what each project file is for
     4. remember which install steps you have ticked

   React, ReactDOM and Babel are plain globals from CDN script tags. Babel is
   the same translator Vite runs - Vite just runs it on save, inside a dev
   server, instead of in your browser.
   ============================================================ */

/* ============================================================
   PART 1 - THE PROFILE CARD

   The example is a profile page on purpose. It is the smallest real thing that
   needs more than one component, and you already know what it should look
   like, so when it renders wrong you can see that it is wrong.
   ============================================================ */

const PERSON = {
  initials: "JR",
  name: "Jordan Rivera",
  role: "Tech Apprentice",
  team: "ibis",
  stats: [
    { label: "commits", value: 48 },
    { label: "PRs merged", value: 7 },
    { label: "weeks in", value: 8 },
  ],
  badges: ["SQL", "React", "Git"],
};

const EXAMPLE = `function Avatar({ initials }) {
  return <div className="pf-avatar">{initials}</div>;
}

function Stat({ label, value }) {
  return (
    <div className="pf-stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function Profile({ person }) {
  return (
    <article className="pf-card">
      <header className="pf-head">
        <Avatar initials={person.initials} />
        <div>
          <h3 className="pf-name">{person.name}</h3>
          <p className="pf-role">{person.role} · team {person.team}</p>
        </div>
      </header>

      <div className="pf-stats">
        {person.stats.map((s) => (
          <Stat key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </article>
  );
}`;

const jsxBox  = document.getElementById("jsx");
const outBox  = document.getElementById("out");
const modern  = document.getElementById("modern");
const explain = document.getElementById("explain");
const stage   = document.getElementById("stage");
const stageMsg = document.getElementById("stageMsg");

/* ---- translate, then run ---------------------------------------------------

   Two steps, and they are worth keeping separate in your head:

     compile   JSX text        -> JavaScript text      (Babel. This is Vite's job.)
     run       JavaScript text -> something on screen  (the browser. Always was.)

   A build step only ever does the first one. */

let stageRoot = null;

function compile(source, runtime) {
  return Babel.transform(source, {
    presets: [["react", { runtime }]],
    // Keep it readable. A real build minifies this to one line, which is right
    // for shipping and useless for learning.
    compact: false,
    retainLines: false,
  }).code;
}

function render(code) {
  // The compiled code defines components but does not render anything, so we
  // hand it React and ask for `Profile` back. `person` is handed in too, so
  // the example does not need to carry data.
  const factory = new Function("React", "person", code + "\n return typeof Profile !== 'undefined' ? Profile : null;");
  const Profile = factory(React, PERSON);
  if (!Profile) throw new Error("No component called Profile - did you rename it?");

  if (!stageRoot) stageRoot = ReactDOM.createRoot(stage);
  stageRoot.render(React.createElement(Profile, { person: PERSON }));
}

function update() {
  const runtime = modern.checked ? "automatic" : "classic";
  let code;

  // Compile. A JSX mistake stops here, and the message is the useful part.
  try {
    code = compile(jsxBox.value, runtime);
    outBox.textContent = code;
    outBox.classList.remove("bs-error");
  } catch (err) {
    outBox.textContent = String(err.message);
    outBox.classList.add("bs-error");
    stageMsg.textContent = "Not rendering - the JSX did not compile. Read the message above: Babel gives you the line and the column.";
    stageMsg.className = "bs-stagemsg bs-bad";
    return;
  }

  // Run. The automatic runtime emits an `import`, which a `new Function` cannot
  // execute - so the preview uses the classic output while you read either one.
  try {
    render(runtime === "automatic" ? compile(jsxBox.value, "classic") : code);
    stageMsg.textContent = runtime === "automatic"
      ? "Rendered. (The preview runs the classic output - the import in the modern version needs a bundler, which is exactly what Vite is for.)"
      : "Rendered. That card is the JavaScript on the right, running.";
    stageMsg.className = "bs-stagemsg bs-good";
  } catch (err) {
    stageMsg.textContent = "Compiled, but would not run: " + err.message;
    stageMsg.className = "bs-stagemsg bs-bad";
  }

  explain.innerHTML = modern.checked
    ? "<strong>Automatic runtime.</strong> Every tag became <code>_jsx(...)</code> and Babel added "
      + "the import for it at the top. This is what Vite does by default, and it is why you no "
      + "longer write <code>import React from \"react\"</code> in every file."
    : "<strong>Classic runtime.</strong> Every tag became <code>React.createElement(...)</code> - a "
      + "plain function call with three arguments: the tag, its props as an object, and its children. "
      + "<code>className</code> rather than <code>class</code>, because that second argument is a "
      + "JavaScript object and <code>class</code> is a reserved word.";
}

jsxBox.addEventListener("input", update);
modern.addEventListener("change", update);
document.getElementById("reset").addEventListener("click", () => {
  jsxBox.value = EXAMPLE;
  update();
  jsxBox.focus();
});

jsxBox.value = EXAMPLE;
update();

/* ============================================================
   PART 2 - ONE PAGE, FOUR COMPONENTS

   The same card again, fixed this time so it keeps working while you break the
   one above. Hover a row in the tree and that component lights up on the card.

   The point of this section: a component is not a technique. It is a box you
   drew round part of a page and gave a name, so you can move it, reuse it, and
   find it again. The folder is just where the box lives.
   ============================================================ */

const PARTS = [
  {
    file: "components/Profile.jsx",
    name: "Profile",
    sel: ".pf-card",
    job: "The whole card. Takes one prop - person - and decides the layout. Owns nothing else.",
  },
  {
    file: "components/Avatar.jsx",
    name: "Avatar",
    sel: ".pf-avatar",
    job: "Initials in a circle. Knows nothing about profiles - give it any initials and it works.",
  },
  {
    file: "components/Stat.jsx",
    name: "Stat",
    sel: ".pf-stat",
    job: "One number with a label. Rendered three times from one array, which is why it exists at all.",
  },
  {
    file: "components/Badge.jsx",
    name: "Badge",
    sel: ".pf-badge",
    job: "A single skill chip. The smallest component here, and the one most likely to get reused on another page.",
  },
];

// A second, independent render so breaking part 1 cannot break part 2.
function FixedProfile() {
  const h = React.createElement;
  return h("article", { className: "pf-card" },
    h("header", { className: "pf-head" },
      h("div", { className: "pf-avatar" }, PERSON.initials),
      h("div", null,
        h("h3", { className: "pf-name" }, PERSON.name),
        h("p", { className: "pf-role" }, PERSON.role + " · team " + PERSON.team))),
    h("div", { className: "pf-stats" },
      PERSON.stats.map((s) => h("div", { className: "pf-stat", key: s.label },
        h("b", null, String(s.value)), h("span", null, s.label)))),
    h("div", { className: "pf-badges" },
      PERSON.badges.map((b) => h("span", { className: "pf-badge", key: b }, b)))
  );
}

const demo = document.getElementById("demo");
ReactDOM.createRoot(demo).render(React.createElement(FixedProfile));

const tree = document.getElementById("tree");
tree.innerHTML = PARTS.map((p) => (
  '<li class="bs-part" data-sel="' + p.sel + '">' +
    '<code>&lt;' + p.name + ' /&gt;</code>' +
    '<span class="bs-file">' + p.file + '</span>' +
    '<span class="bs-job">' + p.job + '</span>' +
  '</li>'
)).join("");

// Hover a row, outline the thing. Touch and keyboard get the same via focus.
tree.querySelectorAll(".bs-part").forEach((row) => {
  const on = () => {
    demo.querySelectorAll(row.dataset.sel).forEach((el) => el.classList.add("pf-lit"));
    row.classList.add("bs-part-on");
  };
  const off = () => {
    demo.querySelectorAll(".pf-lit").forEach((el) => el.classList.remove("pf-lit"));
    row.classList.remove("bs-part-on");
  };
  row.addEventListener("pointerenter", on);
  row.addEventListener("pointerleave", off);
  row.tabIndex = 0;
  row.addEventListener("focus", on);
  row.addEventListener("blur", off);
});

/* ============================================================
   PART 4 - the install checklist

   Every step has a done-when you can check without asking anyone. That is the
   difference between a tutorial and a checklist.
   ============================================================ */

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
    why: "Starts the dev server. 'run dev' works because package.json has a scripts.dev entry - go and look at it.",
    done: "the terminal prints a http://localhost:5173 line and sits there. It is supposed to keep running."
  },
  {
    cmd: "open http://localhost:5173",
    why: "The app. Vite translated the JSX on the way to the browser - the same translation you watched in part 1.",
    done: "the Vite + React starter page renders."
  },
  {
    cmd: "make src/components/ and move something into it",
    why: "Put one component in its own file and import it, exactly like part 3's folder. This is the habit, not the ceremony.",
    done: "the page looks identical and the component lives in its own file."
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

   One at a time, in the JSX box at the top. Every one of these was run before
   it went in this list.

   delete an INNER closing     "Expected corresponding JSX closing tag for
   tag - the </div> in         <div>. (23:6)" - Babel gives you the line AND the
   <header>                    column. The parser hit </header> where it wanted
                               </div>, so it can tell you exactly what it
                               expected. This is the error you will see most
                               often all week; meet it now, not at 11pm.

   delete the OUTERMOST        "Unterminated JSX contents. (29:12)" - a different
   closing tag, </article>     message for the same mistake, and worth telling
                               apart. Inner: it found the wrong closer and says
                               so. Outermost: it ran out of file still waiting.
                               Same fix, different sentence.

   className -> class          It renders anyway, and the card keeps its styles.
                               React 18 is forgiving here - but open your browser
                               console and it is shouting: "Invalid DOM property
                               `class`. Did you mean `className`?" Nothing on the
                               page tells you. THE CONSOLE IS PART OF THE PAGE,
                               and this is the habit that entry exists to build.

   remove the ( ) after        NO ERROR AT ALL, and that is the point. It
   return in Profile           compiles to "return;" with the JSX below it as
                               dead code, so the card renders nothing. A blank
                               box and a clean console is a worse afternoon than
                               any error message. The parens are not style.

   {person.name} ->            the words "person.name" appear on the card as
   person.name                 literal text. Braces are how you leave text and
                               enter JavaScript. That is their whole job.

   rename Profile to Card      "No component called Profile - did you rename
                               it?" The preview looks for that name. Real
                               projects have the same problem, they just call it
                               an import error.

   delete  key={s.label}       it renders fine and React complains in the
                               console again: "Each child in a list should have
                               a unique key prop." Keys are not decoration -
                               they are how React tells three Stats apart when
                               one of them changes.

   lowercase <avatar />        renders an empty, unknown HTML tag instead of
   instead of <Avatar />       your component. Capital letter = my component,
                               lowercase = an HTML tag. That is the whole rule.

   tick the modern runtime     React.createElement becomes _jsx, and an import
                               appears that you did not type. That import is
                               what people mean by "the build step adds stuff" -
                               and it is why the preview falls back to the
                               classic output, because a browser cannot run an
                               import without a bundler.
   ============================================================ */
