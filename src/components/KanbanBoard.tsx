import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import { AlertCircle, Clock, User } from "lucide-react";

interface QAItem {
  id: string;
  title: string;
  status: any;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assignedTo?: string;
  dueDate?: string;
  sheetNumber: string;
}

interface KanbanColumnProps {
  title: string;
  items: QAItem[];
  count: number;
}

const severityColors = {
  LOW: "bg-info/10 text-info border-info/20",
  MEDIUM: "bg-warning/10 text-warning border-warning/20",
  HIGH: "bg-destructive/10 text-destructive border-destructive/20",
  CRITICAL: "bg-destructive text-destructive-foreground",
};

const KanbanColumn = ({ title, items, count }: KanbanColumnProps) => {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="bg-muted/50 rounded-lg p-4 mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Badge variant="secondary">{count}</Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-medium line-clamp-2">
                  {item.title}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={severityColors[item.severity]}
                >
                  {item.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="w-3 h-3" />
                <span>{item.sheetNumber}</span>
              </div>
              
              {item.assignedTo && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>{item.assignedTo}</span>
                </div>
              )}
              
              {item.dueDate && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Due: {item.dueDate}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  // Mock data
  const mockItems: QAItem[] = [
    {
      id: "1",
      title: "Verify conduit routing on Level 2 electrical room",
      status: "OPEN",
      severity: "HIGH",
      assignedTo: "Mina",
      dueDate: "2024-01-15",
      sheetNumber: "E201"
    },
    {
      id: "2",
      title: "Review panel schedules for consistency",
      status: "IN_PROGRESS",
      severity: "MEDIUM",
      assignedTo: "Christian",
      dueDate: "2024-01-18",
      sheetNumber: "E301"
    },
    {
      id: "3",
      title: "Update lighting fixture specifications",
      status: "IN_PROGRESS",
      severity: "LOW",
      assignedTo: "Jennifer",
      sheetNumber: "L101"
    },
    {
      id: "4",
      title: "Critical: Fire alarm device locations missing",
      status: "OPEN",
      severity: "CRITICAL",
      assignedTo: "Night Vision",
      dueDate: "2024-01-12",
      sheetNumber: "E105"
    },
    {
      id: "5",
      title: "Resolve power distribution calculations",
      status: "RESOLVED",
      severity: "HIGH",
      assignedTo: "Mina",
      sheetNumber: "E202"
    },
  ];

  const columns = [
    { 
      title: "Open", 
      items: mockItems.filter(i => i.status === "OPEN"),
      count: mockItems.filter(i => i.status === "OPEN").length
    },
    { 
      title: "In Progress", 
      items: mockItems.filter(i => i.status === "IN_PROGRESS"),
      count: mockItems.filter(i => i.status === "IN_PROGRESS").length
    },
    { 
      title: "Needs Info", 
      items: mockItems.filter(i => i.status === "NEEDS_INFO"),
      count: mockItems.filter(i => i.status === "NEEDS_INFO").length
    },
    { 
      title: "Resolved", 
      items: mockItems.filter(i => i.status === "RESOLVED"),
      count: mockItems.filter(i => i.status === "RESOLVED").length
    },
    { 
      title: "Verified", 
      items: mockItems.filter(i => i.status === "VERIFIED"),
      count: mockItems.filter(i => i.status === "VERIFIED").length
    },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <KanbanColumn key={column.title} {...column} />
      ))}
    </div>
  );
};

export default KanbanBoard;
