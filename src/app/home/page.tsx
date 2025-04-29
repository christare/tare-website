"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // Check if we're in production by looking at the hostname
    const hostname = window.location.hostname;
    setIsProduction(hostname.includes('tarecoffeeroom.com'));
  }, []);

  const priorityListUrl = isProduction ? "https://tarecoffeeroom.com/" : "http://localhost:3000/";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/home" className="text-white text-xl font-light">
              TARE
            </Link>
            <div>
              <Link 
                href={priorityListUrl}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
              >
                PRIORITY LIST
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-light mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            TARE is a coffee tasting — reimagined as an experimental ritual.
          </motion.h1>
          <motion.div
            className="w-12 h-px bg-white mx-auto mb-12"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <motion.p
            className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Each session unfolds like a cinematic journey — rare coffees, intentional pacing, and sensory storytelling crafted to imprint emotion, presence, and memory.
          </motion.p>
        </div>
      </section>

      {/* Formats Section */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl md:text-3xl font-light mb-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            We host three core formats:
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-light mb-4">ROOM</h3>
              <p className="text-gray-400">
                Private table tastings in Long Island City
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-light mb-4">STUDIO</h3>
              <p className="text-gray-400">
                Flagship, large-format immersive events
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-xl font-light mb-4">RUNWAY</h3>
              <p className="text-gray-400">
                Cultural collaborations and creative releases
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            className="text-xl text-gray-300 mb-16 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Every experience is limited-run, invite-only, and designed to leave a lasting impression.
          </motion.p>
          <motion.div
            className="text-gray-400 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="mb-6">
            We don’t publicly post availability — most rooms fill privately through the Priority List before ever being announced.
            </p>
            <p>
            Join the Priority List for early access and first invitations when new rooms open.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href={priorityListUrl}>
              <button className="border border-white px-10 py-4 text-sm hover:bg-white hover:text-black transition-all duration-300">
                PRIORITY LIST
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 