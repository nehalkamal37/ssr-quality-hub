import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format } from "date-fns";
import { Activity, FileUp, FileX, Edit, Upload, ArrowUpDown, Search, Filter, X } from "lucide-react";

interface ActivityLog {
  id: string;
  activity_type: string;
  description: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  qa_item_id: string | null;
  project_id: string | null;
  user: {
    full_name: string;
    email: string;
  } | null;
  qa_item: {
    item_number: string;
    title: string;
  } | null;
  project: {
    name: string;
  } | null;
}

const activityIcons: Record<string, any> = {
  status_change: ArrowUpDown,
  review_added: Activity,
  attachment_uploaded: FileUp,
  attachment_deleted: FileX,
  item_edited: Edit,
  import_performed: Upload,
};

const activityColors: Record<string, string> = {
  status_change: "bg-blue-500/10 text-blue-500",
  review_added: "bg-green-500/10 text-green-500",
  attachment_uploaded: "bg-purple-500/10 text-purple-500",
  attachment_deleted: "bg-red-500/10 text-red-500",
  item_edited: "bg-yellow-500/10 text-yellow-500",
  import_performed: "bg-indigo-500/10 text-indigo-500",
};

// Mock data for demonstration
const mockActivities: ActivityLog[] = [
  {
    id: '1',
    activity_type: 'status_change',
    description: 'Changed status from Open to Resolved',
    old_value: 'open',
    new_value: 'resolved',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    qa_item_id: 'qa-1',
    project_id: 'proj-1',
    user: { full_name: 'Sarah Johnson', email: 'sarah.j@example.com' },
    qa_item: { item_number: 'QA-2024-001', title: 'Electrical conduit routing issue' },
    project: { name: 'Downtown Office Tower' }
  },
  {
    id: '2',
    activity_type: 'review_added',
    description: 'Added review comment on QA item',
    old_value: null,
    new_value: null,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    qa_item_id: 'qa-2',
    project_id: 'proj-1',
    user: { full_name: 'Michael Chen', email: 'michael.c@example.com' },
    qa_item: { item_number: 'QA-2024-002', title: 'HVAC duct clearance conflict' },
    project: { name: 'Downtown Office Tower' }
  },
  {
    id: '3',
    activity_type: 'attachment_uploaded',
    description: 'Uploaded attachment: field_photo_north_wing.jpg',
    old_value: null,
    new_value: null,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    qa_item_id: 'qa-1',
    project_id: 'proj-2',
    user: { full_name: 'Emily Rodriguez', email: 'emily.r@example.com' },
    qa_item: { item_number: 'QA-2024-003', title: 'Concrete pour quality concern' },
    project: { name: 'Riverside Apartments' }
  },
  {
    id: '4',
    activity_type: 'status_change',
    description: 'Changed status from Noted to Open',
    old_value: 'noted',
    new_value: 'open',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    qa_item_id: 'qa-3',
    project_id: 'proj-1',
    user: { full_name: 'David Park', email: 'david.p@example.com' },
    qa_item: { item_number: 'QA-2024-004', title: 'Plumbing fixture alignment' },
    project: { name: 'Downtown Office Tower' }
  },
  {
    id: '5',
    activity_type: 'item_edited',
    description: 'Updated item details and severity',
    old_value: null,
    new_value: null,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    qa_item_id: 'qa-2',
    project_id: 'proj-3',
    user: { full_name: 'Jessica Williams', email: 'jessica.w@example.com' },
    qa_item: { item_number: 'QA-2024-005', title: 'Fire safety clearance issue' },
    project: { name: 'Medical Center Expansion' }
  },
  {
    id: '6',
    activity_type: 'import_performed',
    description: 'Imported 24 QA items from Excel spreadsheet',
    old_value: null,
    new_value: '24 items',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    qa_item_id: null,
    project_id: 'proj-1',
    user: { full_name: 'Robert Martinez', email: 'robert.m@example.com' },
    qa_item: null,
    project: { name: 'Downtown Office Tower' }
  },
  {
    id: '7',
    activity_type: 'attachment_deleted',
    description: 'Deleted attachment: obsolete_drawing_v1.pdf',
    old_value: null,
    new_value: null,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    qa_item_id: 'qa-4',
    project_id: 'proj-2',
    user: { full_name: 'Amanda Foster', email: 'amanda.f@example.com' },
    qa_item: { item_number: 'QA-2024-006', title: 'Steel beam installation angle' },
    project: { name: 'Riverside Apartments' }
  },
  {
    id: '8',
    activity_type: 'status_change',
    description: 'Changed status from Resolved to Verified',
    old_value: 'resolved',
    new_value: 'verified',
    created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    qa_item_id: 'qa-5',
    project_id: 'proj-3',
    user: { full_name: 'Christopher Lee', email: 'chris.l@example.com' },
    qa_item: { item_number: 'QA-2024-007', title: 'Window installation waterproofing' },
    project: { name: 'Medical Center Expansion' }
  }
];

