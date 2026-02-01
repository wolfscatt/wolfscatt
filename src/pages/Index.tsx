import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductsSection from '@/components/ProductsSection';
import Projects from '@/components/Projects';
import About from '@/components/About';
import Contact from '@/components/Contact';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProductsSection />
      <Projects />
      <About />
      <Contact />
    </div>
  );
};

export default Index;
