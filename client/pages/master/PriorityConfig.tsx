import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  AlertTriangle,
  TrendingUp,
  Save,
  RotateCcw,
  Info,
  DollarSign,
  Users,
  Clock,
  FileText,
} from "lucide-react";
import {
  calculatePriority,
  getPriorityExplanation,
} from "@/lib/priority-calculator";

interface PriorityRule {
  id: string;
  name: string;
  priority: "high" | "medium" | "low";
  conditions: {
    regulatoryRequired: boolean;
    minFinancialImpact: number;
    maxFinancialImpact?: number;
    customerImpact: "internal" | "external" | "both";
    operationalUrgency: boolean;
  };
  isActive: boolean;
}

// Current priority rules based on BRD
const defaultPriorityRules: PriorityRule[] = [
  {
    id: "high",
    name: "High Priority",
    priority: "high",
    conditions: {
      regulatoryRequired: true,
      minFinancialImpact: 100000,
      customerImpact: "both",
      operationalUrgency: true,
    },
    isActive: true,
  },
  {
    id: "medium",
    name: "Medium Priority",
    priority: "medium",
    conditions: {
      regulatoryRequired: true,
      minFinancialImpact: 50000,
      maxFinancialImpact: 99999,
      customerImpact: "both",
      operationalUrgency: true,
    },
    isActive: true,
  },
  {
    id: "low",
    name: "Low Priority",
    priority: "low",
    conditions: {
      regulatoryRequired: false,
      minFinancialImpact: 0,
      customerImpact: "internal",
      operationalUrgency: false,
    },
    isActive: true,
  },
];

interface SystemSettings {
  autoCalculatePriority: boolean;
  allowUserOverride: boolean;
  escalationThresholdDays: number;
  notifyOnPriorityChange: boolean;
  requireJustificationForOverride: boolean;
}

const defaultSystemSettings: SystemSettings = {
  autoCalculatePriority: true,
  allowUserOverride: true,
  escalationThresholdDays: 7,
  notifyOnPriorityChange: true,
  requireJustificationForOverride: true,
};

