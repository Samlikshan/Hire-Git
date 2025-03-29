import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeAgo(date: string | Date): string {
  const now = new Date(); // Get current date
  const pastDate = new Date(date); // Convert the input date to a Date object

  const differenceInTime = now - pastDate; // Difference in milliseconds

  // Calculate time units
  const seconds = Math.floor(differenceInTime / 1000); // Total seconds
  const minutes = Math.floor(seconds / 60); // Total minutes
  const hours = Math.floor(minutes / 60); // Total hours
  const days = Math.floor(hours / 24); // Total days

  // Return the appropriate time difference string based on the value
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${days} days ago`;
  }
}

export function formatDate(date: string | Date): string {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return formattedDate;
}
