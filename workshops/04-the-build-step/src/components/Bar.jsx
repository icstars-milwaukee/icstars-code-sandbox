/* src/components/Bar.jsx

   One row of the graph: a name, a bar, a number.

   The width is this value as a SHARE of the biggest one, which is why it has
   to be told what the biggest one is. Take `most` away and you draw 57 and 44
   as the same length.

   One colour for every bar, on purpose: the LENGTH already says which is
   biggest, so colour stays free for a different job. */

export default function Bar({ name, value, most }) {
  const width = (value / most) * 100 + "%";

  return (
    <div className="bar-row">
      <span className="bar-name">{name}</span>
      <span className="bar-track">
        <span className="bar-fill" style={{ width }} />
      </span>
      <b className="bar-value">{value}</b>
    </div>
  );
}
