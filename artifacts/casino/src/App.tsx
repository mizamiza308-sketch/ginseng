import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGetMe } from "@workspace/api-client-react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminTransactions from "./pages/admin/Transactions";
import NotFound from "@/pages/not-found";
import GamePage from "./pages/gamePage";

const queryClient = new QueryClient();

// Protected Route Wrapper
function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading, error } = useGetMe({ query: { retry: false } });

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  if (error || !user) {
    setLocation("/login");
    return null;
  }

  if (adminOnly && user.role !== 'admin') {
    setLocation("/");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/game/:provider">
        <GamePage />
      </Route>
      
      {/* User Routes */}
      <Route path="/user/profile">
        {() => <ProtectedRoute component={UserProfile} />}
      </Route>
      <Route path="/user/deposit">
        {() => <ProtectedRoute component={Deposit} />}
      </Route>
      <Route path="/user/withdraw">
        {() => <ProtectedRoute component={Withdraw} />}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminDashboard} adminOnly={true} />}
      </Route>
      <Route path="/admin/users">
        {() => <ProtectedRoute component={AdminUsers} adminOnly={true} />}
      </Route>
      <Route path="/admin/transactions">
        {() => <ProtectedRoute component={AdminTransactions} adminOnly={true} />}
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
      <Route path="/game/:provider" component={GamePage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
