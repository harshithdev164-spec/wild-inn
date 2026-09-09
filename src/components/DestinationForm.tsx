import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Send, CheckCircle2 } from 'lucide-react';

interface DestinationFormProps {
  destinationId: string;
  packages: { name: string }[];
  selectedPackage?: string;
  onPackageChange?: (pkg: string) => void;
}

export default function DestinationForm({ destinationId, packages, selectedPackage, onPackageChange }: DestinationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-[#121212] border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-xl">
      <div className="mb-8 space-y-2">
        <h4 className="font-sans text-2xl font-normal text-white">Enquire Now</h4>
        <p className="text-white/60 text-sm font-light">
          Share your details, and our safari specialist will reach out to craft your perfect itinerary.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center py-12 space-y-4"
          >
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h5 className="font-sans text-xl text-white">Thank you.</h5>
            <p className="text-white/60 text-sm max-w-xs">
              Our safari specialist will contact you shortly to confirm your {destinationId} journey.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
            action="https://formspree.io/f/placeholder" // Generic placeholder for formspree
            method="POST"
          >
            <input type="hidden" name="destination" value={destinationId} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
                  Package
                </label>
                <div className="relative">
                  <select
                    name="package"
                    value={selectedPackage}
                    onChange={(e) => onPackageChange?.(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm appearance-none transition-colors"
                    required
                  >
                    <option value="" className="bg-neutral-900 text-white">Select a package</option>
                    {packages.map((pkg, i) => (
                      <option key={i} value={pkg.name} className="bg-neutral-900 text-white">
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
                  Travel Date
                </label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
                  Adults
                </label>
                <input
                  type="number"
                  name="adults"
                  min="1"
                  defaultValue="2"
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
                  Children
                </label>
                <input
                  type="number"
                  name="children"
                  min="0"
                  defaultValue="0"
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Bangalore"
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold uppercase text-white/60 tracking-wide">
                Special Requests
              </label>
              <textarea
                name="requests"
                rows={3}
                placeholder="Dietary requirements, special occasions..."
                className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 text-sm transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-neutral-200 transition-colors py-4 rounded-xl text-sm font-sans font-medium flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Sending Request...' : 'Plan My Safari'}</span>
              {!isSubmitting && <Send className="w-4 h-4" />}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
