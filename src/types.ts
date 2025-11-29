export interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  content: string;
  verified: boolean;
  source: 'Verified Client' | 'Google';
}

export interface RatingStat {
  stars: number;
  count: number;
  percentage: number;
}

export interface NavLink {
  label: string;
  href: string;
}