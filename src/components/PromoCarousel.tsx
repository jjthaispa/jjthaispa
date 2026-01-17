import React, { useState, useEffect, useRef } from 'react';
import { useServices } from '../context/ServiceContext';

const PROMOS = [
  {
    id: 1,
    category: "HOLIDAY SPECIAL",
    title: "A Holiday Gift to Yourself",
    description: "Relax more. Stress less. Limited-time holiday offer.\n $10 off 60 minutes\n $15 off 90 minutes",
    buttonText: "View Details",
    anchor: '#holiday-special',
    image: "/promos/holiday_promo.webp",
    bgColor: " bg-[#F9F4E8] dark:bg-[#2E281A]", // Light Beige / Dark Brown
    btnColor: "bg-[#C0A172] hover:bg-[#a88a5d] text-white",
    requiredPromoId: "holiday-promo",
    enabled: true, // Controlled by global promo state now
    overlay: [
      { highlight: "$10 OFF", subtitle: "60 MINUTE MASSAGE" },
      { highlight: "$15 OFF", subtitle: "90 MINUTE MASSAGE" }
    ]
  },
  {
    id: 1,
    category: "NEW SERVICE SPECIAL",
    title: "Back, Neck & Shoulder Release",
    description: "New Service Intro Pricing. Limited-time offer.\n $5 off 30 minutes\n $10 off 45 minutes",
    buttonText: "View Details",
    anchor: '#release-special',
    image: "/promos/release_promo.webp",
    bgColor: " bg-[#F9F4E8] dark:bg-[#2E281A]", // Light Beige / Dark Brown
    btnColor: "bg-[#C0A172] hover:bg-[#a88a5d] text-white",
    requiredPromoId: "release-promo",
    enabled: true, // Controlled by global promo state now
    overlay: [
      { highlight: "$10 OFF", subtitle: "45 MINUTE MASSAGE" }
    ]
  },
  {
    id: 2,
    category: "E-GIFT CARDS",
    title: "Give the Gift of Relaxation",
    description: "Instant eGift Cards. The perfect present for this holiday season. Physical cards available in store.",
    buttonText: "Buy eGift Card",
    image: "/promos/holiday_giftcard.webp",
    video: "/promos/holiday_giftcard.mp4",
    bgColor: "bg-[#E4E9E3] dark:bg-[#1A2E2A]", // Light Sage / Dark Green
    btnColor: "bg-[#788E6E] hover:bg-[#5A6B52] text-white",
    requiredGiftCardId: 'holiday-giftcard',
    enabled: true // Now dynamically controlled
  },
  {
    id: 5,
    category: "E-GIFT CARDS",
    title: "Valentine's Day",
    description: "Send a Valentine's Day e-gift card in seconds ♥ instant delivery, heartfelt surprise, perfect for last-minute love.",
    buttonText: "Buy eGift Card",
    image: "/promos/valentines_giftcard.webp",
    video: "/promos/valentines_giftcard.mp4",
    bgColor: "bg-[#FFE0E0] dark:bg-[#2B0C13]", // Soft Red / Merlot
    btnColor: "bg-[#C62828] hover:bg-[#a82020] text-white", // Deep Red
    requiredGiftCardId: 'valentines-giftcard',
    enabled: true // Now dynamically controlled
  },
  {
    id: 3,
    category: "AROMATHERAPY",
    title: "Complimentary Aromatherapy",
    description: "Enhance your massage with a soothing blend of essential oils. Our gift to you with every massage.",
    buttonText: "Learn More",
    image: "/promos/aroma.webp",
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
    image: "/promos/holiday_promo.webp",
    bgColor: "bg-[#E0F2F1] dark:bg-[#132929]", // Light Cyan / Dark Teal
    btnColor: "bg-[#4DB6AC] hover:bg-[#3d968d] text-white",
    enabled: false
  }
];

