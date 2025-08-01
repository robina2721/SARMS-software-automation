import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AuditTrail } from "@/components/AuditTrail";
import {
  AlertTriangle,
  Save,
  Trash2,
  Users,
  Settings as SettingsIcon,
  Mail,
  Bell,
  Shield,
  Database,
  FileText,
  Plus,
  Edit,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data
const systemUsers = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@company.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-20",
  },
  {
    id: "2",
    name: "Jane Customer",
    email: "customer@company.com",
    role: "customer",
    status: "active",
    lastLogin: "2024-01-19",
  },
  {
    id: "3",
    name: "Mike PM",
    email: "pm@company.com",
    role: "project_manager",
    status: "active",
    lastLogin: "2024-01-18",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@company.com",
    role: "customer",
    status: "inactive",
    lastLogin: "2024-01-10",
  },
];

const systemSettings = {
  emailNotifications: true,
  autoApproval: false,
  maxFileSize: "10",
  sessionTimeout: "60",
  maintenanceMode: false,
  requestAutoAssignment: true,
  defaultPriority: "medium",
  approvalWorkflow: "manual",
};

const emailTemplates = [
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to SARMS",
    status: "active",
  },
  {
    id: "approval",
    name: "Request Approved",
    subject: "Your request has been approved",
    status: "active",
  },
  {
    id: "rejection",
    name: "Request Rejected",
    subject: "Request requires revision",
    status: "active",
  },
  {
    id: "reminder",
    name: "Pending Review",
    subject: "Request pending your review",
    status: "draft",
  },
];

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(systemSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              Settings are only available to system administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/15 text-destructive";
      case "project_manager":
        return "bg-accent/20 text-accent-foreground";
      case "customer":
        return "bg-primary/15 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/15 text-primary";
      case "inactive":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences and manage users
          </p>
        </div>
      </div>

      {success && (
        <Alert>
          <Save className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <span>System Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Request Priority</Label>
                  <Select
                    value={settings.defaultPriority}
                    onValueChange={(value) =>
                      handleSettingChange("defaultPriority", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max File Upload Size (MB)</Label>
                  <Input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) =>
                      handleSettingChange("maxFileSize", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange("sessionTimeout", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Approval Workflow</Label>
                  <Select
                    value={settings.approvalWorkflow}
                    onValueChange={(value) =>
                      handleSettingChange("approvalWorkflow", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Approval</SelectItem>
                      <SelectItem value="auto-low">
                        Auto-approve Low Priority
                      </SelectItem>
                      <SelectItem value="department">
                        Department Head Approval
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for request updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Assignment</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign requests to project managers
                    </p>
                  </div>
                  <Switch
                    checked={settings.requestAutoAssignment}
                    onCheckedChange={(checked) =>
                      handleSettingChange("requestAutoAssignment", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode for system updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) =>
                      handleSettingChange("maintenanceMode", checked)
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Management</span>
                </CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <p className="font-medium">{user.name}</p>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role.replace("_", " ")}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getStatusColor(user.status)}
                        >
                          {user.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last login: {user.lastLogin}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>SMTP Server</Label>
                  <Input placeholder="smtp.company.com" />
                </div>
                <div className="space-y-2">
                  <Label>SMTP Port</Label>
                  <Input placeholder="587" type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input placeholder="noreply@company.com" />
                </div>
                <div className="space-y-2">
                  <Label>From Name</Label>
                  <Input placeholder="SARMS System" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Email Templates</CardTitle>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emailTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {template.subject}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          template.status === "active" ? "default" : "secondary"
                        }
                      >
                        {template.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Minimum Password Length</Label>
                  <Input type="number" defaultValue="8" />
                </div>
                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Input type="number" defaultValue="90" />
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label>Account Lockout Duration (minutes)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Restriction</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict access to specific IP ranges
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all user actions and system changes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Backup & Recovery</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Retention Period (days)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label>Backup Location</Label>
                  <Input placeholder="s3://backup-bucket/sarms" />
                </div>
                <div className="space-y-2">
                  <Label>Last Backup</Label>
                  <Input disabled value="2024-01-20 03:00 UTC" />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button>
                  <Database className="h-4 w-4 mr-2" />
                  Create Backup Now
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Backup Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail */}
        <TabsContent value="audit" className="space-y-6">
          <AuditTrail />
        </TabsContent>
      </Tabs>
    </div>
  );
}
