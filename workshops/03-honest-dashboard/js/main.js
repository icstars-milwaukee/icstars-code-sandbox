/* ============================================================
   THE HONEST DASHBOARD

   Rows in, a screen out. The whole app is this one file.

   React is here as a plain global, not an import, because this page has to run
   when you double-click it — and a browser on a file:// path will not load a
   local module. So instead of JSX we use htm, which is JSX's shape in a
   template string:

       JSX   <Thing rows={rows} />
       htm   html`<${Thing} rows=${rows} />`

   Same idea, no build step.

   FOUR DECISIONS, which are the actual lesson:

     1. The question picks the form. A single number is a tile. A comparison
        across things is bars. A list of 25 rows of text is a table. Nothing
        here is a chart because charts look good.
     2. One colour for one series. Bar length already says who is biggest.
        Shade the big ones darker and you have said it twice — and spent the
        one channel you still needed.
     3. That channel is for selection. Click a bar; the others go grey. Colour
        doing a job length cannot do. Only possible because of decision 2.
     4. Say where you stop. The Ask panel answers four things from these rows
        and refuses everything else, out loud. An answer you cannot trace is an
        answer you cannot defend — so every answer names its source.
   ============================================================ */

const html = htm.bind(React.createElement);
const { useState, useMemo, useEffect } = React;

/* ---- THE DATA ---------------------------------------------------------
   Made up. Safe to share, safe to paste anywhere. Workshop 02 shows how to
   fetch rows exactly this shape from the real gateway with one SELECT. */

const TEAMS = [
  { team: "Example-ServiceDesk-L1", open_tickets: 57 },
  { team: "Example-Network-L2-EMEA", open_tickets: 44 },
  { team: "Example-Cloud-Platform", open_tickets: 41 },
  { team: "Example-EUC-Field-NA", open_tickets: 23 },
  { team: "Example-Apps-SAP-Basis", open_tickets: 18 },
  { team: "Example-Cloud-Storage", open_tickets: 12 },
  { team: "Example-Security-IAM", open_tickets: 9 },
  { team: "Example-Reporting", open_tickets: 3 },
];

const TOTALS = [
  { table_name: "incident", row_count: 23334 },
  { table_name: "change_request", row_count: 1969 },
  { table_name: "sc_req_item", row_count: 17501 },
  { table_name: "sc_task", row_count: 16321 },
];

const BLURBS = [
  "Laptop will not boot", "VPN drops every 10 minutes", "Printer offline on 3rd floor",
  "Shared drive permissions", "Password reset loop", "Monitor flickering",
  "Teams audio dead", "Badge reader rejecting",
];
const STATES = ["Open", "In Progress", "On Hold", "Awaiting User"];

function ticketsFor(team) {
  const row = TEAMS.find((r) => r.team === team);
  const n = Math.min(row ? row.open_tickets : 3, 8);
  return Array.from({ length: n }, (_, i) => ({
    number: "INC" + String(1000001 + i).padStart(7, "0"),
    state: STATES[i % STATES.length],
    short_description: BLURBS[i % BLURBS.length],
  }));
}

/* ---- DECISION 1, part one: a single number is a TILE ------------------
   Four numbers, four tiles. A one-bar bar chart would say nothing the number
   did not already say, and would cost more ink to say it. */

function Tiles({ rows }) {
  return html`
    <div class="hd-tiles">
      ${rows.map((r) => html`
        <div class="hd-tile" key=${r.table_name}>
          <div class="hd-tile-value">${r.row_count.toLocaleString()}</div>
          <div class="hd-tile-label">${r.table_name.replace(/_/g, " ")}</div>
        </div>`)}
    </div>`;
}

/* ---- DECISIONS 1, 2 and 3 all live in here ---------------------------
   Hand-drawn SVG, because a chart library would hide every decision this
   workshop is about. */

const W = 720, GUTTER = 230, PAD_R = 54, ROW_H = 34, BAR_H = 20, TOP = 28;

// Rounded at the data end only: 4px on the right, square where it meets the
// axis. A bar is a measurement, and measurements start flat.
function barPath(x0, x1, y, h, r) {
  r = r || 4;
  if (x1 - x0 <= r) return "M" + x0 + " " + y + " H" + x1 + " V" + (y + h) + " H" + x0 + " Z";
  return "M" + x0 + " " + y +
         " H" + (x1 - r) + " Q" + x1 + " " + y + " " + x1 + " " + (y + r) +
         " V" + (y + h - r) + " Q" + x1 + " " + (y + h) + " " + (x1 - r) + " " + (y + h) +
         " H" + x0 + " Z";
}

// Ticks on round numbers. Nobody reads an axis labelled 0, 17.4, 34.8.
function niceTicks(max, count) {
  count = count || 4;
  if (!(max > 0)) return [0, 1];
  const raw = max / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) || mag * 10;
  const out = [];
  for (let t = 0; t <= Math.ceil(max / step) * step + 1e-9; t += step) {
    out.push(Math.round(t * 100) / 100);
  }
  return out;
}

