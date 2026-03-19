import { Layout } from "@/components/Layout";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const { mutate: login, isPending } = useLogin({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        setLocation("/user/profile");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message || "Invalid credentials",
        });
      }
    }
  });

  const onSubmit = (data: LoginForm) => {
    login({ data });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30 text-primary mb-4">
              <LogIn size={32} />
            </div>
            <h1 className="text-2xl font-display font-black text-primary">MASUK</h1>
            <p className="text-muted-foreground text-sm mt-1">Silahkan masuk ke akun Anda</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
              <input
                {...form.register("username")}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Masukkan username"
              />
              {form.formState.errors.username && (
                <p className="text-destructive text-xs mt-1">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
              <input
                type="password"
                {...form.register("password")}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Masukkan password"
              />
              {form.formState.errors.password && (
                <p className="text-destructive text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-yellow-500 text-black font-extrabold text-lg tracking-wide shadow-lg shadow-primary/25 hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {isPending ? "MEMPROSES..." : "MASUK"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
