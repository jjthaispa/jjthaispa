import React from 'react';

const SERVICES = [
  {
    title: "Traditional Thai Massage",
    description: "Ancient healing art combining acupressure, Indian Ayurvedic principles, and assisted yoga postures to restore energy flow.",
    icon: "self_improvement"
  },
  {
    title: "Swedish Massage",
    description: "A classic full-body massage using gentle, long strokes to improve circulation, relieve tension, and promote relaxation.",
    icon: "waves"
  },
  {
    title: "Prenatal Massage",
    description: "A nurturing massage specially designed for expectant mothers to relieve discomfort, reduce swelling, and promote deep relaxation.",
    icon: "pregnant_woman"
  },
  {
    title: "Couples Massage",
    description: "Share a moment of tranquility side-by-side. Enjoy simultaneous massages in our private suite for a shared bonding experience.",
    icon: "favorite"
  }
];

const Services: React.FC = () => {
  return (
    <section className="bg-background-light dark:bg-background-dark py-12 md:py-20 border-b border-border-light dark:border-border-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-text-light dark:text-text-dark">Our Treatments</h2>
          <p className="text-text-light/80 dark:text-text-dark/80 text-base md:text-lg">
            Restore balance to your body and mind with our curated selection of holistic therapies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center text-center p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-3xl">{service.icon}</span>
              </div>
              <h3 className="font-serif text-xl font-bold mb-3 text-text-light dark:text-text-dark group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-text-light/70 dark:text-text-dark/70 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;