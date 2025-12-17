import React, { useEffect } from 'react';

const SERVICES = [
    {
        category: "RELAXATION",
        title: "Swedish Massage",
        description: "Our classic Swedish Massage creates a calming experience designed to relax the entire body. By using long, gliding strokes in the direction of blood returning to the heart, this therapy increases oxygen levels in the blood, decreases muscle toxins, and improves circulation and flexibility while easing tension.",
        image: "/therapies/swedish.png",
        benefits: [
            "Promotes deep relaxation and stress relief",
            "Improves blood circulation",
            "Stimulates the lymphatic system"
        ],
        hasPromo: true,
        prices: [
            { duration: "60 Minutes", price: "$90", promoPrice: "$80" },
            { duration: "90 Minutes", price: "$125", promoPrice: "$110" }
        ]
    },
    {
        category: "CUSTOMIZED",
        title: "Thai Combination Massage",
        description: "A customized blend of Swedish, deep tissue, and Thai techniques tailored to your specific needs. This unique therapy integrates the best of multiple modalities to address individual concerns, providing both relaxation and therapeutic relief where you need it most.",
        image: "/therapies/combination.png",
        benefits: [
            "Targeted relief for specific areas",
            "Combines multiple healing techniques",
            "Improves flexibility and range of motion"
        ],
        hasPromo: true,
        prices: [
            { duration: "60 Minutes", price: "$95", promoPrice: "$85" },
            { duration: "90 Minutes", price: "$135", promoPrice: "$120" }
        ]
    },
    {
        category: "THERAPEUTIC",
        title: "Thai Deep Tissue",
        description: "A therapeutic massage using firm pressure and Thai techniques to target the inner layers of your muscles and connective tissues. This is ideal for treating musculoskeletal issues, such as strains and sports injuries, breaking up scar tissue and physically breaking down muscle knots.",
        image: "/therapies/deeptissue.png",
        benefits: [
            "Alleviates chronic muscle pain",
            "Releases deep-seated tension",
            "Enhances mobility and recovery"
        ],
        hasPromo: true,
        prices: [
            { duration: "60 Minutes", price: "$100", promoPrice: "$90" },
            { duration: "90 Minutes", price: "$140", promoPrice: "$125" }
        ]
    },
    {
        category: "FOCUSED RELIEF",
        title: "Back, Neck & Shoulder Release",
        description: "Relieve built-up tension where it's felt most. This focused massage targets the neck, back, and shoulders using therapeutic techniques to release tight muscles and ease stress, perfect for those with desk jobs or carrying stress in their upper body.",
        image: "/therapies/tension.png",
        benefits: [
            "Relieves upper body tension",
            "Reduces tension headaches",
            "Improves posture and alignment"
        ],
        hasPromo: false,
        prices: [
            { duration: "30 Minutes", price: "$55" },
            { duration: "45 Minutes", price: "$75" }
        ]
    },
    {
        category: "MATERNITY",
        title: "Prenatal Massage",
        description: "A gentle, nurturing massage designed specifically for expectant mothers. This safe and effective treatment helps alleviate common discomforts during pregnancy such as back pain, leg cramps, and swelling, while promoting better sleep and reducing anxiety.",
        image: "/therapies/prenatal.png",
        benefits: [
            "Reduces swelling and joint pain",
            "Alleviates lower back discomfort",
            "Promotes better sleep and relaxation"
        ],
        hasPromo: true,
        prices: [
            { duration: "60 Minutes", price: "$90", promoPrice: "$80" },
            { duration: "90 Minutes", price: "$125", promoPrice: "$110" }
        ]
    },
    {
        category: "SHARED EXPERIENCE",
        title: "Couples Massage",
        description: "Share a relaxing experience together with designed side-by-side massage. Whether for romance, bonding with a friend, or mother-daughter time, enjoy the benefits of massage therapy in our private couple's suite.",
        image: "/therapies/couples.png",
        benefits: [
            "Perfect for bonding and connection",
            "Simultaneous relaxation experience",
            "Private suite setting"
        ],
        hasPromo: false,
        prices: [
            { duration: "60 Minutes", price: "Varies" },
            { duration: "90 Minutes", price: "Varies" }
        ]
    }
];

