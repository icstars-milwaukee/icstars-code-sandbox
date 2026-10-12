/* ============================================================
   THE LIVE EDITOR  —  the workshop's app, full screen

   A sidebar of the app's files down the left. Click one and you
   pull it into the editor. Edit it, press Run, and watch what you
   changed in the pane on the right.

   A workshop IS its app: index.html at the workshop root, its code
   in js/. That folder opens and runs on its own straight off disk,
   and it is what students end up editing. This page is how you
   browse and break it without a server.
   The engine is js/preview-core.js.

   It takes the entire viewport on purpose. An editor in a 980px
   column with a page header above it reads as a widget you are
   allowed to glance at. This is the page.

   HOW TO PUT ONE ON A PAGE
   ------------------------
   One container, one plain-text block per file. One of them must be
   index.html — that is the app's entry point.

     <link rel="stylesheet" href="../../css/theme.css">
     <link rel="stylesheet" href="../../css/playground.css">
     <body class="pg-page">

     <div data-pg
          data-pg-storage="01-hello-api"
          data-pg-title="Who's That Pokémon?"
          data-pg-back="index.html"
          data-pg-root="workshops/01-hello-api/">

       <script type="text/plain" data-pg-file="index.html">
         ...
       </script>
       <script type="text/plain" data-pg-file="js/main.js">
         ...
       </script>

     </div>

     <script src="../../js/preview-core.js"></script>
     <script src="../../js/playground.js"></script>

   When it runs, every local <link> and <script src> in index.html is
   resolved against the other declared files and inlined, so the
   preview is one self-contained document and needs no server.

   A browser on a file:// path cannot read a folder, so these blocks
   are written by tools/build-playground.py from the real app files.
   Edit the real files, then re-run the tool.
   ============================================================ */

