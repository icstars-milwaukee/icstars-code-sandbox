/* src/components/Stat.jsx

   One number with a label under it.

   This exists because the profile needed three of them. That is the only good
   reason to make a component - not tidiness, repetition. */

export default function Stat({ label, value }) {
  return (
    <div className="stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
