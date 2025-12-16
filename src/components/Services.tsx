import React from 'react';

const THERAPIES = [
  {
    title: "Swedish Massage",
    description: "Relaxing full-body techniques using long strokes, kneading, and gentle pressure to ease tension and promote circulation.",
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
    description: "Deep pressure massage with focused relief targeting muscle knots and chronic tension for therapeutic results.",
    image: "/therapies/deeptissue.png",
    prices: [
      { duration: "60 min", price: "$100" },
      { duration: "90 min", price: "$140" }
    ]
  },
  {
    title: "Tension Release",
    description: "Relaxing full-body massage combined with targeted pressure relief for neck, shoulders, and back.",
    image: "/therapies/tension.png",
    prices: [
      { duration: "30 min", price: "$55" },
      { duration: "45 min", price: "$75" }
    ]
  },
  {
    title: "Prenatal Massage",
    description: "Focusing on pressure points and areas of discomfort specific to pregnancy, includes a relaxing foot massage.",
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

const INCLUDED_OPTIONS = [
  {
    title: "Aromatherapy",
    description: "Choice of relaxing essential oils with aromatherapy diffuser.",
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
    description: "Complimentary hot tea or cold water with every session.",
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
              className="group flex gap-4 p-4 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark transition-all duration-300 hover:shadow-lg"
            >
              {/* Image */}
              <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-amber-100">
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
                <p className="text-sm text-text-light/70 dark:text-text-dark/70 leading-relaxed mb-3 line-clamp-3">
                  {therapy.description}
                </p>

                {/* Pricing and Arrow */}
                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    {therapy.prices.map((price, priceIndex) => (
                      <span
                        key={priceIndex}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-[#8a84a3] text-white"
                      >
                        {price.duration} | {price.price}
                      </span>
                    ))}
                  </div>
                  <a
                    href="https://app.squareup.com/appointments/book/kpgr4fsgm3uhjs/LXYE9K8E6NDSH/start"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-[#c0a172] flex items-center justify-center text-white hover:bg-[#a88a5d] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </a>
                </div>
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
            Included in the price of your massage at no additional cost
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