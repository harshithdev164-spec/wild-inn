import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Check, AlertTriangle, Star,
  MapPin, Leaf, ArrowUpRight
} from 'lucide-react';

import { DESTINATIONS } from '../data/destinationsData';
import SEO from '../components/SEO';
import CheckoutDialog from '../components/CheckoutDialog';
import { usePackagePrices } from '../hooks/usePackagePrices';

// --- Shared Helper Data ---
const WILDLIFE = ['Tiger', 'Elephant', 'Leopard', 'Gaur', 'Sloth Bear', 'Birdlife'];
const INCLUDES = ['Luxury Stay', 'Safari', 'Meals', 'Naturalist', 'Bonfire', 'Nature Walk'];

export default function TourDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const destination = DESTINATIONS.find(d => d.id === slug);
  const [checkoutPkg, setCheckoutPkg] = useState<any>(null);
  const { withLivePrice } = usePackagePrices();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!destination) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center pt-24">
        <div className="max-w-md bg-white/5 rounded-2xl border border-white/10 p-8 space-y-4  text-center">
          <AlertTriangle className="w-12 h-12 text-white mx-auto" />
          <h1 className="font-sans text-2xl font-normal text-white">Destination Not Found</h1>
          <p className="text-sm text-white/60 leading-relaxed">
            We couldn't find the wilderness destination you are looking for.
          </p>
          <Link
            to="/experiences"
            className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Experiences</span>
          </Link>
        </div>
      </div>
    );
  }

  // Define dynamic structured schemas
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
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': destination.name,
        'item': `https://www.wildinn.in/experiences/${destination.id}`
      }
    ]
  };

  const destinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    'name': `${destination.name} Safari Experience`,
    'description': destination.description,
    'image': destination.heroImage,
    'touristType': 'Wildlife Enthusiasts, Photographers, Adventure Seekers',
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': destination.id === 'kabini' ? '11.9212' : destination.id === 'bandipur' ? '11.6667' : '11.5333',
      'longitude': destination.id === 'kabini' ? '76.2736' : destination.id === 'bandipur' ? '76.6333' : '76.6167'
    }
  };

  const schemas = [breadcrumbSchema, destinationSchema];

  const handleEnquire = () => {
    navigate('/contact');
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#D39E82] selection:text-black">
      <SEO 
        title={`${destination.name} Safari`}
        description={destination.description}
        ogImage={destination.heroImage}
        structuredData={schemas}
      />
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-screen min-h-[700px] flex items-end pb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src={destination.heroImage} 
            alt={destination.name}
            loading="eager"
            fetchPriority="high"
            className={`w-full h-full object-cover ${(destination as any).imagePosition || 'object-center'}`}
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <Link to="/experiences" className="inline-flex items-center gap-2 text-white/90 hover:text-white text-xs font-mono tracking-widest uppercase mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>All Destinations</span>
          </Link>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-sans font-normal tracking-tight text-white mb-4">
            {destination.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-mono tracking-wider uppercase">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> South India</span>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* 2. Destination Overview */}
        <section className="py-24">
          <div className="max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-sans text-white mb-8">The Experience</h2>
            <p className="text-xl sm:text-2xl text-white/70 font-light leading-relaxed">
              {destination.description}
            </p>
          </div>
        </section>

        {/* 3. Wildlife Guide & Inclusions Grid */}
        <section className="py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h3 className="text-2xl font-sans text-white flex items-center gap-3">
                <Leaf className="w-6 h-6 text-[#D39E82]" />
                Wildlife Guide
              </h3>
              <p className="text-white/60 leading-relaxed mb-6">
                Our expert naturalists will guide you through dense forests to track some of the region's most elusive predators and spectacular birdlife.
              </p>
              <div className="flex flex-wrap gap-3">
                {WILDLIFE.map((animal, i) => (
                  <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/90 font-medium">
                    {animal}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-sans text-white flex items-center gap-3">
                <Star className="w-6 h-6 text-[#D39E82]" />
                Standard Inclusions
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INCLUDES.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <Check className="w-5 h-5 text-white/30" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Available Packages */}
        <section className="py-24">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-sans text-white mb-4">Available Packages</h2>
            <p className="text-white/60 max-w-2xl text-lg">Select a curated experience designed for couples, families, or avid photographers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destination.packages.map((rawPkg: any, i: number) => {
              const pkg = withLivePrice(destination.id, rawPkg);
              return (
              <div
                key={i}
                className="bg-[#121212] border border-white/10 p-8 rounded-[2rem] flex flex-col justify-between group hover:border-white/30 transition-colors"
              >
                <div>
                  <h4 className="text-xl font-sans text-white mb-2">{pkg.name}</h4>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-white/50 mb-6">{pkg.duration}</p>

                  <div className="mb-8">
                    <span className="text-3xl font-sans text-white">{pkg.price}</span>
                    <span className="text-sm text-white/50 ml-2">/ {pkg.unit}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.highlights.map((highlight: string, j: number) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-white/70">
                        <Check className="w-4 h-4 text-[#D39E82] shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setCheckoutPkg(pkg)}
                    className="inline-flex items-center justify-between w-full py-4 px-6 bg-white hover:bg-white/90 text-black rounded-full transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-sans uppercase font-semibold tracking-wider">Book &amp; Pay</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleEnquire}
                    className="w-full py-2 text-center text-[11px] font-mono uppercase tracking-wider text-white/45 hover:text-white/80 transition-colors cursor-pointer"
                  >
                    or enquire first
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </section>
      </div>

      <CheckoutDialog
        open={!!checkoutPkg}
        onClose={() => setCheckoutPkg(null)}
        slug={destination.id}
        destinationName={destination.name}
        pkg={checkoutPkg}
      />
    </div>
  );
}
