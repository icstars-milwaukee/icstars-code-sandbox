/* js/components/Calculator.js
   ONE JOB: the screen - two numbers, three buttons, one answer.

   Watch what it does with the functions. It does not know HOW to add. It only
   knows WHICH function to call:

       const answer = ICS[chosen.key](numA, numB);

   Change the body of ICS.add in js/lib/math.js and this file never notices.
   That is what you get for keeping the work out of the screen. */

window.ICS = window.ICS || {};

ICS.Calculator = function Calculator() {
  const h = React.createElement;
  const useState = React.useState;

  const [a, setA] = useState("10");
  const [b, setB] = useState("2");
  const [op, setOp] = useState(null);     // null until a button is pressed

  // One entry per function in js/lib/math.js. `key` is the function's name.
  const OPS = [
    { key: "add",      symbol: "+", label: "add" },
    { key: "subtract", symbol: "−", label: "subtract" },
    { key: "divide",   symbol: "÷", label: "divide" },
  ];

  /* An input box gives you TEXT. Always - even type="number". "10" is not 10,
     and "10" + "2" is "102", because + glues text together. Number() is the
     fix, and forgetting it is where most calculator bugs start. */
  const numA = Number(a);
  const numB = Number(b);

  const chosen = OPS.find(function (o) { return o.key === op; });
  const answer = chosen ? ICS[chosen.key](numA, numB) : undefined;
  const shown  = chosen ? numA + " " + chosen.symbol + " " + numB : "";

  return h("div", { className: "cx" },

    h("div", { className: "cx-inputs" },
      h("input", {
        className: "ics-input cx-num", type: "number", value: a,
        "aria-label": "first number",
        onChange: function (e) { setA(e.target.value); },
      }),
      h("span", { className: "cx-opshow" }, chosen ? chosen.symbol : "?"),
      h("input", {
        className: "ics-input cx-num", type: "number", value: b,
        "aria-label": "second number",
        onChange: function (e) { setB(e.target.value); },
      })),

    // Three buttons, three functions. The button does not do the maths.
    h("div", { className: "cx-keys" },
      OPS.map(function (o) {
        return h("button", {
          key: o.key,
          className: "cx-key" + (op === o.key ? " cx-on" : ""),
          onClick: function () { setOp(o.key); },
        }, h("b", null, o.symbol), h("span", null, o.label));
      })),

    h(ICS.Readout, { answer: answer, shown: shown }),

    /* The call, written out. This is the line that makes a function click:
       a name, two inputs going in, one answer coming back. */
    chosen ? h("p", { className: "cx-call" },
      h("code", null, chosen.key + "(" + numA + ", " + numB + ")"),
      " → ",
      h("code", null, answer === null ? "null" : String(answer))) : null
  );
};
