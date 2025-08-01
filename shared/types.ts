export type RequestStatus =
  | "new"
  | "under_review"
  | "request_for_discussion"
  | "approved"
  | "rejected"
  | "on_hold";
export type RequestPriority = "low" | "medium" | "high";
export type CustomerImpact = "internal" | "external" | "both";

export interface ContactPersonDetails {
  name: string;
  email: string;
  phone: string;
  position: string;
}

export interface ImpactAnalysis {
  isRegulatoryRequirement: boolean;
  regulatoryExplanation?: string;
  financialImpactUSD: number;
  customerImpact: CustomerImpact;
  operationalUrgency: boolean;
  existingSystems: string;
}

export interface StatusChangeLog {
  id: string;
  fromStatus: RequestStatus;
  toStatus: RequestStatus;
  changedBy: string;
  changedAt: Date;
  remark?: string;
}

export interface RequestDocument {
  id: string;
  name: string;
  type: "as_is" | "sop" | "to_be" | "other";
  size: number;
  uploadedAt: Date;
  url: string;
}

export interface SoftwareRequest {
  id: string;
  departmentName: string;
  costCenter: string;
  contactPerson: ContactPersonDetails;
  requestedSolutionName: string;
  purposeAndJustification: string;
  processDescription: string;
  impactAnalysis: ImpactAnalysis;
  integrationNeeds: string;
  priority: RequestPriority;
  calculatedPriority: RequestPriority; // Auto-calculated based on evaluation criteria
  documents: RequestDocument[];

  // System fields
  status: RequestStatus;
  submittedBy: string;
  submittedAt: Date;
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: Date;
  lastUpdated: Date;
  trackingNumber: string;
  statusHistory: StatusChangeLog[];
  rejectionRemark?: string;
  onHoldRemark?: string;
}

export interface CreateRequestDTO {
  departmentName: string;
  costCenter: string;
  contactPerson: ContactPersonDetails;
  requestedSolutionName: string;
  purposeAndJustification: string;
  processDescription: string;
  impactAnalysis: ImpactAnalysis;
  integrationNeeds: string;
  priority: RequestPriority;
}
