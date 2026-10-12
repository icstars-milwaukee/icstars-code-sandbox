/* ============================================================
   THE CODE SANDBOX
   An editor pane and a live preview, side by side, on any page.
   No build step, no npm, no CDN — it works from a file:// path
   and offline, which is the whole point.

   HOW TO PUT ONE ON A PAGE
   ------------------------
   Three blocks of plain text inside one container. You write
   markup; this file builds the editor, the Run button, the
   preview, the console and the line numbers for you.

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

   WHY type="text/plain"
     The browser does not run it and does not parse it as markup,
     so angle brackets and quotes survive exactly as typed. The one
     thing you cannot put in these blocks is the text </script>.

   WHAT THE STUDENT GETS
     Run (or Ctrl+Enter) rebuilds the preview from scratch, so
     there is no stale state to debug. console.log lands in the
     console pane. Errors land there too, in red, with the line
     number counted from line 1 of THEIR code — not line 1 of some
     generated document they never saw.
     Their edits survive a refresh (localStorage). Reset puts the
     starter code back.
   ============================================================ */

(function () {
  "use strict";

  /* Where this file lives tells us where the theme lives, so a
     sandbox works at any folder depth without being told. */
  const SCRIPT_URL  = document.currentScript ? document.currentScript.src : "";
  const THEME_HREF  = SCRIPT_URL ? new URL("../css/theme.css", SCRIPT_URL).href : "";

  const TAB = "  ";          // two spaces. This is not a debate.

  /* Enough of the house theme that a preview still looks like
     i.c.stars if css/theme.css never arrives. Same token values —
     theme.css is loaded after this and overrides all of it. */
  const FALLBACK_CSS = [
    ':root{--ink:#161217;--ink-soft:#231C24;--paper:#FAF6F2;--paper-dim:#EFE8E2;',
    '--red:#D6003C;--red-deep:#A00030;--grey:#9A9095;--grey-dark:#5C5458;',
    '--disp:"Segoe UI","Helvetica Neue",Arial,sans-serif;--mono:Consolas,"Courier New",monospace;--gap:16px}',
    '*{box-sizing:border-box}',
    'body{font-family:var(--disp);color:var(--ink);background:var(--paper);line-height:1.55}',
    '.ics-stage{display:grid;place-items:center;background:var(--ink);',
    'border-bottom:5px solid var(--red);padding:20px}',
    '.ics-sprite{image-rendering:pixelated;transition:filter .35s ease}',
    '.ics-sprite.hidden{filter:brightness(0)}',
    '.ics-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:var(--gap)}',
    '.ics-btn{font:inherit;font-weight:700;cursor:pointer;color:var(--paper);',
    'background:var(--red);border:2px solid var(--red);padding:11px 18px}',
    '.ics-btn:disabled{opacity:.5;cursor:not-allowed}',
    '.ics-note{margin-top:var(--gap);padding:12px 14px;border-left:5px solid var(--grey);',
    'background:var(--paper-dim);font-size:.92rem}',
    '.ics-note.error{border-left-color:var(--red);background:#FBE4EA;color:#7A0022}',
    '.ics-note.success{border-left-color:var(--ink);background:#E8F0E8;color:#1C3A1C}',
    '.ics-out{font-family:var(--mono);font-size:.9rem;white-space:pre-wrap;',
    'background:var(--ink-soft);color:var(--paper);border-left:6px solid var(--red);',
    'padding:16px;margin-top:var(--gap);overflow-x:auto}',
    '.ics-count{color:var(--grey-dark);font-size:.9rem}',
    '.ics-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));',
    'gap:10px;margin-top:var(--gap)}',
    '.ics-choice{font:inherit;font-weight:700;text-transform:capitalize;cursor:pointer;',
    'padding:14px 10px;color:var(--ink);background:#fff;border:2px solid var(--ink)}',
    '.ics-choice.right{background:var(--ink);color:var(--paper)}',
    '.ics-choice.wrong{background:var(--red);color:var(--paper);border-color:var(--red)}',
    '.ics-score{font-family:var(--mono);font-weight:700;font-size:1.1rem;letter-spacing:.08em}',
    '.ics-score b{color:var(--red);font-size:1.4rem}'
  ].join("");

  /* ---------- the bridge ----------------------------------------
     Injected into the preview BEFORE the student's code. It copies
     console output and errors up to the parent page. Written out
     long-hand because its line count is used to map error line
     numbers back onto the student's code. */
  const BRIDGE = [
    '<script>',
    '(function(){',
    '  function fmt(v){',
    '    if (typeof v === "string") return v;',
    '    if (v instanceof Error) return v.name + ": " + v.message;',
    '    if (v === undefined) return "undefined";',
    '    if (v === null) return "null";',
    '    if (typeof v === "object") {',
    '      try { return JSON.stringify(v, null, 2); }',
    '      catch (e) { return String(v); }',
    '    }',
    '    return String(v);',
    '  }',
    '  function send(kind, parts, line){',
    '    try {',
    '      parent.postMessage({ __sb: true, kind: kind,',
    '        text: parts.map(fmt).join(" "), line: (line || null) }, "*");',
    '    } catch (e) {}',
    '  }',
    '  ["log","info","warn","error"].forEach(function(name){',
    '    const original = console[name];',
    '    console[name] = function(){',
    '      send(name === "info" ? "log" : name, [].slice.call(arguments));',
    '      if (original) original.apply(console, arguments);',
    '    };',
    '  });',
    '  window.addEventListener("error", function(e){',
    '    send("error", [e.message], e.lineno);',
    '  });',
    '  window.addEventListener("unhandledrejection", function(e){',
    '    const r = e.reason;',
    '    send("error", [(r && r.message) ? (r.name + ": " + r.message) : String(r)]);',
    '  });',
    '  window.__sbError = function(e){ send("error", [e]); };',
    '  send("ready", []);',
    '})();',
    '<\/script>'
  ].join("\n");

  /* ---------- text helpers ------------------------------------ */

  /* Authors indent these blocks to match their markup. Strip the
     common indent so the editor shows code flush left. */
  function dedent(text) {
    const lines = text.replace(/\t/g, TAB).split("\n");
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();

    let indent = Infinity;
    lines.forEach(function (line) {
      if (!line.trim()) return;
      indent = Math.min(indent, line.match(/^ */)[0].length);
    });
    if (!isFinite(indent)) indent = 0;

    return lines.map(function (line) { return line.slice(indent); }).join("\n");
  }

  function block(root, name) {
    const node = root.querySelector('[data-sb-' + name + ']');
    return node ? dedent(node.textContent) : "";
  }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls)  node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function button(cls, label, title) {
    const b = el("button", cls, label);
    b.type = "button";
    if (title) b.title = title;
    return b;
  }

  /* localStorage is blocked in some file:// setups. A sandbox that
     cannot remember is still a working sandbox, so never throw. */
  const store = {
    get: function (key) {
      try { return window.localStorage.getItem("sb:" + key); }
      catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem("sb:" + key, value); } catch (e) {}
    },
    drop: function (key) {
      try { window.localStorage.removeItem("sb:" + key); } catch (e) {}
    }
  };

  /* ---------- one sandbox ------------------------------------- */
  function build(root) {
    const htmlSrc  = block(root, "html");
    const starter  = block(root, "js");
    const solution = block(root, "solution");
    const storeKey = root.dataset.sbStorage || "";
    const fileName = root.dataset.sbFile || "";

    root.textContent = "";                 // drop the source blocks
    root.classList.add("sb");

    /* --- the toolbar --- */
    const bar = el("div", "sb-bar");
    bar.appendChild(el("span", "sb-label", "JavaScript"));
    if (fileName) bar.appendChild(el("span", "sb-file", fileName));

    const actions = el("div", "sb-actions");
    const runBtn   = button("sb-btn sb-run", "Run ▸", "Ctrl + Enter");
    const resetBtn = button("sb-btn", "Reset", "Put the starter code back");
    actions.appendChild(runBtn);
    actions.appendChild(resetBtn);

    let solveBtn = null;
    if (solution) {
      solveBtn = button("sb-btn", "Solution", "Replace the editor with the answer");
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
    code.setAttribute("aria-label", "Code editor" + (fileName ? " for " + fileName : ""));
    code.wrap = "off";
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
    const clearBtn    = button("sb-clear", "clear", "Empty the console");
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
    code.addEventListener("scroll", function () {
      gutter.scrollTop = code.scrollTop;
    });

    code.addEventListener("keydown", function (e) {
      /* Tab indents instead of leaving the box. Esc first, then
         Tab, still gets a keyboard user out — the hint says so. */
      if (e.key === "Tab") {
        e.preventDefault();
        const start = code.selectionStart;
        const end   = code.selectionEnd;
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

    /* ---------- the console pane --------------------------- */
    function clearLog() {
      log.textContent = "";
      log.classList.remove("has-error");
    }

    function append(kind, text, line) {
      const row = el("div", "sb-line sb-" + kind);
      if (line) row.appendChild(el("span", "sb-lineno", "line " + line));
      row.appendChild(el("span", "sb-text", text));
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
      if (kind === "error") log.classList.add("has-error");
    }

    clearBtn.addEventListener("click", clearLog);

    /* ---------- the runner ---------------------------------- */
    /* Rebuilt from scratch on every run. A fresh document means a
       student never debugs state left over from the last attempt. */
    let prefixLines = 0;

    function docFor(js) {
      const head = '<!doctype html><html><head><meta charset="utf-8">'
        /* FALLBACK FIRST, then the real theme. A preview frame can
           fail to load an external stylesheet (some browsers are
           strict about file:// subresources), and an unstyled
           preview on night one is the exact failure this component
           exists to prevent. Later rules win, so when theme.css
           does load it overrides every line of this. */
        + '<style>' + FALLBACK_CSS + '</style>'
        + (THEME_HREF ? '<link rel="stylesheet" href="' + THEME_HREF + '">' : "")
        /* Preview-only layout, after the theme so it wins. */
        + '<style>html,body{margin:0}body{padding:14px 16px}'
        + '.ics-stage{min-height:180px}.ics-sprite{width:150px;height:150px}</style>'
        + '</head><body>\n';

      /* Everything before the student's first line, so an error at
         their line 1 is reported as line 1. */
      const prefix = head + htmlSrc + "\n" + BRIDGE
        + '\n<script>\n(async function () {\n';

      const suffix = '\n})().catch(function (e) {\n'
        + '  window.__sbError(e instanceof Error ? (e.name + ": " + e.message) : String(e));\n'
        + '});\n<\/script>\n</body></html>';

      prefixLines = prefix.split("\n").length - 1;
      return prefix + js + suffix;
    }

    function run() {
      clearLog();
      root.classList.add("sb-running");
      frame.srcdoc = docFor(code.value);
    }

    /* Only listen to OUR iframe. The preview has an inherited
       origin here, so checking event.origin proves nothing — the
       source window is the thing worth checking. */
    window.addEventListener("message", function (e) {
      if (e.source !== frame.contentWindow) return;
      const msg = e.data;
      if (!msg || msg.__sb !== true) return;

      if (msg.kind === "ready") {
        root.classList.remove("sb-running");
        return;
      }

      /* Map the document line back onto the student's own line 1.
         Only label it if the result is inside their code — a wrong
         line number is worse than no line number. */
      let line = null;
      if (msg.line) {
        const mapped = msg.line - prefixLines;
        if (mapped >= 1 && mapped <= code.value.split("\n").length) line = mapped;
      }
      append(msg.kind, msg.text, line);
    });

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
