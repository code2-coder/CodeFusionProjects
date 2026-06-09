import React from 'react';
import Hero from '../components/Hero';
import Clients from '../components/Clients';
import About from '../components/About';
import Founder from '../components/Founder';
import Services from '../components/Services';
import AIBuilder from '../components/AIBuilder';
import DomainChecker from '../components/DomainChecker';
import Templates from '../components/Templates';
import Projects from '../components/Projects';
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
        <Founder />
        <Services />
        <AIBuilder />
        <DomainChecker />
        <Templates />
        <Projects />
        <Testimonials />
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
