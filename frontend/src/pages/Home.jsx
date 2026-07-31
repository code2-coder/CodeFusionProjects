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
      "https://www.instagram.com/codefusionprojects.in/",
      "https://www.instagram.com/vaibhav.pawar.18"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Starter Website Development Plan",
        "price": "2999",
        "priceCurrency": "INR",
        "description": "5 Page Website, Responsive Design, Basic SEO, Contact Form, Free Hosting, Free Domain 1 Year, 1 Year Technical Support, Unlimited Changes in Website, WhatsApp & Social Media Integration.",
        "category": "Web Development",
        "url": "https://www.codefusionprojects.in/#pricing"
      },
      {
        "@type": "Offer",
        "name": "Business Website Development Plan",
        "price": "6999",
        "priceCurrency": "INR",
        "description": "Up to 15 Pages, Custom UI/UX Design, CMS Integration, Advanced SEO, Performance Optimization, Free Hosting, Free Domain 1 Year, 1 Year Technical Support, Unlimited Changes in Website, WhatsApp & Social Media Integration.",
        "category": "Web Development",
        "url": "https://www.codefusionprojects.in/#pricing"
      },
      {
        "@type": "Offer",
        "name": "Premium Web Application Development Plan",
        "price": "11999",
        "priceCurrency": "INR",
        "description": "Full Stack Web App, MERN Architecture, AI Integration, Custom Dashboard, E-Commerce Setup, Free Hosting, Free Domain 1 Year, 1 Year Technical Support, Unlimited Changes in Website, WhatsApp & Social Media Integration.",
        "category": "Web Development",
        "url": "https://www.codefusionprojects.in/#pricing"
      }
    ]
  };

  return (
    <>
      <SEO 
        title="Website Development starting from ₹2,999 | Free Hosting & Domain"
        description="Get premium custom website development starting from ₹2,999 with free hosting and a free domain for 1 year. Engineered by Vaibhav Rohidas Pawar at Code Fusion Projects."
        keywords="website starting from 2999, free hosting and free domain, Code Fusion Projects, website development company, website developer Pune, MERN stack developer, Vaibhav Pawar, UI UX design startup"
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
