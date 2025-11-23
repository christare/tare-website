"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function RoomPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
    <main style={{ backgroundColor: '#2A2726' }} className="text-white pt-20 md:pt-16">
      {/* Event Available Callout */}
      <div className="w-full py-4 md:py-6 px-6 mb-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <p className="text-white text-sm md:text-base font-light flex items-center justify-center gap-3" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
            <span>Saturday December 6</span>
            <span className="text-xs md:text-sm">•</span>
            <span>Seats Available</span>
          </p>
          <p className="text-gray-400 text-xs md:text-sm flex items-center justify-center gap-3" style={{ fontFamily: 'FragmentMono, monospace' }}>
            <span>11:00 AM - 1:00 PM</span>
            <span className="text-xs md:text-sm">•</span>
            <span>Midtown NYC</span>
          </p>
          <a 
            href="/" 
            className="inline-block mt-2 px-6 py-2 border border-gray-400 text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-xs md:text-sm"
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            VIEW EVENT & BOOK →
          </a>
        </div>
      </div>

      {/* Hero dial, logo, and subheader - TEMPORARILY HIDDEN */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center relative hidden" style={{ backgroundColor: '#2A2726' }}>
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
          
          {/* CTA Button */}
          <motion.button
            onClick={scrollToWaitlist}
            className="mt-12 border border-white px-8 py-3 text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300"
            style={{ fontFamily: 'NonBureauExtended, sans-serif' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            JOIN THE WAITLIST
          </motion.button>
        </div>
      </div>

      {/* Section 1: Intro text - TEMPORARILY HIDDEN */}
      <section className="text-center py-24 px-6 hidden">
        <p style={{ fontFamily: 'FragmentMono, monospace' }} className="text-gray-400">We host three kinds of public events:</p>
        <div className="w-12 h-px bg-white mx-auto mt-6 opacity-30" />
      </section>

      {/* Section 2: Main content (light) - TEMPORARILY HIDDEN */}
      <section style={{ backgroundColor: '#FCF7F1', color: '#2A2726' }} className="py-24 sm:py-32 px-6 hidden">
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
             id="waitlist-form"
             key="form"
             className="w-full mx-auto px-6"
             initial="hidden"
             animate="visible"
             variants={containerVariants}
           >
             {/* Top decorative lines */}
             <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }} className="mb-20">
               <img
                 src="/images/Line 43.png"
                 alt="Decorative line"
                 style={{ width: '100vw', height: 'auto', display: 'block' }}
               />
               <img
                 src="/images/Group 24.png"
                 alt="Decorative pattern"
                 style={{ width: '100vw', height: 'auto', display: 'block' }}
               />
             </div>

             <div className="max-w-6xl mx-auto relative">
               {/* Vertical lines on left and right - desktop only */}
               <div className="hidden md:block absolute left-12 lg:left-20 top-0 bottom-0 w-px bg-gray-400 opacity-20"></div>
               <div className="hidden md:block absolute right-12 lg:right-20 top-0 bottom-0 w-px bg-gray-400 opacity-20"></div>
               
               <div className="max-w-xl mx-auto">
               <div className="text-center mb-16">
                 <h1 
                   className="text-3xl md:text-4xl font-light tracking-wider mb-6"
                   style={{ fontFamily: 'NonBureauExtended, sans-serif' }}
                 >
                   JOIN THE WAITLIST
                 </h1>
                 <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-8" style={{ fontFamily: 'FragmentMono, monospace' }}>
                   Get notified about future sessions and exclusive product drops before public release.
                 </p>
                 
                 <div className="w-16 h-px bg-gray-400 mx-auto opacity-80"></div>
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
                      <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'FragmentMono, monospace' }}>e.g. @yourusername</p>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <textarea name="why" placeholder="What brings you to TARE? (Optional)" className="w-full bg-transparent border-b py-3 text-sm tracking-wide placeholder-gray-400 resize-none" rows={3} style={{ fontFamily: 'FragmentMono, monospace', borderColor: '#FFFBF5' }} disabled={isSubmitting}/>
                    </motion.div>
                    <motion.button
                      type="submit"
                      className="w-full bg-transparent border border-white py-4 text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                      variants={itemVariants}
                      style={{ fontFamily: 'NonBureauExtended, sans-serif' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'JOIN WAITLIST'}
                    </motion.button>
                    <motion.div variants={itemVariants} className="text-center mt-6 mb-16">
                      <p className="text-gray-400 text-xs mb-2" style={{ fontFamily: 'FragmentMono, monospace' }}>
                        We text invites before public release.
                      </p>
                      <p className="text-gray-500 text-xs" style={{ fontFamily: 'FragmentMono, monospace' }}>
                        No spam. Unsubscribe anytime.
                      </p>
                    </motion.div>
                  </motion.form>
                </div>
              </div>
               </div>
             </div>

             {/* Bottom decorative lines */}
             <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }} className="mt-16">
               <img
                 src="/images/Group 25.png"
                 alt="Decorative pattern"
                 style={{ width: '100vw', height: 'auto', display: 'block' }}
               />
               <img
                 src="/images/Line 44.png"
                 alt="Decorative line"
                 style={{ width: '100vw', height: 'auto', display: 'block' }}
               />
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
       
       {/* Instagram Footer Section */}
       <section className="text-center py-16 px-6 border-t border-gray-800">
         <div className="max-w-xl mx-auto">
           <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: 'FragmentMono, monospace' }}>
             Follow along for updates, behind-the-scenes, and announcements
           </p>
           <a
             href="https://instagram.com/tarestudionyc"
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center gap-3 border border-white px-6 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300"
             style={{ fontFamily: 'FragmentMono, monospace' }}
           >
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
             </svg>
             @TARESTUDIONYC
           </a>
         </div>
       </section>
    </main>
  );
}