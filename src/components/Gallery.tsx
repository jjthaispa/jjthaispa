import React, { useState, useEffect } from 'react';

// =====================================================
// CAROUSEL IMAGES CONFIGURATION
// =====================================================
// Add your image filenames here. Place image files in: public/carousel/
// Supported formats: .jpg, .jpeg, .png, .webp, .gif
// 
// Example:
// const CAROUSEL_IMAGES = [
//   'massage-room.jpg',
//   'spa-treatment.png',
//   'relaxation-area.webp',
// ];
// =====================================================

const CAROUSEL_IMAGES: string[] = [
  // Add your image filenames here
  'couples.png',
  'stretch.png',
  'walking.png',
  'cupping.png',
  'tea_station.png',
  'stretch2.png',
  'deeptissue.png',
  'dog.png',
];

// Fallback images when no custom images are configured
const FALLBACK_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvYcaZrHU8Y5JXyJWfqLRsZRy80fO-a2LpyVmRj7dUYA0c4IRvWPv8VlSKJA6kSTnvpUvCIDBu-IuTVh-yx4kR5a08p2r4jI3AoECGKQY9k9tB18c1w5lXd7I-9v3RkfgQcQ_5glsJdyBIWQaU4Zzuqxl-Og7HlZewkKw_dHrNSQMONdnHWbKPV4Z08AQZnRInHWnNcB4cE6GOMwbRlrTqNABevWrNa7PmEJLJ3k21g8m2nT-b2K5Jel4OwGvKEjxIRGrIb4X3OBii",
    alt: "A close-up of a facial treatment being applied."
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaJ3avNrT5c2CWd2g3nkeCdBm0WZcw2CYdxGcrD6iXPAa98dv3N60QdKgXu-YglJ6RdOThnpLwRkMM-lbOXHzpbFkJmqC9jvGRsf1bJTr09eN63W1TdEYJUCkl3ypHs8DJE5rW6FKbI2vMVPUbMFTDDXfHXCfFyb-p3C4xoXPi4Wg2tVBxKDGnZPPcpBBHjJMGWrmgL-3G-QdE_DG5pVlxvG-3qB0G7wBW8XB5lXQA3-q9-r8O-Y3FkXzqYGZiLGZ5-3",
    alt: "A tranquil spa relaxation area with comfortable lounge chairs."
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkA5u-1MXn_fy_-KzSE4SiFYMNMMLk8WePWqWMHKUCxBpJYNSJx3o3dpvJNRWxeGZHKJlNOxsX9V3RmE2VBxMKRBNIm9b1xvKlG3FBxY3rL3kQ5B6X3vYPYJXKxQFnL8g3kGqS6V8bVW7YZLFsXPZDLXJPM3w2KZ3Xq3f-YKpZ5v3XvZ3X-3",
    alt: "Hot stones arranged neatly on a wooden tray."
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD80J3F5hP3nYR5v9_l3VKXc_8x8f3N3b9Yp6g3DxYT3vRw3q3Y3Z3J3F3K3L3M3N3O3P3Q3R3S3T3U3V3W3X3Y3Z3",
    alt: "A person enjoying a relaxing foot bath with flower petals."
  }
];

const Gallery: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [imagesPerPage, setImagesPerPage] = useState(4);

  // Responsive images per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImagesPerPage(2); // Mobile: 2 images
      } else {
        setImagesPerPage(4); // Desktop: 4 images
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Use custom images if configured, otherwise use fallbacks
  const useCustomImages = CAROUSEL_IMAGES.length > 0;
  const totalImages = useCustomImages ? CAROUSEL_IMAGES.length : FALLBACK_IMAGES.length;
  
  // Calculate pagination
  const totalPages = Math.ceil(totalImages / imagesPerPage);
  const showNavigation = totalImages > imagesPerPage;
  
  // Get current page images
  const startIndex = currentPage * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Render custom images from public/carousel/
  const renderCustomImages = () => {
    const pageImages = CAROUSEL_IMAGES.slice(startIndex, endIndex);
    return pageImages.map((filename, index) => (
      <div key={`${currentPage}-${index}`} className="overflow-hidden rounded-lg aspect-square group">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ imageRendering: 'auto', backfaceVisibility: 'hidden' }}
          alt={`Gallery image ${startIndex + index + 1}`}
          src={`/carousel/${filename}`}
          loading="lazy"
        />
      </div>
    ));
  };

  // Render fallback images
  const renderFallbackImages = () => {
    const pageImages = FALLBACK_IMAGES.slice(startIndex, endIndex);
    return pageImages.map((img, index) => (
      <div key={`${currentPage}-${index}`} className="overflow-hidden rounded-lg aspect-square group">
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ imageRendering: 'auto', backfaceVisibility: 'hidden' }}
          alt={img.alt}
          src={img.src}
          loading="lazy"
        />
      </div>
    ));
  };

  return (
    <section className="bg-card-light dark:bg-card-dark py-12 md:py-20 border-y border-border-light dark:border-border-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {useCustomImages ? renderCustomImages() : renderFallbackImages()}
          </div>

          {/* Navigation Arrows - Only show if more than 4 images */}
          {showNavigation && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-card-dark/90 shadow-lg flex items-center justify-center text-text-light dark:text-text-dark hover:bg-white dark:hover:bg-card-dark transition-all z-20"
                aria-label="Previous images"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-card-dark/90 shadow-lg flex items-center justify-center text-text-light dark:text-text-dark hover:bg-white dark:hover:bg-card-dark transition-all z-20"
                aria-label="Next images"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </>
          )}

          {/* Page Indicators - Only show if more than one page */}
          {showNavigation && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentPage === idx
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-border-light dark:bg-border-dark hover:bg-primary/50'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
