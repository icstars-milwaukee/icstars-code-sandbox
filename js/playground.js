/* ============================================================
   THE PLAYGROUND  —  a file tree, the whole workshop

   The workshop's folders down the left. Click a folder and the
   project runs. Click a file and it opens in the editor. Edit it,
   press Run, and watch what you changed.

   This is the "break it and see" surface. The step pages give a
   student one file at a time with blanks in it (js/sandbox.js);
   this gives them everything at once, already working, to take
   apart. Both are the same engine underneath (js/preview-core.js).

   HOW TO PUT ONE ON A PAGE
   ------------------------
   One container, one plain-text block per file. The first segment
   of each path is the project — that's what becomes a folder you
   can click to run.

     <link rel="stylesheet" href="../../css/playground.css">

     <div data-pg data-pg-storage="01-hello-api">

       <script type="application/json" data-pg-labels>
         { "step-1-i-do": "Step 1 · I do", "game": "The finished game" }
       </script>

       <script type="text/plain" data-pg-file="step-1-i-do/index.html">
         ...
       </script>
       <script type="text/plain" data-pg-file="step-1-i-do/js/step-1.js">
         ...
       </script>

     </div>

     <script src="../../js/preview-core.js"></script>
     <script src="../../js/playground.js"></script>

   Each project needs an index.html — that's its entry point. When
   a project runs, every local <link> and <script src> in its
   index.html is resolved against the other files in that project
   and inlined, so the preview is one self-contained document and
   needs no server.

   These pages are generated from the real workshop files by
   tools/build-playground.py. Edit the workshop, re-run the tool.
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

  /* Which editor mode a path implies. Only used for the label. */
  function kindOf(path) {
    if (/\.html?$/i.test(path)) return "HTML";
    if (/\.css$/i.test(path))   return "CSS";
    if (/\.js$/i.test(path))    return "JavaScript";
    return "Text";
  }

  /* "step-1/js/a.js" + "css/b.css" -> "step-1/css/b.css"
     Enough path resolution for one folder of files, including the
     ../ that workshop pages use to reach the shared theme. */
  function resolve(projectRoot, href) {
    const parts = (projectRoot + "/" + href).split("/");
    const out = [];
    parts.forEach(function (part) {
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

    let labels = {};
    const labelNode = root.querySelector("[data-pg-labels]");
    if (labelNode) {
      try { labels = JSON.parse(labelNode.textContent); }
      catch (e) { console.warn("playground: data-pg-labels is not valid JSON"); }
    }

    const paths = Object.keys(pristine).sort();
    if (!paths.length) {
      root.textContent = "No files declared in this playground.";
      return;
    }

    const storeKey = root.dataset.pgStorage || "";
    const files = {};                      // path -> current text
    paths.forEach(function (p) {
      const saved = storeKey ? store.get(storeKey + ":" + p) : null;
      files[p] = (saved !== null && saved !== undefined) ? saved : pristine[p];
    });

    /* Projects, in declared order, each with its own file list. */
    const projects = [];
    paths.forEach(function (p) {
      const name = p.split("/")[0];
      let project = projects.filter(function (x) { return x.name === name; })[0];
      if (!project) { project = { name: name, files: [] }; projects.push(project); }
      project.files.push(p);
    });

    root.textContent = "";
    root.classList.add("pg");

    /* ---------- toolbar ------------------------------------- */
    const bar   = el("div", "pg-bar");
    const crumb = el("span", "pg-crumb", "");
    const kind  = el("span", "pg-kind", "");
    bar.appendChild(kind);
    bar.appendChild(crumb);

    const actions   = el("div", "pg-actions");
    const runBtn    = btn("sb-btn sb-run", "Run ▸", "Ctrl + Enter");
    const resetOne  = btn("sb-btn", "Reset file", "Undo your changes to this file");
    const resetAll  = btn("sb-btn", "Reset all", "Undo your changes to every file here");
    actions.appendChild(runBtn);
    actions.appendChild(resetOne);
    actions.appendChild(resetAll);
    actions.appendChild(el("span", "sb-key", "Ctrl + Enter"));
    bar.appendChild(actions);
    root.appendChild(bar);

    /* ---------- three panes -------------------------------- */
    const body = el("div", "pg-body");

    const tree = el("nav", "pg-tree");
    tree.setAttribute("aria-label", "Workshop files");
    body.appendChild(tree);

    const editorWrap = el("div", "pg-editor");
    const gutter = el("div", "sb-gutter");
    const code   = el("textarea", "sb-code");
    code.spellcheck = false;
    code.wrap = "off";
    code.setAttribute("aria-label", "File editor");
    editorWrap.appendChild(gutter);
    editorWrap.appendChild(code);
    body.appendChild(editorWrap);

    const right  = el("div", "pg-right");

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

    body.appendChild(right);
    root.appendChild(body);

    /* ---------- state -------------------------------------- */
    let openPath    = null;                // the file in the editor
    let openProject = null;                // the project being run

    const preview = CORE.createPreview(frame, log, {
      lineCount: function () { return code.value.split("\n").length; },
      onStart: function () { root.classList.add("sb-running"); },
      onReady: function () { root.classList.remove("sb-running"); }
    });

    /* ---------- assembling a runnable document -------------
       Take the project's index.html and fold its own CSS and JS
       into it, so the preview is one self-contained document that
       needs no server and no relative paths. */
    function assemble(project) {
      const entry = project.name + "/index.html";
      let doc = files[entry];
      if (doc === undefined) {
        return { doc: "<p>This folder has no <code>index.html</code>, so there is "
                    + "nothing to run. Open a file on the left to read it.</p>",
                 offset: 0 };
      }

      /* Stylesheets: ours get inlined, the shared theme gets an
         absolute URL, anything else is dropped rather than left
         pointing at a path that cannot resolve in a preview. */
      doc = doc.replace(/<link\b[^>]*href="([^"]+)"[^>]*>/gi, function (tag, href) {
        if (/^(https?:)?\/\//i.test(href)) return tag;
        const target = resolve(project.name, href);
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
          const target = resolve(project.name, src);
          if (files[target] !== undefined) {
            return '<script>\n' + files[target] + '\n<\/script>';
          }
          return "";
        });

      /* The fallback stylesheet and the console bridge go at the
         top of <head>: the fallback so the real theme (which comes
         later in the document) still wins, the bridge so it is
         installed before any of the workshop's own scripts run. */
      const inject = '<style>' + CORE.FALLBACK_CSS + '</style>\n' + CORE.BRIDGE + '\n';
      if (/<head[^>]*>/i.test(doc)) {
        doc = doc.replace(/<head[^>]*>/i, function (m) { return m + "\n" + inject; });
      } else {
        doc = inject + doc;
      }

      /* How many lines sit above the open file's content, so an
         error in it still reports the line the student edited. */
      let offset = 0;
      if (openPath && openPath !== entry && files[openPath]) {
        const at = doc.indexOf(files[openPath]);
        if (at > -1) offset = doc.slice(0, at).split("\n").length - 1;
      }
      return { doc: doc, offset: offset };
    }

    function run() {
      if (!openProject) return;
      const built = assemble(openProject);
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

    function markTree() {
      tree.querySelectorAll(".pg-file").forEach(function (b) {
        const on = b.dataset.path === openPath;
        b.classList.toggle("is-open", on);
        if (on) { b.setAttribute("aria-current", "true"); }
        else    { b.removeAttribute("aria-current"); }
      });
      tree.querySelectorAll(".pg-folder").forEach(function (d) {
        d.classList.toggle("is-running",
          openProject && d.dataset.project === openProject.name);
      });
    }

    function openFile(path, andRun) {
      openPath    = path;
      openProject = projects.filter(function (p) {
        return p.name === path.split("/")[0];
      })[0] || null;

      code.value = files[path];
      paintGutter();

      crumb.textContent = path;
      kind.textContent  = kindOf(path);
      /* An edited file is worth saying out loud — it explains why
         Reset exists and why their work survived the refresh. */
      crumb.classList.toggle("is-dirty", files[path] !== pristine[path]);

      markTree();
      if (andRun) run();
    }

    function openProjectByName(name, andRun) {
      const project = projects.filter(function (p) { return p.name === name; })[0];
      if (!project) return;
      const entry = name + "/index.html";
      openFile(files[entry] !== undefined ? entry : project.files[0], andRun);
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

    /* ---------- the tree ----------------------------------- */
    /* Nested folders, built from the paths themselves, so adding
       a css/ folder to a workshop makes one appear here. */
    function nest(fileList, projectName) {
      const top = { dirs: {}, files: [] };
      fileList.forEach(function (path) {
        const rest = path.slice(projectName.length + 1).split("/");
        let node = top;
        rest.forEach(function (part, i) {
          if (i === rest.length - 1) { node.files.push({ name: part, path: path }); return; }
          node.dirs[part] = node.dirs[part] || { dirs: {}, files: [] };
          node = node.dirs[part];
        });
      });
      return top;
    }

    function renderNode(node, into) {
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
      node.files.slice().sort(function (a, b) {
        /* index.html first — it is the entry point. */
        if (a.name === "index.html") return -1;
        if (b.name === "index.html") return 1;
        return a.name.localeCompare(b.name);
      }).forEach(function (f) {
        const b = btn("pg-file", f.name, f.path);
        b.dataset.path = f.path;
        b.addEventListener("click", function () { openFile(f.path, true); });
        into.appendChild(b);
      });
    }

    tree.appendChild(el("div", "pg-tree-head", "Workshop files"));

    projects.forEach(function (project, i) {
      const d = document.createElement("details");
      d.className = "pg-folder";
      d.dataset.project = project.name;
      d.open = i === 0;

      const s = document.createElement("summary");
      s.appendChild(el("span", "pg-folder-name", project.name + "/"));
      if (labels[project.name]) {
        s.appendChild(el("span", "pg-folder-label", labels[project.name]));
      }
      s.appendChild(el("span", "pg-folder-run", "run ▸"));
      s.title = "Click to run " + project.name;
      /* Clicking the folder runs the project. The <details> toggle
         happens too, which is what you want — it opens and runs. */
      s.addEventListener("click", function () { openProjectByName(project.name, true); });
      d.appendChild(s);

      const kids = el("div", "pg-children");
      renderNode(nest(project.files, project.name), kids);
      d.appendChild(kids);

      tree.appendChild(d);
    });

    /* ---------- buttons ----------------------------------- */
    runBtn.addEventListener("click", run);
    clearBtn.addEventListener("click", preview.clear);

    resetOne.addEventListener("click", function () {
      if (!openPath) return;
      files[openPath] = pristine[openPath];
      if (storeKey) store.drop(storeKey + ":" + openPath);
      openFile(openPath, true);
    });

    resetAll.addEventListener("click", function () {
      if (!window.confirm("Put every file in this playground back how it started?")) return;
      paths.forEach(function (p) {
        files[p] = pristine[p];
        if (storeKey) store.drop(storeKey + ":" + p);
      });
      openFile(openPath || paths[0], true);
    });

    /* Open the first project, running. */
    openProjectByName(projects[0].name, true);
  }

  document.querySelectorAll("[data-pg]").forEach(build);
})();
