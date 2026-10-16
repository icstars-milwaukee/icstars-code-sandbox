/* src/components/Avatar.jsx

   Initials in a circle. It knows nothing about profiles - hand it any
   initials and it works, which is the test of whether something deserves its
   own file. */

export default function Avatar({ initials }) {
  return <div className="avatar">{initials}</div>;
}
