/* ============================================================
   THE CODE SANDBOX  —  one editor, one file
   An editor pane and a live preview, side by side, on a step page.
   No build step, no npm, no CDN: it works from a file:// path and
   offline, which is the whole point.

   For the whole workshop with a file tree, see js/playground.js.

   HOW TO PUT ONE ON A PAGE
   ------------------------
   Three blocks of plain text inside one container. You write
   markup; this file builds the editor, the Run button, the
   preview, the console and the line numbers.

     <link rel="stylesheet" href="../../css/sandbox.css">

     <div data-sb
          data-sb-file="js/step-1.js"
          data-sb-storage="01-hello-api/step-1">

       <script type="text/plain" data-sb-html>
         <div class="ics-stage"><img id="sprite" class="ics-sprite" alt=""></div>
         <div class="ics-out" id="output">Nothing yet.</div>
       </script>

       <script type="text/plain" data-sb-js>
         // the starter code the student sees
       </script>

       <script type="text/plain" data-sb-solution>
         // the answer. Omit this block and the button disappears.
       </script>

     </div>

     <script src="../../js/preview-core.js"></script>
     <script src="../../js/sandbox.js"></script>

   WHY type="text/plain"
     The browser does not run it and does not parse it as markup,
     so angle brackets and quotes survive exactly as typed. The one
     thing you cannot put in these blocks is the text </script>.

   WHAT THE STUDENT GETS
     Run (or Ctrl+Enter) rebuilds the preview from scratch, so
     there is no stale state to debug. console.log lands in the
     console pane. Errors land there too, in red, with the line
     number counted from line 1 of THEIR code — not line 1 of some
     generated document they never saw. Their edits survive a
     refresh; Reset puts the starter code back.
   ============================================================ */

