import { AdminLayout } from "@/components/AdminLayout";
import { useAdminGetTransactions, useAdminUpdateTransactionStatus, getAdminGetTransactionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency, cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminTransactions() {
  const { data: txData, isLoading } = useAdminGetTransactions();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateStatus = useAdminUpdateTransactionStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminGetTransactionsQueryKey() });
        toast({ title: "Transaction processed successfully" });
      }
    }
  });

  const handleProcess = (id: number, status: 'approved' | 'rejected') => {
    if (confirm(`Are you sure you want to mark this as ${status}?`)) {
      updateStatus.mutate({ id, data: { status } });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-display text-foreground">Transactions</h2>

        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-background text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">ID / Date</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Method / Bank</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading && <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>}
                
                {txData?.transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 text-xs">
                      <span className="font-mono text-muted-foreground">#{tx.id}</span><br/>
                      {format(new Date(tx.createdAt), 'dd MMM yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 font-bold">{tx.username}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-bold uppercase",
                        tx.type === 'deposit' ? "bg-blue-500/20 text-blue-500 border border-blue-500/30" : "bg-purple-500/20 text-purple-500 border border-purple-500/30"
                      )}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-primary">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {tx.type === 'deposit' ? (
                        <>To: {tx.paymentMethod}</>
                      ) : (
                        <>To: {tx.bankName} - {tx.bankAccount}<br/>a.n {tx.bankAccountName}</>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-bold",
                        tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        tx.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                        'bg-red-500/20 text-red-500'
                      )}>
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleProcess(tx.id, 'approved')}
                            disabled={updateStatus.isPending}
                            className="p-1.5 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white rounded transition-colors"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleProcess(tx.id, 'rejected')}
                            disabled={updateStatus.isPending}
                            className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
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
