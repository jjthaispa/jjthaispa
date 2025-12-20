import React, { useEffect, useState } from 'react';

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
                if (window.location.hash === '#holiday-special') {
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

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
            {/* Hero Section */}
            <div className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/buddha.png"
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
                        Restore balance and ease tension with our exclusive seasonal offers and wellness packages.
                    </p>
                </div>
            </div>

            {/* Holiday Special Section */}
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
                                    *Offer valid through January 4th, 2026. Cannot be combined with other discounts.  Discount applied at checkout.
                                </p>
                            </div>

                            {/* Right Image */}
                            <div className="flex-1 min-h-[300px] md:min-h-0 overflow-hidden">
                                <img
                                    src="/promos/promo_dark.png"
                                    alt="Holiday Healing Special"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gift Card Section */}
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
                                    src="/promos/giftcard_box.png"
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
                                Instant eGift Cards are the perfect present for any occasion. Available in store or online, deliverable instantly via email. Let them choose their own path to wellness.
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

            {/* Membership Promo Teaser (Optional, keeping it clean for now as per design request only showing 2 items) */}

        </div>
    );
};

export default Promotions;
