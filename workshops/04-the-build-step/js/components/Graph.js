/* js/components/Graph.js
   ONE JOB: turn an API reply into bars.

   Notice there is no new information in here. Every bar is one row of the
   reply. A graph never invents anything - it only arranges what you were
   already given.

   One colour for every bar, on purpose: the LENGTH already tells you which is
   biggest, so colour stays free for a different job. */

window.ICS = window.ICS || {};

ICS.Graph = function Graph(props) {
  const reply = props.reply;
  const h = React.createElement;
  const most = Math.max.apply(null, reply.rows.map(function (r) { return r[1]; }));

  return h("div", { className: "g-card" },
    reply.rows.map(function (row, i) {
      return h(ICS.Bar, { key: row[0], index: i, name: row[0], value: row[1], most: most });
    }),
    h("p", { className: "g-foot" }, reply.rowCount + " teams · from the API")
  );
};
