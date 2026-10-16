/* js/lib/remember.js
   ONE JOB: remember the ticked checkboxes between visits.

   Nothing to do with screens, which is exactly why it is in lib/ and not in
   components/. That is the whole rule: components/ draws, lib/ does not. */

window.ICS = window.ICS || {};

ICS.remember = function remember(key) {
  return {
    read: function () {
      try { return JSON.parse(localStorage.getItem(key)) || {}; }
      catch (e) { return {}; }
    },
    write: function (value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch (e) { /* private browsing - not worth breaking the page over */ }
    }
  };
};
