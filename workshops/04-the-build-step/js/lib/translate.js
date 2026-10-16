/* js/lib/translate.js
   ONE JOB: the build step itself, in two functions.

   This is the file the whole workshop is about. Keep the two steps apart in
   your head:

     compile   JSX text        -> JavaScript text     Babel. Vite automates this.
     run       JavaScript text -> something on screen  The browser. Always was.

   A build step only ever does the first one. */

window.ICS = window.ICS || {};

ICS.compile = function compile(source, runtime) {
  return Babel.transform(source, {
    presets: [["react", { runtime: runtime || "classic" }]],
    compact: false,
  }).code;
};

/* Takes compiled JavaScript, hands it React and the data, asks for the
   component called App back, and draws it. */
ICS.run = function run(code, into, data) {
  const make = new Function("React", "person", "api",
    code + "\n return typeof App !== 'undefined' ? App : null;");
  const App = make(React, data.person, data.api);
  if (!App) throw new Error("No component called App - did you rename it?");

  if (!into.__root) into.__root = ReactDOM.createRoot(into);
  into.__root.render(React.createElement(App));
};
