import React, { useState, useEffect } from 'react';
import { REVIEWS } from '../constants';
import { Review, ApiReview, ApiReviewsResponse } from '../types';

// API endpoint for Google reviews (proxied in development via vite.config.ts)
const REVIEWS_API_URL = '/api/reviews';

// Transform API review format to display format
const transformReview = (apiReview: ApiReview, index: number): Review => {
  // Create short name (First L.) - handles single names gracefully
  const nameParts = apiReview.author_name.split(' ');
  const shortName = nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`
    : apiReview.author_name;

  return {
    id: String(index + 1),
    name: shortName,
    date: apiReview.date || 'Recent', // Use the pre-formatted date from API
    rating: apiReview.rating,
    content: apiReview.text,
    verified: true,
    source: 'Google'
  };
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="font-bold text-base">{review.name}</h3>
          <p className="text-xs text-text-light/70 dark:text-text-dark/70">{review.date}</p>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`material-symbols-outlined text-accent text-base ${i >= review.rating ? 'opacity-30' : ''}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
          ))}
        </div>
      </div>
      <p className="text-sm leading-relaxed">"{review.content}"</p>
      <div className="flex items-center gap-2 text-xs text-text-light/60 dark:text-text-dark/60">
        {review.source === 'Google' ? (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>Google Review</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span>Verified Client</span>
          </>
        )}
      </div>
    </div>
  );
};

const MAX_PAGES = 12;

const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<string>("5");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(3);

  // Responsive reviews per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setReviewsPerPage(1); // Mobile: 1 review
      } else if (window.innerWidth < 1024) {
        setReviewsPerPage(2); // Tablet: 2 reviews
      } else {
        setReviewsPerPage(3); // Desktop: 3 reviews
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(REVIEWS_API_URL);
        if (!response.ok) throw new Error('Failed to fetch');

        const data: ApiReviewsResponse = await response.json();

        // Filter to only reviews with text content
        const reviewsWithText = data.reviews.filter(r => r.text && r.text.trim().length > 0);

        if (reviewsWithText.length > 0) {
          const transformed = reviewsWithText.map(transformReview);
          setReviews(transformed);
        }

        setTotalCount(data.totalReviewCount);
        setAverageRating(data.averageRating);
      } catch (error) {
        console.error('Error fetching reviews, using fallback:', error);
        // Keep using fallback REVIEWS from constants
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Calculate star display based on average rating
  const avgNum = parseFloat(averageRating);
  const fullStars = Math.floor(avgNum);
  const hasHalfStar = avgNum - fullStars >= 0.3;

  // Calculate pagination
  const totalPages = Math.min(MAX_PAGES, Math.ceil(reviews.length / reviewsPerPage));
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Swipe handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-3">What our clients say</h2>
        <div className="flex items-center justify-center gap-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => {
              const isFilled = i < fullStars;
              const isHalf = i === fullStars && hasHalfStar;
              return (
                <span
                  key={i}
                  className={`material-symbols-outlined text-accent text-xl ${!isFilled && !isHalf ? 'opacity-30' : ''}`}
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                >
                  {isHalf ? 'star_half' : 'star'}
                </span>
              );
            })}
          </div>
          <span className="text-lg font-semibold text-accent">{averageRating}</span>
          <span className="text-base text-text-light/70 dark:text-text-dark/70">
            ({totalCount} reviews)
          </span>
        </div>
      </div>

      {/* Reviews Row */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {currentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-8">
              <button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className="flex items-center justify-center size-9 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-50 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>

              {/* Dot indicators - compact for mobile */}
              <div className="flex items-center gap-1.5">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => goToPage(i + 1)}
                    className={`rounded-full transition-all duration-300 ${currentPage === i + 1
                      ? 'w-6 h-2 bg-primary'
                      : 'w-2 h-2 bg-border-light dark:bg-border-dark hover:bg-primary/50'
                      }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center size-9 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-50 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ReviewsSection;