import React from 'react';
import Templates from '../components/Templates';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const TemplatesPage = () => {
  return (
    <>
      <SEO 
        title="Premium Website Templates | Starting from ₹2,999"
        description="Browse and deploy professional, premium website templates starting from ₹2,999. Every template comes with free hosting, a free domain for 1 year, and full MERN support."
        keywords="premium website templates, ready-made websites, MERN stack templates, responsive web designs, purchase landing pages"
      />
      <main className="pt-16">
        <Templates />
      </main>
      <Footer />
    </>
  );
};

export default TemplatesPage;
