import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { requestsApi } from "@/services/api";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreateRequestDTO,
  CustomerImpact,
  RequestPriority,
} from "@shared/types";
import {
  calculatePriority,
  getPriorityExplanation,
} from "@/lib/priority-calculator";

export default function NewRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateRequestDTO>({
    departmentName: user?.department || "",
    costCenter: "",
    contactPerson: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      position: "",
    },
    requestedSolutionName: "",
    purposeAndJustification: "",
    processDescription: "",
    impactAnalysis: {
      isRegulatoryRequirement: false,
      regulatoryExplanation: "",
      financialImpactUSD: 0,
      customerImpact: "internal",
      operationalUrgency: false,
      existingSystems: "",
    },
    integrationNeeds: "",
    priority: "medium",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [calculatedPriority, setCalculatedPriority] =
    useState<RequestPriority>("low");
  const [priorityExplanation, setPriorityExplanation] = useState<string>("");

  // Recalculate priority when impact analysis changes
  useEffect(() => {
    const newPriority = calculatePriority(formData.impactAnalysis);
    const explanation = getPriorityExplanation(formData.impactAnalysis);
    setCalculatedPriority(newPriority);
    setPriorityExplanation(explanation);
  }, [formData.impactAnalysis]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateRequestDTO] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    // Security validation
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/png",
      "image/jpeg",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} - Invalid file type`);
        return;
      }

      if (file.size > maxSize) {
        invalidFiles.push(`${file.name} - File too large (max 10MB)`);
        return;
      }

      // Additional security check for file extension
      const allowedExtensions = [
        ".pdf",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".png",
        ".jpg",
        ".jpeg",
      ];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      if (!allowedExtensions.includes(fileExtension)) {
        invalidFiles.push(`${file.name} - Invalid file extension`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        fileUpload: `Invalid files: ${invalidFiles.join(", ")}`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, fileUpload: "" }));
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.departmentName)
      newErrors.departmentName = "Department name is required";
    if (!formData.costCenter) newErrors.costCenter = "Cost center is required";
    if (!formData.contactPerson.name)
      newErrors["contactPerson.name"] = "Contact name is required";
    if (!formData.contactPerson.email)
      newErrors["contactPerson.email"] = "Contact email is required";
    if (!formData.contactPerson.phone)
      newErrors["contactPerson.phone"] = "Contact phone is required";
    if (!formData.contactPerson.position)
      newErrors["contactPerson.position"] = "Contact position is required";
    if (!formData.requestedSolutionName)
      newErrors.requestedSolutionName = "Solution name is required";
    if (!formData.purposeAndJustification)
      newErrors.purposeAndJustification =
        "Purpose and justification is required";
    if (!formData.processDescription)
      newErrors.processDescription = "Process description is required";

    if (
      formData.impactAnalysis.isRegulatoryRequirement &&
      !formData.impactAnalysis.regulatoryExplanation
    ) {
      newErrors["impactAnalysis.regulatoryExplanation"] =
        "Regulatory explanation is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Here you would make the API call to create the request
      console.log("Submitting request:", formData, uploadedFiles);

      // Mock success - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate("/requests");
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "customer") {
    return (
      <div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only customers can create new requests. Please contact an
            administrator if you need access.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          New Software Request
        </h1>
        <p className="text-muted-foreground">
          Submit a new software or automation solution request
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departmentName">Department Name *</Label>
                <Input
                  id="departmentName"
                  value={formData.departmentName}
                  onChange={(e) =>
                    handleInputChange("departmentName", e.target.value)
                  }
                  className={errors.departmentName ? "border-red-500" : ""}
                />
                {errors.departmentName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.departmentName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="costCenter">Cost Center *</Label>
                <Input
                  id="costCenter"
                  value={formData.costCenter}
                  onChange={(e) =>
                    handleInputChange("costCenter", e.target.value)
                  }
                  className={errors.costCenter ? "border-red-500" : ""}
                />
                {errors.costCenter && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.costCenter}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Person Details */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Person Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Full Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactPerson.name}
                  onChange={(e) =>
                    handleInputChange("contactPerson.name", e.target.value)
                  }
                  className={
                    errors["contactPerson.name"] ? "border-red-500" : ""
                  }
                />
                {errors["contactPerson.name"] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors["contactPerson.name"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactPerson.email}
                  onChange={(e) =>
                    handleInputChange("contactPerson.email", e.target.value)
                  }
                  className={
                    errors["contactPerson.email"] ? "border-red-500" : ""
                  }
                />
                {errors["contactPerson.email"] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors["contactPerson.email"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone *</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPerson.phone}
                  onChange={(e) =>
                    handleInputChange("contactPerson.phone", e.target.value)
                  }
                  className={
                    errors["contactPerson.phone"] ? "border-red-500" : ""
                  }
                />
                {errors["contactPerson.phone"] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors["contactPerson.phone"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="contactPosition">Position *</Label>
                <Input
                  id="contactPosition"
                  value={formData.contactPerson.position}
                  onChange={(e) =>
                    handleInputChange("contactPerson.position", e.target.value)
                  }
                  className={
                    errors["contactPerson.position"] ? "border-red-500" : ""
                  }
                />
                {errors["contactPerson.position"] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors["contactPerson.position"]}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution Details */}
        <Card>
          <CardHeader>
            <CardTitle>Solution Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="solutionName">Requested Solution Name *</Label>
              <Input
                id="solutionName"
                value={formData.requestedSolutionName}
                onChange={(e) =>
                  handleInputChange("requestedSolutionName", e.target.value)
                }
                className={errors.requestedSolutionName ? "border-red-500" : ""}
              />
              {errors.requestedSolutionName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.requestedSolutionName}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="purpose">Purpose and Justification *</Label>
              <Textarea
                id="purpose"
                rows={4}
                value={formData.purposeAndJustification}
                onChange={(e) =>
                  handleInputChange("purposeAndJustification", e.target.value)
                }
                className={
                  errors.purposeAndJustification ? "border-red-500" : ""
                }
              />
              {errors.purposeAndJustification && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.purposeAndJustification}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="processDescription">Process Description *</Label>
              <Textarea
                id="processDescription"
                rows={4}
                value={formData.processDescription}
                onChange={(e) =>
                  handleInputChange("processDescription", e.target.value)
                }
                className={errors.processDescription ? "border-red-500" : ""}
              />
              {errors.processDescription && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.processDescription}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Impact Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="regulatory"
                checked={formData.impactAnalysis.isRegulatoryRequirement}
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "impactAnalysis.isRegulatoryRequirement",
                    checked,
                  )
                }
              />
              <Label htmlFor="regulatory">
                Is this a Regulatory Body requirement?
              </Label>
            </div>

            {formData.impactAnalysis.isRegulatoryRequirement && (
              <div>
                <Label htmlFor="regulatoryExplanation">
                  Regulatory Explanation *
                </Label>
                <Textarea
                  id="regulatoryExplanation"
                  value={formData.impactAnalysis.regulatoryExplanation}
                  onChange={(e) =>
                    handleInputChange(
                      "impactAnalysis.regulatoryExplanation",
                      e.target.value,
                    )
                  }
                  className={
                    errors["impactAnalysis.regulatoryExplanation"]
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors["impactAnalysis.regulatoryExplanation"] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors["impactAnalysis.regulatoryExplanation"]}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="financialImpact">Financial Impact (USD)</Label>
              <Input
                id="financialImpact"
                type="number"
                value={formData.impactAnalysis.financialImpactUSD}
                onChange={(e) =>
                  handleInputChange(
                    "impactAnalysis.financialImpactUSD",
                    parseFloat(e.target.value) || 0,
                  )
                }
              />
            </div>

            <div>
              <Label>Customer Impact</Label>
              <RadioGroup
                value={formData.impactAnalysis.customerImpact}
                onValueChange={(value) =>
                  handleInputChange(
                    "impactAnalysis.customerImpact",
                    value as CustomerImpact,
                  )
                }
                className="flex space-x-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="internal" id="internal" />
                  <Label htmlFor="internal">Internal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external">External</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">Both</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgency"
                checked={formData.impactAnalysis.operationalUrgency}
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "impactAnalysis.operationalUrgency",
                    checked,
                  )
                }
              />
              <Label htmlFor="urgency">Operational Urgency</Label>
            </div>

            <div>
              <Label htmlFor="existingSystems">
                Existing Systems (if applicable)
              </Label>
              <Textarea
                id="existingSystems"
                value={formData.impactAnalysis.existingSystems}
                onChange={(e) =>
                  handleInputChange(
                    "impactAnalysis.existingSystems",
                    e.target.value,
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Integration and Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Integration & Priority</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="integrationNeeds">
                Integration Needs (if any)
              </Label>
              <Textarea
                id="integrationNeeds"
                value={formData.integrationNeeds}
                onChange={(e) =>
                  handleInputChange("integrationNeeds", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority (as perceived by you)</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  handleInputChange("priority", value as RequestPriority)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">
                  System Calculated Priority
                </Label>
                <Badge
                  variant="outline"
                  className={
                    calculatedPriority === "high"
                      ? "bg-destructive/20 text-destructive"
                      : calculatedPriority === "medium"
                        ? "bg-accent/30 text-accent-foreground"
                        : "bg-primary/15 text-primary"
                  }
                >
                  {calculatedPriority.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {priorityExplanation}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Document Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Document Uploads</CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload AS-IS processes, SOPs, TO-BE process maps, or other
              relevant documents
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-4">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Click to upload files
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      PDF, DOC, DOCX, XLS, XLSX, PNG, JPG up to 10MB each
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      🔒 Files are encrypted and security scanned
                    </span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                  />
                  {errors.fileUpload && (
                    <p className="text-sm text-red-500 mt-2">
                      {errors.fileUpload}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files</Label>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="outline">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
