import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Building,
  TrendingUp,
  UserCheck,
  Calendar,
  Target,
} from "lucide-react";

// Mock data - replace with actual API calls
const getMetricsForRole = (role: string) => {
  switch (role) {
    case "customer":
      return {
        totalRequests: 12,
        pendingRequests: 3,
        approvedRequests: 8,
        rejectedRequests: 1,
        avgProcessingTime: "8 days",
        assignedPM: "Mike PM",
        lastRequestDate: "2024-01-15",
      };
    case "project_manager":
      return {
        assignedRequests: 23,
        pendingReview: 5,
        approvedThisMonth: 12,
        rejectedThisMonth: 2,
        avgReviewTime: "3 days",
        departmentsCovered: 6,
        satisfactionScore: 4.3,
      };
    case "admin":
      return {
        totalSystemRequests: 156,
        newRequests: 8,
        underReview: 23,
        approved: 89,
        rejected: 12,
        onHold: 4,
        activePMs: 5,
        departmentsActive: 8,
        monthlyGrowth: "+15%",
      };
    default:
      return {};
  }
};

export function DashboardMetrics() {
  const { user } = useAuth();
  const metrics = getMetricsForRole(user?.role || "customer");

  if (user?.role === "customer") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalRequests}</div>
              <p className="text-xs text-muted-foreground">Total submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.pendingRequests}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.approvedRequests}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for implementation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Processing
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.avgProcessingTime}
              </div>
              <p className="text-xs text-muted-foreground">Response time</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer-specific info */}
        <Card>
          <CardHeader>
            <CardTitle>My Project Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{metrics.assignedPM}</p>
                  <p className="text-sm text-muted-foreground">
                    Assigned Project Manager
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (user?.role === "project_manager") {
    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Assigned Requests
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.assignedRequests}
              </div>
              <p className="text-xs text-muted-foreground">Under my review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pendingReview}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting my action
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved This Month
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.approvedThisMonth}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully processed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Review Time
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgReviewTime}</div>
              <p className="text-xs text-muted-foreground">
                My processing speed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* PM-specific metrics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Department Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {metrics.departmentsCovered}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Departments served
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Satisfaction Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {metrics.satisfactionScore}/5
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Customer rating
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Excellent
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Admin metrics
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.totalSystemRequests}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              {metrics.monthlyGrowth} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.newRequests}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.underReview}</div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active PMs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activePMs}</div>
            <p className="text-xs text-muted-foreground">Project managers</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin-specific status breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Request Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Approved</span>
              <Badge className="bg-primary/20 text-primary">
                {metrics.approved}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Under Review</span>
              <Badge className="bg-accent/20 text-accent-foreground">
                {metrics.underReview}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Rejected</span>
              <Badge className="bg-destructive/10 text-destructive">
                {metrics.rejected}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">On Hold</span>
              <Badge className="bg-orange-100 text-orange-800">
                {metrics.onHold}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Departments</span>
              <Badge variant="outline">{metrics.departmentsActive}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Response Rate</span>
              <Badge className="bg-primary/20 text-primary">98.2%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">System Uptime</span>
              <Badge className="bg-primary/20 text-primary">99.9%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Request Volume</span>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-sm text-green-600">+15%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Processing Speed</span>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-sm text-green-600">+8%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">User Satisfaction</span>
              <Badge className="bg-primary/20 text-primary">4.6/5</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
