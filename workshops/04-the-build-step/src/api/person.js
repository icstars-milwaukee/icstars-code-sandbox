/* src/api/person.js

   The profile's data. In a real app this would come from the API too - it is
   here as a plain object so ProfilePage has something to arrange.

   Same folder rule as reply.js: data is not a screen. */

export const PERSON = {
  initials: "JR",
  name: "Jordan Rivera",
  role: "Tech Apprentice",
  stats: [
    { label: "commits", value: 48 },
    { label: "PRs", value: 7 },
    { label: "weeks", value: 8 },
  ],
};
