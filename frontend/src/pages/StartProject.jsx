import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Building2, User, Phone, Mail, FileText, Upload, Globe, Layout, Link as LinkIcon, 
  Server, DollarSign, Calendar, CheckCircle2, ChevronRight, ChevronLeft, Loader2, Play
} from 'lucide-react';

const StartProject = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/start-project');
    }
  }, [user, navigate]);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Step 1
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState(user?.name || '');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '');
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');

  // Step 2
  const [websiteType, setWebsiteType] = useState('');
  const [featuresNeeded, setFeaturesNeeded] = useState([]);
  const [referenceWebsite, setReferenceWebsite] = useState('');

  // Step 3
  const [domainAvailable, setDomainAvailable] = useState('No');
  const [hostingAvailable, setHostingAvailable] = useState('No');
  const [budget, setBudget] = useState('');
  const [expectedLaunchDate, setExpectedLaunchDate] = useState('');
  const [contentFiles, setContentFiles] = useState([]);
  const [contentUrls, setContentUrls] = useState([]);
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  const featuresList = [
    'Contact Form', 'WhatsApp Chat', 'Gallery', 'Booking', 'Payment Gateway', 'Admin Panel'
  ];

  const toggleFeature = (feature) => {
    if (featuresNeeded.includes(feature)) {
      setFeaturesNeeded(featuresNeeded.filter(f => f !== feature));
    } else {
      setFeaturesNeeded([...featuresNeeded, feature]);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('files', file);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/upload/user-files', formData, config);
      if (data.urls && data.urls.length > 0) {
        setLogoUrl(data.urls[0]);
      }
    } catch (error) {
      console.error("Logo upload failed", error);
    }
  };

  const handleContentUpload = async (files) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/upload/user-files', formData, config);
      if (data.urls) {
        setContentUrls(data.urls);
      }
    } catch (error) {
      console.error("Content upload failed", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        businessName, contactPerson, mobileNumber, emailAddress, businessType, description, logoUrl,
        websiteType, featuresNeeded, referenceWebsite,
        domainAvailable, hostingAvailable, budget, expectedLaunchDate, contentUrls, additionalRequirements
      };

      await axios.post('/api/project-requests', payload, config);
      setSuccess(true);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Submission failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  if (!user) return null;

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-6 relative bg-[#09090b] flex items-center justify-center">
        <div className="max-w-xl w-full text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-extrabold text-white mb-4"
          >
            Request Received!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 mb-8 text-lg"
          >
            Thank you for starting your project with us. Our team will review your requirements and get back to you shortly.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')} 
            className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-2xl transition-all shadow-xl"
          >
            Go to My Profile
          </motion.button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const inputClasses = "w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none shadow-inner placeholder-white/20";
  const selectClasses = "w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-4 text-white focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none appearance-none shadow-inner";
  const labelClasses = "text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] pl-1 mb-2 block";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 group-hover:text-white/50 transition-colors duration-300";

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 relative bg-[#030303] overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-blue-400 font-bold text-xs uppercase tracking-widest mb-6 shadow-inner">
            <Play size={12} className="fill-blue-400" />
            Project Onboarding
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Start Your Project</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-medium">Fill in the details below to help us understand your vision and requirements for your new project.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-16 relative max-w-2xl mx-auto">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
              initial={{ width: '0%' }}
              animate={{ width: `${((step - 1) / 2) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-3">
              <motion.div 
                layout
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-500 ${
                  step >= s 
                    ? 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white border-white/20 shadow-[0_0_25px_rgba(168,85,247,0.4)]' 
                    : 'bg-[#09090b] text-white/30 border-white/10'
                }`}
              >
                {step > s ? <CheckCircle2 size={24} /> : s}
              </motion.div>
              <span className={`text-[10px] font-bold uppercase tracking-widest absolute -bottom-8 whitespace-nowrap transition-colors duration-500 ${
                step >= s ? 'text-white' : 'text-white/30'
              }`}>
                {s === 1 ? 'Business' : s === 2 ? 'Website' : 'Details'}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <motion.div 
          className="bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-6 sm:p-12 shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden"
          layout
        >
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center font-bold flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-8">Business Information</motion.h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className={labelClasses}>Business Name *</label>
                      <div className="relative group">
                        <Building2 size={18} className={iconClasses} />
                        <input type="text" required value={businessName} onChange={e => setBusinessName(e.target.value)} className={inputClasses} placeholder="Acme Corp" />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className={labelClasses}>Contact Person *</label>
                      <div className="relative group">
                        <User size={18} className={iconClasses} />
                        <input type="text" required value={contactPerson} onChange={e => setContactPerson(e.target.value)} className={inputClasses} placeholder="John Doe" />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className={labelClasses}>Mobile Number *</label>
                      <div className="relative group">
                        <Phone size={18} className={iconClasses} />
                        <input type="tel" required value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className={inputClasses} placeholder="+1 234 567 8900" />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className={labelClasses}>Email Address *</label>
                      <div className="relative group">
                        <Mail size={18} className={iconClasses} />
                        <input type="email" required value={emailAddress} onChange={e => setEmailAddress(e.target.value)} className={inputClasses} placeholder="john@example.com" />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="mt-6">
                    <label className={labelClasses}>Business Type *</label>
                    <select required value={businessType} onChange={e => setBusinessType(e.target.value)} className={selectClasses}>
                      <option value="" disabled className="bg-[#09090b] text-white">Select Business Type</option>
                      <option value="Retail" className="bg-[#09090b] text-white">Retail</option>
                      <option value="Technology" className="bg-[#09090b] text-white">Technology</option>
                      <option value="Healthcare" className="bg-[#09090b] text-white">Healthcare</option>
                      <option value="Agency" className="bg-[#09090b] text-white">Agency</option>
                      <option value="Other" className="bg-[#09090b] text-white">Other</option>
                    </select>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mt-6">
                    <label className={labelClasses}>Brief Description of Your Business</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" className={`${selectClasses} resize-none`} placeholder="What does your business do?"></textarea>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mt-6">
                    <label className={labelClasses}>Upload Logo (Optional)</label>
                    <div className="group w-full border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-2xl p-8 text-center transition-all duration-300 relative cursor-pointer overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <input type="file" accept="image/*" onChange={(e) => { setLogoFile(e.target.files[0]); handleLogoUpload(e.target.files[0]); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <Upload className="mx-auto mb-3 text-white/30 group-hover:text-blue-400 group-hover:-translate-y-1 transition-all duration-300" size={32} />
                      {logoFile ? <p className="text-blue-400 font-bold">{logoFile.name}</p> : <p className="text-white/40 font-medium group-hover:text-white/70 transition-colors">Click or drag image to upload logo</p>}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-8">Website Requirements</motion.h2>
                  
                  <motion.div variants={itemVariants}>
                    <label className={labelClasses}>Website Type *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {['Business', 'E-commerce', 'Portfolio', 'Landing Page', 'Other'].map(type => (
                        <div 
                          key={type} 
                          onClick={() => setWebsiteType(type)}
                          className={`cursor-pointer rounded-2xl p-4 text-center border-2 transition-all duration-300 relative overflow-hidden ${websiteType === type ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-white/5 bg-white/[0.02] text-white/50 hover:bg-white/[0.05] hover:text-white/80'}`}
                        >
                          {websiteType === type && <motion.div layoutId="type-glow" className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />}
                          <span className="relative z-10 font-bold text-sm">{type}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>



                  <motion.div variants={itemVariants} className="mt-6">
                    <label className={labelClasses}>Features Needed</label>
                    <div className="flex flex-wrap gap-3">
                      {featuresList.map(feature => (
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={feature} 
                          onClick={() => toggleFeature(feature)}
                          className={`cursor-pointer rounded-full px-5 py-2.5 border text-[13px] font-bold transition-all duration-300 flex items-center gap-2 ${featuresNeeded.includes(feature) ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/[0.06] hover:text-white/80'}`}
                        >
                          {featuresNeeded.includes(feature) && <CheckCircle2 size={14} className="text-purple-400" />}
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mt-6">
                    <label className={labelClasses}>Reference Website (Optional)</label>
                    <div className="relative group">
                      <LinkIcon size={18} className={iconClasses} />
                      <input type="url" value={referenceWebsite} onChange={e => setReferenceWebsite(e.target.value)} className={inputClasses} placeholder="https://example.com" />
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-8">Project Details</motion.h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants}>
                      <label className={labelClasses}>Domain Available?</label>
                      <select required value={domainAvailable} onChange={e => setDomainAvailable(e.target.value)} className={selectClasses}>
                        <option value="Yes" className="bg-[#09090b] text-white">Yes, I have one</option>
                        <option value="No" className="bg-[#09090b] text-white">No, I need one</option>
                      </select>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className={labelClasses}>Hosting Available?</label>
                      <select required value={hostingAvailable} onChange={e => setHostingAvailable(e.target.value)} className={selectClasses}>
                        <option value="Yes" className="bg-[#09090b] text-white">Yes, I have hosting</option>
                        <option value="No" className="bg-[#09090b] text-white">No, I need hosting</option>
                      </select>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <motion.div variants={itemVariants}>
                      <label className={labelClasses}>Budget *</label>
                      <div className="relative group">
                        <DollarSign size={18} className={iconClasses} />
                        <input type="text" required value={budget} onChange={e => setBudget(e.target.value)} className={inputClasses} placeholder="e.g. $1000 - $3000" />
                      </div>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label className={labelClasses}>Expected Launch Date *</label>
                      <div className="relative group">
                        <Calendar size={18} className={iconClasses} />
                        <input type="date" required value={expectedLaunchDate} onChange={e => setExpectedLaunchDate(e.target.value)} className={inputClasses} />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants} className="mt-6">
                    <label className={labelClasses}>Upload Content (Images, Text, Documents)</label>
                    <div className="group w-full border-2 border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-2xl p-8 text-center transition-all duration-300 relative cursor-pointer overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <input type="file" multiple accept=".pdf,.doc,.docx,.txt,image/*" onChange={(e) => { setContentFiles(Array.from(e.target.files)); handleContentUpload(e.target.files); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <FileText className="mx-auto mb-3 text-white/30 group-hover:text-blue-400 group-hover:-translate-y-1 transition-all duration-300" size={32} />
                      {contentFiles.length > 0 ? (
                        <p className="text-blue-400 font-bold">{contentFiles.length} file(s) selected</p>
                      ) : (
                        <p className="text-white/40 font-medium group-hover:text-white/70 transition-colors">Click or drag files to upload</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mt-6">
                    <label className={labelClasses}>Additional Requirements</label>
                    <textarea value={additionalRequirements} onChange={e => setAdditionalRequirements(e.target.value)} rows="4" className={`${selectClasses} resize-none`} placeholder="Any other details we should know?"></textarea>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
              <motion.button 
                whileHover={step > 1 ? { scale: 1.05, x: -5 } : {}}
                whileTap={step > 1 ? { scale: 0.95 } : {}}
                type="button" 
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/[0.05] border border-white/10 text-white/70 hover:bg-white/10 hover:text-white shadow-inner'}`}
              >
                <ChevronLeft size={18} /> Back
              </motion.button>
              
              {step < 3 ? (
                <motion.button 
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  type="button" 
                  onClick={handleNext}
                  className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl overflow-hidden transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  <span className="relative z-10 flex items-center gap-2">Next Step <ChevronRight size={18} /></span>
                </motion.button>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isSubmitting}
                  className="group relative flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl overflow-hidden transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : '🚀 Submit Project Requirements'}
                  </span>
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StartProject;
