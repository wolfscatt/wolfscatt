import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  ImageIcon,
  Loader2,
  MessageCircle,
  Smartphone,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FAULTCODE_APK_URL,
  FAULTCODE_PDF_URL,
  FAULTCODE_WHATSAPP_PHONE,
  WOLFSCATT_URL,
} from "@/constants/faultcode";
import { useProductBySlug } from "@/hooks/useProductsCatalog";

function getFallbackData(slug: string) {
  if (slug !== "faultcode") {
    return {
      apkUrl: null,
      pdfUrl: null,
      whatsappPhone: null,
    };
  }

  return {
    apkUrl: FAULTCODE_APK_URL,
    pdfUrl: FAULTCODE_PDF_URL,
    whatsappPhone: FAULTCODE_WHATSAPP_PHONE,
  };
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProductBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !slug || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-3xl px-4 pb-20 pt-32">
          <Card className="glass-morphism border-destructive/20">
            <CardHeader>
              <CardTitle>Urun bulunamadi</CardTitle>
              <CardDescription>
                Aradiginiz urun kaydi bulunamadi veya su anda yuklenemiyor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/#products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Urunlere don
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const fallbackData = getFallbackData(product.slug);
  const apkUrl = product.apk_url ?? fallbackData.apkUrl;
  const pdfUrl = product.pdf_url ?? fallbackData.pdfUrl;
  const whatsappPhone = product.whatsapp_phone ?? fallbackData.whatsappPhone;
  const screenshotUrls = product.screenshot_urls ?? [];
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone.replace(/\D/g, "")}`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-14 pt-28">
        <div className="absolute left-0 top-0 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[90px]" />
        <div className="absolute right-0 top-10 h-[320px] w-[320px] rounded-full bg-accent/10 blur-[90px]" />

        <div className="container relative z-10 mx-auto max-w-5xl">
          <div className="mb-8">
            <Button asChild variant="ghost" className="pl-0 text-primary hover:bg-transparent">
              <Link to="/#products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tum urunlere don
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Smartphone className="h-8 w-8" />
              </div>
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-bold text-glow md:text-5xl">
                  {product.name}
                </h1>
                <p className="max-w-3xl text-lg text-muted-foreground">
                  {product.description || "Bu urun icin detayli aciklama yakinda eklenecek."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {apkUrl ? (
                  <a href={apkUrl} target="_blank" rel="noopener noreferrer" className="contents">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Download className="mr-2 h-5 w-5" />
                      APK indir
                    </Button>
                  </a>
                ) : null}
                {pdfUrl ? (
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="contents">
                    <Button size="lg" variant="outline" className="border-primary/30 text-primary">
                      <FileText className="mr-2 h-5 w-5" />
                      PDF ac
                    </Button>
                  </a>
                ) : null}
                {whatsappUrl ? (
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contents">
                    <Button size="lg" variant="ghost" className="text-primary hover:bg-primary/10">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      WhatsApp
                    </Button>
                  </a>
                ) : null}
              </div>
            </div>

            <Card className="glass-morphism border-primary/20">
              <CardHeader>
                <CardTitle>Urun ozeti</CardTitle>
                <CardDescription>Bu urune ait yayin bilgileri</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Slug</p>
                  <p className="mt-2 font-medium">/{product.slug}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">APK</p>
                  <p className="mt-2 break-all">{apkUrl || "Eklenmedi"}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">PDF</p>
                  <p className="mt-2 break-all">{pdfUrl || "Eklenmedi"}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">WhatsApp</p>
                  <p className="mt-2">{whatsappPhone || "Eklenmedi"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-6 flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold">Screenshot galerisi</h2>
          </div>

          {screenshotUrls.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {screenshotUrls.map((url, index) => (
                <a
                  key={`${url}-${index}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-border bg-card/60"
                >
                  <div className="aspect-[9/16] overflow-hidden bg-muted/20">
                    <img
                      src={url}
                      alt={`${product.name} screenshot ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-primary/20 bg-card/50">
              <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                <ImageIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Henuz screenshot eklenmemis</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Admin panelden gorsel eklediginde burada gorunecek.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <footer className="border-t border-border px-4 py-8">
        <div className="container mx-auto max-w-5xl text-center text-sm text-muted-foreground">
          <p>Velmora © 2026</p>
          <a
            href={WOLFSCATT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-primary hover:underline"
          >
            wolfscatt.com
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
