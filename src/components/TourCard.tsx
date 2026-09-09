import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, Star, ArrowRight } from 'lucide-react';
import { Tour } from '../types';

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <motion.div
      id={`tour-card-${tour.slug}`}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group"
    >
      {/* Photo Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
        <img
          referrerPolicy="no-referrer"
          src={tour.coverImage}
          alt={tour.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Rating and Difficulty Badges Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-black/85 backdrop-blur-xs rounded-full text-[10px] font-mono font-bold text-white shadow-xs">
            <Star className="w-3 h-3 text-white fill-white" />
            <span>{tour.rating.toFixed(1)}</span>
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-white shadow-xs ${
            tour.difficulty === 'Easy' 
              ? 'bg-emerald-600/90' 
              : tour.difficulty === 'Moderate' 
              ? 'bg-amber-600/90' 
              : 'bg-rose-700/90'
          }`}>
            {tour.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-sans text-xl font-normal text-white group-hover:text-white/80 transition-colors">
            {tour.name}
          </h3>
          <div className="text-right shrink-0">
            <span className="block font-mono text-[11px] font-bold text-[#D39E82] uppercase tracking-wider mt-1">
              Enquire
            </span>
          </div>
        </div>

        <p className="text-white/70 text-xs leading-relaxed mb-6 flex-grow">
          {tour.tagline}
        </p>

        {/* Info footer */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-1 text-xs font-mono text-white/60">
            <Clock className="w-4 h-4 text-white/60" />
            <span>{tour.duration}</span>
          </div>
          
          <Link
            id={`tour-btn-${tour.slug}`}
            to={`/experiences/${tour.slug}`}
            className="inline-flex items-center space-x-1 text-xs font-mono font-bold tracking-wider uppercase text-white group-hover:text-white/80 transition-colors"
          >
            <span>Explore Experience</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-white" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
