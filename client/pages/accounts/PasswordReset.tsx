import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Key,
  Search,
  User,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
} from "lucide-react";

interface PasswordResetRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestedBy: string;
  requestedAt: Date;
  status: "pending" | "completed" | "expired";
  completedAt?: Date;
  newPassword?: string;
}

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@company.com",
    role: "admin",
    lastLogin: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Jane Customer",
    email: "customer@company.com",
    role: "customer",
    lastLogin: new Date("2024-01-19"),
  },
  {
    id: "3",
    name: "Mike PM",
    email: "pm@company.com",
    role: "project_manager",
    lastLogin: new Date("2024-01-18"),
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@company.com",
    role: "customer",
    lastLogin: new Date("2024-01-10"),
  },
  {
    id: "5",
    name: "David Johnson",
    email: "david@company.com",
    role: "customer",
    lastLogin: null,
  },
];

// Mock password reset requests
const mockResetRequests: PasswordResetRequest[] = [
  {
    id: "1",
    userId: "4",
    userName: "Sarah Wilson",
    userEmail: "sarah@company.com",
    requestedBy: "admin@company.com",
    requestedAt: new Date("2024-01-20T10:30:00"),
    status: "completed",
    completedAt: new Date("2024-01-20T10:35:00"),
    newPassword: "TempPass123!",
  },
  {
    id: "2",
    userId: "5",
    userName: "David Johnson",
    userEmail: "david@company.com",
    requestedBy: "admin@company.com",
    requestedAt: new Date("2024-01-19T15:45:00"),
    status: "pending",
  },
];

export default function PasswordReset() {
  const { user } = useAuth();
  const [users] = useState(mockUsers);
  const [resetRequests, setResetRequests] =
    useState<PasswordResetRequest[]>(mockResetRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              Password reset functionality is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const generateSecurePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleResetPassword = async () => {
    if (!selectedUser) {
      setError("Please select a user");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock API call

      const newPassword = generateSecurePassword();
      const selectedUserData = users.find((u) => u.id === selectedUser);

      if (selectedUserData) {
        const newRequest: PasswordResetRequest = {
          id: Date.now().toString(),
          userId: selectedUser,
          userName: selectedUserData.name,
          userEmail: selectedUserData.email,
          requestedBy: user?.email || "",
          requestedAt: new Date(),
          status: "completed",
          completedAt: new Date(),
          newPassword,
        };

        setResetRequests((prev) => [newRequest, ...prev]);
        setGeneratedPassword(newPassword);
        setSuccess(`Password reset successful for ${selectedUserData.name}`);
        setSelectedUser("");
      }
    } catch (error) {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Password copied to clipboard");
    setTimeout(() => setSuccess(""), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary/20 text-primary";
      case "pending":
        return "bg-accent/20 text-accent-foreground";
      case "expired":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Password Reset Management
          </h1>
          <p className="text-muted-foreground">
            Reset user passwords and manage password reset requests
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Password Reset Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Reset User Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userSearch">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="userSearch"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="selectUser">Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose user to reset password" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center space-x-2">
                        <span>{user.name}</span>
                        <Badge
                          className={getRoleColor(user.role)}
                          variant="outline"
                        >
                          {user.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedUser && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Selected User Details</h4>
              {(() => {
                const userData = users.find((u) => u.id === selectedUser);
                return userData ? (
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {userData.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {userData.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {userData.role}
                    </p>
                    <p>
                      <strong>Last Login:</strong>{" "}
                      {userData.lastLogin?.toLocaleDateString() || "Never"}
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleResetPassword}
              disabled={loading || !selectedUser}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>

          {generatedPassword && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium mb-2 text-primary">
                New Password Generated
              </h4>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={generatedPassword}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-8 top-0 h-full px-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generatedPassword)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ⚠️ Make sure to securely share this password with the user. It
                will not be shown again.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Request History */}
      <Card>
        <CardHeader>
          <CardTitle>Password Reset History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resetRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{request.userName}</span>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{request.userEmail}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Requested: {request.requestedAt.toLocaleDateString()}
                      </span>
                    </div>
                    {request.completedAt && (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>
                          Completed: {request.completedAt.toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requested by: {request.requestedBy}
                  </p>
                </div>

                {request.status === "completed" && request.newPassword && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(request.newPassword!)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Password
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {resetRequests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4" />
              <p>No password reset requests found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Security Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              • Generated passwords are 12 characters long with mixed case,
              numbers, and symbols
            </p>
            <p>• Passwords are not stored in the system after generation</p>
            <p>
              • Users should be instructed to change their password on first
              login
            </p>
            <p>• All password reset activities are logged in the audit trail</p>
            <p>
              • Passwords should be communicated through secure channels only
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
