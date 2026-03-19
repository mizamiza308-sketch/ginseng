import { Link, useLocation } from "wouter";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Home, 
  Gamepad2, 
  UserCircle, 
  Gift, 
  MessageSquare,
  Menu,
  Wallet,
  LogOut
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: user, isLoading } = useGetMe({ query: { retry: false } });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    // In a real app, we'd call useLogout mutation here.
    // Assuming backend clears cookie.
    await fetch('/api/auth/logout', { method: 'POST' });
    queryClient.setQueryData(getGetMeQueryKey(), null);
    setLocation('/');
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display font-black text-2xl tracking-wider text-primary drop-shadow-[0_0_8px_rgba(247,183,29,0.5)]">
              KASINOKU
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!isLoading && user ? (
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">Saldo Anda</span>
                <span className="font-bold text-primary font-display">{formatCurrency(user.balance)}</span>
              </div>
            ) : null}
            
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-foreground hover:text-primary transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border pb-safe">
        <div className="max-w-7xl mx-auto px-2 flex justify-between items-center h-16">
          <NavItem 
            href="/" 
            icon={<Home size={22} />} 
            label="Beranda" 
            isActive={location === "/"} 
          />
          <NavItem 
            href="/rtp" 
            icon={<Gamepad2 size={22} />} 
            label="RTP" 
            isActive={location === "/rtp"} 
          />
          <NavItem 
            href={user ? "/user/profile" : "/login"} 
            icon={<UserCircle size={22} />} 
            label={user ? "Profil" : "Masuk"} 
            isActive={location.startsWith("/user") || location === "/login"} 
            highlight
          />
          <NavItem 
            href="/promo" 
            icon={<Gift size={22} />} 
            label="Promo" 
            isActive={location === "/promo"} 
          />
          <NavItem 
            href="/contact" 
            icon={<MessageSquare size={22} />} 
            label="Hubungi" 
            isActive={location === "/contact"} 
          />
        </div>
      </nav>

      {/* Side Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-card z-50 shadow-2xl border-l border-border flex flex-col"
            >
              <div className="p-6 border-b border-border bg-background/50">
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border border-primary/50">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{user.username}</p>
                      <p className="text-sm text-primary font-mono">{formatCurrency(user.balance)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <h3 className="font-display text-xl font-bold text-primary mb-4">KASINOKU</h3>
                    <div className="flex flex-col gap-2">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full py-2 rounded bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all">MASUK</button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full py-2 rounded bg-secondary text-primary font-bold border border-primary/30 hover:bg-secondary/80 transition-all">DAFTAR</button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {user && (
                  <>
                    <MenuLink href="/user/profile" icon={<UserCircle />} label="Akun Saya" onClick={() => setIsMenuOpen(false)} />
                    <MenuLink href="/user/deposit" icon={<Wallet />} label="Deposit" onClick={() => setIsMenuOpen(false)} />
                    <MenuLink href="/user/withdraw" icon={<Wallet />} label="Withdraw" onClick={() => setIsMenuOpen(false)} />
                    
                    {user.role === 'admin' && (
                      <MenuLink href="/admin" icon={<Gamepad2 />} label="Admin Panel" onClick={() => setIsMenuOpen(false)} />
                    )}
                    
                    <div className="my-4 border-t border-border" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors font-medium"
                    >
                      <LogOut size={20} />
                      <span>Keluar</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ href, icon, label, isActive, highlight }: { href: string, icon: React.ReactNode, label: string, isActive: boolean, highlight?: boolean }) {
  return (
    <Link href={href}>
      <button className="flex flex-col items-center justify-center w-full px-1 py-1 group">
        <div className={cn(
          "p-2 rounded-xl transition-all duration-300",
          highlight ? "bg-gradient-to-tr from-primary to-yellow-300 text-black shadow-lg shadow-primary/30 -translate-y-2" : "",
          isActive && !highlight ? "text-primary bg-primary/10" : "",
          !isActive && !highlight ? "text-muted-foreground hover:text-foreground" : ""
        )}>
          {icon}
        </div>
        <span className={cn(
          "text-[10px] font-medium mt-1 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground",
          highlight ? "text-primary font-bold" : ""
        )}>
          {label}
        </span>
      </button>
    </Link>
  );
}

function MenuLink({ href, icon, label, onClick }: { href: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link href={href} onClick={onClick}>
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
        isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-foreground hover:bg-card-border"
      )}>
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}
