import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Auth } from "@/components/Auth";
import { Layout } from "@/components/Layout";

import Dashboard from "./pages/Dashboard";
import NewRequest from "./pages/NewRequest";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import RequestList from "./pages/RequestList";
import RequestDetails from "./pages/RequestDetails";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Employees from "./pages/master/Employees";
import CostCenters from "./pages/master/CostCenters";
import PriorityConfig from "./pages/master/PriorityConfig";
import UserAccounts from "./pages/accounts/UserAccounts";
import RolesPrivileges from "./pages/accounts/RolesPrivileges";
import PasswordReset from "./pages/accounts/PasswordReset";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/request/new" element={<NewRequest />} />
        <Route path="/requests" element={<RequestList viewMode="my" />} />
        <Route path="/requests/all" element={<RequestList viewMode="all" />} />
        <Route path="/request/:id" element={<RequestDetails />} />

        {/* Master Data Routes */}
        <Route path="/master/employees" element={<Employees />} />
        <Route path="/master/cost-centers" element={<CostCenters />} />
        <Route path="/master/priority-config" element={<PriorityConfig />} />

        {/* Account Management Routes */}
        <Route path="/accounts/users" element={<UserAccounts />} />
        <Route path="/accounts/roles" element={<RolesPrivileges />} />
        <Route path="/accounts/password-reset" element={<PasswordReset />} />

        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
