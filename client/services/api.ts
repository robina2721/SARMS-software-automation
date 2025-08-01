/**
 * API Service Layer for C# Backend Integration
 * Handles all HTTP requests with proper error handling and TypeScript types
 */

import { 
  SoftwareRequest, 
  CreateRequestDTO, 
  RequestStatus,
  UserRole
} from '@/shared/types';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// HTTP Client with error handling
class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const token = localStorage.getItem('authToken');
      
      const config: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient();

// Authentication API
export const authApi = {
  // POST /api/auth/login
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post<{
      user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        department?: string;
      };
      token: string;
      refreshToken: string;
    }>('/auth/login', {
      Email: credentials.email,
      Password: credentials.password
    });

    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response;
  },

  // POST /api/auth/forgot-password
  forgotPassword: async (email: string) => {
    return apiClient.post<{ message: string }>('/auth/forgot-password', {
      Email: email
    });
  },

  // POST /api/auth/reset-password
  resetPassword: async (data: { email: string; token: string; newPassword: string }) => {
    return apiClient.post<{ message: string }>('/auth/reset-password', {
      Email: data.email,
      Token: data.token,
      NewPassword: data.newPassword
    });
  },

  // POST /api/auth/logout
  logout: async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  }
};

// Software Requests API
export const requestsApi = {
  // GET /api/requests
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    status?: RequestStatus;
    assignedTo?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.assignedTo) queryParams.append('assignedTo', params.assignedTo);

    return apiClient.get<PaginatedResponse<SoftwareRequest>>(
      `/requests?${queryParams.toString()}`
    );
  },

  // GET /api/requests/{id}
  getById: async (id: string) => {
    return apiClient.get<SoftwareRequest>(`/requests/${id}`);
  },

  // GET /api/requests/my
  getMyRequests: async (params?: { page?: number; pageSize?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    return apiClient.get<PaginatedResponse<SoftwareRequest>>(
      `/requests/my?${queryParams.toString()}`
    );
  },

  // POST /api/requests
  create: async (request: CreateRequestDTO) => {
    return apiClient.post<SoftwareRequest>('/requests', {
      DepartmentName: request.departmentName,
      CostCenter: request.costCenter,
      ContactPerson: {
        Name: request.contactPerson.name,
        Email: request.contactPerson.email,
        Phone: request.contactPerson.phone,
        Position: request.contactPerson.position
      },
      RequestedSolutionName: request.requestedSolutionName,
      PurposeAndJustification: request.purposeAndJustification,
      ProcessDescription: request.processDescription,
      ImpactAnalysis: {
        IsRegulatoryRequirement: request.impactAnalysis.isRegulatoryRequirement,
        RegulatoryExplanation: request.impactAnalysis.regulatoryExplanation,
        FinancialImpactUSD: request.impactAnalysis.financialImpactUSD,
        CustomerImpact: request.impactAnalysis.customerImpact,
        OperationalUrgency: request.impactAnalysis.operationalUrgency,
        ExistingSystems: request.impactAnalysis.existingSystems
      },
      IntegrationNeeds: request.integrationNeeds,
      Priority: request.priority
    });
  },

  // PUT /api/requests/{id}
  update: async (id: string, request: Partial<CreateRequestDTO>) => {
    return apiClient.put<SoftwareRequest>(`/requests/${id}`, request);
  },

  // PUT /api/requests/{id}/status
  updateStatus: async (id: string, status: RequestStatus, remark?: string) => {
    return apiClient.put<SoftwareRequest>(`/requests/${id}/status`, {
      Status: status,
      Remark: remark
    });
  },

  // PUT /api/requests/{id}/assign
  assignToProjectManager: async (id: string, projectManagerEmail: string) => {
    return apiClient.put<SoftwareRequest>(`/requests/${id}/assign`, {
      ProjectManagerEmail: projectManagerEmail
    });
  },

  // DELETE /api/requests/{id}
  delete: async (id: string) => {
    return apiClient.delete(`/requests/${id}`);
  }
};

