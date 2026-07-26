import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, CheckCircle, XCircle, Lock, ShoppingCart, Check, Sparkles } from 'lucide-react';

const DomainChecker = () => {
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState(null); // 'idle', 'checking', 'completed'
  const [results, setResults] = useState([]);
  const [searchedDomain, setSearchedDomain] = useState(null);
  const [cart, setCart] = useState([]);

  const extensionsList = [
    { ext: '.com', price: '$8.99/yr' },
    { ext: '.in', price: '$4.99/yr' },
    { ext: '.net', price: '$10.99/yr' },
    { ext: '.org', price: '$11.99/yr' },
    { ext: '.tech', price: '$2.99/yr' },
    { ext: '.store', price: '$1.99/yr' },
    { ext: '.io', price: '$29.99/yr' },
    { ext: '.co', price: '$7.99/yr' }
  ];

  const parseDomainInput = (input) => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return { base: '', ext: '' };

    const match = trimmed.match(/^([a-z0-9-]+)(\.[a-z0-9.-]+)$/);
    if (match) {
      return { base: match[1], ext: match[2] };
    }

    const firstDotIndex = trimmed.indexOf('.');
    if (firstDotIndex !== -1) {
      return {
        base: trimmed.substring(0, firstDotIndex),
        ext: trimmed.substring(firstDotIndex)
      };
    }

    return { base: trimmed, ext: '' };
  };

  const checkDomain = (e) => {
    e.preventDefault();
    const trimmedInput = domain.trim();
    if (!trimmedInput) return;

    setStatus('checking');
    setResults([]);

    const parsed = parseDomainInput(trimmedInput);
    setSearchedDomain(parsed);

    setTimeout(() => {
      const targetExt = parsed.ext || '.com';
      
      const isAvailable = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % 3 !== 0; 
      };

      const targetPrice = extensionsList.find(x => x.ext === targetExt)?.price || '$9.99/yr';
      const cleanExtensionsList = extensionsList.filter(item => item.ext !== targetExt);
      const finalExts = [{ ext: targetExt, price: targetPrice }, ...cleanExtensionsList];

      const newResults = finalExts.map(item => {
        const fullDomain = `${parsed.base}${item.ext}`;
        return {
          domain: fullDomain,
          ext: item.ext,
          available: isAvailable(fullDomain),
          price: item.price
        };
      });

      setResults(newResults);
      setStatus('completed');
    }, 1500);
  };

  const toggleCart = (domainName) => {
    if (cart.includes(domainName)) {
      setCart(cart.filter(item => item !== domainName));
    } else {
      setCart([...cart, domainName]);
    }
  };

  const primaryResult = results.length > 0 ? results[0] : null;
  const suggestions = results.slice(1);

  return (
    <section id="domain" className="py-32 lg:py-48 relative bg-[#000000] font-sans border-t border-white/5 overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[140px] mix-blend-screen"
        />
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] mix-blend-screen"
        />
      </div>

      <div className="max-w-[1000px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.02)] text-white font-semibold tracking-wide text-xs mb-8">
            <Sparkles size={14} className="text-blue-400" />
            <span className="uppercase tracking-widest text-white/80">Instant Domain Search</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white leading-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">Perfect Domain</span>
          </h2>
          <p className="text-white/50 text-lg md:text-2xl mb-14 font-light max-w-2xl mx-auto tracking-tight leading-relaxed">
            Start your digital journey with the right name. Check availability instantly and secure your identity.
          </p>

          <form onSubmit={checkDomain} className="relative max-w-3xl mx-auto mb-16">
            <div className="relative group">
              {/* Glow Behind Input */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 pointer-events-none"></div>
              
              <div className="relative bg-white/[0.02] backdrop-blur-3xl rounded-full flex items-center p-2.5 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 group-hover:bg-white/[0.04] group-hover:border-white/20">
                <Globe className="text-white/40 ml-5 mr-3 shrink-0" size={24} />
                <input 
                  type="text" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter your business name (e.g., delivix.in)..." 
                  className="flex-1 bg-transparent border-none outline-none text-xl px-2 text-white font-medium placeholder:text-white/20 placeholder:font-light w-full"
                />
                <button 
                  type="submit" 
                  className="px-8 py-4 bg-white text-black hover:scale-105 active:scale-95 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 shrink-0"
                >
                  <Search size={20} />
                  Search
                </button>
              </div>
            </div>

            {/* Cart floating indicator */}
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="absolute -bottom-16 left-1/2 -translate-x-1/2 inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  <ShoppingCart size={18} />
                  {cart.length} {cart.length === 1 ? 'domain' : 'domains'} selected
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Availability Results Section */}
          <AnimatePresence mode="wait">
            {status === 'checking' && (
              <motion.div 
                key="checking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto bg-white/[0.02] backdrop-blur-2xl p-12 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center justify-center gap-6 min-h-[250px]"
              >
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin shadow-[0_0_30px_rgba(16,185,129,0.2)]"></div>
                <p className="text-white/60 font-light tracking-wide text-lg">Querying global registry...</p>
              </motion.div>
            )}

            {status === 'completed' && results.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[1000px] mx-auto space-y-8 text-left"
              >
                {/* Primary Search Result Card */}
                {primaryResult && (
                  <div className={`p-8 md:p-10 rounded-[2.5rem] border backdrop-blur-3xl transition-all duration-700 shadow-2xl relative overflow-hidden group ${
                    primaryResult.available 
                      ? 'bg-emerald-900/10 border-emerald-500/20 hover:bg-emerald-900/20 hover:border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.05)]' 
                      : 'bg-red-900/10 border-red-500/20 hover:bg-red-900/20 shadow-[0_20px_50px_rgba(239,68,68,0.05)]'
                  }`}>
                    
                    {/* Inner Ambient Glow */}
                    {primaryResult.available && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    )}

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
                          primaryResult.available 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                        }`}>
                          {primaryResult.available ? <CheckCircle size={32} /> : <XCircle size={32} />}
                        </div>
                        <div>
                          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            {searchedDomain?.base}
                            <span className={primaryResult.available ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-red-400'}>
                              {primaryResult.ext}
                            </span>
                          </h3>
                          <p className={`text-sm mt-2 font-light ${primaryResult.available ? 'text-emerald-400/80' : 'text-red-400/80'}`}>
                            {primaryResult.available 
                              ? 'Congratulations! This premium domain is available.' 
                              : 'Sorry, this domain is already registered.'}
                          </p>
                        </div>
                      </div>

                      {primaryResult.available && (
                        <div className="flex items-center gap-6 self-end md:self-auto w-full md:w-auto justify-between md:justify-start border-t md:border-t-0 pt-6 md:pt-0 border-white/10">
                          <div className="text-right">
                            <span className="text-xs text-white/40 block uppercase tracking-widest font-semibold mb-1">Price</span>
                            <span className="text-3xl font-black text-white tracking-tighter">{primaryResult.price}</span>
                          </div>
                          <button
                            onClick={() => toggleCart(primaryResult.domain)}
                            className={`px-8 py-4 font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 text-lg ${
                              cart.includes(primaryResult.domain)
                                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
                                : 'bg-emerald-500 hover:bg-emerald-400 hover:scale-105 active:scale-95 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)]'
                            }`}
                          >
                            {cart.includes(primaryResult.domain) ? (
                              <>
                                <Check size={20} />
                                In Cart
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={20} />
                                Add to Cart
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Suggestions List Container */}
                <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                  <h4 className="text-xl font-bold text-white mb-8 flex items-center gap-3 tracking-tight">
                    <Globe size={24} className="text-blue-400" />
                    Alternative Suggestions
                  </h4>
                  
                  <div className="divide-y divide-white/5">
                    {suggestions.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-white/[0.03] -mx-6 px-6 rounded-2xl group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            item.available ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/30 border border-white/10'
                          }`}>
                            {item.available ? <CheckCircle size={20} /> : <Lock size={18} />}
                          </div>
                          <div>
                            <span className="font-bold text-white text-xl tracking-tight">{searchedDomain?.base}</span>
                            <span className={`font-bold text-xl tracking-tight ${item.available ? 'text-emerald-400 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all' : 'text-white/30'}`}>
                              {item.ext}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          {item.available ? (
                            <>
                              <span className="text-white/80 font-bold text-lg tracking-tight">{item.price}</span>
                              <button
                                onClick={() => toggleCart(item.domain)}
                                className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                                  cart.includes(item.domain)
                                    ? 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
                                    : 'bg-white/[0.05] border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white hover:scale-105 active:scale-95 text-white/80 hover:shadow-[0_5px_20px_rgba(16,185,129,0.3)]'
                                }`}
                              >
                                {cart.includes(item.domain) ? (
                                  <>
                                    <Check size={16} />
                                    In Cart
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart size={16} />
                                    Select
                                  </>
                                )}
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-white/20 text-sm font-semibold tracking-wide uppercase">Unavailable</span>
                              <button
                                disabled
                                className="px-5 py-2.5 text-sm font-bold rounded-xl bg-white/[0.02] border border-white/5 text-white/10 cursor-not-allowed"
                              >
                                Taken
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default DomainChecker;
