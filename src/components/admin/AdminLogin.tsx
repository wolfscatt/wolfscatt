import { useState } from "react";
import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Giris yapilirken beklenmeyen bir hata olustu.";
}

export function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { error } = await signIn(email, password);

    if (error) {
      setErrorMessage(getErrorMessage(error));
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-[-5%] h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden lg:block">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
                <ShieldCheck className="h-4 w-4" />
                Wolfscatt Admin Access
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight text-glow md:text-5xl">
                  Products dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Supabase ile kimlik dogrulamasi yapan, sadece yetkili admin hesaplarina acik
                  urun yonetim paneli.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="glass-morphism rounded-2xl p-5">
                  <p className="text-sm font-medium text-foreground">Guvenli giris</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Sadece Auth kaydi olan ve `admins` tablosunda tanimli hesaplar erisebilir.
                  </p>
                </div>
                <div className="glass-morphism rounded-2xl p-5">
                  <p className="text-sm font-medium text-foreground">Canli urun yonetimi</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ekleme, duzenleme ve silme islemleri dogrudan `products` tablosuna yansir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="glass-morphism border-primary/20 shadow-[0_0_40px_rgba(0,255,255,0.08)]">
            <CardHeader className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <CardTitle>Admin girisi</CardTitle>
                <CardDescription>
                  Yetkili admin e-posta ve sifrenizle giris yapin.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@wolfscatt.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>

                {errorMessage ? (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {errorMessage}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Giris yap
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