// Users Management API
export const usersApi = {
  // GET /api/users
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    role?: UserRole;
    isActive?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    return apiClient.get<PaginatedResponse<any>>(`/users?${queryParams.toString()}`);
  },

  // GET /api/users/{id}
  getById: async (id: string) => {
    return apiClient.get<any>(`/users/${id}`);
  },

  // POST /api/users
  create: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    department?: string;
    password: string;
    isActive: boolean;
  }) => {
    return apiClient.post<any>('/users', {
      FirstName: userData.firstName,
      LastName: userData.lastName,
      Email: userData.email,
      Role: userData.role,
      Department: userData.department,
      Password: userData.password,
      IsActive: userData.isActive
    });
  },

  // PUT /api/users/{id}
  update: async (id: string, userData: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    department: string;
    isActive: boolean;
  }>) => {
    return apiClient.put<any>(`/users/${id}`, userData);
  },

  // PUT /api/users/{id}/password
  resetPassword: async (id: string, newPassword: string) => {
    return apiClient.put<{ message: string }>(`/users/${id}/password`, {
      NewPassword: newPassword
    });
  },

  // PUT /api/users/{id}/toggle-status
  toggleStatus: async (id: string) => {
    return apiClient.put<any>(`/users/${id}/toggle-status`, {});
  },

  // DELETE /api/users/{id}
  delete: async (id: string) => {
    return apiClient.delete(`/users/${id}`);
  }
};

// Employees Management API
export const employeesApi = {
  // GET /api/employees
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);

    return apiClient.get<PaginatedResponse<any>>(`/employees?${queryParams.toString()}`);
  },

  // POST /api/employees
  create: async (employeeData: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    costCenter: string;
    jobPosition: string;
    systemRole?: string;
  }) => {
    return apiClient.post<any>('/employees', {
      FirstName: employeeData.firstName,
      MiddleName: employeeData.middleName,
      LastName: employeeData.lastName,
      Email: employeeData.email,
      PhoneNumber: employeeData.phoneNumber,
      CostCenter: employeeData.costCenter,
      JobPosition: employeeData.jobPosition,
      SystemRole: employeeData.systemRole
    });
  },

  // PUT /api/employees/{id}
  update: async (id: string, employeeData: any) => {
    return apiClient.put<any>(`/employees/${id}`, employeeData);
  },

  // DELETE /api/employees/{id}
  delete: async (id: string) => {
    return apiClient.delete(`/employees/${id}`);
  }
};

// Cost Centers API
export const costCentersApi = {
  // GET /api/cost-centers
  getAll: async () => {
    return apiClient.get<any[]>('/cost-centers');
  },

  // POST /api/cost-centers
  create: async (costCenterData: { code: string; name: string; description?: string }) => {
    return apiClient.post<any>('/cost-centers', {
      Code: costCenterData.code,
      Name: costCenterData.name,
      Description: costCenterData.description
    });
  },

  // PUT /api/cost-centers/{id}
  update: async (id: string, costCenterData: any) => {
    return apiClient.put<any>(`/cost-centers/${id}`, costCenterData);
  },

  // DELETE /api/cost-centers/{id}
  delete: async (id: string) => {
    return apiClient.delete(`/cost-centers/${id}`);
  }
};

// Analytics API
export const analyticsApi = {
  // GET /api/analytics/dashboard
  getDashboardMetrics: async () => {
    return apiClient.get<{
      totalRequests: number;
      pendingRequests: number;
      approvedRequests: number;
      rejectedRequests: number;
      requestsByStatus: Array<{ status: string; count: number }>;
      requestsByPriority: Array<{ priority: string; count: number }>;
      recentRequests: SoftwareRequest[];
    }>('/analytics/dashboard');
  },

  // GET /api/analytics/reports
  getReports: async (params: {
    startDate: string;
    endDate: string;
    groupBy?: 'day' | 'week' | 'month';
  }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', params.startDate);
    queryParams.append('endDate', params.endDate);
    if (params.groupBy) queryParams.append('groupBy', params.groupBy);

    return apiClient.get<any>(`/analytics/reports?${queryParams.toString()}`);
  }
};

// File Upload API
export const filesApi = {
  // POST /api/files/upload
  uploadDocument: async (file: File, requestId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (requestId) formData.append('requestId', requestId);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  // DELETE /api/files/{id}
  deleteDocument: async (fileId: string) => {
    return apiClient.delete(`/files/${fileId}`);
  }
};

// Export main API object
export const api = {
  auth: authApi,
  requests: requestsApi,
  users: usersApi,
  employees: employeesApi,
  costCenters: costCentersApi,
  analytics: analyticsApi,
  files: filesApi,
};

export default api;
