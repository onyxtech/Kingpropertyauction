import { UK_TIMEZONE } from '@/constants';

export const formatUKDate = (dateStr: string | Date) => {
  if (!dateStr) return "TBC";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: UK_TIMEZONE,
  });
};

export const formatUKTime = (dateStr: string | Date) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: UK_TIMEZONE,
  }) + " GMT";
};

export const formatUKDateTime = (dateStr: string | Date) => {
  if (!dateStr) return "TBC";
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: UK_TIMEZONE,
  }) + " GMT";
};
