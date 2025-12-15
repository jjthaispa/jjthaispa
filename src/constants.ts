import { Review, RatingStat, NavLink } from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '#' },
  { label: 'Services', href: '#' },
  { label: 'Gift Cards', href: '#' },
  { label: 'Policies', href: '#' },
  { label: 'About Us', href: '#' },
  { label: 'Contact', href: '#' },
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

export const GALLERY_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdpaj2pTQA-5-qy1Vz10fsLao79nMfGRDdL62KnQ5226QQxJ1co59tOBr3DelJiQ3IKuJz3fJ2kEv4I1uFlyLKsF8FIqj5L151jk6XW6ImeQNFBZgXgOVtJLnv1LdegdCusWQnYoQKwX3b7HHka3zd3mOeaH_EW7K8EyafJANZJTBk7mHU8FzqXZVTI27mXACDfb8vVsZ2awXn8IoW4OnnuWlHrtY5LVCNkfEF9KBCFZekmnsexf5JvDt6Eq1aTGhrZ33CSSgbJ0zx",
    alt: "A close-up of a facial treatment being applied."
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7miWWKtjWPn3v8nFIkI3FDS5omYuPaDPjAKXqdwiEvUc-DsYBUff-b4xO0EyRUG11eL2Q9IHWywVwWn_iYaSmkD3Mx3Elb26xb88D6DSX0CCAPvRTjMbjzu4imIM2TiJoSOPH0AovSlRwgvM9W0-HYbO9y95CnI2mvry5zcmvmRgrilVDdT_RMo9WqJ39UUHTXbfEkcjq-2efJw-7pLuJKvH9DIG_JdzXctHi7eRrydiWpaetnxZiAq0bDoByhWCbq2c0EwPsUicV",
    alt: "A tranquil spa relaxation area with comfortable lounge chairs."
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXVB7ngmlYERntCcZwZgpZzEbsZTFmOxQryYjMxLGIoFBJ4fAP9JCwEraVvoGrXIUT3Q_DwYzza4m0GHfIl-601nJuWj9F6MIUqubhJCGiFTsTpagojZzaSu6O0BMV11gvxSy6DvD6STiJP4qS_mYrgbyBE28Tu-zRqOk4V3zwyDvNSeCEleROjWawUpkVD9RuVcXZNi1qyuyoPT3JOSa3nC8fnrnVBF4Cpk4r0Qaq_B_3iZEzb18biOaRY_O32PKKERedzIOuDva9",
    alt: "Hot stones arranged neatly on a wooden tray."
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOncWFuAx3uTVoPgQUfovP0CJJFl65sMykMlMo9ljZ2NLII38pnhM5ii20GCx_3cwzKy6vtPX4cfdbswWBBFq4gXlLlflFx2lgkR3DtkQfn0DXPbmKm4rzh4LaPe3m3g3Wa0_HmhEhXuqP87PYuZSbV65IB9hnqSiahINqc9RA5qfm70XA-4xbW7XnMkq0NUUmVVkm1YOWCILOlFUNZV8FjkzLufIr7RbjmsuOq2gv0fIaZtrPr_KsbcX_Oyv4VMhFFhC3Bz_Ri9Sk",
    alt: "A person enjoying a relaxing foot bath with flower petals."
  }
];