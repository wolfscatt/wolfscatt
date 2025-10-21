import { ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>

      {/* Animated glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-glow-pulse"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-glow">
            Ömer Faruk BİNGÖL
          </h1>
          
          <p className="text-xl md:text-2xl text-primary font-display font-medium">
            Software Engineer & System Architect
          </p>

          <div className="max-w-2xl mx-auto space-y-4 text-foreground/80 text-base md:text-lg leading-relaxed">
            <p>
              I'm a Software Engineer working across various domains — from Machine Learning to Game Development.
            </p>
            <p>
              I care less about listing languages, and more about{' '}
              <span className="text-primary font-semibold">architecture, design patterns, and sustainable code</span>.
            </p>
            <p>
              For me, structure and clarity always come first. You can explore my works below or check my GitHub.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover-glow group"
            >
              View Projects
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            
            <a
              href="https://github.com/wolfscatt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-primary hover-glow group"
              >
                <Github className="mr-2" size={20} />
                GitHub Profile
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
