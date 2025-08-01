import { useState, useEffect } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { usersApi } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  Mail,
  Shield,
  Calendar,
  UserCheck,
  AlertTriangle,
  Eye,
  EyeOff,
  Key,
  UserX,
} from "lucide-react";

interface UserAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  createdBy: string;
  permissions: string[];
}

// Mock data
const mockUserAccounts: UserAccount[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Admin",
    email: "admin@company.com",
    role: "admin",
    isActive: true,
    lastLogin: new Date("2024-01-20T10:30:00"),
    createdAt: new Date("2024-01-01"),
    createdBy: "system",
    permissions: ["full_access", "user_management", "system_config"],
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Customer",
    email: "customer@company.com",
    role: "customer",
    department: "IT",
    isActive: true,
    lastLogin: new Date("2024-01-19T15:45:00"),
    createdAt: new Date("2024-01-02"),
    createdBy: "admin@company.com",
    permissions: ["create_request", "view_own_requests"],
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "PM",
    email: "pm@company.com",
    role: "project_manager",
    isActive: true,
    lastLogin: new Date("2024-01-20T08:15:00"),
    createdAt: new Date("2024-01-03"),
    createdBy: "admin@company.com",
    permissions: ["review_requests", "assign_requests", "view_analytics"],
  },
];

const rolePermissions = {
  admin: [
    "full_access",
    "user_management",
    "system_config",
    "view_analytics",
    "audit_logs",
  ],
  project_manager: [
    "review_requests",
    "assign_requests",
    "view_analytics",
    "status_management",
  ],
  customer: ["create_request", "view_own_requests", "upload_documents"],
};

