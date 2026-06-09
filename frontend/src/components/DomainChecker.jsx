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

    // Regex to match a domain name and its extension (e.g., name.com, name.co.in)
    const match = trimmed.match(/^([a-z0-9-]+)(\.[a-z0-9.-]+)$/);
    if (match) {
      return { base: match[1], ext: match[2] };
    }

    // Fallback: search for first dot if present
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
      // If user typed an extension, we check that first. Otherwise default to .com
      const targetExt = parsed.ext || '.com';
      
      // Determine availability deterministically based on string hash
      const isAvailable = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % 3 !== 0; // 66% chance of being available
      };

      // Create a final extensions list: target extension first, followed by others
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

  // Find the primary search domain results
  const primaryResult = results.length > 0 ? results[0] : null;
  const suggestions = results.slice(1);

  return (
    <section id="domain" className="py-32 relative bg-background border-y border-[color:var(--border)] overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute top-[20%] left-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-6">
            <Sparkles size={12} />
            Instant Domain Search
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-foreground">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">Perfect Domain</span>
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl mb-12 font-medium max-w-2xl mx-auto">
            Start your digital journey with the right name. Check availability instantly and secure your identity.
          </p>

          <form onSubmit={checkDomain} className="relative max-w-2xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-50 transition duration-500 group-hover:opacity-75"></div>
              <div className="relative bg-card rounded-2xl flex items-center p-2.5 border border-[color:var(--border)] shadow-md">
                <Globe className="text-foreground/40 ml-4 mr-2" size={24} />
                <input 
                  type="text" 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Enter your business name (e.g., delivix.in)..." 
                  className="flex-1 bg-transparent border-none outline-none text-lg px-2 text-foreground font-medium placeholder:text-foreground/30 placeholder:font-normal"
                />
                <button 
                  type="submit" 
                  className="px-8 py-4 bg-foreground text-background hover:bg-foreground/90 active:scale-95 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <Search size={20} />
                  Search
                </button>
              </div>
            </div>

            {/* Cart floating indicator */}
            {cart.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-semibold"
              >
                <ShoppingCart size={16} />
                {cart.length} {cart.length === 1 ? 'domain' : 'domains'} selected
              </motion.div>
            )}
          </form>

          {/* Availability Results Section */}
          <AnimatePresence mode="wait">
            {status === 'checking' && (
              <motion.div 
                key="checking"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto bg-card p-8 rounded-2xl border border-[color:var(--border)] shadow-sm flex flex-col items-center justify-center gap-4 min-h-[160px]"
              >
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-foreground/60 font-medium">Checking domain availability...</p>
              </motion.div>
            )}

            {status === 'completed' && results.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="max-w-3xl mx-auto space-y-6 text-left"
              >
                {/* Primary Search Result Card */}
                {primaryResult && (
                  <div className={`p-6 md:p-8 rounded-2xl border transition-all shadow-lg ${
                    primaryResult.available 
                      ? 'bg-emerald-500/5 border-emerald-500/30 shadow-emerald-950/10' 
                      : 'bg-red-500/5 border-red-500/20 shadow-red-950/5'
                  }`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          primaryResult.available 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {primaryResult.available ? <CheckCircle size={28} /> : <XCircle size={28} />}
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-foreground">
                            {searchedDomain?.base}
                            <span className={primaryResult.available ? 'text-emerald-400' : 'text-red-400'}>
                              {primaryResult.ext}
                            </span>
                          </h3>
                          <p className="text-foreground/60 text-sm mt-1">
                            {primaryResult.available 
                              ? 'Congratulations! This domain is available for registration.' 
                              : 'Sorry, this domain is already registered.'}
                          </p>
                        </div>
                      </div>

                      {primaryResult.available && (
                        <div className="flex items-center gap-4 self-end md:self-auto w-full md:w-auto justify-between md:justify-start border-t md:border-t-0 pt-4 md:pt-0 border-[color:var(--border)]">
                          <div className="text-right">
                            <span className="text-xs text-foreground/40 block">Price</span>
                            <span className="text-2xl font-extrabold text-foreground">{primaryResult.price}</span>
                          </div>
                          <button
                            onClick={() => toggleCart(primaryResult.domain)}
                            className={`px-6 py-3 font-bold rounded-xl transition-all flex items-center gap-2 ${
                              cart.includes(primaryResult.domain)
                                ? 'bg-white/10 border border-white/15 text-white hover:bg-white/15'
                                : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]'
                            }`}
                          >
                            {cart.includes(primaryResult.domain) ? (
                              <>
                                <Check size={16} />
                                In Cart
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={16} />
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
                <div className="bg-card border border-[color:var(--border)] rounded-2xl p-6 md:p-8 shadow-sm">
                  <h4 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                    <Globe size={18} className="text-blue-500" />
                    Alternative Suggestions
                  </h4>
                  
                  <div className="divide-y divide-[color:var(--border)]">
                    {suggestions.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-white/[0.01] -mx-4 px-4 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-foreground/30'
                          }`}>
                            {item.available ? <CheckCircle size={18} /> : <Lock size={16} />}
                          </div>
                          <div>
                            <span className="font-bold text-foreground text-lg">{searchedDomain?.base}</span>
                            <span className={`font-bold text-lg ${item.available ? 'text-emerald-400/80' : 'text-foreground/30'}`}>
                              {item.ext}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          {item.available ? (
                            <>
                              <span className="text-foreground/80 font-semibold">{item.price}</span>
                              <button
                                onClick={() => toggleCart(item.domain)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                                  cart.includes(item.domain)
                                    ? 'bg-white/10 border border-white/15 text-white hover:bg-white/15'
                                    : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-[0_4px_10px_rgba(16,185,129,0.15)]'
                                }`}
                              >
                                {cart.includes(item.domain) ? (
                                  <>
                                    <Check size={12} />
                                    In Cart
                                  </>
                                ) : (
                                  <>
                                    <ShoppingCart size={12} />
                                    Select
                                  </>
                                )}
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-foreground/30 text-sm font-semibold">Unavailable</span>
                              <button
                                disabled
                                className="px-4 py-2 text-xs font-bold rounded-lg bg-white/5 border border-white/5 text-foreground/20 cursor-not-allowed"
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
