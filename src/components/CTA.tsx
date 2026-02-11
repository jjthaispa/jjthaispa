import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="bg-[#F0EBE5] dark:bg-[#252320] border-t border-border-light dark:border-border-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Map & Location Section - Side by Side */}
        <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark max-w-5xl mx-auto">
          {/* Google Maps Embed */}
          <div className="relative h-80 lg:h-auto lg:flex-1 w-full bg-gray-100 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2966.5072815067474!2d-70.97745688737339!3d41.967917159664395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e491cd8e47b0bd%3A0x49db5391f06fbd06!2sJ.J%20Thai%20Spa!5e0!3m2!1sen!2sus!4v1768615445581!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="J.J Thai Spa Location"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Location & Contact Details - Right Side */}
          <div className="p-6 lg:p-8 flex flex-col justify-center gap-5 bg-white dark:bg-card-dark relative z-10 border-t lg:border-t-0 lg:border-l border-border-light dark:border-border-dark lg:w-96">
            <h3 className="font-serif text-xl font-bold text-text-light dark:text-text-dark">Visit Us</h3>

            {/* Contact Info Group */}
            <div className="flex flex-col gap-3">
              {/* Address */}
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-xl text-primary shrink-0">location_on</span>
                <div>
                  <p className="text-text-light/80 dark:text-text-dark/80 text-sm leading-relaxed">
                    180 Winter St. Unit D<br />
                    Bridgewater, MA 02324
                  </p>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=180+Winter+St+Unit+D,+Bridgewater,+MA+02324"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-bold text-primary hover:text-accent transition-colors group/link mt-1"
                  >
                    Get Directions
                    <span className="material-symbols-outlined text-base ml-1 transition-transform group-hover/link:translate-x-1">arrow_forward</span>
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl text-primary shrink-0">call</span>
                <a href="tel:+15088070141" className="text-text-light/80 dark:text-text-dark/80 text-sm hover:text-primary transition-colors">
                  (508) 807-0141
                </a>
              </div>

              {/* Text */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl text-primary shrink-0">sms</span>
                <a href="sms:+8333752584" className="text-text-light/80 dark:text-text-dark/80 text-sm hover:text-primary transition-colors">
                  Text us: (833) 375-2584
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border-light dark:border-border-dark"></div>

            {/* Business Hours */}
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-xl text-primary shrink-0">schedule</span>
              <div className="flex-1">
                <h4 className="font-semibold text-text-light dark:text-text-dark text-sm mb-2">Business Hours</h4>
                <div className="space-y-1 text-sm text-text-light/80 dark:text-text-dark/80">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday / Sunday</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
