/** Public-file URL that works on `/` and itch.io `./` base. */
export function asset(path: string) {
  if (!path) return path;
  if (/^https?:/i.test(path)) return path;
  const clean = path.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}
