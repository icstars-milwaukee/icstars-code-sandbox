/* ============================================================
   MOLSON DATA — one SELECT, three functions

   The whole app is three functions:

     1. runQuery(team, sql, token)   ASK the gateway        DONE
     2. renderTable(result)          SHOW the rows          DONE
     3. summarise(result)            count what came back   BROKEN

   Functions 1 and 2 work. Function 3 runs, and gets the wrong
   answer. Your job is the one line marked TODO.

   THE ONE THING TO KNOW ABOUT THIS API
   It does not hand you a list of objects. It hands you the column
   names in one list and the rows in another, and each row is a
   LIST, in the same order as the columns:

     {
       "ok": true,
       "columns": [ "assignment group",        "open_tickets" ],
       "rows":    [ ["TCS-ServiceDesk-L1-NA-WE", "52"],
                    ["ACN-L2-SAP-TM",            "24"] ],
       "rowCount": 2,
       "truncated": false,
       "durationMs": 180
     }

   So the first cell of the first row is  rows[0][0]  — by POSITION,
   not by name. Hold onto that; it is the whole bug in function 3.
   ============================================================ */

// ---- 1. WHERE THE DATA COMES FROM --------------------------
// The gateway speaks PostgreSQL. That matters: SQL is a family of
// dialects, not one language, and the table list lives somewhere
// different in each of them. Postgres keeps it in
// information_schema.tables.
const API_URL = "https://c21-data-gateway.icstars-milwaukee.workers.dev/api/query";

// ---- 2. THE PAGE -------------------------------------------
const teamEl    = document.getElementById("team");
const tokenEl   = document.getElementById("token");
const sqlEl     = document.getElementById("sql");
const runBtn    = document.getElementById("runBtn");
const statusEl  = document.getElementById("status");
const metaEl    = document.getElementById("meta");
const summaryEl = document.getElementById("summary");
const resultsEl = document.getElementById("results");


/* ============================================================
   FUNCTION 1 of 3 — ASK THE GATEWAY                     (done)

   The two lines you already know, plus two new ideas:

   encodeURIComponent  SQL is full of spaces, quotes and = signs.
                       A URL cannot hold those raw, so you encode
                       them. Skip it and the gateway gets half a
                       query.
   headers             the team password rides in a header, not in
                       the URL. URLs end up in history and server
                       logs; headers mostly don't.
   ============================================================ */
async function runQuery(team, sql, token) {
  const url = API_URL
            + "?team=" + encodeURIComponent(team)
            + "&sql="  + encodeURIComponent(sql);

  const response = await fetch(url, {               // 1. ASK
    headers: { "X-Class-Token": token }
  });
  const data = await response.json();               // 2. UNWRAP

  // The gateway answers with ok:false and a sentence when it says
  // no — a wrong password, or SQL that isn't a SELECT. Read the
  // sentence. It is written for you, not for a machine.
  if (!data.ok) {
    throw new Error(data.error || ("HTTP " + response.status));
  }
  return data;
}


/* ============================================================
   FUNCTION 2 of 3 — SHOW THE ROWS                       (done)

   Two loops, because the data is two deep: one list of columns for
   the header, then one list per row. Nothing clever.
   ============================================================ */
