import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const Contact: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
            <Helmet>
                <title>Contact Us - J.J Thai Spa</title>
                <meta name="description" content="Visit us for a rejuvenating experience. Find our location, opening hours, and contact information to book your appointment." />
                <link rel="canonical" href="https://jjthaispa.com/contact" />
            </Helmet>
            {/* Dark Hero Section */}
            <div className="bg-background-dark min-h-[400px] md:min-h-[500px] flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                        Contact Us
                    </h1>
                    <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-8"></div>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                        We'd love to hear from you. Whether you have a question about our services, need help booking an appointment, or just want to say hello.
                    </p>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="flex-grow px-4 sm:px-6 lg:px-8 pb-20">
                <div className="container mx-auto max-w-4xl relative z-10 -mt-12">
                    <div className="space-y-12 bg-card-light dark:bg-card-dark p-8 md:p-12 rounded-2xl shadow-xl border border-border-light dark:border-border-dark">

                        {/* Contact Details */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-6 border-b border-border-light dark:border-border-dark pb-2">
                                    Get in Touch
                                </h2>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                            <span className="material-symbols-outlined">location_on</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-light dark:text-text-dark mb-1">Visit Us</h3>
                                            <p className="text-text-light/70 dark:text-text-dark/70 leading-relaxed">
                                                180 Winter St. Unit D<br />
                                                Bridgewater, MA 02324
                                            </p>
                                            <a
                                                href="https://www.google.com/maps/dir/?api=1&destination=180+Winter+St+Unit+D,+Bridgewater,+MA+02324"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-sm font-bold text-primary hover:text-accent transition-colors group mt-2"
                                            >
                                                Get Directions
                                                <span className="material-symbols-outlined text-base ml-1 transition-transform group-hover:translate-x-1">arrow_forward</span>
                                            </a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                            <span className="material-symbols-outlined">schedule</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-light dark:text-text-dark mb-1">Business Hours</h3>
                                            <p className="text-text-light/70 dark:text-text-dark/70 leading-relaxed text-sm">
                                                <span className="block mb-1"><span className="font-bold text-text-light/90 dark:text-text-dark/90 w-20 inline-block">Mon - Fri:</span> 10:00 AM - 8:00 PM</span>
                                                <span className="block"><span className="font-bold text-text-light/90 dark:text-text-dark/90 w-20 inline-block">Sat - Sun:</span> 10:00 AM - 6:00 PM</span>
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                            <span className="material-symbols-outlined">call</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-light dark:text-text-dark mb-1">Call Us</h3>
                                            <a href="tel:+5088070141" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary transition-colors">
                                                (508) 807-0141
                                            </a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                            <span className="material-symbols-outlined">sms</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-light dark:text-text-dark mb-1">Text Us</h3>
                                            <a href="sms:+8333752584" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary transition-colors">
                                                (833) 375-2584
                                            </a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                            <span className="material-symbols-outlined">mail</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-light dark:text-text-dark mb-1">Email Us</h3>
                                            <a href="mailto:contact@jjthaispa.com" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary transition-colors">
                                                contact@jjthaispa.com
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Google Maps */}
                            <div className="relative h-80 md:h-full min-h-[320px] rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
                                <iframe
                                    src="https://maps.google.com/maps?q=180+Winter+St+Unit+D,+Bridgewater,+MA+02324&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="J.J Thai Spa Location"
                                    className="absolute inset-0 w-full h-full"
                                />
                            </div>
                        </section>

                        {/* Job Applications Section */}
                        <section className="pt-8 border-t border-border-light dark:border-border-dark">
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-6">
                                Join Our Team
                            </h2>
                            <div className="bg-background-light dark:bg-background-dark rounded-xl p-8 border border-border-light dark:border-border-dark">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-text-light dark:text-text-dark mb-2">
                                            Careers at J.J Thai Spa
                                        </h3>
                                        <p className="text-text-light/70 dark:text-text-dark/70 mb-4 leading-relaxed">
                                            We are always looking for talented and passionate therapists and staff to join our growing family.
                                            If you dedicated to wellness and providing exceptional service, we want to hear from you.
                                        </p>
                                        <div className="space-y-2">
                                            <p className="text-text-light/80 dark:text-text-dark/80">
                                                <strong>Email your resume:</strong> <a href="mailto:jobs@jjthaispa.com" className="text-primary hover:underline">jobs@jjthaispa.com</a>
                                            </p>
                                            <p className="text-text-light/80 dark:text-text-dark/80">
                                                <strong>View current openings:</strong> <a href="https://www.indeed.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline group inline-flex items-center gap-1">
                                                    Find us on Indeed
                                                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5">open_in_new</span>
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block w-px self-stretch bg-border-light dark:border-border-dark"></div>
                                    <div className="w-full md:w-auto flex-shrink-0 flex justify-center">
                                        <span className="material-symbols-outlined text-6xl text-primary/20">work</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
