'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { CURRENT_EVENT_ID } from '@/config/events';

interface Booking {
  id: string;
  fields: {
    'Name'?: string;
    'Phone'?: string;
    'Email'?: string;
    'Amount Paid'?: string;
    'Coupon Used'?: string;
    'Event'?: string;
    'Event Date'?: string;
  };
  guestFormSubmitted?: boolean;
  guestForm?: any;
}

interface GuestForm {
  id: string;
  fields: {
    'Phone Number'?: string;
    'Phone Normalized'?: string;
    'Preferred Name'?: string;
    'Attending With'?: string;
    'Attending With Who'?: string;
    'Pronouns'?: string;
    'Coffee Relationship'?: string;
    'Wellness Experience'?: string;
    'Intentions'?: string;
    'Dietary Restrictions'?: string;
    'Scent Sensitivity'?: string;
    'How Heard'?: string;
  };
}

// Phone normalization utility
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.substring(1);
  }
  return cleaned;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [realAvailableSeats, setRealAvailableSeats] = useState<number | null>(null);
  const [totalSeats, setTotalSeats] = useState(16);
  const [showExtraColumns, setShowExtraColumns] = useState(false);
  const [guestForms, setGuestForms] = useState<GuestForm[]>([]);
  const [unmatchedForms, setUnmatchedForms] = useState<GuestForm[]>([]);
  const [selectedGuestForm, setSelectedGuestForm] = useState<GuestForm | null>(null);

  const ADMIN_PASSWORD = 'tareadmin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchData();
    } else {
      setError('Invalid credentials');
      setTimeout(() => setError(''), 3000);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch bookings
      const bookingsResponse = await fetch(`/api/admin/bookings?eventId=${CURRENT_EVENT_ID}`);
      const bookingsData = await bookingsResponse.json();
      
      // Fetch guest forms
      const guestFormsResponse = await fetch('/api/admin/guest-forms');
      const guestFormsData = await guestFormsResponse.json();
      
      if (bookingsResponse.ok && guestFormsResponse.ok) {
        const bookings = bookingsData.bookings || [];
        const guestForms = guestFormsData.guestForms || [];
        
        // Create phone -> form map (use normalized field from Airtable)
        const formsMap = new Map<string, GuestForm>();
        guestForms.forEach((form: GuestForm) => {
          // Use the Phone Normalized field if available, otherwise normalize on the fly
          const phone = (form.fields as any)['Phone Normalized'] || normalizePhone(form.fields['Phone Number'] || '');
          if (phone) {
            formsMap.set(phone, form);
          }
        });
        
        // Match bookings with forms
        const enhancedBookings = bookings.map((booking: Booking) => {
          const bookingPhone = normalizePhone(booking.fields['Phone'] || '');
          const matchedForm = formsMap.get(bookingPhone);
          
          if (matchedForm) {
            formsMap.delete(bookingPhone); // Remove matched forms
          }
          
          return {
            ...booking,
            guestFormSubmitted: !!matchedForm,
            guestForm: matchedForm
          };
        });
        
        // Remaining forms in map are unmatched
        const unmatched = Array.from(formsMap.values());
        
        setBookings(enhancedBookings);
        setGuestForms(guestForms);
        setUnmatchedForms(unmatched);
      } else {
        setError(`Failed to fetch data`);
      }

      // Fetch availability
      const availabilityResponse = await fetch(`/api/availability?eventId=${CURRENT_EVENT_ID}`);
      const availabilityData = await availabilityResponse.json();
      
      if (availabilityResponse.ok) {
        setRealAvailableSeats(availabilityData.available);
        const bookedSeats = bookingsData.bookings?.length || 0;
        setTotalSeats(availabilityData.available + bookedSeats);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Connection failed');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#1A1816] text-[#E8E3DD] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Image
                src="/images/TARE LOGOS/Logo01/rgb-web/white/tare-logo01-white-rgb.svg"
                alt="TARE"
                width={300}
                height={50}
                className="w-auto h-12"
                priority
              />
            </motion.div>
            <p className="text-xs tracking-[0.3em] text-[#A39B8B]" style={{ fontFamily: 'FragmentMono, monospace' }}>
              ADMIN ACCESS
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="ENTER PASSWORD"
                className="w-full bg-[#2A2726] border border-[#3A3736] text-[#E8E3DD] px-6 py-4 pr-12 focus:outline-none focus:border-[#8B7F6F] transition-colors placeholder:text-[#5A544B] placeholder:tracking-[0.2em] text-sm"
                style={{ fontFamily: 'FragmentMono, monospace' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B7F6F] hover:text-[#A39B8B] transition-colors text-xs tracking-wider"
                style={{ fontFamily: 'FragmentMono, monospace' }}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs text-center tracking-wider"
                  style={{ fontFamily: 'FragmentMono, monospace' }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full bg-[#E8E3DD] text-[#1A1816] py-4 hover:bg-[#D4CEC4] transition-all duration-300 tracking-[0.3em] text-xs font-medium"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              ACCESS DASHBOARD
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const bookedSeats = bookings.length;
  const capacityPercentage = totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#1A1816] text-[#E8E3DD] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <Image
              src="/images/TARE LOGOS/Logo01/rgb-web/white/tare-logo01-white-rgb.svg"
              alt="TARE"
              width={400}
              height={80}
              className="w-auto h-16 sm:h-20"
              priority
            />
          </motion.div>
          <p className="text-xs tracking-[0.3em] text-[#A39B8B] mb-2" style={{ fontFamily: 'FragmentMono, monospace' }}>
            ADMIN DASHBOARD
          </p>
          <div className="flex items-center justify-center gap-2 text-xs" style={{ fontFamily: 'FragmentMono, monospace' }}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[#8B7F6F] tracking-wider">LIVE</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#2A2726] border border-[#3A3736] p-6 hover:border-[#8B7F6F] transition-colors"
          >
            <p className="text-xs text-[#A39B8B] mb-3 tracking-[0.2em]" style={{ fontFamily: 'FragmentMono, monospace' }}>
              EVENT DATE
            </p>
            <p className="text-2xl font-light tracking-wider" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
              {CURRENT_EVENT_ID}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2A2726] border border-[#3A3736] p-6 hover:border-[#8B7F6F] transition-colors"
          >
            <p className="text-xs text-[#A39B8B] mb-3 tracking-[0.2em]" style={{ fontFamily: 'FragmentMono, monospace' }}>
              TOTAL CAPACITY
            </p>
            <p className="text-4xl font-light" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
              {totalSeats}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#2A2726] border border-[#3A3736] p-6 hover:border-[#8B7F6F] transition-colors"
          >
            <p className="text-xs text-[#A39B8B] mb-3 tracking-[0.2em]" style={{ fontFamily: 'FragmentMono, monospace' }}>
              RESERVED
            </p>
            <p className="text-4xl font-light text-[#D4A574]" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
              {loading ? '—' : bookedSeats}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#2A2726] border border-[#3A3736] p-6 hover:border-[#8B7F6F] transition-colors"
          >
            <p className="text-xs text-[#A39B8B] mb-3 tracking-[0.2em]" style={{ fontFamily: 'FragmentMono, monospace' }}>
              AVAILABLE
            </p>
            <p className="text-4xl font-light text-[#7FB069]" style={{ fontFamily: 'NonBureauExtended, sans-serif' }}>
              {realAvailableSeats !== null ? realAvailableSeats : '—'}
            </p>
          </motion.div>
        </div>

        {/* Capacity Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 bg-[#2A2726] border border-[#3A3736] p-6"
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs text-[#A39B8B] tracking-[0.2em]" style={{ fontFamily: 'FragmentMono, monospace' }}>
              CAPACITY
            </p>
            <p className="text-xs text-[#A39B8B] tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
              {capacityPercentage.toFixed(1)}%
            </p>
          </div>
          <div className="h-2 bg-[#1A1816] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${capacityPercentage}%` }}
              transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#D4A574] to-[#C4956A]"
            />
          </div>
        </motion.div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#2A2726] border border-[#3A3736]"
        >
          <div className="p-6 border-b border-[#3A3736] flex justify-between items-center">
            <h2 className="text-sm tracking-[0.3em] text-[#E8E3DD]" style={{ fontFamily: 'FragmentMono, monospace' }}>
              RESERVATIONS
            </h2>
            <button
              onClick={() => setShowExtraColumns(!showExtraColumns)}
              className="md:hidden text-xs tracking-wider text-[#8B7F6F] hover:text-[#A39B8B] transition-colors px-3 py-1 border border-[#3A3736] hover:border-[#8B7F6F]"
              style={{ fontFamily: 'FragmentMono, monospace' }}
            >
              {showExtraColumns ? 'HIDE DETAILS' : 'SHOW DETAILS'}
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-6 h-6 border-2 border-[#8B7F6F] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-xs text-[#A39B8B] tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                LOADING...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-[#A39B8B] tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                NO RESERVATIONS YET
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#3A3736]">
                    <th className="text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>NAME</th>
                    <th className="text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>PHONE</th>
                    <th className="text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>EMAIL</th>
                    <th className="text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>AMOUNT</th>
                    <th className={`text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap ${showExtraColumns ? '' : 'hidden md:table-cell'}`} style={{ fontFamily: 'FragmentMono, monospace' }}>COUPON</th>
                    <th className={`text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap ${showExtraColumns ? '' : 'hidden md:table-cell'}`} style={{ fontFamily: 'FragmentMono, monospace' }}>EVENT</th>
                    <th className="text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>EVENT DATE</th>
                    <th className="text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>FORM STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className="border-b border-[#3A3736] hover:bg-[#33302E] transition-colors"
                    >
                      <td className="p-4 text-sm whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>
                        {booking.fields['Name'] || '—'}
                      </td>
                      <td className="p-4 text-sm text-[#A39B8B] whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>
                        {booking.fields['Phone'] || '—'}
                      </td>
                      <td className="p-4 text-sm text-[#A39B8B] max-w-xs truncate" style={{ fontFamily: 'FragmentMono, monospace' }} title={booking.fields['Email']}>
                        {booking.fields['Email'] || '—'}
                      </td>
                      <td className="p-4 text-sm text-[#D4A574] whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>
                        {booking.fields['Amount Paid'] || '—'}
                      </td>
                      <td className={`p-4 text-xs text-[#8B7F6F] whitespace-nowrap ${showExtraColumns ? '' : 'hidden md:table-cell'}`} style={{ fontFamily: 'FragmentMono, monospace' }} title={booking.fields['Coupon Used']}>
                        {booking.fields['Coupon Used'] ? '✓' : '—'}
                      </td>
                      <td className={`p-4 text-xs text-[#A39B8B] tracking-wider whitespace-nowrap ${showExtraColumns ? '' : 'hidden md:table-cell'}`} style={{ fontFamily: 'FragmentMono, monospace' }}>
                        {booking.fields['Event'] || '—'}
                      </td>
                      <td className="p-4 text-sm whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>
                        {booking.fields['Event Date'] || '—'}
                      </td>
                      <td className="p-4 text-sm whitespace-nowrap" style={{ fontFamily: 'FragmentMono, monospace' }}>
                        {booking.guestFormSubmitted ? (
                          <button
                            onClick={() => setSelectedGuestForm(booking.guestForm)}
                            className="text-[#7FB069] hover:underline cursor-pointer"
                          >
                            ✅ View Form
                          </button>
                        ) : (
                          <span className="text-[#8B7F6F]">⬜ Not Submitted</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Unmatched Forms Section */}
        {unmatchedForms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-[#2A2726] border border-yellow-700"
          >
            <div className="p-6 border-b border-yellow-700 bg-yellow-900/10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-sm tracking-[0.3em] text-[#E8E3DD] mb-2" 
                      style={{ fontFamily: 'FragmentMono, monospace' }}>
                    UNMATCHED FORMS
                  </h2>
                  <p className="text-xs text-yellow-400" 
                     style={{ fontFamily: 'FragmentMono, monospace' }}>
                    ⚠️ {unmatchedForms.length} form{unmatchedForms.length !== 1 ? 's' : ''} 
                    {' '}without matching reservations
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#3A3736]">
                    <th className="text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap" 
                        style={{ fontFamily: 'FragmentMono, monospace' }}>
                      PREFERRED NAME
                    </th>
                    <th className="text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap" 
                        style={{ fontFamily: 'FragmentMono, monospace' }}>
                      PHONE NUMBER
                    </th>
                    <th className="text-left p-4 text-xs text-[#A39B8B] tracking-[0.2em] font-normal whitespace-nowrap" 
                        style={{ fontFamily: 'FragmentMono, monospace' }}>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {unmatchedForms.map((form, index) => (
                    <motion.tr 
                      key={form.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                      className="border-b border-[#3A3736] hover:bg-[#33302E] transition-colors"
                    >
                      <td className="p-4 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                        {form.fields['Preferred Name'] || '—'}
                      </td>
                      <td className="p-4 text-sm text-[#A39B8B]" 
                          style={{ fontFamily: 'FragmentMono, monospace' }}>
                        {form.fields['Phone Number'] || '—'}
                      </td>
                      <td className="p-4 text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                        <button
                          onClick={() => setSelectedGuestForm(form)}
                          className="text-yellow-400 hover:underline mr-4"
                        >
                          View Form
                        </button>
                        <span className="text-[#5A544B] text-xs">
                          (Manual match needed)
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-[#5A544B] tracking-[0.2em]" style={{ fontFamily: 'FragmentMono, monospace' }}>
            AUTO-REFRESH EVERY 30 SECONDS
          </p>
        </motion.div>
      </div>

      {/* Guest Form Modal */}
      <AnimatePresence>
        {selectedGuestForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedGuestForm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#2A2726] border border-[#3A3736] max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[#3A3736] flex justify-between items-center sticky top-0 bg-[#2A2726] z-10">
                <h2 className="text-sm tracking-[0.3em]" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  GUEST PREFERENCES
                </h2>
                <button
                  onClick={() => setSelectedGuestForm(null)}
                  className="text-[#A39B8B] hover:text-[#E8E3DD] text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Contact */}
                <div>
                  <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    PHONE NUMBER
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {selectedGuestForm.fields['Phone Number'] || '—'}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#3A3736]" />
                <h3 className="text-sm text-[#D4A574] tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  YOUR DETAILS
                </h3>
                
                <div>
                  <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    PREFERRED NAME
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {selectedGuestForm.fields['Preferred Name'] || '—'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    ATTENDING WITH
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {selectedGuestForm.fields['Attending With'] || '—'}
                  </p>
                </div>

                {selectedGuestForm.fields['Attending With Who'] && (
                  <div>
                    <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                      ATTENDING WITH WHO
                    </p>
                    <p className="text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                      {selectedGuestForm.fields['Attending With Who']}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    PRONOUNS
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {selectedGuestForm.fields['Pronouns'] || '—'}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#3A3736]" />
                <h3 className="text-sm text-[#D4A574] tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  COFFEE BACKGROUND
                </h3>
                
                <div>
                  <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    RELATIONSHIP WITH COFFEE
                  </p>
                  <p className="text-sm whitespace-pre-wrap" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {selectedGuestForm.fields['Coffee Relationship'] || '—'}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#3A3736]" />
                <h3 className="text-sm text-[#D4A574] tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  MEDITATION & WELLNESS
                </h3>
                
                <div>
                  <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    WELLNESS EXPERIENCE
                  </p>
                  <p className="text-sm whitespace-pre-wrap" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {selectedGuestForm.fields['Wellness Experience'] || '—'}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#3A3736]" />
                <h3 className="text-sm text-[#D4A574] tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  INTENTIONS
                </h3>
                
                <div>
                  <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    WHAT THEY'RE HOPING TO GET
                  </p>
                  <p className="text-sm whitespace-pre-wrap" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {selectedGuestForm.fields['Intentions'] || '—'}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#3A3736]" />
                <h3 className="text-sm text-[#D4A574] tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                  DIETARY & SENSORY
                </h3>
                
                <div>
                  <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    DIETARY RESTRICTIONS
                  </p>
                  <p className="text-sm whitespace-pre-wrap" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {selectedGuestForm.fields['Dietary Restrictions'] || '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    SCENT SENSITIVITY
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {selectedGuestForm.fields['Scent Sensitivity'] || '—'}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[#3A3736]" />
                
                <div>
                  <p className="text-xs text-[#A39B8B] mb-2 tracking-wider" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    HOW THEY HEARD ABOUT TARE
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'FragmentMono, monospace' }}>
                    {selectedGuestForm.fields['How Heard'] || '—'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
