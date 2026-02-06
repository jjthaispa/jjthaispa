import React, { useEffect, useState } from 'react';
import { useServices } from '../context/ServiceContext';

interface PromoData {
    title: string;
    dateLabel: string;
}

const PriceList: React.FC = () => {
    const { services } = useServices();
    const [promoData, setPromoData] = useState<PromoData>({ title: '', dateLabel: '' });

    // Fetch active promotion data
    useEffect(() => {
        const fetchPromoData = async () => {
            try {
                const response = await fetch('/api/promotions');
                if (response.ok) {
                    const data = await response.json();
                    const promoIds = data.activePromoIds || [];
                    if (promoIds.length > 0 && data.promotions[promoIds[0]]) {
                        const promo = data.promotions[promoIds[0]];
                        setPromoData({
                            title: promo.title || '',
                            dateLabel: promo.dateLabel || ''
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching promotion data:', error);
            }
        };
        fetchPromoData();
    }, []);

    // Add specific print styles dynamically
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
            
            @media print {
                @page {
                    margin: 1.5cm;
                }
                body {
                    background: #F0EDE9 !important;
                    -webkit-print-color-adjust: exact;
                }
                /* Hide any potential header/footer from the main app structure if they leak in */
                header, footer, .cookie-banner {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Filter services to show (exclude add-ons or show distinctly if needed)
    // For this design, we'll include everything but handle layout gracefully
    const mainServices = services.filter(s => !s.isAddOn);

    // Split into two columns for the print layout
    const midPoint = Math.ceil(mainServices.length / 2);
    const col1 = mainServices.slice(0, midPoint);
    const col2 = mainServices.slice(midPoint);

    return (
        <div className="min-h-screen bg-[#F0EDE9] text-[#1a231f] font-sans px-8 py-16 md:px-24 md:py-24 print:p-12 relative">
            <div className="max-w-5xl mx-auto">
                {/* Header / Branding */}
                <div className="mb-8 print:mb-4 pb-4 flex justify-between items-end">
                    <div className="text-left">
                        <div className="flex items-center gap-6 mb-3">
                            <img src="/logo-gold.svg" alt="Logo" className="h-16 w-auto object-contain" />
                            <h1 className="font-serif text-5xl font-bold text-[#1a231f]">
                                J<span style={{ position: 'relative', top: '-0.15em' }}>.</span>J Thai Spa
                            </h1>
                        </div>
                        <p className="text-[#788E6E] font-serif italic text-xl tracking-wide">
                            Experience the Art of Thai Massage
                        </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[#C85A5A] text-xs uppercase font-bold tracking-[0.2em]">
                                Limited Time
                            </span>
                            <span className="bg-[#C85A5A] text-white text-xs uppercase font-bold px-4 py-1.5 rounded-full tracking-[0.2em] shadow-sm">
                                Promotion
                            </span>
                        </div>
                        <p className="text-[#1a231f] font-serif uppercase tracking-[0.2em] text-2xl font-bold mb-1">
                            {promoData.title ? `${promoData.title} Price List` : 'Price List'}
                        </p>
                        <p className="text-[#C85A5A] font-serif italic text-lg">
                            {promoData.dateLabel}
                        </p>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                    {/* Top Green Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-[#788E6E]"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10">
                        {/* Column 1 */}
                        <div className="space-y-10">
                            {col1.map((service, idx) => (
                                <div key={idx} className="break-inside-avoid">
                                    <div className="flex items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            {service.title === 'Prenatal Massage' ? (
                                                <img src="/therapies/prenatal_icon.svg" alt="Prenatal Icon" className="w-8 h-8 object-contain" />
                                            ) : service.title === 'Thai Combination Massage' ? (
                                                <img src="/therapies/combination_icon.svg" alt="Combination Icon" className="w-8 h-8 object-contain" />
                                            ) : service.title === 'Swedish Massage' ? (
                                                <img src="/therapies/swedish_icon.svg" alt="Swedish Icon" className="w-8 h-8 object-contain" />
                                            ) : service.title === 'Thai Deep Tissue' ? (
                                                <img src="/therapies/deeptissue_icon2.svg" alt="Deep Tissue Icon" className="w-8 h-8 object-contain" />
                                            ) : service.title === 'Couples Massage' ? (
                                                <img src="/therapies/couples_icon.svg" alt="Couples Icon" className="w-8 h-8 object-contain" />
                                            ) : service.title.includes('Shoulder') ? (
                                                <img src="/therapies/shoulder_icon.svg" alt="Shoulder Icon" className="w-8 h-8 object-contain" />
                                            ) : (
                                                <span className={`material-symbols-outlined text-[#788E6E] text-2xl`}>spa</span>
                                            )}
                                            <h3 className="font-serif text-3xl font-bold text-[#1a231f]">
                                                {service.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Pricing List */}
                                    <div className="space-y-1.5">
                                        {service.prices.map((p, pIdx) => (
                                            <div key={pIdx} className="flex items-end justify-between border-b border-dotted border-gray-200 pb-1">
                                                <span className="text-lg font-medium text-gray-800">{p.durationServices}</span>
                                                <span className="flex items-center gap-2">
                                                    {p.promoPrice ? (
                                                        <>
                                                            <span className="text-gray-400 line-through decoration-[#C85A5A] text-base font-normal">${p.price}</span>
                                                            <span className="text-xl font-bold text-[#556B4E]">
                                                                ${p.promoPrice}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xl font-bold text-[#1a231f]">
                                                            ${p.price}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-10">
                            {col2.map((service, idx) => (
                                <div key={idx} className={`break-inside-avoid ${service.title.includes('Couples') ? 'bg-[#F0EDE9] -mx-6 px-8 py-8 rounded-2xl print:bg-[#F0EDE9] shadow-inner' : ''}`}>
                                    <div className="flex items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            {service.title === 'Prenatal Massage' ? (
                                                <img src="/therapies/prenatal_icon.svg" alt="Prenatal Icon" className="w-8 h-8 object-contain" />
                                            ) : service.title === 'Thai Combination Massage' ? (
                                                <img src="/therapies/combination_icon.svg" alt="Combination Icon" className="w-8 h-8 object-contain" />
                                            ) : service.title === 'Swedish Massage' ? (
                                                <img src="/therapies/swedish_icon.svg" alt="Swedish Icon" className="w-8 h-8 object-contain" />
                                            ) : service.title === 'Thai Deep Tissue' ? (
                                                <img src="/therapies/deeptissue_icon2.svg" alt="Deep Tissue Icon" className="w-8 h-8 object-contain" />
                                            ) : service.title === 'Couples Massage' ? (
                                                <img src="/therapies/couples_icon.svg" alt="Couples Icon" className="w-8 h-8 object-contain" />
                                            ) : service.title.includes('Shoulder') ? (
                                                <img src="/therapies/shoulder_icon.svg" alt="Shoulder Icon" className="w-8 h-8 object-contain" />
                                            ) : (
                                                <span className={`material-symbols-outlined text-[#788E6E] text-2xl`}>
                                                    {service.title.includes('Couples') ? 'favorite' : 'spa'}
                                                </span>
                                            )}
                                            <h3 className="font-serif text-3xl font-bold text-[#1a231f]">
                                                {service.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Detailed Couples Pricing */}
                                    <div className="space-y-2">
                                        {service.title.includes('Couples') ? (
                                            <>
                                                <div>
                                                    <h4 className="font-bold text-xl text-[#1a231f] mb-1">Swedish</h4>
                                                    {service.prices.filter(p => p.durationServices.includes('Swedish')).map((p, pIdx) => (
                                                        <div key={pIdx} className="flex items-end justify-between border-b border-dotted border-gray-200 pb-1">
                                                            <span className="text-lg font-medium text-gray-800">{p.durationServices.replace(' Swedish', '')}</span>
                                                            <span className="flex items-center gap-2">
                                                                {p.promoPrice ? (
                                                                    <>
                                                                        <span className="text-gray-400 line-through decoration-[#C85A5A] text-base font-normal">${p.price}</span>
                                                                        <span className="text-xl font-bold text-[#556B4E]">
                                                                            ${p.promoPrice}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-xl font-bold text-[#1a231f]">
                                                                        ${p.price}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xl text-[#1a231f] mb-1 mt-3">Thai Combination</h4>
                                                    {service.prices.filter(p => p.durationServices.includes('Combination')).map((p, pIdx) => (
                                                        <div key={pIdx} className="flex items-end justify-between border-b border-dotted border-gray-200 pb-1">
                                                            <span className="text-lg font-medium text-gray-800">{p.durationServices.replace(' Thai Combination', '')}</span>
                                                            <span className="flex items-center gap-2">
                                                                {p.promoPrice ? (
                                                                    <>
                                                                        <span className="text-gray-400 line-through decoration-[#C85A5A] text-base font-normal">${p.price}</span>
                                                                        <span className="text-xl font-bold text-[#556B4E]">
                                                                            ${p.promoPrice}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-xl font-bold text-[#1a231f]">
                                                                        ${p.price}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xl text-[#1a231f] mb-1 mt-3">Thai Deep Tissue</h4>
                                                    {service.prices.filter(p => p.durationServices.includes('Deep Tissue')).map((p, pIdx) => (
                                                        <div key={pIdx} className="flex items-end justify-between border-b border-dotted border-gray-200 pb-1">
                                                            <span className="text-lg font-medium text-gray-800">{p.durationServices.replace(' Thai Deep Tissue', '')}</span>
                                                            <span className="flex items-center gap-2">
                                                                {p.promoPrice ? (
                                                                    <>
                                                                        <span className="text-gray-400 line-through decoration-[#C85A5A] text-base font-normal">${p.price}</span>
                                                                        <span className="text-xl font-bold text-[#556B4E]">
                                                                            ${p.promoPrice}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-xl font-bold text-[#1a231f]">
                                                                        ${p.price}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            service.prices.map((p, pIdx) => (
                                                <div key={pIdx} className="flex items-end justify-between border-b border-dotted border-gray-200 pb-1">
                                                    <span className="text-lg font-medium text-gray-800">{p.durationServices}</span>
                                                    <span className="flex items-center gap-2">
                                                        {p.promoPrice ? (
                                                            <>
                                                                <span className="text-gray-400 line-through decoration-[#C85A5A] text-base font-normal">${p.price}</span>
                                                                <span className="text-xl font-bold text-[#556B4E]">
                                                                    ${p.promoPrice}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xl font-bold text-[#1a231f]">
                                                                ${p.price}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceList;
