import React, { useEffect } from 'react';

const SERVICES = [
    {
        title: "Swedish Massage",
        description: "Relaxing full-body techniques using long strokes, kneading, and gentle to medium pressure to ease tension and promote circulation.",
        image: "/therapies/swedish.png",
        prices: [
            { duration: "60 min", price: "$90" },
            { duration: "90 min", price: "$125" }
        ]
    },
    {
        title: "Thai Combination Massage",
        description: "A customized blend of Swedish, deep tissue, and Thai techniques tailored to your specific needs and preferences.",
        image: "/therapies/combination.png",
        prices: [
            { duration: "60 min", price: "$95" },
            { duration: "90 min", price: "$135" }
        ]
    },
    {
        title: "Thai Deep Tissue",
        description: "A therapeutic massage using firm pressure and Thai techniques. Ideal for pain relief, muscle recovery, and improved mobility. Can be enhanced with optional Ashiatsu massage.",
        image: "/therapies/deeptissue.png",
        prices: [
            { duration: "60 min", price: "$100" },
            { duration: "90 min", price: "$140" }
        ]
    },
    {
        title: "Back, Neck and Shoulder Release",
        description: "Relieve built-up tension where it’s felt most. This focused massage targets the neck, back, and shoulders using therapeutic techniques to release tight muscles and ease stress.",
        image: "/therapies/tension.png",
        prices: [
            { duration: "30 min", price: "$55" },
            { duration: "45 min", price: "$75" }
        ]
    },
    {
        title: "Prenatal Massage",
        description: "A gentle, nurturing massage designed specifically for expectant mothers. This treatment helps alleviates common discomforts during pregnancy",
        image: "/therapies/prenatal.png",
        prices: [
            { duration: "60 min", price: "$90" },
            { duration: "90 min", price: "$125" }
        ]
    },
    {
        title: "Couples Massage",
        description: "Share a relaxing experience together with designed side-by-side massage and traditional Thai techniques.",
        image: "/therapies/couples.png",
        prices: [
            { duration: "60 min", price: "Varies" },
            { duration: "90 min", price: "Varies" }
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
                    // Note: Using flex-col-reverse keeps text on top on mobile for both
                    const layoutClass = isEven
                        ? 'flex-col-reverse md:flex-row'
                        : 'flex-col-reverse md:flex-row-reverse';

                    const serviceId = service.title.toLowerCase().replace(/\s+/g, '-');
                    const isFlashing = flashingService === serviceId;

                    return (
                        <section key={index} id={serviceId} className={`scroll-mt-32 py-20 px-4 sm:px-6 lg:px-8 ${bgClass}`}>
                            <div className="container mx-auto max-w-6xl">
                                <div className={`flex items-center gap-12 lg:gap-24 ${layoutClass} transition-all duration-500 ${isFlashing ? 'scale-[1.02]' : ''}`}>
                                    {/* Image */}
                                    <div className="flex-1 w-full">
                                        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square md:aspect-[5/4] group">
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
                                    <div className="flex-1">
                                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1a231f] dark:text-white mb-6 leading-tight">
                                            {service.title}
                                        </h2>
                                        <p className="text-[#1a231f]/70 dark:text-white/70 leading-relaxed mb-8 text-lg">
                                            {service.description}
                                        </p>

                                        {/* Pricing */}
                                        <div className="flex flex-wrap gap-3 mb-8">
                                            {service.prices.map((price, idx) => (
                                                <div key={idx} className="px-4 py-2 rounded-lg bg-background-light dark:bg-card-dark border border-[#849f81]/30 text-[#5A6B52] dark:text-[#849f81] font-bold shadow-sm">
                                                    {price.duration}: <span className="text-[#1a231f] dark:text-white ml-1">{price.price}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <a
                                            href="https://app.squareup.com/appointments/book/kpgr4fsgm3uhjs/LXYE9K8E6NDSH/start"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[#5A6B52] dark:text-[#849f81] font-bold text-lg hover:text-[#3d4a37] dark:hover:text-[#a3bea0] transition-colors group"
                                        >
                                            Book Now
                                            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
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
