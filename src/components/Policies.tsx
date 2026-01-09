import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const Policies: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
            <Helmet>
                <title>Spa Policies - J.J Thai Spa</title>
                <meta name="description" content="Read our spa policies regarding appointments, cancellations, arrival times, and health considerations to ensure a smooth experience." />
                <link rel="canonical" href="https://jjthaispa.com/policies" />
            </Helmet>
            {/* Dark Hero Section for Header Visibility */}
            <div className="bg-background-dark min-h-[400px] md:min-h-[500px] flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                        Spa Policies & Terms of Service
                    </h1>
                    <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-8"></div>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                        These policies are designed to ensure a safe, professional, relaxing, and respectful experience for all clients and staff. By booking a service, you agree to the following terms.
                    </p>
                </div>
            </div>

            {/* Main Content Card - overlapping the hero slightly */}
            <div className="flex-grow px-4 sm:px-6 lg:px-8 pb-20">
                <div className="container mx-auto max-w-4xl relative z-10 -mt-12">
                    <div className="space-y-12 bg-card-light dark:bg-card-dark p-8 md:p-12 rounded-2xl shadow-xl border border-border-light dark:border-border-dark">

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Appointments & Reservations
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>All massage and spa services are available <strong>by appointment only</strong>. Walk-ins may be accommodated based on availability.</li>
                                <li>We strongly recommend booking online in advance to secure your preferred date, time, and therapist.</li>
                                <li>Bookings for couples massage can't be done online at this time and must be done over the phone.</li>
                                <li>A <strong>credit card or deposit</strong> may be required to guarantee your reservation.</li>
                                <li>Online booking requests are subject to confirmation. In some cases, appointment times may be adjusted to ensure proper scheduling flow.</li>
                            </ul>
                        </section>

                        {/* <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Deposits
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Certain services and promotions may require a <strong>deposit per person</strong> at the time of booking.</li>
                                <li>Deposits are <strong>non-refundable</strong> but may be transferred to a future appointment if rescheduled within the required notice period.</li>
                                <li>For services requiring special preparation (e.g., body scrubs, herbal ball treatments), deposits help cover preparation costs.</li>
                                <li>Failure to provide a deposit may result in refusal of reservation.</li>
                            </ul>
                        </section> */}

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Cancellation, Rescheduling & No-Show Policy
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>A minimum of <strong>24 hours’ notice</strong> is required to cancel or reschedule an appointment.</li>
                                <li><strong>No-shows</strong> (missed appointments without notice) may result in a <strong>non-refundable deposit</strong> being charged to secure future bookings or being blocked from future bookings entirely.</li>
                                <li>Repeated last-minute cancellations or rescheduling may require future bookings to be secured with a <strong>non-refundable deposit</strong>.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Arrival & Late Arrival Policy
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Please arrive <strong>10 minutes early</strong> to allow time for intake forms, and preparation.</li>
                                <li>Late arrivals may result in a <strong>shortened session</strong> to avoid delaying other clients.</li> For example, if an appointment is scheduled for 60 minutes and the client arrives 15 minutes late, the session will be shortened to 45 minutes.
                                <li>Clients arriving more than <strong>15 minutes late</strong> may forfeit the appointment and be charged accordingly.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Session Duration
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Arriving late or requesting early termination does not change the service fee.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Health, Medical Conditions & Pregnancy
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Clients must disclose <strong>all medical conditions, injuries, allergies, sensitivities, or medications</strong> prior to treatment.</li>
                                <li>Clients with contagious illnesses or skin conditions may be rescheduled.</li>
                                <li><strong>Prenatal massage</strong> is not offered prior to <strong>16 weeks of pregnancy</strong>.</li>
                                <li>Pregnancy must be disclosed at the time of booking. Failure to do so may result in refusal of service without refund.</li>
                                <li>Clients undergoing chemotherapy, radiation, or other medical treatments may be required to provide <strong>written physician approval</strong>.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Informed Consent & Scope of Practice
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Clients are required to complete a health intake and consent form prior to initial service.</li>
                                <li>Massage therapy is not a substitute for medical diagnosis or treatment.</li>
                                <li>Therapists do not diagnose or prescribe medical treatments and may refer clients to licensed medical professionals when appropriate.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Client Comfort & Preferences
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Clients are encouraged to communicate preferences regarding pressure, temperature, music volume, and focus areas.</li>
                                <li>Clients may refuse any technique or request modifications at any time.</li>
                                <li>Clients may stop the session at any time.</li>
                                <li>Clients will be properly draped at all times; only the area being worked on will be uncovered.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Professional Boundaries & Conduct
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>This is a professional, therapeutic environment.</li>
                                <li><strong>Sexual behavior, inappropriate comments, requests, or gestures are strictly prohibited</strong>.</li>
                                <li>Inappropriate behavior will result in <strong>immediate termination of the session</strong>, full service charge, and possible permanent ban.</li>
                                <li>Law enforcement may be contacted if necessary.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Nudeness Policy
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Clients must remain properly clothed at all times.</li>
                                <li>Underwear is the minimum required attire for all massage sessions.</li>
                                <li>Any nudity may result in immediate termination of service without refund.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Right to Refuse Service
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>We reserve the right to refuse or discontinue service to anyone who:
                                    <ul className="list-circle pl-5 mt-2 space-y-1">
                                        <li>Behaves inappropriately or abusively</li>
                                        <li>Appears intoxicated</li>
                                        <li>Has a health condition that may contraindicate massage</li>
                                        <li>Makes staff feel unsafe or uncomfortable</li>
                                    </ul>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Abuse & Zero-Tolerance Policy
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>We maintain a <strong>zero-tolerance policy</strong> for abuse or harassment of any kind.</li>
                                <li>Any inappropriate touching, sexual requests, abusive language, or threatening behavior will not be tolerated.</li>
                                <li>Violations may result in immediate termination of service, permanent banning, and reporting to authorities.</li>
                                <li>All staff are professionally licensed and trained in abuse prevention.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Hygiene & Facility Standards
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Clients are expected to maintain reasonable personal hygiene.</li>
                                <li>Our facility adheres to strict sanitation and hygiene standards.</li>
                                <li>Equipment, linens, and treatment rooms are cleaned and sanitized between clients.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Minors
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Clients under the age of <strong>18</strong> must be accompanied by a parent or legal guardian.</li>
                                <li>Written consent may be required.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Payment & Gratuity
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Payment is due at the time of service or booking, depending on the service.</li>
                                <li>We accept major credit cards, cash, and gift cards.  JJ Thai Spa Gift cards are available in store or online.</li>
                                <li>Paper gift certificates are no longer available.  We will continue to accept gift certificates issues after January 1st, 2023</li>
                                <li>Prices do not include gratuity. Tips are appreciated but never required.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Refund Policy
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>No refunds are issued for completed or partially completed services.</li>
                                <li>Clients may terminate a session within the first <strong>15 minutes</strong> to receive a full refund.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Gift Cards
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Gift cards are non-refundable and cannot be redeemed for cash.</li>
                                <li>Gift cards balance can be used for any service at JJ Thai Spa, but cannot be used for gratuity.</li>
                                <li>Lost or stolen gift cards are not guaranteed to be replaced.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Personal Belongings
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Clients are responsible for their personal items.</li>
                                <li>We are not responsible for lost or stolen belongings.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Privacy & Confidentiality
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>All client information is kept confidential.</li>
                                <li>Client information will not be shared without consent, except as required by law.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Feedback
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>We welcome and appreciate client feedback to help improve our services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
                                Policy Changes
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                                <li>Policies are subject to change without notice.</li>
                                <li>The most current version will always be available on our website.</li>
                            </ul>
                        </section>

                        <div className="mt-12 pt-8 border-t border-border-light dark:border-border-dark text-center">
                            <p className="font-serif text-lg text-primary font-medium italic">
                                By booking an appointment, you acknowledge that you have read, understand, and agree to these policies.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Policies;
