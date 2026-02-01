import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

// Helper Interface
interface Promotion {
    id: string;
    label?: string;
    startDate: string;
    endDate: string;
}

const GIFT_CARD_IMAGES: Record<string, string> = {
    'holiday-giftcard': '/promos/giftcard_box_holiday.webp',
    'valentines-giftcard': '/promos/giftcard_box_valentines.webp',
    'default-giftcard': '/promos/giftcard_box_standard.webp',
};

// Helper to format date
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const Promotions: React.FC = () => {
    const [flashCard, setFlashCard] = useState(false);
    const [flashGiftCard, setFlashGiftCard] = useState(false);

    // Scroll handling and flash effect
    useEffect(() => {
        if (window.location.hash) {
            const element = document.querySelector(window.location.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });

                // Trigger flash effect for holiday-special
                if (window.location.hash === '#holiday-special' || window.location.hash === '#valentines-special') {
                    setTimeout(() => {
                        setFlashCard(true);
                        setTimeout(() => setFlashCard(false), 500);
                    }, 200);
                }

                // Trigger flash effect for gift-cards
                if (window.location.hash === '#gift-cards') {
                    setTimeout(() => {
                        setFlashGiftCard(true);
                        setTimeout(() => setFlashGiftCard(false), 500);
                    }, 200);
                }
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

    const [validPromos, setValidPromos] = useState<Map<string, Promotion>>(new Map());
    const [activeGiftCardId, setActiveGiftCardId] = useState<string | null>(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await fetch('/api/promotions');
                if (!response.ok) throw new Error('Failed to fetch promotions');

                const data = await response.json();
                const promosMap = new Map<string, Promotion>();

                // Convert the promotions object to a Map
                Object.values(data.promotions || {}).forEach((p: any) => {
                    promosMap.set(p.id, p);
                });

                setValidPromos(promosMap);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            }
        };

        const fetchGiftCards = async () => {
            try {
                const response = await fetch('/api/giftcards');
                if (!response.ok) throw new Error('Failed to fetch gift cards');

                const data = await response.json();
                const activeIds = data.activeGiftCardIds || [];

                // Priority: Holiday > Valentines > Default
                const priority = ['holiday-giftcard', 'valentines-giftcard', 'default-giftcard'];
                for (const pid of priority) {
                    if (activeIds.includes(pid)) {
                        setActiveGiftCardId(pid);
                        break;
                    }
                }

                // Fallback to default if none found
                if (!activeIds.length) {
                    setActiveGiftCardId('default-giftcard');
                }
            } catch (error) {
                console.error("Error fetching gift cards:", error);
                setActiveGiftCardId('default-giftcard');
            }
        };

        fetchPromotions();
        fetchGiftCards();
    }, []);

    const promoSections = [
        {
            id: 'valentines-special',
            requiredPromoId: 'valentines-promo',
            enabled: true,
            element: (
                /* Valentine's Day Special Section */
                <section id="valentines-special" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#1a231f]">
                    <div className="container mx-auto max-w-6xl">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <span className="text-[#849f81] font-bold tracking-[0.25em] text-xs uppercase mb-4 block">
                                LIMITED TIME OFFER
                            </span>
                            <h2 className="font-serif text-4xl md:text-5xl italic text-[#2e2e2e] dark:text-white">
                                Share the Love This Valentine’s Day
                            </h2>
                        </div>

                        {/* Main Card */}
                        <div
                            className={`bg-[#F9F4E8] dark:bg-[#2E281A] rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${flashCard ? 'md:shadow-2xl md:scale-[1.02]' : ''}`}
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Left Content */}
                                <div className="flex-1 p-8 md:p-10 lg:p-12 relative bg-white dark:bg-[#2E281A]">
                                    <h3 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] dark:text-white mb-5">
                                        Reconnect. Relax. Renew.
                                    </h3>
                                    <p className="text-[#4a4a4a] dark:text-text-dark/80 leading-relaxed mb-8 text-sm md:text-base">
                                        Celebrate love and connection with a rejuvenating massage experience. Whether for yourself or a loved one, our Valentine’s Day special brings relaxation to the heart.
                                    </p>

                                    {/* Discount Boxes */}
                                    <div className="space-y-4 mb-8">
                                        <div className="flex gap-4">
                                            <div className="flex-1 border border-[#d4cfc4] dark:border-[#5C3D1A] rounded-lg p-4 md:p-5 text-center bg-background-light dark:bg-background-dark">
                                                <span className="block text-[10px] font-bold text-[#849f81] tracking-[0.2em] mb-2 uppercase">Discount</span>
                                                <div className="font-serif text-2xl md:text-3xl italic text-[#5C3D1A] dark:text-[#c0a172] mb-1">$5 OFF</div>
                                                <span className="text-[10px] text-[#6b6b6b] dark:text-text-dark/60 uppercase tracking-wider">60 or 75 Minute Massage</span>
                                            </div>
                                            <div className="flex-1 border border-[#d4cfc4] dark:border-[#5C3D1A] rounded-lg p-4 md:p-5 text-center bg-background-light dark:bg-background-dark">
                                                <span className="block text-[10px] font-bold text-[#849f81] tracking-[0.2em] mb-2 uppercase">Discount</span>
                                                <div className="font-serif text-2xl md:text-3xl italic text-[#5C3D1A] dark:text-[#c0a172] mb-1">$10 OFF</div>
                                                <span className="text-[10px] text-[#6b6b6b] dark:text-text-dark/60 uppercase tracking-wider">90 Minute Massage</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1 border border-[#d4cfc4] dark:border-[#5C3D1A] rounded-lg p-4 md:p-5 text-center bg-background-light dark:bg-background-dark">
                                                <span className="block text-[10px] font-bold text-[#849f81] tracking-[0.2em] mb-2 uppercase">Discount</span>
                                                <div className="font-serif text-2xl md:text-3xl italic text-[#5C3D1A] dark:text-[#c0a172] mb-1">$15 OFF</div>
                                                <span className="text-[10px] text-[#6b6b6b] dark:text-text-dark/60 uppercase tracking-wider">60 or 75 Minute Couples Massage</span>
                                            </div>
                                            <div className="flex-1 border border-[#d4cfc4] dark:border-[#5C3D1A] rounded-lg p-4 md:p-5 text-center bg-background-light dark:bg-background-dark">
                                                <span className="block text-[10px] font-bold text-[#849f81] tracking-[0.2em] mb-2 uppercase">Discount</span>
                                                <div className="font-serif text-2xl md:text-3xl italic text-[#5C3D1A] dark:text-[#c0a172] mb-1">$25 OFF</div>
                                                <span className="text-[10px] text-[#6b6b6b] dark:text-text-dark/60 uppercase tracking-wider">90 Minute Couples Massage</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Disclaimer */}
                                    <p className="text-sm text-[#9a9a9a] dark:text-text-dark/40 italic mt-6">
                                        *Offer valid through {formatDate(validPromos.get('valentines-promo')?.endDate || '')}. Cannot be combined with other discounts. Discount applied at checkout.
                                    </p>
                                </div>

                                {/* Right Image */}
                                <div className="flex-1 min-h-[300px] md:min-h-0 overflow-hidden">
                                    <img
                                        src="/promos/valentines_promo.webp"
                                        alt="Valentine's Day Special"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        },
        {
            id: 'holiday-special',
            requiredPromoId: 'holiday-promo',
            enabled: true, // Controlled by global promo state now
            element: (
                /* Holiday Special Section */
                <section id="holiday-special" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#1a231f]">
                    <div className="container mx-auto max-w-6xl">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <span className="text-[#849f81] font-bold tracking-[0.25em] text-xs uppercase mb-4 block">
                                LIMITED TIME OFFER
                            </span>
                            <h2 className="font-serif text-4xl md:text-5xl italic text-[#2e2e2e] dark:text-white">
                                Holiday Healing Special
                            </h2>
                        </div>

                        {/* Main Card */}
                        <div
                            className={`bg-[#F9F6F0] dark:bg-[#2E281A] rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${flashCard ? 'md:shadow-2xl md:scale-[1.02]' : ''
                                }`}
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Left Content */}
                                <div className="flex-1 p-8 md:p-10 lg:p-12 relative bg-white dark:bg-[#2E281A]">
                                    <h3 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] dark:text-white mb-5">
                                        A Gift to Yourself
                                    </h3>
                                    <p className="text-[#4a4a4a] dark:text-text-dark/80 leading-relaxed mb-8 text-sm md:text-base">
                                        Relax more. Stress less. Take advantage of our limited-time holiday discount. Treat yourself or a loved one to the ultimate relaxation experience.
                                    </p>

                                    {/* Discount Boxes */}
                                    <div className="space-y-4 mb-8">
                                        <div className="flex gap-4">
                                            <div className="flex-1 border border-[#d4cfc4] dark:border-[#5C3D1A] rounded-lg p-4 md:p-5 text-center bg-background-light dark:bg-background-dark">
                                                <span className="block text-[10px] font-bold text-[#849f81] tracking-[0.2em] mb-2 uppercase">Discount</span>
                                                <div className="font-serif text-2xl md:text-3xl italic text-[#5C3D1A] dark:text-[#c0a172] mb-1">$10 OFF</div>
                                                <span className="text-[10px] text-[#6b6b6b] dark:text-text-dark/60 uppercase tracking-wider">60 or 75 Minute Massage</span>
                                            </div>
                                            <div className="flex-1 border border-[#d4cfc4] dark:border-[#5C3D1A] rounded-lg p-4 md:p-5 text-center bg-background-light dark:bg-background-dark">
                                                <span className="block text-[10px] font-bold text-[#849f81] tracking-[0.2em] mb-2 uppercase">Discount</span>
                                                <div className="font-serif text-2xl md:text-3xl italic text-[#5C3D1A] dark:text-[#c0a172] mb-1">$15 OFF</div>
                                                <span className="text-[10px] text-[#6b6b6b] dark:text-text-dark/60 uppercase tracking-wider">90 Minute Massage</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1 border border-[#d4cfc4] dark:border-[#5C3D1A] rounded-lg p-4 md:p-5 text-center bg-background-light dark:bg-background-dark">
                                                <span className="block text-[10px] font-bold text-[#849f81] tracking-[0.2em] mb-2 uppercase">Discount</span>
                                                <div className="font-serif text-2xl md:text-3xl italic text-[#5C3D1A] dark:text-[#c0a172] mb-1">$20 OFF</div>
                                                <span className="text-[10px] text-[#6b6b6b] dark:text-text-dark/60 uppercase tracking-wider">60 Minute Couples Massage</span>
                                            </div>
                                            <div className="flex-1 border border-[#d4cfc4] dark:border-[#5C3D1A] rounded-lg p-4 md:p-5 text-center bg-background-light dark:bg-background-dark">
                                                <span className="block text-[10px] font-bold text-[#849f81] tracking-[0.2em] mb-2 uppercase">Discount</span>
                                                <div className="font-serif text-2xl md:text-3xl italic text-[#5C3D1A] dark:text-[#c0a172] mb-1">$30 OFF</div>
                                                <span className="text-[10px] text-[#6b6b6b] dark:text-text-dark/60 uppercase tracking-wider">90 Minute Couples Massage</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Disclaimer */}
                                    <p className="text-sm text-[#9a9a9a] dark:text-text-dark/40 italic mt-6">
                                        *Offer valid through {formatDate(validPromos.get('holiday-promo')?.endDate || '')}. Cannot be combined with other discounts.  Discount applied at checkout.
                                    </p>
                                </div>

                                {/* Right Image */}
                                <div className="flex-1 min-h-[300px] md:min-h-0 overflow-hidden">
                                    <img
                                        src="/promos/holiday_promo_dark.webp"
                                        alt="Holiday Healing Special"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        },
        {
            id: 'release-special',
            requiredPromoId: 'release-promo',
            enabled: true, // Controlled by global promo state now
            element: (
                /* Release Special Section */
                <section id="release-special" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#1a231f]">
                    <div className="container mx-auto max-w-6xl">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <span className="text-[#849f81] font-bold tracking-[0.25em] text-xs uppercase mb-4 block">
                                LIMITED TIME OFFER
                            </span>
                            <h2 className="font-serif text-4xl md:text-5xl italic text-[#2e2e2e] dark:text-white">
                                Back, Neck & Shoulder Release Special
                            </h2>
                        </div>

                        {/* Main Card */}
                        <div
                            className={`bg-[#F9F6F0] dark:bg-[#2E281A] rounded-2xl shadow-lg overflow-hidden transition-all duration-500 ${flashCard ? 'md:shadow-2xl md:scale-[1.02]' : ''
                                }`}
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Left Content */}
                                <div className="flex-1 p-8 md:p-10 lg:p-12 relative bg-white dark:bg-[#2E281A]">
                                    <h3 className="font-serif text-2xl md:text-3xl text-[#2e2e2e] dark:text-white mb-5">
                                        New Service • Introductory Offer
                                    </h3>
                                    <p className="text-[#4a4a4a] dark:text-text-dark/80 leading-relaxed mb-8 text-sm md:text-base">
                                        Tension often builds where we need relief the most—your back, neck, and shoulders. Our new Back, Neck & Shoulder Release is a focused therapeutic session designed to ease tight muscles, reduce stress, and restore comfort in these high-tension areas.
                                    </p>
                                    <p className="text-[#4a4a4a] dark:text-text-dark/80 leading-relaxed mb-8 text-sm md:text-base">
                                        To celebrate the launch of this new service, we’re offering introductory pricing for a limited time:
                                    </p>

                                    {/* Discount Boxes */}
                                    <div className="space-y-4 mb-8">
                                        <div className="flex gap-4">
                                            <div className="flex-1 border border-[#d4cfc4] dark:border-[#5C3D1A] rounded-lg p-4 md:p-5 text-center bg-background-light dark:bg-background-dark">
                                                <span className="block text-[10px] font-bold text-[#849f81] tracking-[0.2em] mb-2 uppercase">Discount</span>
                                                <div className="font-serif text-2xl md:text-3xl italic text-[#5C3D1A] dark:text-[#c0a172] mb-1">$5 OFF</div>
                                                <span className="text-[10px] text-[#6b6b6b] dark:text-text-dark/60 uppercase tracking-wider">30 Minute Massage</span>
                                            </div>
                                            <div className="flex-1 border border-[#d4cfc4] dark:border-[#5C3D1A] rounded-lg p-4 md:p-5 text-center bg-background-light dark:bg-background-dark">
                                                <span className="block text-[10px] font-bold text-[#849f81] tracking-[0.2em] mb-2 uppercase">Discount</span>
                                                <div className="font-serif text-2xl md:text-3xl italic text-[#5C3D1A] dark:text-[#c0a172] mb-1">$10 OFF</div>
                                                <span className="text-[10px] text-[#6b6b6b] dark:text-text-dark/60 uppercase tracking-wider">45 Minute Massage</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Disclaimer */}
                                    <p className="text-sm text-[#9a9a9a] dark:text-text-dark/40 italic mt-6">
                                        *Offer valid through {formatDate(validPromos.get('release-promo')?.endDate || '')}. Cannot be combined with other discounts.  Discount applied at checkout.
                                    </p>
                                </div>

                                {/* Right Image */}
                                <div className="flex-1 min-h-[300px] md:min-h-0 overflow-hidden">
                                    <img
                                        src="/promos/release_promo_zoom.webp"
                                        alt="Holiday Healing Special"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )
        },
        {
            id: 'gift-cards',
            enabled: true,
            element: (
                /* Gift Card Section */
                <section id="gift-cards" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#1a231f]">
                    <div className="container mx-auto max-w-6xl">
                        <div
                            className={`flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-24 transition-all duration-500 ${flashGiftCard ? 'md:shadow-2xl md:scale-[1.02]' : ''
                                }`}
                        >
                            {/* Image */}
                            <div className="flex-1 w-full">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square">
                                    <img
                                        src={activeGiftCardId ? (GIFT_CARD_IMAGES[activeGiftCardId] || "/promos/giftcard_box_standard.webp") : "/promos/giftcard_box_standard.webp"}
                                        alt="Gift Card"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1">
                                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a231f] dark:text-white mb-6 leading-tight">
                                    Give the Gift of <br />Relaxation
                                </h2>
                                <p className="text-[#1a231f]/70 dark:text-white/70 leading-relaxed mb-8 text-lg">
                                    Instant eGift Cards are the perfect present for any occasion. Available online, deliverable instantly via email or by text. Prefer something tangible? Gift cards are also available in-store.
                                </p>

                                <a
                                    href="https://app.squareup.com/gift/MLW48R10CJHXH/order"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#5A6B52] dark:text-[#849f81] font-bold text-lg hover:text-[#3d4a37] dark:hover:text-[#a3bea0] transition-colors group"
                                >
                                    Buy eGift Card
                                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
            <Helmet>
                <title>Special Offers & Promotions - J.J Thai Spa</title>
                <meta name="description" content="Discover our latest special offers, seasonal promotions, and gift card packages. Limited time discounts on massage therapies." />
                <link rel="canonical" href="https://jjthaispa.com/promotions" />
                <link rel="preload" as="image" href="/buddha.webp" fetchpriority="high" />
            </Helmet>
            {/* Hero Section */}
            <div className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/buddha.webp"
                        alt="Spa Promotions"
                        className="w-full h-full object-cover"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-md">
                        Current Promotions
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-light">
                        Restore balance and ease tension with our exclusive seasonal offers.
                    </p>
                </div>
            </div>

            {promoSections.filter(section => {
                // If explicit disable in local config, allow it to override
                if (section.enabled === false) return false;

                // Check if dependent on a specific promo ID
                // @ts-ignore
                if (section.requiredPromoId) {
                    // @ts-ignore
                    return validPromos.has(section.requiredPromoId);
                }

                return true;
            }).map(section => (
                <React.Fragment key={section.id}>{section.element}</React.Fragment>
            ))}

            {/* Membership Promo Teaser (Optional, keeping it clean for now as per design request only showing 2 items) */}

        </div>
    );
};

export default Promotions;
