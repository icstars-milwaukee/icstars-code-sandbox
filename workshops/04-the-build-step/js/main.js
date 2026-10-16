/* ============================================================
   THE BUILD STEP   —   Hello World  ->  Profile  ->  Data

   One editor, three stages. Each stage is the one before it, plus one new
   idea. Nothing in this file is clever.

   React, ReactDOM and Babel are plain globals from CDN <script> tags. Babel is
   the translator. Vite runs the same translator for you on every save - that is
   the whole thing this workshop is about.
   ============================================================ */

/* ---- the data the stages are handed ---------------------------------------

   PERSON is for the profile card.

   API is a real reply from the Cycle 21 data API, with the team names and
   numbers swapped for made-up ones. The SHAPE is exactly what you get back:
   a list of column names, and a list of rows. Nothing else.                  */

const PERSON = {
  initials: "JR",
  name: "Jordan Rivera",
  role: "Tech Apprentice",
  stats: [
    { label: "commits", value: 48 },
    { label: "PRs", value: 7 },
    { label: "weeks", value: 8 },
  ],
};

const API = {
  ok: true,
  columns: ["team", "open_tickets"],
  rows: [
    ["Service Desk", 57],
    ["Network", 44],
    ["Cloud Platform", 41],
    ["Field Support", 23],
    ["Apps", 18],
    ["Security", 9],
  ],
  rowCount: 6,
  durationMs: 2651,
};

/* ---- the three stages ----------------------------------------------------- */

const STAGES = {
  hello: `function App() {
  return <h1>Hello, world</h1>;
}`,

  profile: `function Avatar({ initials }) {
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

function App() {
  return (
    <article className="pf-card">
      <header className="pf-head">
        <Avatar initials={person.initials} />
        <div>
          <h3 className="pf-name">{person.name}</h3>
          <p className="pf-role">{person.role}</p>
        </div>
      </header>

      <div className="pf-stats">
        {person.stats.map((s) => (
          <Stat key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </article>
  );
}`,

  data: `function Bar({ name, value, most }) {
  return (
    <div className="g-row">
      <span className="g-name">{name}</span>
      <span className="g-track">
        <span className="g-bar" style={{ width: (value / most) * 100 + "%" }} />
      </span>
      <b className="g-value">{value}</b>
    </div>
  );
}

function App() {
  const most = Math.max(...api.rows.map((r) => r[1]));

  return (
    <div className="g-card">
      <h3 className="pf-name">Open tickets by team</h3>

      {api.rows.map((row) => (
        <Bar key={row[0]} name={row[0]} value={row[1]} most={most} />
      ))}

      <p className="g-foot">{api.rowCount} teams · from the API</p>
    </div>
  );
}`,
};

/* ---- the editor ----------------------------------------------------------- */

const jsxBox   = document.getElementById("jsx");
const outBox   = document.getElementById("out");
const stage    = document.getElementById("stage");
const stageMsg = document.getElementById("stageMsg");
const modern   = document.getElementById("modern");

let root = null;

// Step one: JSX text in, JavaScript text out. This is Babel. This is Vite's job.
function compile(source, runtime) {
  return Babel.transform(source, {
    presets: [["react", { runtime: runtime || "classic" }]],
    compact: false,
  }).code;
}

// Step two: run that JavaScript. This is the browser, and always was.
function run(code) {
  const make = new Function("React", "person", "api",
    code + "\n return typeof App !== 'undefined' ? App : null;");
  const App = make(React, PERSON, API);
  if (!App) throw new Error("No component called App - did you rename it?");
  if (!root) root = ReactDOM.createRoot(stage);
  root.render(React.createElement(App));
}

function update() {
  const runtime = modern.checked ? "automatic" : "classic";

  let code;
  try {
    code = compile(jsxBox.value, runtime);
    outBox.textContent = code;
    outBox.classList.remove("bs-error");
  } catch (err) {
    // A JSX mistake stops here. The message is the useful part - it has the
    // line and the column in it.
    outBox.textContent = String(err.message);
    outBox.classList.add("bs-error");
    stageMsg.textContent = "Nothing drawn - the JSX did not translate. Read the message in the middle.";
    stageMsg.className = "bs-stagemsg bs-bad";
    return;
  }

  try {
    // The modern runtime writes an `import`, and a browser cannot run an import
    // on its own - that is what a bundler is for. So the picture uses the
    // classic output while you read either one.
    run(runtime === "automatic" ? compile(jsxBox.value, "classic") : code);
    stageMsg.textContent = "Drawn. That picture is the middle column, running.";
    stageMsg.className = "bs-stagemsg bs-good";
  } catch (err) {
    stageMsg.textContent = "Translated, but would not run: " + err.message;
    stageMsg.className = "bs-stagemsg bs-bad";
  }
}

