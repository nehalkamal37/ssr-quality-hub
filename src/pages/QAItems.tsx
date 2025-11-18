import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import AddReviewDialog from "@/components/AddReviewDialog";
import ViewReviewsDialog from "@/components/ViewReviewsDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Download, AlertCircle, User, FileText, MessageSquare, Eye } from "lucide-react";
import { useState } from "react";

interface Review {
  id: string;
  comment: string;
  status: string;
  reviewerName: string;
  createdAt: string;
}

const QAItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [viewReviewsDialogOpen, setViewReviewsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; title: string } | null>(null);
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});

  const handleAddReview = (itemId: string, itemTitle: string) => {
    setSelectedItem({ id: itemId, title: itemTitle });
    setReviewDialogOpen(true);
  };

  const handleViewReviews = (itemId: string, itemTitle: string) => {
    setSelectedItem({ id: itemId, title: itemTitle });
    setViewReviewsDialogOpen(true);
  };

  const handleReviewSubmit = (review: Omit<Review, "id" | "createdAt">) => {
    if (!selectedItem) return;
    
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    setReviews(prev => ({
      ...prev,
      [selectedItem.id]: [...(prev[selectedItem.id] || []), newReview]
    }));
  };

  const qaItems = [
    {
      id: "QA-001",
      title: "Verify conduit routing on Level 2 electrical room",
      project: "Tech Campus Phase 3",
      sheet: "E201",
      status: "OPEN" as const,
      severity: "HIGH",
      assignedTo: "Mina",
      dueDate: "2024-01-15",
      category: "Design Review"
    },
    {
      id: "QA-002",
      title: "Review panel schedules for consistency",
      project: "Tech Campus Phase 3",
      sheet: "E301",
      status: "IN_PROGRESS" as const,
      severity: "MEDIUM",
      assignedTo: "Christian",
      dueDate: "2024-01-18",
      category: "Coordination"
    },
    {
      id: "QA-003",
      title: "Update lighting fixture specifications",
      project: "Medical Center Renovation",
      sheet: "L101",
      status: "IN_PROGRESS" as const,
      severity: "LOW",
      assignedTo: "Jennifer",
      dueDate: "2024-01-20",
      category: "Documentation"
    },
    {
      id: "QA-004",
      title: "Critical: Fire alarm device locations missing",
      project: "Tech Campus Phase 3",
      sheet: "E105",
      status: "OPEN" as const,
      severity: "CRITICAL",
      assignedTo: "Night Vision",
      dueDate: "2024-01-12",
      category: "Safety"
    },
    {
      id: "QA-005",
      title: "Resolve power distribution calculations",
      project: "Office Tower Electrical",
      sheet: "E202",
      status: "RESOLVED" as const,
      severity: "HIGH",
      assignedTo: "Mina",
      dueDate: "2024-01-10",
      category: "Calculation"
    },
    {
      id: "QA-006",
      title: "Verify emergency lighting coverage in corridors",
      project: "Medical Center Renovation",
      sheet: "L205",
      status: "VERIFIED" as const,
      severity: "MEDIUM",
      assignedTo: "Katherine Clark",
      dueDate: "2024-01-08",
      category: "Code Compliance"
    },
    {
      id: "QA-007",
      title: "Update transformer specifications",
      project: "Residential Complex - Building A",
      sheet: "E401",
      status: "NEEDS_INFO" as const,
      severity: "MEDIUM",
      assignedTo: "Christian",
      dueDate: "2024-01-16",
      category: "Equipment"
    },
    {
      id: "QA-008",
      title: "Confirm grounding details at service entrance",
      project: "Office Tower Electrical",
      sheet: "E101",
      status: "CLOSED" as const,
      severity: "HIGH",
      assignedTo: "Mina",
      dueDate: "2024-01-05",
      category: "Safety"
    }
  ];

  const severityColors = {
    LOW: "bg-info/10 text-info border-info/20",
    MEDIUM: "bg-warning/10 text-warning border-warning/20",
    HIGH: "bg-destructive/10 text-destructive border-destructive/20",
    CRITICAL: "bg-destructive text-destructive-foreground",
  };

  const filteredItems = qaItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || item.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">QA Items</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage quality assurance items across all projects
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <AlertCircle className="w-4 h-4 mr-2" />
              Create QA Item
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search QA items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="NEEDS_INFO">Needs Info</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* QA Items Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Sheet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const itemReviews = reviews[item.id] || [];
                return (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2 max-w-md">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span className="line-clamp-2">{item.title}</span>
                      </div>
                    </TableCell>
                  <TableCell className="text-muted-foreground">{item.project}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      {item.sheet}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={severityColors[item.severity as keyof typeof severityColors]}>
                      {item.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      {item.assignedTo}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddReview(item.id, item.title)}
                        className="gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Add
                      </Button>
                      {itemReviews.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewReviews(item.id, item.title)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View ({itemReviews.length})
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
              })}
            </TableBody>
          </Table>
        </Card>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No QA items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or create a new QA item
            </p>
          </div>
        )}
      </div>
      
      {selectedItem && (
        <>
          <AddReviewDialog
            open={reviewDialogOpen}
            onOpenChange={setReviewDialogOpen}
            qaItemId={selectedItem.id}
            qaItemTitle={selectedItem.title}
            onAddReview={handleReviewSubmit}
          />
          <ViewReviewsDialog
            open={viewReviewsDialogOpen}
            onOpenChange={setViewReviewsDialogOpen}
            qaItemTitle={selectedItem.title}
            reviews={reviews[selectedItem.id] || []}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default QAItems;
