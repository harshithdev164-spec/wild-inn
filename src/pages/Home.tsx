import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Quote, ArrowLeft, Play, Info, X, MapPin, Camera, Image, Sun, Shield, Car, Route, ArrowUpRight, Award, MessageSquare, CheckSquare, Globe, Compass, Instagram, Linkedin, ArrowDown, ArrowUp } from 'lucide-react';
import SectionEyebrow from '../components/SectionEyebrow';
import TourCard from '../components/TourCard';
import PhoneMockupChat from '../components/PhoneMockupChat';
import FAQAccordion from '../components/FAQAccordion';
import { DESTINATIONS } from '../data/destinationsData';
import { TESTIMONIALS, FAQS, GUIDES, GALLERY_IMAGES } from '../data';
import SEO from '../components/SEO';
import founderUrl from '../assets/founder.webp';
import masaiMaraUrl from '../assets/masai-mara.webp';

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Wild Inn',
    'url': 'https://www.wildinn.in/',
    'logo': 'https://www.wildinn.in/wild-inn-logo.webp',
    'sameAs': [
      'https://www.instagram.com/wild.inn_/'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+918525911685',
      'contactType': 'customer service',
      'email': 'support@wildinn.com'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Wild Inn',
    'url': 'https://www.wildinn.in/'
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQS.slice(0, 6).map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  const homeSchemas = [orgSchema, websiteSchema, faqSchema];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div id="home-page-container" className="space-y-0 bg-black text-white">
      <SEO 
        description="Wild Inn curates extraordinary luxury wildlife safari journeys across South India's finest reserves - Kabini, Bandipur, and Masinagudi."
        structuredData={homeSchemas}
      />
      
      {/* SECTION A: Hero (Bottom-Aligned Content to Unobstruct Center) */}
      <section 
        id="hero-section" 
        className="relative w-full h-[95vh] sm:h-screen flex items-end justify-start overflow-hidden pt-28 pb-16 sm:pb-24 px-6 sm:px-12 md:px-16 lg:px-24"
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/img/pexels-best-safari-insights-2159031159-35751549.webp"
          className="absolute inset-0 w-full h-full object-cover select-none z-0"
        >
          <source src="/video/hero-safari.webm" type="video/webm" />
          <source src="/video/hero-safari.mp4" type="video/mp4" />
        </video>
        
        {/* Elegant gradient overlay rising from bottom to protect text legibility, keeping center clear */}
        

        {/* Bottom-Aligned Content Overlay */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
          
          {/* Text Content */}
          <div className="space-y-4 max-w-2xl text-left">
            <span className="inline-block bg-white/10 text-white/95 border border-white/20 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full backdrop-blur-xs">
              Premium Wilderness Safaris
            </span>
            <h1 className="font-sans text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-normal tracking-tight leading-[1.1] text-white">
              Where the Wild Becomes <br className="hidden sm:inline" />
              a Story Worth Telling
            </h1>
            <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed font-sans font-light max-w-xl">
              Wild Inn curates extraordinary safari journeys across South India's finest wilderness - Kabini, Bandipur, and Masinagudi - bringing together luxury stays, expert naturalists, and seamless planning under one trusted name.
            </p>
          </div>
          
          {/* CTA Buttons - Stacked nicely or aligned to the right side */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              id="hero-primary-cta"
              href="https://wa.me/918525911685"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black hover:bg-neutral-100 active:scale-95 transition-all px-8 py-4 rounded-full text-xs sm:text-sm font-sans font-medium text-center  hover:scale-[1.02]"
            >
              Chat on WhatsApp
            </a>
            <Link
              id="hero-secondary-cta"
              to="/experiences"
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all px-8 py-4 rounded-full text-xs sm:text-sm font-sans font-medium text-center backdrop-blur-xs hover:scale-[1.02]"
            >
              Plan My Adventure
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION A2: Masai Mara — Coming Soon */}
      <section
        id="masai-mara-coming-soon"
        className="w-full bg-black flex flex-col justify-center mt-[10px] py-16 lg:py-24"
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="group relative block rounded-[2.2rem] overflow-hidden aspect-[16/12] sm:aspect-[16/9] lg:aspect-[16/7.5] w-full bg-charcoal">
            <img
              src={masaiMaraUrl}
              alt="Masai Mara, Kenya — big cats in the golden savannah"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-[60%_38%] sm:object-[center_42%] select-none transition-transform duration-700 group-hover:scale-[1.03]"
            />

            {/* Legibility overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40 pointer-events-none" />

            {/* Coming Soon pill — top corner */}
            <span className="absolute top-6 left-6 sm:top-10 sm:left-10 lg:top-14 lg:left-14 z-10 inline-flex items-center gap-2 bg-white/10 text-white/95 border border-white/20 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D39E82]" />
              Coming Soon
            </span>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-14">
              <h2 className="font-sans text-[30px] sm:text-[40px] md:text-[48px] lg:text-[54px] font-normal tracking-tight leading-[1.1] text-white max-w-2xl">
                Masai Mara, Kenya
              </h2>
              <p className="hidden sm:block text-white/80 text-xs sm:text-sm md:text-base leading-relaxed font-sans font-light max-w-xl mt-3">
                Our first journey beyond South India. The great migration, big cats on the open plains, and Wild Inn's signature curation — arriving soon.
              </p>
              <a
                id="masai-mara-notify-cta"
                href="https://wa.me/918525911685?text=I%27d%20like%20to%20be%20notified%20about%20Wild%20Inn%20Masai%20Mara"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-100 active:scale-95 transition-all px-7 py-3.5 rounded-full text-xs sm:text-sm font-sans font-medium w-fit hover:scale-[1.02]"
              >
                Notify Me
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: Experiences listings ("Our Experiences") */}
      <section 
        id="our-tours" 
        className="w-full bg-black flex flex-col justify-center lg:h-screen lg:min-h-[620px] lg:max-h-[820px] py-16 lg:py-0"
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="bg-white/10 px-4 py-2 rounded-full text-[11px] font-sans font-medium text-white w-fit mb-6 border border-white/5  cursor-default">
                Our Experiences
              </div>
              <h2 className="font-sans text-[32px] sm:text-[38px] md:text-[42px] lg:text-[46px] leading-[1.1] tracking-tight text-white font-normal max-w-2xl">
                Journeys Curated for the Way You Want to Discover the Wild
              </h2>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link 
                to="/experiences" 
                className="bg-white text-black hover:bg-white/90 transition-colors px-6 py-3.5 rounded-full text-xs sm:text-sm font-sans font-medium"
              >
                See All Experiences
              </Link>
              <Link 
                to="/experiences"
                className="w-12 h-12 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform hover:scale-105"
              >
                <ArrowUpRight className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Cards list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {DESTINATIONS.slice(0, 3).map((dest) => (
              <Link
                key={dest.id}
                to={`/experiences/${dest.id}`}
                className="group relative block rounded-[2.2rem] overflow-hidden aspect-[3/4.2] w-full bg-charcoal  transition-transform duration-500 hover:-translate-y-1.5"
              >
                {/* Image */}
                <img
                  referrerPolicy="no-referrer"
                  src={dest.heroImage}
                  alt={dest.name}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    (dest as any).imagePosition || 'object-center'
                  }`}
                />
                
                {/* Top right circle button with arrow ↗ */}
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center  absolute top-6 right-6 transition-transform duration-300 group-hover:scale-105">
                  <ArrowUpRight className="w-4 h-4 text-black" />
                </div>

                {/* Dark gradient overlay */}
                

                {/* Left/Bottom title & details */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-sans text-[21px] font-normal leading-snug text-white mb-1.5">
                    {dest.name}
                  </h3>
                  <p className="text-white/70 text-xs font-sans leading-snug mb-3 line-clamp-2">
                    {dest.description}
                  </p>
                  <p className="text-[#D39E82] text-[11px] font-sans font-semibold tracking-wider uppercase flex items-center gap-2">
                    {dest.packages.length} Experiences
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D: Our Philosophy */}
      <section 
        id="experience-section" 
        className="w-full bg-black flex flex-col justify-center lg:h-screen lg:min-h-[620px] lg:max-h-[820px] py-16 lg:py-0"
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 space-y-10 lg:space-y-12">
          
          <div className="max-w-4xl text-left space-y-4">
            <div className="bg-white/10 px-4 py-2 rounded-full text-[11px] font-sans font-medium text-white w-fit mb-2 border border-white/5  cursor-default">
              Our Philosophy
            </div>
            <h2 className="font-sans text-[30px] sm:text-[36px] md:text-[40px] lg:text-[44px] leading-[1.12] tracking-tight text-white font-normal">
              We Don't Sell Safaris. We Curate Journeys.
            </h2>
            <p className="text-white/80 text-sm sm:text-base md:text-[17px] leading-relaxed max-w-2xl font-sans font-light">
              The stay, the sighting, the story — every detail considered, so your journey feels like it was made for you, not sold to you.
            </p>
          </div>

          {/* 3 landscape photo columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {[
              '/img/pexels-aakarsh-kohli-938178879-35073235.webp',
              '/img/pexels-ashwani-sharma-2153169983-35486562.webp',
              '/img/pexels-stephen-leonardi-587681991-28614276.webp'
            ].map((url, i) => (
              <div
                id={`exp-photo-col-${i}`}
                key={i}
                className="group relative aspect-[16/10.5] w-full rounded-[2.2rem] overflow-hidden bg-charcoal "
              >
                <img
                  referrerPolicy="no-referrer"
                  src={url}
                  alt={`Experience view ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          {/* Below images row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-none">
            <p className="text-white text-base md:text-[17px] font-sans font-normal leading-snug tracking-tight max-w-md">
              Ready to plan a journey shaped entirely around you?
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <Link 
                to="/gallery" 
                className="bg-white text-black hover:bg-white/90 transition-colors px-6 py-3.5 rounded-full text-xs sm:text-sm font-sans font-medium"
              >
                See Our Gallery
              </Link>
              <Link 
                to="/gallery"
                className="w-12 h-12 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform hover:scale-105"
              >
                <ArrowUpRight className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: Video Tour */}
      <section 
        id="video-tour" 
        className="w-full bg-black flex flex-col justify-center py-16 lg:py-24"
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="bg-white/10 px-4 py-2 rounded-full text-[11px] font-sans font-medium text-white w-fit mb-6 border border-white/5  cursor-default">
                In Motion
              </div>
              <h2 className="font-sans text-[32px] sm:text-[38px] md:text-[42px] lg:text-[46px] leading-[1.1] tracking-tight text-white font-normal max-w-2xl">
                A Glimpse Into the Wild
              </h2>
            </div>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-[320px] text-left md:text-right font-sans">
              A quiet moment from Kabini's backwaters — the kind of encounter every journey is built around.
            </p>
          </div>

          {/* Video Player Card */}
          <div 
            className="group relative block rounded-[2.2rem] overflow-hidden aspect-[16/10] sm:aspect-[16/9.5] lg:aspect-[16/8.2] w-full bg-charcoal "
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              poster="/img/pexels-ashwani-sharma-2153169983-35486562.webp"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            >
              <source src="/video/in-motion.webm" type="video/webm" />
              <source src="/video/in-motion.mp4" type="video/mp4" />
            </video>
            
            {/* Top dark gradient and bottom dark gradient overlay */}
            

            {/* Bottom Left Quote Overlay */}
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-left text-white max-w-sm sm:max-w-md">
              <p className="text-white/95 text-xs sm:text-[15px] md:text-[17px] font-sans leading-snug font-light">
                Every visit leaves something behind — stillness, wonder, and a story worth telling.
              </p>
            </div>
          </div>
        </div>
      </section>




      {/* SECTION H: Meet Your Host - Redesigned Founder Showcase */}
      <section 
        id="guide-team-section" 
        className="w-full bg-black flex flex-col justify-center py-16 lg:py-24"
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Premium portrait card of Nagadharshan B. */}
            <div className="lg:col-span-5 relative rounded-[2.2rem] overflow-hidden aspect-[3/4] w-full bg-[#121212] border border-white/10 group">
              <img
                src={founderUrl}
                alt="Nagadharshan B."
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] select-none opacity-90"
              />
              
              
              {/* Overlay Role pill in bottom-left */}
              <div className="absolute bottom-6 left-6 z-10">
                <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] tracking-wider uppercase font-sans font-semibold text-white border border-white/10  cursor-default">
                  Founder
                </span>
              </div>
            </div>

            {/* Right Column: Narrative Biography & Badges */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="bg-white/10 px-4 py-2 rounded-full text-[11px] font-sans font-medium text-white w-fit border border-white/5  cursor-default">
                Meet our Founder
              </div>
              <h2 className="font-sans text-[36px] sm:text-[46px] md:text-[52px] leading-[1.08] tracking-tight font-normal text-white">
                Nagadharshan B.
              </h2>
              <p className="text-white/85 text-sm sm:text-base md:text-[17px] leading-relaxed font-sans max-w-2xl font-light">
                "With a lifelong passion for wildlife and conservation, Nagadharshan B. founded Wild Inn to bring the same standard of trust and curation found in the world's finest safari brands to South India's own extraordinary wilderness. Every journey is shaped by firsthand knowledge of the region's forests, resorts, and naturalists — built one relationship at a time."
              </p>
              
              {/* Trust Badges layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {[
                  { icon: Award, label: "Founder-Led Curation" },
                  { icon: MapPin, label: "South India Wildlife Expertise" },
                  { icon: CheckSquare, label: "Trusted Resort & Naturalist Partners" },
                  { icon: Shield, label: "Personally Curated Journeys" }
                ].map((badge, idx) => {
                  const IconComponent = badge.icon;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white/5 border border-white/10 px-4 py-3.5 rounded-2xl text-[12px] font-sans font-medium text-white/90 flex items-center gap-3 hover:bg-white/10 transition-all duration-300 cursor-default"
                    >
                      <IconComponent className="w-4 h-4 text-white/60 shrink-0" />
                      <span>{badge.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION J: FAQ Section (Replaced exactly with Plan My Safari centered FAQ layout) */}
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

      

      {/* Video Modal Overlay removed */}

    </div>
  );
}
