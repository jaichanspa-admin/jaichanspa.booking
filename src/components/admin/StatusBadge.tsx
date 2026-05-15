import type { BookingStatus } from "@/types";
import { cn } from "@/lib/cn";

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-green-100 text-green-800 border border-green-200",
  },
  proposed_new_time: {
    label: "New Time Proposed",
    className: "bg-blue-100 text-blue-800 border border-blue-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border border-red-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  },
};

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "badge",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
