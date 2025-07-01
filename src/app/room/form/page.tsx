"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Font declarations for custom typography
const engineeredStyle = {
  fontFamily: "'Inter', 'SF Pro Display', 'Roboto', sans-serif",
  fontWeight: "200",
  letterSpacing: "0.05em"
};

const monospaceStyle = {
  fontFamily: "'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace",
  letterSpacing: "0.02em"
};

interface FormData {
  name: string;
  coffeeRelationship: string;
  allergies: string;
  referralSource: string;
  meaningfulDetails: string;
  instagram: string;
}

export default function RoomFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    coffeeRelationship: "",
    allergies: "",
    referralSource: "",
    meaningfulDetails: "",
    instagram: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate required fields
    const requiredFields = ['name', 'coffeeRelationship', 'allergies', 'referralSource', 'meaningfulDetails'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData].trim());
    
    if (missingFields.length > 0) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/room-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Form submission error:", data);
        setError(data.details?.message || data.error || "Failed to submit form");
        setIsLoading(false);
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("No checkout URL returned");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Something went wrong with the form submission");
      setIsLoading(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.04, 0.62, 0.23, 0.98] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] } 
    }
  };

  return (
    <main className="min-h-screen text-white pt-24" style={{backgroundColor: '#2A2726'}}>
      <motion.div
        key="content"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-2xl mx-auto px-6 py-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-light mb-6 tracking-wide">
            <div className="flex flex-col items-center">
              <Image
                src="/images/TARE LOGOS/Logo02/rgb-web/white/tare-logo02-white-rgb.svg"
                alt="TARE"
                width={180}
                height={68}
                className="h-16 md:h-20 w-auto mb-1"
              />
              <span className="text-xl md:text-2xl font-light tracking-wide" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>ROOM</span>
            </div>
          </h1>
          <div className="w-12 h-px bg-white mx-auto mb-8" />
          <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto" style={monospaceStyle}>
            Hey, I'm Chris - the creator of TARE. Just a few quick questions. I use your answers to design the lineup specifically for your group.<br /><br />I source some of the wildest, rarest coffees on the planet, and I curate every brew method to create something unforgettable for you.<br /><br />See you soon.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form 
          variants={staggerContainer}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Name */}
          <motion.div variants={itemVariants}>
            <label className="block text-gray-300 text-sm mb-3 tracking-wide" style={engineeredStyle}>
              What name should we use during your service?
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="First name is perfect."
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white"
              style={engineeredStyle}
              required
            />
          </motion.div>

          {/* Coffee Relationship */}
          <motion.div variants={itemVariants}>
            <label className="block text-gray-300 text-sm mb-3 tracking-wide" style={engineeredStyle}>
              What's your relationship with coffee right now?
            </label>
            <textarea
              name="coffeeRelationship"
              value={formData.coffeeRelationship}
              onChange={handleChange}
              placeholder="Examples: Office coffee fan. Home brewing nerd. What's coffee? Iced latte ride-or-die. And so on."
              rows={3}
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white resize-none"
              style={engineeredStyle}
              required
            />
          </motion.div>

          {/* Allergies */}
          <motion.div variants={itemVariants}>
            <label className="block text-gray-300 text-sm mb-3 tracking-wide" style={engineeredStyle}>
              Any allergies or dietary restrictions?
            </label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="It's pretty much all coffee, but we occasionally add light pairings."
              rows={3}
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white resize-none"
              style={engineeredStyle}
              required
            />
          </motion.div>

          {/* Referral Source */}
          <motion.div variants={itemVariants}>
            <label className="block text-gray-300 text-sm mb-3 tracking-wide" style={engineeredStyle}>
              What brought you to TARE?
            </label>
            <input
              type="text"
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
              placeholder="Instagram? Friend's recommendation? Random URL generator?"
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white"
              style={engineeredStyle}
              required
            />
          </motion.div>

          {/* Meaningful Details */}
          <motion.div variants={itemVariants}>
            <label className="block text-gray-300 text-sm mb-3 tracking-wide" style={engineeredStyle}>
              Is there anything we should know to make this tasting meaningful for you?
            </label>
            <textarea
              name="meaningfulDetails"
              value={formData.meaningfulDetails}
              onChange={handleChange}
              placeholder="Could be flavor preferences, who you're coming with, special occasion, etc."
              rows={3}
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white resize-none"
              style={engineeredStyle}
              required
            />
          </motion.div>

          {/* Instagram (Optional) */}
          <motion.div variants={itemVariants}>
            <label className="block text-gray-300 text-sm mb-3 tracking-wide" style={engineeredStyle}>
              Instagram <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="Just helps us know who's in the room. We'll never tag without permission."
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white"
              style={engineeredStyle}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full border border-white px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              {isLoading ? "PROCESSING..." : "PROCEED TO CHECKOUT"}
            </button>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-4 text-center"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </motion.form>

        {/* Back Button */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-12"
        >
          <button
            onClick={() => router.push('/room')}
            className="text-gray-400 text-sm tracking-wide hover:text-white transition-all duration-300"
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            ← BACK TO ROOM
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
} 