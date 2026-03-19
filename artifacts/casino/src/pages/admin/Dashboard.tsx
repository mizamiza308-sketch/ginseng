import { AdminLayout } from "@/components/AdminLayout";
import { useAdminGetUsers, useAdminGetTransactions } from "@workspace/api-client-react";
import { Users, Wallet, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const { data: usersData } = useAdminGetUsers();
  const { data: txData } = useAdminGetTransactions();

  const totalUsers = usersData?.total || 0;
  
  const deposits = txData?.transactions.filter(t => t.type === 'deposit' && t.status === 'approved') || [];
  const totalDeposit = deposits.reduce((acc, t) => acc + t.amount, 0);
  
  const withdraws = txData?.transactions.filter(t => t.type === 'withdraw' && t.status === 'approved') || [];
  const totalWithdraw = withdraws.reduce((acc, t) => acc + t.amount, 0);

  const pendingTx = txData?.transactions.filter(t => t.status === 'pending').length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back, Admin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Users" 
            value={totalUsers.toString()} 
            icon={<Users size={24} className="text-blue-500" />} 
          />
          <StatCard 
            title="Total Deposit (Approved)" 
            value={formatCurrency(totalDeposit)} 
            icon={<ArrowDownRight size={24} className="text-green-500" />} 
          />
          <StatCard 
            title="Total Withdraw (Approved)" 
            value={formatCurrency(totalWithdraw)} 
            icon={<ArrowUpRight size={24} className="text-red-500" />} 
          />
          <StatCard 
            title="Pending Transactions" 
            value={pendingTx.toString()} 
            icon={<Wallet size={24} className="text-yellow-500" />} 
            highlight={pendingTx > 0}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, highlight }: { title: string, value: string, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`bg-card p-6 rounded-2xl border ${highlight ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-border shadow-lg'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-background rounded-lg border border-border">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
