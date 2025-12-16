import { Review, RatingStat, NavLink } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Gift Cards', href: '/#gift-cards' },
  { label: 'Policies', href: '/policies' },
  { label: 'Contact', href: '/contact' },
];

export const RATING_STATS: RatingStat[] = [
  { stars: 5, count: 258, percentage: 92 },
  { stars: 4, count: 17, percentage: 6 },
  { stars: 3, count: 3, percentage: 1 },
  { stars: 2, count: 3, percentage: 1 },
  { stars: 1, count: 0, percentage: 0 },
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Sarah K.',
    date: 'October 15, 2023',
    rating: 5,
    content: "An absolute oasis of calm. The deep tissue massage was transformative. I walked out feeling like a new person. The staff are incredibly professional and attentive.",
    verified: true,
    source: 'Verified Client'
  },
  {
    id: '2',
    name: 'Michael B.',
    date: 'October 12, 2023',
    rating: 5,
    content: "The Signature Facial is worth every penny. My skin has never felt so clean and radiant. Luxurious environment and top-notch service.",
    verified: true,
    source: 'Google'
  },
  {
    id: '3',
    name: 'Emily R.',
    date: 'October 10, 2023',
    rating: 5,
    content: "My friends and I booked a spa day package and it was divine. Every detail was perfect, from the herbal tea to the plush robes. Highly recommend the hot stone massage.",
    verified: true,
    source: 'Verified Client'
  },
  {
    id: '4',
    name: 'David L.',
    date: 'October 5, 2023',
    rating: 5,
    content: "Best massage I've had in years. The therapist was skilled and listened to my needs. The atmosphere is incredibly relaxing. I'll be back for sure.",
    verified: true,
    source: 'Google'
  },
  {
    id: '5',
    name: 'Jennifer M.',
    date: 'September 28, 2023',
    rating: 5,
    content: "The Thai massage was absolutely incredible. The therapist knew exactly where all my tension was hiding. Left feeling completely renewed and balanced.",
    verified: true,
    source: 'Verified Client'
  },
  {
    id: '6',
    name: 'Robert T.',
    date: 'September 22, 2023',
    rating: 5,
    content: "Such a peaceful atmosphere from the moment you walk in. The aromatherapy massage helped my chronic back pain more than any other treatment I've tried.",
    verified: true,
    source: 'Google'
  },
  {
    id: '7',
    name: 'Amanda C.',
    date: 'September 15, 2023',
    rating: 5,
    content: "I've been to many spas, but J.J Thai Spa is truly special. The attention to detail and genuine care from the staff makes all the difference.",
    verified: true,
    source: 'Verified Client'
  },
  {
    id: '8',
    name: 'Kevin P.',
    date: 'September 8, 2023',
    rating: 5,
    content: "Bought a couples massage package for our anniversary. It was the perfect way to celebrate. The ambiance and service exceeded our expectations.",
    verified: true,
    source: 'Google'
  },
  {
    id: '9',
    name: 'Lisa H.',
    date: 'September 1, 2023',
    rating: 5,
    content: "The prenatal massage was exactly what I needed. They made me feel so comfortable and really understood the specific needs of expectant mothers.",
    verified: true,
    source: 'Verified Client'
  }
];