export default function ActivityTimeline() {
  const [activities] = useState<ActivityLog[]>(mockActivities);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const navigate = useNavigate();

  // Get unique projects for filter
  const uniqueProjects = Array.from(
    new Set(activities.map(a => a.project?.name).filter(Boolean))
  ) as string[];

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.qa_item?.item_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.qa_item?.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activityTypeFilter === "all" || activity.activity_type === activityTypeFilter;
    const matchesProject = projectFilter === "all" || activity.project?.name === projectFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const activityDate = new Date(activity.created_at);
      const now = new Date();
      const hoursDiff = (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60);
      
      if (dateFilter === "today") {
        matchesDate = hoursDiff <= 24;
      } else if (dateFilter === "week") {
        matchesDate = hoursDiff <= 168;
      } else if (dateFilter === "month") {
        matchesDate = hoursDiff <= 720;
      }
    }
    
    return matchesSearch && matchesType && matchesProject && matchesDate;
  });

  const handleActivityClick = (activity: ActivityLog) => {
    if (activity.qa_item_id) {
      navigate(`/qa-items?highlight=${activity.qa_item_id}`);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActivityTypeFilter("all");
    setProjectFilter("all");
    setDateFilter("all");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Timeline</h1>
          <p className="text-muted-foreground mt-2">
            Complete history of all actions and changes across projects
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Activity Type</label>
                <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="status_change">Status Change</SelectItem>
                    <SelectItem value="review_added">Review Added</SelectItem>
                    <SelectItem value="attachment_uploaded">Attachment Uploaded</SelectItem>
                    <SelectItem value="attachment_deleted">Attachment Deleted</SelectItem>
                    <SelectItem value="item_edited">Item Edited</SelectItem>
                    <SelectItem value="import_performed">Import Performed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {uniqueProjects.map(project => (
                      <SelectItem key={project} value={project}>{project}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchQuery || activityTypeFilter !== "all" || projectFilter !== "all" || dateFilter !== "all") && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || activityTypeFilter !== "all" || projectFilter !== "all" || dateFilter !== "all"
                  ? "No activities match your filters"
                  : "No activities recorded yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredActivities.length} of {activities.length} activities
              </p>
            </div>
            {filteredActivities.map((activity) => {
              const Icon = activityIcons[activity.activity_type] || Activity;
              const colorClass = activityColors[activity.activity_type] || "bg-gray-500/10 text-gray-500";

              return (
                <Card 
                  key={activity.id} 
                  className={`${activity.qa_item_id ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                  onClick={() => handleActivityClick(activity)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className={`h-10 w-10 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium">{activity.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {activity.qa_item && (
                                <Badge variant="outline">
                                  Item: {activity.qa_item.item_number}
                                </Badge>
                              )}
                              {activity.project && (
                                <Badge variant="outline">
                                  {activity.project.name}
                                </Badge>
                              )}
                              {activity.old_value && activity.new_value && (
                                <Badge variant="secondary">
                                  {activity.old_value} → {activity.new_value}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        {activity.user && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(activity.user.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">
                              {activity.user.full_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
