export function formatDiaryDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const dayMonth = date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
  return `${dayMonth} ${date.getFullYear()}`;
}
