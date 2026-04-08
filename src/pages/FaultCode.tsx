import {
  Download,
  FileText,
  MessageCircle,
  Shield,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  FAULTCODE_APK_URL,
  FAULTCODE_PDF_URL,
  FAULTCODE_WHATSAPP_PHONE,
  WOLFSCATT_URL,
} from '@/constants/faultcode';
import { useFaultCodeProduct } from '@/hooks/useFaultCodeProduct';

const faqItems = [
  {
    q: 'Play Store\'da neden yok?',
    a: 'FaultCode şu an MVP (Minimum Viable Product) aşamasındadır. Resmi mağaza yayını planlanan sonraki sürümlerde yapılacaktır. APK yalnızca bu siteden güvenli şekilde dağıtılmaktadır.',
  },
  {
    q: 'APK güvenli mi?',
    a: 'Evet. APK yalnızca wolfscatt.com üzerinden sunulur; üçüncü taraf kaynak kullanılmaz. Uygulama kişisel veri toplamaz ve reklam içermez.',
  },
  {
    q: 'Bilinmeyen kaynak uyarısı normal mi?',
    a: 'Evet. Android, mağaza dışından yüklenen uygulamalarda bu uyarıyı gösterir. Sadece bu siteden indirdiğiniz APK\'yı yüklediğinizden emin olun.',
  },
  {
    q: 'Deneme bitince ne olur?',
    a: '1 haftalık ücretsiz deneme sonunda uygulama lisans gerektirir. Lisans satın alarak süresiz kullanıma devam edebilirsiniz.',
  },
  {
    q: 'Lisans kaç cihazda geçerli?',
    a: 'Lisans tek cihaz için geçerlidir. Birden fazla cihazda kullanım için ek lisans alınması gerekir.',
  },
  {
    q: 'Telefon değişince ne olur?',
    a: 'Yeni cihazınızda aynı lisans kodu ile aktivasyon yapabilirsiniz. Eski cihazdaki lisans devre dışı bırakılır.',
  },
  {
    q: 'Lisans kodu ne zaman gelir?',
    a: 'Ödeme onaylandıktan sonra WhatsApp üzerinden lisans kodu iletilecektir. Genellikle aynı iş günü içinde tamamlanır.',
  },
];

export default function FaultCode() {
  const { data: product, isLoading } = useFaultCodeProduct();

  const apkUrl = product?.apk_url ?? FAULTCODE_APK_URL;
  const pdfUrl = product?.pdf_url ?? FAULTCODE_PDF_URL;
  const whatsappPhone = product?.whatsapp_phone ?? FAULTCODE_WHATSAPP_PHONE;
  const whatsAppUrl = `https://wa.me/${whatsappPhone.replace(/\D/g, '')}`;
  const screenshotUrls = product?.screenshot_urls ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]" />
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-glow mb-4">
            FaultCode
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-8">
            Kombi ve ısıtma sistemleri için hata kodu rehberi — marka bazlı arama, açıklamalar ve çözüm önerileri.
          </p>
          <ul className="text-left max-w-md mx-auto space-y-3 mb-10">
            <li className="flex items-center gap-3 text-foreground/90">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              Marka bazlı hata kodu arama
            </li>
            <li className="flex items-center gap-3 text-foreground/90">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              Özet, olası nedenler ve yorumlar
            </li>
            <li className="flex items-center gap-3 text-foreground/90">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              Son görüntülenenler ve kurumsal arayüz
            </li>
          </ul>
        </div>
      </section>

      {/* Primary CTAs */}
      <section className="px-4 pb-12">
        <div className="container mx-auto max-w-2xl flex flex-col sm:flex-row gap-4 justify-center">
          {apkUrl && (
            <a href={apkUrl} download className="contents">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 hover-glow"
              >
                <Download className="mr-2 h-5 w-5" />
                APK'yı İndir
              </Button>
            </a>
          )}
          {pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="contents">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary/30 text-primary hover-glow"
              >
                <FileText className="mr-2 h-5 w-5" />
                Kurulum PDF'ini İndir
              </Button>
            </a>
          )}
        </div>
        <div className="container mx-auto max-w-2xl mt-4 flex justify-center">
          <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="contents">
            <Button size="lg" variant="ghost" className="text-primary hover:bg-primary/10">
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp'tan Yaz
            </Button>
          </a>
        </div>
      </section>

      {/* Trust & safety */}
      <section className="px-4 pb-12">
        <div className="container mx-auto max-w-2xl">
          <Card className="glass-morphism border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Güvenlik ve bilgilendirme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground text-sm">
              <p>• MVP sürüm, Play Store'da değildir.</p>
              <p>• Kişisel veriler şifrelenerek saklanır, reklam içermez.</p>
              <p>• APK yalnızca resmi siteden dağıtılır.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3-step install */}
      <section className="px-4 pb-12">
        <div className="container mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-center mb-6">Kurulum (3 adım)</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-card/80 border-border">
              <CardContent className="pt-6 text-center">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-display font-bold mb-2">1</span>
                <p className="text-sm font-medium">APK'yı indir</p>
                <p className="text-xs text-muted-foreground mt-1">Bu sayfadaki butondan indirin</p>
              </CardContent>
            </Card>
            <Card className="bg-card/80 border-border">
              <CardContent className="pt-6 text-center">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-display font-bold mb-2">2</span>
                <p className="text-sm font-medium">Bilinmeyen kaynaklara izin ver</p>
                <p className="text-xs text-muted-foreground mt-1">Ayarlar → Güvenlik</p>
              </CardContent>
            </Card>
            <Card className="bg-card/80 border-border">
              <CardContent className="pt-6 text-center">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-display font-bold mb-2">3</span>
                <p className="text-sm font-medium">APK'yı yükle ve aç</p>
                <p className="text-xs text-muted-foreground mt-1">Dosya yöneticisinden kurun</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trial & pricing */}
      <section className="px-4 pb-12">
        <div className="container mx-auto max-w-2xl">
          <Card className="glass-morphism border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Smartphone className="h-5 w-5 text-primary" />
                Deneme ve lisans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground/90">
              <p><strong>1 Hafta Ücretsiz Deneme</strong> — Uygulamayı deneyin.</p>
              <p><strong>İlk 15 kullanıcı:</strong> Süresiz lisans 1500 TL + KDV</p>
              <p>Ödeme sonrası lisans kodu ile aktivasyon yapılır.</p>
              <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Satın Alma / Lisans İçin WhatsApp
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-12">
        <div className="container mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-center mb-6">Sık Sorulan Sorular</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left hover:text-primary">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Screenshots / gallery */}
      <section className="px-4 pb-12">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-center mb-6">Ekran görüntüleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {screenshotUrls.length > 0
              ? screenshotUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-[9/16] rounded-lg border border-border bg-muted/30 overflow-hidden block"
                  >
                    <img
                      src={url}
                      alt={`FaultCode ekran görüntüsü ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-[9/16] rounded-lg border border-border bg-muted/30 flex items-center justify-center text-muted-foreground text-sm"
                  >
                    Görsel {i}
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-2xl text-center text-muted-foreground text-sm">
          <p>Velmora © 2026</p>
          <a
            href={WOLFSCATT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline mt-1 inline-block"
          >
            wolfscatt.com
          </a>
        </div>
      </footer>
    </div>
  );
}
