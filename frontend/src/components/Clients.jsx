import React from 'react';

const Clients = () => {
  const partners = ['Stripe', 'Framer', 'Vercel', 'Next.js', 'React', 'Tailwind', 'MongoDB', 'Node.js'];

  return (
    <section className="py-12 border-y border-[color:var(--border)] bg-secondary/20 overflow-hidden relative">
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex w-[200%] animate-marquee">
        <div className="flex w-1/2 justify-around items-center gap-10 px-10">
          {partners.map((partner, i) => (
            <div key={i} className="text-xl md:text-2xl font-bold text-foreground/30 hover:text-foreground/80 transition-colors cursor-pointer select-none">
              {partner}
            </div>
          ))}
        </div>
        <div className="flex w-1/2 justify-around items-center gap-10 px-10">
          {partners.map((partner, i) => (
            <div key={`duplicate-${i}`} className="text-xl md:text-2xl font-bold text-foreground/30 hover:text-foreground/80 transition-colors cursor-pointer select-none">
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
