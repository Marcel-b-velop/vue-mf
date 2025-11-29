import { format } from "date-fns";

export const dateUtils = {
  formatDate: (date: Date) => {
    return format(date, "dd.MM.yyyy");
  },
};