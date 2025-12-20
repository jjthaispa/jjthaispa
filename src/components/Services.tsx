import React from 'react';

const THERAPIES = [
  {
    title: "Swedish Massage",
    description: "Our Swedish Massage blends long, flowing movements and light kneading with gentle to medium pressure to gently relax muscles, reduce stress, and restore balance.",
    image: "/therapies/swedish2.png",
    hasPromo: true,
    prices: [
      { duration: "60 min", price: "$90", promoPrice: "$80" },
      { duration: "90 min", price: "$125", promoPrice: "$110" }
    ]
  },
  {
    title: "Thai Combination Massage",
    description: "A customized blend of Swedish, deep tissue, and Thai techniques tailored to your specific needs and preferences.",
    image: "/therapies/combination.png",
    hasPromo: true,
    prices: [
      { duration: "60 min", price: "$95", promoPrice: "$85" },
      { duration: "90 min", price: "$135", promoPrice: "$120" }
    ]
  },
  {
    title: "Thai Deep Tissue",
    description: "A therapeutic massage using firm pressure and Thai techniques. Ideal for pain relief, muscle recovery, and improved mobility. Can be enhanced with optional Ashiatsu massage.",
    image: "/therapies/deeptissue.png",
    hasPromo: true,
    prices: [
      { duration: "60 min", price: "$100", promoPrice: "$90" },
      { duration: "90 min", price: "$140", promoPrice: "$125" }
    ]
  },
  {
    title: "Back, Neck & Shoulder Release",
    description: "Relieve built-up tension where it's felt most. This focused massage targets the neck, back, and shoulders using therapeutic techniques to release tight muscles and ease stress.",
    image: "/therapies/tension.png",
    hasPromo: false,
    prices: [
      { duration: "30 min", price: "$55" },
      { duration: "45 min", price: "$75" }
    ]
  },
  {
    title: "Prenatal Massage",
    description: "A gentle, nurturing massage designed specifically for expectant mothers. This treatment helps alleviates common discomforts during pregnancy",
    image: "/therapies/prenatal.png",
    hasPromo: true,
    prices: [
      { duration: "60 min", price: "$90", promoPrice: "$80" },
      { duration: "90 min", price: "$125", promoPrice: "$110" }
    ]
  },
  {
    title: "Couples Massage",
    description: "Share a relaxing experience together with designed side-by-side massage and traditional Thai techniques.",
    image: "/therapies/couples.png",
    hasPromo: true,
    prices: [
      { duration: "60 min Swedish", price: "$180", promoPrice: "$160" },
      { duration: "60 min Deep Tissue", price: "$200", promoPrice: "$180" }
    ]
  }
];

const INCLUDED_OPTIONS = [
  {
    title: "Aromatherapy",
    description: "Elevate your massage experience with the calming power of essential oils.",
    icon: "spa",
    image: "/options/aromatherapy.svg"
  },
  {
    title: "Hot Stone",
    description: "Heated stones for deeper muscle relaxation and tension relief.",
    icon: "local_fire_department",
    image: "/options/stones.svg"
  },
  {
    title: "Cupping Therapy",
    description: "Cupping set available with any massage to enhance circulation.",
    icon: "sports_bar",
    image: "/options/cupping.svg"
  },

  {
    title: "Heated Massage Table",
    description: "Premium heated massage tables for optimal comfort and warmth.",
    icon: "bed",
    image: "/options/table.svg"
  },
  {
    title: "Hot Towel",
    description: "Relaxing hot towel treatment to soothe muscles and cleanse skin.",
    icon: "cleaning_services",
    image: "/options/towels.svg"
  },
  {
    title: "Tea or Cold Water",
    description: "Complimentary hot tea or cold water after every session.",
    icon: "emoji_food_beverage",
    image: "/options/tea.svg"
  },
];

const Services: React.FC = () => {
  return (
    <section className="bg-background-light dark:bg-background-dark py-8 md:py-12 border-b border-border-light dark:border-border-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-text-light dark:text-text-dark">
          Our Therapies
        </h2>

        {/* Therapy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {THERAPIES.map((therapy, index) => (
            <div
              key={index}
              className="group relative flex flex-col p-4 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark transition-all duration-300 hover:shadow-lg"
            >
              {/* Service Icon in Top Right */}
              <div className="absolute top-4 right-4 w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                <img 
                  src={
                    therapy.title === 'Swedish Massage' ? '/therapies/swedish_icon.svg' :
                    therapy.title === 'Thai Combination Massage' ? '/therapies/combination_icon.svg' :
                    therapy.title === 'Thai Deep Tissue' ? '/therapies/deeptissue_icon.svg' :
                    therapy.title === 'Prenatal Massage' ? '/therapies/prenatal_icon.svg' :
                    therapy.title === 'Couples Massage' ? '/therapies/couples_icon.svg' :
                    therapy.title.includes('Shoulder') ? '/therapies/shoulder_icon.svg' :
                    '/therapies/swedish_icon.svg'
                  }
                  alt="" 
                  className="w-full h-full object-contain" 
                />
              </div>

              {/* Top row: Image and Text */}
              <div className="flex gap-4">
                {/* Image with PROMO badge */}
                <div className="relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-amber-100">
                  {therapy.hasPromo && (
                    <span className="absolute top-2 left-2 z-10 bg-[#C85A5A] text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase shadow-sm">
                      Promo
                    </span>
                  )}
                  <img
                    src={therapy.image}
                    alt={therapy.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<img src="/therapies/swedish.png" alt="Therapy" class="w-full h-full object-cover" />`;
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-w-0">
                  <h3 className="font-serif text-lg font-bold text-text-light dark:text-text-dark mb-1 group-hover:text-primary transition-colors">
                    {therapy.title}
                  </h3>
                  <p className="text-sm text-text-light/70 dark:text-text-dark/70 leading-relaxed line-clamp-4">
                    {therapy.description}
                  </p>
                </div>
              </div>

              {/* Pricing and Arrow - below image and description */}
              <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {therapy.prices.map((price, priceIndex) => (
                    <span
                      key={priceIndex}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-full bg-[#8a84a3] text-white flex items-center gap-1.5"
                    >
                      {price.duration} |
                      {price.promoPrice ? (
                        <>
                          <span className="line-through decoration-[#C85A5A] opacity-70">{price.price}</span>
                          <span className="font-bold">{price.promoPrice}</span>
                        </>
                      ) : (
                        <span>{price.price}</span>
                      )}
                    </span>
                  ))}
                </div>
                <a
                  href={`/services#${therapy.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-[#788E6E] flex items-center justify-center text-white hover:bg-[#5A6B52] transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* IncludedService Options Section */}
        <div>
          <h3 className="font-serif text-2xl md:text-3xl font-bold mb-2 text-text-light dark:text-text-dark">
            Service Options
          </h3>
          <p className="text-lg text-text-light/70 dark:text-text-dark/70 mb-8">
            Included with your massage at no additional cost
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INCLUDED_OPTIONS.map((option, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-4 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 bg-background-light dark:bg-background-dark group-hover:bg-text-light dark:group-hover:bg-text-dark">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-8 h-8 transition-all duration-300 group-hover:invert group-hover:brightness-0 group-hover:invert-0 group-hover:brightness-200"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-text-light dark:text-text-dark mb-1">
                    {option.title}
                  </h4>
                  <p className="text-sm text-text-light/70 dark:text-text-dark/70 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;