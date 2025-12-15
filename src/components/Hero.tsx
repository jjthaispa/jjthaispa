import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative">
      <div
        className="flex min-h-[400px] md:min-h-[500px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-8 text-center"
        aria-label="A serene spa room with massage beds and soft lighting"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("/background.png")'
        }}
      >
        <div className="flex flex-col gap-4 max-w-2xl mt-16 md:mt-20">
          <h1 className="font-serif font-bold leading-tight text-white">
            {/* Desktop Curved Text */}
            <div className="hidden md:block mb-4 opacity-90 w-full max-w-md mx-auto">
              <svg viewBox="0 0 400 80" className="w-full h-auto overflow-visible">
                <path id="curve" d="M20,80 Q200,35 380,80" fill="transparent" />
                <text className="font-serif font-bold fill-white text-[38px]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  <textPath href="#curve" startOffset="50%" textAnchor="middle">
                    J<tspan dy="-8">.</tspan><tspan dy="8">J</tspan> Thai Spa
                  </textPath>
                </text>
              </svg>
            </div>
            <span className="block text-4xl md:text-6xl">Bridgewater</span>
          </h1>
          <p className="text-base font-normal leading-normal text-white/90 md:text-lg">
            Restorative massage, stretching, and bodywork to restore balance and ease tension. Book your appointment today!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
            <a
              href="https://app.squareup.com/appointments/book/kpgr4fsgm3uhjs/LXYE9K8E6NDSH/start"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all duration-150 shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
            >
              Book Now
            </a>
            <a
              href="https://app.squareup.com/gift/MLW48R10CJHXH/order"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full transition-all duration-150 backdrop-blur-sm border border-white/30 hover:border-white/40 hover:scale-[1.02]"
            >
              Buy eGift Card
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;