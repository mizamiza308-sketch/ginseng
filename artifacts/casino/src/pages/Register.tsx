import { Layout } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

const registerSchema = z.object({
  username: z.string().min(4, "Username min 4 karakter"),
  password: z.string().min(6, "Password min 6 karakter"),
  confirmPassword: z.string(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().min(10, "Nomor HP tidak valid"),
  bankName: z.string().min(1, "Pilih Bank"),
  bankAccount: z.string().min(5, "Nomor Rekening tidak valid"),
  bankAccountName: z.string().min(3, "Nama Rekening tidak valid"),
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const BANK_OPTIONS = ["BCA", "BNI", "BRI", "MANDIRI", "CIMB", "DANA", "OVO", "GOPAY", "LINKAJA"];

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      bankName: "",
      bankAccount: "",
      bankAccountName: "",
      referralCode: "",
    }
  });

  const { mutate: register, isPending } = useRegister({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({
          title: "Pendaftaran Berhasil",
          description: "Selamat datang di Kasinoku!",
        });
        setLocation("/user/profile");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Pendaftaran Gagal",
          description: error.message || "Terjadi kesalahan sistem",
        });
      }
    }
  });

  const onSubmit = (data: RegisterForm) => {
    register({ data });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 py-8">
        <div className="w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary border border-primary/30 text-primary mb-4">
              <UserPlus size={32} />
            </div>
            <h1 className="text-2xl font-display font-black text-primary">DAFTAR AKUN</h1>
            <p className="text-muted-foreground text-sm mt-1">Isi data valid untuk keamanan transaksi</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Info Akun */}
            <div className="space-y-4 p-4 bg-background/50 rounded-xl border border-border">
              <h3 className="font-bold text-sm text-primary uppercase tracking-wider mb-2">Informasi Akun</h3>
              <div>
                <input {...form.register("username")} className="form-input" placeholder="Username" />
                {form.formState.errors.username && <p className="text-destructive text-xs mt-1">{form.formState.errors.username.message}</p>}
              </div>
              <div>
                <input type="password" {...form.register("password")} className="form-input" placeholder="Password" />
                {form.formState.errors.password && <p className="text-destructive text-xs mt-1">{form.formState.errors.password.message}</p>}
              </div>
              <div>
                <input type="password" {...form.register("confirmPassword")} className="form-input" placeholder="Konfirmasi Password" />
                {form.formState.errors.confirmPassword && <p className="text-destructive text-xs mt-1">{form.formState.errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Info Kontak */}
            <div className="space-y-4 p-4 bg-background/50 rounded-xl border border-border">
              <h3 className="font-bold text-sm text-primary uppercase tracking-wider mb-2">Informasi Kontak</h3>
              <div>
                <input {...form.register("phone")} className="form-input" placeholder="Nomor WhatsApp" />
                {form.formState.errors.phone && <p className="text-destructive text-xs mt-1">{form.formState.errors.phone.message}</p>}
              </div>
              <div>
                <input type="email" {...form.register("email")} className="form-input" placeholder="Email (Opsional)" />
                {form.formState.errors.email && <p className="text-destructive text-xs mt-1">{form.formState.errors.email.message}</p>}
              </div>
            </div>

            {/* Info Bank */}
            <div className="space-y-4 p-4 bg-background/50 rounded-xl border border-border">
              <h3 className="font-bold text-sm text-primary uppercase tracking-wider mb-2">Informasi Bank</h3>
              <div>
                <select {...form.register("bankName")} className="form-input text-muted-foreground">
                  <option value="">Pilih Bank / E-Wallet</option>
                  {BANK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                {form.formState.errors.bankName && <p className="text-destructive text-xs mt-1">{form.formState.errors.bankName.message}</p>}
              </div>
              <div>
                <input {...form.register("bankAccountName")} className="form-input uppercase" placeholder="Nama Rekening (Sesuai Buku Tabungan)" />
                {form.formState.errors.bankAccountName && <p className="text-destructive text-xs mt-1">{form.formState.errors.bankAccountName.message}</p>}
              </div>
              <div>
                <input {...form.register("bankAccount")} className="form-input" placeholder="Nomor Rekening" />
                {form.formState.errors.bankAccount && <p className="text-destructive text-xs mt-1">{form.formState.errors.bankAccount.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-yellow-500 text-black font-extrabold text-lg tracking-wide shadow-lg shadow-primary/25 hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {isPending ? "MEMPROSES..." : "DAFTAR SEKARANG"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Masuk disini
            </Link>
          </p>
        </div>
      </div>
      
      {/* Global CSS for form inputs in this page */}
      <style dangerouslySetInnerHTML={{__html: `
        .form-input {
          width: 100%;
          background-color: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: hsl(var(--foreground));
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 1px hsl(var(--primary));
        }
      `}} />
    </Layout>
  );
}
