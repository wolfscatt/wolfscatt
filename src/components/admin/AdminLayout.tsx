import { LogOut, PackageSearch, Shield } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AdminLayoutProps = {
  children: ReactNode;
  totalProducts: number;
  userEmail?: string;
  onLogout: () => void | Promise<void>;
  isLoggingOut?: boolean;
};

export function AdminLayout({
  children,
  totalProducts,
  userEmail,
  onLogout,
  isLoggingOut = false,
}: AdminLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute left-10 top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="glass-morphism mb-6 rounded-3xl border-primary/20 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-primary">
                <Shield className="h-3.5 w-3.5" />
                Admin Panel
              </div>
              <div>
                <h1 className="text-3xl font-bold text-glow sm:text-4xl">Products dashboard</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                  Urunlerinizi tek yerden yonetin, Supabase ile senkron kalin ve yayinlanan
                  sayfa verilerini kontrollu sekilde guncelleyin.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Card className="border-primary/20 bg-background/60">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <PackageSearch className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Toplam urun
                    </p>
                    <p className="text-2xl font-semibold">{totalProducts}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/50 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Aktif hesap
                  </p>
                  <p className="truncate text-sm font-medium">{userEmail ?? "Admin"}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary/20 bg-background/70"
                  onClick={onLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4" />
                  Cikis
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
