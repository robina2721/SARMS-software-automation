import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  Filter,
  Download,
} from "lucide-react";

// Mock analytics data
const requestsByMonth = [
  { month: "Jan", submitted: 45, approved: 35, rejected: 8, completed: 28 },
  { month: "Feb", submitted: 52, approved: 41, rejected: 6, completed: 35 },
  { month: "Mar", submitted: 48, approved: 38, rejected: 7, completed: 33 },
  { month: "Apr", submitted: 61, approved: 48, rejected: 9, completed: 42 },
  { month: "May", submitted: 55, approved: 44, rejected: 5, completed: 39 },
  { month: "Jun", submitted: 67, approved: 53, rejected: 8, completed: 48 },
];

const requestsByPriority = [
  { name: "Critical", value: 45, color: "#ef4444" },
  { name: "High", value: 89, color: "#f59e0b" },
  { name: "Medium", value: 134, color: "#eab308" },
  { name: "Low", value: 67, color: "#517842" },
];

const requestsByDepartment = [
  { department: "IT", total: 89, avgDays: 12, satisfaction: 4.2 },
  { department: "Finance", total: 67, avgDays: 8, satisfaction: 4.5 },
  { department: "HR", total: 54, avgDays: 15, satisfaction: 3.8 },
  { department: "Sales", total: 78, avgDays: 10, satisfaction: 4.1 },
  { department: "Operations", total: 45, avgDays: 18, satisfaction: 3.9 },
  { department: "Marketing", total: 32, avgDays: 14, satisfaction: 4.0 },
];

const processingTimes = [
  { week: "Week 1", avgDays: 14, targetDays: 10 },
  { week: "Week 2", avgDays: 12, targetDays: 10 },
  { week: "Week 3", avgDays: 16, targetDays: 10 },
  { week: "Week 4", avgDays: 11, targetDays: 10 },
  { week: "Week 5", avgDays: 9, targetDays: 10 },
  { week: "Week 6", avgDays: 13, targetDays: 10 },
];

export default function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const canViewAnalytics =
    user?.role === "admin" || user?.role === "project_manager";

  if (!canViewAnalytics) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              Analytics are only available to administrators and project
              managers.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRequests = requestsByMonth.reduce(
    (sum, month) => sum + month.submitted,
    0,
  );
  const totalApproved = requestsByMonth.reduce(
    (sum, month) => sum + month.approved,
    0,
  );
  const totalCompleted = requestsByMonth.reduce(
    (sum, month) => sum + month.completed,
    0,
  );
  const approvalRate = ((totalApproved / totalRequests) * 100).toFixed(1);
  const completionRate = ((totalCompleted / totalApproved) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into request management performance
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +12% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +3.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Processing Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5 days</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-green-600" />
              -2.3 days improvement
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +5.1% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Requests by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="submitted" fill="#517842" name="Submitted" />
                <Bar dataKey="approved" fill="#FFC107" name="Approved" />
                <Bar dataKey="completed" fill="#567F46" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requests by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestsByPriority}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {requestsByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Processing Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processingTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgDays"
                  stroke="#517842"
                  strokeWidth={2}
                  name="Actual Days"
                />
                <Line
                  type="monotone"
                  dataKey="targetDays"
                  stroke="#FFC107"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target Days"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requestsByDepartment.map((dept, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{dept.department}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{dept.total} requests</span>
                      <span>•</span>
                      <span>{dept.avgDays} days avg</span>
                      <span>•</span>
                      <span>{dept.satisfaction}/5 ⭐</span>
                    </div>
                  </div>
                  <Badge variant={dept.avgDays <= 10 ? "default" : "secondary"}>
                    {dept.avgDays <= 10 ? "On Track" : "Delayed"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Financial Impact Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-primary">$2.4M</p>
              <p className="text-sm text-muted-foreground">
                Total Project Value
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-accent-foreground">$1.8M</p>
              <p className="text-sm text-muted-foreground">Approved Projects</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">$850K</p>
              <p className="text-sm text-muted-foreground">Estimated Savings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
