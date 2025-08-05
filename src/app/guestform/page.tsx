"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Clean up - no longer needed font declarations

interface FormData {
  preferredName: string;
  allergies: string;
  coffeeRelationship: string;
  excitement: string;
  meaningfulDetails: string;
  joiningTogether: string;
  photoConsent: string;
}

export default function GuestFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    preferredName: "",
    allergies: "",
    coffeeRelationship: "",
    excitement: "",
    meaningfulDetails: "",
    joiningTogether: "",
    photoConsent: ""
  });

  // Redirect to home after successful submission
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted, router]);

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

    try {
      const response = await fetch("/api/guest-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Form submission error:", data);
        setError(data.details?.message || data.error || "Failed to submit preferences");
        setIsLoading(false);
        return;
      }
      
      // Handle successful submission
      console.log("Guest preferences submitted successfully:", data);
      setIsLoading(false);
      setSubmitted(true);
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
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-6"
          >
            <motion.div className="text-center">
              <h1 className="text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                Thank You
              </h1>
              <div className="w-16 h-px bg-gray-400 mx-auto mb-8 opacity-80" />
              <p className="text-gray-300 text-lg mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                Your preferences have been submitted successfully.
              </p>
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                Returning to home...
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl mx-auto px-6 py-12"
          >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-light mb-6 tracking-wide" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
            Guest Preference Form
          </h1>
          <p className="text-lg md:text-xl font-light tracking-wide mb-8" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
            For confirmed guests of TARE ROOM
          </p>
          <div className="w-16 h-px bg-gray-400 mx-auto mb-8 opacity-80" />
          <p className="text-gray-300 text-sm leading-relaxed max-w-lg mx-auto" style={{ fontFamily: 'FragmentMono, monospace' }}>
            To help us craft a more intentional and personal experience, we invite you to share a few details below. All responses are optional, and held in confidence."
          </p>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-lg mx-auto" style={{ fontFamily: 'FragmentMono, monospace' }}>
            If you're attending with a guest, please have them fill out the form separately.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form 
          variants={staggerContainer}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Question 1: Preferred Name */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2 tracking-wide" style={{ fontFamily: 'FragmentMono, monospace' }}>
                1. What name (or pronunciation) would you prefer we use during service?
              </h3>
              <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                We aim to welcome each guest with accuracy and warmth.
              </p>
            </div>
            <input
              type="text"
              name="preferredName"
              value={formData.preferredName}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            />
          </motion.div>

          {/* Question 2: Allergies */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2 tracking-wide" style={{ fontFamily: 'FragmentMono, monospace' }}>
                2. Are there any allergies, dietary restrictions, or ingredient preferences we should be mindful of?
              </h3>
              <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                We curate pairings with precision — let us know how we can serve you best.
              </p>
            </div>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              rows={3}
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white resize-none"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            />
          </motion.div>

          {/* Question 3: Coffee Relationship */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2 tracking-wide" style={{ fontFamily: 'FragmentMono, monospace' }}>
                3. How would you describe your current relationship with coffee?
              </h3>
              <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                e.g., daily ritual, specialty obsessive, occasional sipper, never drink it, etc.<br />
                (No expertise needed — this simply helps us guide your experience.)
              </p>
            </div>
            <textarea
              name="coffeeRelationship"
              value={formData.coffeeRelationship}
              onChange={handleChange}
              rows={3}
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white resize-none"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            />
          </motion.div>

          {/* Question 4: Excitement/Curiosity */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2 tracking-wide" style={{ fontFamily: 'FragmentMono, monospace' }}>
                4. Is there anything you're particularly excited or curious about?
              </h3>
              <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                We're happy to know what you're hoping to explore — flavor, storytelling, technique, ritual, etc.
              </p>
            </div>
            <textarea
              name="excitement"
              value={formData.excitement}
              onChange={handleChange}
              rows={3}
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white resize-none"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            />
          </motion.div>

          {/* Question 5: Meaningful Experience */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2 tracking-wide" style={{ fontFamily: 'FragmentMono, monospace' }}>
                5. Lastly, is there anything you'd like us to know to help make this a meaningful experience for you?
              </h3>
              <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                This could be something recent in your life, a reason for attending, or simply how you're arriving into the room.
              </p>
            </div>
            <textarea
              name="meaningfulDetails"
              value={formData.meaningfulDetails}
              onChange={handleChange}
              rows={4}
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white resize-none"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            />
          </motion.div>

          {/* Visual Divider */}
          <motion.div variants={itemVariants} className="py-8">
            <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }}>
              <Image
                src="/images/Line 43.png"
                alt="Line 43"
                width={1920}
                height={100}
                style={{ width: '100vw', height: 'auto', display: 'block', opacity: '0.3' }}
              />
            </div>
          </motion.div>

          {/* Question 6: Joining Together */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2 tracking-wide" style={{ fontFamily: 'FragmentMono, monospace' }}>
                6. Will you be joining alongside someone who reserved separately?
              </h3>
              <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                So we can ensure you're seated together.
              </p>
            </div>
            <input
              type="text"
              name="joiningTogether"
              value={formData.joiningTogether}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            />
          </motion.div>

          {/* Question 7: Photo Consent */}
          <motion.div variants={itemVariants}>
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2 tracking-wide" style={{ fontFamily: 'FragmentMono, monospace' }}>
                7. Are you comfortable with us capturing photos or video during the event?
              </h3>
              <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                We will always check before sharing anything publicly.
              </p>
            </div>
            <input
              type="text"
              name="photoConsent"
              value={formData.photoConsent}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 text-white"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-12">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full border border-white px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              {isLoading ? "SUBMITTING..." : "SUBMIT PREFERENCES"}
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

        {/* Bottom visual divider */}
        <motion.div variants={itemVariants} className="pt-16">
          <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', zIndex: 10 }}>
            <Image
              src="/images/Line 44.png"
              alt="Line 44"
              width={1920}
              height={100}
              style={{ width: '100vw', height: 'auto', display: 'block', opacity: '0.3' }}
            />
          </div>
        </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}