export interface Tour {
  id: string;
  slug: string;
  name: string;
  price: number;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  rating: number;
  reviewCount: number;
  description: string;
  tagline: string;
  highlights: string[];
  itinerary: {
    time: string;
    activity: string;
    details: string;
  }[];
  coverImage: string;
  images: string[];
  galleryImages: string[];
  stayImages: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or Rich Text
  category: string;
  date: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  tour: string;
  date: string;
  avatar: string;
  rating: number;
}

export interface Guide {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  quote?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Reel {
  id: string;
  title: string;
  tour_slug: string | null;
  location: string | null;
  description: string | null;
  video_url: string;
  poster_url: string | null;
  duration_sec: number;
  aspect_ratio: string;
  sort_order: number;
}
