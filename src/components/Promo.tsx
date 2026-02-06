import React, { useEffect, useState } from 'react';

// Helper Interface
interface Promotion {
    id: string;
    label?: string;
    startDate: string;
    endDate: string;
}

// Helper to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

interface PromoContentProps {
    endDate: string;
}

// --- Holiday Promo Content ---
const HolidayPromoContent: React.FC<PromoContentProps> = ({ endDate }) => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-0 md:p-0">
            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .print-bg-promo { background-color: #788E6E !important; color: white !important; }
        }
      `}} />
            <div className="w-full bg-white shadow-none flex flex-col md:flex-row">
                {/* Left Side: Image */}
                <div className="flex-1 min-h-[400px] md:min-h-[700px] relative overflow-hidden">
                    <img
                        src="/promos/holiday_promo.webp"
                        alt="Holiday Relaxation"
                        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                    />
                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex flex-col items-center pt-12 md:pt-16 p-6 z-10 text-center">
                        {/* Tagline */}
                        <span className="text-[#788E6E] font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-4 block drop-shadow-sm">
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
                                            <span className="text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-1 opacity-90 text-center leading-tight">
                                                Holiday Savings
                                            </span>
                                            <div className="flex items-start">
                                                <span className="text-xl md:text-2xl font-serif mt-1 mr-0.5 opacity-90">$</span>
                                                <span className="text-4xl md:text-5xl font-serif font-bold italic tracking-tighter">{promo.amount} OFF</span>
                                            </div>
                                            <div className="text-sm md:text-base font-medium opacity-80 mt-3 uppercase tracking-[0.1em] text-center">
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
                                            <span className="text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-1 opacity-90 text-center leading-tight">
                                                Holiday Savings
                                            </span>
                                            <div className="flex items-start">
                                                <span className="text-xl md:text-2xl font-serif mt-1 mr-0.5 opacity-90">$</span>
                                                <span className="text-4xl md:text-5xl font-serif font-bold italic tracking-tighter">{promo.amount} OFF</span>
                                            </div>
                                            <div className="text-sm md:text-base font-medium opacity-80 mt-3 uppercase tracking-[0.1em] text-center">
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
                        <p className="text-sm md:text-base text-gray-400 italic mt-12 leading-relaxed max-w-[360px]">
                            *Offer valid through {formatDate(endDate)}. Cannot be combined. Discount applied at checkout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Release Promo Content ---
const ReleasePromoContent: React.FC<PromoContentProps> = ({ endDate }) => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-0 md:p-0">
            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .print-bg-promo { background-color: #788E6E !important; color: white !important; }
        }
      `}} />
            <div className="w-full bg-white shadow-none flex flex-col md:flex-row">
                {/* Left Side: Image */}
                <div className="flex-1 min-h-[400px] md:min-h-[700px] relative overflow-hidden">
                    <img
                        src="/promos/release_promo.webp"
                        alt="Relaxation"
                        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                    />
                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex flex-col items-center pt-12 md:pt-16 p-6 z-10 text-center">
                        {/* Tagline */}
                        <span className="text-[#788E6E] font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-4 block drop-shadow-sm">
                            Limited Time Offer
                        </span>

                        {/* Main Heading */}
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl leading-[1.1] font-bold text-[#1a231f] mb-2 tracking-tight drop-shadow-md">
                            Back, Neck & Shoulder<br />Release Special
                        </h1>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 p-10 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="max-w-md mx-auto md:mx-0">
                        {/* Subheading */}
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl text-[#1a231f]/80 font-light">
                                New Service Offer
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
                                    { amount: '5', label: '30 Minute' },
                                    { amount: '10', label: '45 Minute' }
                                ].map((promo, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="bg-[#788E6E] text-white p-6 rounded-[2rem] shadow-lg flex flex-col items-center justify-center border border-white/10 print-bg-promo">
                                            <span className="text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-1 opacity-90 text-center leading-tight">
                                                Release Savings
                                            </span>
                                            <div className="flex items-start">
                                                <span className="text-xl md:text-2xl font-serif mt-1 mr-0.5 opacity-90">$</span>
                                                <span className="text-4xl md:text-5xl font-serif font-bold italic tracking-tighter">{promo.amount} OFF</span>
                                            </div>
                                            <div className="text-sm md:text-base font-medium opacity-80 mt-3 uppercase tracking-[0.1em] text-center">
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
                        <p className="text-sm md:text-base text-gray-400 italic mt-12 leading-relaxed max-w-[360px]">
                            *Offer valid through {formatDate(endDate)}. Cannot be combined. Discount applied at checkout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Valentine's Promo Content ---
const ValentinesPromoContent: React.FC<PromoContentProps> = ({ endDate }) => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-0 md:p-0">
            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .print-bg-promo { background-color: #C85A5A !important; color: white !important; }
        }
      `}} />
            <div className="w-full bg-white shadow-none flex flex-col md:flex-row">
                {/* Left Side: Image */}
                <div className="flex-1 min-h-[400px] md:min-h-[700px] relative overflow-hidden">
                    <img
                        src="/promos/valentines_promo.webp"
                        alt="Valentine's Day Special"
                        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
                    />
                    {/* Overlay Content */}
                    <div className="absolute inset-0 flex flex-col items-center pt-12 md:pt-16 p-6 z-10 text-center">
                        {/* Tagline */}
                        <span className="text-[#C85A5A] font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-4 block drop-shadow-sm bg-white/80 px-4 py-1 rounded-full">
                            Limited Time Offer
                        </span>

                        {/* Main Heading */}
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-[86px] leading-[0.95] font-bold text-white mb-2 tracking-tight drop-shadow-md">
                            Valentine's<br />Day<br />Special
                        </h1>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 p-10 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="max-w-md mx-auto md:mx-0">
                        {/* Subheading */}
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1a231f]/80 font-light">
                                Share the Love
                            </h2>
                            <img src="/logo-gold.svg" alt="Logo" className="h-20 md:h-32 w-auto object-contain shrink-0" />
                        </div>

                        {/* Body Text */}
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
                            Reconnect. Relax. Renew.
                        </p>

                        {/* Promotional Badges Grid */}
                        <div className="flex flex-col gap-6 max-w-lg">
                            {/* Individual Savings Row */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { amount: '5', label: '60 or 75 Minute' },
                                    { amount: '10', label: '90 Minute' }
                                ].map((promo, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="bg-[#C85A5A] text-white p-6 rounded-[2rem] shadow-lg flex flex-col items-center justify-center border border-white/10 print-bg-promo">
                                            <span className="text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-1 opacity-90 text-center leading-tight">
                                                Valentine's
                                            </span>
                                            <div className="flex items-start">
                                                <span className="text-xl md:text-2xl font-serif mt-1 mr-0.5 opacity-90">$</span>
                                                <span className="text-4xl md:text-5xl font-serif font-bold italic tracking-tighter">{promo.amount} OFF</span>
                                            </div>
                                            <div className="text-sm md:text-base font-medium opacity-80 mt-3 uppercase tracking-[0.1em] text-center">
                                                {promo.label}
                                            </div>
                                        </div>
                                        {/* Subtle glow effect behind each badge */}
                                        <div className="absolute inset-0 bg-[#C85A5A] blur-2xl opacity-10 -z-10 rounded-full scale-110 group-hover:opacity-20 transition-opacity"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Couples Savings Label */}
                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-[#C85A5A]/20 flex-grow"></div>
                                <span className="text-[#C85A5A] font-serif italic text-xl md:text-3xl whitespace-nowrap">Couples Savings</span>
                                <div className="h-px bg-[#C85A5A]/20 flex-grow"></div>
                            </div>

                            {/* Couples Savings Row */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { amount: '15', label: '60 Min Couples' },
                                    { amount: '25', label: '90 Min Couples' }
                                ].map((promo, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="bg-[#C85A5A] text-white p-6 rounded-[2rem] shadow-lg flex flex-col items-center justify-center border border-white/10 print-bg-promo">
                                            <span className="text-xs md:text-sm font-bold tracking-[0.15em] uppercase mb-1 opacity-90 text-center leading-tight">
                                                Valentine's
                                            </span>
                                            <div className="flex items-start">
                                                <span className="text-xl md:text-2xl font-serif mt-1 mr-0.5 opacity-90">$</span>
                                                <span className="text-4xl md:text-5xl font-serif font-bold italic tracking-tighter">{promo.amount} OFF</span>
                                            </div>
                                            <div className="text-sm md:text-base font-medium opacity-80 mt-3 uppercase tracking-[0.1em] text-center">
                                                {promo.label}
                                            </div>
                                        </div>
                                        {/* Subtle glow effect behind each badge */}
                                        <div className="absolute inset-0 bg-[#C85A5A] blur-2xl opacity-10 -z-10 rounded-full scale-110 group-hover:opacity-20 transition-opacity"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-sm md:text-base text-gray-400 italic mt-12 leading-relaxed max-w-[360px]">
                            *Offer valid through {formatDate(endDate)}. Cannot be combined. Discount applied at checkout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Promo: React.FC = () => {
    const [activePromo, setActivePromo] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await fetch('/api/promotions');
                if (!response.ok) throw new Error('Failed to fetch promotions');

                const data = await response.json();
                const promotions = data.promotions || {};

                // Priority list: check for these IDs in order
                const priorityOrder = ['valentines-promo', 'holiday-promo', 'release-promo'];

                // Pick the highest priority valid promo
                let selectedPromo: Promotion | null = null;
                for (const pid of priorityOrder) {
                    if (promotions[pid]) {
                        selectedPromo = promotions[pid];
                        break;
                    }
                }

                // If no priority match, take any available promo
                if (!selectedPromo) {
                    const promoIds = Object.keys(promotions);
                    if (promoIds.length > 0) {
                        selectedPromo = promotions[promoIds[0]];
                    }
                }

                setActivePromo(selectedPromo);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#788E6E]"></div></div>;
    }

    if (activePromo?.id === 'holiday-promo') {
        return <HolidayPromoContent endDate={activePromo.endDate} />;
    }

    if (activePromo?.id === 'valentines-promo') {
        return <ValentinesPromoContent endDate={activePromo.endDate} />;
    }

    if (activePromo?.id === 'release-promo') {
        return <ReleasePromoContent endDate={activePromo.endDate} />;
    }

    // Fallback if no promo is active
    return (
        <div className="min-h-screen flex items-center justify-center bg-white flex-col gap-4">
            <h1 className="font-serif text-3xl text-[#1a231f]">No Current Promotion</h1>
            <p className="text-gray-500">Please check back later for our special offers.</p>
            <a href="/" className="text-[#788E6E] underline hover:text-[#5a6b52]">Return Home</a>
        </div>
    );
};

export default Promo;
