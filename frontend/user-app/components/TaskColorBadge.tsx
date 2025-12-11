import { getStatusBadgeColor } from '@/lib/utils/statusColors';

interface TaskColorBadgeProps {
  alertDate?: string;
  snoozeUntil?: string;
  alertStatus?: string;
}

export default function TaskColorBadge({
  alertDate,
  snoozeUntil,
  alertStatus
}: TaskColorBadgeProps) {
  // If no alert date, show no alert status
  if (!alertDate) {
    return <span className="text-gray-500 text-sm">—</span>;
  }

  // Default status badge behavior
  const status = alertStatus || 'ACTIVE';
  const badgeColor = getStatusBadgeColor(status);

  return (
    <div className="flex flex-col gap-1">
      <span className={`px-2 py-1 rounded text-sm font-medium w-fit ${badgeColor}`}>
        {status}
      </span>
      {status === 'SNOOZED' && snoozeUntil && (
        <span className="text-xs text-gray-600">
          until {new Date(snoozeUntil + 'T00:00:00').toLocaleDateString()}
        </span>
      )}
    </div>
  );
}
