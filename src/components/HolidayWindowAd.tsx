import React from 'react';

const HolidayWindowAd: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-0 md:p-0">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .print-bg-promo { background-color: #788E6E !important; color: white !important; }
        }
      `}} />
      <div className="w-full bg-white shadow-none flex flex-col md:flex-row">
        {/* Left Side: Image */}
        <div className="flex-1 min-h-[400px] md:min-h-[700px] relative overflow-hidden">
          <img 
            src="/promos/promo.png" 
            alt="Holiday Relaxation" 
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />
          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center pt-12 md:pt-16 p-6 z-10 text-center">
            {/* Tagline */}
            <span className="text-[#788E6E] font-bold tracking-[0.2em] text-xs md:text-sm uppercase mb-4 block drop-shadow-sm">
              Limited Time Offer
            </span>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-[86px] leading-[0.95] font-bold text-[#1a231f] mb-2 tracking-tight drop-shadow-md">
              Holiday<br />Healing<br />Special
            </h1>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-10 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto md:mx-0">
            {/* Subheading */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-[#1a231f]/80 font-light">
                A Gift to Yourself
              </h2>
              <img src="/logo-gold.svg" alt="Logo" className="h-20 md:h-32 w-auto object-contain shrink-0" />
            </div>

            {/* Body Text */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
              Indulge in ultimate relaxation.
            </p>

            {/* Promotional Badges Grid */}
            <div className="flex flex-col gap-6 max-w-lg">
              {/* Individual Savings Row */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { amount: '10', label: '60 or 75 Minute' },
                  { amount: '15', label: '90 Minute' }
                ].map((promo, idx) => (
                  <div key={idx} className="relative group">
                    <div className="bg-[#788E6E] text-white p-6 rounded-[2rem] shadow-lg flex flex-col items-center justify-center border border-white/10 print-bg-promo">
                      <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase mb-1 opacity-90 text-center leading-tight">
                        Holiday Savings
                      </span>
                      <div className="flex items-start">
                        <span className="text-xl md:text-2xl font-serif mt-1 mr-0.5 opacity-90">$</span>
                        <span className="text-4xl md:text-5xl font-serif font-bold italic tracking-tighter">{promo.amount} OFF</span>
                      </div>
                      <div className="text-xs md:text-sm font-medium opacity-80 mt-3 uppercase tracking-[0.1em] text-center">
                        {promo.label}
                      </div>
                    </div>
                    {/* Subtle glow effect behind each badge */}
                    <div className="absolute inset-0 bg-[#788E6E] blur-2xl opacity-10 -z-10 rounded-full scale-110 group-hover:opacity-20 transition-opacity"></div>
                  </div>
                ))}
              </div>

              {/* Couples Savings Label */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-[#788E6E]/20 flex-grow"></div>
                <span className="text-[#788E6E] font-serif italic text-xl md:text-3xl whitespace-nowrap">Couples Savings</span>
                <div className="h-px bg-[#788E6E]/20 flex-grow"></div>
              </div>

              {/* Couples Savings Row */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { amount: '20', label: '60 Min Couples' },
                  { amount: '30', label: '90 Min Couples' }
                ].map((promo, idx) => (
                  <div key={idx} className="relative group">
                    <div className="bg-[#788E6E] text-white p-6 rounded-[2rem] shadow-lg flex flex-col items-center justify-center border border-white/10 print-bg-promo">
                      <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase mb-1 opacity-90 text-center leading-tight">
                        Holiday Savings
                      </span>
                      <div className="flex items-start">
                        <span className="text-xl md:text-2xl font-serif mt-1 mr-0.5 opacity-90">$</span>
                        <span className="text-4xl md:text-5xl font-serif font-bold italic tracking-tighter">{promo.amount} OFF</span>
                      </div>
                      <div className="text-xs md:text-sm font-medium opacity-80 mt-3 uppercase tracking-[0.1em] text-center">
                        {promo.label}
                      </div>
                    </div>
                    {/* Subtle glow effect behind each badge */}
                    <div className="absolute inset-0 bg-[#788E6E] blur-2xl opacity-10 -z-10 rounded-full scale-110 group-hover:opacity-20 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] md:text-xs text-gray-400 italic mt-12 leading-relaxed max-w-[280px]">
              *Offer valid through January 4th, 2026. Cannot be combined. Discount applied at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayWindowAd;

