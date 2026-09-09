import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const GALLERY_IMAGES = [
  '/img/pexels-lorenzo-boldorini-134457203-29707600.webp',
  '/img/pexels-naturegraphy-wildroar-14695337.webp',
  '/img/pexels-roopsarkar-12053043.webp',
  '/img/pexels-ravikant-32108110.webp',
  '/img/pexels-usarora-28729329.webp',
  '/img/pexels-george-desipris-2055100.webp',
  '/img/pexels-leon-aschemann-734730704-27834731.webp',
  '/img/pexels-roshanravi-35170201.webp',
  '/img/pexels-isharakasthuriarachchi-18065167.webp',
  '/img/pexels-sargaraj-tr-423973759-18602649.webp',
  '/img/pexels-leon-aschemann-734730704-29186371.webp',
  '/img/pexels-ravikant-32108104.webp',
  '/img/pexels-roopsarkar-11094477-1.webp',
  '/img/pexels-meghav-27016812.webp',
  '/img/pexels-sachin-nihcas-1318516-7594669.webp',
  '/img/pexels-leon-aschemann-734730704-27834738.webp'
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.610, 0.355, 1],
    },
  },
};

export default function Gallery() {
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
        'name': 'Gallery',
        'item': 'https://www.wildinn.in/gallery'
      }
    ]
  };

  const imageSchemas = GALLERY_IMAGES.slice(0, 4).map((url, index) => ({
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    'contentUrl': url,
    'creator': 'Wild Inn Naturalists',
    'caption': `High-definition South India safari sighting - frame ${index + 1}`
  }));

  const schemas = [breadcrumbSchema, ...imageSchemas];

  return (
    <div id="gallery-page" className="bg-black text-white pt-32 pb-24 min-h-screen">
      <SEO 
        title="Wilderness Gallery" 
        description="Browse through standard wildlife frames captured by our expert guides and naturalists across South India's dense reserves."
        structuredData={schemas}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pb-4">
          <div className="md:col-span-7 space-y-4">
            <span className="inline-flex items-center px-4.5 py-1.5 bg-white/10 text-white border border-white/5 rounded-full text-[11px] font-sans font-semibold tracking-wider uppercase">
              Our Stories
            </span>
            <h1 className="font-sans text-4xl sm:text-5xl md:text-[64px] font-normal tracking-tight text-white leading-none">
              Gallery
            </h1>
          </div>
          <div className="md:col-span-5 text-left md:text-right md:pb-2">
            <p className="text-white/80 text-sm sm:text-base font-sans font-light max-w-md md:ml-auto leading-relaxed">
              Moments from Kabini's backwaters and the serene landscapes of Bandipur and Masinagudi - a glimpse of what awaits on a Wild Inn journey.
            </p>
          </div>
        </div>

        {/* Masonry Columns Layout: preserves original aspect ratios, preventing any cropping */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.02 }}
          className="columns-1 sm:columns-2 md:columns-3 gap-6 sm:gap-8"
        >
          {GALLERY_IMAGES.map((src, idx) => (
            <motion.div
              key={idx}
              id={`gallery-block-${idx}`}
              variants={itemVariants}
              className="break-inside-avoid mb-6 sm:mb-8 relative rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-lg group"
            >
              <img
                referrerPolicy="no-referrer"
                src={src}
                alt={`Wild Inn Gallery Moment ${idx + 1}`}
                loading="lazy"
                className="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-102"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM CTA (As requested: H2: "Ready to See It for Yourself?", Button: "Plan My Journey", with a beautiful forest background) */}
        <section id="gallery-cta-banner" className="w-full pt-8">
          <div 
            className="relative border border-white/10 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 shadow-2xl max-w-4xl mx-auto text-center overflow-hidden bg-cover bg-center"
            style={{ 
              backgroundImage: `url('/img/pexels-sachin-nihcas-1318516-7594669.webp')`
            }}
          >
            {/* Subtle low-opacity dark overlay to ensure maximum text readability */}
            <div className="absolute inset-0 bg-black/25 z-0 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
              
              <span className="inline-block bg-white/20 text-white border border-white/10 text-[11px] font-sans font-semibold px-4.5 py-1.5 rounded-full uppercase tracking-wider w-fit">
                Start now
              </span>
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-[44px] leading-[1.12] tracking-tight font-normal text-white mt-6 mb-8">
                Ready to See It for Yourself?
              </h2>
              
              {/* CTA buttons */}
              <div className="flex items-center gap-4 pt-2">
                <Link
                  to="/contact"
                  className="bg-white hover:bg-neutral-100 text-black font-sans font-medium text-xs sm:text-sm px-7 py-4 rounded-full shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center cursor-pointer"
                >
                  Plan My Adventure
                </Link>
                <Link
                  to="/contact"
                  className="bg-white hover:bg-neutral-100 text-black w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-[1.02] cursor-pointer shadow-lg"
                  aria-label="Navigate to trip planning form"
                >
                  <ArrowUpRight className="w-5 h-5 text-black" />
                </Link>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
