import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Clients from '../components/Clients';
import About from '../components/About';
import Founder from '../components/Founder';
import Services from '../components/Services';
import FeaturedWork from '../components/FeaturedWork';
import FeaturedResources from '../components/FeaturedResources';
import AIBuilder from '../components/AIBuilder';
import DomainChecker from '../components/DomainChecker';

import Testimonials from '../components/Testimonials';
import Process from '../components/Process';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -100; // Account for fixed navbar height
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <main>
        <Hero />
        <Clients />
        <About />
        <FeaturedWork />
        <Founder />
        <Services />
        <AIBuilder />
        <DomainChecker />

        <Testimonials />
        <FeaturedResources />
        <Process />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Home;
