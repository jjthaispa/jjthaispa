export interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  content: string;
  verified: boolean;
  source: 'Verified Client' | 'Google';
}

export interface ApiReview {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  date: string;
  text: string;
}

export interface ApiReviewsResponse {
  reviews: ApiReview[];
  totalReviewCount: number;
  averageRating: string;
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