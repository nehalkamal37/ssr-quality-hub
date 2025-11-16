import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status = "OPEN" | "IN_PROGRESS" | "NEEDS_INFO" | "RESOLVED" | "VERIFIED" | "CLOSED" | 
              "PLANNING" | "IN_REVIEW" | "CHANGES_REQUIRED" | "READY_FOR_SIGNOFF";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; variant: string }> = {
  OPEN: { label: "Open", variant: "default" },
  IN_PROGRESS: { label: "In Progress", variant: "info" },
  NEEDS_INFO: { label: "Needs Info", variant: "warning" },
  RESOLVED: { label: "Resolved", variant: "success" },
  VERIFIED: { label: "Verified", variant: "success" },
  CLOSED: { label: "Closed", variant: "muted" },
  PLANNING: { label: "Planning", variant: "default" },
  IN_REVIEW: { label: "In Review", variant: "info" },
  CHANGES_REQUIRED: { label: "Changes Required", variant: "warning" },
  READY_FOR_SIGNOFF: { label: "Ready for Sign-off", variant: "success" },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant as any}
      className={cn("font-medium", className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
