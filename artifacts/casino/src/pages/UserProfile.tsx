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
      {/* BANK */}
      <div className="px-4 mt-6 text-white">
        <h2 className="mb-3 text-sm opacity-80">
          Bekerja sama dengan BANK :
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {[
            "https://i.postimg.cc/pd1YQ0S7/ECsu-LWSup-Zten10M.png",
            "https://i.postimg.cc/Nf76CGVR/3am-RHJF8Ew-KSBVe2.png",
            "https://i.postimg.cc/hGwTQXzg/LKZNDc-Lk-KUZs-Yo-UV.png",
            "https://i.postimg.cc/gjyZ74Mx/we-Gvms-Nb-B6gwaoi-M.png",
            "https://i.postimg.cc/L8QZGJVv/r-VEHdclx-Lbl-S93Id.png",
            "https://i.postimg.cc/qRyhtjHb/L2opavb-Hl-As-Acnn-Y.png",
            "https://i.postimg.cc/tRdnpS5y/Kj2HNqebh-Gs-Xn-K2C.png",
            "https://i.postimg.cc/fRPJB6zz/Be-CJaz-G7PUn-DPE8I.png",
            "https://i.postimg.cc/MHzTnwDx/Lsi-Fq-FJz-Je-GLz7Jr.png",
            "https://i.postimg.cc/Y2x0J4rY/a-Hag8AI2fxg-VHy-Mp.png",
            "https://i.postimg.cc/9fTF10gW/2Bdt-Jpi-YQs-Tj-Ah-Si.png",
            "https://i.postimg.cc/XNxNsTLQ/pzj-Mm-Pq-Lq-Jo-B4Gxm.png",
          ].map((item, i) => (
            <div
              key={i}
              className="border border-yellow-500 rounded-lg p-2 bg-[#0b3d2e]"
            >
              <img
                src={item}
                className="h-8 mx-auto object-contain"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/50")
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* PROVIDER */}
      <div className="px-4 mt-6 text-white">
        <h2 className="mb-3 text-sm opacity-80">
          Bekerja sama dengan PROVIDER :
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {[
            "https://i.postimg.cc/MpFs6KDy/h-P4ua-W1j9K2Aly-Vv.png",
            "https://i.postimg.cc/Ghk83MxT/w9D4o4h-XE6Ffxkct.png",
            "https://i.postimg.cc/tTKJpP1k/Qn9ydbba5HAHVpqt.png",
            "https://i.postimg.cc/JzrnrRh9/STgyif-Wgfx-ZX8Xdd.png",
            "https://i.postimg.cc/QtTN4t6J/7Ny-F4s7q-BEf-Zdz-Yv.png",
            "https://i.postimg.cc/wT0zkL6L/4qva-CEy-Po-RKn-So-RK.png",
            "https://i.postimg.cc/VvzyqLpT/q-Vj2pc4tq5j-NTETa.png",
            "https://i.postimg.cc/T3FZkcBH/2bx-Uoi-MZi-TUWITao.png",
            "https://i.postimg.cc/HWzFGmfX/o-RI9UH3Pqlr-Vdkrc.png",
            "https://i.postimg.cc/mDRpqpj9/PCIJf-HBob-XU23DYh.png",
            "https://i.postimg.cc/vB3hKYcm/q-KNOBHGMC3Wg7d-UY-(2).png",
            "https://i.postimg.cc/bNGg6jPK/z3JBu-C9gd-C8YRGi5.png",
            "https://i.postimg.cc/9MFtZ6JV/Ox-RGZisx-Bcq-Aj8e-M.png",
            "https://i.postimg.cc/440bHFc1/NQLOXa-Cr-M298Sx-MK.png",

"https://i.postimg.cc/Kvd6fN6q/Pc-M0ND3RJmz-Owky-M.png",
      "https://i.postimg.cc/tTSfxtdt/gmmom-Xzs-Knwrcf-OJ.png",
      "https://i.postimg.cc/g2F780hS/TS5Hs0Er3b-KNf1Gm.png",
      "https://i.postimg.cc/PqKVgzR4/fn-DYsk-KRs-M11p1Uf.png",
      "https://i.postimg.cc/kgskCmVh/JMWGAw-RJou-C2hm-H6.png",
      "https://i.postimg.cc/MTM41fs8/Yp-Mis-Nvksb-UZnl9M.png",
      "https://i.postimg.cc/h4m6jxzc/4Q4HAv8VBYl-UHAj-Z.png",
          ].map((item, i) => (
            <div
              key={i}
              className="border border-yellow-500 rounded-lg p-1 bg-[#0b3d2e]"
            >
              <img
                src={item}
                className="h-8 mx-auto object-contain"
                onError={(e) =>
                  (e.currentTarget.src = "https://via.placeholder.com/50")
                }
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
