"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PriorityPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const instagramValue = formData.get('instagram') as string;
    const cleanInstagram = instagramValue ? instagramValue.replace(/^@/, '') : '';
    
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      instagram: cleanInstagram,
      why: formData.get('why'),
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
    } catch (err) {
      setError('There was an error submitting your form. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    let value = input.value;
    value = value.replace(/^@+/, '');
    if (value) {
      value = '@' + value;
    }
    input.value = value;
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        window.location.href = "https://tarestudionyc.com/home";
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] } }
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
  };

  return (
    <main style={{ backgroundColor: '#2A2726' }} className="text-white pt-20">
      {/* Hero dial, logo, and subheader */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center relative" style={{ backgroundColor: '#2A2726' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1, opacity: 1 }}>
          <img
            src="/images/Group 15.png"
            alt="Dial"
            className="w-full h-full object-cover"
          />
        </div>
        <div style={{ position: 'relative', textAlign: 'center', zIndex: 2, width: 'min(90vw, 500px)' }}>
          <img
            src="/images/TARE LOGOS/Logo01/rgb-web/white/tare-logo01-white-rgb.svg"
            alt="TARE"
            style={{ width: 'min(80vw, 340px)', margin: '0 auto', display: 'block' }}
          />
          <div style={{ color: '#fff', fontSize: 18, lineHeight: 1.4, letterSpacing: '0.04em', fontFamily: 'NonBureauExtended, sans-serif', marginTop: 18 }}>
            <div style={{ marginBottom: '12px' }}>A FIVE-ACT LIVE PERFORMANCE.</div>
            WORLD-CLASS COFFEE, PRESENTED IN EXPERIMENTAL FORMS.
          </div>
        </div>
      </div>

      {/* Section 1: Intro text */}
      <section className="text-center py-24 px-6">
        <p style={{ fontFamily: 'FragmentMono, monospace' }} className="text-gray-400">We host three kinds of public events:</p>
        <div className="w-12 h-px bg-white mx-auto mt-6 opacity-30" />
      </section>

      {/* Section 2: Main content (light) */}
      <section style={{ backgroundColor: '#FCF7F1', color: '#2A2726' }} className="py-24 sm:py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20 text-center">
          
          {/* Column 1: STUDIO */}
          <div className="flex flex-col items-center">
            <h2 style={{ fontFamily: 'FragmentMono, monospace' }} className="text-lg mb-4 tracking-wider">01</h2>
            <h3 style={{ fontFamily: 'NonBureauExtended, sans-serif' }} className="text-2xl mb-6 tracking-wide">TARE STUDIO</h3>
            <p className="max-w-xs mx-auto mb-8 leading-relaxed text-gray-600 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>Our staged performance. World-class coffee reconstructed into experimental formats. Immersive audio, and a live monologue. Set inside an all-white gallery.</p>
            <div className="mt-auto pt-6">
              <Image src="/images/rock2.png" alt="Rock 2" width={120} height={120} className="mx-auto" style={{ height: '8rem', width: 'auto' }} />
            </div>
          </div>

          {/* Column 2: ROOM */}
          <div className="flex flex-col items-center">
            <h2 style={{ fontFamily: 'FragmentMono, monospace' }} className="text-lg mb-4 tracking-wider">02</h2>
            <h3 style={{ fontFamily: 'NonBureauExtended, sans-serif' }} className="text-2xl mb-6 tracking-wide">TARE ROOM</h3>
            <p className="max-w-xs mx-auto mb-8 leading-relaxed text-gray-600 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>Our signature coffee omakase in our all-white studio.</p>
            <p className="max-w-xs mx-auto mb-8 leading-relaxed text-gray-600 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>Rare coffees, experimental brewing techniques, and early previews of what we're working on.</p>
            <div className="mt-auto pt-6">
              <Image src="/images/rock4.png" alt="Rock 4" width={120} height={120} className="mx-auto" style={{ height: '8rem', width: 'auto' }} />
            </div>
          </div>

          {/* Column 3: RUNWAY */}
          <div className="flex flex-col items-center">
            <h2 style={{ fontFamily: 'FragmentMono, monospace' }} className="text-lg mb-4 tracking-wider">03</h2>
            <h3 style={{ fontFamily: 'NonBureauExtended, sans-serif' }} className="text-2xl mb-6 tracking-wide">TARE RUNWAY</h3>
            <p className="max-w-xs mx-auto mb-8 leading-relaxed text-gray-600 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>Massive coffee events for brands, collaborators, and cultural moments. Built to be seen.</p>
            <div className="mt-auto pt-6">
              <Image src="/images/rock3.png" alt="Rock 3" width={120} height={120} className="mx-auto" style={{ height: '8rem', width: 'auto' }} />
            </div>
          </div>

        </div>
      </section>

      {/* Section 3: Priority List Form */}
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            className="w-full max-w-xl mx-auto px-6 py-24"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="text-center mb-16">
              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-2" style={{ fontFamily: 'FragmentMono, monospace' }}>Next available session</p>
                <p className="text-white text-lg mb-1" style={{ fontFamily: 'FragmentMono, monospace' }}>TARE STUDIO 02 · August, 2025 · 18 seats
                </p>
                <p className="text-gray-300 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>Midtown NYC · Exact date TBA</p>
              </div>
              
              <div className="w-16 h-px bg-gray-400 mx-auto mb-8 opacity-80"></div>
              
            </div>
            
            {/* Line 43 running across full screen (edge-to-edge) */}
            <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }} className="mb-0">
              <img
                src="/images/Line 43.png"
                alt="Line 43"
                style={{ width: '100vw', height: 'auto', display: 'block' }}
              />
              <img
                src="/images/Group 24.png"
                alt="Group 24"
                style={{ width: '100vw', height: 'auto', display: 'block' }}
              />
            </div>
            
            <div className="text-center mb-8" style={{ paddingTop: '2rem' }}>
              <div className="mb-8">
                <p className="text-gray-200 text-base mb-4" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>INVITE ONLY</p>
                <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  We release seats by text to people on the list.<br/>
                  No public tickets.
                </p>
              </div>
              <h2 
                className="text-2xl md:text-3xl font-light tracking-wider"
                style={{ fontFamily: 'NonBureauExtended, sans-serif' }}
              >
                JOIN THE WAITLIST
              </h2>
            </div>
            
             {error && (
               <motion.div
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-red-400 text-sm text-center mb-6"
               >
                 {error}
               </motion.div>
             )}
 
             <div className="relative flex flex-row justify-center items-stretch">
                {/* Removed vertical lines 41 and 42 as requested */}
                <div className="flex-1 min-w-0">
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-8"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" variants={itemVariants}>
                      <input type="text" name="firstName" required placeholder="First" className="w-full bg-transparent border-b py-3 text-sm tracking-wide placeholder-gray-400" style={{ fontFamily: 'FragmentMono, monospace', borderColor: '#FFFBF5' }} disabled={isSubmitting}/>
                      <input type="text" name="lastName" required placeholder="Last" className="w-full bg-transparent border-b py-3 text-sm tracking-wide placeholder-gray-400" style={{ fontFamily: 'FragmentMono, monospace', borderColor: '#FFFBF5' }} disabled={isSubmitting}/>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <input type="tel" name="phone" required placeholder="Phone" className="w-full bg-transparent border-b py-3 text-sm tracking-wide placeholder-gray-400" style={{ fontFamily: 'FragmentMono, monospace', borderColor: '#FFFBF5' }} disabled={isSubmitting}/>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <input type="email" name="email" required placeholder="Email" className="w-full bg-transparent border-b py-3 text-sm tracking-wide placeholder-gray-400" style={{ fontFamily: 'FragmentMono, monospace', borderColor: '#FFFBF5' }} disabled={isSubmitting}/>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <input type="text" name="instagram" placeholder="Instagram Handle (Optional)" className="w-full bg-transparent border-b py-3 text-sm tracking-wide placeholder-gray-400" style={{ fontFamily: 'FragmentMono, monospace', borderColor: '#FFFBF5' }} disabled={isSubmitting} onChange={handleInstagramChange}/>
                      <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'FragmentMono, monospace' }}>e.g. @tarestudionyc</p>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <textarea name="why" placeholder="What brings you to TARE? (Optional)" className="w-full bg-transparent border-b py-3 text-sm tracking-wide placeholder-gray-400 resize-none" rows={2} style={{ fontFamily: 'FragmentMono, monospace', borderColor: '#FFFBF5' }} disabled={isSubmitting}/>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed" style={{ fontFamily: 'FragmentMono, monospace' }}>
                        hunting for an insane cup - gotta try your ombligon<br/>
                        Saw you on ig, looks wild<br/>
                        Need a ridiculous surprise for my Bf's birthday<br/>
                        i'm a coffee grader, curious what else is out there<br/>
                        saw the cube brewer on chris's story<br/>
                        in town for a couple days and have to check it out
                      </p>
                    </motion.div>
                    <motion.div variants={itemVariants} className="text-center">
                      <p className="text-gray-400 text-xs mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>Invites only. No marketing or spam.</p>
                    </motion.div>
                    <motion.button
                      type="submit"
                      className="w-full bg-transparent border border-white py-4 text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                      variants={itemVariants}
                      style={{ fontFamily: 'NonBureauExtended, sans-serif' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                    </motion.button>
                    <p className="text-gray-300 text-sm tracking-wide leading-relaxed max-w-md mx-auto" style={{ fontFamily: 'FragmentMono, monospace' }}>We review every request and text private invites when seats open.</p>
                    {/* Edge-to-edge section: Group 25 above Line 44 */}
                    <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10, marginTop: '2rem' }}>
                      <img
                        src="/images/Group 25.png"
                        alt="Group 25"
                        style={{ width: '100vw', height: 'auto', display: 'block' }}
                      />
                      <img
                        src="/images/Line 44.png"
                        alt="Line 44"
                        style={{ width: '100vw', height: 'auto', display: 'block' }}
                      />
                    </div>
                  </motion.form>
                </div>
              </div>
           </motion.div>
         ) : (
           <motion.div
             key="success"
             className="text-center py-24"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <h1 className="text-2xl md:text-3xl font-light tracking-wider mb-6">THANK YOU</h1>
             <p className="text-gray-400 text-sm tracking-wide leading-relaxed max-w-md mx-auto">
               You have been added to our waitlist. We will be in touch when new experiences become available.
             </p>
           </motion.div>
         )}
       </AnimatePresence>
    </main>
  );
}