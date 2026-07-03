import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  FileText,
  MessageCircle,
  Smartphone,
} from "lucide-react";

import { useProductsCatalog } from "@/hooks/useProductsCatalog";
import { getProductDetailPath } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DynamicProductsSection = () => {
  const { data: products = [], isLoading, isError } = useProductsCatalog();

  return (
    <section id="products" className="relative overflow-hidden bg-background py-24">
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="mb-4 font-display text-4xl font-bold text-glow md:text-5xl">
            Urunlerimiz
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Admin panelden eklediginiz tum urunler burada otomatik listelenir
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-[340px] rounded-3xl" />
            <Skeleton className="h-[340px] rounded-3xl" />
            <Skeleton className="h-[340px] rounded-3xl" />
          </div>
        ) : isError ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-lg font-semibold text-destructive">Urunler yuklenemedi</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Products tablosu okunurken bir hata olustu. Lutfen daha sonra tekrar deneyin.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card/60 p-8 text-center">
            <p className="text-lg font-semibold">Henuz yayinlanmis urun yok</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Admin panelden eklenen urunler burada otomatik gorunecek.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const detailPath = getProductDetailPath(product.slug);
              const hasWhatsapp = Boolean(product.whatsapp_phone);

              return (
                <Link key={product.id} to={detailPath} className="block animate-fade-in-up">
                  <Card className="group h-full cursor-pointer border-border bg-card transition-all duration-300 hover:-translate-y-2 hover-glow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Smartphone className="h-8 w-8" />
                        </div>
                        <ArrowRight className="h-5 w-5 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <CardTitle className="font-display text-2xl transition-colors group-hover:text-primary">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="min-h-24 text-foreground/70 line-clamp-4 leading-relaxed">
                        {product.description || "Bu urun icin aciklama yakinda eklenecek."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {product.apk_url ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1">
                            <Download className="h-3.5 w-3.5" />
                            APK
                          </span>
                        ) : null}
                        {product.pdf_url ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1">
                            <FileText className="h-3.5 w-3.5" />
                            PDF
                          </span>
                        ) : null}
                        {hasWhatsapp ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            WhatsApp
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 px-3 py-1">
                          {product.screenshot_urls.length} screenshot
                        </span>
                      </div>
                      <Button variant="outline" className="w-full border-primary/30 text-primary hover-glow">
                        Detaylar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default DynamicProductsSection;
