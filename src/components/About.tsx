import { Code2, Layers, Target } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-glow">
              About Me
            </h2>
          </div>

          <div className="space-y-8 animate-fade-in-up">
            <div className="glass-morphism rounded-xl p-8 md:p-12 space-y-6 text-foreground/90 leading-relaxed">
              <p className="text-lg">
                Ben Ömer Faruk BİNGÖL. Yazılım Mühendisiyim.
              </p>
              
              <p className="text-lg">
                Makine öğrenmesinden oyun geliştirmeye kadar birçok farklı alanda çalışmalar yaptım.
              </p>
              
              <p className="text-lg">
                Bütün dilleri tek tek saymak istemiyorum, herkes gibi. Zaten artık onların önemli olduğunu da düşünmüyorum çok fazla. Bu dönemde herkes her şeyi yapabiliyor zaten.
              </p>
              
              <p className="text-lg">
                Yalnızca benim önemsediğim şeyler <span className="text-primary font-semibold">mimariler</span>.
              </p>
              
              <p className="text-lg">
                İnşa edilen uygulamanın <span className="text-primary font-semibold">SOLID</span> olması, mimari desenlere uygun tasarlanması ve sürdürülebilir olması.
              </p>
              
              <p className="text-lg">
                Açıkçası ben yaptığım işlerde düzeni çok seviyorum. Fazla uzatmaya gerek yok.
              </p>
              
              <p className="text-lg">
                İşlerimi aşağıda ve GitHub adresimde görebilirsiniz.
              </p>
            </div>

            {/* Core Principles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="glass-morphism rounded-xl p-6 text-center group hover-glow transition-all hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Layers className="text-primary" size={32} />
                </div>
                <h3 className="font-display text-xl mb-2">Architecture</h3>
                <p className="text-foreground/70 text-sm">
                  Clean, scalable system design
                </p>
              </div>

              <div className="glass-morphism rounded-xl p-6 text-center group hover-glow transition-all hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Code2 className="text-primary" size={32} />
                </div>
                <h3 className="font-display text-xl mb-2">SOLID Principles</h3>
                <p className="text-foreground/70 text-sm">
                  Maintainable, testable code
                </p>
              </div>

              <div className="glass-morphism rounded-xl p-6 text-center group hover-glow transition-all hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Target className="text-primary" size={32} />
                </div>
                <h3 className="font-display text-xl mb-2">Clarity & Order</h3>
                <p className="text-foreground/70 text-sm">
                  Structure above all else
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
