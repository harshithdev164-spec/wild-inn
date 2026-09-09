import { Tour, BlogPost, Testimonial, Guide, FAQItem } from './types';
import founderUrl from './assets/founder.webp';

export const TOURS: Tour[] = [
  {
    id: '1',
    slug: 'kabini',
    name: 'Kabini',
    price: 0,
    duration: '3 Nights',
    difficulty: 'Easy',
    rating: 5.0,
    reviewCount: 42,
    tagline: 'A curated immersion into tiger and leopard territory.',
    description: 'Immerse yourself in Kabini\'s storied wilderness. Famous for some of the highest densities of tigers, leopards, and elephants in South India, this curated journey balances luxury lodge stays with daily guided vehicle safaris led by senior naturalists.',
    highlights: [
      'Exclusive 4x4 safaris in Nagarhole National Park',
      'Stays at highly-rated eco-luxury wilderness lodges',
      'Daily briefing and tracking insights from expert naturalists',
      'Guided nature and bird-watching walks along the riverbank'
    ],
    itinerary: [
      { time: '06:00', activity: 'Sunrise Safari', details: 'Board the custom open 4x4 for the morning drive into the core forest.' },
      { time: '09:30', activity: 'Bush Breakfast', details: 'Indulge in a fresh breakfast served under the forest canopy.' },
      { time: '12:00', activity: 'Naturalist Briefing', details: 'A quiet session explaining bird behavior and tiger tracks.' },
      { time: '15:30', activity: 'Afternoon Drive', details: 'Return to the reserve paths as the forest wakes up for dusk.' },
      { time: '19:00', activity: 'Campfire Stories', details: 'Settle by the fireside to share stories of the day\'s sightings.' }
    ],
    coverImage: '/img/pexels-best-safari-insights-2159031159-35751549.webp',
    images: [
      '/img/pexels-best-safari-insights-2159031159-35751549.webp',
      'https://images.unsplash.com/photo-1547970894-3f8ae3615968?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1547970894-3f8ae3615968?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534145946892-747cc15db999?auto=format&fit=crop&w=1200&q=80'
    ],
    stayImages: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928120-2c14f2932b13?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: '2',
    slug: 'bandipur',
    name: 'Bandipur',
    price: 0,
    duration: '2 Days',
    difficulty: 'Easy',
    rating: 5.0,
    reviewCount: 36,
    tagline: 'Discover the charm of the tiger reserve at the foothills of the Nilgiris.',
    description: 'Experience the magical forests of Bandipur National Park. Known for its thriving population of tigers, leopards, and large herds of Indian elephants, Bandipur offers stunning landscapes backed by the blue Nilgiri hills. Enjoy expert-led safaris tracking majestic big cats through dense deciduous woodlands.',
    highlights: [
      'Open jeep safaris through core tiger territory',
      'Unparalleled vantage points for viewing elephant herds against mountain backdrops',
      'Bird-watching guidance for rare osprey, eagles, and peafowl',
      'Premium forest lodge accommodations with serene views'
    ],
    itinerary: [
      { time: '06:15', activity: 'Boarding', details: 'Early morning entry into the pristine Bandipur forest.' },
      { time: '07:00', activity: 'Elephant Basin', details: 'Cruising through tracks frequented by migratory elephant herds.' },
      { time: '09:30', activity: 'Breakfast', details: 'Disembark at a secure private clearing for a traditional South Indian breakfast.' },
      { time: '11:00', activity: 'Avian Search', details: 'Explore the shallow marshes for nesting migratory birds.' },
      { time: '12:30', activity: 'Return Transfer', details: 'Comfortable transfer back to your lodge in a private vehicle.' }
    ],
    coverImage: '/img/pexels-samirusandeepa-38147409.webp',
    images: [
      '/img/pexels-samirusandeepa-38147409.webp',
      'https://images.unsplash.com/photo-1547970894-3f8ae3615968?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1547970894-3f8ae3615968?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504618223053-559bdef9dd5a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534145946892-747cc15db999?auto=format&fit=crop&w=1200&q=80'
    ],
    stayImages: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928120-2c14f2932b13?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: '3',
    slug: 'masinagudi-and-mudumalai',
    name: 'Masinagudi and Mudumalai',
    price: 0,
    duration: '3 Days',
    difficulty: 'Moderate',
    rating: 5.0,
    reviewCount: 29,
    tagline: 'Built for those seeking pristine wilderness at the foothills.',
    description: 'Explore the spectacular Mudumalai Tiger Reserve and the serene landscapes of Masinagudi. With deep jungles and varied terrain, this destination is perfect for tracking predators and capturing pristine frames. Encounter rich wildlife in the shadow of the Nilgiri hills in an immersive journey.',
    highlights: [
      'Private, dedicated safari vehicles with experienced trackers',
      'Explore rugged mountain tracks and ancient tribal paths',
      'Focus on big cat tracking and wild elephant behavior',
      'Exclusive boutique stays nestled in the Masinagudi landscape'
    ],
    itinerary: [
      { time: '05:30', activity: 'Pre-Light Prep', details: 'Briefing on target locations and tracking signs.' },
      { time: '06:00', activity: 'First Light Tracking', details: 'Entering the Mudumalai reserve at dawn to catch predators in active light.' },
      { time: '11:00', activity: 'Nature Walk', details: 'A guided walk around the lodge to spot endemic bird species.' },
      { time: '15:00', activity: 'Golden Hour Safari', details: 'Positioning near watering holes for dramatic sunset reflections.' },
      { time: '19:30', activity: 'Dinner under the stars', details: 'A quiet evening sharing stories around the dinner table.' }
    ],
    coverImage: '/img/pexels-ashwani-sharma-2153169983-35369036.webp',
    images: [
      '/img/pexels-ashwani-sharma-2153169983-35369036.webp',
      'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80'
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534145946892-747cc15db999?auto=format&fit=crop&w=1200&q=80'
    ],
    stayImages: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928120-2c14f2932b13?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'best-time-to-visit-kabini-for-tiger-sightings',
    title: 'Best Time to Visit Kabini for Tiger Sightings',
    excerpt: 'Planning your wildlife journey? Here is our comprehensive guide to seasons, water levels, and peak predator tracking in Kabini.',
    content: `Kabini is a majestic wilderness of dense forests, ancient bamboo groves, and a spectacular river basin. But to witness its apex predators, timing your visit is key.

### The Dry Season Peak: March to May
The absolute best time for tiger sightings in Kabini is during the peak summer months. As the water sources deep within the national park dry up, predators and prey alike are drawn to the receding banks of the river reservoir.
- **Sightings Probability:** Highest of the year. Tigers are regularly spotted swimming or resting in the cool river breeze.
- **Landscape:** Clearer undergrowth, making it much easier to spot cats walking between trees.

### The Lush Monsoons: June to September
The forest becomes an intense, brilliant green. While predator tracking is more difficult due to thick foliage, this is the best season for watching elephant herds and experiencing the wild forest atmosphere.`,
    category: 'Wildlife Guide',
    date: 'July 12, 2026',
    coverImage: '/img/pexels-best-safari-insights-2159031159-35751549.webp',
    author: {
      name: 'Nagadharshan B.',
      role: 'Founder',
      avatar: founderUrl
    }
  },
  {
    id: '2',
    slug: 'a-photographers-guide-to-kabinis-backwaters',
    title: 'A Photographer\'s Guide to Kabini\'s Backwaters',
    excerpt: 'Master the challenging forest light and capture pristine frames of elephants, tigers, and rare avian species on the river.',
    content: `Recollecting the perfect wildlife shot requires more than patience - it requires a deep understanding of Kabini\'s micro-conditions.

### Dealing with the Forest Canopy
The contrast between direct midday sun and dark forest floor shadows is a classic challenge.
- **Golden Hours:** Enter the park early. The light between 06:15 and 07:30 is beautifully soft, scattering through the morning mist.
- **Camera Settings:** Keep your shutter speed high (at least 1/1000s) to freeze action when birds take flight or predators move through high grass.

### Capturing from the Water
During the Backwater Safari, boat stability is key. Use a monopod or beanbag over the boat railings to stabilize telephoto lenses.`,
    category: 'Photography Guide',
    date: 'July 10, 2026',
    coverImage: '/img/pexels-samirusandeepa-38147409.webp',
    author: {
      name: 'Nagadharshan B.',
      role: 'Founder',
      avatar: founderUrl
    }
  },
  {
    id: '3',
    slug: 'tracking-the-phantom-black-panther-of-kabini',
    title: 'Tracking the Phantom: The Black Panther of Kabini',
    excerpt: 'The legend of Saya, the elusive black panther that roams the dry deciduous forests of Kabini, and how our expert trackers spot him.',
    content: `Kabini holds many secrets, but none are as legendary as Saya, the melanistic leopard—or black panther—that has captured the imagination of wildlife enthusiasts around the world.

### The Science Behind the Shadow
Melanism is a gene mutation that results in an excess of dark pigment. Far from being a separate species, Saya is an Indian Leopard (*Panthera pardus fusca*) with a coat of deep, midnight black. If you look closely in the right light, his iconic rosette spots are still visible beneath his dark fur.

### Why Kabini is Unique
Typically, melanistic leopards thrive in dense, humid, evergreen rainforests where their dark coloration offers the perfect camouflage (such as the Western Ghats). Saya's territory in Kabini's dry deciduous forest is a fascinating anomaly, making him stand out dramatically against the bamboo groves and dry undergrowth.

### Tracking Tips from Our Naturalists
Spotting a black leopard requires patience, tracking instincts, and a bit of luck. Our veteran guides watch for:
1. **Langur Alarm Calls:** The high-pitched warnings of Nilgiri langurs are the forest's primary indicator of a moving predator.
2. **Scratches on Bark:** Black leopards often mark territorial boundaries on prominent trees along the jeep tracks.`,
    category: 'Predator Tracking',
    date: 'July 08, 2026',
    coverImage: '/img/pexels-george-desipris-2055100.webp',
    author: {
      name: 'Nagadharshan B.',
      role: 'Founder',
      avatar: founderUrl
    }
  },
  {
    id: '4',
    slug: 'the-giants-of-bandipur-conserving-ancient-corridors',
    title: 'The Giants of Bandipur: Conserving Ancient Corridors',
    excerpt: 'Explore the critical role of the Bandipur forest corridor in linking the Eastern and Western Ghats, protecting India\'s largest elephant population.',
    content: `Bandipur Tiger Reserve is not just a beautiful wilderness—it is one of India\'s most crucial ecological corridors. Linking the Eastern Ghats to the Western Ghats, this rugged forest allows genetic exchange between wildlife populations of two vast mountain ranges.

### The Importance of the Corridor
For Asiatic elephants, seasonal migrations are a matter of survival. As water levels and foliage shift, herds move between the Nilgiri Hills and Biligirirangana Hills. The uninterrupted forest of Bandipur ensures they can travel without conflicting with human settlements.

### Coexisting with Forest Communities
Bandipur is home to ancient indigenous tribes who have lived in harmony with the forest for generations. Our journeys support these communities directly, utilizing their unmatched knowledge of the landscape to trace animal movements respectfully and sustainably.

### Spotting Wilderness in the Hills
Unlike the flat, open backwaters of Kabini, Bandipur\'s terrain is mountainous, layered in basalt rocks and dry thorn forests. Spotting wildlife here feels like true pioneering—where every sound of cracked bamboo or distant alarm call tells an epic survival story.`,
    category: 'Conservation',
    date: 'July 05, 2026',
    coverImage: '/img/pexels-sachin-nihcas-1318516-6502591.webp',
    author: {
      name: 'Nagadharshan B.',
      role: 'Founder',
      avatar: founderUrl
    }
  },
  {
    id: '5',
    slug: 'mystical-monsoons-of-the-western-ghats-safari-guide',
    title: 'The Mystical Monsoons of the Western Ghats: A Safari Guide',
    excerpt: 'Witness the rain forest come alive under mist. A comprehensive guide to monsoon safaris, spotting rare canopy-dwellers and magnificent river runoffs.',
    content: `The monsoons turn the Western Ghats into a living, breathing emerald paradise. Mist hangs low over the bamboo canopies, and the air carries the fresh fragrance of rain-soaked earth.

### The Magic of the Rain Forest
During the monsoons (June to September), the forest is at its most active biologically. While tracking larger big cats requires extra patience due to lush canopies, the jungle offers rare wonders:
- **Canopy Dwellers:** Sightings of Malabar giant squirrels, Nilgiri langurs, and rare bird species nesting in high bamboo branches are exceptionally clear against the misty background.
- **Scent of the Wild:** Predators travel along the paved jeep tracks to avoid wet forest floors, making tracks perfect spots for naturalists to read pawprints.

### Preparedness and Photography Tips
Moisture control is paramount. Always pack waterproof covers for your camera bodies, and opt for dry storage bags. The soft, diffuse light of cloudy rainy days offers spectacular contrast, erasing harsh shadows and highlighting natural colors.`,
    category: 'Seasonal Guide',
    date: 'June 28, 2026',
    coverImage: '/img/pexels-lorenzo-boldorini-134457203-29707600.webp',
    author: {
      name: 'Nagadharshan B.',
      role: 'Founder',
      avatar: founderUrl
    }
  },
  {
    id: '6',
    slug: 'wings-of-the-backwaters-kabini-birdwatching-paradise',
    title: 'Wings of the Backwaters: A Birdwatcher’s Paradise in Kabini',
    excerpt: 'From the iconic Malabar pied hornbill to fishing eagles, explore the incredible diversity of Kabini\'s resident and migratory bird species.',
    content: `While Kabini is world-renowned for its big cats, it is equally a premier sanctuary for bird lovers. Over 250 species of avian wonders find their sanctuary along the rich river banks and dense deciduous forest trees.

### Top Species to Spot
Keep your binoculars ready for these incredible birds of prey and colorful forest dwellers:
1. **Malabar Pied Hornbill:** Instantly recognizable by their double-decked yellow-and-black bill, they are frequently seen feeding on wild fig trees.
2. **Crested Serpent Eagle:** Perched regally on dry snags along the water's edge, scanning the undergrowth with fierce golden eyes.
3. **Osprey and Fish Eagles:** Diving spectacularly into the water to catch their prey, creating majestic waves on the quiet morning river.

### Peak Season for Birding
The migratory season from November to February brings in spectacular winter visitors, including spot-billed pelicans, bar-headed geese, and painted storks from Central Asia. Combine a morning boat safari with a slow walk along the buffer zones to see them in all their glory.`,
    category: 'Birding Guide',
    date: 'June 15, 2026',
    coverImage: '/img/pexels-ravikant-32108104.webp',
    author: {
      name: 'Nagadharshan B.',
      role: 'Founder',
      avatar: founderUrl
    }
  }
];

