import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminBooking() {
    const { user, signOut } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    // Load Square Appointments widget script
    useEffect(() => {
        // Prevent double-loading in React strict mode
        if (scriptLoadedRef.current) return;
        scriptLoadedRef.current = true;

        // Create and inject the Square widget script
        const script = document.createElement('script');
        script.src = 'https://square.site/appointments/buyer/widget/kpgr4fsgm3uhjs/LXYE9K8E6NDSH.js';
        script.async = true;

        // Append to the container so the widget renders there
        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        return () => {
            // Cleanup on unmount
            scriptLoadedRef.current = false;
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100">
            {/* Header */}
            <header className="flex-shrink-0 bg-white shadow-sm border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-xl text-stone-800">J.J Thai Spa</h1>
                        <p className="text-stone-500 text-xs">Dev Booking</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="/admin"
                            onClick={(e) => {
                                e.preventDefault();
                                window.history.pushState({}, '', '/admin');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }}
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            ← Back to Admin
                        </a>
                        <div className="text-right">
                            <p className="text-sm font-medium text-stone-700">{user?.displayName}</p>
                            <p className="text-xs text-stone-500">{user?.email}</p>
                        </div>
                        {user?.photoURL && (
                            <img
                                src={user.photoURL}
                                alt={user.displayName || 'User'}
                                className="w-8 h-8 rounded-full border-2 border-stone-200"
                            />
                        )}
                        <button
                            onClick={signOut}
                            className="text-sm text-stone-500 hover:text-stone-700 underline"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            {/* Square Appointments Widget Container - fills remaining space */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto"
                style={{ minHeight: 0 }}
            >
                {/* Square widget script will be injected here and render the booking interface */}
            </div>
        </div>
    );
}
