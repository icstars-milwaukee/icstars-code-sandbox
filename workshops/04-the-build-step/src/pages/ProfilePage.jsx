/* src/pages/ProfilePage.jsx

   Look at what this file does, and what it refuses to do. It arranges. It
   draws no circle and formats no number - Avatar draws the circle, Stat draws
   a number.

   When a page starts doing the drawing itself, that is the signal to pull a
   component out of it. */

import Avatar from "../components/Avatar.jsx";
import Stat from "../components/Stat.jsx";

export default function ProfilePage({ person }) {
  return (
    <article className="card">
      <header className="card-head">
        <Avatar initials={person.initials} />
        <div>
          <h3 className="card-name">{person.name}</h3>
          <p className="card-role">{person.role}</p>
        </div>
      </header>

      <div className="card-stats">
        {person.stats.map((s) => (
          <Stat key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </article>
  );
}