function renderTable(result) {
  resultsEl.innerHTML = "";

  if (result.rowCount === 0) {
    resultsEl.innerHTML = "<p class='ics-note'>That query ran fine "
                        + "and matched nothing. Not an error — an answer.</p>";
    return;
  }

  const table = document.createElement("table");
  table.className = "ics-table";

  // The header row: one <th> per column name.
  const head = document.createElement("tr");
  result.columns.forEach(function (name) {
    const th = document.createElement("th");
    th.textContent = name;
    head.appendChild(th);
  });
  table.appendChild(head);

  // Then one <tr> per row, and one <td> per cell in that row.
  result.rows.forEach(function (row) {
    const tr = document.createElement("tr");
    row.forEach(function (cell) {
      const td = document.createElement("td");
      td.textContent = (cell === null) ? "—" : cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  resultsEl.appendChild(table);
}


/* ============================================================
   FUNCTION 3 of 3 — COUNT WHAT CAME BACK              >> BROKEN <<

   It should say something like:

     12 rows · 9 different values in "name" · most common: orders (3×)

   Run it and it says this instead:

     12 rows · 1 different values in "name" · most common: undefined (12×)

   One row would be bad luck. EVERY row coming back undefined is a
   shape problem — the code is asking for something that isn't
   there. Re-read the JSON at the top of this file before you
   change anything.
   ============================================================ */
function summarise(result) {
  const tally = {};
  const firstColumn = result.columns[0];

  result.rows.forEach(function (row) {

    // TODO: this line is the bug. Every value comes back undefined.
    //       What shape is `row`, and how do you get its first cell?
    const value = row[firstColumn];

    // (this part is fine — it counts how many times each value shows up.
    //  `|| 0` is there because undefined + 1 is NaN, not 1.)
    tally[value] = (tally[value] || 0) + 1;
  });

  // Which value showed up most?
  const values = Object.keys(tally);
  let top = values[0];
  values.forEach(function (v) {
    if (tally[v] > tally[top]) { top = v; }
  });

  summaryEl.textContent =
    result.rowCount + " rows · " +
    values.length + ' different values in "' + firstColumn + '" · ' +
    "most common: " + top + " (" + tally[top] + "×)";
}


// ---- 4. WIRE IT UP -----------------------------------------
// Nothing here stores the password. It is read out of the input at
// the moment you press Run and then forgotten — no localStorage, no
// URL, nothing on disk. Keep it that way.
runBtn.addEventListener("click", async function () {
  const team  = teamEl.value;
  const token = tokenEl.value.trim();
  const sql   = sqlEl.value.trim();

  if (!token) {
    statusEl.className   = "ics-note error";
    statusEl.textContent = "No password yet — the gateway will say no without it.";
    return;
  }

  runBtn.disabled      = true;
  statusEl.className   = "ics-note";
  statusEl.textContent = "Asking the gateway…";
  metaEl.textContent   = "";

  try {
    const result = await runQuery(team, sql, token);

    renderTable(result);                 // function 2
    summarise(result);                   // function 3 — the broken one

    statusEl.className   = "ics-note success";
    statusEl.textContent = "Came back with " + result.rowCount + " row"
                         + (result.rowCount === 1 ? "" : "s") + ".";
    metaEl.textContent   = result.durationMs + " ms"
                         + (result.truncated ? " · cut off at the 1,000-row cap" : "");
  } catch (err) {
    // Say what went wrong, on the page, in the gateway's own words.
    statusEl.className   = "ics-note error";
    statusEl.textContent = err.message;
    resultsEl.innerHTML  = "";
    summaryEl.textContent = "(no summary — the query didn't run)";
  } finally {
    runBtn.disabled = false;
  }
});


/* ============================================================
   BREAK IT ON PURPOSE
   Change one thing, press Run, read what happens.

   drop  encodeURIComponent       the SQL arrives chopped at the
                                  first space or &. URLs cannot
                                  carry raw spaces; something has
                                  to encode them.

   SELECT -> UPDATE               "Read-only door: UPDATE is not
                                  allowed here." The gate refuses
                                  it before the database sees it.

   type one wrong character       the gateway answers with the SQL
   in the SQL                     error itself. An error from a
                                  server is information, written
                                  for you.

   information_schema.tables      "relation "sqlite_master" does
     -> sqlite_master             not exist". That is Postgres
                                  telling you it has never heard of
                                  it — because sqlite_master is
                                  SQLite's table list, not its own.
                                  SQL is a family of dialects, and
                                  the error names exactly the thing
                                  it could not find. This workshop
                                  shipped with that bug in it on the
                                  first run.

   delete  if (!data.ok)          a wrong password now looks like a
                                  successful query with no rows.
                                  Checking the envelope is how you
                                  tell "nothing matched" apart from
                                  "you weren't allowed to ask".

   delete the second  await       "[object Promise]" — the wait
                                  never happened, so you used the
                                  waiting instead of the data.
   ============================================================ */


/* ============================================================
   THE FIX — for function 3, once you have had a real go at it.

   The rows are LISTS, not objects. `row` has no property called
   "name"; it has a cell at position 0. So:

       const value = row[0];

   If you would rather name the column than count positions, ask
   the columns list where it is — this is the version worth keeping
   once there is more than one column you care about:

       const at = result.columns.indexOf(firstColumn);
       const value = row[at];

   That is the same idea as Workshop 01's "braces or brackets?":
   curly braces are one thing with names, square brackets are a
   list with positions. This API hands you brackets.
   ============================================================ */
