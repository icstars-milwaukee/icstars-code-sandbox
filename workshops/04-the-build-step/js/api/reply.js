/* js/api/reply.js
   ONE JOB: hold what the API gives back.

   This is a real reply from the Cycle 21 data API. The envelope is exactly
   what you get: columns (what each slot means) and rows (the slots).

   The team names and numbers are MADE UP. This workshop is public, and the
   client's data does not go in a public repo. The shape is the real part, and
   the shape is what transfers.

   To ask the real API, with your team's password, see workshop 02. */

window.ICS = window.ICS || {};

ICS.REQUEST = `POST https://c21-data-gateway.icstars-milwaukee.workers.dev/api/query

{
  "team": "your-team",
  "sql":  "SELECT \\"assignment group\\" AS team, COUNT(*) AS open_tickets
           FROM servicenow.incident
           WHERE state NOT IN ('Resolved', 'Closed')
           GROUP BY \\"assignment group\\"
           ORDER BY open_tickets DESC
           LIMIT 6"
}`;

ICS.API = {
  ok: true,
  columns: ["team", "open_tickets"],
  rows: [
    ["Service Desk", 57],
    ["Network", 44],
    ["Cloud Platform", 41],
    ["Field Support", 23],
    ["Apps", 18],
    ["Security", 9],
  ],
  rowCount: 6,
  durationMs: 2651,
};
