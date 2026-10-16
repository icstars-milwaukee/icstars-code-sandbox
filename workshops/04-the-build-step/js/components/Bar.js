/* js/components/Bar.js
   ONE JOB: one row of the graph - a name, a bar, a number.

   The width is this value as a share of the biggest one, which is why it
   needs to be told what the biggest one is. Take that away and you are
   drawing 57 and 44 as the same length. */

window.ICS = window.ICS || {};

ICS.Bar = function Bar(props) {
  const h = React.createElement;
  const width = (props.value / props.most) * 100 + "%";

  return h("div", { className: "g-row", "data-i": props.index },
    h("span", { className: "g-name" }, props.name),
    h("span", { className: "g-track" },
      h("span", { className: "g-bar", style: { width: width } })),
    h("b", { className: "g-value" }, String(props.value))
  );
};
