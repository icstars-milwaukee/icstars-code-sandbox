/* js/main.js
   ONE JOB: wire the page up. No components in here, no SQL, no data.

   Everything this file uses was loaded by the <script> tags above it in
   index.html, in this order:

     js/api/reply.js            the API reply          -> ICS.API, ICS.REQUEST
     js/lib/translate.js        the build step         -> ICS.compile, ICS.run
     js/lib/remember.js         saving ticks           -> ICS.remember
     js/components/Avatar.js    one box                -> ICS.Avatar
     js/components/Stat.js      one box                -> ICS.Stat
     js/components/ProfileCard.js  the card            -> ICS.ProfileCard
     js/components/Bar.js       one bar                -> ICS.Bar
     js/components/Graph.js     the graph              -> ICS.Graph
     js/stages.js               the three stages       -> ICS.STAGES, ICS.PERSON
     js/main.js                 this file

   WHY SCRIPT TAGS AND NOT IMPORTS: this page has to run when you double-click
   it, and a browser opening a file off your disk refuses to load a local
   module. So each file hangs its one thing on a shared ICS object and the tags
   go in dependency order.

   In a real Vite project you would write

       import Stat from "./components/Stat.jsx";

   and never think about order again. That is one of the things the build step
   buys you - which makes this file a decent argument for the whole workshop. */

(function () {
  const $ = (id) => document.getElementById(id);

  /* ---------- the editor: three stages, three columns ---------- */

  const jsxBox   = $("jsx");
  const outBox   = $("out");
  const stage    = $("stage");
  const stageMsg = $("stageMsg");
  const modern   = $("modern");

  function update() {
    const runtime = modern.checked ? "automatic" : "classic";

    let code;
    try {
      code = ICS.compile(jsxBox.value, runtime);
      outBox.textContent = code;
      outBox.classList.remove("bs-error");
    } catch (err) {
      // A JSX mistake stops here. The message has the line and column in it.
      outBox.textContent = String(err.message);
      outBox.classList.add("bs-error");
      stageMsg.textContent = "Nothing drawn - the JSX did not translate. Read the middle column.";
      stageMsg.className = "bs-stagemsg bs-bad";
      return;
    }

    try {
      // The modern runtime writes an `import`, and a browser cannot run one on
      // its own - that is what a bundler is for. So the picture uses the
      // classic output while you read either version.
      const toRun = runtime === "automatic" ? ICS.compile(jsxBox.value, "classic") : code;
      ICS.run(toRun, stage, { person: ICS.PERSON, api: ICS.API });
      stageMsg.textContent = "Drawn. That picture is the middle column, running.";
      stageMsg.className = "bs-stagemsg bs-good";
    } catch (err) {
      stageMsg.textContent = "Translated, but would not run: " + err.message;
      stageMsg.className = "bs-stagemsg bs-bad";
    }
  }

  function load(which) {
    jsxBox.value = ICS.STAGES[which];
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

  /* ---------- stage 2: the card, and the files it is made of ----------
     A second copy, built from the real components, so breaking the editor
     above cannot break it. */

  const demo = $("demo");
  if (demo) {
    ReactDOM.createRoot(demo).render(
      React.createElement(ICS.ProfileCard, { person: ICS.PERSON }));
  }

  const PARTS = [
    { name: "ProfileCard", file: "js/components/ProfileCard.js", sel: ".pf-card",
      job: "Arrangement only. Decides what goes where and owns no numbers." },
    { name: "Avatar", file: "js/components/Avatar.js", sel: ".pf-avatar",
      job: "Initials in a circle. Knows nothing about profiles." },
    { name: "Stat", file: "js/components/Stat.js", sel: ".pf-stat",
      job: "One number with a label. Used three times - which is why it exists." },
  ];

  const tree = $("tree");
  if (tree) {
    tree.innerHTML = PARTS.map((p) =>
      '<li class="bs-part" data-sel="' + p.sel + '" tabindex="0">' +
        '<code>&lt;' + p.name + ' /&gt;</code>' +
        '<span class="bs-file">' + p.file + '</span>' +
        '<span class="bs-job">' + p.job + '</span>' +
      '</li>').join("");

    tree.querySelectorAll(".bs-part").forEach((row) => {
      const lit = (on) => {
        demo.querySelectorAll(row.dataset.sel).forEach((el) => el.classList.toggle("pf-lit", on));
        row.classList.toggle("bs-part-on", on);
      };
      row.addEventListener("pointerenter", () => lit(true));
      row.addEventListener("pointerleave", () => lit(false));
      row.addEventListener("focus", () => lit(true));
      row.addEventListener("blur", () => lit(false));
    });
  }

  /* ---------- stage 3: the request, the reply, and the reply drawn ---------- */

  const request = $("request");
  if (request) request.textContent = ICS.REQUEST;

  const reply = $("reply");
  if (reply) reply.textContent = JSON.stringify(ICS.API, null, 2);

  const graph = $("graph");
  if (graph) {
    ReactDOM.createRoot(graph).render(
      React.createElement(ICS.Graph, { reply: ICS.API }));
  }

  const rowList = $("rowlist");
  if (rowList && graph) {
    rowList.innerHTML = ICS.API.rows.map((row, i) =>
      '<li class="g-chip" data-i="' + i + '" tabindex="0">' +
        '<code>["' + row[0] + '", ' + row[1] + ']</code></li>').join("");

    // Hovering either side lights up both, because they are the same numbers.
    const link = (i, on) => {
      const bar = graph.querySelector('.g-row[data-i="' + i + '"]');
      const chip = rowList.querySelector('.g-chip[data-i="' + i + '"]');
      if (bar) bar.classList.toggle("g-lit", on);
      if (chip) chip.classList.toggle("g-lit", on);
    };
    const wire = (el) => {
      el.addEventListener("pointerenter", () => link(el.dataset.i, true));
      el.addEventListener("pointerleave", () => link(el.dataset.i, false));
      el.addEventListener("focus", () => link(el.dataset.i, true));
      el.addEventListener("blur", () => link(el.dataset.i, false));
    };
    rowList.querySelectorAll(".g-chip").forEach(wire);
    // The graph is drawn by React, so wait a tick for the bars to exist.
    setTimeout(() => graph.querySelectorAll(".g-row").forEach(wire), 0);
  }

  /* ---------- the install checklist ---------- */

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
    { cmd: "make src/components/ and move one component into it",
      why: "Same folders as this workshop. Then import it: import Stat from './components/Stat.jsx'.",
      done: "the page looks identical and the component lives in its own file." },
    { cmd: "change a word in src/App.jsx and save",
      why: "You did not reload anything.",
      done: "the browser updated by itself." },
  ];

  const list = $("steps");
  if (list) {
    const store = ICS.remember("ics-build-step-steps");
    const ticked = store.read();

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
      store.write(ticked);
    });
  }
})();

