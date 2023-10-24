export function getEndOfDay(dateString: string): Date {
  const endOfDay = new Date(dateString);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
}
export function getStartOfTomorrow(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}
