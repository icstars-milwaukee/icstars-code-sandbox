/* js/components/ProfileCard.js
   ONE JOB: lay out the card. It owns no numbers of its own.

   Look at what it does: it takes a person, and it decides what goes where.
   The drawing of a circle belongs to Avatar; the drawing of a number belongs
   to Stat. This file is only arrangement. */

window.ICS = window.ICS || {};

ICS.ProfileCard = function ProfileCard(props) {
  const person = props.person;
  const h = React.createElement;

  return h("article", { className: "pf-card" },
    h("header", { className: "pf-head" },
      h(ICS.Avatar, { initials: person.initials }),
      h("div", null,
        h("h3", { className: "pf-name" }, person.name),
        h("p", { className: "pf-role" }, person.role))),
    h("div", { className: "pf-stats" },
      person.stats.map(function (s) {
        return h(ICS.Stat, { key: s.label, label: s.label, value: s.value });
      }))
  );
};
