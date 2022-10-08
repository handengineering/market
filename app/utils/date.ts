import { format, parseISO } from "date-fns";

export function formatDateTime(date: Date) {
  return format(parseISO(date.toString()), "do MMMM yyyy");
}
