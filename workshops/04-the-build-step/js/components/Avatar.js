/* js/components/Avatar.js
   ONE JOB: initials in a circle.

   It knows nothing about profiles. Hand it any initials and it works - which
   is the test of whether a component deserves its own file. */

window.ICS = window.ICS || {};

ICS.Avatar = function Avatar(props) {
  return React.createElement("div", { className: "pf-avatar" }, props.initials);
};
