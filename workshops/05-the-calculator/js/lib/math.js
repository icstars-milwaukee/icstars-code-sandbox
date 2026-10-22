/* js/lib/math.js
   ONE JOB: do the arithmetic. Nothing in this file draws anything.

   This is the whole lesson, and it is eleven lines of real code.

   A FUNCTION IS A MACHINE WITH FOUR PARTS

       function add(a, b) { return a + b; }
                ^^^  ^^^^           ^^^^^
                name inputs         output

     1. a NAME, so something else can call it
     2. INPUTS (parameters) - what it needs in order to work
     3. a BODY - the work
     4. a RETURN - the answer it hands back

   Leave off the return and the function still runs. It just hands back
   nothing, and whatever called it gets `undefined`. That is the most common
   bug this file will ever have.

   WHY THESE LIVE IN lib/ AND NOT components/
   They draw nothing. You can run them with no browser, no button and no
   React - which is exactly what the table at the bottom of the page does.
   Screens go in components/, work goes in lib/. Same rule as workshop 04. */

window.ICS = window.ICS || {};

/* Same inputs, same answer, every time. Nothing remembered between calls,
   nothing outside the function touched. A function like that is called PURE,
   and it is the easiest kind of code there is to trust. */

ICS.add = function add(a, b) {
  return a + b;
};

ICS.subtract = function subtract(a, b) {
  return a - b;
};

/* And then there is divide.

   Two of these three work for ANY two numbers you hand them. Divide does not.
   Dividing by zero has no answer - not a big answer, not zero, no answer.

   So this function has to decide what to do when it cannot do its job. It
   returns null, which means "no answer", and whoever called it has to deal
   with that. js/components/Readout.js is where it gets dealt with.

   The two tempting alternatives are both worse:

     return 0          A lie. 10 / 0 is not 0, and now a wrong number is loose
                       in the program with nothing marking it as wrong.
     return Infinity   What JavaScript does on its own. True to the maths,
                       useless on a screen, and it spreads into every sum
                       that touches it afterwards.

   A function that admits it has no answer is worth more than one that invents
   a believable number. */

ICS.divide = function divide(a, b) {
  if (b === 0) return null;      // the guard: check first, work second
  return a / b;
};
