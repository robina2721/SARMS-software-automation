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
  Building,
  MapPin,
  Hash,
  AlertTriangle,
} from "lucide-react";

interface CostCenter {
  id: string;
  departmentName: string;
  costCenterCode: string;
  country: string;
  status: "active" | "inactive";
  employeeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const mockCostCenters: CostCenter[] = [
  {
    id: "1",
    departmentName: "Information Technology",
    costCenterCode: "CC-IT-001",
    country: "Ethiopia",
    status: "active",
    employeeCount: 25,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    departmentName: "IT Project Management",
    costCenterCode: "CC-IT-002",
    country: "Ethiopia",
    status: "active",
    employeeCount: 8,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    departmentName: "Finance",
    costCenterCode: "CC-FIN-001",
    country: "Ethiopia",
    status: "active",
    employeeCount: 15,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "4",
    departmentName: "Human Resources",
    costCenterCode: "CC-HR-001",
    country: "Ethiopia",
    status: "active",
    employeeCount: 12,
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-01-08"),
  },
  {
    id: "5",
    departmentName: "Sales",
    costCenterCode: "CC-SALES-001",
    country: "Ethiopia",
    status: "active",
    employeeCount: 30,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-14"),
  },
];

const countries = [
  "Ethiopia",
  "Kenya",
  "Uganda",
  "Tanzania",
  "South Sudan",
  "Rwanda",
  "Burundi",
  "Somalia",
  "Djibouti",
];

export default function CostCenters() {
  const { user } = useAuth();
  const [costCenters, setCostCenters] = useState<CostCenter[]>(mockCostCenters);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    departmentName: "",
    costCenterCode: "",
    country: "",
  });

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              Cost center management is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredCostCenters = costCenters.filter(
    (cc) =>
      cc.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cc.costCenterCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cc.country.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const resetForm = () => {
    setFormData({
      departmentName: "",
      costCenterCode: "",
      country: "",
    });
    setEditingCostCenter(null);
    setError("");
  };

  const handleOpenDialog = (costCenter?: CostCenter) => {
    if (costCenter) {
      setEditingCostCenter(costCenter);
      setFormData({
        departmentName: costCenter.departmentName,
        costCenterCode: costCenter.costCenterCode,
        country: costCenter.country,
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
      !formData.departmentName ||
      !formData.costCenterCode ||
      !formData.country
    ) {
      setError("All fields are required");
      return;
    }

    // Check for duplicate cost center code
    const duplicateCode = costCenters.find(
      (cc) =>
        cc.costCenterCode === formData.costCenterCode &&
        cc.id !== editingCostCenter?.id,
    );

    if (duplicateCode) {
      setError("Cost center code already exists");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock API call

      if (editingCostCenter) {
        // Update existing cost center
        setCostCenters((prev) =>
          prev.map((cc) =>
            cc.id === editingCostCenter.id
              ? { ...cc, ...formData, updatedAt: new Date() }
              : cc,
          ),
        );
      } else {
        // Create new cost center
        const newCostCenter: CostCenter = {
          id: Date.now().toString(),
          ...formData,
          status: "active",
          employeeCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setCostCenters((prev) => [...prev, newCostCenter]);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      setError("Failed to save cost center");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (costCenterId: string) => {
    const costCenter = costCenters.find((cc) => cc.id === costCenterId);

    if (costCenter?.employeeCount > 0) {
      setError("Cannot delete cost center with assigned employees");
      return;
    }

    if (!confirm("Are you sure you want to delete this cost center?")) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Mock API call
      setCostCenters((prev) => prev.filter((cc) => cc.id !== costCenterId));
    } catch (error) {
      setError("Failed to delete cost center");
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cost Center Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage cost centers and departments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Cost Center
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingCostCenter ? "Edit Cost Center" : "Add New Cost Center"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="departmentName">Department Name *</Label>
                <Input
                  id="departmentName"
                  value={formData.departmentName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      departmentName: e.target.value,
                    }))
                  }
                  placeholder="Enter department name"
                />
              </div>

              <div>
                <Label htmlFor="costCenterCode">Cost Center Code *</Label>
                <Input
                  id="costCenterCode"
                  value={formData.costCenterCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      costCenterCode: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="Enter cost center code (e.g., CC-IT-001)"
                />
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, country: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
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
                    : editingCostCenter
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
                placeholder="Search cost centers by name, code, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Center List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCostCenters.map((costCenter) => (
          <Card
            key={costCenter.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">
                        {costCenter.departmentName}
                      </h3>
                    </div>
                    <Badge className={getStatusColor(costCenter.status)}>
                      {costCenter.status}
                    </Badge>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(costCenter)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(costCenter.id)}
                      disabled={costCenter.employeeCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {costCenter.costCenterCode}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{costCenter.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{costCenter.employeeCount} employees</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  <div>
                    Created: {costCenter.createdAt.toLocaleDateString()}
                  </div>
                  <div>
                    Updated: {costCenter.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCostCenters.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Cost Centers Found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "No cost centers match your search criteria."
                : "Get started by adding your first cost center."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {costCenters.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Cost Centers
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {costCenters.filter((cc) => cc.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Centers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {costCenters.reduce((sum, cc) => sum + cc.employeeCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Employees</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(costCenters.map((cc) => cc.country)).size}
            </div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
