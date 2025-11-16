import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/StatusBadge";
import { 
  Search, 
  Plus, 
  Filter,
  Calendar,
  User,
  FolderOpen,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const projects = [
    {
      id: "1",
      name: "Tech Campus Phase 3",
      client: "University of XYZ",
      pm: "Greg Lobo",
      phase: "Construction Documents",
      status: "IN_REVIEW" as const,
      completion: 78,
      openIssues: 12,
      totalSheets: 45,
      startDate: "2024-01-15",
      dueDate: "2024-03-30",
      disciplines: ["Electrical", "Lighting", "Fire Alarm"]
    },
    {
      id: "2",
      name: "Medical Center Renovation",
      client: "Healthcare Corp",
      pm: "Katherine Clark",
      phase: "Design Development",
      status: "CHANGES_REQUIRED" as const,
      completion: 45,
      openIssues: 24,
      totalSheets: 62,
      startDate: "2024-02-01",
      dueDate: "2024-05-15",
      disciplines: ["Electrical", "Fire Alarm"]
    },
    {
      id: "3",
      name: "Office Tower Electrical",
      client: "Real Estate LLC",
      pm: "Greg Lobo",
      phase: "Schematic Design",
      status: "READY_FOR_SIGNOFF" as const,
      completion: 92,
      openIssues: 3,
      totalSheets: 28,
      startDate: "2023-11-10",
      dueDate: "2024-01-20",
      disciplines: ["Electrical", "Lighting"]
    },
    {
      id: "4",
      name: "Residential Complex - Building A",
      client: "Housing Development Inc",
      pm: "Katherine Clark",
      phase: "Construction Documents",
      status: "IN_REVIEW" as const,
      completion: 67,
      openIssues: 18,
      totalSheets: 38,
      startDate: "2024-01-20",
      dueDate: "2024-04-10",
      disciplines: ["Electrical", "Lighting"]
    },
    {
      id: "5",
      name: "Industrial Warehouse Upgrade",
      client: "Manufacturing Co",
      pm: "Greg Lobo",
      phase: "Planning",
      status: "PLANNING" as const,
      completion: 15,
      openIssues: 5,
      totalSheets: 18,
      startDate: "2024-03-01",
      dueDate: "2024-06-30",
      disciplines: ["Electrical"]
    }
  ];

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage electrical engineering projects and QA/QC phases
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <FolderOpen className="w-8 h-8 text-primary" />
                  <StatusBadge status={project.status} />
                </div>
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription>{project.client}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>PM: {project.pm}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {project.dueDate}</span>
                  </div>
                </div>

                {/* Phase */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Current Phase: {project.phase}
                  </p>
                  <div className="flex items-center gap-3">
                    <Progress value={project.completion} className="flex-1 h-2" />
                    <span className="text-sm font-semibold text-foreground min-w-[3ch]">
                      {project.completion}%
                    </span>
                  </div>
                </div>

                {/* Disciplines */}
                <div className="flex flex-wrap gap-2">
                  {project.disciplines.map((discipline) => (
                    <Badge key={discipline} variant="secondary">
                      {discipline}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">{project.openIssues}</span>
                    <span className="text-muted-foreground"> open issues</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">{project.totalSheets}</span>
                    <span className="text-muted-foreground"> sheets</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or create a new project
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