function load(which) {
  jsxBox.value = STAGES[which];
  update();
  document.querySelectorAll("[data-stage]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.stage === which));
  });
}

document.querySelectorAll("[data-stage]").forEach((b) => {
  b.addEventListener("click", () => load(b.dataset.stage));
});
jsxBox.addEventListener("input", update);
modern.addEventListener("change", update);

load("hello");

/* ---- Act 2: the card, and the boxes it is made of -------------------------

   A second copy, built by hand, so breaking the editor above cannot break it.
   Hover a row and the matching box lights up.                               */

function FixedCard() {
  const h = React.createElement;
  return h("article", { className: "pf-card" },
    h("header", { className: "pf-head" },
      h("div", { className: "pf-avatar" }, PERSON.initials),
      h("div", null,
        h("h3", { className: "pf-name" }, PERSON.name),
        h("p", { className: "pf-role" }, PERSON.role))),
    h("div", { className: "pf-stats" },
      PERSON.stats.map((s) => h("div", { className: "pf-stat", key: s.label },
        h("b", null, String(s.value)), h("span", null, s.label))))
  );
}

const demo = document.getElementById("demo");
if (demo) ReactDOM.createRoot(demo).render(React.createElement(FixedCard));

const PARTS = [
  { name: "App",    file: "App.jsx",               sel: ".pf-card",   job: "The whole card. Decides what goes where." },
  { name: "Avatar", file: "components/Avatar.jsx", sel: ".pf-avatar", job: "Initials in a circle. Knows nothing about profiles." },
  { name: "Stat",   file: "components/Stat.jsx",   sel: ".pf-stat",   job: "One number with a label. Used three times - which is why it exists." },
];

const tree = document.getElementById("tree");
if (tree) {
  tree.innerHTML = PARTS.map((p) =>
    '<li class="bs-part" data-sel="' + p.sel + '" tabindex="0">' +
      '<code>&lt;' + p.name + ' /&gt;</code>' +
      '<span class="bs-file">' + p.file + '</span>' +
      '<span class="bs-job">' + p.job + '</span>' +
    '</li>').join("");

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
    row.addEventListener("focus", on);
    row.addEventListener("blur", off);
  });
}

/* ---- Act 3: the answer, and the same answer as a picture ------------------

   Left: the reply, exactly as the API sends it. Right: that reply, drawn.
   Hover a row in the reply and its bar lights up. They are the same numbers.  */

const reply = document.getElementById("reply");
if (reply) {
  reply.textContent = JSON.stringify(API, null, 2);
}

const graph = document.getElementById("graph");
if (graph) {
  const most = Math.max(...API.rows.map((r) => r[1]));
  graph.innerHTML = API.rows.map((row, i) =>
    '<div class="g-row" data-i="' + i + '">' +
      '<span class="g-name">' + row[0] + '</span>' +
      '<span class="g-track"><span class="g-bar" style="width:' + (row[1] / most) * 100 + '%"></span></span>' +
      '<b class="g-value">' + row[1] + '</b>' +
    '</div>').join("");

  // the rows of the reply, as hoverable chips, tied to the bars
  const rowList = document.getElementById("rowlist");
  if (rowList) {
    rowList.innerHTML = API.rows.map((row, i) =>
      '<li class="g-chip" data-i="' + i + '" tabindex="0"><code>["' + row[0] + '", ' + row[1] + ']</code></li>'
    ).join("");

    const link = (i, on) => {
      const bar = graph.querySelector('.g-row[data-i="' + i + '"]');
      const chip = rowList.querySelector('.g-chip[data-i="' + i + '"]');
      if (bar) bar.classList.toggle("g-lit", on);
      if (chip) chip.classList.toggle("g-lit", on);
    };
    rowList.querySelectorAll(".g-chip").forEach((c) => {
      c.addEventListener("pointerenter", () => link(c.dataset.i, true));
      c.addEventListener("pointerleave", () => link(c.dataset.i, false));
      c.addEventListener("focus", () => link(c.dataset.i, true));
      c.addEventListener("blur", () => link(c.dataset.i, false));
    });
    graph.querySelectorAll(".g-row").forEach((r) => {
      r.addEventListener("pointerenter", () => link(r.dataset.i, true));
      r.addEventListener("pointerleave", () => link(r.dataset.i, false));
    });
  }
}

