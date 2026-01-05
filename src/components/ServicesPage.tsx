import React, { useEffect } from 'react';
import { useServices } from '../context/ServiceContext';

const ServicesPage: React.FC = () => {
    const { services } = useServices();
    const [flashingService, setFlashingService] = React.useState<string | null>(null);

    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash) {
                const id = window.location.hash.substring(1);
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        setFlashingService(id);
                        setTimeout(() => setFlashingService(null), 700);
                    }, 200);
                }
            } else {
                window.scrollTo(0, 0);
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
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
                {services.map((service, index) => {
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

                    const serviceId = service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    const isFlashing = flashingService === serviceId;

                    return (
                        <section
                            key={index}
                            id={serviceId}
                            className={`scroll-mt-32 py-20 px-4 sm:px-6 lg:px-8 transition-all duration-700 ${bgClass} ${isFlashing ? 'brightness-[0.8] z-10' : 'brightness-100'
                                }`}
                        >
                            <div className="container mx-auto max-w-7xl">
                                <div className={`flex items-start gap-12 lg:gap-20 ${layoutClass}`}>
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
                                                {service.benefitsHeading || "Key Benefits:"}
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
                                        {!service.isAddOn && (
                                            <div className={`${isEven ? 'bg-[#FAF9F6]' : 'bg-white'} dark:bg-card-dark rounded-xl p-6 md:p-8 mb-8 border border-[#EAE5E0] dark:border-border-dark relative`}>
                                                {/* PROMO Badge */}
                                                {service.hasPromo && (
                                                    <span className="absolute top-4 right-4 bg-[#C85A5A] text-white text-xs font-bold tracking-wider px-3 py-1.5 rounded-full uppercase">
                                                        {service.promoLabel || "Promo"}
                                                    </span>
                                                )}
                                                <h3 className="font-serif font-bold text-xl text-[#788E6E] dark:text-[#849f81] mb-4 border-b border-[#EAE5E0] dark:border-border-dark pb-2">
                                                    Pricing
                                                </h3>
                                                <div className="space-y-3">
                                                    {service.prices.map((price, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-[#1a231f] dark:text-white font-medium">
                                                            <span>{price.durationServices}</span>
                                                            <span className="flex items-center gap-2">
                                                                {price.promoPrice ? (
                                                                    <>
                                                                        <span className="text-[#a0a0a0] line-through decoration-[#C85A5A] text-base">${price.price}</span>
                                                                        <span className="font-bold text-lg text-[#788E6E] dark:text-[#849f81]">${price.promoPrice}</span>
                                                                    </>
                                                                ) : (
                                                                    <span className="font-bold text-lg">${price.price}</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Button */}
                                        {!service.isAddOn && (
                                            <a
                                                href={service.callToBook ? "tel:+5088070141" : "https://app.squareup.com/appointments/book/kpgr4fsgm3uhjs/LXYE9K8E6NDSH/start"}
                                                target={service.callToBook ? undefined : "_blank"}
                                                rel={service.callToBook ? undefined : "noopener noreferrer"}
                                                className={`inline-block ${service.callToBook ? 'bg-[#c0a172] hover:bg-[#a88a5d]' : 'bg-[#788E6E] hover:bg-[#6f876c]'} text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide uppercase shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5`}
                                            >
                                                {service.callToBook ? 'Call for Appointment' : 'Book Appointment'}
                                            </a>
                                        )}
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
