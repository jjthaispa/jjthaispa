import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

        {/* Map & Location Section */}
        <div className="flex flex-col rounded-2xl overflow-hidden shadow-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark group">
          {/* Map Image Container */}
          <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] w-full bg-gray-100 overflow-hidden">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Beverly_Hills_map.png/640px-Beverly_Hills_map.png"
              alt="Location Map"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />

            {/* Main Location Pin (Animated) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-6">
              <span className="relative flex h-8 w-8 justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-10 w-10 bg-text-light text-white items-center justify-center shadow-xl border-2 border-white z-10">
                  <span className="material-symbols-outlined text-xl">spa</span>
                </span>
                {/* Pin Point */}
                <div className="absolute -bottom-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-text-light"></div>
              </span>
            </div>

            {/* Simulated Nearby Pins for Context */}
            <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 scale-75 opacity-80">
              <span className="material-symbols-outlined text-5xl text-text-light drop-shadow-md">location_on</span>
            </div>
            <div className="absolute bottom-1/4 right-1/4 transform scale-75 opacity-80">
              <span className="material-symbols-outlined text-5xl text-text-light drop-shadow-md">location_on</span>
            </div>
            <div className="absolute top-1/4 right-1/3 transform scale-75 opacity-80">
              <span className="material-symbols-outlined text-5xl text-text-light drop-shadow-md">location_on</span>
            </div>
          </div>

          {/* Location Details Overlay */}
          <div className="p-8 flex flex-col justify-center gap-4 bg-white dark:bg-card-dark relative z-10 border-t border-border-light dark:border-border-dark">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-background-light dark:bg-background-dark text-primary shrink-0">
                <span className="material-symbols-outlined text-2xl">map</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-text-light dark:text-text-dark mb-2">Visit Us</h3>
                <p className="text-text-light/80 dark:text-text-dark/80 text-sm leading-relaxed mb-4">
                  180 Winter Street Unit D<br />
                  Bridgewater, MA 02324
                </p>
                <a href="#" className="inline-flex items-center text-sm font-bold text-primary hover:text-accent transition-colors group/link">
                  Get Directions
                  <span className="material-symbols-outlined text-base ml-1 transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Existing CTA Section (Rejuvenated) */}
        <div
          className="rounded-2xl bg-cover bg-center flex flex-col items-center justify-center text-center p-8 md:p-16 min-h-[400px]"
          aria-label="Blurred background of a tranquil, green natural landscape."
          style={{
            backgroundImage: 'linear-gradient(rgba(163, 177, 138, 0.85), rgba(163, 177, 138, 0.95)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBSCKjfcxeI-bxMbph25bN8Oe9dnbd17f_a3uvLgxI1eYoBRtsrDIKs8zuEnd7GHIDwtusiYVZXR3n0FFAgH41_V0_-Ele4wjyQpeoEgnOoOSPIY1b342WIpKfNwjv2WMBJ-Z6QueEtoOFDVdTeKbpp4nThAQ9CMX0bcqXI4KmrIWvj_spXZC2uZNPpU7BqyCZjXMdkfODttXzceiTgVxDS2iouoL4jLeCrbsUpGvbPghQvHlO19isI6qtyMJ7L0izS9_CMoJ1VY_rs")'
          }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 max-w-xl">
            Ready to Feel Rejuvenated?
          </h2>
          <p className="text-base text-white/90 mb-8 max-w-md mx-auto leading-relaxed">
            Join our community of happy guests and discover your own moment of bliss. Your journey to relaxation starts here.
          </p>
          <button className="flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-white hover:bg-white/90 text-text-light text-base font-bold leading-normal tracking-wide transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300">
            <span className="truncate">Book Your Experience</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default CTA;