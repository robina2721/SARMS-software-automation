/**
 * Data Transfer Objects (DTOs) for C# Backend Integration
 * These DTOs match the expected request/response formats from the C# Web API
 */

// Authentication DTOs
export interface LoginRequestDto {
  Email: string;
  Password: string;
}

export interface LoginResponseDto {
  User: {
    Id: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Role: string;
    Department?: string;
  };
  Token: string;
  RefreshToken: string;
  ExpiresAt: string;
}

export interface ForgotPasswordRequestDto {
  Email: string;
}

export interface ResetPasswordRequestDto {
  Email: string;
  Token: string;
  NewPassword: string;
}

// User Management DTOs
export interface CreateUserRequestDto {
  FirstName: string;
  LastName: string;
  Email: string;
  Role: string; // "Admin", "ProjectManager", "Customer"
  Department?: string;
  Password: string;
  IsActive: boolean;
}

export interface UpdateUserRequestDto {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Role?: string;
  Department?: string;
  IsActive?: boolean;
}

export interface UserResponseDto {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Role: string;
  Department?: string;
  IsActive: boolean;
  LastLogin?: string;
  CreatedAt: string;
  CreatedBy: string;
  Permissions: string[];
}

export interface ResetPasswordRequestDto {
  NewPassword: string;
}

// Employee Management DTOs
export interface CreateEmployeeRequestDto {
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  CostCenter: string;
  JobPosition: string;
  SystemRole?: string;
}

export interface EmployeeResponseDto {
  Id: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  CostCenter: string;
  JobPosition: string;
  SystemRole?: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Software Request DTOs
export interface CreateSoftwareRequestDto {
  DepartmentName: string;
  CostCenter: string;
  ContactPerson: {
    Name: string;
    Email: string;
    Phone: string;
    Position: string;
  };
  RequestedSolutionName: string;
  PurposeAndJustification: string;
  ProcessDescription: string;
  ImpactAnalysis: {
    IsRegulatoryRequirement: boolean;
    RegulatoryExplanation?: string;
    FinancialImpactUSD: number;
    CustomerImpact: string; // "Internal", "External", "Both"
    OperationalUrgency: boolean;
    ExistingSystems: string;
  };
  IntegrationNeeds: string;
  Priority: string; // "Low", "Medium", "High"
}

export interface SoftwareRequestResponseDto {
  Id: string;
  TrackingNumber: string;
  DepartmentName: string;
  CostCenter: string;
  ContactPerson: {
    Name: string;
    Email: string;
    Phone: string;
    Position: string;
  };
  RequestedSolutionName: string;
  PurposeAndJustification: string;
  ProcessDescription: string;
  ImpactAnalysis: {
    IsRegulatoryRequirement: boolean;
    RegulatoryExplanation?: string;
    FinancialImpactUSD: number;
    CustomerImpact: string;
    OperationalUrgency: boolean;
    ExistingSystems: string;
  };
  IntegrationNeeds: string;
  Priority: string;
  CalculatedPriority: string;
  Status: string;
  SubmittedBy: string;
  SubmittedAt: string;
  AssignedTo?: string;
  AssignedBy?: string;
  AssignedAt?: string;
  LastUpdated: string;
  Documents: DocumentResponseDto[];
  StatusHistory: StatusChangeLogDto[];
  RejectionRemark?: string;
  OnHoldRemark?: string;
}

export interface UpdateRequestStatusDto {
  Status: string;
  Remark?: string;
}

export interface AssignProjectManagerDto {
  ProjectManagerEmail: string;
}

// Document DTOs
export interface DocumentResponseDto {
  Id: string;
  Name: string;
  Type: string; // "AsIs", "Sop", "ToBe", "Other"
  Size: number;
  UploadedAt: string;
  Url: string;
}

export interface StatusChangeLogDto {
  Id: string;
  FromStatus: string;
  ToStatus: string;
  ChangedBy: string;
  ChangedAt: string;
  Remark?: string;
}

// Cost Center DTOs
export interface CreateCostCenterDto {
  Code: string;
  Name: string;
  Description?: string;
}

export interface CostCenterResponseDto {
  Id: string;
  Code: string;
  Name: string;
  Description?: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

// Analytics DTOs
export interface DashboardMetricsDto {
  TotalRequests: number;
  PendingRequests: number;
  ApprovedRequests: number;
  RejectedRequests: number;
  RequestsByStatus: StatusCountDto[];
  RequestsByPriority: PriorityCountDto[];
  RecentRequests: SoftwareRequestResponseDto[];
  RequestsByMonth: MonthlyCountDto[];
}

export interface StatusCountDto {
  Status: string;
  Count: number;
}

export interface PriorityCountDto {
  Priority: string;
  Count: number;
}

export interface MonthlyCountDto {
  Month: string;
  Count: number;
}

// Generic DTOs
export interface PaginatedResponseDto<T> {
  Data: T[];
  TotalCount: number;
  Page: number;
  PageSize: number;
  TotalPages: number;
  HasNextPage: boolean;
  HasPreviousPage: boolean;
}

export interface ApiResponseDto<T> {
  Success: boolean;
  Data?: T;
  Message?: string;
  Errors?: string[];
  Timestamp: string;
}

// File Upload DTOs
export interface FileUploadRequestDto {
  File: File;
  RequestId?: string;
  Type: string; // "AsIs", "Sop", "ToBe", "Other"
}

export interface FileUploadResponseDto {
  Id: string;
  Name: string;
  Size: number;
  Type: string;
  Url: string;
  UploadedAt: string;
}

// Error DTOs
export interface ValidationErrorDto {
  Field: string;
  Message: string;
}

export interface ErrorResponseDto {
  Success: false;
  Message: string;
  Errors?: string[];
  ValidationErrors?: ValidationErrorDto[];
  Timestamp: string;
  TraceId?: string;
}

// Query Parameters DTOs
export interface RequestQueryDto {
  Page?: number;
  PageSize?: number;
  Status?: string;
  Priority?: string;
  AssignedTo?: string;
  SubmittedBy?: string;
  DateFrom?: string;
  DateTo?: string;
  Search?: string;
  SortBy?: string;
  SortDirection?: 'asc' | 'desc';
}

export interface UserQueryDto {
  Page?: number;
  PageSize?: number;
  Role?: string;
  IsActive?: boolean;
  Department?: string;
  Search?: string;
}

export interface EmployeeQueryDto {
  Page?: number;
  PageSize?: number;
  CostCenter?: string;
  SystemRole?: string;
  Search?: string;
}
