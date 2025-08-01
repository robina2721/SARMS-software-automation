import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  FileText,
  User,
  Clock,
  Edit,
  Download,
  Filter,
  Calendar,
  Shield,
} from "lucide-react";

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

// Mock audit data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: new Date("2024-01-20T10:30:00"),
    userId: "admin@company.com",
    userName: "John Admin",
    userRole: "admin",
    action: "STATUS_CHANGE",
    resourceType: "request",
    resourceId: "REQ-2024-001",
    details: "Changed request status from 'new' to 'under_review'",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    changes: [
      { field: "status", oldValue: "new", newValue: "under_review" },
      { field: "assignedTo", oldValue: "", newValue: "pm@company.com" },
    ],
  },
  {
    id: "2",
    timestamp: new Date("2024-01-20T09:15:00"),
    userId: "customer@company.com",
    userName: "Jane Customer",
    userRole: "customer",
    action: "CREATE_REQUEST",
    resourceType: "request",
    resourceId: "REQ-2024-002",
    details: "Created new software request for CRM Integration",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },
  {
    id: "3",
    timestamp: new Date("2024-01-20T08:45:00"),
    userId: "pm@company.com",
    userName: "Mike PM",
    userRole: "project_manager",
    action: "DOCUMENT_UPLOAD",
    resourceType: "request",
    resourceId: "REQ-2024-001",
    details: "Uploaded technical assessment document",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },
  {
    id: "4",
    timestamp: new Date("2024-01-19T16:20:00"),
    userId: "admin@company.com",
    userName: "John Admin",
    userRole: "admin",
    action: "USER_LOGIN",
    resourceType: "user",
    resourceId: "admin@company.com",
    details: "Successful login to SARMS system",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },
  {
    id: "5",
    timestamp: new Date("2024-01-19T15:30:00"),
    userId: "pm@company.com",
    userName: "Mike PM",
    userRole: "project_manager",
    action: "STATUS_CHANGE",
    resourceType: "request",
    resourceId: "REQ-2024-003",
    details: "Approved request with recommendations",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    changes: [
      { field: "status", oldValue: "under_review", newValue: "approved" },
      {
        field: "approvalNotes",
        oldValue: "",
        newValue: "Approved with budget allocation",
      },
    ],
  },
];

export function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  const filteredLogs = mockAuditLogs.filter((log) => {
    if (
      searchTerm &&
      !(
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    if (actionFilter !== "all" && log.action !== actionFilter) {
      return false;
    }

    if (userFilter !== "all" && log.userRole !== userFilter) {
      return false;
    }

    return true;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE_REQUEST":
        return "bg-primary/20 text-primary";
      case "STATUS_CHANGE":
        return "bg-accent/20 text-accent-foreground";
      case "DOCUMENT_UPLOAD":
        return "bg-blue-100 text-blue-800";
      case "USER_LOGIN":
        return "bg-green-100 text-green-800";
      case "APPROVAL":
        return "bg-green-100 text-green-800";
      case "REJECTION":
        return "bg-destructive/10 text-destructive";
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>System Audit Trail</span>
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Input
                placeholder="Search logs by user, action, or request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="CREATE_REQUEST">Create Request</SelectItem>
                  <SelectItem value="STATUS_CHANGE">Status Change</SelectItem>
                  <SelectItem value="DOCUMENT_UPLOAD">
                    Document Upload
                  </SelectItem>
                  <SelectItem value="USER_LOGIN">User Login</SelectItem>
                </SelectContent>
              </Select>

              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="User Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="project_manager">PM</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audit Log Entries */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge className={getActionColor(log.action)}>
                        {log.action.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getRoleColor(log.userRole)}
                      >
                        {log.userRole.replace("_", " ")}
                      </Badge>
                      <span className="text-sm font-medium">
                        {log.userName}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {log.details}
                    </p>

                    {log.changes && log.changes.length > 0 && (
                      <div className="bg-muted/50 p-2 rounded text-xs">
                        <strong>Changes:</strong>
                        {log.changes.map((change, index) => (
                          <div key={index} className="mt-1">
                            <span className="font-medium">{change.field}:</span>{" "}
                            <span className="text-destructive">
                              "{change.oldValue}"
                            </span>{" "}
                            →{" "}
                            <span className="text-primary">
                              "{change.newValue}"
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>{log.resourceId}</span>
                      </div>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No audit logs found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Security Events Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="text-xs text-muted-foreground">
              Login attempts, changes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Failed Logins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <div className="text-xs text-muted-foreground">Last 24 hours</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90</div>
            <div className="text-xs text-muted-foreground">
              Days of audit logs
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
