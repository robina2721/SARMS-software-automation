import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import {
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  TrendingUp,
  Users,
  BarChart3,
  Shield,
  Database,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const stats = {
    totalRequests: user?.role === "customer" ? 12 : 156,
    pendingRequests: user?.role === "customer" ? 3 : 23,
    approvedRequests: user?.role === "customer" ? 8 : 89,
    inProgress: user?.role === "customer" ? 1 : 44,
  };

  const recentRequests = [
    {
      id: "REQ-2024-001",
      title: "CRM Integration Module",
      status: "under_review",
      priority: "high",
      submittedDate: "2024-01-15",
      department: "Sales",
    },
    {
      id: "REQ-2024-002",
      title: "Automated Reporting System",
      status: "approved",
      priority: "medium",
      submittedDate: "2024-01-14",
      department: "Finance",
    },
    {
      id: "REQ-2024-003",
      title: "Employee Self-Service Portal",
      status: "in_progress",
      priority: "high",
      submittedDate: "2024-01-13",
      department: "HR",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-accent/20 text-accent-foreground";
      case "request_for_discussion":
        return "bg-purple-100 text-purple-800";
      case "approved":
        return "bg-primary/20 text-primary";
      case "rejected":
        return "bg-destructive/10 text-destructive";
      case "on_hold":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive/20 text-destructive";
      case "high":
        return "bg-accent/30 text-accent-foreground";
      case "medium":
        return "bg-accent/15 text-accent-foreground";
      case "low":
        return "bg-primary/15 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            {user?.role === "customer" &&
              "Manage your software and automation requests"}
            {user?.role === "admin" &&
              "Overview of all system requests and activities"}
            {user?.role === "project_manager" &&
              "Track and manage assigned project requests"}
          </p>
        </div>
        {user?.role === "customer" && (
          <Button asChild>
            <Link to="/request/new">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        )}
      </div>

      {/* Role-specific Metrics */}
      <DashboardMetrics />

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link
                to={user?.role === "customer" ? "/requests" : "/requests/all"}
              >
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{request.title}</span>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(request.priority)}
                    >
                      {request.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{request.id}</span>
                    <span>•</span>
                    <span>{request.department}</span>
                    <span>•</span>
                    <span>{request.submittedDate}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(request.status)}>
                  {request.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions for different roles */}
      {user?.role === "admin" && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage user roles and permissions
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>System Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View detailed system reports and metrics
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track request processing efficiency
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