// Cut long names deliberately. The full name is in the table view, so nothing
// is lost — and a label is never allowed to overflow its own bar.
const short = (s, n) => (s.length > (n || 26) ? s.slice(0, (n || 26) - 1) + "…" : s);

function Chart({ rows, picked, onPick, filter }) {
  if (!rows.length) {
    return html`<p class="hd-empty">
      Nothing matches <b>${filter}</b>. Clear the filter to see every team.
    </p>`;
  }

  const height = TOP + rows.length * ROW_H + 8;
  const ticks = niceTicks(Math.max.apply(null, rows.map((r) => r.open_tickets)));
  const scaleMax = ticks[ticks.length - 1];
  const x = (v) => GUTTER + (v / scaleMax) * (W - GUTTER - PAD_R);

  return html`
    <svg class=${"hd-chart" + (picked ? " hd-picked" : "")}
         viewBox=${"0 0 " + W + " " + height}
         role="img" aria-label="Open tickets by team">

      ${ticks.map((t) => html`
        <g class="hd-tick" key=${t}>
          <line x1=${x(t)} y1=${TOP - 6} x2=${x(t)} y2=${height - 8}></line>
          <text x=${x(t)} y=${TOP - 12} text-anchor="middle">${t.toLocaleString()}</text>
        </g>`)}

      <g class="hd-axis">
        <line x1=${GUTTER} y1=${TOP - 6} x2=${GUTTER} y2=${height - 8}></line>
      </g>

      ${rows.map((r, i) => {
        const y = TOP + i * ROW_H;
        const end = x(r.open_tickets);
        const on = picked === r.team;
        return html`
          <g class=${"hd-row" + (on ? " hd-on" : "")} key=${r.team}
             onClick=${() => onPick(on ? null : r.team)}>
            <text class="hd-cat" x=${GUTTER - 10} y=${y + BAR_H / 2 + 4}
                  text-anchor="end">${short(r.team)}</text>
            <path class="hd-bar" d=${barPath(GUTTER, end, y, BAR_H)}></path>
            <text class="hd-val" x=${end + 8} y=${y + BAR_H / 2 + 4}>
              ${r.open_tickets.toLocaleString()}
            </text>
            <rect class="hd-hit" x="0" y=${y - (ROW_H - BAR_H) / 2}
                  width=${W} height=${ROW_H}>
              <title>${r.team + " — " + r.open_tickets + " open. Click for its tickets."}</title>
            </rect>
          </g>`;
      })}
    </svg>`;
}

/* ---- The table twin --------------------------------------------------
   About one man in twelve cannot reliably tell your colours apart. Somebody is
   on a phone in the sun. Somebody uses a screen reader. They all need this.
   The chart enhances; the table guarantees. */

function TableView({ rows }) {
  return html`
    <details class="hd-table">
      <summary>Show the table</summary>
      <table class="ics-table">
        <caption>Open tickets by team — full names, exact numbers, same filter.</caption>
        <thead><tr><th>Team</th><th class="hd-n">Open tickets</th></tr></thead>
        <tbody>
          ${rows.map((r) => html`
            <tr key=${r.team}>
              <td>${r.team}</td>
              <td class="hd-n">${r.open_tickets.toLocaleString()}</td>
            </tr>`)}
        </tbody>
      </table>
    </details>`;
}

/* ---- The drill-down: 25 rows of text, so a table ---------------------- */

function Drill({ team, open, onClear }) {
  const tickets = ticketsFor(team);
  return html`
    <div class="hd-drill">
      <div class="hd-drill-head">
        <h3>${team}</h3>
        <span>
          ${open.toLocaleString() + " open · "}
          <button class="hd-link" onClick=${onClear}>Clear selection</button>
        </span>
      </div>
      <table class="ics-table">
        <thead><tr><th>Ticket</th><th>State</th><th>What it says</th></tr></thead>
        <tbody>
          ${tickets.map((t) => html`
            <tr key=${t.number}>
              <td class="hd-id">${t.number}</td>
              <td>${t.state}</td>
              <td>${t.short_description}</td>
            </tr>`)}
        </tbody>
      </table>
    </div>`;
}

/* ---- DECISION 4: say where you stop ----------------------------------
   Four questions this data can answer, and a flat no for everything else.

   The temptation is to make the "no" branch clever — to guess. Don't. A guess
   that reads like an answer is worse than silence, because the person reading
   it cannot tell the difference. That is the whole reason this panel prints
   its source under every answer. */

