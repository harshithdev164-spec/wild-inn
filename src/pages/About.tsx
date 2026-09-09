import { motion } from 'motion/react';
import { Compass, Shield, Award, Quote, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionEyebrow from '../components/SectionEyebrow';
import SEO from '../components/SEO';
import founderUrl from '../assets/founder.webp';

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
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1] } 
  },
};

export default function About() {
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
        'name': 'About',
        'item': 'https://www.wildinn.in/about'
      }
    ]
  };

  return (
    <div id="about-page" className="bg-black text-white min-h-screen space-y-0">
      <SEO 
        title="About Us" 
        description="Learn more about Wild Inn, our founder-led curation, ecological conservation commitments, and our trusted naturalist partners."
        structuredData={breadcrumbSchema}
      />
      
      {/* 1. HERO SECTION */}
      <section id="about-hero" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end"
        >
          <div className="lg:col-span-8 space-y-6">
            <SectionEyebrow>About the Inn</SectionEyebrow>
            <h1 className="font-sans text-[42px] sm:text-[54px] md:text-[68px] font-normal tracking-tight leading-[1.05] text-white">
              Trusted Guides
            </h1>
            <p className="text-white/80 text-base sm:text-lg font-sans font-light max-w-2xl leading-relaxed">
              At Wild Inn, we believe a safari is only as good as the person leading it. Our journey began with a simple purpose: to connect discerning travelers with the most skilled naturalists, veteran trackers, and pristine landscapes of South India.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right pb-2">
            <span className="inline-block bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-xs font-mono tracking-wider text-white/70">
              EST. 2026 · KABINI, BANDIPUR & MASINAGUDI
            </span>
          </div>
        </motion.div>

        {/* Big Featured Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 rounded-[2.5rem] overflow-hidden aspect-[21/9] max-h-[500px] border border-white/10 shadow-2xl relative"
        >
          <img
            referrerPolicy="no-referrer"
            src="/img/pexels-sachin-nihcas-1318516-7594669.webp"
            alt="Trusted guide tracking wild elephants in South India's dense mist forests"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:bottom-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-xs sm:text-sm font-sans font-light text-white/90">
              The buffer zones of Nagarhole National Park, South India
            </span>
            <span className="text-xs font-mono text-white/60 uppercase tracking-widest bg-black/40 backdrop-blur-xs px-3 py-1 rounded-md border border-white/5">
              Live Safari Tracker view
            </span>
          </div>
        </motion.div>
      </section>

      {/* 2. QUOTE SECTION */}
      <section id="about-quote" className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="border-y border-white/10 py-12 sm:py-16 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black px-4">
            <Quote className="w-8 h-8 text-terracotta opacity-60" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl md:text-[36px] italic leading-relaxed text-white/95 max-w-4xl mx-auto">
            "Every journey is a relationship built on trust, firsthand forest knowledge, and absolute transparency."
          </p>
          <div className="mt-6 flex flex-col items-center">
            <span className="block text-xs font-mono uppercase tracking-widest text-white/60">
              Nagadharshan B.
            </span>
            <span className="block text-[10px] text-terracotta uppercase tracking-wider mt-1">
              Founder, Wild Inn
            </span>
          </div>
        </div>
      </section>

      {/* 3. IMAGE GALLERY */}
      <section id="about-gallery-grid" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8"
        >
          {/* Main Left Portrait Image */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-5 rounded-[2rem] overflow-hidden h-[350px] sm:h-[500px] border border-white/10 relative group"
          >
            <img
              referrerPolicy="no-referrer"
              src="/img/pexels-best-safari-insights-2159031159-35751549.webp"
              alt="Apex predators tracked in Kabini"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6">
              <span className="block text-[10px] font-mono text-terracotta uppercase tracking-wider mb-1">THE TRACKING EXPERIENCE</span>
              <h3 className="font-sans text-lg font-normal text-white">Chasing the perfect frame</h3>
            </div>
          </motion.div>

          {/* Two Stacked Right Images */}
          <div className="md:col-span-7 grid grid-rows-2 gap-6 sm:gap-8">
            <motion.div 
              variants={itemVariants}
              className="rounded-[2rem] overflow-hidden h-[230px] sm:h-[236px] border border-white/10 relative group"
            >
              <img
                referrerPolicy="no-referrer"
                src="/img/pexels-samirusandeepa-38147409.webp"
                alt="Elephant herds in the backwaters"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6">
                <span className="block text-[10px] font-mono text-terracotta uppercase tracking-wider mb-1">RIVERSIDE BIOMES</span>
                <h3 className="font-sans text-lg font-normal text-white">The river belongs to giants</h3>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="rounded-[2rem] overflow-hidden h-[230px] sm:h-[236px] border border-white/10 relative group"
            >
              <img
                referrerPolicy="no-referrer"
                src="/img/pexels-ashwani-sharma-2153169983-35369036.webp"
                alt="Leopards in Nagarhole canopy"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6">
                <span className="block text-[10px] font-mono text-terracotta uppercase tracking-wider mb-1">CANOPY SHADOWS</span>
                <h3 className="font-sans text-lg font-normal text-white">Predator territory of Nagarhole</h3>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section id="about-why-choose-us" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <SectionEyebrow>Our Distinction</SectionEyebrow>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight">
            Why Discerning Travelers Choose Us
          </h2>
          <p className="text-white/70 text-sm sm:text-base font-light font-sans leading-relaxed">
            We reject the conveyor-belt model of hospitality to preserve the rare, quiet moments that make a journey forever memorable.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white/5 rounded-3xl border border-white/10 p-8 space-y-5 relative overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className="p-3 bg-white/10 rounded-2xl w-fit">
              <Compass className="w-6 h-6 text-terracotta" />
            </div>
            <h3 className="font-sans text-xl font-normal text-white">100% Native Experts</h3>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed font-sans font-light">
              Our naturalists and local trackers grew up on the forest boundaries. Their tracking instincts and wildlife behaviors are not learned from textbooks, but inherited over generations.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white/5 rounded-3xl border border-white/10 p-8 space-y-5 relative overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className="p-3 bg-white/10 rounded-2xl w-fit">
              <Shield className="w-6 h-6 text-terracotta" />
            </div>
            <h3 className="font-sans text-xl font-normal text-white">Zero-Crowd Philosophy</h3>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed font-sans font-light">
              We strictly organize micro-group safaris and coordinate with elite boutique eco-lodges, ensuring that you hear the bird calls and rustle of leaves, not tourist crowds.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white/5 rounded-3xl border border-white/10 p-8 space-y-5 relative overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className="p-3 bg-white/10 rounded-2xl w-fit">
              <Award className="w-6 h-6 text-terracotta" />
            </div>
            <h3 className="font-sans text-xl font-normal text-white">Direct-to-Conservation</h3>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed font-sans font-light">
              We work in direct partnership with local anti-poaching structures and forest tribes. A dedicated portion of every single journey goes directly back to supporting trackers and their families.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. STORY BEHIND */}
      <section id="about-story-behind" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Founder Card */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 space-y-6 relative overflow-hidden"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10">
                <img
                  src={founderUrl}
                  alt="Nagadharshan B., Founder of Wild Inn"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-terracotta uppercase tracking-wider">FOUNDER & CHIEF PLANNER</span>
                <h3 className="font-sans text-xl text-white font-normal">Nagadharshan B.</h3>
                <p className="text-white/60 text-xs sm:text-sm italic font-serif">
                  "We built Wild Inn to share South India's pristine forests with absolute truth and native precision."
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Narrative Story Text */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <SectionEyebrow>The Story Behind</SectionEyebrow>
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-[45px] font-normal tracking-tight text-white leading-tight">
                An Alternative to the Commercial Conveyor Belt
              </h2>
            </div>

            <div className="space-y-6 text-white/85 text-sm sm:text-base leading-relaxed font-sans font-light">
              <p>
                Wild Inn was founded by Nagadharshan B., a naturalist who noticed a growing gap in South India’s safari landscape. While the region’s forests boast some of the highest predator densities globally, the booking and guiding system had become overly commercialized, impersonal, and opaque.
              </p>
              <p>
                "Guests were being shuttled through generic routes, staying in massive cookie-cutter resorts, and missing the true heartbeat of the wild," Nagadharshan recalls. "We wanted to create a brand where every detail—from the custom safari vehicle mounts to the private naturalist guides—is curated with the level of dedication we’d give to our own families."
              </p>
              <p>
                Today, Wild Inn operates as a curated network of elite relationships with South India’s finest conservationists, eco-lodges, and state forest authorities. We don't sell standardized holiday packages; we curate deeply personal passages into the natural world.
              </p>
            </div>

            {/* Quick stats board */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div className="space-y-1">
                <span className="block text-2xl sm:text-3xl font-sans font-bold text-white">10+</span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-white/60">Years in the Bush</span>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-4 sm:pl-6">
                <span className="block text-2xl sm:text-3xl font-sans font-bold text-white">100%</span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-white/60">Native Guided</span>
              </div>
              <div className="space-y-1 border-l border-white/10 pl-4 sm:pl-6">
                <span className="block text-2xl sm:text-3xl font-sans font-bold text-white">70+</span>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-white/60">Families Guided</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      

    </div>
  );
}