/* ============================================================
   BREAK IT ON PURPOSE

   In the editor at the top. One at a time. Every one was run first.

   START ON HELLO WORLD - two lines, so the error has nowhere to hide.

   delete the </h1>           "Unterminated JSX contents." You said where to
                              start and never where to stop, so Babel ran out
                              of file still waiting.

   <h1>Hello</p>              "Expected corresponding JSX closing tag for <h1>."
                              Nearly the same mistake, different sentence: this
                              time it found a closing tag, just the wrong one.

   rename App to Page         "No component called App - did you rename it?"
                              The picture looks for App. Real projects hit this
                              too, they just call it an import error.

   NOW SWITCH TO PROFILE.

   className -> class         It still draws, and it keeps its styling. React is
                              forgiving here - but open your browser console and
                              it is telling you: "Invalid DOM property `class`.
                              Did you mean `className`?" Nothing on the page
                              says so. THE CONSOLE IS PART OF THE PAGE.

   remove the ( ) after       NO ERROR, and nothing draws. It becomes "return;"
   return in App              with the card below as dead code. A blank box and
                              a clean console is a worse afternoon than any
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
                              reply lower down the page and spell it the way it
                              is written there. That is most API debugging.

   remove / most from         every bar fills its whole track. The widths were a
   the width                  share of the biggest one; without it you are
                              drawing 57 and 44 as the same length.

   tick the modern runtime    React.createElement becomes _jsx, and an import
                              appears that you never typed. That import is what
                              people mean by "the build step adds things" - and
                              it is why the picture falls back to the classic
                              output, because a browser cannot run an import by
                              itself.

   AND ONE IN THE FILES THEMSELVES, in the live editor:

   open js/components/        delete its last line, the one starting ICS.Stat.
   Stat.js                    The card loses its three numbers and the console
                              says ICS.Stat is undefined. That is what "one
                              component, one file" costs you when a file goes
                              missing - and why import errors are the most
                              common thing you will fix all week.
   ============================================================ */