const ServicesPage: React.FC = () => {
    const [flashingService, setFlashingService] = React.useState<string | null>(null);

    useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                    setFlashingService(id);
                    setTimeout(() => setFlashingService(null), 500);
                }, 200);
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
                        src="/promotion_background.png"
                        alt="Spa Services"
                        className="w-full h-full object-cover"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-md">
                        Our Services
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-light">
                        Experience the art of traditional Thai healing and modern wellness therapies.
                    </p>
                </div>
            </div>

            {/* Services List */}
            <div className="flex flex-col">
                {SERVICES.map((service, index) => {
                    const isEven = index % 2 === 0;
                    // Alternating background colors
                    const bgClass = isEven
                        ? 'bg-white dark:bg-[#1a231f]'
                        : 'bg-background-light dark:bg-background-dark';

                    // Alternating Layout
                    // Even: Image Left, Text Right (flex-col-reverse md:flex-row)
                    // Odd: Text Left, Image Right (flex-col-reverse md:flex-row-reverse)
                    const layoutClass = isEven
                        ? 'flex-col-reverse md:flex-row'
                        : 'flex-col-reverse md:flex-row-reverse';

                    const serviceId = service.title.toLowerCase().replace(/\s+/g, '-');
                    const isFlashing = flashingService === serviceId;

                    return (
                        <section key={index} id={serviceId} className={`scroll-mt-32 py-20 px-4 sm:px-6 lg:px-8 ${bgClass}`}>
                            <div className="container mx-auto max-w-7xl">
                                <div className={`flex items-start gap-12 lg:gap-20 ${layoutClass} transition-all duration-500 ${isFlashing ? 'md:shadow-2xl md:scale-[1.02] md:rounded-2xl md:p-4' : ''}`}>
                                    {/* Image */}
                                    <div className="flex-1 w-full md:mt-24">
                                        <div className="relative rounded-2xl overflow-hidden aspect-square md:aspect-[4/3] w-full">
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.innerHTML = `<img src="/therapies/swedish.png" alt="Therapy" class="w-full h-full object-cover" />`;
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 w-full pt-4">
                                        {/* Category */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-px w-8 bg-[#849f81]"></div>
                                            <span className="text-xs font-bold tracking-widest text-[#849f81] uppercase">
                                                {service.category}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a231f] dark:text-white mb-6 leading-tight">
                                            {service.title}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-[#1a231f]/80 dark:text-white/80 leading-relaxed mb-8 text-base md:text-lg">
                                            {service.description}
                                        </p>

                                        {/* Key Benefits */}
                                        <div className="mb-8">
                                            <h3 className="font-serif font-bold text-lg text-[#1a231f] dark:text-white mb-4">
                                                Key Benefits:
                                            </h3>
                                            <ul className="space-y-3">
                                                {service.benefits.map((benefit, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-[#1a231f]/70 dark:text-white/70">
                                                        <span className="material-symbols-outlined text-[#849f81] text-lg shrink-0 mt-0.5">check_circle</span>
                                                        <span>{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Pricing Box */}
                                        <div className={`${isEven ? 'bg-[#FAF9F6]' : 'bg-white'} dark:bg-card-dark rounded-xl p-6 md:p-8 mb-8 border border-[#EAE5E0] dark:border-border-dark relative`}>
                                            {/* PROMO Badge */}
                                            {service.hasPromo && (
                                                <span className="absolute top-4 right-4 bg-[#C85A5A] text-white text-xs font-bold tracking-wider px-3 py-1.5 rounded-full uppercase">
                                                    Promo
                                                </span>
                                            )}
                                            <h3 className="font-serif font-bold text-xl text-[#788E6E] dark:text-[#849f81] mb-4 border-b border-[#EAE5E0] dark:border-border-dark pb-2">
                                                Pricing
                                            </h3>
                                            <div className="space-y-3">
                                                {service.prices.map((price, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-[#1a231f] dark:text-white font-medium">
                                                        <span>{price.duration}</span>
                                                        <span className="flex items-center gap-2">
                                                            {price.promoPrice ? (
                                                                <>
                                                                    <span className="text-[#a0a0a0] line-through text-base">{price.price}</span>
                                                                    <span className="font-bold text-lg text-[#788E6E] dark:text-[#849f81]">{price.promoPrice}</span>
                                                                </>
                                                            ) : (
                                                                <span className="font-bold text-lg">{price.price}</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Button */}
                                        <a
                                            href="https://app.squareup.com/appointments/book/kpgr4fsgm3uhjs/LXYE9K8E6NDSH/start"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-[#788E6E] hover:bg-[#6f876c] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide uppercase shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                        >
                                            Book Appointment
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

export default ServicesPage;
