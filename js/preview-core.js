/* ============================================================
   PREVIEW CORE
   The machinery shared by the two live-code components:

     js/sandbox.js     one editor, one file  (on a step page)
     js/playground.js  a file tree, many files (the whole workshop)

   Nothing in here touches the page. It builds preview documents,
   bridges console output back out of them, and holds the three
   helpers both components would otherwise copy.

   Load it BEFORE either component:
     <script src="../../js/preview-core.js"></script>
     <script src="../../js/sandbox.js"></script>
   ============================================================ */

window.ICS_PREVIEW = (function () {
  "use strict";

  const TAB = "  ";          // two spaces. This is not a debate.

  /* ---------- the fallback stylesheet -------------------------
     Enough of the house theme that a preview still looks like
     i.c.stars if css/theme.css never arrives (some browsers are
     strict about file:// subresources inside a frame). Same token
     values; theme.css loads after this and overrides all of it.
     An unstyled preview on night one is the exact failure these
     components exist to prevent. */
  const FALLBACK_CSS = [
    ':root{--ink:#161217;--ink-soft:#231C24;--paper:#FAF6F2;--paper-dim:#EFE8E2;',
    '--red:#D6003C;--red-deep:#A00030;--grey:#9A9095;--grey-dark:#5C5458;',
    '--disp:"Segoe UI","Helvetica Neue",Arial,sans-serif;',
    '--mono:Consolas,"Courier New",monospace;--gap:16px}',
    '*{box-sizing:border-box}',
    'body{font-family:var(--disp);color:var(--ink);background:var(--paper);line-height:1.55}',
    '.ics-wrap{max-width:980px;margin:0 auto;padding:16px}',
    '.ics-header{background:var(--ink);border-bottom:5px solid var(--red);',
    'color:var(--paper);padding:16px}',
    '.ics-title{margin:8px 0 4px;font-size:1.6rem;font-weight:900;text-transform:uppercase}',
    '.ics-sub{margin:0;color:var(--grey);font-size:.95rem}',
    '.ics-step{display:inline-block;background:var(--red);color:var(--paper);font-weight:700;',
    'font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;padding:5px 11px}',
    '.ics-stage{display:grid;place-items:center;background:var(--ink);',
    'border-bottom:5px solid var(--red);padding:20px}',
    '.ics-sprite{image-rendering:pixelated;transition:filter .35s ease}',
    '.ics-sprite.hidden{filter:brightness(0)}',
    '.ics-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:var(--gap)}',
    '.ics-btn{font:inherit;font-weight:700;cursor:pointer;color:var(--paper);',
    'background:var(--red);border:2px solid var(--red);padding:11px 18px}',
    '.ics-btn:disabled{opacity:.5;cursor:not-allowed}',
    '.ics-input{font:inherit;width:100%;max-width:360px;padding:11px 12px;',
    'background:#fff;border:1px solid var(--grey)}',
    '.ics-note{margin-top:var(--gap);padding:12px 14px;border-left:5px solid var(--grey);',
    'background:var(--paper-dim);font-size:.92rem}',
    '.ics-note.error{border-left-color:var(--red);background:#FBE4EA;color:#7A0022}',
    '.ics-note.success{border-left-color:var(--ink);background:#E8F0E8;color:#1C3A1C}',
    '.ics-out{font-family:var(--mono);font-size:.9rem;white-space:pre-wrap;',
    'background:var(--ink-soft);color:var(--paper);border-left:6px solid var(--red);',
    'padding:16px;margin-top:var(--gap);overflow-x:auto}',
    '.ics-count{color:var(--grey-dark);font-size:.9rem}',
    '.ics-card{background:#fff;border:1px solid var(--paper-dim);',
    'border-top:4px solid var(--red);padding:16px}',
    '.ics-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));',
    'gap:var(--gap);margin-top:var(--gap)}',
    '.ics-choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));',
    'gap:10px;margin-top:var(--gap)}',
    '.ics-choice{font:inherit;font-weight:700;text-transform:capitalize;cursor:pointer;',
    'padding:14px 10px;color:var(--ink);background:#fff;border:2px solid var(--ink)}',
    '.ics-choice.right{background:var(--ink);color:var(--paper)}',
    '.ics-choice.wrong{background:var(--red);color:var(--paper);border-color:var(--red)}',
    '.ics-score{font-family:var(--mono);font-weight:700;font-size:1.1rem;letter-spacing:.08em}',
    '.ics-score b{color:var(--red);font-size:1.4rem}',
    '.ics-footer{margin-top:24px;padding-top:12px;border-top:1px solid var(--paper-dim);',
    'color:var(--grey);font-size:.85rem}',
    'code{font-family:var(--mono);background:var(--paper-dim);padding:1px 5px}'
  ].join("");

  /* ---------- the bridge --------------------------------------
     Injected into every preview BEFORE the student's code. It
     copies console output and errors up to the hosting page.
     Written out long-hand because its line count is part of the
     offset that maps error lines back onto the student's code. */
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

  /* ---------- small helpers ----------------------------------- */

  /* Authors indent these code blocks to match their markup.
     Strip the common indent so the editor shows code flush left. */
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

  /* A declared block lives inside <script type="text/plain">, and
     the HTML parser ends that element at the first </script> no
     matter what type says. So a block that needs to CONTAIN one —
     any project page with a <script src=...> tag in it — writes
     it as <\/script> and we put the slash back here. It is the
     one escape in the whole format. */
  function unescapeScriptTags(text) {
    return text.split("<\\/script>").join("<\/script>");
  }

  function readBlock(node) {
    return unescapeScriptTags(dedent(node.textContent));
  }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls)  node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function btn(cls, label, title) {
    const b = el("button", cls, label);
    b.type = "button";
    if (title) b.title = title;
    return b;
  }

  /* Where this script lives tells us where the theme lives, so a
     component works at any folder depth without being told. */
  function themeHref(scriptSrc) {
    try { return new URL("../css/theme.css", scriptSrc).href; }
    catch (e) { return ""; }
  }

  /* localStorage is blocked in some file:// setups. A component
     that cannot remember is still usable, so never throw. */
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

  /* ---------- a preview bound to one iframe -------------------
     opts.head      extra <head> HTML, after the fallback CSS
     opts.lineCount () -> how many lines the editor holds, so a
                    mapped error line can be sanity-checked
     opts.onStart / opts.onReady   for busy styling
   ------------------------------------------------------------- */
  function createPreview(frame, log, opts) {
    opts = opts || {};
    let prefixLines = 0;

    function clear() {
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

    /* Only listen to OUR iframe. A preview inherits this page's
       origin, so checking event.origin proves nothing — the source
       window is the thing worth checking. */
    window.addEventListener("message", function (e) {
      if (e.source !== frame.contentWindow) return;
      const msg = e.data;
      if (!msg || msg.__sb !== true) return;

      if (msg.kind === "ready") {
        if (opts.onReady) opts.onReady();
        return;
      }

      /* Map the document line back onto the student's line 1. Only
         label it when the result lands inside their code — a wrong
         line number is worse than no line number. */
      let line = null;
      if (msg.line) {
        const mapped = msg.line - prefixLines;
        const max = opts.lineCount ? opts.lineCount() : 0;
        if (mapped >= 1 && (!max || mapped <= max)) line = mapped;
      }
      append(msg.kind, msg.text, line);
    });

    /* Every run rebuilds the document from scratch, so nobody ever
       debugs state left over from the last attempt. */
    function run(bodyHtml, js) {
      clear();
      if (opts.onStart) opts.onStart();

      const prefix = '<!doctype html><html><head><meta charset="utf-8">'
        + '<style>' + FALLBACK_CSS + '</style>'
        + (opts.head || "")
        + '</head><body>\n'
        + (bodyHtml || "") + '\n'
        + BRIDGE
        + '\n<script>\n(async function () {\n';

      const suffix = '\n})().catch(function (e) {\n'
        + '  window.__sbError(e instanceof Error ? (e.name + ": " + e.message) : String(e));\n'
        + '});\n<\/script>\n</body></html>';

      prefixLines = prefix.split("\n").length - 1;
      frame.srcdoc = prefix + (js || "") + suffix;
    }

    /* For the playground, where the document IS the student's file
       set. The caller works out how many lines of the assembled
       document sit above the file currently open in the editor, so
       error lines still land on the line they actually edited. */
    function runDocument(doc, offsetLines) {
      clear();
      if (opts.onStart) opts.onStart();
      prefixLines = offsetLines || 0;
      frame.srcdoc = doc;
    }

    return { run: run, runDocument: runDocument, clear: clear, append: append,
             bridge: BRIDGE, fallbackCss: FALLBACK_CSS };
  }

  return {
    TAB: TAB,
    FALLBACK_CSS: FALLBACK_CSS,
    BRIDGE: BRIDGE,
    dedent: dedent,
    readBlock: readBlock,
    unescapeScriptTags: unescapeScriptTags,
    el: el,
    btn: btn,
    themeHref: themeHref,
    store: store,
    createPreview: createPreview
  };
})();
