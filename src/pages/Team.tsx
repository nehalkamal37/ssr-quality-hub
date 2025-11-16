import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Mail, Phone, BarChart } from "lucide-react";
import { useState } from "react";

const Team = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const teamMembers = [
    {
      id: "1",
      name: "Greg Lobo",
      role: "PM",
      email: "greg.lobo@ssr.com",
      phone: "(555) 123-4567",
      activeProjects: 3,
      assignedQA: 8,
      completionRate: 94,
      initials: "GL"
    },
    {
      id: "2",
      name: "Katherine Clark",
      role: "Senior Reviewer",
      email: "katherine.clark@ssr.com",
      phone: "(555) 234-5678",
      activeProjects: 2,
      assignedQA: 15,
      completionRate: 96,
      initials: "KC"
    },
    {
      id: "3",
      name: "Mina",
      role: "Engineer/EIT",
      email: "mina@ssr.com",
      phone: "(555) 345-6789",
      activeProjects: 4,
      assignedQA: 22,
      completionRate: 88,
      initials: "M"
    },
    {
      id: "4",
      name: "Christian",
      role: "Engineer/EIT",
      email: "christian@ssr.com",
      phone: "(555) 456-7890",
      activeProjects: 3,
      assignedQA: 18,
      completionRate: 91,
      initials: "C"
    },
    {
      id: "5",
      name: "Jennifer",
      role: "Engineer/EIT",
      email: "jennifer@ssr.com",
      phone: "(555) 567-8901",
      activeProjects: 2,
      assignedQA: 14,
      completionRate: 93,
      initials: "J"
    },
    {
      id: "6",
      name: "Night Vision",
      role: "Night Vision",
      email: "nightvision@ssr.com",
      phone: "(555) 678-9012",
      activeProjects: 5,
      assignedQA: 31,
      completionRate: 89,
      initials: "NV"
    }
  ];

  const roleColors = {
    "PM": "bg-primary text-primary-foreground",
    "Senior Reviewer": "bg-secondary text-secondary-foreground",
    "Engineer/EIT": "bg-accent text-accent-foreground",
    "Night Vision": "bg-info text-info-foreground"
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team</h1>
            <p className="text-muted-foreground mt-1">
              Manage team members and their QA/QC assignments
            </p>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 bg-primary text-primary-foreground">
                    <AvatarFallback className="text-lg font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge 
                      className={`mt-2 ${roleColors[member.role as keyof typeof roleColors]}`}
                    >
                      {member.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {member.activeProjects}
                    </div>
                    <div className="text-xs text-muted-foreground">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {member.assignedQA}
                    </div>
                    <div className="text-xs text-muted-foreground">QA Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {member.completionRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Complete</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart className="w-4 h-4 mr-1" />
                    Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No team members found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or add a new team member
            </p>
          </div>
        )}

        {/* Team Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Team Performance Overview</CardTitle>
            <CardDescription>Aggregated metrics across all team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{teamMembers.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  {teamMembers.reduce((sum, m) => sum + m.activeProjects, 0)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  {teamMembers.reduce((sum, m) => sum + m.assignedQA, 0)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Total QA Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success">
                  {Math.round(teamMembers.reduce((sum, m) => sum + m.completionRate, 0) / teamMembers.length)}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">Avg Completion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Team;
