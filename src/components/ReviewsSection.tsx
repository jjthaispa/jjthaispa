import React from 'react';
import { REVIEWS } from '../constants';
import { Review } from '../types';

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
              className={`material-symbols-outlined text-accent text-base ${i < review.rating ? '' : 'opacity-30'}`}
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
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.543 6.498c0 .21-.027.42-.082.615l-1.096 4.31a.89.89 0 0 1-.848.692h-.012a.89.89 0 0 1-.847-.692l-1.095-4.31a3.46 3.46 0 0 0-.082-.615c0-.003-.001-.006-.001-.009a3.499 3.499 0 0 0-6.992 0c0 .003 0 .006-.001.009a3.46 3.46 0 0 0-.082.615l-1.095 4.31a.89.89 0 0 1-.847.692h-.012a.89.89 0 0 1-.848-.692l-1.096-4.31a3.46 3.46 0 0 0-.082-.615c0-.003 0-.006-.001-.009a3.499 3.499 0 0 0-5.467 2.9c.08.904.348 1.76.76 2.52l.04.075c.22.4.47.785.745 1.155.002.002.003.005.005.007a10.95 10.95 0 0 0 4.195 4.195c.002.002.005.003.007.005.37.275.755.525 1.155.745l.075.04c.76.412 1.616.68 2.52.76A3.499 3.499 0 0 0 12 22a3.499 3.499 0 0 0 3.498-3.355c.904-.08 1.76-.348 2.52-.76l.075-.04c.4-.22.785-.47 1.155-.745.002-.002.005-.003.007-.005a10.95 10.95 0 0 0 4.195-4.195c.002-.002.003-.005.005-.007.275-.37.525-.755.745-1.155l.04-.075c.412-.76.68-1.616.76-2.52A3.499 3.499 0 0 0 21.543 6.498zm-9.535 2.193a.89.89 0 0 1 1.258 0l.91.91a.89.89 0 0 1 0 1.258l-2.73 2.73a.89.89 0 0 1-1.258 0l-1.472-1.472a.89.89 0 0 1 1.258-1.258l.825.825 2.01-2.01z"></path>
            </svg>
            <span>From Google</span>
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

const ReviewsSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Statistics Column */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 flex flex-col gap-6 rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-6">
            <h2 className="text-2xl font-bold font-serif leading-tight">Overall Rating</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <p className="text-5xl font-black leading-tight text-accent">4.9</p>
                <div className="flex flex-col">
                  <div className="flex gap-0.5">
                    <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>star</span>
                    <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>star</span>
                    <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>star</span>
                    <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>star</span>
                    <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>star_half</span>
                  </div>
                  <p className="text-sm font-normal leading-normal text-text-light/80 dark:text-text-dark/80">Based on 281 reviews</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border-light dark:border-border-dark pt-6 text-center">
              <a className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2" href="#">
                Leave a Review <span className="material-symbols-outlined text-base">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>

        {/* Reviews Feed Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REVIEWS.slice(0, 2).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center pt-8">
            <nav className="flex items-center gap-2">
              <button className="flex items-center justify-center size-9 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-50 transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button className="flex items-center justify-center size-9 rounded-full border border-primary bg-primary/20 dark:bg-primary/30 text-primary dark:text-white font-bold text-sm">1</button>
              <button className="flex items-center justify-center size-9 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:bg-background-light dark:hover:bg-background-dark text-sm transition-colors">2</button>
              <button className="flex items-center justify-center size-9 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:bg-background-light dark:hover:bg-background-dark text-sm transition-colors">3</button>
              <span className="text-sm">...</span>
              <button className="flex items-center justify-center size-9 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:bg-background-light dark:hover:bg-background-dark text-sm transition-colors">12</button>
              <button className="flex items-center justify-center size-9 rounded-full border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-50 transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;