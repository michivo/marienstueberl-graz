export function getNextMonday(currentDate: Date | undefined = undefined) {
  const d = currentDate ?? new Date();
  d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
  return d;
}

export function getPreviousMonday(currentDate: Date | undefined = undefined) {
  const d = getNextMonday(currentDate);
  d.setDate(d.getDate() - 7);
  return d;
}