/* src/App.jsx — the top of the app.

   App decides WHICH screen you are looking at. That is its whole job.

   Here it shows all three, one under the other, so you can see what each one
   came out as. In a bigger app this is where a router would go, and App would
   show one page at a time instead of all of them.

   Notice: App imports pages. Pages import components. Nothing imports
   backwards. That one-way flow is what keeps a project navigable. */

import HelloPage from "./pages/HelloPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import DataPage from "./pages/DataPage.jsx";

import { PERSON } from "./api/person.js";
import { REPLY } from "./api/reply.js";

const SHOWCASE = [
  {
    file: "src/pages/HelloPage.jsx",
    what: "The smallest screen there is. No components, because nothing on it is worth reusing yet.",
    render: () => <HelloPage />,
  },
  {
    file: "src/pages/ProfilePage.jsx",
    what: "Uses Avatar once and Stat three times. The page arranges; the components draw.",
    render: () => <ProfilePage person={PERSON} />,
  },
  {
    file: "src/pages/DataPage.jsx",
    what: "The API's answer, drawn. Every bar is one row of the reply - nothing is invented.",
    render: () => <DataPage reply={REPLY} />,
  },
];

export default function App() {
  return (
    <main className="app">
      <header className="app-head">
        <p className="app-kicker">i.c.stars * Milwaukee</p>
        <h1>The Build Step</h1>
        <p className="app-sub">
          Three screens, finished. Each one is a file in <code>src/pages/</code> —
          open them in the editor beside this preview.
        </p>
      </header>

      {SHOWCASE.map((item) => (
        <section className="showcase" key={item.file}>
          <div className="showcase-label">
            <code>{item.file}</code>
            <p>{item.what}</p>
          </div>
          <div className="showcase-out">{item.render()}</div>
        </section>
      ))}

      <footer className="app-foot">
        <p>
          Every screen above is JSX. No browser understands JSX — Vite rewrote
          all of it into plain function calls on its way here. That rewrite is
          the build step, and it is the reason this folder needs installing.
        </p>
      </footer>
    </main>
  );
}
