import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
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

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Code Fusion Projects",
    "image": "https://www.codefusionprojects.in/ai_logo.png",
    "@id": "https://www.codefusionprojects.in/#organization",
    "url": "https://www.codefusionprojects.in/",
    "telephone": "+918767316759",
    "email": "codefusionprojects@gmail.com",
    "priceRange": "₹2,999 - ₹11,999",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "founder": {
      "@type": "Person",
      "name": "Vaibhav Rohidas Pawar",
      "url": "https://www.instagram.com/vaibhav.pawar.18"
    },
    "sameAs": [
      "https://www.instagram.com/codefusionprojects.in"
    ]
  };

  return (
    <>
      <SEO 
        title="Website Development Company | MERN Stack Developers"
        description="Code Fusion Projects is a leading website development company in Pune. We build custom React, MERN stack, E-commerce websites and mobile apps for startups and small businesses."
        keywords="website development company, website developer in Pune, website development Pune, web development company India, MERN stack developer, React developer, Node.js developer"
        schema={localBusinessSchema}
      />
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
