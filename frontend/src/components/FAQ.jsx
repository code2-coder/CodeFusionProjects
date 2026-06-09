import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    { q: "How does the AI website builder work?", a: "Our AI asks you a few basic questions about your business, processes the information, and selects the optimal layout, color palette, and initial content structure to generate a custom website in seconds." },
    { q: "Is hosting included in the plans?", a: "Yes, we provide premium cloud hosting on AWS/Vercel infrastructure with 99.9% uptime guarantee for the first year on our Business and Premium plans." },
    { q: "Do you offer domain support?", a: "Absolutely. We can register a new domain for you or help you connect an existing domain to your new website seamlessly." },
    { q: "Are SEO services included?", a: "We build all websites with on-page SEO best practices (semantic HTML, fast load times, meta tags). For advanced ongoing SEO strategies, we offer dedicated packages." },
    { q: "What is the typical delivery time?", a: "Standard websites take 1-2 weeks. Custom web applications and complex e-commerce platforms can take 4-8 weeks depending on the requirements." },
    { q: "Do you provide maintenance support?", a: "Yes, we offer ongoing maintenance packages that cover security updates, performance monitoring, and content updates." }
  ];

  return (
    <section className="py-32 relative bg-background border-y border-[color:var(--border)]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-foreground"
          >
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Questions</span>
          </motion.h2>
          <p className="text-foreground/60 text-lg font-medium">Everything you need to know about our services and process.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="bg-card border border-[color:var(--border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button 
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-lg text-foreground tracking-tight">{faq.q}</span>
                <ChevronDown className={`transform transition-transform duration-300 ${openIdx === i ? 'rotate-180 text-purple-600' : 'text-foreground/40'}`} />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-foreground/70 leading-relaxed border-t border-[color:var(--border)] mt-2 font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
