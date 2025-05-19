import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";

// Format date to readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
};

// Format time to readable string
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "h:mm a");
};

// Get relative date label (Today, Tomorrow, In X days)
export const getRelativeDateLabel = (dateString: string): string => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return "Today";
  }

  if (isTomorrow(date)) {
    return "Tomorrow";
  }

  const now = new Date();
  const inDays = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (inDays <= 7) {
    return `In ${inDays} days`;
  }

  return formatDistanceToNow(date, { addSuffix: true });
};
