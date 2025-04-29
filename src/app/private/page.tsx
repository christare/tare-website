"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PrivatePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    dateStart: "",
    dateEnd: "",
    preferredTime: "",
    guestCount: "",
    location: "",
    details: "",
    dateSubmitted: ""
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Set submission date (client-side generated)
    const currentDate = new Date().toISOString().split('T')[0];
    const submissionData = {
      ...formData,
      dateSubmitted: currentDate
    };

    try {
      const response = await fetch('/api/private', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      setFormSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-24">
      {/* Hero Section */}
      <section className="pt-12 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl md:text-5xl font-light mb-6">
              TARE PRIVATE
            </h1>
            <div className="w-12 h-px bg-white mx-auto mb-6" />
            <p className="text-sm md:text-base text-gray-400 tracking-wide max-w-xl mx-auto">
              Request a private omakase-style sensory journey for your group, corporate event, or special occasion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {!formSubmitted ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  }
                }
              }}
            >
              {error && (
                <div className="mb-8 p-4 border border-red-500 text-red-500 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Contact Information Section */}
                <motion.div variants={fadeIn} className="space-y-6">
                  <h2 className="text-xl font-light mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm text-gray-400 mb-1">
                        First Name*
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm text-gray-400 mb-1">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm text-gray-400 mb-1">
                      Company/Brand Name (optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
                        Email*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm text-gray-400 mb-1">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Event Details Section */}
                <motion.div variants={fadeIn} className="space-y-6">
                  <h2 className="text-xl font-light mb-6">Event Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="dateStart" className="block text-sm text-gray-400 mb-1">
                        Preferred Date (Start)*
                      </label>
                      <input
                        type="text"
                        id="dateStart"
                        name="dateStart"
                        required
                        placeholder="MM/DD/YYYY"
                        value={formData.dateStart}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide"
                      />
                    </div>
                    <div>
                      <label htmlFor="dateEnd" className="block text-sm text-gray-400 mb-1">
                        Preferred Date (End) (optional)
                      </label>
                      <input
                        type="text"
                        id="dateEnd"
                        name="dateEnd"
                        placeholder="MM/DD/YYYY"
                        value={formData.dateEnd}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="preferredTime" className="block text-sm text-gray-400 mb-1">
                        Preferred Time*
                      </label>
                      <input
                        type="text"
                        id="preferredTime"
                        name="preferredTime"
                        required
                        placeholder="e.g. 6:00 PM"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide"
                      />
                    </div>
                    <div>
                      <label htmlFor="guestCount" className="block text-sm text-gray-400 mb-1">
                        Guest Count*
                      </label>
                      <input
                        type="number"
                        id="guestCount"
                        name="guestCount"
                        required
                        min="1"
                        value={formData.guestCount}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm text-gray-400 mb-1">
                      Location Preference (optional)
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="e.g. TARE LIC, on-site at our office, etc."
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide"
                    />
                  </div>
                  <div>
                    <label htmlFor="details" className="block text-sm text-gray-400 mb-1">
                      Additional Details (optional)
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      rows={4}
                      placeholder="Tell us about your vision for this private experience..."
                      value={formData.details}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-2 text-sm tracking-wide resize-none"
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={fadeIn} className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full border border-white px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? "SUBMITTING..." : "REQUEST PRIVATE EXPERIENCE"}
                  </button>
                  <p className="text-gray-500 text-xs mt-4 text-center">
                    * Required fields
                  </p>
                </motion.div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-light mb-6">Thank You</h3>
              <div className="w-12 h-px bg-white mx-auto mb-8" />
              <p className="text-gray-400 mb-8">
                We've received your private experience request and will be in touch within 48 hours to discuss details and availability.
              </p>
              <Link href="/home">
                <button className="border border-white px-8 py-3 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300">
                  RETURN TO HOME
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
} 