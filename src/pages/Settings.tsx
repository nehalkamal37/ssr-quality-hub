import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, Bell, Shield, Database, Mail } from "lucide-react";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure application preferences and integrations
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>
                  Basic information about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" defaultValue="SSR Electrical and Technology" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="org-email">Contact Email</Label>
                  <Input id="org-email" type="email" defaultValue="info@ssr.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="pst">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                      <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                      <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QA/QC Preferences</CardTitle>
                <CardDescription>
                  Configure default QA/QC workflow settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-due">Default QA Item Due Days</Label>
                  <Input id="default-due" type="number" defaultValue="7" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auto-assign">Auto-assign Strategy</Label>
                  <Select defaultValue="round-robin">
                    <SelectTrigger id="auto-assign">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                      <SelectItem value="workload">Based on Workload</SelectItem>
                      <SelectItem value="manual">Manual Assignment Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Verification Before Closing</Label>
                    <p className="text-sm text-muted-foreground">
                      QA items must be verified before marking as closed
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Email Notifications
                  </div>
                </CardTitle>
                <CardDescription>
                  Configure when you receive email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New QA Item Assigned</Label>
                    <p className="text-sm text-muted-foreground">
                      When a QA item is assigned to you
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>QA Item Due Soon</Label>
                    <p className="text-sm text-muted-foreground">
                      24 hours before a QA item is due
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>QA Item Overdue</Label>
                    <p className="text-sm text-muted-foreground">
                      When a QA item passes its due date
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Summary Report</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly digest of QA/QC activity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Microsoft Teams Integration</CardTitle>
                <CardDescription>
                  Send notifications to Teams channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Teams Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Post updates to project channels
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    External Integrations
                  </div>
                </CardTitle>
                <CardDescription>
                  Connect with external tools and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bluebeam */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Bluebeam Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      Import markups and QA items from Bluebeam sessions
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                {/* Procore */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Procore</h4>
                    <p className="text-sm text-muted-foreground">
                      Sync submittals and RFIs with Procore
                    </p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>

                {/* Power BI */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-semibold">Power BI</h4>
                    <p className="text-sm text-muted-foreground">
                      Export data for Power BI dashboards
                    </p>
                  </div>
                  <Button variant="outline">Setup</Button>
                </div>

                {/* BST */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-semibold">BST (Utilization Tracking)</h4>
                    <p className="text-sm text-muted-foreground">
                      Read-only integration for utilization metrics
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Authentication & Access
                  </div>
                </CardTitle>
                <CardDescription>
                  Manage security and access control settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Azure AD Single Sign-On</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable SSO via Azure Active Directory
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all users
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input type="number" defaultValue="480" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Backup</CardTitle>
                <CardDescription>
                  Configure data retention and backup policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Daily backups of all project data
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Data Retention Period (days)</Label>
                  <Input type="number" defaultValue="2555" />
                  <p className="text-sm text-muted-foreground">
                    Keep closed QA items and archived projects for 7 years
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
