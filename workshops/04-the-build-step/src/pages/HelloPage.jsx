/* src/pages/HelloPage.jsx

   A PAGE is a whole screen. A COMPONENT is a part of one. That is the only
   difference, and it is why they get different folders:

     pages/       a screen you could navigate to
     components/  a part you use on more than one screen

   This page uses no components at all, because there is nothing on it worth
   reusing. That is fine. A component earns its own file by being needed twice. */

export default function HelloPage() {
  return <h1 className="hello">Hello, world</h1>;
}
