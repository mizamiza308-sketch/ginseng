import { Link, useLocation } from "wouter";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Users, ArrowLeftRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useGetMe({ query: { retry: false } });
  const queryClient = useQueryClient();

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

  if (!user || user.role !== 'admin') {
    setLocation('/');
    return null;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    queryClient.setQueryData(getGetMeQueryKey(), null);
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-display font-black text-2xl text-primary drop-shadow-[0_0_8px_rgba(247,183,29,0.5)]">
            ADMIN PANEL
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Kasinoku Management</p>
        </div>
        
        <nav className="flex-1 py-4 px-3 flex flex-col gap-2">
          <AdminNavLink href="/admin" icon={<LayoutDashboard />} label="Dashboard" isActive={location === "/admin"} />
          <AdminNavLink href="/admin/users" icon={<Users />} label="Manage Users" isActive={location === "/admin/users"} />
          <AdminNavLink href="/admin/transactions" icon={<ArrowLeftRight />} label="Transactions" isActive={location === "/admin/transactions"} />
          <div className="mt-auto">
            <Link href="/">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-card-border transition-colors font-medium mb-2">
                <span>Back to Site</span>
              </button>
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, label, isActive }: { href: string, icon: React.ReactNode, label: string, isActive: boolean }) {
  return (
    <Link href={href}>
      <button className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
        isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold" : "text-foreground hover:bg-card-border hover:text-primary"
      )}>
        {icon}
        {label}
      </button>
    </Link>
  );
}