const PromoCarousel: React.FC = () => {
  const { activePromoIds, loading: servicesLoading } = useServices(); // Get active promos from API
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeGiftCards, setActiveGiftCards] = useState<Set<string>>(new Set());
  const [giftCardsLoading, setGiftCardsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Fetch active gift cards from API
  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        const response = await fetch('/api/giftcards');
        if (!response.ok) throw new Error('Failed to fetch gift cards');

        const data = await response.json();
        setActiveGiftCards(new Set(data.activeGiftCardIds || []));
      } catch (error) {
        console.error("Error fetching gift cards for carousel:", error);
      } finally {
        setGiftCardsLoading(false);
      }
    };
    fetchGiftCards();
  }, []);

  // Filter active promos based on API state AND local enabled flag
  // If requiredPromoId is present, it MUST be in activePromoIds.
  const activePromos = PROMOS.filter(promo => {
    // If explicit disable in local config, allow it to override
    if (promo.enabled === false) return false;

    // Check if dependent on a specific promo ID
    // @ts-ignore
    if (promo.requiredPromoId) {
      // @ts-ignore
      return activePromoIds.includes(promo.requiredPromoId);
    }

    // Check if dependent on a specific gift card ID
    // @ts-ignore
    if (promo.requiredGiftCardId) {
      // @ts-ignore
      return activeGiftCards.has(promo.requiredGiftCardId);
    }

    return true;
  });

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

  // Unified loading state
  const isLoading = servicesLoading || giftCardsLoading;

  // Render Skeletons if loading
  if (isLoading) {
    return (
      <section className="bg-background-light dark:bg-background-dark py-12 border-b border-border-light dark:border-border-dark overflow-x-clip">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] h-[280px] rounded-2xl bg-gray-300 dark:bg-gray-700 animate-pulse">
                {/* Skeleton Content */}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (activePromos.length === 0) return null;

  // Swipe handlers
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
                      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between relative z-10">
                        {/* Background Decorative Element */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-br-full pointer-events-none"></div>

                        <div>
                          <span className="inline-block text-[10px] font-bold tracking-widest uppercase mb-1 opacity-70">
                            {promo.category}
                          </span>
                          <h3 className="font-serif text-xl font-bold leading-tight mb-2 text-text-light dark:text-white">
                            {promo.title}
                          </h3>
                          <p className="text-sm opacity-90 leading-relaxed line-clamp-4 whitespace-pre-line">
                            {promo.description}
                          </p>
                        </div>

                        <div className="mt-4">
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
                          ) : promo.buttonText === 'View Details' ? (
                            <a
                              href={promo.anchor ? `/promotions${promo.anchor}` : '/promotions'}
                              className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-colors ${promo.btnColor} shadow-sm`}
                            >
                              {promo.buttonText}
                              <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </a>
                          ) : promo.buttonText === 'Learn More' ? (
                            <a
                              href="/services#aromatherapy"
                              className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-colors ${promo.btnColor} shadow-sm`}
                            >
                              {promo.buttonText}
                              <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </a>
                          ) : promo.buttonText === 'Buy eGift Card' ? (
                            <a
                              href="https://app.squareup.com/gift/MLW48R10CJHXH/order"
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

                      {/* Right Half - Image/Video */}
                      <div className="w-1/2 relative group/media">
                        {promo.video && itemsPerPage > 1 ? (
                          <>
                            <img
                              src={promo.image}
                              alt={promo.title}
                              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover/media:opacity-0"
                            />
                            <video
                              src={promo.video}
                              muted
                              loop
                              playsInline
                              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover/media:opacity-100"
                              onMouseEnter={(e) => e.currentTarget.play()}
                              onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                            />
                          </>
                        ) : (
                          <img
                            src={promo.image}
                            alt={promo.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        {/* Text Overlay */}
                        {promo.overlay && (
                          <div className="absolute inset-x-0 top-0 h-1/2 flex flex-col items-center justify-center bg-gradient-to-b from-white/80 via-white/70 to-transparent text-center px-4 py-3">
                            {promo.overlay.map((item, idx) => (
                              <React.Fragment key={idx}>
                                {idx > 0 && (
                                  <div className="flex items-center gap-2 my-1">
                                    <span className="w-6 h-px bg-[#6B4C1F]"></span>
                                    <span className="text-[#6B4C1F] text-xs">✦</span>
                                    <span className="w-6 h-px bg-[#6B4C1F]"></span>
                                  </div>
                                )}
                                <div>
                                  <div className="text-xl md:text-2xl font-bold tracking-tight text-[#5C3D1A]">{item.highlight}</div>
                                  <div className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-[#6B4C1F]">{item.subtitle}</div>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
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
