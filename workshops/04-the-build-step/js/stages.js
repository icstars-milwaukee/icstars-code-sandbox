/* js/stages.js
   ONE JOB: the three things the editor can load.

   Hello World -> Profile -> Data. Each one is the one before it plus exactly
   one new idea. This is the lesson's content, so it lives on its own. */

window.ICS = window.ICS || {};

ICS.PERSON = {
  initials: "JR",
  name: "Jordan Rivera",
  role: "Tech Apprentice",
  stats: [
    { label: "commits", value: 48 },
    { label: "PRs", value: 7 },
    { label: "weeks", value: 8 },
  ],
};

ICS.STAGES = {

  /* 1 · the smallest thing that works. One tag -> one function call. */
  hello: `function App() {
  return <h1>Hello, world</h1>;
}`,

  /* 2 · boxes. A component is a box you named; props are what you put in it. */
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

  /* 3 · the numbers come from somewhere. Every bar is one row of the reply. */
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
