import { Link } from 'react-router-dom';
import { Smartphone, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Ana sayfada "Ürünlerimiz" bölümü — FaultCode gibi ürünlere link verir.
 */
const ProductsSection = () => {
  return (
    <section id="products" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-glow">
            Ürünlerimiz
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Mobil uygulamalar ve araçlar
          </p>
        </div>

        <div className="max-w-md mx-auto animate-fade-in-up">
          <Link to="/faultcode" className="block">
            <Card className="bg-card border-border hover-glow transition-all duration-300 hover:-translate-y-2 group cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-5xl">
                    <Smartphone className="w-12 h-12 text-primary" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardTitle className="font-display text-2xl group-hover:text-primary transition-colors">
                  FaultCode
                </CardTitle>
                <CardDescription className="text-foreground/70 leading-relaxed">
                  Kombi ve ısıtma sistemleri için hata kodu rehberi. Marka bazlı arama, açıklamalar ve kurulum desteği.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full sm:w-auto border-primary/30 text-primary hover-glow">
                  Detaylar ve indirme
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