export default function PriorityConfig() {
  const { user } = useAuth();
  const [priorityRules, setPriorityRules] =
    useState<PriorityRule[]>(defaultPriorityRules);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(
    defaultSystemSettings,
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Test scenario for priority calculation
  const [testScenario, setTestScenario] = useState({
    isRegulatoryRequirement: false,
    financialImpactUSD: 0,
    customerImpact: "internal" as "internal" | "external" | "both",
    operationalUrgency: false,
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
              Priority configuration is only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    setLoading(true);
    setError("");

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Priority configuration saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to save configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    if (
      confirm(
        "Are you sure you want to reset to default priority rules? This cannot be undone.",
      )
    ) {
      setPriorityRules(defaultPriorityRules);
      setSystemSettings(defaultSystemSettings);
    }
  };

  const updatePriorityRule = (
    ruleId: string,
    updates: Partial<PriorityRule>,
  ) => {
    setPriorityRules((prev) =>
      prev.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)),
    );
  };

  const updateSystemSetting = (key: keyof SystemSettings, value: any) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }));
  };

  const testPriority = calculatePriority(testScenario);
  const testExplanation = getPriorityExplanation(testScenario);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Priority Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure system-wide priority calculation rules and thresholds
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleResetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </div>

      {success && (
        <Alert>
          <Save className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rules">Priority Rules</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="test">Test Calculator</TabsTrigger>
        </TabsList>

        {/* Priority Rules Configuration */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Priority Rules Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {priorityRules.map((rule) => (
                <Card key={rule.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{rule.name}</h3>
                        <Badge
                          className={
                            rule.priority === "high"
                              ? "bg-destructive/20 text-destructive"
                              : rule.priority === "medium"
                                ? "bg-accent/30 text-accent-foreground"
                                : "bg-primary/15 text-primary"
                          }
                        >
                          {rule.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={(checked) =>
                          updatePriorityRule(rule.id, { isActive: checked })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Regulatory Requirement
                        </Label>
                        <div className="mt-1">
                          <Select
                            value={rule.conditions.regulatoryRequired.toString()}
                            onValueChange={(value) =>
                              updatePriorityRule(rule.id, {
                                conditions: {
                                  ...rule.conditions,
                                  regulatoryRequired: value === "true",
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Required</SelectItem>
                              <SelectItem value="false">
                                Not Required
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Min Financial Impact (USD)
                        </Label>
                        <Input
                          type="number"
                          value={rule.conditions.minFinancialImpact}
                          onChange={(e) =>
                            updatePriorityRule(rule.id, {
                              conditions: {
                                ...rule.conditions,
                                minFinancialImpact:
                                  parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Customer Impact
                        </Label>
                        <div className="mt-1">
                          <Select
                            value={rule.conditions.customerImpact}
                            onValueChange={(value) =>
                              updatePriorityRule(rule.id, {
                                conditions: {
                                  ...rule.conditions,
                                  customerImpact: value as any,
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="internal">Internal</SelectItem>
                              <SelectItem value="external">External</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Operational Urgency
                        </Label>
                        <div className="mt-1">
                          <Select
                            value={rule.conditions.operationalUrgency.toString()}
                            onValueChange={(value) =>
                              updatePriorityRule(rule.id, {
                                conditions: {
                                  ...rule.conditions,
                                  operationalUrgency: value === "true",
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Required</SelectItem>
                              <SelectItem value="false">
                                Not Required
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {rule.conditions.maxFinancialImpact && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium">
                          Max Financial Impact (USD)
                        </Label>
                        <Input
                          type="number"
                          value={rule.conditions.maxFinancialImpact}
                          onChange={(e) =>
                            updatePriorityRule(rule.id, {
                              conditions: {
                                ...rule.conditions,
                                maxFinancialImpact:
                                  parseInt(e.target.value) || undefined,
                              },
                            })
                          }
                          className="mt-1 max-w-xs"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">
                    Auto-Calculate Priority
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically calculate priority based on impact analysis
                  </p>
                </div>
                <Switch
                  checked={systemSettings.autoCalculatePriority}
                  onCheckedChange={(checked) =>
                    updateSystemSetting("autoCalculatePriority", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">
                    Allow User Override
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to override system-calculated priority
                  </p>
                </div>
                <Switch
                  checked={systemSettings.allowUserOverride}
                  onCheckedChange={(checked) =>
                    updateSystemSetting("allowUserOverride", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">
                    Notify on Priority Change
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications when priority levels change
                  </p>
                </div>
                <Switch
                  checked={systemSettings.notifyOnPriorityChange}
                  onCheckedChange={(checked) =>
                    updateSystemSetting("notifyOnPriorityChange", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">
                    Require Justification for Override
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Require justification when users override calculated
                    priority
                  </p>
                </div>
                <Switch
                  checked={systemSettings.requireJustificationForOverride}
                  onCheckedChange={(checked) =>
                    updateSystemSetting(
                      "requireJustificationForOverride",
                      checked,
                    )
                  }
                />
              </div>

              <div>
                <Label htmlFor="escalationThreshold">
                  Escalation Threshold (Days)
                </Label>
                <Input
                  id="escalationThreshold"
                  type="number"
                  value={systemSettings.escalationThresholdDays}
                  onChange={(e) =>
                    updateSystemSetting(
                      "escalationThresholdDays",
                      parseInt(e.target.value) || 7,
                    )
                  }
                  className="mt-1 max-w-xs"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Number of days before unprocessed requests are escalated
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Priority Calculator Test */}
        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Priority Calculator Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Test Scenario</h4>

                  <div>
                    <Label>Regulatory Requirement</Label>
                    <Select
                      value={testScenario.isRegulatoryRequirement.toString()}
                      onValueChange={(value) =>
                        setTestScenario((prev) => ({
                          ...prev,
                          isRegulatoryRequirement: value === "true",
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Financial Impact (USD)</Label>
                    <Input
                      type="number"
                      value={testScenario.financialImpactUSD}
                      onChange={(e) =>
                        setTestScenario((prev) => ({
                          ...prev,
                          financialImpactUSD: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Customer Impact</Label>
                    <Select
                      value={testScenario.customerImpact}
                      onValueChange={(value) =>
                        setTestScenario((prev) => ({
                          ...prev,
                          customerImpact: value as any,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="external">External</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Operational Urgency</Label>
                    <Select
                      value={testScenario.operationalUrgency.toString()}
                      onValueChange={(value) =>
                        setTestScenario((prev) => ({
                          ...prev,
                          operationalUrgency: value === "true",
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Calculated Result</h4>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-medium">Calculated Priority:</span>
                      <Badge
                        className={
                          testPriority === "high"
                            ? "bg-destructive/20 text-destructive"
                            : testPriority === "medium"
                              ? "bg-accent/30 text-accent-foreground"
                              : "bg-primary/15 text-primary"
                        }
                      >
                        {testPriority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {testExplanation}
                    </p>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This calculator uses the current priority rules to
                      determine the system-assigned priority level.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
