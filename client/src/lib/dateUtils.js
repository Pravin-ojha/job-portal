import { formatDistanceToNow, format } from 'date-fns';

/**
 * Returns "2 days ago", "3 hours ago", etc.
 */
export function timeAgo(date) {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Returns formatted date like "Jan 15, 2025"
 */
export function formatDate(date) {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
}
