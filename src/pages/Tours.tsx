import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, MapPin, Compass, Shield, UserCheck, 
  Camera, Bell, Calendar, ArrowDown
} from 'lucide-react';

import { DESTINATIONS, COMING_SOON } from '../data/destinationsData';
import SEO from '../components/SEO';

export default function Tours() {
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
        'name': 'Experiences',
        'item': 'https://www.wildinn.in/experiences'
      }
    ]
  };

  return (
    <div id="experiences-discovery-page" className="bg-black text-white min-h-screen font-sans selection:bg-[#D39E82] selection:text-black">
      <SEO 
        title="Wildlife Experiences" 
        description="Choose your wildlife destination: Kabini, Bandipur, and Masinagudi, and discover our meticulously curated safari itineraries."
        structuredData={breadcrumbSchema}
      />
      
      {/* SECTION A: Hero (Bottom-Aligned Content to Unobstruct Center) */}
      <section className="relative w-full h-[95vh] sm:h-screen flex items-end justify-start overflow-hidden pt-28 pb-16 sm:pb-24 px-6 sm:px-12 md:px-16 lg:px-24">
        {/* Background Image */}
        <img
          src="/img/hero-destinations.webp"
          alt="Tiger in the wild, South India"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-[68%_38%] scale-105 z-0"
        />
        
        {/* Elegant gradient overlay rising from bottom to protect text legibility, keeping center clear */}
        

        {/* Bottom-Aligned Content Overlay */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
          
          {/* Text Content */}
          <div className="space-y-4 max-w-2xl text-left">
            <span className="inline-block bg-white/10 text-white/95 border border-white/20 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full backdrop-blur-xs">
              Our Destinations
            </span>
            <h1 className="font-sans text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-normal tracking-tight leading-[1.1] text-white">
              Choose Your Wild <br className="hidden sm:inline" />
              Experience
            </h1>
            <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed font-sans font-light max-w-xl">
              Discover South India's most extraordinary wildlife destinations, each offering carefully curated safari experiences and luxury stays.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('destinations-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-black hover:bg-neutral-100 active:scale-95 transition-all px-8 py-4 rounded-full text-xs sm:text-sm font-sans font-medium text-center  hover:scale-[1.02] inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Destinations</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Destination Grid */}
      <section id="destinations-grid" className="w-full bg-black py-24 sm:py-32 scroll-mt-16">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 space-y-24">
          
          {DESTINATIONS.map((dest, idx) => (
            <motion.div 
              key={dest.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
            >
              {/* Image side */}
              <div className={`lg:col-span-7 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <Link to={`/experiences/${dest.id}`} className="block relative rounded-[2rem] overflow-hidden aspect-[4/3] lg:aspect-[16/10]">
                  <img 
                    src={dest.heroImage} 
                    alt={dest.name}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${(dest as any).imagePosition || 'object-center'}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </Link>
              </div>

              {/* Content side */}
              <div className={`lg:col-span-5 space-y-8 ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <div>
                  <h2 className="text-4xl sm:text-5xl font-sans text-white mb-4">{dest.name}</h2>
                  <p className="text-white/70 text-lg leading-relaxed font-light">
                    {dest.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-white/50">Wildlife Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Tiger', 'Elephant', 'Leopard', 'Birdlife'].map((animal, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/80">
                        {animal}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/10">
                  <div>
                    <span className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-1">Starting From</span>
                    <span className="text-2xl font-sans text-white">₹{dest.id === 'masinagudi' ? '4,999' : '8,999'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-1">Available</span>
                    <span className="text-xl font-sans text-white">{dest.packages.length} {dest.packages.length === 1 ? 'Experience' : 'Experiences'}</span>
                  </div>
                </div>

                <Link
                  to={`/experiences/${dest.id}`}
                  className="inline-flex items-center gap-3 text-white hover:text-[#D39E82] transition-colors font-sans uppercase tracking-wider text-sm font-medium"
                >
                  <span>Explore {dest.name}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </motion.div>
          ))}

        </div>
      </section>

      {/* 3. Coming Soon Section */}
      <section id="coming-soon" className="w-full bg-[#0a0a0a] py-24 lg:py-32 border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-sans text-white mb-4">Launching Soon</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto font-light">
              We are carefully crafting relationships with premium lodges and naturalists in these extraordinary reserves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMING_SOON.map((item, i) => (
              <div key={i} className="group relative bg-[#121212] rounded-[2rem] overflow-hidden border border-white/10">
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${(item as any).imagePosition || 'object-center'}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase text-white ">
                    Coming Soon
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-sans text-white mb-2">{item.name}</h3>
                  <p className="text-sm text-white/60 mb-6 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

