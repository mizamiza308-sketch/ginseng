import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Volume2, Trophy, Flame, ChevronRight, Play } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  const { data: user } = useGetMe({ query: { retry: false } });
  
  // Fake jackpot counter effect
  const [jackpot, setJackpot] = useState(2780859860.79);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + (Math.random() * 5000));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Ticker */}
      <div className="bg-card border-b border-border py-2 px-4 flex items-center gap-2 overflow-hidden">
        <Volume2 size={16} className="text-primary shrink-0" />
        <div className="relative flex-1 overflow-hidden whitespace-nowrap text-sm text-muted-foreground">
          <div className="inline-block animate-marquee">
            Selamat datang di KASINOKU! Situs judi online terpercaya di Indonesia. Nikmati bonus new member 100% dan event freespin menarik setiap harinya!
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        
        {/* Auth / Action Buttons */}
        {!user ? (
          <div className="grid grid-cols-2 gap-3">
            <Link href="/login">
              <button className="w-full py-3 rounded-xl bg-card border border-primary/50 text-primary font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(247,183,29,0.15)] hover:bg-primary/10 transition-all">
                MASUK
              </button>
            </Link>
            <Link href="/register">
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-yellow-500 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-primary/25 hover:brightness-110 transition-all">
                DAFTAR
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Link href="/user/deposit">
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-yellow-500 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-primary/25 hover:brightness-110 transition-all">
                DEPOSIT
              </button>
            </Link>
            <Link href="/user/withdraw">
              <button className="w-full py-3 rounded-xl bg-card border border-primary/50 text-primary font-bold text-sm tracking-wide hover:bg-primary/10 transition-all">
                WITHDRAW
              </button>
            </Link>
          </div>
        )}

        {/* Hero Banner */}
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-border">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-banner.png`} 
            alt="Promo Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold border border-primary/50 mb-1 backdrop-blur-sm">PROMO SPESIAL</span>
              <h2 className="text-xl font-display font-black text-white drop-shadow-md">BONUS NEW MEMBER 100%</h2>
            </div>
            <button className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center hover:scale-110 transition-transform">
              <Play fill="currentColor" size={16} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Jackpot Counter */}
        <motion.div 
          className="bg-gradient-to-br from-card to-background border border-primary/30 rounded-2xl p-4 text-center shadow-[0_0_20px_rgba(247,183,29,0.1)] relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
          <div className="flex items-center justify-center gap-2 mb-1 relative z-10">
            <Trophy className="text-primary" size={18} />
            <h3 className="font-display font-bold text-sm tracking-widest text-primary">JACKPOT PROGRESIF</h3>
            <Trophy className="text-primary" size={18} />
          </div>
          <div className="font-mono font-black text-2xl md:text-4xl text-white tracking-wider relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(jackpot)}
          </div>
        </motion.div>

        {/* Categories */}
        <div className="grid grid-cols-4 gap-3">
          <CategoryBtn icon="🎰" label="SLOT" />
          <CategoryBtn icon="📝" label="TOGEL" />
          <CategoryBtn icon="🃏" label="CASINO" />
          <CategoryBtn icon="⚽" label="SPORT" />
        </div>

        {/* Hot Games */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="text-orange-500" size={20} />
              <h3 className="font-display font-bold text-lg">HOT GAMES</h3>
            </div>
            <button className="text-xs text-primary flex items-center hover:underline">
              Lihat Semua <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <GameCard 
              name="Gates of Olympus" 
              provider="Pragmatic Play" 
              image="https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=500&h=500&fit=crop" 
              rtp="98.5%"
            />
            <GameCard 
              name="Mahjong Ways 2" 
              provider="PG Soft" 
              image="https://images.unsplash.com/photo-1605870445919-838d190e8e1b?w=500&h=500&fit=crop" 
              rtp="97.2%"
            />
            <GameCard 
              name="Sweet Bonanza" 
              provider="Pragmatic Play" 
              image="https://images.unsplash.com/photo-1620800632517-578d0f1bd9a6?w=500&h=500&fit=crop" 
              rtp="96.8%"
            />
            <GameCard 
              name="Starlight Princess" 
              provider="Pragmatic Play" 
              image="https://images.unsplash.com/photo-1518779910543-b186b8c9c03b?w=500&h=500&fit=crop" 
              rtp="95.5%"
            />
          </div>
        </div>

      </div>
    </Layout>
  );
}

function CategoryBtn({ icon, label }: { icon: string, label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 p-3 bg-card border border-border rounded-2xl hover:border-primary/50 hover:bg-card/80 transition-all group">
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">{label}</span>
    </button>
  );
}

function GameCard({ name, provider, image, rtp }: { name: string, provider: string, image: string, rtp: string }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden group cursor-pointer hover:border-primary transition-colors">
      <div className="relative aspect-square">
        {/* Game thumbnail slot machine graphics */}
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur text-primary text-[10px] font-bold rounded border border-primary/30">
          RTP {rtp}
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
            <Play fill="currentColor" size={16} className="ml-1" />
          </button>
        </div>
      </div>
      <div className="p-2">
        <p className="text-xs text-muted-foreground">{provider}</p>
        <p className="text-sm font-bold truncate">{name}</p>
      </div>
    </div>
  );
}
