/* src/pages/DataPage.jsx

   Same shape as ProfilePage: this page arranges, and Bar does the drawing.

   It takes the reply as a PROP rather than fetching it itself. That is the
   habit worth copying - a page that fetches is a page you cannot look at
   without a network.

   And there is no new information on this screen. Every bar is one row of the
   reply. A graph never invents anything. */

import Bar from "../components/Bar.jsx";

export default function DataPage({ reply }) {
  const most = Math.max(...reply.rows.map((row) => row[1]));

  return (
    <div className="graph">
      <h3 className="card-name">Open tickets by team</h3>

      {reply.rows.map((row) => (
        <Bar key={row[0]} name={row[0]} value={row[1]} most={most} />
      ))}

      <p className="graph-foot">{reply.rowCount} teams · from the API</p>
    </div>
  );
}
