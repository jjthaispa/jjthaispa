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

  const totalImages = CAROUSEL_IMAGES.length;

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

  // Render images from public/carousel/
  const renderImages = () => {
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
    <section className="bg-card-light dark:bg-card-dark py-12 md:py-20 border-y border-border-light dark:border-border-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Image Grid */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {renderImages()}
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
                  className={`h-2 rounded-full transition-all duration-300 ${currentPage === idx
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