export default function UserAccounts() {
  const { user } = useAuth();
  const [userAccounts, setUserAccounts] =
    useState<UserAccount[]>(mockUserAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "customer" as UserRole,
    department: "",
    password: "",
    confirmPassword: "",
    isActive: true,
  });

  // Mock employee data for dropdown
  const mockEmployees = [
    {
      id: "1",
      name: "John Michael Admin",
      email: "admin@company.com",
      department: "IT",
    },
    {
      id: "2",
      name: "Jane Elizabeth Customer",
      email: "customer@company.com",
      department: "IT",
    },
    {
      id: "3",
      name: "Mike David PM",
      email: "pm@company.com",
      department: "IT Project Management",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@company.com",
      department: "Finance",
    },
    {
      id: "5",
      name: "David Johnson",
      email: "david@company.com",
      department: "HR",
    },
  ];

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <div>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              User account management is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = userAccounts.filter((account) => {
    const matchesSearch =
      account.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || account.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && account.isActive) ||
      (statusFilter === "inactive" && !account.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "customer",
      department: "",
      password: "",
      confirmPassword: "",
      isActive: true,
    });
    setEditingUser(null);
    setError("");
  };

  const handleEmployeeSelect = (employeeId: string) => {
    const employee = mockEmployees.find((emp) => emp.id === employeeId);
    if (employee) {
      const [firstName, ...lastNameParts] = employee.name.split(" ");
      const lastName = lastNameParts.join(" ");
      setFormData((prev) => ({
        ...prev,
        employeeId,
        firstName,
        lastName,
        email: employee.email,
        department: employee.department,
      }));
    }
  };

  const handleOpenDialog = (userAccount?: UserAccount) => {
    if (userAccount) {
      setEditingUser(userAccount);
      setFormData({
        firstName: userAccount.firstName,
        lastName: userAccount.lastName,
        email: userAccount.email,
        role: userAccount.role,
        department: userAccount.department || "",
        password: "",
        confirmPassword: "",
        isActive: userAccount.isActive,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setError("");

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.role
    ) {
      setError("All required fields must be filled");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format");
      return;
    }

    if (!editingUser) {
      if (!formData.password || formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setLoading(true);
    try {
      if (editingUser) {
        // Update existing user
        const response = await usersApi.update(editingUser.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          isActive: formData.isActive,
        });

        if (response.success) {
          setUserAccounts((prev) =>
            prev.map((u) =>
              u.id === editingUser.id
                ? {
                    ...u,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    role: formData.role,
                    department: formData.department,
                    isActive: formData.isActive,
                    permissions: rolePermissions[formData.role],
                  }
                : u,
            ),
          );
        } else {
          throw new Error(response.message || "Failed to update user");
        }
      } else {
        // Create new user
        const response = await usersApi.create({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          password: formData.password,
          isActive: formData.isActive,
        });

        if (response.success && response.data) {
          const newUser: UserAccount = {
            id: response.data.id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            role: formData.role,
            department: formData.department,
            isActive: formData.isActive,
            lastLogin: null,
            createdAt: new Date(),
            createdBy: user?.email || "",
            permissions: rolePermissions[formData.role],
          };
          setUserAccounts((prev) => [...prev, newUser]);
        } else {
          throw new Error(response.message || "Failed to create user");
        }
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      setError(error.message || "Failed to save user account");
      // Fallback to mock behavior for development
      if (import.meta.env.DEV) {
        console.warn('API call failed, using fallback mock behavior');
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (editingUser) {
          setUserAccounts((prev) =>
            prev.map((u) =>
              u.id === editingUser.id
                ? {
                    ...u,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    role: formData.role,
                    department: formData.department,
                    isActive: formData.isActive,
                    permissions: rolePermissions[formData.role],
                  }
                : u,
            ),
          );
        } else {
          const newUser: UserAccount = {
            id: Date.now().toString(),
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            role: formData.role,
            department: formData.department,
            isActive: formData.isActive,
            lastLogin: null,
            createdAt: new Date(),
            createdBy: user?.email || "",
            permissions: rolePermissions[formData.role],
          };
          setUserAccounts((prev) => [...prev, newUser]);
        }
        setIsDialogOpen(false);
        resetForm();
        setError("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Mock API call
      setUserAccounts((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isActive: !u.isActive } : u,
        ),
      );
    } catch (error) {
      setError("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user account? This action cannot be undone.",
      )
    )
      return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Mock API call
      setUserAccounts((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      setError("Failed to delete user account");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUser) return;

    setError("");

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await usersApi.resetPassword(resetPasswordUser.id, newPassword);

      if (response.success) {
        setResetPasswordDialogOpen(false);
        setResetPasswordUser(null);
        setNewPassword("");
        setConfirmNewPassword("");
        alert(`Password has been reset successfully for ${resetPasswordUser.firstName} ${resetPasswordUser.lastName}`);
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error: any) {
      setError(error.message || "Failed to reset password");
      // Fallback for development
      if (import.meta.env.DEV) {
        console.warn('Password reset API failed, using fallback');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setResetPasswordDialogOpen(false);
        setResetPasswordUser(null);
        setNewPassword("");
        setConfirmNewPassword("");
        alert(`Password has been reset successfully for ${resetPasswordUser.firstName} ${resetPasswordUser.lastName}`);
        setError("");
      }
    } finally {
      setLoading(false);
    }
  };

  const openResetPasswordDialog = (userAccount: UserAccount) => {
    setResetPasswordUser(userAccount);
    setNewPassword("");
    setConfirmNewPassword("");
    setError("");
    setResetPasswordDialogOpen(true);
  };

  const getRoleColor = (role: UserRole) => {
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

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-primary/20 text-primary"
      : "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            User Account Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage user accounts with role-based access control
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User Account" : "Create New User Account"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {!editingUser && (
                <div>
                  <Label htmlFor="employee">Select Employee *</Label>
                  <Select
                    value={formData.employeeId}
                    onValueChange={handleEmployeeSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} ({employee.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="Enter first name"
                    disabled={!editingUser && !!formData.employeeId}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Enter last name"
                    disabled={!editingUser && !!formData.employeeId}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter email address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        role: value as UserRole,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer/Requester</SelectItem>
                      <SelectItem value="project_manager">
                        Project Manager
                      </SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    placeholder="Enter department"
                  />
                </div>
              </div>

              {!editingUser && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Enter password (min 6 characters)"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
                <Label htmlFor="isActive">Account is active</Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : editingUser ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="project_manager">
                    Project Manager
                  </SelectItem>
                  <SelectItem value="customer">Customer/Requester</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.map((userAccount) => (
          <Card
            key={userAccount.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">
                        {userAccount.firstName} {userAccount.lastName}
                      </h3>
                    </div>
                    <Badge className={getRoleColor(userAccount.role)}>
                      {userAccount.role.replace("_", " ")}
                    </Badge>
                    <Badge className={getStatusColor(userAccount.isActive)}>
                      {userAccount.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{userAccount.email}</span>
                    </div>
                    {userAccount.department && (
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>{userAccount.department}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Last login:{" "}
                        {userAccount.lastLogin
                          ? userAccount.lastLogin.toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>
                      Created: {userAccount.createdAt.toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>By: {userAccount.createdBy}</span>
                    <span>•</span>
                    <span>Permissions: {userAccount.permissions.length}</span>
                  </div>
                </div>

                <div className="flex space-x-2 flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(userAccount.id)}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    {userAccount.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openResetPasswordDialog(userAccount)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(userAccount)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(userAccount.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                ? "No users match your search criteria."
                : "Get started by creating your first user account."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Password Reset Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          {resetPasswordUser && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Resetting password for: <strong>{resetPasswordUser.firstName} {resetPasswordUser.lastName}</strong>
                <br />
                Email: <strong>{resetPasswordUser.email}</strong>
              </div>

              <div>
                <Label htmlFor="newPassword">New Password *</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmNewPassword">Confirm New Password *</Label>
                <Input
                  id="confirmNewPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setResetPasswordDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleResetPassword} disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {userAccounts.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {userAccounts.filter((u) => u.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {userAccounts.filter((u) => u.role === "admin").length}
            </div>
            <div className="text-sm text-muted-foreground">Administrators</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {
                userAccounts.filter(
                  (u) =>
                    u.lastLogin &&
                    new Date().getTime() - u.lastLogin.getTime() <
                      7 * 24 * 60 * 60 * 1000,
                ).length
              }
            </div>
            <div className="text-sm text-muted-foreground">
              Active This Week
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
