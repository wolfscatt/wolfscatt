import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Plus, RefreshCw, Sparkles } from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  ProductForm,
  type ProductFormSubmitPayload,
  type ProductFormValues,
} from "@/components/admin/ProductForm";
import { ProductTable } from "@/components/admin/ProductTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { getProductStorageBucket, uploadProductFile } from "@/lib/storage";

type Product = Tables<"products">;

function formatSupabaseError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function sanitizePayload(values: ProductFormValues): TablesInsert<"products"> {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: values.description.trim(),
    apk_url: values.apk_url.trim() || null,
    pdf_url: values.pdf_url.trim() || null,
    whatsapp_phone: values.whatsapp_phone.trim() || null,
    screenshot_urls: values.screenshot_urls.map((url) => url.trim()).filter(Boolean),
  };
}

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { signOut, user } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const {
    data: products = [],
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error: queryError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) {
        throw queryError;
      }

      return data as Product[];
    },
  });

  const saveProductMutation = useMutation({
    mutationFn: async ({ files, values }: ProductFormSubmitPayload) => {
      const nextValues = { ...values };
      const slug = nextValues.slug.trim();

      if (files.apkFile && !nextValues.apk_url.trim()) {
        nextValues.apk_url = await uploadProductFile({
          file: files.apkFile,
          kind: "apk",
          slug,
        });
      }

      if (files.pdfFile) {
        nextValues.pdf_url = await uploadProductFile({
          file: files.pdfFile,
          kind: "pdf",
          slug,
        });
      }

      if (files.screenshotFiles.length > 0) {
        const uploadedScreenshotUrls = await Promise.all(
          files.screenshotFiles.map((file) =>
            uploadProductFile({
              file,
              kind: "screenshot",
              slug,
            }),
          ),
        );

        nextValues.screenshot_urls = [...nextValues.screenshot_urls, ...uploadedScreenshotUrls];
      }

      const payload = sanitizePayload(nextValues);

      if (editingProduct) {
        const updatePayload: TablesUpdate<"products"> = payload;
        const { error } = await supabase
          .from("products")
          .update(updatePayload)
          .eq("id", editingProduct.id);

        if (error) {
          throw error;
        }

        return { mode: "edit" as const };
      }

      const { error } = await supabase.from("products").insert(payload);

      if (error) {
        throw error;
      }

      return { mode: "create" as const };
    },
    onSuccess: async ({ mode }) => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setFormOpen(false);
      setEditingProduct(null);

      toast({
        title: mode === "create" ? "Urun eklendi" : "Urun guncellendi",
        description:
          mode === "create"
            ? "Yeni product kaydi basariyla olusturuldu."
            : "Product bilgileri basariyla kaydedildi.",
      });
    },
    onError: (mutationError) => {
      toast({
        title: "Islem basarisiz",
        description: formatSupabaseError(
          mutationError,
          "Product kaydi sirasinda bir hata olustu.",
        ),
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { error } = await supabase.from("products").delete().eq("id", product.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({
        title: "Urun silindi",
        description: "Secilen product kaydi Supabase uzerinden kaldirildi.",
      });
      setProductToDelete(null);
    },
    onError: (mutationError) => {
      toast({
        title: "Silme islemi basarisiz",
        description: formatSupabaseError(
          mutationError,
          "Product silinirken bir hata olustu.",
        ),
        variant: "destructive",
      });
    },
  });

  const stats = useMemo(() => ({
    withApk: products.filter((product) => Boolean(product.apk_url)).length,
    withPdf: products.filter((product) => Boolean(product.pdf_url)).length,
    screenshots: products.reduce((count, product) => count + product.screenshot_urls.length, 0),
  }), [products]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const { error } = await signOut();

    if (error) {
      toast({
        title: "Cikis yapilamadi",
        description: formatSupabaseError(error, "Oturum kapatilirken bir hata olustu."),
        variant: "destructive",
      });
    }

    setIsLoggingOut(false);
  };

  return (
    <AdminLayout
      totalProducts={products.length}
      userEmail={user?.email}
      onLogout={() => {
        void handleLogout();
      }}
      isLoggingOut={isLoggingOut}
    >
      <div className="space-y-6">
        <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <Card className="border-primary/15 bg-card/80">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Product manager</span>
                </div>
                <CardTitle>Urun listesini yonetin</CardTitle>
                <CardDescription>
                  Urun bilgilerini yonetin; APK, PDF ve screenshot dosyalarini dogrudan
                  Supabase Storage&apos;a yukleyin.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary/20"
                  onClick={() => {
                    void refetch();
                  }}
                  disabled={isFetching}
                >
                  {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Yenile
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setFormOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Yeni urun
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <Card className="border-primary/15 bg-card/80">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  APK bulunan
                </p>
                <p className="mt-2 text-3xl font-semibold">{stats.withApk}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/15 bg-card/80">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  PDF bulunan
                </p>
                <p className="mt-2 text-3xl font-semibold">{stats.withPdf}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/15 bg-card/80">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Toplam screenshot
                </p>
                <p className="mt-2 text-3xl font-semibold">{stats.screenshots}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          {isLoading ? (
            <div className="grid gap-4">
              <Skeleton className="h-24 rounded-3xl" />
              <Skeleton className="h-24 rounded-3xl" />
              <Skeleton className="h-24 rounded-3xl" />
            </div>
          ) : error ? (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-medium">Urunler yuklenemedi</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatSupabaseError(error, "Products tablosu okunurken bir hata olustu.")}
                </p>
                <Button type="button" onClick={() => void refetch()}>
                  Tekrar dene
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{products.length} urun</Badge>
                <Badge variant="outline">{stats.screenshots} screenshot</Badge>
              </div>
              <ProductTable
                products={products}
                deletingProductId={deleteProductMutation.isPending ? productToDelete?.id : null}
                onEdit={(product) => {
                  setEditingProduct(product);
                  setFormOpen(true);
                }}
                onDelete={(product) => {
                  setProductToDelete(product);
                }}
              />
            </div>
          )}
        </section>
      </div>

      <ProductForm
        mode={editingProduct ? "edit" : "create"}
        open={formOpen}
        initialProduct={editingProduct}
        isSubmitting={saveProductMutation.isPending}
        onOpenChange={(nextOpen) => {
          setFormOpen(nextOpen);

          if (!nextOpen) {
            setEditingProduct(null);
          }
        }}
        onSubmit={async (values) => {
          await saveProductMutation.mutateAsync(values);
        }}
      />

      <AlertDialog open={Boolean(productToDelete)} onOpenChange={(open) => {
        if (!open) {
          setProductToDelete(null);
        }
      }}>
        <AlertDialogContent className="border-destructive/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Urun silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete?.name} kaydi Supabase `products` tablosundan kalici olarak
              silinecek. Bu islem geri alinamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgec</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();

                if (!productToDelete) {
                  return;
                }

                void deleteProductMutation.mutateAsync(productToDelete);
              }}
            >
              {deleteProductMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
