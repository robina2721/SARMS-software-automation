import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RequestStatus, SoftwareRequest } from "@shared/types";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  User,
  Edit,
} from "lucide-react";

interface StatusManagementProps {
  request: SoftwareRequest;
  onStatusChange?: (
    newStatus: RequestStatus,
    remark?: string,
    assignedTo?: string,
  ) => void;
}

export function StatusManagement({
  request,
  onStatusChange,
}: StatusManagementProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(
    request.status,
  );
  const [remark, setRemark] = useState("");
  const [assignedTo, setAssignedTo] = useState(request.assignedTo || "");
  const [loading, setLoading] = useState(false);

  const canManageStatus =
    user?.role === "admin" || user?.role === "project_manager";
  const canAssign = user?.role === "admin";

  // Available actions based on current status
  const getAvailableActions = (
    currentStatus: RequestStatus,
  ): RequestStatus[] => {
    switch (currentStatus) {
      case "new":
        return canAssign ? ["under_review"] : [];
      case "under_review":
        return ["approved", "rejected", "request_for_discussion", "on_hold"];
      case "request_for_discussion":
        return ["approved", "rejected", "on_hold"];
      case "on_hold":
        return ["approved", "rejected", "request_for_discussion"];
      case "approved":
      case "rejected":
        return []; // Final states
      default:
        return [];
    }
  };

  const getStatusColor = (status: RequestStatus) => {
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

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "request_for_discussion":
        return <MessageSquare className="h-4 w-4" />;
      case "on_hold":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <User className="h-4 w-4" />;
      default:
        return <Edit className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: RequestStatus) => {
    switch (status) {
      case "new":
        return "New";
      case "under_review":
        return "Under Review";
      case "request_for_discussion":
        return "Request for Discussion";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "on_hold":
        return "On Hold";
      default:
        return status;
    }
  };

  const requiresRemark = (status: RequestStatus) => {
    return status === "rejected" || status === "on_hold";
  };

  const requiresAssignment = (status: RequestStatus) => {
    return status === "under_review" && !request.assignedTo;
  };

  const handleStatusChange = async () => {
    if (requiresRemark(selectedStatus) && !remark.trim()) {
      return;
    }

    if (requiresAssignment(selectedStatus) && !assignedTo.trim()) {
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock API call
      onStatusChange?.(selectedStatus, remark, assignedTo);
      setIsOpen(false);
      setRemark("");
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const availableActions = getAvailableActions(request.status);

  if (!canManageStatus || availableActions.length === 0) {
    return (
      <div className="flex items-center space-x-2">
        <Badge className={getStatusColor(request.status)}>
          {getStatusIcon(request.status)}
          <span className="ml-1">{getStatusLabel(request.status)}</span>
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Badge className={getStatusColor(request.status)}>
          {getStatusIcon(request.status)}
          <span className="ml-1">{getStatusLabel(request.status)}</span>
        </Badge>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Change Status
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Request Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Status</Label>
                <div className="mt-1">
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1">
                      {getStatusLabel(request.status)}
                    </span>
                  </Badge>
                </div>
              </div>

              <div>
                <Label htmlFor="new-status">New Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as RequestStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableActions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {getStatusLabel(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {requiresAssignment(selectedStatus) && (
                <div>
                  <Label htmlFor="assign-to">Assign To (Project Manager)</Label>
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pm@company.com">
                        Mike PM (pm@company.com)
                      </SelectItem>
                      <SelectItem value="pm2@company.com">
                        Sarah PM (pm2@company.com)
                      </SelectItem>
                      <SelectItem value="pm3@company.com">
                        David PM (pm3@company.com)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {requiresRemark(selectedStatus) && (
                <div>
                  <Label htmlFor="remark">
                    {selectedStatus === "rejected"
                      ? "Rejection Reason *"
                      : "Hold Reason *"}
                  </Label>
                  <Textarea
                    id="remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder={`Enter ${selectedStatus === "rejected" ? "rejection" : "hold"} reason...`}
                    rows={3}
                  />
                </div>
              )}

              {requiresRemark(selectedStatus) && !remark.trim() && (
                <Alert variant="destructive">
                  <AlertDescription>
                    A remark is required for{" "}
                    {selectedStatus === "rejected" ? "rejection" : "hold"}{" "}
                    status.
                  </AlertDescription>
                </Alert>
              )}

              {requiresAssignment(selectedStatus) && !assignedTo.trim() && (
                <Alert variant="destructive">
                  <AlertDescription>
                    A project manager must be assigned for "Under Review"
                    status.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusChange}
                  disabled={
                    loading ||
                    (requiresRemark(selectedStatus) && !remark.trim()) ||
                    (requiresAssignment(selectedStatus) && !assignedTo.trim())
                  }
                >
                  {loading ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status History */}
      {request.statusHistory && request.statusHistory.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status History</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {request.statusHistory.map((log, index) => (
              <div
                key={index}
                className="text-xs p-2 bg-muted rounded border-l-2 border-primary/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {getStatusLabel(log.fromStatus)} →{" "}
                    {getStatusLabel(log.toStatus)}
                  </span>
                  <span className="text-muted-foreground">
                    {log.changedAt.toLocaleDateString()}
                  </span>
                </div>
                <div className="text-muted-foreground">By: {log.changedBy}</div>
                {log.remark && (
                  <div className="mt-1 text-muted-foreground">
                    "{log.remark}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Status Remarks */}
      {request.rejectionRemark && request.status === "rejected" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Rejection Reason:</strong> {request.rejectionRemark}
          </AlertDescription>
        </Alert>
      )}

      {request.onHoldRemark && request.status === "on_hold" && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>On Hold Reason:</strong> {request.onHoldRemark}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
