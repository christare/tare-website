'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function StoryPage() {
  return (
    <main 
      className="min-h-screen text-white relative"
      style={{ backgroundColor: '#2A2726' }}
    >
      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <Image
          src="/images/Group 15.png"
          alt="Background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-32 md:pt-40 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center mb-16 md:mb-20 px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <Image
              src="/FinalDelivery/symbols/Artifacts/pngs/TARE-room-artifact-white.png"
              alt="TARE Artifact"
              width={101}
              height={101}
              className="w-[60px] md:w-[80px] h-auto"
            />
          </motion.div>
          <h1 
            className="text-xs sm:text-sm tracking-[0.3em] mb-6 text-[#A39B8B]"
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            OUR STORY
          </h1>
        </motion.div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-3xl mx-auto px-6 md:px-8"
        >
          <article className="text-[#E8E3DD]">
            {/* Section 1: The Beginning */}
            <div className="space-y-6 mb-12">
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.8' }}
              >
                I spent years battling a medical condition that destroyed my trust in reality. Treatment worked - I was one of the lucky ones.
              </p>
              
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.8' }}
              >
                But I felt lost on a planet I didn't recognize. I needed a way back into the physical world.
              </p>
              
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.8' }}
              >
                I became a barista. The daily ritual - the precise movements, the sensory focus, the tangible results - became my anchor. Tasting with full awareness wasn't about coffee. It was a practice for rebuilding my connection to reality.
              </p>
              
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.8' }}
              >
                It felt worth sharing. I started hosting tastings, expecting people would come for rare, expensive coffees.
              </p>
            </div>

            {/* Section 2: The Discovery */}
            <div className="space-y-6 mb-12">
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.8' }}
              >
                They didn't.
              </p>
              
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.8' }}
              >
                They'd tasted coffee their entire lives. But the design of the lineup, the guided attention, the deliberate contrasts - suddenly they could feel the nuance they'd never noticed before. Coffee became both the teaching tool and the proof it worked.
              </p>
            </div>

            {/* Section 3: The Team */}
            <div className="mb-12">
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.8' }}
              >
                People found TARE and asked to be part of it. They experienced it once and knew it mattered. Next thing I knew, we had a team.
              </p>
            </div>
            
            {/* Section 4: The Method */}
            <div className="space-y-6 mb-12">
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.8' }}
              >
                We discovered that coffee could train not just your palate, but all your senses. More importantly, it could deepen your awareness of daily experience itself.
              </p>
              
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.8' }}
              >
                We developed a guided protocol, drawing from neuroscience, somatic therapy, and contemplative traditions worldwide.
              </p>
              
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'FragmentMono, monospace', lineHeight: '1.8' }}
              >
                We're not making medical or metaphysical claims. We're exploring the raw nature of your sensory experience. Coffee is just the most rigorous, accessible way to do it.
              </p>
            </div>

            {/* Section 5: The Closing */}
            <div className="space-y-6 pt-8">
              <p 
                className="text-base sm:text-lg leading-relaxed"
                style={{ fontFamily: 'NonBureauExtended, sans-serif', fontWeight: 300 }}
              >
                See you in the STUDIO.
              </p>
              
              <p 
                className="text-sm tracking-wider"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              >
                Chris, Founder @ TARE
              </p>
            </div>
          </article>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-16"
          >
            <a
              href="/"
              className="inline-block border border-white px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              EXPERIENCE THE STUDIO
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom Spacer */}
        <div className="h-32"></div>
      </div>
    </main>
  );
}

