import React from 'react';
import { GALLERY_IMAGES } from '../constants';

const Gallery: React.FC = () => {
  return (
    <section className="bg-card-light dark:bg-card-dark py-12 md:py-20 border-y border-border-light dark:border-border-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">Moments of Serenity</h2>
        <p className="text-base text-text-light/80 dark:text-text-dark/80 max-w-2xl mx-auto mb-8 md:mb-12">
          Shared by our guests, capturing the essence of tranquility.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GALLERY_IMAGES.map((img, index) => (
            <div key={index} className="overflow-hidden rounded-lg aspect-square">
              <img 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                alt={img.alt}
                src={img.src} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;