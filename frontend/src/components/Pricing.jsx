import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Pricing = () => {
  const handlePayment = async (plan) => {
    if (plan.price === "Custom") {
      alert("Please contact us for custom plans.");
      return;
    }

    try {
      const amountStr = plan.price.replace('₹', '').replace(',', '');
      const amount = parseInt(amountStr);

      const orderRes = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, planName: plan.name }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert("Failed to create order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Code Fusion",
        description: `Purchase ${plan.name} Plan`,
        image: "/ai_logo.png",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('http://localhost:5000/api/payments/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                amount,
                planName: plan.name,
              }),
            });

            if (verifyRes.ok) {
              alert("Payment successful!");
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3B82F6"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment failed");
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("An error occurred during payment initialization");
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "₹2,999",
      desc: "Perfect for new startups.",
      features: ["5 Page Website", "Responsive Design", "Basic SEO", "Contact Form", "1 Month Support"],
      highlight: false
    },
    {
      name: "Business",
      price: "₹6,999",
      desc: "For growing businesses.",
      features: ["Up to 15 Pages", "Custom UI/UX Design", "CMS Integration", "Advanced SEO", "Performance Optimization", "3 Months Support"],
      highlight: true
    },
    {
      name: "Premium",
      price: "₹11,999",
      desc: "Enterprise scale solutions.",
      features: ["Full Stack Web App", "MERN Architecture", "AI Integration", "Custom Dashboard", "E-Commerce Setup", "24/7 Priority Support"],
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-32 relative bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Investment</span>
          </motion.h2>
          <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto font-medium">Invest in premium quality architecture that pays for itself.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-card p-10 rounded-3xl transition-transform hover:-translate-y-2 ${plan.highlight ? 'border-purple-500/50 shadow-[0_10px_40px_rgba(168,85,247,0.15)] md:-translate-y-4 md:hover:-translate-y-6 scale-100 md:scale-105 z-10' : 'border-[color:var(--border)] shadow-sm'}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-background text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
                  RECOMMENDED
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2 tracking-tight">{plan.name}</h3>
              <p className="text-foreground/50 text-sm mb-8 font-medium">{plan.desc}</p>
              
              <div className="mb-10">
                <span className="text-5xl font-extrabold tracking-tighter">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-foreground/50 font-medium ml-1">/project</span>}
              </div>

              <div className="space-y-5 mb-10 flex-1">
                {plan.features.map((feat, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Check size={18} className={plan.highlight ? "text-purple-600" : "text-foreground/40"} />
                    <span className="text-sm font-semibold text-foreground/80">{feat}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePayment(plan)}
                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-sm ${plan.highlight ? 'bg-foreground text-background hover:scale-[1.02] hover:shadow-md' : 'bg-secondary/50 border border-[color:var(--border)] hover:bg-secondary'}`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
