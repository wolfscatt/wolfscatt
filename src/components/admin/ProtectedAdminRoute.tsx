import { Link } from "react-router-dom";
import { Home, Loader2, LogOut, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

import { useAuth } from "@/hooks/useAuth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading, signOut, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10">
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center justify-center">
          <Card className="glass-morphism w-full border-destructive/30">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <CardTitle>Erisim reddedildi</CardTitle>
              <CardDescription>
                {user.email} hesabi giris yapti ancak `admins` tablosunda tanimli olmadigi icin
                admin panelini goruntuleyemiyor.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline" className="border-border">
                <Link to="/">
                  <Home className="h-4 w-4" />
                  Ana sayfaya don
                </Link>
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  void signOut();
                }}
              >
                <LogOut className="h-4 w-4" />
                Cikis yap
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
