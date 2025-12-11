/**
 * Centralized utility for task/alert status color management
 * Provides consistent color styling across the application
 */

export type AlertStatus = 'ACTIVE' | 'SNOOZED' | 'CANCELLED';

interface StatusColorConfig {
  bg: string;
  text: string;
  badge: string;
}

/**
 * Status color configuration
 * Maps each status to its corresponding Tailwind CSS classes
 */
const STATUS_COLORS: Record<AlertStatus, StatusColorConfig> = {
  ACTIVE: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-800'
  },
  SNOOZED: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  CANCELLED: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    badge: 'bg-gray-100 text-gray-800'
  }
};

/**
 * Get the badge color class for a given status
 * @param status - The alert status
 * @returns Tailwind CSS classes for the status badge
 */
export function getStatusBadgeColor(status?: string): string {
  const normalizedStatus = (status?.toUpperCase() || 'ACTIVE') as AlertStatus;
  return STATUS_COLORS[normalizedStatus]?.badge || STATUS_COLORS.ACTIVE.badge;
}

/**
 * Get the background color class for a given status
 * @param status - The alert status
 * @returns Tailwind CSS background color class
 */
export function getStatusBackgroundColor(status?: string): string {
  const normalizedStatus = (status?.toUpperCase() || 'ACTIVE') as AlertStatus;
  return STATUS_COLORS[normalizedStatus]?.bg || STATUS_COLORS.ACTIVE.bg;
}

/**
 * Get the text color class for a given status
 * @param status - The alert status
 * @returns Tailwind CSS text color class
 */
export function getStatusTextColor(status?: string): string {
  const normalizedStatus = (status?.toUpperCase() || 'ACTIVE') as AlertStatus;
  return STATUS_COLORS[normalizedStatus]?.text || STATUS_COLORS.ACTIVE.text;
}

/**
 * Get all color classes for a given status
 * @param status - The alert status
 * @returns Object containing all color classes for the status
 */
export function getStatusColors(status?: string): StatusColorConfig {
  const normalizedStatus = (status?.toUpperCase() || 'ACTIVE') as AlertStatus;
  return STATUS_COLORS[normalizedStatus] || STATUS_COLORS.ACTIVE;
}
