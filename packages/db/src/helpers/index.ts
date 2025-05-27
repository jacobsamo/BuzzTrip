export * from "./generateId";

export const formatDateForSql = (date: Date) =>
  date.toISOString().slice(0, 19).replace("T", " ");
