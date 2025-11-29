import React, { useState, useEffect, useRef } from 'react';

const PROMOS = [
  {
    id: 1,
    category: "E-GIFT CARDS",
    title: "Give the Gift of Serenity",
    description: "The perfect present for any occasion. Let them choose their own path to relaxation with a flexible gift card.",
    buttonText: "Buy Gift Card",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXVB7ngmlYERntCcZwZgpZzEbsZTFmOxQryYjMxLGIoFBJ4fAP9JCwEraVvoGrXIUT3Q_DwYzza4m0GHfIl-601nJuWj9F6MIUqubhJCGiFTsTpagojZzaSu6O0BMV11gvxSy6DvD6STiJP4qS_mYrgbyBE28Tu-zRqOk4V3zwyDvNSeCEleROjWawUpkVD9RuVcXZNi1qyuyoPT3JOSa3nC8fnrnVBF4Cpk4r0Qaq_B_3iZEzb18biOaRY_O32PKKERedzIOuDva9",
    bgColor: "bg-[#E8F3F1] dark:bg-[#1A2E2A]", // Light Mint / Dark Green
    btnColor: "bg-[#7A9E96] hover:bg-[#688a82] text-white"
  },
  {
    id: 2,
    category: "SEASONAL SPECIAL",
    title: "Autumn Glow Package",
    description: "Save 20% on our signature pumpkin enzyme facial and warm oil massage bundle. Limited time only.",
    buttonText: "View Offer",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdpaj2pTQA-5-qy1Vz10fsLao79nMfGRDdL62KnQ5226QQxJ1co59tOBr3DelJiQ3IKuJz3fJ2kEv4I1uFlyLKsF8FIqj5L151jk6XW6ImeQNFBZgXgOVtJLnv1LdegdCusWQnYoQKwX3b7HHka3zd3mOeaH_EW7K8EyafJANZJTBk7mHU8FzqXZVTI27mXACDfb8vVsZ2awXn8IoW4OnnuWlHrtY5LVCNkfEF9KBCFZekmnsexf5JvDt6Eq1aTGhrZ33CSSgbJ0zx",
    bgColor: "bg-[#F9F4E8] dark:bg-[#2E281A]", // Light Beige / Dark Brown
    btnColor: "bg-[#C0A172] hover:bg-[#a88a5d] text-white"
  },
  {
    id: 3,
    category: "MEMBERSHIP",
    title: "Join the Wellness Club",
    description: "Prioritize your health with monthly treatments at exclusive member-only rates. Cancel anytime.",
    buttonText: "Learn More",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7miWWKtjWPn3v8nFIkI3FDS5omYuPaDPjAKXqdwiEvUc-DsYBUff-b4xO0EyRUG11eL2Q9IHWywVwWn_iYaSmkD3Mx3Elb26xb88D6DSX0CCAPvRTjMbjzu4imIM2TiJoSOPH0AovSlRwgvM9W0-HYbO9y95CnI2mvry5zcmvmRgrilVDdT_RMo9WqJ39UUHTXbfEkcjq-2efJw-7pLuJKvH9DIG_JdzXctHi7eRrydiWpaetnxZiAq0bDoByhWCbq2c0EwPsUicV",
    bgColor: "bg-[#F0EFF4] dark:bg-[#26242E]", // Light Lavender / Dark Purple
    btnColor: "bg-[#8A84A3] hover:bg-[#746e8c] text-white"
  },
  {
    id: 4,
    category: "NEW ARRIVAL",
    title: "Hydrotherapy Sessions",
    description: "Experience the healing power of water. Our new hydrotherapy pools are now open for booking.",
    buttonText: "Book Now",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOncWFuAx3uTVoPgQUfovP0CJJFl65sMykMlMo9ljZ2NLII38pnhM5ii20GCx_3cwzKy6vtPX4cfdbswWBBFq4gXlLlflFx2lgkR3DtkQfn0DXPbmKm4rzh4LaPe3m3g3Wa0_HmhEhXuqP87PYuZSbV65IB9hnqSiahINqc9RA5qfm70XA-4xbW7XnMkq0NUUmVVkm1YOWCILOlFUNZV8FjkzLufIr7RbjmsuOq2gv0fIaZtrPr_KsbcX_Oyv4VMhFFhC3Bz_Ri9Sk",
    bgColor: "bg-[#E0F2F1] dark:bg-[#132929]", // Light Cyan / Dark Teal
    btnColor: "bg-[#4DB6AC] hover:bg-[#3d968d] text-white"
  },
  {
    id: 5,
    category: "RETAIL",
    title: "Luxury Skin Care",
    description: "Bring the spa home. Shop our exclusive line of organic lotions and essential oils.",
    buttonText: "Shop Now",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXVB7ngmlYERntCcZwZgpZzEbsZTFmOxQryYjMxLGIoFBJ4fAP9JCwEraVvoGrXIUT3Q_DwYzza4m0GHfIl-601nJuWj9F6MIUqubhJCGiFTsTpagojZzaSu6O0BMV11gvxSy6DvD6STiJP4qS_mYrgbyBE28Tu-zRqOk4V3zwyDvNSeCEleROjWawUpkVD9RuVcXZNi1qyuyoPT3JOSa3nC8fnrnVBF4Cpk4r0Qaq_B_3iZEzb18biOaRY_O32PKKERedzIOuDva9",
    bgColor: "bg-[#FFF3E0] dark:bg-[#2E2010]", // Light Orange / Dark Brown
    btnColor: "bg-[#FFB74D] hover:bg-[#e09e3d] text-white"
  }
];

const PromoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const totalPages = Math.max(1, PROMOS.length - itemsPerPage + 1);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="bg-background-light dark:bg-background-dark py-12 border-b border-border-light dark:border-border-dark overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          
          {/* Slider Container */}
          <div className="overflow-hidden rounded-2xl" ref={containerRef}>
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-4"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {PROMOS.map((promo) => (
                <div 
                  key={promo.id} 
                  className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]"
                  style={{ flexBasis: itemsPerPage === 1 ? '100%' : itemsPerPage === 2 ? 'calc(50% - 0.5rem)' : 'calc(33.333% - 0.67rem)' }}
                >
                  <div className={`h-full min-h-[280px] p-6 md:p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden ${promo.bgColor}`}>
                    
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-bl-full pointer-events-none z-0"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-4">
                        <span className="inline-block text-[10px] font-bold tracking-widest uppercase mb-2 opacity-70">
                          {promo.category}
                        </span>
                        <h3 className="font-serif text-2xl font-bold leading-tight mb-3 text-text-light dark:text-white">
                          {promo.title}
                        </h3>
                        <p className="text-sm opacity-90 leading-relaxed mb-6 line-clamp-3">
                          {promo.description}
                        </p>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between gap-4">
                        <button className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${promo.btnColor} shadow-sm`}>
                          {promo.buttonText}
                        </button>
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/50 shadow-sm">
                            <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
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