// Clean placeholder testimonials representing actual guest feedback will be collected.
export const TESTIMONIALS: Testimonial[] = [];

export const GUIDES: Guide[] = [
  {
    id: '1',
    name: 'Nagadharshan B.',
    role: 'Founder',
    bio: 'With a lifelong passion for wildlife and conservation, Nagadharshan B. founded Wild Inn to bring the same standard of trust and curation found in the world\'s finest safari brands to South India\'s own extraordinary wilderness. Every journey is shaped by firsthand knowledge of the region\'s forests, resorts, and naturalists - built one relationship at a time.',
    image: founderUrl,
    quote: 'Every journey is a relationship built on trust, firsthand forest knowledge, and absolute transparency.'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: '1',
    question: 'What should I pack for a safari?',
    answer: 'Light layers for warm afternoons, warmer layers for early morning safaris, and neutral tones (like olive, khaki, or brown) to blend in with the forest environment.'
  },
  {
    id: '2',
    question: 'Is transport included in my journey?',
    answer: 'Yes, private transfers can be arranged from your arrival airport (such as Bengaluru or Coimbatore) directly to the forest lodges and back, ensuring a completely seamless concierge experience.'
  },
  {
    id: '3',
    question: 'Are safaris suitable for children?',
    answer: 'Most safaris are family-friendly, though long early morning game drives require patience. We can easily customize the itinerary pace and lodges to suit travelers of all ages.'
  },
  {
    id: '4',
    question: 'What happens if we don\'t spot a tiger or leopard?',
    answer: 'While predator tracking is guided by expert naturalists with a high rate of success, wildlife is free and unpredictable. We focus on showing you the rich, complete forest ecosystem - from elephant herds to incredible birdlife.'
  },
  {
    id: '5',
    question: 'How does the enquiry and planning process work?',
    answer: 'Once you submit an enquiry, our founder connects with you directly within 1-2 hours to understand your interests, recommend the best seasons, select lodges, and curate your personalized itinerary.'
  },
  {
    id: '6',
    question: 'Can I customize my itinerary?',
    answer: 'Absolutely. Every safari we plan is entirely custom-built. We design your itinerary from scratch based on your specific dates, preferred pace, interests (like photography, birding, or relaxation), and budget.'
  }
];

export const GALLERY_IMAGES = [
  {
    url: '/img/pexels-best-safari-insights-2159031159-35751549.webp',
    title: 'Majestic Kabini Tiger',
    location: 'Nagarhole Reserve'
  },
  {
    url: '/img/pexels-samirusandeepa-38147409.webp',
    title: 'River Basin Elephant Herd',
    location: 'Kabini Riverfront'
  },
  {
    url: '/img/pexels-uday-kiran-38711535-21299721.webp',
    title: 'Untouched Bandipur Canopy',
    location: 'Bandipur Reserve'
  },
  {
    url: '/img/pexels-sachin-nihcas-1318516-6502591.webp',
    title: 'Sambar Deer at Dawn',
    location: 'Kabini Forest Shore'
  },
  {
    url: '/img/pexels-ashwani-sharma-2153169983-35369036.webp',
    title: 'Leopard on Bamboo Arch',
    location: 'Nagarhole Core'
  }
];
