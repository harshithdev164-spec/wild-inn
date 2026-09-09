import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Clock, Mail, ArrowUpRight, CheckCircle2, AlertCircle, ChevronDown, Calendar, Plus, Minus, Instagram, ArrowUp, ArrowDown } from 'lucide-react';
import { TOURS, FAQS } from '../data';
import { DESTINATIONS } from '../data/destinationsData';
import SEO from '../components/SEO';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tourSlug: '',
    experience: '',
    date: '',
    adults: 2,
    children: 0,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'tourSlug' ? { experience: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form validation
    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Please fill in your name, email, and phone number.');
      return;
    }

    // Date validation
    const todayStr = getTodayDateString();
    if (formData.date && formData.date < todayStr) {
      setErrorMsg('Please select a preferred date in the present or future.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map destination ID to human-readable name
      let destinationName = formData.tourSlug;
      if (formData.tourSlug === 'kabini') destinationName = 'Kabini';
      else if (formData.tourSlug === 'bandipur') destinationName = 'Bandipur';
      else if (formData.tourSlug === 'masinagudi') destinationName = 'Masinagudi and Mudumalai';

      const response = await fetch('https://formspree.io/f/xkodbpdo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          destination: destinationName || 'Not specified',
          experience: formData.experience || 'Not specified',
          preferredDate: formData.date || 'Not specified',
          adultsCount: formData.adults,
          childrenCount: formData.children,
          message: formData.message
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          tourSlug: '',
          experience: '',
          date: '',
          adults: 2,
          children: 0,
          message: ''
        });
      } else {
        const data = await response.json();
        if (data && data.errors) {
          setErrorMsg(data.errors.map((err: any) => err.message).join(', '));
        } else {
          setErrorMsg('Failed to submit the form. Please try again or contact us directly.');
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg('A network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://www.wildinn.in/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Contact Us',
        'item': 'https://www.wildinn.in/contact'
      }
    ]
  };

  return (
    <div id="contact-page-wrapper" className="bg-black text-white min-h-screen pt-28 sm:pt-32 pb-6 flex flex-col font-sans">
      <SEO 
        title="Contact Us" 
        description="Connect with our safari curators to plan your custom luxury itinerary in South India. Standard responses in 1-2 hours."
        structuredData={breadcrumbSchema}
      />
      
      {/* SECTION 1: Contact Header */}
      <section id="contact-header-section" className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end w-full">
          
          {/* Left Column: Pill & Heading */}
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block bg-white/10 text-white border border-white/5 text-[11px] sm:text-xs font-sans font-semibold px-4.5 py-1.5 rounded-full uppercase tracking-wider">
              Plan My Safari
            </span>
            <h1 className="font-sans text-[44px] sm:text-[56px] md:text-[68px] lg:text-[76px] leading-[1.05] tracking-tight font-normal text-white">
              Let's Plan Your Journey
            </h1>
          </div>

          {/* Right Column: Paragraph */}
          <div className="lg:col-span-5 lg:text-right lg:pb-3">
            <p className="text-white/80 text-sm sm:text-base md:text-[17px] font-sans font-light max-w-sm lg:ml-auto leading-relaxed">
              Share a few details and we'll reach out personally to shape a journey around what you're hoping to experience. We respond within 1–2 hours during business hours.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 2: Form & Image Card Grid */}
      <section id="contact-form-section" className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Form Card Container (Premium Glassmorphism Effect) */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.2rem] p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-6"
                >
                  <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-8 h-8 text-black" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-sans text-2xl sm:text-3xl font-normal text-white">
                      Enquiry Sent!
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base font-light max-w-md leading-relaxed">
                      We have received your safari enquiry. Nagadharshan B. will contact you directly within 1-2 hours to shape your journey together.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-white hover:bg-white/90 text-black px-6 py-3 rounded-full font-sans font-medium text-xs tracking-wider uppercase transition-colors"
                  >
                    Send Another Enquiry
                  </button>
                </motion.div>
              ) : (
                <form key="form" onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    {errorMsg && (
                      <div className="p-4 bg-rose-950/40 border-l-4 border-rose-500 text-rose-200 text-xs rounded-r-md flex items-center space-x-2 border border-rose-900/30">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <h3 className="font-sans text-xl sm:text-2xl font-normal text-white border-b border-white/5 pb-3">
                      Tell Us About Your Trip
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Name input */}
                      <div className="space-y-2">
                        <label htmlFor="contact-field-name" className="block text-sm font-sans font-medium text-white/90">
                          Full Name
                        </label>
                        <input
                          id="contact-field-name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full px-5 py-3.5 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-white/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 text-sm sm:text-base transition-all"
                          required
                        />
                      </div>

                      {/* Email input */}
                      <div className="space-y-2">
                        <label htmlFor="contact-field-email" className="block text-sm font-sans font-medium text-white/90">
                          Email
                        </label>
                        <input
                          id="contact-field-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full px-5 py-3.5 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-white/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 text-sm sm:text-base transition-all"
                          required
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Phone Number input */}
                      <div className="space-y-2">
                        <label htmlFor="contact-field-phone" className="block text-sm font-sans font-medium text-white/90">
                          Phone Number (WhatsApp preferred)
                        </label>
                        <input
                          id="contact-field-phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-5 py-3.5 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-white/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 text-sm sm:text-base transition-all"
                          required
                        />
                      </div>

                      {/* Select Your Tour -> Preferred Destination */}
                      <div className="space-y-2">
                        <label htmlFor="contact-field-tour" className="block text-sm font-sans font-medium text-white/90">
                          Preferred Destination
                        </label>
                        <div className="relative">
                          <select
                            id="contact-field-tour"
                            name="tourSlug"
                            value={formData.tourSlug}
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-white/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 text-sm sm:text-base appearance-none transition-all pr-10 cursor-pointer"
                          >
                            <option value="" className="bg-neutral-900 text-white">Choose a destination...</option>
                            <option value="kabini" className="bg-neutral-900 text-white">Kabini</option>
                            <option value="bandipur" className="bg-neutral-900 text-white">Bandipur</option>
                            <option value="masinagudi" className="bg-neutral-900 text-white">Masinagudi and Mudumalai</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-4.5 w-5 h-5 text-white/40 pointer-events-none" />
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Preferred Experience */}
                      <div className="space-y-2">
                        <label htmlFor="contact-field-experience" className="block text-sm font-sans font-medium text-white/90">
                          Preferred Experience
                        </label>
                        <div className="relative">
                          <select
                            id="contact-field-experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="w-full px-5 py-3.5 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-white/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 text-sm sm:text-base appearance-none transition-all pr-10 cursor-pointer"
                          >
                            <option value="" className="bg-neutral-900 text-white">Choose an experience...</option>
                            {formData.tourSlug && DESTINATIONS.find(d => d.id === formData.tourSlug)?.packages.map((pkg: any) => (
                              <option key={pkg.name} value={pkg.name} className="bg-neutral-900 text-white">{pkg.name}</option>
                            ))}
                            {!formData.tourSlug && (
                              <>
                                <option value="luxury" className="bg-neutral-900 text-white">Luxury Resort Stay</option>
                                <option value="tour" className="bg-neutral-900 text-white">Wildlife Tour (Multiple Safaris)</option>
                                <option value="retreat" className="bg-neutral-900 text-white">Weekend Retreat (Single Safari)</option>
                              </>
                            )}
                          </select>
                          <ChevronDown className="absolute right-4 top-4.5 w-5 h-5 text-white/40 pointer-events-none" />
                        </div>
                      </div>

                      {/* Preferred Date */}
                      <div className="space-y-2">
                        <label htmlFor="contact-field-date" className="block text-sm font-sans font-medium text-white/90">
                          Preferred Travel Dates
                        </label>
                        <div className="relative">
                          <input
                            id="contact-field-date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={getTodayDateString()}
                            className="w-full px-5 py-3.5 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-white/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 text-sm sm:text-base transition-all [color-scheme:dark]"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Number of Travelers (Pushed to its own row) */}
                    <div className="space-y-2">
                      <label className="block text-sm font-sans font-medium text-white/95">
                        Who's Joining the Journey
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Adults Selector */}
                        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                          <span className="text-sm font-sans font-medium text-white/80">Adults</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all select-none disabled:opacity-35 disabled:pointer-events-none cursor-pointer focus:outline-none"
                              disabled={formData.adults <= 1}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-white text-base font-sans font-semibold min-w-[20px] text-center select-none">{formData.adults}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, adults: prev.adults + 1 }))}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all select-none cursor-pointer focus:outline-none"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Children Selector */}
                        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                          <span className="text-sm font-sans font-medium text-white/80">Children</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all select-none disabled:opacity-35 disabled:pointer-events-none cursor-pointer focus:outline-none"
                              disabled={formData.children <= 0}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-white text-base font-sans font-semibold min-w-[20px] text-center select-none">{formData.children}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, children: prev.children + 1 }))}
                              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all select-none cursor-pointer focus:outline-none"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message / Special Requests */}
                    <div className="space-y-2">
                      <label htmlFor="contact-field-message" className="block text-sm font-sans font-medium text-white/90">
                        Anything Else We Should Know
                      </label>
                      <textarea
                        id="contact-field-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Occasion, interests (photography, birding, relaxation), budget range, or anything else that helps us curate your journey."
                        className="w-full px-5 py-3.5 bg-white/5 focus:bg-white/10 border border-white/10 focus:border-white/30 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/10 text-sm sm:text-base transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Submission Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      id="contact-submit-text-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-white hover:bg-white/90 disabled:bg-white/60 text-black font-sans font-medium text-sm px-8 h-12 rounded-full shadow-sm transition-all flex items-center justify-center cursor-pointer"
                    >
                      {isSubmitting ? 'Sending...' : 'Send My Enquiry'}
                    </button>
                    <button
                      id="contact-submit-circle-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-white hover:bg-white/90 disabled:bg-white/60 text-black w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0"
                      aria-label="Submit enquiry request"
                    >
                      <ArrowUpRight className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Narrative Portrait Image Card */}
          <div className="lg:col-span-5 relative rounded-[2.2rem] overflow-hidden aspect-[4/5] lg:aspect-auto w-full bg-zinc-900 min-h-[400px]">
            <img
              referrerPolicy="no-referrer"
              src="/img/pexels-ashwani-sharma-2153169983-35369036.webp"
              alt="Leopard in core forest"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center select-none animate-fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            
            {/* Top right floating pill */}
            <div className="absolute top-6 right-6">
              <span className="border border-white/20 text-white font-sans text-xs tracking-wider uppercase font-semibold px-4.5 py-2.5 rounded-full bg-black/40 backdrop-blur-xs shadow-3xs cursor-default">
                Your Journey Begins Here
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: Grid of 4 Contact Channels */}
      <section id="contact-channels-section" className="w-full bg-black py-16 text-white">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            
            {/* Channel 1: Call & WhatsApp */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-3xs text-white">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-sans text-lg sm:text-xl font-medium text-white mb-3">
                Call & WhatsApp
              </h3>
              <div className="space-y-1">
                <p className="text-white/70 font-sans font-light text-sm sm:text-base leading-relaxed hover:text-white transition-colors">
                  <a href="tel:+918660774511">+91 8660774511</a>
                </p>
              </div>
            </div>

            {/* Channel 2: Working Hours */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-3xs text-white">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-sans text-lg sm:text-xl font-medium text-white mb-3">
                Working Hours
              </h3>
              <div className="space-y-1">
                <p className="text-white/70 font-sans font-light text-sm sm:text-base leading-relaxed">
                  Daily, 9 AM – 9 PM IST
                </p>
              </div>
            </div>

            {/* Channel 3: Write to Us */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-3xs text-white">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-sans text-lg sm:text-xl font-medium text-white mb-3">
                Write to Us
              </h3>
              <div className="space-y-1">
                <p className="text-white/70 font-sans font-light text-sm sm:text-base leading-relaxed hover:text-white transition-colors">
                  <a href="mailto:support@wildinn.com">support@wildinn.com</a>
                </p>
              </div>
            </div>

            {/* Channel 4: Instagram */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-3xs text-white">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-sans text-lg sm:text-xl font-medium text-white mb-3">
                Follow Along
              </h3>
              <div className="space-y-1">
                <p className="text-white/70 font-sans font-light text-sm sm:text-base leading-relaxed hover:text-white transition-colors">
                  <a href="https://www.instagram.com/wild.inn_/" target="_blank" rel="noopener noreferrer">
                    @wild.inn_
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: FAQ Section (Centred elegant layout for contact us page before footer) */}
      <section id="faq-section" className="bg-black py-16 lg:py-24 w-full text-white">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 space-y-12">
          
          {/* Header Row */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block bg-white/10 text-white border border-white/5 text-[11px] sm:text-xs font-sans font-semibold px-4.5 py-1.5 rounded-full uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] tracking-tight font-normal text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-white/60 text-sm sm:text-base font-light font-sans max-w-xl mx-auto">
              Everything you need to know before your journey into the wild - from planning to what to pack.
            </p>
          </div>

          {/* Accordion List Centered */}
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            {FAQS.slice(0, 6).map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.id}
                  className="bg-white/5 border border-white/10 rounded-[1.8rem] overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="font-sans text-sm sm:text-base font-medium text-white leading-snug">
                      {faq.question}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/10 text-white shrink-0">
                      {isOpen ? (
                        <ArrowUp className="w-4 h-4 text-white" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-8 pb-6 text-white/70 text-xs sm:text-sm leading-relaxed font-sans max-w-3xl border-t border-white/10 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
