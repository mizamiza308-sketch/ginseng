import { Layout } from "@/components/Layout";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateDeposit, useGetTransactions, getGetTransactionsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, cn } from "@/lib/utils";
import { format } from "date-fns";
import { Wallet } from "lucide-react";

const depositSchema = z.object({
  amount: z.coerce.number().min(10000, "Minimal deposit Rp 10.000"),
  paymentMethod: z.string().min(1, "Pilih metode pembayaran"),
  promoCode: z.string().optional(),
});

type DepositForm = z.infer<typeof depositSchema>;

export default function Deposit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: history } = useGetTransactions({ type: 'deposit', limit: 5 });

  const form = useForm<DepositForm>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 10000,
      paymentMethod: "",
      promoCode: "",
    }
  });

  const { mutate: deposit, isPending } = useCreateDeposit({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTransactionsQueryKey() });
        toast({
          title: "Permintaan Deposit Berhasil",
          description: "Silakan transfer dan tunggu konfirmasi admin.",
        });
        form.reset({ amount: 10000, paymentMethod: "", promoCode: "" });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Gagal",
          description: error.message || "Terjadi kesalahan sistem",
        });
      }
    }
  });

  const onSubmit = (data: DepositForm) => {
    deposit({ data });
  };

  const quickAmounts = [10000, 50000, 100000, 500000, 1000000];

  return (
    <Layout>
      <div className="p-4 space-y-6 max-w-lg mx-auto">
        <div className="text-center py-4">
          <h1 className="text-2xl font-display font-black text-primary">FORM DEPOSIT</h1>
          <p className="text-sm text-muted-foreground mt-1">Minimal deposit IDR 10,000</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">Tujuan Transfer</label>
              <select {...form.register("paymentMethod")} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option value="">Pilih Tujuan (Bank/E-Wallet)</option>
                <option value="BCA - 1234567890 (Ryamiza agusta)">BCA - 1234567890 (Ryamiza agusta)</option>
                <option value="MANDIRI - 0987654321 (Ryamiza agusta)">MANDIRI - 0987654321 (Ryamiza agusta)</option>
                <option value="DANA - 08123456789 (Ryamiza agusta)">DANA - 08123456789 (Ryamiza agusta)</option>
              </select>
              {form.formState.errors.paymentMethod && <p className="text-destructive text-xs mt-1">{form.formState.errors.paymentMethod.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">Jumlah Deposit</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-muted-foreground font-bold">Rp</span>
                <input 
                  type="number" 
                  {...form.register("amount")} 
                  className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg font-bold font-mono" 
                />
              </div>
              {form.formState.errors.amount && <p className="text-destructive text-xs mt-1">{form.formState.errors.amount.message}</p>}
              
              <div className="grid grid-cols-5 gap-2 mt-3">
                {quickAmounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => form.setValue('amount', amt, { shouldValidate: true })}
                    className="py-2 text-[10px] sm:text-xs font-bold bg-secondary hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition-colors"
                  >
                    {amt / 1000}K
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-2">Kode Promo (Opsional)</label>
              <input 
                {...form.register("promoCode")} 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all uppercase" 
                placeholder="Cth: NEW100"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-yellow-500 text-black font-extrabold text-lg tracking-wide shadow-lg shadow-primary/25 hover:brightness-110 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
            >
              <Wallet size={20} />
              {isPending ? "MEMPROSES..." : "KIRIM DEPOSIT"}
            </button>
          </form>
        </div>

        {/* History */}
        {history && history.transactions.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden mt-8">
            <div className="p-4 border-b border-border bg-background/50">
              <h3 className="font-bold text-sm">Riwayat Deposit Terakhir</h3>
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