(function () {
  "use strict";

  const CORE = window.ICS_PREVIEW;
  if (!CORE) {
    console.error("sandbox.js: load js/preview-core.js first.");
    return;
  }

  const el = CORE.el, btn = CORE.btn, store = CORE.store, TAB = CORE.TAB;
  const SCRIPT_URL = document.currentScript ? document.currentScript.src : "";
  const THEME_HREF = CORE.themeHref(SCRIPT_URL);

  function blockText(root, name) {
    const node = root.querySelector('[data-sb-' + name + ']');
    return node ? CORE.readBlock(node) : "";
  }

  function build(root) {
    const htmlSrc  = blockText(root, "html");
    const starter  = blockText(root, "js");
    const solution = blockText(root, "solution");
    const storeKey = root.dataset.sbStorage || "";
    const fileName = root.dataset.sbFile || "";

    root.textContent = "";                 // drop the source blocks
    root.classList.add("sb");

    /* --- the toolbar --- */
    const bar = el("div", "sb-bar");
    bar.appendChild(el("span", "sb-label", "JavaScript"));
    if (fileName) bar.appendChild(el("span", "sb-file", fileName));

    const actions  = el("div", "sb-actions");
    const runBtn   = btn("sb-btn sb-run", "Run ▸", "Ctrl + Enter");
    const resetBtn = btn("sb-btn", "Reset", "Put the starter code back");
    actions.appendChild(runBtn);
    actions.appendChild(resetBtn);

    let solveBtn = null;
    if (solution) {
      solveBtn = btn("sb-btn", "Solution", "Replace the editor with the answer");
      actions.appendChild(solveBtn);
    }
    actions.appendChild(el("span", "sb-key", "Ctrl + Enter"));
    bar.appendChild(actions);
    root.appendChild(bar);

    /* --- the two panes --- */
    const panes  = el("div", "sb-panes");

    const editor = el("div", "sb-editor");
    const gutter = el("div", "sb-gutter");
    const code   = el("textarea", "sb-code");
    code.spellcheck = false;
    code.wrap = "off";
    code.setAttribute("aria-label", "Code editor" + (fileName ? " for " + fileName : ""));
    editor.appendChild(gutter);
    editor.appendChild(code);
    panes.appendChild(editor);

    const right  = el("div", "sb-right");

    const result = el("div", "sb-result");
    result.appendChild(el("div", "sb-pane-label", "Result"));
    const frame = document.createElement("iframe");
    frame.className = "sb-frame";
    frame.title = "Live preview";
    result.appendChild(frame);
    right.appendChild(result);

    const consoleWrap = el("div", "sb-console");
    const consoleHead = el("div", "sb-pane-label", "Console");
    const clearBtn    = btn("sb-clear", "clear", "Empty the console");
    consoleHead.appendChild(clearBtn);
    consoleWrap.appendChild(consoleHead);
    const log = el("div", "sb-log");
    consoleWrap.appendChild(log);
    right.appendChild(consoleWrap);

    panes.appendChild(right);
    root.appendChild(panes);

    /* --- the markup they are coding against ---
       "Where does `sprite` come from?" is the most common question
       at a sandbox, and the answer is always this block. */
    if (htmlSrc) {
      const details = document.createElement("details");
      details.className = "sb-markup";
      const summary = document.createElement("summary");
      summary.textContent = "The markup this code runs against";
      details.appendChild(summary);
      details.appendChild(el("pre", null, htmlSrc));
      root.appendChild(details);
    }

    /* ---------- the preview ---------------------------------- */
    const preview = CORE.createPreview(frame, log, {
      head: (THEME_HREF ? '<link rel="stylesheet" href="' + THEME_HREF + '">' : "")
          + '<style>html,body{margin:0}body{padding:14px 16px}'
          + '.ics-stage{min-height:180px}.ics-sprite{width:150px;height:150px}</style>',
      lineCount: function () { return code.value.split("\n").length; },
      onStart: function () { root.classList.add("sb-running"); },
      onReady: function () { root.classList.remove("sb-running"); }
    });

    function run() { preview.run(htmlSrc, code.value); }

    /* ---------- the editor ---------------------------------- */
    function paintGutter() {
      const lines = code.value.split("\n").length;
      let text = "";
      for (let i = 1; i <= lines; i++) text += i + "\n";
      gutter.textContent = text;
      gutter.scrollTop = code.scrollTop;
    }

    function load(text) {
      code.value = text;
      paintGutter();
    }

    code.addEventListener("input", function () {
      paintGutter();
      if (storeKey) store.set(storeKey, code.value);
    });
    code.addEventListener("scroll", function () { gutter.scrollTop = code.scrollTop; });

    code.addEventListener("keydown", function (e) {
      /* Tab indents instead of leaving the box. Esc first, then
         Tab, still gets a keyboard user out — the hint says so. */
      if (e.key === "Tab") {
        e.preventDefault();
        const start = code.selectionStart, end = code.selectionEnd;
        code.value = code.value.slice(0, start) + TAB + code.value.slice(end);
        code.selectionStart = code.selectionEnd = start + TAB.length;
        paintGutter();
        if (storeKey) store.set(storeKey, code.value);
        return;
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        run();
        return;
      }
      if (e.key === "Escape") code.blur();
    });

    clearBtn.addEventListener("click", preview.clear);
    runBtn.addEventListener("click", run);

    resetBtn.addEventListener("click", function () {
      load(starter);
      if (storeKey) store.drop(storeKey);
      run();
    });

    if (solveBtn) {
      solveBtn.addEventListener("click", function () {
        const dirty = code.value.trim() !== starter.trim();
        if (dirty && !window.confirm(
              "This replaces what you have written with the answer. Continue?")) return;
        load(solution);
        if (storeKey) store.set(storeKey, code.value);
        run();
      });
    }

    /* Their work from last time beats the starter code. */
    const saved = storeKey ? store.get(storeKey) : null;
    load(saved !== null ? saved : starter);
    run();
  }

  document.querySelectorAll("[data-sb]").forEach(build);
})();
