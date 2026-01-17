import React, { useState, useEffect } from 'react';

interface HolidayPopupProps {
    previewMode?: boolean;
    previewDate?: Date;
    forceOpen?: boolean;
}

interface HolidayInfo {
    title: string;
    timeText: string;
    highlightedTime: string;
    holidayName: string;
    dateDisplay: string;
    isToday: boolean;
}

const HolidayPopup: React.FC<HolidayPopupProps> = ({ previewMode, previewDate, forceOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [holidayInfo, setHolidayInfo] = useState<HolidayInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Reset state on each run to ensure fresh data
        setHolidayInfo(null);
        setIsOpen(false);
        setLoading(true);

        const checkHoliday = async () => {
            try {
                // Build URL with optional date parameter for preview mode
                let url = '/api/holidays';
                if (previewMode && previewDate) {
                    const yyyy = previewDate.getFullYear();
                    const mm = String(previewDate.getMonth() + 1).padStart(2, '0');
                    const dd = String(previewDate.getDate()).padStart(2, '0');
                    url = `/api/holidays?date=${yyyy}-${mm}-${dd}`;
                }

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch holiday data');
                }

                const data = await response.json();

                if (data.hasHoliday && data.holidayInfo) {
                    setHolidayInfo(data.holidayInfo);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Error checking holiday popup:", error);
            } finally {
                setLoading(false);
            }
        };

        checkHoliday();
    }, [previewMode, previewDate, forceOpen]);

    // Session storage to not show popup repeatedly
    useEffect(() => {
        if (!isOpen || previewMode) return;

        const seenKey = `seen_holiday_popup_${new Date().toDateString()}`;
        if (sessionStorage.getItem(seenKey)) {
            setIsOpen(false);
        }
    }, [isOpen, previewMode]);

    const handleClose = () => {
        setIsOpen(false);
        if (!previewMode) {
            const seenKey = `seen_holiday_popup_${new Date().toDateString()}`;
            sessionStorage.setItem(seenKey, 'true');
        }
    };

    if (loading && forceOpen) return <div className="flex items-center justify-center p-8 text-stone-500">Loading preview...</div>;
    if (!isOpen && !forceOpen) return null;
    if (!isOpen && forceOpen && !loading) return <div className="p-4 text-center text-stone-500">No holiday popup would trigger for this date.</div>;

    // Always use fixed positioning so the modal covers the entire viewport
    // This provides an accurate preview of how it will appear on the main page
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in cursor-pointer"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-[2rem] max-w-md w-full p-8 relative shadow-2xl animate-scale-in mx-4 cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="flex flex-col items-center text-center">
                    {/* Icon Circle */}
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>

                    {/* Kicker */}
                    <span className="text-xs font-bold tracking-[0.2em] text-amber-600 uppercase mb-3">Holiday Annoucement</span>

                    {/* Title */}
                    <h2 className="font-serif text-2xl text-stone-900 mb-6">{holidayInfo?.title || 'Holiday Hours'}</h2>

                    {/* Info Box */}
                    <div className="bg-stone-50 rounded-xl px-6 py-4 mb-6 w-full">
                        <p className="text-stone-700 text-lg mb-1">
                            {holidayInfo?.timeText} <span className="text-amber-600 font-semibold">{holidayInfo?.highlightedTime}</span>
                        </p>
                        <p className="text-stone-500 text-sm">
                            {holidayInfo?.dateDisplay} {holidayInfo?.holidayName}
                        </p>
                    </div>

                    {/* Message */}
                    <p className="text-stone-600 leading-relaxed text-sm mb-6">
                        Our therapists are taking a short break to celebrate with friends and family. We appreciate your understanding.
                    </p>

                    {/* Action Button */}
                    <button
                        onClick={handleClose}
                        className="bg-emerald-800 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-900 transition-all transform hover:scale-105 shadow-lg shadow-emerald-900/20"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HolidayPopup;
