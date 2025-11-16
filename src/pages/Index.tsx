import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import KanbanBoard from "@/components/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Download,
  Filter,
  Plus
} from "lucide-react";

const Index = () => {
  // Mock data
  const projects = [
    {
      id: "1",
      name: "Tech Campus Phase 3",
      client: "University of XYZ",
      phase: "Construction Documents",
      completion: 78,
      openIssues: 12,
      status: "IN_REVIEW"
    },
    {
      id: "2",
      name: "Medical Center Renovation",
      client: "Healthcare Corp",
      phase: "Design Development",
      completion: 45,
      openIssues: 24,
      status: "CHANGES_REQUIRED"
    },
    {
      id: "3",
      name: "Office Tower Electrical",
      client: "Real Estate LLC",
      phase: "Schematic Design",
      completion: 92,
      openIssues: 3,
      status: "READY_FOR_SIGNOFF"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">QA/QC Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor quality assurance across all electrical projects
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active QA Items"
            value={156}
            icon={ClipboardCheck}
            description="Across all projects"
            trend={{ value: 8, isPositive: false }}
          />
          <StatCard
            title="Critical Issues"
            value={7}
            icon={AlertTriangle}
            description="Require immediate attention"
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard
            title="Resolved This Week"
            value={42}
            icon={CheckCircle2}
            description="+15% from last week"
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Avg Resolution Time"
            value="4.2d"
            icon={Clock}
            description="Below 7 day target"
            trend={{ value: 18, isPositive: true }}
          />
        </div>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>
              Current electrical projects in QA/QC review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {project.client} • {project.phase}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">
                        {project.openIssues} open issues
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {project.completion}% complete
                      </div>
                    </div>
                  </div>
                  <Progress value={project.completion} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <Card>
          <CardHeader>
            <CardTitle>QA Item Pipeline</CardTitle>
            <CardDescription>
              Track quality assurance items through review workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KanbanBoard />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
