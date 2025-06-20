                        "use client";

                        import { motion } from "framer-motion";
                        import { useState, useEffect } from "react";
                        import { useRouter } from "next/navigation";
                        import Image from "next/image";

                        export default function RunwayPage() {
                          const router = useRouter();
                          const [formSubmitted, setFormSubmitted] = useState(false);
                          const [isSubmitting, setIsSubmitting] = useState(false);
                          const [error, setError] = useState("");
                          const [redirectCounter, setRedirectCounter] = useState(3);
                          const [formData, setFormData] = useState({
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: "",
                            company: "",
                            experienceType: "",
                            otherDescription: "",
                            dateStart: "",
                            dateEnd: "",
                            preferredTime: "",
                            guestCount: "",
                            location: "",
                            details: "",
                            dateSubmitted: ""
                          });

                          // Initialize state with empty selections to show placeholders
                          useEffect(() => {
                            // Empty values will make the placeholders display by default
                            setFormData(prev => ({ 
                              ...prev, 
                              experienceType: "",
                              preferredTime: "" 
                            }));
                          }, []);

                          // Handle redirect after form submission
                          useEffect(() => {
                            if (formSubmitted) {
                              // Start countdown to redirect
                              const interval = setInterval(() => {
                                setRedirectCounter(prev => {
                                  if (prev <= 1) {
                                    clearInterval(interval);
                                    // Use window.location instead of router for more reliable navigation
                                    window.location.href = '/home';
                                    return 0;
                                  }
                                  return prev - 1;
                                });
                              }, 1000);
                              
                              return () => clearInterval(interval);
                            }
                          }, [formSubmitted]);

                          const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                            const { name, value } = e.target;
                            setFormData(prev => ({ ...prev, [name]: value }));
                          };

                          const isOtherSelected = formData.experienceType === "other_private" || formData.experienceType === "other_collab";
                          
                          // Check if experience type is brand collaboration category
                          const isBrandCollaboration = ["brand_activation", "product_collab", "content_press", "other_collab"].includes(formData.experienceType);
                          
                          // Get dynamic placeholder text for details field based on experience type
                          const getDetailsPlaceholder = () => {
                            switch(formData.experienceType) {
                              case "private_corporate":
                                return "Tell us about your team's culture, any event themes, or vibe you're aiming for.";
                              case "private_launch":
                                return "What's the occasion? Any vision for how you'd like it to feel?";
                              case "private_retreat":
                                return "Describe your gathering and the kind of atmosphere you're envisioning.";
                              case "other_private":
                                return "Share anything that will help us imagine the ideal private experience for you.";
                              case "brand_activation":
                                return "What brand or product are we collaborating around? Any concept direction?";
                              case "product_collab":
                                return "What product are you imagining? What feeling or story should it evoke?";
                              case "content_press":
                                return "What kind of audience or story are you hoping to capture?";
                              case "other_collab":
                                return "Describe your idea.";
                              default:
                                return "Anything else we should know?";
                            }
                          };

                          // Validate form data
                          const validateForm = () => {
                            // Check required fields
                            if (!formData.experienceType) {
                              alert("Please select an experience type");
                              return false;
                            }
                            
                            if (isOtherSelected && !formData.otherDescription) {
                              alert("Please provide a brief description of your vision");
                              return false;
                            }
                            
                            if (!formData.preferredTime) {
                              alert("Please select a preferred time range");
                              return false;
                            }
                            
                            // Validate date range - must be in future and in correct order
                            const today = new Date();
                            today.setHours(0, 0, 0, 0); // Start of today
                            
                            const startDate = new Date(formData.dateStart);
                            if (startDate < today) {
                              alert("Start date must be in the future");
                              return false;
                            }
                            
                            if (formData.dateEnd) {
                              const endDate = new Date(formData.dateEnd);
                              if (endDate < startDate) {
                                alert("End date must be after start date");
                                return false;
                              }
                            }
                            
                            // For private experiences, validate guest count
                            if (!isBrandCollaboration && (!formData.guestCount || parseInt(formData.guestCount) < 1)) {
                              alert("Please enter a valid number of guests");
                              return false;
                            }
                            
                            return true;
                          };

                          const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            setError("");
                            
                            // Validate form data
                            if (!validateForm()) {
                              return;
                            }
                            
                            setIsSubmitting(true);
                            
                            // Set the submission date with time and timezone
                            const now = new Date();
                            const dateSubmitted = now.toLocaleString('en-US', { 
                              timeZone: 'America/New_York',
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true,
                              timeZoneName: 'short'
                            });
                            
                            // Prepare final data for submission
                            // If "Other" is selected, use the description as the experience type value
                            const finalExperienceType = isOtherSelected 
                              ? formData.otherDescription 
                              : (() => {
                                  switch(formData.experienceType) {
                                    case "private_corporate": return "Private Corporate Event (In-Office or Offsite)";
                                    case "private_launch": return "Private Launch Celebration";
                                    case "private_retreat": return "Private Retreat or Gathering";
                                    case "brand_activation": return "Branded Activation";
                                    case "product_collab": return "Physical Product Collaboration";
                                    case "content_press": return "Content/Press Installation";
                                    default: return formData.experienceType;
                                  }
                                })();
                            
                            // Create submission data without otherDescription field
                            const { otherDescription, ...restFormData } = formData;
                            const submissionData = {
                              ...restFormData,
                              experienceType: finalExperienceType,
                              dateSubmitted
                            };
                            
                            try {
                              const response = await fetch('/api/submit-collab', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(submissionData),
                              });
                              
                              const data = await response.json();
                              
                              if (!response.ok) {
                                throw new Error(data.error || 'Failed to submit form');
                              }
                              
                              // If successful, show success message
                              setFormSubmitted(true);
                            } catch (err) {
                              // If error, show error message
                              setError(err instanceof Error ? err.message : 'An unexpected error occurred');
                              console.error('Submission error:', err);
                            } finally {
                              setIsSubmitting(false);
                            }
                          };

                          const fadeIn = {
                            hidden: { opacity: 0, y: 20 },
                            visible: { 
                              opacity: 1, 
                              y: 0,
                              transition: { duration: 0.8, ease: "easeOut" }
                            }
                          };

                          const staggerContainer = {
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: {
                                staggerChildren: 0.2,
                                delayChildren: 0.3
                              }
                            }
                          };

                          // Thank you screen animations
                          const thankYouVariants = {
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: {
                                duration: 0.5,
                                when: "beforeChildren",
                                staggerChildren: 0.2
                              }
                            }
                          };

                          // Line duration should match redirect time
                          const lineVariants = {
                            hidden: { width: "0%" },
                            visible: { 
                              width: "100%", 
                              transition: { 
                                duration: 3, 
                                ease: "linear" 
                              } 
                            }
                          };

                          const itemVariants = {
                            hidden: { opacity: 0, y: 20 },
                            visible: { 
                              opacity: 1, 
                              y: 0,
                              transition: { duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }
                            }
                          };

                          // Render thank you screen
                          if (formSubmitted) {
                            return (
                              <motion.div 
                                className="fixed inset-0 flex flex-col items-center justify-center z-50 px-6"
                                style={{backgroundColor: '#2A2726'}}
                                initial="hidden"
                                animate="visible"
                                variants={thankYouVariants}
                              >
                                <motion.div 
                                  className="max-w-xl w-full flex flex-col items-center justify-center"
                                  variants={thankYouVariants}
                                >
                                  <motion.div variants={itemVariants} className="mb-8">
                                    <h1 className="text-3xl md:text-5xl font-light text-center tracking-wide">THANK YOU</h1>
                                  </motion.div>
                                  
                                  <motion.div variants={itemVariants} className="mb-12">
                                    <div className="w-12 h-px bg-white mx-auto mb-8" />
                                    <p className="text-gray-400 text-center mb-6 max-w-md mx-auto tracking-wide">
                                      Your inquiry has been received. We'll be in touch soon.
                                    </p>
                                    <p className="text-gray-600 text-sm text-center">
                                      Redirecting in {redirectCounter}...
                                    </p>
                                  </motion.div>
                                  
                                  <motion.div 
                                    className="w-full max-w-xs h-px bg-gray-800 relative overflow-hidden mb-16"
                                  >
                                    <motion.div 
                                      className="absolute top-0 left-0 h-full bg-white"
                                      variants={lineVariants}
                                    />
                                  </motion.div>
                                  
                                  <motion.div 
                                    variants={itemVariants}
                                    className="opacity-60"
                                  >
                                    <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M25 0L30.8779 19.0983H50L34.5611 30.9017L40.4389 50L25 38.1966L9.56107 50L15.4389 30.9017L0 19.0983H19.1221L25 0Z" fill="white"/>
                                    </svg>
                                  </motion.div>
                                </motion.div>
                              </motion.div>
                            );
                          }

                          return (
                            <main className="flex min-h-screen flex-col items-center text-white pt-24" style={{backgroundColor: '#2A2726'}}>
                              {/* Header Section */}
                              <section className="pt-20 pb-20 px-6">
                                <div className="max-w-4xl mx-auto text-center">
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1.2 }}
                                  >
                                    <h1 className="text-3xl md:text-4xl font-light mb-6 tracking-wide text-center">
                                      <div className="flex flex-col items-center">
                                        <Image
                                          src="/images/TARE LOGOS/Logo01/rgb-web/white/tare-logo01-white-rgb.svg"
                                          alt="TARE"
                                          width={180}
                                          height={68}
                                          className="h-16 md:h-20 w-auto mb-1"
                                        />
                                        <span className="text-xl md:text-2xl font-light tracking-wide" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>RUNWAY</span>
                                      </div>
                                    </h1>
                                    <div className="w-12 h-px bg-white mx-auto mb-6" />
                                    <p className="text-sm md:text-base text-gray-400 tracking-wide">
                                      Private Experiences, Brand Partnerships, and Creative Projects
                                    </p>
                                  </motion.div>
                                </div>
                              </section>

                              {/* Intro Section */}
                              <section className="py-20 px-6">
                                <motion.div 
                                  className="max-w-2xl mx-auto"
                                  variants={staggerContainer}
                                  initial="hidden"
                                  whileInView="visible"
                                  viewport={{ once: true }}
                                >
                                  <motion.p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed" variants={fadeIn}>
                                    At TARE, coffee is just the beginning.
                                  </motion.p>
                                  <motion.p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed" variants={fadeIn}>
                                    We build sensory experiences designed to shift how things feel, taste, and linger.
                                  </motion.p>
                                  <motion.p className="text-lg md:text-xl text-gray-300 leading-relaxed" variants={fadeIn}>
                                    Have something in mind? Let's explore it.
                                  </motion.p>
                                </motion.div>
                              </section>

                              {/* Offerings Section */}
                              <section className="py-20 px-6 bg-gray-950">
                                <div className="max-w-4xl mx-auto">
                                  <motion.h2 
                                    className="text-2xl md:text-3xl font-light mb-16 text-center"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                  >
                                    What We Offer
                                  </motion.h2>

                                  <div className="grid md:grid-cols-3 gap-12">
                                    {/* Private Tastings */}
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 0.6 }}
                                    >
                                      <h3 className="text-xl font-light mb-4">Private Tastings</h3>
                                      <p className="text-gray-400 mb-4">
                                        Curated, personal omakase-style sensory experiences for your company, brand, or occasion. Brought to your space, or hosted in intimate settings or bespoke venues across New York City.
                                      </p>
                                    </motion.div>

                                    {/* Corporate and Creative Offsites */}
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 0.6, delay: 0.2 }}
                                    >
                                      <h3 className="text-xl font-light mb-4">Corporate Offsites</h3>
                                      <p className="text-gray-400 mb-4">
                                        Immersive sensory journeys designed for teams seeking an experiential reset — where coffee becomes a medium for awakening creativity.
                                      </p>
                                    </motion.div>

                                    {/* Brand Collaborations */}
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      viewport={{ once: true }}
                                      transition={{ duration: 0.6, delay: 0.4 }}
                                    >
                                      <h3 className="text-xl font-light mb-4">Brand Collaborations</h3>
                                      <p className="text-gray-400 mb-4">
                                        Partnerships with select brands, artists, and creatives to craft avant-garde sensory activations and cultural installations.
                                      </p>
                                    </motion.div>
                                  </div>
                                </div>
                              </section>

                              {/* Approach Section */}
                              <section className="py-20 px-6">
                                <motion.div 
                                  className="max-w-2xl mx-auto text-center"
                                  variants={staggerContainer}
                                  initial="hidden"
                                  whileInView="visible"
                                  viewport={{ once: true }}
                                >
                                  <motion.h2 
                                    className="text-2xl md:text-3xl font-light mb-12"
                                    variants={fadeIn}
                                  >
                                    Our Approach
                                  </motion.h2>
                                  
                                  <motion.p className="text-gray-300 mb-8 leading-relaxed" variants={fadeIn}>
                                    TARE collaborations are not plug-and-play experiences.
                                  </motion.p>
                                  
                                  <motion.p className="text-gray-300 mb-8 leading-relaxed" variants={fadeIn}>
                                    Every detail — from flavor arcs to emotional pacing to visual design — is constructed to feel deliberate, timeless, and mythic.
                                  </motion.p>
                                  
                                  <motion.p className="text-gray-300 leading-relaxed" variants={fadeIn}>
                                    We approach each collaboration as a culinary atelier would a signature creation — where coffee becomes merely the foundation for experimental compositions that engage all senses in unexpected ways.
                                  </motion.p>
                                </motion.div>
                              </section>

                              {/* Inquiry Section */}
                              <section className="py-20 px-6 bg-gray-950">
                                <div className="max-w-2xl mx-auto">
                                  <motion.div
                                    className="text-center mb-12"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                  >
                                    <h2 className="text-2xl md:text-3xl font-light mb-4">Ready to Begin?</h2>
                                    <p className="text-gray-400">
                                      Tell us what you're imagining. We'll follow up to explore how we can bring it to life.
                                    </p>
                                  </motion.div>

                                  <motion.form
                                    onSubmit={handleSubmit}
                                    className="space-y-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    {error && (
                                      <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 mb-4 text-sm">
                                        {error}
                                      </div>
                                    )}
                                    
                                    {/* Name Fields (2-column) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <input
                                          type="text"
                                          name="firstName"
                                          required
                                          value={formData.firstName}
                                          onChange={handleChange}
                                          placeholder="First Name"
                                          className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                                        />
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          name="lastName"
                                          required
                                          value={formData.lastName}
                                          onChange={handleChange}
                                          placeholder="Last Name"
                                          className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                                        />
                                      </div>
                                    </div>

                                    {/* Contact Fields (2-column) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <input
                                          type="email"
                                          name="email"
                                          required
                                          value={formData.email}
                                          onChange={handleChange}
                                          placeholder="Email"
                                          className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                                        />
                                      </div>
                                      <div>
                                        <input
                                          type="tel"
                                          name="phone"
                                          required
                                          value={formData.phone}
                                          onChange={handleChange}
                                          placeholder="Phone"
                                          className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                                        />
                                      </div>
                                    </div>

                                    {/* Company Field */}
                                    <div>
                                      <input
                                        type="text"
                                        name="company"
                                        required
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Company/Brand Name"
                                        className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                                      />
                                    </div>

                                    {/* Experience Type Dropdown */}
                                    <div>
                                      <div className="mb-2">
                                        <label className="text-sm text-gray-400">
                                          Type of Experience
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Choose the type of experience you're requesting. We offer curated private sessions and collaborative creative partnerships.
                                        </p>
                                      </div>
                                      <select
                                        name="experienceType"
                                        required
                                        value={formData.experienceType}
                                        onChange={handleChange}
                                        className={`w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide ${!formData.experienceType ? 'text-gray-500' : 'text-white'}`}
                                      >
                                        <option value="" disabled>Select Type</option>
                                        <optgroup label="PRIVATE EXPERIENCES">
                                          <option value="private_corporate">Private Corporate Event (In-Office or Offsite)</option>
                                          <option value="private_launch">Private Launch Celebration</option>
                                          <option value="private_retreat">Private Retreat or Gathering</option>
                                          <option value="other_private">Other (Private)</option>
                                        </optgroup>
                                        <optgroup label="BRAND COLLABORATIONS">
                                          <option value="brand_activation">Branded Activation</option>
                                          <option value="product_collab">Physical Product Collaboration</option>
                                          <option value="content_press">Content/Press Installation</option>
                                          <option value="other_collab">Other (Collab)</option>
                                        </optgroup>
                                      </select>
                                    </div>

                                    {/* Only show remaining fields if experience type is selected */}
                                    {formData.experienceType && (
                                      <>
                                        {/* Conditional Other Description Field */}
                                        {isOtherSelected && (
                                          <div>
                                            <input
                                              type="text"
                                              name="otherDescription"
                                              required
                                              value={formData.otherDescription}
                                              onChange={handleChange}
                                              placeholder="Briefly describe your vision (2-3 sentences)"
                                              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                                            />
                                          </div>
                                        )}

                                        {/* Date Fields (2-column) */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div>
                                            <div className="mb-2">
                                              <label className="text-xs text-gray-400">
                                                Preferred Date Range (Start)
                                                <span className="block mt-1">The earliest day you're available for this event</span>
                                              </label>
                                            </div>
                                            <input
                                              type="date"
                                              name="dateStart"
                                              required
                                              value={formData.dateStart}
                                              onChange={handleChange}
                                              min={new Date().toISOString().split('T')[0]} // Min is today
                                              placeholder="Preferred Date (Start)"
                                              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 [color-scheme:dark]"
                                            />
                                          </div>
                                          <div>
                                            <div className="mb-2">
                                              <label className="text-xs text-gray-400">
                                                Preferred Date Range (End)
                                                <span className="block mt-1">The latest day you're available for this event</span>
                                              </label>
                                            </div>
                                            <input
                                              type="date"
                                              name="dateEnd"
                                              required
                                              value={formData.dateEnd}
                                              onChange={handleChange}
                                              min={formData.dateStart || new Date().toISOString().split('T')[0]} // Min is start date or today
                                              placeholder="Preferred Date (End)"
                                              className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 [color-scheme:dark]"
                                            />
                                          </div>
                                        </div>

                                        {/* Time Dropdown and Guest Count (conditionally shown) */}
                                        <div className={`grid grid-cols-1 ${!isBrandCollaboration ? 'md:grid-cols-2' : ''} gap-6`}>
                                          <div>
                                            <div className="mb-2">
                                              <label className="text-xs text-gray-400">
                                                Preferred Start Time Range
                                                <span className="block mt-1">(Your tasting will last about 1 hour.)</span>
                                              </label>
                                            </div>
                                            <select
                                              name="preferredTime"
                                              required
                                              value={formData.preferredTime}
                                              onChange={handleChange}
                                              className={`w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide ${!formData.preferredTime ? 'text-gray-500' : 'text-white'}`}
                                            >
                                              <option value="" disabled>Select Time Range</option>
                                              <option value="9am - 12pm">9am - 12pm</option>
                                              <option value="12pm - 3pm">12pm - 3pm</option>
                                              <option value="3pm - 6pm">3pm - 6pm</option>
                                              <option value="6pm - 9pm">6pm - 9pm</option>
                                            </select>
                                          </div>
                                          
                                          {/* Only show guest count for private experiences */}
                                          {!isBrandCollaboration && (
                                            <div>
                                              <input
                                                type="number"
                                                name="guestCount"
                                                required
                                                min="1"
                                                value={formData.guestCount}
                                                onChange={handleChange}
                                                placeholder="Guest Count"
                                                className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                                              />
                                            </div>
                                          )}
                                        </div>

                                        {/* Location Field */}
                                        <div>
                                          <input
                                            type="text"
                                            name="location"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="Location"
                                            className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500"
                                          />
                                        </div>

                                        {/* Details Field with dynamic placeholder */}
                                        <div>
                                          <div className="mb-2">
                                            <label className="text-xs text-gray-400">
                                              Details
                                            </label>
                                          </div>
                                          <textarea
                                            name="details"
                                            value={formData.details}
                                            onChange={handleChange}
                                            placeholder={getDetailsPlaceholder()}
                                            rows={4}
                                            className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-white py-3 text-sm tracking-wide placeholder-gray-500 resize-none"
                                          />
                                        </div>

                                        <button
                                          type="submit"
                                          disabled={isSubmitting}
                                          className="w-full border border-white px-8 py-4 text-sm tracking-wide hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                                        >
                                          {isSubmitting ? "SUBMITTING..." : "SUBMIT INQUIRY"}
                                        </button>
                                      </>
                                    )}
                                  </motion.form>
                                </div>
                              </section>
                            </main>
                          );
                        } 