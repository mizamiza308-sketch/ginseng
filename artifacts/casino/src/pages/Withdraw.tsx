import { Layout } from "@/components/Layout";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateWithdraw, useGetTransactions, useGetUserProfile, getGetTransactionsQueryKey, getGetUserProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowUpCircle, Info } from "lucide-react";

const withdrawSchema = z.object({
  amount: z.coerce.number().min(50000, "Minimal withdraw Rp 50.000"),
});

type WithdrawForm = z.infer<typeof withdrawSchema>;

export default function Withdraw() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile } = useGetUserProfile();
  const { data: history } = useGetTransactions({ type: 'withdraw', limit: 5 });

  const form = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: 50000,
    }
  });

  const { mutate: withdraw, isPending } = useCreateWithdraw({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTransactionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetUserProfileQueryKey() });
        toast({
          title: "Permintaan Withdraw Berhasil",
          description: "Dana akan segera ditransfer ke rekening Anda.",
        });
        form.reset({ amount: 50000 });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Gagal",
          description: error.message || "Saldo tidak mencukupi atau terjadi kesalahan.",
        });
      }
    }
  });

  const onSubmit = (data: WithdrawForm) => {
    withdraw({ data });
  };

  return (
    <Layout>
      <div className="p-4 space-y-6 max-w-lg mx-auto">
        <div className="text-center py-4">
          <h1 className="text-2xl font-display font-black text-primary">FORM WITHDRAW</h1>
          <p className="text-sm text-muted-foreground mt-1">Minimal penarikan IDR 50,000</p>
        </div>

        {profile && (
          <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex items-start gap-3 mb-6 text-sm">
            <Info className="text-primary shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-primary font-bold mb-1">Saldo Tersedia: {formatCurrency(profile.balance)}</p>
              <p className="text-muted-foreground">Dana akan ditarik ke rekening terdaftar Anda: <br/> <strong>{profile.bankName} - {profile.bankAccount}</strong> a.n <strong>{profile.bankAccountName}</strong></p>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">Jumlah Penarikan</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-muted-foreground font-bold">Rp</span>
                <input 
                  type="number" 
                  {...form.register("amount")} 
                  className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg font-bold font-mono" 
                />
              </div>
              {form.formState.errors.amount && <p className="text-destructive text-xs mt-1">{form.formState.errors.amount.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 rounded-xl bg-card border border-primary/50 text-primary font-extrabold text-lg tracking-wide hover:bg-primary/10 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
            >
              <ArrowUpCircle size={20} />
              {isPending ? "MEMPROSES..." : "TARIK DANA"}
            </button>
          </form>
        </div>

        {/* History */}
        {history && history.transactions.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden mt-8">
            <div className="p-4 border-b border-border bg-background/50">
              <h3 className="font-bold text-sm">Riwayat Withdraw Terakhir</h3>
            </div>
            <div className="divide-y divide-border">
              {history.transactions.map(tx => (
                <div key={tx.id} className="p-4 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-foreground">{formatCurrency(tx.amount)}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), 'dd MMM yyyy HH:mm')}</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-bold",
                    tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                    tx.status === 'approved' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                    'bg-red-500/20 text-red-500 border border-red-500/30'
                  )}>
                    {tx.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
