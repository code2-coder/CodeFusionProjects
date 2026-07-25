import React from 'react';
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