/* ---- the install checklist ------------------------------------------------ */

const STEPS = [
  { cmd: "node -v",
    why: "Vite needs Node 18 or newer. This is the one thing that fails quietly and costs an hour.",
    done: "a number starting with v18, v20, v22 or v24. 'Command not found' means Node is not installed yet." },
  { cmd: "npm create vite@latest my-app -- --template react",
    why: "Makes the folder and the files. The bare -- passes the rest through to the template.",
    done: "a my-app folder exists, with package.json and src/App.jsx inside it." },
  { cmd: "cd my-app && npm install",
    why: "Downloads everything package.json asked for into node_modules.",
    done: "node_modules exists. It is huge. That is normal." },
  { cmd: "npm run dev",
    why: "Starts Vite. It translates your JSX every time you save.",
    done: "a http://localhost:5173 line appears and the terminal keeps running. It is meant to." },
  { cmd: "open http://localhost:5173",
    why: "Your app. Vite translated the JSX on the way to the browser.",
    done: "the starter page renders." },
  { cmd: "change a word in src/App.jsx and save",
    why: "You did not reload anything.",
    done: "the browser updated by itself." },
];

const KEY = "ics-build-step-steps";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
const write = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };

const ticked = read();
const list = document.getElementById("steps");
if (list) {
  STEPS.forEach((s, i) => {
    const id = "bs" + i;
    const li = document.createElement("li");
    li.className = "bs-step";
    li.innerHTML =
      '<label><input type="checkbox" data-id="' + id + '"' + (ticked[id] ? " checked" : "") + '>' +
      '<span><code class="bs-cmd">' + s.cmd + '</code>' +
      '<span class="bs-why">' + s.why + '</span>' +
      '<span class="bs-done"><b>Done when:</b> ' + s.done + '</span></span></label>';
    list.appendChild(li);
  });
  list.addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    ticked[e.target.dataset.id] = e.target.checked;
    write(ticked);
  });
}

/* ============================================================
   BREAK IT ON PURPOSE

   In the editor at the top. One at a time. Every one of these was run first.

   START ON HELLO WORLD - it is two lines, so the error has nowhere to hide.

   delete the </h1>           "Unterminated JSX contents." You said where to
                              start and never where to stop, and Babel ran out
                              of file still waiting.

   <h1>Hello</p>              "Expected corresponding JSX closing tag for <h1>."
                              A different sentence for a near-identical mistake:
                              this time it found a closer, just the wrong one.

   rename App to Page         "No component called App - did you rename it?"
                              The picture looks for App. Real projects hit this
                              too, they just call it an import error.

   NOW SWITCH TO PROFILE and try these.

   className -> class         It still draws, and it keeps its styling. React is
                              forgiving here - but open your browser console and
                              it is telling you: "Invalid DOM property `class`.
                              Did you mean `className`?" Nothing on the page
                              says so. THE CONSOLE IS PART OF THE PAGE.

   remove the ( ) after       NO ERROR, and nothing draws. It becomes "return;"
   return in App              with the card below it as dead code. A blank box
                              and a clean console is a worse afternoon than any
                              error message. The brackets are not decoration.

   {person.name} ->           the words "person.name" appear on the card as
   person.name                plain text. Curly brackets are how you stop
                              writing text and start writing JavaScript.

   <avatar /> instead         an empty unknown tag appears and your component
   of <Avatar />              never runs. Capital letter means my component,
                              lowercase means an HTML tag. That is the rule.

   delete key={s.label}       draws fine, and the console says "Each child in a
                              list should have a unique key prop." Keys are how
                              React tells three Stats apart when one changes.

   NOW SWITCH TO DATA.

   api.rows -> api.row        "Cannot read properties of undefined (reading
                              'map')." The reply has no `row` in it. Look at the
                              reply on the left and spell it the way it is
                              written there - that is most API debugging.

   remove / most from         every bar fills the whole width. The widths were a
   the width                  share of the biggest one; without it you are
                              drawing 57% and 44% as the same thing.

   tick the modern runtime    React.createElement becomes _jsx, and an import
                              appears that you never typed. That import is what
                              people mean by "the build step adds things" - and
                              it is why the picture falls back to the classic
                              output, because a browser cannot run an import by
                              itself.
   ============================================================ */
