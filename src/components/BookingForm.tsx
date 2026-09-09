import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Calendar, Users, Compass, CheckCircle2, AlertCircle, Plus, Minus } from 'lucide-react';
import { TOURS } from '../data';

export default function BookingForm({ hideTourSelection = false }: { hideTourSelection?: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tourSlug: '',
    date: '',
    adults: 2,
    children: 0,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Basic Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.date) {
      setErrorMsg('Please fill in all required fields (Name, Email, Phone, and Preferred Date).');
      return;
    }

    // Preferred Date validation: present or future
    const todayStr = getTodayDateString();
    if (formData.date && formData.date < todayStr) {
      setErrorMsg('Please select a preferred date in the present or future.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API reservation request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        tourSlug: '',
        date: '',
        adults: 2,
        children: 0,
        message: ''
      });
    }, 1500);
  };

  return (
    <div id="booking-form-wrapper" className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-10 shadow-sm relative overflow-hidden">
      
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            id="booking-success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-xs z-20 flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="space-y-4 max-w-sm"
            >
              <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-sans text-2xl font-normal text-white">
                Trip Requested!
              </h3>
              <p className="text-white/70 text-xs leading-relaxed">
                Thank you for reaching out to Wild Inn. Our founder, Nagadharshan B., will contact you directly via phone or email within the next 2 hours to confirm scheduling and availability.
              </p>
              <button
                id="reset-form-btn"
                onClick={() => setIsSubmitted(false)}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-mono uppercase font-semibold bg-white hover:bg-white/90 text-black tracking-wider transition-colors"
              >
                Send Another Request
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 mb-8">
        <h3 className="font-sans text-2xl font-normal text-white">
          Enquire About Your Journey
        </h3>
        <p className="text-white/60 text-xs leading-relaxed">
          Fill out this simple, non-binding enquiry form. We will coordinate schedule adjustments, private requests, and personalized considerations with you directly.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-950/40 border-l-4 border-rose-600 text-rose-200 text-xs rounded-r-md flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form id="contact-booking-form" onSubmit={handleSubmit} className="space-y-5">
        
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
              Your Name *
            </label>
            <input
              id="booking-field-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sarah Thompson"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
              Email Address *
            </label>
            <input
              id="booking-field-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. sarah@example.com"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors"
              required
            />
          </div>
        </div>

        {/* Row 2: Phone & Tour (conditionally) */}
        <div className={`grid grid-cols-1 ${!hideTourSelection ? 'sm:grid-cols-2' : ''} gap-5`}>
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
              Phone Number *
            </label>
            <input
              id="booking-field-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +966 50 123 4567"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors"
              required
            />
          </div>

          {!hideTourSelection && (
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
                Select Experience
              </label>
              <div className="relative">
                <select
                  id="booking-field-tour"
                  name="tourSlug"
                  value={formData.tourSlug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm appearance-none transition-colors"
                >
                  <option value="" className="bg-neutral-900 text-white">-- Choose an Experience --</option>
                  {TOURS.map((t) => (
                    <option key={t.id} value={t.slug} className="bg-neutral-900 text-white">
                      {t.name}
                    </option>
                  ))}
                  <option value="custom" className="bg-neutral-900 text-white">Custom Private Journey</option>
                </select>
                <Compass className="absolute right-4 top-3.5 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Row 3: Date */}
        <div className="space-y-1.5">
          <label htmlFor="booking-field-date" className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
            Preferred Date *
          </label>
          <div className="relative">
            <input
              id="booking-field-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getTodayDateString()}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors [color-scheme:dark]"
              required
            />
          </div>
        </div>

        {/* Row 4: Travelers */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
            Number of Travelers
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Adults Counter */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between min-h-[52px]">
              <div className="flex items-center gap-3">
                <span className="text-sm font-sans font-medium text-white">Adults</span>
                <span className="text-white text-xs sm:text-sm font-mono font-semibold bg-white/10 px-2.5 py-1 rounded-md border border-white/5">{formData.adults}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-all select-none disabled:opacity-20 disabled:pointer-events-none cursor-pointer focus:outline-none"
                  disabled={formData.adults <= 1}
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, adults: prev.adults + 1 }))}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-all select-none cursor-pointer focus:outline-none"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Children Counter */}
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between min-h-[52px]">
              <div className="flex items-center gap-3">
                <span className="text-sm font-sans font-medium text-white">Children</span>
                <span className="text-white text-xs sm:text-sm font-mono font-semibold bg-white/10 px-2.5 py-1 rounded-md border border-white/5">{formData.children}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-all select-none disabled:opacity-20 disabled:pointer-events-none cursor-pointer focus:outline-none"
                  disabled={formData.children <= 0}
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, children: prev.children + 1 }))}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-all select-none cursor-pointer focus:outline-none"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Textarea: Custom Message / Private requests */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
            Special Requests or Dietary Requirements
          </label>
          <textarea
            id="booking-field-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about food allergies, physical considerations, pickup locations, or if you are celebrating an occasion."
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors resize-none"
          />
        </div>

        <button
          id="booking-submit-btn"
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl text-sm font-mono tracking-wider uppercase font-semibold bg-white hover:bg-white/90 disabled:bg-white/30 text-black transition-colors cursor-pointer"
        >
          {isSubmitting ? (
            <span>Sending Request...</span>
          ) : (
            <>
              <span>Request Booking Details</span>
              <Send className="w-4 h-4 text-black" />
            </>
          )}
        </button>

      </form>
    </div>
  );
}
