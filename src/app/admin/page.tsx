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

  const ADMIN_PASSWORD = 'tare_admin_2025';

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
      const bookingsResponse = await fetch(`/api/admin/bookings?eventId=${CURRENT_EVENT_ID}`);
      const bookingsData = await bookingsResponse.json();
      
      if (bookingsResponse.ok) {
        setBookings(bookingsData.bookings || []);
      } else {
        setError(`Failed to fetch bookings: ${bookingsData.error}`);
      }

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
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

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
    </div>
  );
}
