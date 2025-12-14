import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-medium">Back to Home</span>
          </a>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark mb-4">
            Privacy Policy
          </h1>
          <p className="text-text-light/70 dark:text-text-dark/70">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Introduction
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed mb-4">
              J.J Thai Spa ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed">
              Please read this privacy policy carefully. By using our website or services, you consent to the practices described in this policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Information We Collect
            </h2>

            <h3 className="font-semibold text-lg text-text-light dark:text-text-dark mb-3 mt-6">
              Personal Information
            </h3>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed mb-4">
              When you book an appointment or contact us, we may collect:
            </p>
            <ul className="list-disc list-inside text-text-light/80 dark:text-text-dark/80 space-y-2 mb-4">
              <li>Name and contact information (email, phone number)</li>
              <li>Appointment preferences and history</li>
              <li>Payment information (processed securely through Square)</li>
              <li>Health information relevant to your spa treatments</li>
            </ul>

            <h3 className="font-semibold text-lg text-text-light dark:text-text-dark mb-3 mt-6">
              Automatically Collected Information
            </h3>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed mb-4">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside text-text-light/80 dark:text-text-dark/80 space-y-2">
              <li>Device and browser information</li>
              <li>IP address and approximate location</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website or source</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              How We Use Cookies
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience. Our cookies fall into three categories:
            </p>

            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 mb-4 border border-border-light dark:border-border-dark">
              <h4 className="font-semibold text-text-light dark:text-text-dark mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lock</span>
                Essential Cookies
              </h4>
              <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                Required for basic website functionality. These cannot be disabled and include session management and security features.
              </p>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 mb-4 border border-border-light dark:border-border-dark">
              <h4 className="font-semibold text-text-light dark:text-text-dark mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Analytics Cookies
              </h4>
              <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                Help us understand how visitors use our website through anonymous data collection. We use Google Analytics to analyze traffic patterns and improve our services.
              </p>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              <h4 className="font-semibold text-text-light dark:text-text-dark mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">campaign</span>
                Marketing Cookies
              </h4>
              <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                Used to deliver relevant advertisements and measure campaign effectiveness. These cookies may track your browsing activity across different websites.
              </p>
            </div>

            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed mt-4">
              You can manage your cookie preferences at any time by clicking the "Cookie Settings" link in our website footer.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              How We Use Your Information
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-text-light/80 dark:text-text-dark/80 space-y-2">
              <li>Process and manage your appointments</li>
              <li>Send appointment confirmations and reminders</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Information Sharing
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-text-light/80 dark:text-text-dark/80 space-y-2">
              <li><strong>Service Providers:</strong> Third parties who help us operate our business (e.g., Square for payments, Google for analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Your Rights
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside text-text-light/80 dark:text-text-dark/80 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed mt-4">
              To exercise these rights, please contact us using the information below.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Data Security
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Contact Us
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our practices, please contact us:
            </p>
            <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
              <p className="text-text-light dark:text-text-dark font-semibold mb-2">J.J Thai Spa</p>
              <p className="text-text-light/70 dark:text-text-dark/70 text-sm">
                180 Winter St. Unit D<br />
                Bridgewater, MA 02324<br />
                Phone: (508) 807-0141<br />
                Email: contact@jjthaispa.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-text-light dark:text-text-dark mb-4">
              Changes to This Policy
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