function decide(question) {
  const q = question.trim().toLowerCase();
  if (!q) return { text: "Ask me something about these tickets." };

  // A refusal on purpose: nothing in TEAMS knows about one ticket by number.
  if (/\binc\d{4,}\b/i.test(question) || /\bwhere is\b.*\bticket\b/.test(q)) {
    return {
      refused: true,
      text: "I can't look up one ticket by its number. Nothing in my data knows " +
            "about individual tickets — I only have per-team totals. Click a bar " +
            "to see a team's tickets instead.",
      source: "refused: no data here would answer it",
    };
  }

  if (/(most|highest|worst|biggest|top)\b/.test(q)) {
    const t = TEAMS[0];
    return {
      text: t.team + " carries the most, with " + t.open_tickets + " open.",
      source: "from TEAMS",
    };
  }

  const named = TEAMS.filter((r) => q.includes(r.team.toLowerCase()))
                     .sort((a, b) => b.team.length - a.team.length)[0];
  if (named && /(how many|count|open)\b/.test(q)) {
    return {
      text: named.team + " has " + named.open_tickets + " open.",
      source: "from TEAMS",
    };
  }

  if (/(total|altogether|overall|how many tickets)\b/.test(q)) {
    const n = TOTALS.reduce((a, r) => a + r.row_count, 0);
    return {
      text: "There are " + n.toLocaleString() + " rows across the four tables.",
      source: "from TOTALS",
    };
  }

  if (/how many teams\b/.test(q)) {
    return { text: "I have " + TEAMS.length + " teams.", source: "from TEAMS" };
  }

  return {
    refused: true,
    text: "I don't know. I can tell you which team carries the most, how many a " +
          "named team has, how many teams there are, and the total row count. " +
          "Anything else I would be making up.",
    source: "refused: nothing in my data answers it",
  };
}

function AskPanel() {
  const [q, setQ] = useState("");
  const [a, setA] = useState(null);
  const ask = (text) => { setQ(text); setA(decide(text)); };

  const examples = [
    "Which team has the most?",
    "How many open does Example-Cloud-Platform have?",
    "How many tickets in total?",
    "Where is ticket INC0012345?",
  ];

  return html`
    <div class="hd-ask">
      <span class="ics-step">Ask it something</span>
      <form onSubmit=${(e) => { e.preventDefault(); ask(q); }}>
        <input class="ics-input" value=${q} placeholder="Which team has the most?"
               onInput=${(e) => setQ(e.target.value)} aria-label="Ask a question" />
        <button class="ics-btn" type="submit">Ask</button>
      </form>

      ${a && html`
        <div class=${"hd-answer" + (a.refused ? " hd-refused" : "")}>
          ${a.text}
          ${a.source && html`<span class="hd-src">${a.source}</span>`}
        </div>`}

      <div class="hd-examples">
        Try:
        ${examples.map((e) => html`
          <button class="hd-chip" type="button" key=${e} onClick=${() => ask(e)}>${e}</button>`)}
      </div>
    </div>`;
}

/* ---- The app: one place holds the state ------------------------------
   The filter lives HERE, not inside the chart, because it narrows the chart
   AND the table AND the count. One control, one slice, everything redraws
   together. A filter that belongs to one chart can only ever narrow it. */

function App() {
  const [filter, setFilter] = useState("");
  const [picked, setPicked] = useState(null);

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? TEAMS.filter((r) => r.team.toLowerCase().includes(q)) : TEAMS;
  }, [filter]);

  // Filter the selected team off the screen and the drill-down has to go too.
  // A panel describing a team you can no longer see is a lie about what you
  // are looking at.
  useEffect(() => {
    if (picked && !visible.some((r) => r.team === picked)) setPicked(null);
  }, [visible, picked]);

  const row = TEAMS.find((r) => r.team === picked);

  return html`
    <div>
      <${Tiles} rows=${TOTALS} />

      <div class="hd-filterrow">
        <input class="ics-input" type="search" value=${filter}
               placeholder=${'Filter teams — try "cloud"'}
               onInput=${(e) => setFilter(e.target.value)}
               aria-label="Filter teams by name" />
        <span class="ics-count">
          ${filter.trim() ? visible.length + " of " + TEAMS.length + " teams"
                          : TEAMS.length + " teams"}
        </span>
      </div>

      <${Chart} rows=${visible} picked=${picked} onPick=${setPicked} filter=${filter} />
      <${TableView} rows=${visible} />
      ${picked && html`<${Drill} team=${picked} open=${row.open_tickets}
                                 onClear=${() => setPicked(null)} />`}
      <${AskPanel} />
    </div>`;
}

ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);

/* ============================================================
   BREAK IT ON PURPOSE

   One at a time. Change it, look at it, change it back.

   BAR_H  20 -> 60            thick saturated slabs. Bars are capped for a
                              reason: the data should be the loudest thing on
                              the page, not the ink.

   --hd-series in css/        pick a pale yellow. The bars vanish into the
   chart.css                  background. A colour has to earn its contrast
                              before it is allowed to carry meaning.

   short(r.team) -> r.team    the long names run off the left edge and collide
                              with the axis. Labels get measured, or they get
                              clipped.

   delete the .hd-val <text>  the numbers go. Notice how much the axis alone
                              still carries — and exactly where it stops being
                              enough.

   in .hd-picked, make the    now selection and size are both colour. Look at
   bars darker-where-bigger   the screen and try to tell which team you
                              clicked. That is decision 2 earning its keep.

   decide()'s last return ->  make it answer "I'm not sure, but probably
   a guess instead of "no"    Example-ServiceDesk-L1". Show someone. They will
                              believe it. That is the whole argument for
                              refusing.
   ============================================================ */
