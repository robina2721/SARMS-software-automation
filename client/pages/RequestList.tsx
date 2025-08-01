import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Eye, Calendar, User, Building, UserPlus, Settings, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { SoftwareRequest, RequestStatus } from "@shared/types";

// Mock project managers
const mockProjectManagers = [
  { email: "pm@company.com", name: "Mike PM" },
  { email: "pm2@company.com", name: "Sarah PM" },
  { email: "pm3@company.com", name: "David PM" },
  { email: "pm4@company.com", name: "Lisa PM" }
];

// Assign PM Button Component
function AssignPMButton({ request, onAssign }: {
  request: SoftwareRequest,
  onAssign: (requestId: string, pmEmail: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPM, setSelectedPM] = useState("");

  const handleAssign = () => {
    if (selectedPM) {
      onAssign(request.id, selectedPM);
      setIsOpen(false);
      setSelectedPM("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="Assign Project Manager">
          <UserPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Project Manager</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Request: {request.requestedSolutionName}</Label>
          </div>
          <div>
            <Label htmlFor="pm-select">Select Project Manager</Label>
            <Select value={selectedPM} onValueChange={setSelectedPM}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a project manager" />
              </SelectTrigger>
              <SelectContent>
                {mockProjectManagers.map((pm) => (
                  <SelectItem key={pm.email} value={pm.email}>
                    {pm.name} ({pm.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedPM}>
              Assign
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Status Change Button Component
function StatusChangeButton({ request, onStatusChange }: {
  request: SoftwareRequest,
  onStatusChange: (requestId: string, newStatus: RequestStatus, remark?: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(request.status);
  const [remark, setRemark] = useState("");

  const statusOptions: RequestStatus[] = ["new", "under_review", "approved", "rejected", "on_hold"];

  const handleStatusChange = () => {
    onStatusChange(request.id, selectedStatus, remark);
    setIsOpen(false);
    setRemark("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="Change Status">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Request Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Request: {request.requestedSolutionName}</Label>
          </div>
          <div>
            <Label htmlFor="status-select">New Status</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as RequestStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(selectedStatus === "rejected" || selectedStatus === "on_hold") && (
            <div>
              <Label htmlFor="remark">Remark (Required)</Label>
              <Textarea
                id="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={`Enter ${selectedStatus === "rejected" ? "rejection" : "hold"} reason...`}
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={(selectedStatus === "rejected" || selectedStatus === "on_hold") && !remark.trim()}
            >
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Mock data - replace with actual API calls
const mockRequests: SoftwareRequest[] = [
  {
    id: "1",
    trackingNumber: "REQ-2024-001",
    departmentName: "Sales",
    costCenter: "CC-SALES-001",
    contactPerson: {
      name: "John Smith",
      email: "john.smith@company.com",
      phone: "+1-555-0123",
      position: "Sales Manager",
    },
    requestedSolutionName: "CRM Integration Module",
    purposeAndJustification:
      "Improve customer relationship management and sales tracking",
    processDescription: "Integrate existing CRM with new automation tools",
    impactAnalysis: {
      isRegulatoryRequirement: false,
      financialImpactUSD: 50000,
      customerImpact: "both",
      operationalUrgency: true,
      existingSystems: "Salesforce CRM, HubSpot",
    },
    integrationNeeds: "API integration with Salesforce and HubSpot",
    priority: "high",
    documents: [],
    status: "under_review",
    submittedBy: "customer@company.com",
    submittedAt: new Date("2024-01-15"),
    lastUpdated: new Date("2024-01-16"),
  },
  {
    id: "2",
    trackingNumber: "REQ-2024-002",
    departmentName: "Finance",
    costCenter: "CC-FIN-001",
    contactPerson: {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1-555-0124",
      position: "Finance Director",
    },
    requestedSolutionName: "Automated Reporting System",
    purposeAndJustification:
      "Reduce manual reporting effort and improve accuracy",
    processDescription: "Automate monthly and quarterly financial reports",
    impactAnalysis: {
      isRegulatoryRequirement: true,
      regulatoryExplanation: "Required for SOX compliance reporting",
      financialImpactUSD: 75000,
      customerImpact: "internal",
      operationalUrgency: false,
      existingSystems: "SAP, Oracle Financials",
    },
    integrationNeeds: "Integration with SAP and Oracle systems",
    priority: "medium",
    documents: [],
    status: "approved",
    submittedBy: "customer@company.com",
    submittedAt: new Date("2024-01-14"),
    assignedTo: "pm@company.com",
    lastUpdated: new Date("2024-01-17"),
  },
];

interface RequestListProps {
  viewMode: "my" | "all";
}

export default function RequestList({ viewMode }: RequestListProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SoftwareRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [assignedToFilter, setAssignedToFilter] = useState<string>("all");

  // Handler for assigning project manager
  const handleAssignPM = async (requestId: string, pmEmail: string) => {
    try {
      setRequests(prev => prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              assignedTo: pmEmail,
              assignedBy: user?.email || "",
              assignedAt: new Date(),
              status: "under_review",
              lastUpdated: new Date()
            }
          : req
      ));
    } catch (error) {
      console.error("Error assigning PM:", error);
    }
  };

  // Handler for changing request status
  const handleStatusChange = async (requestId: string, newStatus: RequestStatus, remark?: string) => {
    try {
      setRequests(prev => prev.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: newStatus,
              rejectionRemark: newStatus === "rejected" ? remark : req.rejectionRemark,
              onHoldRemark: newStatus === "on_hold" ? remark : req.onHoldRemark,
              lastUpdated: new Date()
            }
          : req
      ));
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const filteredRequests = requests.filter((request) => {
    // Role-based filtering
    if (viewMode === "my" && request.submittedBy !== user?.email) {
      return false;
    }

    // Search filter
    if (
      searchTerm &&
      !(
        request.requestedSolutionName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.trackingNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && request.status !== statusFilter) {
      return false;
    }

    // Priority filter
    if (priorityFilter !== "all" && request.priority !== priorityFilter) {
      return false;
    }

    // Department filter (admin only)
    if (
      viewMode === "all" &&
      departmentFilter !== "all" &&
      request.departmentName !== departmentFilter
    ) {
      return false;
    }

    // Assigned PM filter (admin only)
    if (viewMode === "all" && assignedToFilter !== "all") {
      if (assignedToFilter === "unassigned" && request.assignedTo) {
        return false;
      } else if (assignedToFilter !== "unassigned" && request.assignedTo !== assignedToFilter) {
        return false;
      }
    }

    return true;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {viewMode === "my" ? "My Requests" : "All Requests"}
          </h1>
          <p className="text-muted-foreground">
            {viewMode === "my"
              ? "Track the status of your submitted requests"
              : "Manage and review all system requests"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by solution name, tracking number, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="request_for_discussion">
                    Request for Discussion
                  </SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Admin-only filters */}
              {viewMode === "all" && (
                <>
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={assignedToFilter}
                    onValueChange={setAssignedToFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Assigned PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All PMs</SelectItem>
                      <SelectItem value="pm@company.com">Mike PM</SelectItem>
                      <SelectItem value="pm2@company.com">Sarah PM</SelectItem>
                      <SelectItem value="pm3@company.com">David PM</SelectItem>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request List Table */}
      <Card>
        <CardContent className="p-0">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                No requests found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">No.</th>
                    <th className="text-left p-4 font-medium">Department</th>
                    <th className="text-left p-4 font-medium">Cost Center</th>
                    <th className="text-left p-4 font-medium">Requested By</th>
                    <th className="text-left p-4 font-medium">Solution Name</th>
                    <th className="text-left p-4 font-medium">User Priority</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Assigned To</th>
                    <th className="text-left p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => (
                    <tr
                      key={request.id}
                      className="border-b hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4 text-sm text-muted-foreground">
                        {request.trackingNumber}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <Building className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {request.departmentName}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{request.costCenter}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {request.contactPerson.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          className="font-medium text-sm max-w-xs truncate"
                          title={request.requestedSolutionName}
                        >
                          {request.requestedSolutionName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Submitted: {request.submittedAt.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={getPriorityColor(request.priority)}
                        >
                          {request.priority}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {request.assignedTo ? (
                          <div className="text-sm">
                            <div>{request.assignedTo}</div>
                            {request.assignedAt && (
                              <div className="text-xs text-muted-foreground">
                                {request.assignedAt.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {user?.role === "admin" ? (
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/request/${request.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AssignPMButton
                              request={request}
                              onAssign={(requestId, pmEmail) => handleAssignPM(requestId, pmEmail)}
                            />
                            <StatusChangeButton
                              request={request}
                              onStatusChange={(requestId, newStatus, remark) => handleStatusChange(requestId, newStatus, remark)}
                            />
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/request/${request.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Detail
                            </Link>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
