/* js/components/Readout.js
   ONE JOB: show the answer, or say there isn't one.

   This is where divide's null gets handled. The component asks one question -
   "did I actually get a number?" - and says so plainly when it did not.

   It does no arithmetic. It cannot. All it does is show what lib/ handed it.
   That split is the point.

   About h(): workshop 04 wrote screens in JSX, which needed installing. This
   page has to run off a double-click, so there is no build step to turn JSX
   into anything. h() IS what JSX turns into - tag, props, children:

       JSX   <b className="big">42</b>
       h()   h("b", { className: "big" }, "42")

   Same call. One of them just has a compiler in front of it. */

window.ICS = window.ICS || {};

ICS.Readout = function Readout(props) {
  const h = React.createElement;
  const answer = props.answer;

  // divide, admitting it has no answer
  if (answer === null) {
    return h("div", { className: "cx-readout cx-noanswer" },
      h("b", null, "no answer"),
      h("span", null, "you cannot divide by zero"));
  }

  // nothing asked yet
  if (answer === undefined) {
    return h("div", { className: "cx-readout cx-empty" },
      h("b", null, "—"),
      h("span", null, "pick two numbers, then an operation"));
  }

  return h("div", { className: "cx-readout" },
    h("b", null, String(answer)),
    h("span", null, props.shown || ""));
};
