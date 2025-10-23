"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Clean up - no longer needed font declarations

interface FormData {
  phoneNumber: string;
  preferredName: string;
  attendingWith: string;
  attendingWithWho: string;
  pronouns: string;
  coffeeRelationship: string;
  wellnessExperience: string;
  intentions: string;
  dietaryRestrictions: string;
  scentSensitivity: string;
  howHeard: string;
}

export default function GuestFormPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    preferredName: "",
    attendingWith: "",
    attendingWithWho: "",
    pronouns: "",
    coffeeRelationship: "",
    wellnessExperience: "",
    intentions: "",
    dietaryRestrictions: "",
    scentSensitivity: "",
    howHeard: ""
  });

  // Calculate total steps
  const getTotalSteps = () => {
    return 9; // Fixed number of steps
  };

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

  const handleNext = () => {
    setDirection(1);
    setCurrentStep(currentStep + 1);
    setError("");
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep(currentStep - 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent, isRequired: boolean = false) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (isRequired && !target.value.trim()) {
        setError("This field is required");
        return;
      }
      if (currentStep < getTotalSteps()) {
        handleNext();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/form", {
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

  // Track direction for animations
  const [direction, setDirection] = useState(0);

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Navigation buttons component
  const renderNavigation = (showBack: boolean = true, showSkip: boolean = true, isLastStep: boolean = false) => (
    <div className="flex justify-between items-center gap-4 mt-8">
      {showBack && currentStep > 0 ? (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="px-6 py-3 text-sm tracking-wide text-gray-400 hover:text-white transition-colors"
          style={{ fontFamily: 'FragmentMono, monospace' }}
        >
          ← Back
        </motion.button>
      ) : (
        <div />
      )}
      <div className="flex gap-3">
        {showSkip && currentStep > 0 && !isLastStep && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext}
            className="px-6 py-3 text-sm tracking-wide text-gray-500 hover:text-gray-300 transition-colors"
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            Skip
          </motion.button>
        )}
        {isLastStep ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleSubmit}
            disabled={isLoading || !formData.phoneNumber}
            className="px-8 py-3 bg-white text-black text-sm tracking-wide hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            {isLoading ? "Submitting..." : "Submit ✓"}
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={currentStep === 0 ? () => {
              if (!formData.phoneNumber) {
                setError("Phone number is required");
                return;
              }
              handleNext();
            } : handleNext}
            className="px-8 py-3 bg-white text-black text-sm tracking-wide hover:bg-gray-200 transition-all duration-300"
            style={{ fontFamily: 'FragmentMono, monospace' }}
          >
            Continue →
          </motion.button>
        )}
      </div>
    </div>
  );

  // Step rendering function
  const renderStep = () => {
    const name = formData.preferredName || "there";
    
    switch (currentStep) {
      case 0:
        return (
          <>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm tracking-widest text-gray-500 mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  YOUR DETAILS
                </p>
                <p className="text-3xl md:text-4xl font-light mb-2 leading-relaxed" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                  Phone Number
                </p>
                <p className="text-gray-500 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  Required
                </p>
              </motion.div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e, true)}
                required
                autoFocus
                placeholder="(555) 123-4567"
                className="w-full bg-transparent border-b-2 border-gray-700 focus:outline-none focus:border-white py-4 text-xl tracking-wide placeholder-gray-600 text-white transition-colors"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              />
            </div>
            {renderNavigation(false, false)}
          </>
        );
      
      case 1:
        return (
          <>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-3xl md:text-4xl font-light leading-relaxed" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                  What name do you prefer to go by?
                </p>
              </motion.div>
              <input
                type="text"
                name="preferredName"
                value={formData.preferredName}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e)}
                autoFocus
                placeholder="Your preferred name"
                className="w-full bg-transparent border-b-2 border-gray-700 focus:outline-none focus:border-white py-4 text-xl tracking-wide placeholder-gray-600 text-white transition-colors"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              />
            </div>
            {renderNavigation()}
          </>
        );

      case 2:
        return (
          <>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-3xl md:text-4xl font-light mb-2 leading-relaxed" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                  What are your pronouns?
                </p>
                <p className="text-gray-500 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  Optional
                </p>
              </motion.div>
              <input
                type="text"
                name="pronouns"
                value={formData.pronouns}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e)}
                autoFocus
                placeholder="she/her, he/him, they/them..."
                className="w-full bg-transparent border-b-2 border-gray-700 focus:outline-none focus:border-white py-4 text-xl tracking-wide placeholder-gray-600 text-white transition-colors"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              />
            </div>
            {renderNavigation()}
          </>
        );

      case 3:
        return (
          <>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-3xl md:text-4xl font-light mb-2 leading-relaxed" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                  Are you attending with anyone?
                </p>
                <p className="text-gray-400 text-sm italic" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  If yes, write their name(s). This helps us with seating and group dynamics.
                </p>
              </motion.div>
              <input
                type="text"
                name="attendingWith"
                value={formData.attendingWith}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e)}
                autoFocus
                placeholder="e.g., Sarah and John, or just skip if attending alone"
                className="w-full bg-transparent border-b-2 border-gray-700 focus:outline-none focus:border-white py-4 text-xl tracking-wide placeholder-gray-600 text-white transition-colors"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              />
            </div>
            {renderNavigation()}
          </>
        );

      case 4:
        return (
          <>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm tracking-widest text-gray-500 mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  COFFEE BACKGROUND
                </p>
                <p className="text-3xl md:text-4xl font-light mb-3 leading-relaxed" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                  What's your relationship with coffee?
                </p>
                <p className="text-gray-400 text-sm italic" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  Tell us how coffee fits into your life—casual drinker, daily ritual, enthusiast, professional, or something else entirely.
                </p>
              </motion.div>
              <textarea
                name="coffeeRelationship"
                value={formData.coffeeRelationship}
                onChange={handleChange}
                autoFocus
                rows={4}
                placeholder="Your coffee story..."
                className="w-full bg-transparent border-b-2 border-gray-700 focus:outline-none focus:border-white py-4 text-lg tracking-wide placeholder-gray-600 text-white resize-none transition-colors"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              />
            </div>
            {renderNavigation()}
          </>
        );

      case 5:
        return (
          <>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm tracking-widest text-gray-500 mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  WELLNESS EXPERIENCE
                </p>
                <p className="text-3xl md:text-4xl font-light mb-3 leading-relaxed" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                  What's your experience with meditation or wellness practices?
                </p>
                <p className="text-gray-400 text-sm italic" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  Have you tried meditation, breathwork, yoga, or other attention-based practices? What's your current routine, if any?
                </p>
              </motion.div>
              <textarea
                name="wellnessExperience"
                value={formData.wellnessExperience}
                onChange={handleChange}
                autoFocus
                rows={4}
                placeholder="Your experience..."
                className="w-full bg-transparent border-b-2 border-gray-700 focus:outline-none focus:border-white py-4 text-lg tracking-wide placeholder-gray-600 text-white resize-none transition-colors"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              />
            </div>
            {renderNavigation()}
          </>
        );

      case 6:
        return (
          <>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm tracking-widest text-gray-500 mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  INTENTIONS
                </p>
                <p className="text-3xl md:text-4xl font-light mb-3 leading-relaxed" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                  What are you hoping to get from this experience?
                </p>
                <p className="text-gray-400 text-sm italic" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  What drew you to TARE? What would make this session valuable for you?
                </p>
              </motion.div>
              <textarea
                name="intentions"
                value={formData.intentions}
                onChange={handleChange}
                autoFocus
                rows={4}
                placeholder="Your intentions..."
                className="w-full bg-transparent border-b-2 border-gray-700 focus:outline-none focus:border-white py-4 text-lg tracking-wide placeholder-gray-600 text-white resize-none transition-colors"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              />
            </div>
            {renderNavigation()}
          </>
        );

      case 7:
        return (
          <>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm tracking-widest text-gray-500 mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  DIETARY NOTES
                </p>
                <p className="text-3xl md:text-4xl font-light mb-3 leading-relaxed" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                  Any dietary restrictions or allergies we should know about?
                </p>
                <p className="text-gray-400 text-sm italic" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  (We're serving coffee with cereal as a pairing)
                </p>
              </motion.div>
              <textarea
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleChange}
                autoFocus
                rows={3}
                placeholder="Any dietary needs..."
                className="w-full bg-transparent border-b-2 border-gray-700 focus:outline-none focus:border-white py-4 text-lg tracking-wide placeholder-gray-600 text-white resize-none transition-colors"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              />
            </div>
            {renderNavigation()}
          </>
        );

      case 8:
        return (
          <>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm tracking-widest text-gray-500 mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  SCENT SENSITIVITY
                </p>
                <p className="text-3xl md:text-4xl font-light mb-3 leading-relaxed" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                  Do you have any sensitivities to strong scents or fragrances?
                </p>
                <p className="text-gray-400 text-sm italic" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  We use potent aromas as part of the sensory protocol.
                </p>
              </motion.div>
              <input
                type="text"
                name="scentSensitivity"
                value={formData.scentSensitivity}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e)}
                autoFocus
                placeholder="Yes / No / Details..."
                className="w-full bg-transparent border-b-2 border-gray-700 focus:outline-none focus:border-white py-4 text-lg tracking-wide placeholder-gray-600 text-white transition-colors"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              />
            </div>
            {renderNavigation()}
          </>
        );

      case 9:
        return (
          <>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm tracking-widest text-gray-500 mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  HOW YOU FOUND US
                </p>
                <p className="text-3xl md:text-4xl font-light leading-relaxed" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                  How did you hear about TARE?
                </p>
              </motion.div>
              <input
                type="text"
                name="howHeard"
                value={formData.howHeard}
                onChange={handleChange}
                onKeyPress={(e) => handleKeyPress(e)}
                autoFocus
                placeholder="Instagram, friend, coffee community..."
                className="w-full bg-transparent border-b-2 border-gray-700 focus:outline-none focus:border-white py-4 text-lg tracking-wide placeholder-gray-600 text-white transition-colors"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              />
            </div>
            {renderNavigation(true, true, true)}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen text-white" style={{backgroundColor: '#2A2726'}}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="min-h-screen flex flex-col items-center justify-center px-6"
          >
            <motion.div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-5xl">✓</span>
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl font-light mb-6 tracking-wide" 
                style={{ fontFamily: 'NonBureauExtended, sans-serif' }}
              >
                {formData.preferredName ? `Thank you, ${formData.preferredName}` : "Thank You"}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-16 h-px bg-gray-400 mx-auto mb-8 opacity-80" />
                <p className="text-gray-300 text-lg mb-4" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  We can't wait to share this experience with you
                </p>
                <p className="text-gray-400 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  See you soon at TARE...
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <div key="form" className="min-h-screen flex flex-col">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4A574] to-[#C4956A]"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep + 1) / (getTotalSteps() + 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Header with Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center pt-16 pb-8 px-6"
            >
              <h1 className="text-2xl md:text-3xl font-light tracking-wide text-gray-300" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
                TARE Pre-Event Form
              </h1>
              <p className="text-sm text-gray-400 mt-4 mb-3 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'FragmentMono, monospace' }}>
                We use these responses to personalize your experience and create the best session possible
              </p>
              <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'FragmentMono, monospace' }}>
                Step {currentStep + 1} of {getTotalSteps() + 1}
              </p>
            </motion.div>

            {/* Step Container */}
            <div className="flex-1 flex items-center justify-center px-6 pb-16">
              <div className="w-full max-w-2xl">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                  >
                    {renderStep()}
                    
                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-4"
                        >
                          <p className="text-red-400 text-sm text-center" style={{ fontFamily: 'FragmentMono, monospace' }}>
                            {error}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>
        )}
      </AnimatePresence>
    </main>
  );
}