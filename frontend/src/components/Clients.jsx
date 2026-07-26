import React from 'react';

const Clients = () => {
  const partners = ['Stripe', 'Framer', 'Vercel', 'Next.js', 'React', 'Tailwind', 'MongoDB', 'Node.js', 'AWS', 'OpenAI'];

  return (
    <section className="py-12 border-y border-white/5 bg-[#000000] overflow-hidden relative font-sans">
      {/* Side fades for seamless loop */}
      <div className="absolute left-0 top-0 w-32 md:w-64 h-full bg-gradient-to-r from-[#000000] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-32 md:w-64 h-full bg-gradient-to-l from-[#000000] to-transparent z-10 pointer-events-none"></div>
      
      {/* Subtle interior lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

      <div className="flex w-[200%] animate-marquee">
        <div className="flex w-1/2 justify-around items-center gap-10 px-10">
          {partners.map((partner, i) => (
            <div 
              key={i} 
              className="text-2xl md:text-3xl font-black tracking-tighter text-white/20 hover:text-white transition-all duration-500 cursor-pointer select-none hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              {partner}
            </div>
          ))}
        </div>
        <div className="flex w-1/2 justify-around items-center gap-10 px-10">
          {partners.map((partner, i) => (
            <div 
              key={`duplicate-${i}`} 
              className="text-2xl md:text-3xl font-black tracking-tighter text-white/20 hover:text-white transition-all duration-500 cursor-pointer select-none hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
