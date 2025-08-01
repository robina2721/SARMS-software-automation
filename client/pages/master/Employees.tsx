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
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  AlertTriangle,
} from "lucide-react";

interface Employee {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  costCenter: string;
  jobPosition: string;
  systemRole?: "employee" | "project_manager" | "admin" | "requester";
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "John",
    middleName: "Michael",
    lastName: "Admin",
    email: "admin@company.com",
    phoneNumber: "+1-555-0100",
    costCenter: "CC-IT-001",
    jobPosition: "System Administrator",
    systemRole: "admin",
    status: "active",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    firstName: "Jane",
    middleName: "Elizabeth",
    lastName: "Customer",
    email: "customer@company.com",
    phoneNumber: "+1-555-0101",
    costCenter: "CC-IT-001",
    jobPosition: "Business Analyst",
    systemRole: "requester",
    status: "active",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    firstName: "Mike",
    middleName: "David",
    lastName: "PM",
    email: "pm@company.com",
    phoneNumber: "+1-555-0102",
    costCenter: "CC-IT-002",
    jobPosition: "Project Manager",
    systemRole: "project_manager",
    status: "active",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-12"),
  },
];

const mockCostCenters = [
  { code: "CC-IT-001", name: "IT Department" },
  { code: "CC-IT-002", name: "IT Project Management" },
  { code: "CC-FIN-001", name: "Finance Department" },
  { code: "CC-HR-001", name: "Human Resources" },
  { code: "CC-SALES-001", name: "Sales Department" },
];

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    costCenter: "",
    jobPosition: "",
    systemRole: "employee" as "employee" | "project_manager" | "admin" | "requester",
  });

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <div>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              Employee management is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      costCenter: "",
      jobPosition: "",
      systemRole: "employee",
    });
    setEditingEmployee(null);
    setError("");
  };

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        costCenter: employee.costCenter,
        jobPosition: employee.jobPosition,
        systemRole: employee.systemRole || "employee",
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
      !formData.phoneNumber ||
      !formData.costCenter ||
      !formData.jobPosition ||
      !formData.systemRole
    ) {
      setError("All fields are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock API call

      if (editingEmployee) {
        // Update existing employee
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === editingEmployee.id
              ? { ...emp, ...formData, updatedAt: new Date() }
              : emp,
          ),
        );
      } else {
        // Create new employee
        const newEmployee: Employee = {
          id: Date.now().toString(),
          ...formData,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setEmployees((prev) => [...prev, newEmployee]);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      setError("Failed to save employee");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Mock API call
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    } catch (error) {
      setError("Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-primary/20 text-primary"
      : "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employee Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage employee records
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
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
                  />
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        middleName: e.target.value,
                      }))
                    }
                    placeholder="Enter middle name"
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="costCenter">Cost Center *</Label>
                  <Select
                    value={formData.costCenter}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, costCenter: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cost center" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCostCenters.map((cc) => (
                        <SelectItem key={cc.code} value={cc.code}>
                          {cc.code} - {cc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="jobPosition">Job Position *</Label>
                  <Input
                    id="jobPosition"
                    value={formData.jobPosition}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        jobPosition: e.target.value,
                      }))
                    }
                    placeholder="Enter job position"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="systemRole">System Role *</Label>
                <Select
                  value={formData.systemRole}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      systemRole: value as "employee" | "project_manager" | "admin" | "requester",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select system role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="project_manager">Project Manager</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="requester">Requester</SelectItem>
                  </SelectContent>
                </Select>
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
                  {loading
                    ? "Saving..."
                    : editingEmployee
                      ? "Update"
                      : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees by name, email, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <div className="space-y-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">
                        {employee.firstName} {employee.middleName}{" "}
                        {employee.lastName}
                      </h3>
                    </div>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.costCenter}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.jobPosition}</span>
                    </div>
                  </div>

                  {employee.systemRole && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        System Role: {employee.systemRole.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>
                      Created: {employee.createdAt.toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>
                      Updated: {employee.updatedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(employee)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(employee.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Employees Found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "No employees match your search criteria."
                : "Get started by adding your first employee."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
