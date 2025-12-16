import React, { useState, useEffect, useRef } from 'react';

const PROMOS = [
  {
    id: 1,
    category: "HOLIDAY SPECIAL",
    title: "Autumn Glow Package",
    description: "Save 20% on our signature pumpkin enzyme facial and warm oil massage bundle. Limited time only.",
    buttonText: "View Offer",
    image: "/promos/promo.png",
    bgColor: " bg-[#F9F4E8] dark:bg-[#2E281A]", // Light Beige / Dark Brown
    btnColor: "bg-[#C0A172] hover:bg-[#a88a5d] text-white",
    enabled: true
  },
  {
    id: 2,
    category: "E-GIFT CARDS",
    title: "Give the Gift of Serenity",
    description: "The perfect present for this holiday season. Let them choose their own path to relaxation with a flexible gift card.",
    buttonText: "Buy eGift Card",
    image: "/promos/giftcard.png",
    bgColor: "bg-[#E8F3F1] dark:bg-[#1A2E2A]", // Light Mint / Dark Green
    btnColor: "bg-[#7A9E96] hover:bg-[#688a82] text-white",
    enabled: true
  },
  {
    id: 2,
    category: "HOLIDAY SPECIAL",
    title: "Autumn Glow Package",
    description: "Save 20% on our signature pumpkin enzyme facial and warm oil massage bundle. Limited time only.",
    buttonText: "View Offer",
    image: "/promos/promo.png",
    bgColor: " bg-[#F9F4E8] dark:bg-[#2E281A]", // Light Beige / Dark Brown
    btnColor: "bg-[#C0A172] hover:bg-[#a88a5d] text-white",
    enabled: true
  },
  {
    id: 3,
    category: "MEMBERSHIP",
    title: "Join the Wellness Club",
    description: "Prioritize your health with monthly treatments at exclusive member-only rates. Cancel anytime.",
    buttonText: "Learn More",
    image: "/promos/promo.png",
    bgColor: "bg-[#F0EFF4] dark:bg-[#26242E]", // Light Lavender / Dark Purple
    btnColor: "bg-[#8A84A3] hover:bg-[#746e8c] text-white",
    enabled: true
  },
  {
    id: 4,
    category: "NEW ARRIVAL",
    title: "Hydrotherapy Sessions",
    description: "Experience the healing power of water. Our new hydrotherapy pools are now open for booking.",
    buttonText: "Book Now",
    image: "/promos/promo.png",
    bgColor: "bg-[#E0F2F1] dark:bg-[#132929]", // Light Cyan / Dark Teal
    btnColor: "bg-[#4DB6AC] hover:bg-[#3d968d] text-white",
    enabled: true
  },
  {
    id: 5,
    category: "RETAIL",
    title: "Luxury Skin Care",
    description: "Bring the spa home. Shop our exclusive line of organic lotions and essential oils.",
    buttonText: "Shop Now",
    image: "/promos/promo.png",
    bgColor: "bg-[#FFF3E0] dark:bg-[#2E2010]", // Light Orange / Dark Brown
    btnColor: "bg-[#FFB74D] hover:bg-[#e09e3d] text-white",
    enabled: true
  }
];

const PromoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter active promos
  const activePromos = PROMOS.filter(promo => promo.enabled);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.max(1, activePromos.length - itemsPerPage + 1);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (activePromos.length === 0) return null;

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

    if (isLeftSwipe && currentIndex < totalPages - 1) {
      nextSlide();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevSlide();
    }
  };

  return (
    <section className="bg-background-light dark:bg-background-dark py-12 border-b border-border-light dark:border-border-dark overflow-x-clip">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">

          {/* Slider Container - padding allows shadow to show */}
          <div className="relative" ref={containerRef}>
            <div
              className="overflow-x-hidden -mx-3 px-3 py-8 -my-8"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out gap-4"
                style={{ transform: `translateX(calc(-${currentIndex} * (100% + 1rem) / ${itemsPerPage}))` }}
              >
                {activePromos.map((promo) => (
                  <div
                    key={promo.id}
                    className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]"
                    style={{ flexBasis: itemsPerPage === 1 ? '100%' : itemsPerPage === 2 ? 'calc(50% - 0.5rem)' : 'calc(33.333% - 0.67rem)' }}
                  >
                    <div className={`h-full min-h-[280px] rounded-2xl flex overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${promo.bgColor}`}>

                      {/* Left Half - Content */}
                      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative z-10">
                        {/* Background Decorative Element */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-br-full pointer-events-none"></div>

                        <div>
                          <span className="inline-block text-[10px] font-bold tracking-widest uppercase mb-2 opacity-70">
                            {promo.category}
                          </span>
                          <h3 className="font-serif text-2xl font-bold leading-tight mb-3 text-text-light dark:text-white">
                            {promo.title}
                          </h3>
                          <p className="text-sm opacity-90 leading-relaxed line-clamp-3">
                            {promo.description}
                          </p>
                        </div>

                        <div className="mt-6">
                          {promo.buttonText === 'Book Now' ? (
                            <a
                              href="https://app.squareup.com/appointments/book/kpgr4fsgm3uhjs/LXYE9K8E6NDSH/start"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-colors ${promo.btnColor} shadow-sm`}
                            >
                              {promo.buttonText}
                              <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </a>
                          ) : (
                            <button className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-colors ${promo.btnColor} shadow-sm`}>
                              {promo.buttonText}
                              <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right Half - Image */}
                      <div className="w-1/2 relative">
                        <img
                          src={promo.image}
                          alt={promo.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-card-dark/90 shadow-lg flex items-center justify-center text-text-light dark:text-text-dark hover:bg-white dark:hover:bg-card-dark transition-all disabled:opacity-0 z-20"
            disabled={currentIndex === 0}
            aria-label="Previous slide"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-card-dark/90 shadow-lg flex items-center justify-center text-text-light dark:text-text-dark hover:bg-white dark:hover:bg-card-dark transition-all disabled:opacity-0 z-20"
            disabled={currentIndex >= totalPages - 1}
            aria-label="Next slide"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-border-light dark:bg-border-dark hover:bg-primary/50'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default PromoCarousel;