(function () {
  "use strict";

  const CORE = window.ICS_PREVIEW;
  if (!CORE) {
    console.error("playground.js: load js/preview-core.js first.");
    return;
  }

  const el = CORE.el, btn = CORE.btn, store = CORE.store, TAB = CORE.TAB;
  const SCRIPT_URL = document.currentScript ? document.currentScript.src : "";
  const THEME_HREF = CORE.themeHref(SCRIPT_URL);

  const ENTRY  = "index.html";
  const NARROW = 860;          // below this, start with the sidebar closed

  /* Which language the toolbar announces. Label only. */
  function kindOf(path) {
    if (/\.html?$/i.test(path)) return "HTML";
    if (/\.css$/i.test(path))   return "CSS";
    if (/\.js$/i.test(path))    return "JavaScript";
    return "Text";
  }

  /* "js/../css/a.css" -> "css/a.css". Enough path resolution for one
     app folder, including the ../ its pages use to reach the shared
     theme — which resolves outside the app and so stays external. */
  function resolve(href) {
    const out = [];
    href.split("/").forEach(function (part) {
      if (!part || part === ".") return;
      if (part === "..") { out.pop(); return; }
      out.push(part);
    });
    return out.join("/");
  }

  function build(root) {
    /* ---------- read the declared file set ------------------- */
    const pristine = {};                   // path -> original text
    root.querySelectorAll("[data-pg-file]").forEach(function (node) {
      pristine[node.dataset.pgFile] = CORE.readBlock(node);
    });

    const paths = Object.keys(pristine).sort();
    if (!paths.length) {
      root.textContent = "No files declared in this editor.";
      return;
    }

    const storeKey = root.dataset.pgStorage || "";
    const title    = root.dataset.pgTitle   || "Workshop";
    const backHref = root.dataset.pgBack    || "";
    const diskRoot = root.dataset.pgRoot    || "";

    const files = {};                      // path -> current text
    paths.forEach(function (p) {
      const saved = storeKey ? store.get(storeKey + ":" + p) : null;
      files[p] = (saved !== null && saved !== undefined) ? saved : pristine[p];
    });

    root.textContent = "";
    root.classList.add("pg");

    /* ---------- the bar ------------------------------------- */
    const bar = el("div", "pg-bar");

    const sideBtn = btn("pg-icon", "☰", "Show or hide the file sidebar");
    sideBtn.setAttribute("aria-expanded", "true");
    bar.appendChild(sideBtn);

    const brand = el("span", "pg-brand");
    brand.innerHTML = 'i.c.stars<span class="pipe">|</span><span class="star">*</span>';
    bar.appendChild(brand);

    if (backHref) {
      const back = el("a", "pg-back", "← " + title);
      back.href = backHref;
      bar.appendChild(back);
    } else {
      bar.appendChild(el("span", "pg-back", title));
    }

    const kind  = el("span", "pg-kind", "");
    const crumb = el("span", "pg-crumb", "");
    bar.appendChild(kind);
    bar.appendChild(crumb);

    const actions  = el("div", "pg-actions");
    const runBtn   = btn("pg-btn pg-run", "Run ▸", "Ctrl + Enter");
    const resetOne = btn("pg-btn", "Reset file", "Undo your changes to this file");
    const resetAll = btn("pg-btn", "Reset all", "Undo your changes to every file");
    actions.appendChild(runBtn);
    actions.appendChild(resetOne);
    actions.appendChild(resetAll);
    actions.appendChild(el("span", "pg-key", "Ctrl + Enter"));
    bar.appendChild(actions);
    root.appendChild(bar);

    /* ---------- sidebar, editor, result -------------------- */
    const body = el("div", "pg-body");

    const side = el("nav", "pg-side");
    side.setAttribute("aria-label", "App files");
    side.appendChild(el("div", "pg-side-head", "The app"));

    /* Search the app. Matches a path OR what is inside the file,
       because "where did we write fetch?" is the question people
       actually have, and the filename never answers it. */
    const searchWrap = el("div", "pg-search");
    const search = document.createElement("input");
    search.type = "search";
    search.className = "pg-search-input";
    search.placeholder = "Search these files…";
    search.setAttribute("aria-label", "Search file names and file contents");
    searchWrap.appendChild(search);
    const searchCount = el("div", "pg-search-count", "");
    searchWrap.appendChild(searchCount);
    side.appendChild(searchWrap);

    const sideList = el("div", "pg-side-list");
    side.appendChild(sideList);

    const foot = el("div", "pg-side-foot");
    foot.appendChild(el("b", null, "Break it on purpose."));
    foot.appendChild(el("span", null,
      diskRoot ? " These are real files, in " + diskRoot + " — the folder also opens and "
               + "runs on its own. js/main.js ends with a list of things worth breaking."
               : " js/main.js ends with a list of things worth breaking."));
    side.appendChild(foot);
    body.appendChild(side);

    const editorWrap = el("div", "pg-editor");
    const gutter = el("div", "pg-gutter");
    const code   = el("textarea", "pg-code");
    code.spellcheck = false;
    code.wrap = "off";
    code.setAttribute("aria-label", "File editor");
    editorWrap.appendChild(gutter);
    editorWrap.appendChild(code);
    body.appendChild(editorWrap);

    const right  = el("div", "pg-right");

    const result = el("div", "pg-result");
    result.appendChild(el("div", "pg-pane-label", "Result"));
    const frame = document.createElement("iframe");
    frame.className = "pg-frame";
    frame.title = "Live preview";
    result.appendChild(frame);
    right.appendChild(result);

    const consoleWrap = el("div", "pg-console");
    const consoleHead = el("div", "pg-pane-label", "Console");
    const clearBtn    = btn("pg-clear", "clear", "Empty the console");
    const foldBtn     = btn("pg-clear", "hide", "Collapse the console");
    consoleHead.appendChild(clearBtn);
    consoleHead.appendChild(foldBtn);
    consoleWrap.appendChild(consoleHead);
    const log = el("div", "pg-log");
    consoleWrap.appendChild(log);
    right.appendChild(consoleWrap);

    body.appendChild(right);
    root.appendChild(body);

    /* ---------- state -------------------------------------- */
    let openPath = null;                   // the file in the editor

    const preview = CORE.createPreview(frame, log, {
      lineCount: function () { return code.value.split("\n").length; },
      onStart: function () { root.classList.add("pg-running"); },
      onReady: function () { root.classList.remove("pg-running"); }
    });

    /* ---------- assembling a runnable document -------------
       Take index.html and fold the app's own CSS and JS into it, so
       the preview is one self-contained document that needs no
       server and no relative paths. */
    function assemble() {
      let doc = files[ENTRY];
      if (doc === undefined) {
        return { doc: "<p>There is no <code>index.html</code> here, so there is nothing "
                    + "to run. Open a file on the left to read it.</p>", offset: 0 };
      }

      /* Stylesheets: ours get inlined, the shared theme gets an
         absolute URL, anything else is dropped rather than left
         pointing at a path that cannot resolve in a preview. */
      doc = doc.replace(/<link\b[^>]*href="([^"]+)"[^>]*>/gi, function (tag, href) {
        if (/^(https?:)?\/\//i.test(href)) return tag;
        const target = resolve(href);
        if (files[target] !== undefined) {
          return '<style>\n' + files[target] + '\n</style>';
        }
        if (/theme\.css$/i.test(href) && THEME_HREF) {
          return '<link rel="stylesheet" href="' + THEME_HREF + '">';
        }
        return "";
      });

      /* Scripts: inline ours, drop the rest. */
      doc = doc.replace(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>\s*<\/script>/gi,
        function (tag, src) {
          if (/^(https?:)?\/\//i.test(src)) return tag;
          const target = resolve(src);
          if (files[target] !== undefined) {
            return '<script>\n' + files[target] + '\n<\/script>';
          }
          return "";
        });

      /* The fallback stylesheet and the console bridge go at the top
         of <head>: the fallback so the real theme (which comes later
         in the document) still wins, the bridge so it is installed
         before any of the app's own scripts run. */
      const inject = '<style>' + CORE.FALLBACK_CSS + '</style>\n' + CORE.BRIDGE + '\n';
      if (/<head[^>]*>/i.test(doc)) {
        doc = doc.replace(/<head[^>]*>/i, function (m) { return m + "\n" + inject; });
      } else {
        doc = inject + doc;
      }

      /* How many lines sit above the open file's content, so an
         error in it still reports the line the student edited. */
      let offset = 0;
      if (openPath && openPath !== ENTRY && files[openPath]) {
        const at = doc.indexOf(files[openPath]);
        if (at > -1) offset = doc.slice(0, at).split("\n").length - 1;
      }
      return { doc: doc, offset: offset };
    }

    function run() {
      const built = assemble();
      preview.runDocument(built.doc, built.offset);
    }

    /* ---------- the editor --------------------------------- */
    function paintGutter() {
      const lines = code.value.split("\n").length;
      let text = "";
      for (let i = 1; i <= lines; i++) text += i + "\n";
      gutter.textContent = text;
      gutter.scrollTop = code.scrollTop;
    }

    function markSide() {
      sideList.querySelectorAll(".pg-file").forEach(function (b) {
        const on = b.dataset.path === openPath;
        b.classList.toggle("is-open", on);
        if (on) { b.setAttribute("aria-current", "true"); }
        else    { b.removeAttribute("aria-current"); }
      });
    }

    function openFile(path, andRun) {
      openPath = path;

      code.value = files[path];
      paintGutter();

      crumb.textContent = path;
      kind.textContent  = kindOf(path);
      /* An edited file is worth saying out loud — it explains why
         Reset exists and why their work survived the refresh. */
      crumb.classList.toggle("is-dirty", files[path] !== pristine[path]);

      markSide();
      /* On a phone the sidebar covers the editor, so choosing a file
         should get out of the way. */
      if (window.innerWidth < NARROW) closeSide();
      if (andRun) run();
    }

    code.addEventListener("input", function () {
      if (!openPath) return;
      files[openPath] = code.value;
      if (storeKey) store.set(storeKey + ":" + openPath, code.value);
      crumb.classList.toggle("is-dirty", files[openPath] !== pristine[openPath]);
      paintGutter();
    });
    code.addEventListener("scroll", function () { gutter.scrollTop = code.scrollTop; });

    code.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = code.selectionStart, end = code.selectionEnd;
        code.value = code.value.slice(0, start) + TAB + code.value.slice(end);
        code.selectionStart = code.selectionEnd = start + TAB.length;
        if (openPath) {
          files[openPath] = code.value;
          if (storeKey) store.set(storeKey + ":" + openPath, code.value);
        }
        paintGutter();
        return;
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); return; }
      if (e.key === "Escape") code.blur();
    });

    /* ---------- the sidebar -------------------------------- */
    /* Folders are built from the paths themselves, so adding a css/
       folder to the app makes one appear here. */
    function nest(fileList) {
      const top = { dirs: {}, files: [] };
      fileList.forEach(function (path) {
        const parts = path.split("/");
        let node = top;
        parts.forEach(function (part, i) {
          if (i === parts.length - 1) { node.files.push({ name: part, path: path }); return; }
          node.dirs[part] = node.dirs[part] || { dirs: {}, files: [] };
          node = node.dirs[part];
        });
      });
      return top;
    }

    function renderNode(node, into) {
      /* Files before subfolders, so index.html is the first thing
         in the sidebar rather than buried under js/. */
      node.files.slice().sort(function (a, b) {
        if (a.name === ENTRY) return -1;
        if (b.name === ENTRY) return 1;
        return a.name.localeCompare(b.name);
      }).forEach(function (f) {
        const b = btn("pg-file", "", f.path);
        b.appendChild(el("span", "pg-name", f.name));
        b.appendChild(el("span", "pg-hits", ""));   // filled in by the search
        b.dataset.path = f.path;
        if (f.path === ENTRY) b.appendChild(el("span", "pg-entry", "runs"));
        b.addEventListener("click", function () { openFile(f.path, true); });
        into.appendChild(b);
      });

      Object.keys(node.dirs).sort().forEach(function (name) {
        const d = document.createElement("details");
        d.className = "pg-subfolder";
        d.open = true;
        const s = document.createElement("summary");
        s.textContent = name + "/";
        d.appendChild(s);
        const kids = el("div", "pg-children");
        renderNode(node.dirs[name], kids);
        d.appendChild(kids);
        into.appendChild(d);
      });
    }

    renderNode(nest(paths), sideList);

    /* ---------- searching the app ------------------------- */
    /* A couple of small files, so this runs straight through on
       every keystroke — no debounce needed. */
    function countHits(haystack, needle) {
      let hits = 0, at = haystack.indexOf(needle);
      while (at > -1) { hits++; at = haystack.indexOf(needle, at + needle.length); }
      return hits;
    }

    function applySearch() {
      const term = search.value.trim().toLowerCase();
      root.classList.toggle("is-searching", term.length > 0);

      if (!term) {
        sideList.querySelectorAll("[hidden]").forEach(function (n) { n.hidden = false; });
        sideList.querySelectorAll(".pg-hits").forEach(function (n) { n.textContent = ""; });
        return;
      }

      let shown = 0;
      sideList.querySelectorAll(".pg-file").forEach(function (b) {
        const path = b.dataset.path;
        const hits = countHits((files[path] || "").toLowerCase(), term);
        const show = path.toLowerCase().indexOf(term) > -1 || hits > 0;

        b.hidden = !show;
        b.querySelector(".pg-hits").textContent = hits ? "×" + hits : "";
        if (show) shown++;
      });

      /* A subfolder with nothing left in it goes too. */
      sideList.querySelectorAll(".pg-subfolder").forEach(function (sub) {
        sub.hidden = !sub.querySelector(".pg-file:not([hidden])");
      });

      searchCount.textContent = shown
        ? shown + (shown === 1 ? " file matches" : " files match")
        : "nothing matches that";
    }

    search.addEventListener("input", applySearch);
    search.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { search.value = ""; applySearch(); search.blur(); }
    });

    /* ---------- buttons ----------------------------------- */
    function closeSide() {
      root.classList.add("side-closed");
      sideBtn.setAttribute("aria-expanded", "false");
    }

    runBtn.addEventListener("click", run);
    clearBtn.addEventListener("click", preview.clear);

    sideBtn.addEventListener("click", function () {
      const closed = root.classList.toggle("side-closed");
      sideBtn.setAttribute("aria-expanded", String(!closed));
    });

    foldBtn.addEventListener("click", function () {
      const closed = root.classList.toggle("console-closed");
      foldBtn.textContent = closed ? "show" : "hide";
      foldBtn.title = closed ? "Show the console" : "Collapse the console";
    });

    resetOne.addEventListener("click", function () {
      if (!openPath) return;
      files[openPath] = pristine[openPath];
      if (storeKey) store.drop(storeKey + ":" + openPath);
      openFile(openPath, true);
    });

    resetAll.addEventListener("click", function () {
      if (!window.confirm("Put every file back how it started?")) return;
      paths.forEach(function (p) {
        files[p] = pristine[p];
        if (storeKey) store.drop(storeKey + ":" + p);
      });
      openFile(openPath || paths[0], true);
    });

    /* Open the code, not the markup: js/main.js is where the lesson
       is, and index.html is markup they did not come here to read.
       Then run. */
    const firstJs = paths.filter(function (p) { return /\.js$/i.test(p); })[0];
    openFile(firstJs || ENTRY, true);

    if (window.innerWidth >= NARROW) {
      root.classList.remove("side-closed");
      sideBtn.setAttribute("aria-expanded", "true");
    }
  }

  document.querySelectorAll("[data-pg]").forEach(build);
})();
