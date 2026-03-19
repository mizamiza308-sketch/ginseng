import { AdminLayout } from "@/components/AdminLayout";
import { useAdminGetUsers, useAdminUpdateUserBalance, useAdminUpdateUserStatus, getAdminGetUsersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { format } from "date-fns";
import { Edit2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const { data: usersData, isLoading } = useAdminGetUsers();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState("");

  const updateBalance = useAdminUpdateUserBalance({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey() });
        setEditingUserId(null);
        toast({ title: "Balance updated" });
      }
    }
  });

  const updateStatus = useAdminUpdateUserStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminGetUsersQueryKey() });
        toast({ title: "Status updated" });
      }
    }
  });

  const handleSaveBalance = (id: number) => {
    const balance = parseInt(newBalance, 10);
    if (isNaN(balance)) return;
    updateBalance.mutate({ id, data: { balance } });
  };

  const toggleStatus = (id: number, currentStatus: string) => {
    const status = currentStatus === 'active' ? 'suspended' : 'active';
    updateStatus.mutate({ id, data: { status } });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-display text-foreground">User Management</h2>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Username</th>
                  <th className="px-6 py-4 font-medium">Bank Info</th>
                  <th className="px-6 py-4 font-medium">Balance</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading && <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>}
                
                {usersData?.users.map(user => (
                  <tr key={user.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 font-mono">{user.id}</td>
                    <td className="px-6 py-4 font-bold">{user.username} <br/><span className="text-xs font-normal text-muted-foreground">{user.phone}</span></td>
                    <td className="px-6 py-4">
                      {user.bankName} - {user.bankAccount}
                      <br/><span className="text-xs text-muted-foreground">{user.bankAccountName}</span>
                    </td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                            className="bg-background border border-border rounded px-2 py-1 w-24 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                          />
                          <button 
                            onClick={() => handleSaveBalance(user.id)}
                            disabled={updateBalance.isPending}
                            className="text-xs bg-primary text-black px-2 py-1 rounded font-bold"
                          >
                            Save
                          </button>
                          <button onClick={() => setEditingUserId(null)} className="text-xs text-muted-foreground">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-primary font-bold">{formatCurrency(user.balance)}</span>
                          <button 
                            onClick={() => { setEditingUserId(user.id); setNewBalance(user.balance.toString()); }}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-bold",
                        user.status === 'active' ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                      )}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {format(new Date(user.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleStatus(user.id, user.status)}
                        disabled={updateStatus.isPending || user.role === 'admin'}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
                        title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                      >
                        <ShieldAlert size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
