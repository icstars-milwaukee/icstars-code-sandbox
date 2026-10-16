/* js/components/Stat.js
   ONE JOB: one number with a label under it.

   This exists because the card needed three of them. That is the only good
   reason to make a component. */

window.ICS = window.ICS || {};

ICS.Stat = function Stat(props) {
  return React.createElement("div", { className: "pf-stat" },
    React.createElement("b", null, String(props.value)),
    React.createElement("span", null, props.label));
};
