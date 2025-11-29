import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative">
      <div 
        className="flex min-h-[400px] md:min-h-[500px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-8 text-center"
        aria-label="A serene spa room with massage beds and soft lighting"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAEa_lidpiiv45-1Ll8Sl0-gIY6eU4CPN9lciue6JyG8uP5mU8buAGx4ohTW1Bbi6ULmIeOuXbpwrtA7bncUvxbUN_53k8cQpLyb-OxQorYWtuesunhmfGWeaPCke3OyT2AjWBupjzuOniBxP479e4eeJVj93FP4I7QASEzzk88ePCVzXlbO9gAinZ0aL3U30chqTg5GycblRLj0Gjj6etWvY4bNM_go7cvnOEp6zPaYXoQC1aFlPHWiN3mzYN75tTi5CE39oQ_eECF")'
        }}
      >
        <div className="flex flex-col gap-4 max-w-2xl">
          <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
            Hear From Our Guests
          </h1>
          <p className="text-base font-normal leading-normal text-white/90 md:text-lg">
            Discover why our guests love the Serenity Spa experience through their own words.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;