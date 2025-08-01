import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusManagement } from "@/components/StatusManagement";
import {
  ArrowLeft,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertTriangle,
  FileText,
  Download,
  MessageSquare,
  Clock,
  TrendingUp,
} from "lucide-react";
import { SoftwareRequest, RequestStatus } from "@shared/types";
import {
  calculatePriority,
  getPriorityExplanation,
} from "@/lib/priority-calculator";

// Mock data - replace with actual API call
const mockRequest: SoftwareRequest = {
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
    "Improve customer relationship management and sales tracking by integrating our existing CRM systems with new automation tools. This will help reduce manual data entry, improve data accuracy, and provide better insights into customer behavior.",
  processDescription:
    "The current process involves manual data entry across multiple systems including Salesforce and HubSpot. The proposed solution would create automated workflows between these systems, reducing the time spent on data management by approximately 60%.",
  impactAnalysis: {
    isRegulatoryRequirement: false,
    financialImpactUSD: 50000,
    customerImpact: "both",
    operationalUrgency: true,
    existingSystems: "Salesforce CRM, HubSpot Marketing, Microsoft Office 365",
  },
  integrationNeeds:
    "API integration with Salesforce and HubSpot, SSO integration with Office 365, data synchronization capabilities",
  priority: "high",
  calculatedPriority: "low", // Will be calculated
  documents: [
    {
      id: "doc1",
      name: "Current_CRM_Process_Map.pdf",
      type: "as_is",
      size: 2485760,
      uploadedAt: new Date("2024-01-15"),
      url: "/documents/doc1.pdf",
    },
    {
      id: "doc2",
      name: "Proposed_Integration_Architecture.docx",
      type: "to_be",
      size: 1849344,
      uploadedAt: new Date("2024-01-15"),
      url: "/documents/doc2.docx",
    },
  ],
  status: "under_review",
  submittedBy: "customer@company.com",
  submittedAt: new Date("2024-01-15"),
  assignedTo: "pm@company.com",
  assignedBy: "admin@company.com",
  assignedAt: new Date("2024-01-16"),
  lastUpdated: new Date("2024-01-16"),
  statusHistory: [
    {
      id: "1",
      fromStatus: "new",
      toStatus: "under_review",
      changedBy: "admin@company.com",
      changedAt: new Date("2024-01-16"),
      remark: "Assigned to Mike PM for technical review",
    },
  ],
};

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState(() => {
    const calculatedPriority = calculatePriority(mockRequest.impactAnalysis);
    return { ...mockRequest, calculatedPriority };
  });

  const handleStatusChange = (
    newStatus: RequestStatus,
    remark?: string,
    assignedTo?: string,
  ) => {
    // In a real app, this would make an API call
    setRequest((prev) => ({
      ...prev,
      status: newStatus,
      lastUpdated: new Date(),
      rejectionRemark: newStatus === "rejected" ? remark : undefined,
      onHoldRemark: newStatus === "on_hold" ? remark : undefined,
      assignedTo: assignedTo || prev.assignedTo,
      assignedAt:
        assignedTo && assignedTo !== prev.assignedTo
          ? new Date()
          : prev.assignedAt,
      statusHistory: [
        ...prev.statusHistory,
        {
          id: Date.now().toString(),
          fromStatus: prev.status,
          toStatus: newStatus,
          changedBy: user?.email || "",
          changedAt: new Date(),
          remark,
        },
      ],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-primary/10 text-primary";
      case "under_review":
        return "bg-accent/20 text-accent-foreground";
      case "approved":
        return "bg-primary/20 text-primary";
      case "in_progress":
        return "bg-accent/30 text-accent-foreground";
      case "completed":
        return "bg-muted text-muted-foreground";
      case "rejected":
        return "bg-destructive/10 text-destructive";
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

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "as_is":
        return "AS-IS Process";
      case "to_be":
        return "TO-BE Process";
      case "sop":
        return "SOP Document";
      default:
        return "Other";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-3xl font-bold">
              {request.requestedSolutionName}
            </h1>
          </div>
          <div className="flex items-center space-x-4 mb-2">
            <StatusManagement
              request={request}
              onStatusChange={handleStatusChange}
            />
            <Badge
              variant="outline"
              className={getPriorityColor(request.priority)}
            >
              User: {request.priority} priority
            </Badge>
            <Badge
              variant="outline"
              className={getPriorityColor(request.calculatedPriority)}
            >
              System: {request.calculatedPriority} priority
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Tracking Number: {request.trackingNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Purpose and Justification</h4>
                <p className="text-muted-foreground">
                  {request.purposeAndJustification}
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Process Description</h4>
                <p className="text-muted-foreground">
                  {request.processDescription}
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Integration Needs</h4>
                <p className="text-muted-foreground">
                  {request.integrationNeeds}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Impact Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Regulatory Requirement</p>
                    <p className="text-sm text-muted-foreground">
                      {request.impactAnalysis.isRegulatoryRequirement
                        ? "Yes"
                        : "No"}
                    </p>
                    {request.impactAnalysis.regulatoryExplanation && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.impactAnalysis.regulatoryExplanation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Financial Impact</p>
                    <p className="text-sm text-muted-foreground">
                      $
                      {request.impactAnalysis.financialImpactUSD.toLocaleString()}{" "}
                      USD
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Customer Impact</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {request.impactAnalysis.customerImpact}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Operational Urgency</p>
                    <p className="text-sm text-muted-foreground">
                      {request.impactAnalysis.operationalUrgency ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              {request.impactAnalysis.existingSystems && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Existing Systems</h4>
                    <p className="text-muted-foreground">
                      {request.impactAnalysis.existingSystems}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Priority Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Priority Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">User Perceived Priority:</span>
                <Badge
                  variant="outline"
                  className={getPriorityColor(request.priority)}
                >
                  {request.priority}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">System Calculated Priority:</span>
                <Badge
                  variant="outline"
                  className={getPriorityColor(request.calculatedPriority)}
                >
                  {request.calculatedPriority}
                </Badge>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Calculation Explanation</h4>
                <p className="text-sm text-muted-foreground">
                  {getPriorityExplanation(request.impactAnalysis)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          {request.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attached Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {request.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {getDocumentTypeLabel(doc.type)}
                            </Badge>
                            <span>•</span>
                            <span>{formatFileSize(doc.size)}</span>
                            <span>•</span>
                            <span>
                              Uploaded {doc.uploadedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">
                      {request.departmentName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Cost Center</p>
                    <p className="text-sm text-muted-foreground">
                      {request.costCenter}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {request.submittedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {request.lastUpdated.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {request.assignedTo && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Assigned To</p>
                      <p className="text-sm text-muted-foreground">
                        {request.assignedTo}
                      </p>
                      {request.assignedBy && (
                        <p className="text-xs text-muted-foreground">
                          By: {request.assignedBy}
                        </p>
                      )}
                      {request.assignedAt && (
                        <p className="text-xs text-muted-foreground">
                          On: {request.assignedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Person</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{request.contactPerson.name}</p>
                <p className="text-sm text-muted-foreground">
                  {request.contactPerson.position}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${request.contactPerson.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {request.contactPerson.email}
                  </a>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${request.contactPerson.phone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {request.contactPerson.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
