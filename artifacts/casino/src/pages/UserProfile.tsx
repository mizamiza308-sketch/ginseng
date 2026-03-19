import { Layout } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { useGetUserProfile } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Clock, ShieldCheck, Gamepad2 } from "lucide-react";

export default function UserProfile() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading, error } = useGetUserProfile({ 
    query: { retry: false } 
  });

  if (error) {
    setLocation("/login");
    return null;
  }

  if (isLoading || !profile) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#0d4a26] to-[#041a0d] border border-primary/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-primary">
            <Wallet size={120} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-sm font-bold text-primary mb-1">SALDO UTAMA</h2>
            <p className="font-display font-black text-4xl tracking-tight text-white mb-6">
              {formatCurrency(profile.balance)}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Link href="/user/deposit">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-yellow-500 text-black font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                  <ArrowDownCircle size={18} />
                  DEPOSIT
                </button>
              </Link>
              <Link href="/user/withdraw">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-card border border-primary/50 text-primary font-bold rounded-xl hover:bg-primary/10 transition-all">
                  <ArrowUpCircle size={18} />
                  WITHDRAW
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <ShieldCheck className="text-primary" size={20} />
            <h3 className="font-bold">Informasi Profil</h3>
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Username</span>
              <span className="font-bold">{profile.username}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Bank</span>
              <span className="font-bold text-primary">{profile.bankName}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">No Rekening</span>
              <span className="font-bold font-mono">***{profile.bankAccount?.slice(-4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nama Rekening</span>
              <span className="font-bold uppercase">{profile.bankAccountName}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border p-4 rounded-xl text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Deposit</p>
            <p className="font-bold text-success">{formatCurrency(profile.totalDeposit || 0)}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl text-center">
            <p className="text-xs text-muted-foreground mb-1">Total Withdraw</p>
            <p className="font-bold text-destructive">{formatCurrency(profile.totalWithdraw || 0)}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/">
            <div className="bg-secondary/50 border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary transition-colors text-center h-24">
              <Gamepad2 className="text-primary" size={24} />
              <span className="text-sm font-bold">Main Bermain</span>
            </div>
          </Link>
          <div className="bg-secondary/50 border border-border p-4 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary transition-colors text-center h-24">
            <Clock className="text-primary" size={24} />
            <span className="text-sm font-bold">Riwayat</span>
          </div>
        </div>

      </div>
    </Layout>
  );
}
