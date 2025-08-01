import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  Key,
  AlertTriangle,
  Save,
} from "lucide-react";

interface Privilege {
  id: string;
  name: string;
  description: string;
  category: string;
  isSystemPrivilege: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  privileges: string[];
  userCount: number;
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mock privileges data
const mockPrivileges: Privilege[] = [
  // Master Data Privileges
  {
    id: "manage_employees",
    name: "Manage Employees",
    description: "Create, edit, and delete employee records",
    category: "Master Data",
    isSystemPrivilege: true,
  },
  {
    id: "manage_cost_centers",
    name: "Manage Cost Centers",
    description: "Create, edit, and delete cost centers",
    category: "Master Data",
    isSystemPrivilege: true,
  },
  {
    id: "manage_priority_config",
    name: "Manage Priority Configuration",
    description: "Configure system priority rules",
    category: "Master Data",
    isSystemPrivilege: true,
  },

  // Account Management Privileges
  {
    id: "manage_users",
    name: "Manage User Accounts",
    description: "Create, edit, and deactivate user accounts",
    category: "Account Management",
    isSystemPrivilege: true,
  },
  {
    id: "manage_roles",
    name: "Manage Roles",
    description: "Create and edit roles and privileges",
    category: "Account Management",
    isSystemPrivilege: true,
  },
  {
    id: "reset_passwords",
    name: "Reset Passwords",
    description: "Reset user passwords",
    category: "Account Management",
    isSystemPrivilege: true,
  },

  // Request Management Privileges
  {
    id: "create_request",
    name: "Create Requests",
    description: "Submit new software requests",
    category: "Request Management",
    isSystemPrivilege: false,
  },
  {
    id: "view_own_requests",
    name: "View Own Requests",
    description: "View personal submitted requests",
    category: "Request Management",
    isSystemPrivilege: false,
  },
  {
    id: "view_all_requests",
    name: "View All Requests",
    description: "View all system requests",
    category: "Request Management",
    isSystemPrivilege: true,
  },
  {
    id: "assign_requests",
    name: "Assign Requests",
    description: "Assign requests to project managers",
    category: "Request Management",
    isSystemPrivilege: true,
  },
  {
    id: "review_requests",
    name: "Review Requests",
    description: "Review and approve/reject requests",
    category: "Request Management",
    isSystemPrivilege: false,
  },
  {
    id: "manage_status",
    name: "Manage Request Status",
    description: "Change request status and add remarks",
    category: "Request Management",
    isSystemPrivilege: false,
  },

  // System Privileges
  {
    id: "view_analytics",
    name: "View Analytics",
    description: "Access system analytics and reports",
    category: "System",
    isSystemPrivilege: true,
  },
  {
    id: "system_settings",
    name: "System Settings",
    description: "Configure system settings",
    category: "System",
    isSystemPrivilege: true,
  },
  {
    id: "audit_logs",
    name: "View Audit Logs",
    description: "Access system audit trail",
    category: "System",
    isSystemPrivilege: true,
  },

  // Document Management
  {
    id: "upload_documents",
    name: "Upload Documents",
    description: "Upload files and documents",
    category: "Document Management",
    isSystemPrivilege: false,
  },
  {
    id: "download_documents",
    name: "Download Documents",
    description: "Download uploaded documents",
    category: "Document Management",
    isSystemPrivilege: false,
  },
];

// Mock roles data
const mockRoles: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access with all privileges",
    privileges: [
      "manage_employees",
      "manage_cost_centers",
      "manage_priority_config",
      "manage_users",
      "manage_roles",
      "reset_passwords",
      "view_all_requests",
      "assign_requests",
      "view_analytics",
      "system_settings",
      "audit_logs",
    ],
    userCount: 2,
    isSystemRole: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "project_manager",
    name: "Project Manager",
    description: "Review and manage assigned requests",
    privileges: [
      "view_all_requests",
      "review_requests",
      "manage_status",
      "view_analytics",
      "upload_documents",
      "download_documents",
    ],
    userCount: 5,
    isSystemRole: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "customer",
    name: "Customer",
    description: "Submit and track personal requests",
    privileges: [
      "create_request",
      "view_own_requests",
      "upload_documents",
      "download_documents",
    ],
    userCount: 25,
    isSystemRole: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export default function RolesPrivileges() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("roles");
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [privileges] = useState<Privilege[]>(mockPrivileges);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privileges: [] as string[],
  });

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              Role and privilege management is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      privileges: [],
    });
    setEditingRole(null);
    setError("");
  };

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description,
        privileges: [...role.privileges],
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handlePrivilegeToggle = (privilegeId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      privileges: checked
        ? [...prev.privileges, privilegeId]
        : prev.privileges.filter((id) => id !== privilegeId),
    }));
  };

  const handleSave = async () => {
    setError("");

    if (!formData.name || !formData.description) {
      setError("Name and description are required");
      return;
    }

    if (formData.privileges.length === 0) {
      setError("At least one privilege must be selected");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingRole) {
        setRoles((prev) =>
          prev.map((role) =>
            role.id === editingRole.id
              ? { ...role, ...formData, updatedAt: new Date() }
              : role,
          ),
        );
      } else {
        const newRole: Role = {
          id: formData.name.toLowerCase().replace(/\s+/g, "_"),
          ...formData,
          userCount: 0,
          isSystemRole: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setRoles((prev) => [...prev, newRole]);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      setError("Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);

    if (role?.isSystemRole) {
      setError("Cannot delete system roles");
      return;
    }

    if (role?.userCount > 0) {
      setError("Cannot delete role with assigned users");
      return;
    }

    if (!confirm("Are you sure you want to delete this role?")) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
    } catch (error) {
      setError("Failed to delete role");
    } finally {
      setLoading(false);
    }
  };

  const getPrivilegesByCategory = (category: string) => {
    return privileges.filter((p) => p.category === category);
  };

  const categories = [...new Set(privileges.map((p) => p.category))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Roles & Privileges
          </h1>
          <p className="text-muted-foreground">
            Define and manage user roles and system privileges
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="roles">Roles Management</TabsTrigger>
          <TabsTrigger value="privileges">Privileges List</TabsTrigger>
        </TabsList>

        {/* Roles Management */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingRole ? "Edit Role" : "Create New Role"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roleName">Role Name *</Label>
                      <Input
                        id="roleName"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter role name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="roleDescription">Description *</Label>
                      <Textarea
                        id="roleDescription"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter role description"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Assign Privileges
                    </Label>
                    <div className="space-y-6">
                      {categories.map((category) => (
                        <Card key={category}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">
                              {category}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {getPrivilegesByCategory(category).map(
                                (privilege) => (
                                  <div
                                    key={privilege.id}
                                    className="flex items-start space-x-2"
                                  >
                                    <Checkbox
                                      id={privilege.id}
                                      checked={formData.privileges.includes(
                                        privilege.id,
                                      )}
                                      onCheckedChange={(checked) =>
                                        handlePrivilegeToggle(
                                          privilege.id,
                                          checked as boolean,
                                        )
                                      }
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                      <Label
                                        htmlFor={privilege.id}
                                        className="text-sm font-medium"
                                      >
                                        {privilege.name}
                                      </Label>
                                      <p className="text-xs text-muted-foreground">
                                        {privilege.description}
                                      </p>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading
                        ? "Saving..."
                        : editingRole
                          ? "Update"
                          : "Create"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">{role.name}</h3>
                        </div>
                        {role.isSystemRole && (
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary"
                          >
                            System Role
                          </Badge>
                        )}
                        <Badge variant="outline">{role.userCount} users</Badge>
                      </div>

                      <p className="text-muted-foreground">
                        {role.description}
                      </p>

                      <div>
                        <p className="text-sm font-medium mb-2">
                          Privileges ({role.privileges.length})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {role.privileges.slice(0, 5).map((privilegeId) => {
                            const privilege = privileges.find(
                              (p) => p.id === privilegeId,
                            );
                            return privilege ? (
                              <Badge
                                key={privilegeId}
                                variant="secondary"
                                className="text-xs"
                              >
                                {privilege.name}
                              </Badge>
                            ) : null;
                          })}
                          {role.privileges.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{role.privileges.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>
                          Created: {role.createdAt.toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>
                          Updated: {role.updatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(role)}
                        disabled={role.isSystemRole}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(role.id)}
                        disabled={role.isSystemRole || role.userCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Privileges List */}
        <TabsContent value="privileges" className="space-y-6">
          <div className="space-y-6">
            {categories.map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>{category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getPrivilegesByCategory(category).map((privilege) => (
                      <div
                        key={privilege.id}
                        className="flex items-start justify-between p-3 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{privilege.name}</h4>
                            {privilege.isSystemPrivilege && (
                              <Badge variant="outline" className="text-xs">
                                System
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {privilege.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
