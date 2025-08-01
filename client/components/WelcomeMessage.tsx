import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, UserCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeMessage() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "project_manager":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "customer":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      default:
        return <UserCheck className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "project_manager":
        return "Project Manager";
      case "customer":
        return "Customer";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      case "project_manager":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "customer":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
  };

  if (!isVisible || !user) {
    return null;
  }

  return (
    <Card className="mb-6 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 via-transparent to-transparent shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {getRoleIcon(user.role)}
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {greeting}, {user.name}!
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getRoleColor(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                  {user.department && (
                    <span className="text-sm text-muted-foreground">
                      • {user.department}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
