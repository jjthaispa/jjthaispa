import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { SERVICES } from '../servicesData';

// Create a lookup map for service titles from static data
const SERVICE_TITLES: Record<string, string> = {};
SERVICES.forEach(s => {
    SERVICE_TITLES[s.id] = s.title;
});

interface Price {
    id: string;
    duration: number;
    durationServices: string;
    durationMain?: string;
    price: number;
}

interface Service {
    id: string;
    title: string;
    prices: Price[];
}

interface Promotion {
    id: string;
    label: string;
    enabled: boolean;
    startDate: string;
    endDate: string;
    discounts: Record<string, Record<string, number>>;
}

type TabType = 'promotions' | 'services';

export default function AdminPage() {
    const { user, loading, isAuthorized, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('promotions');

    // Services state
    const [services, setServices] = useState<Service[]>([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [savingServices, setSavingServices] = useState(false);
    const [servicesSaveMessage, setServicesSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [editedPrices, setEditedPrices] = useState<Record<string, Record<string, number>>>({});

    // Promotions state
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loadingPromos, setLoadingPromos] = useState(false);
    const [savingPromos, setSavingPromos] = useState(false);
    const [promoSaveMessage, setPromoSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [editedPromos, setEditedPromos] = useState<Record<string, Promotion>>({});
    const [expandedPromos, setExpandedPromos] = useState<Set<string>>(new Set());

    // Fetch data based on active tab
    useEffect(() => {
        if (!isAuthorized) return;
        if (activeTab === 'services') {
            fetchServices();
        } else if (activeTab === 'promotions') {
            fetchPromotions();
        }
    }, [activeTab, isAuthorized]);

    // Fetch services
    const fetchServices = async () => {
        setLoadingServices(true);
        try {
            const servicesSnap = await getDocs(collection(db, 'services'));
            const servicesData = servicesSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Service[];
            servicesData.sort((a, b) => (SERVICE_TITLES[a.id] || a.id).localeCompare(SERVICE_TITLES[b.id] || b.id));
            setServices(servicesData);

            const initialPrices: Record<string, Record<string, number>> = {};
            servicesData.forEach(service => {
                initialPrices[service.id] = {};
                (service.prices || []).forEach(price => {
                    initialPrices[service.id][price.id] = price.price;
                });
            });
            setEditedPrices(initialPrices);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoadingServices(false);
        }
    };

    // Fetch promotions
    const fetchPromotions = async () => {
        setLoadingPromos(true);
        try {
            const promosSnap = await getDocs(collection(db, 'promotions'));
            const promosData = promosSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Promotion[];
            setPromotions(promosData);

            const initialPromos: Record<string, Promotion> = {};
            promosData.forEach(promo => {
                initialPromos[promo.id] = { ...promo };
            });
            setEditedPromos(initialPromos);

            // Also fetch services for discount editing
            if (services.length === 0) {
                const servicesSnap = await getDocs(collection(db, 'services'));
                const servicesData = servicesSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Service[];
                servicesData.sort((a, b) => (SERVICE_TITLES[a.id] || a.id).localeCompare(SERVICE_TITLES[b.id] || b.id));
                setServices(servicesData);
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setLoadingPromos(false);
        }
    };

    // Services handlers
    const handlePriceChange = (serviceId: string, priceId: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setEditedPrices(prev => ({
            ...prev,
            [serviceId]: { ...prev[serviceId], [priceId]: numValue }
        }));
    };

    const handleSaveServices = async () => {
        setSavingServices(true);
        setServicesSaveMessage(null);
        try {
            for (const service of services) {
                const serviceEdits = editedPrices[service.id];
                if (!serviceEdits) continue;
                const updatedPrices = (service.prices || []).map(price => ({
                    ...price,
                    price: serviceEdits[price.id] ?? price.price
                }));
                await updateDoc(doc(db, 'services', service.id), { prices: updatedPrices });
            }
            setServicesSaveMessage({ type: 'success', text: 'Prices saved successfully!' });
            await fetchServices();
        } catch (error) {
            console.error('Error saving prices:', error);
            setServicesSaveMessage({ type: 'error', text: 'Failed to save prices.' });
        } finally {
            setSavingServices(false);
        }
    };

    // Promotion handlers
    const handlePromoFieldChange = (promoId: string, field: keyof Promotion, value: any) => {
        setEditedPromos(prev => {
            const newData = {
                ...prev,
                [promoId]: { ...prev[promoId], [field]: value }
            };

            // If enabling a promo, disable all others
            if (field === 'enabled' && value === true) {
                promotions.forEach(p => {
                    if (p.id !== promoId) {
                        const current = newData[p.id] || p;
                        newData[p.id] = { ...current, enabled: false };
                    }
                });
            }

            return newData;
        });
    };

    const handlePromoDiscountChange = (promoId: string, serviceId: string, priceId: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setEditedPromos(prev => {
            const promo = prev[promoId];
            const discounts = { ...(promo.discounts || {}) };
            if (!discounts[serviceId]) discounts[serviceId] = {};
            discounts[serviceId] = { ...discounts[serviceId], [priceId]: numValue };
            return { ...prev, [promoId]: { ...promo, discounts } };
        });
    };

    const handleSavePromos = async () => {
        setSavingPromos(true);
        setPromoSaveMessage(null);
        try {
            for (const promo of promotions) {
                const edited = editedPromos[promo.id];
                if (!edited) continue;
                const { id, ...dataToSave } = edited;
                await updateDoc(doc(db, 'promotions', promo.id), dataToSave);
            }
            setPromoSaveMessage({ type: 'success', text: 'Promotions saved successfully!' });
            await fetchPromotions();
        } catch (error) {
            console.error('Error saving promotions:', error);
            setPromoSaveMessage({ type: 'error', text: 'Failed to save promotions.' });
        } finally {
            setSavingPromos(false);
        }
    };

    const togglePromoExpand = (promoId: string) => {
        setExpandedPromos(prev => {
            const next = new Set(prev);
            if (next.has(promoId)) next.delete(promoId);
            else next.add(promoId);
            return next;
        });
    };

    // Auth checks now handled by AdminRestricted wrapper
    if (loading) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-2xl text-stone-800">J.J Thai Spa</h1>
                        <p className="text-stone-500 text-sm">Admin Dashboard</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-stone-700">{user.displayName}</p>
                            <p className="text-xs text-stone-500">{user.email}</p>
                        </div>
                        {user.photoURL && <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full border-2 border-stone-200" />}
                        <button onClick={signOut} className="text-sm text-stone-500 hover:text-stone-700 underline">Sign out</button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-6">
                    <nav className="flex gap-8">
                        <button onClick={() => setActiveTab('promotions')} className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'promotions' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
                            Promotions
                        </button>
                        <button onClick={() => setActiveTab('services')} className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'services' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
                            Services & Pricing
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Promotions Tab */}
                {activeTab === 'promotions' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-stone-800">Promotions</h2>
                                <p className="text-stone-500 text-sm">Configure promotional discounts</p>
                                <div className="flex gap-4 mt-2">
                                    <a href="/pricelist" target="_blank" className="text-sm text-emerald-600 hover:text-emerald-700 underline">
                                        View Price List →
                                    </a>
                                    <a href="/promo" target="_blank" className="text-sm text-emerald-600 hover:text-emerald-700 underline">
                                        View Promo Page →
                                    </a>
                                </div>
                            </div>
                            <button onClick={handleSavePromos} disabled={savingPromos} className={`px-6 py-2.5 rounded-xl font-medium transition-all ${savingPromos ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'}`}>
                                {savingPromos ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                        {promoSaveMessage && (
                            <div className={`mb-6 p-4 rounded-xl ${promoSaveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {promoSaveMessage.text}
                            </div>
                        )}

                        {loadingPromos ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                                <p className="text-stone-500">Loading promotions...</p>
                            </div>
                        ) : promotions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-stone-500">No promotions found.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {promotions.map(promo => {
                                    const edited = editedPromos[promo.id] || promo;
                                    const isExpanded = expandedPromos.has(promo.id);
                                    return (
                                        <div key={promo.id} className="border border-stone-200 rounded-xl overflow-hidden">
                                            {/* Promo Header */}
                                            <div className="p-5 bg-stone-50">
                                                <p className="text-sm text-stone-500 mb-1 font-mono">{promo.id}</p>
                                                <div className="flex items-center justify-between mb-4">
                                                    <input
                                                        type="text"
                                                        value={edited.label || ''}
                                                        onChange={(e) => handlePromoFieldChange(promo.id, 'label', e.target.value)}
                                                        className="text-lg font-medium text-stone-800 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-emerald-500 focus:outline-none px-1 py-0.5"
                                                        placeholder="Promotion Label"
                                                    />
                                                    <button
                                                        onClick={() => handlePromoFieldChange(promo.id, 'enabled', !edited.enabled)}
                                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${edited.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-500'}`}
                                                    >
                                                        {edited.enabled ? 'Enabled' : 'Disabled'}
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-stone-600">Start:</label>
                                                        <input
                                                            type="date"
                                                            value={edited.startDate?.split('T')[0] || ''}
                                                            onChange={(e) => handlePromoFieldChange(promo.id, 'startDate', e.target.value)}
                                                            className="border border-stone-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-stone-600">End:</label>
                                                        <input
                                                            type="date"
                                                            value={edited.endDate?.split('T')[0] || ''}
                                                            onChange={(e) => handlePromoFieldChange(promo.id, 'endDate', e.target.value)}
                                                            className="border border-stone-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Discounts Section */}
                                            <div className="border-t border-stone-200">
                                                <button
                                                    onClick={() => togglePromoExpand(promo.id)}
                                                    className="w-full px-5 py-3 flex items-center justify-between text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                                                >
                                                    <span>Discounts by Service</span>
                                                    <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>

                                                {isExpanded && (
                                                    <div className="p-5 pt-0 space-y-4">
                                                        {services.map(service => (
                                                            <div key={service.id} className="border border-stone-100 rounded-lg p-4">
                                                                <h4 className="font-medium text-stone-700 mb-3">{SERVICE_TITLES[service.id] || service.id}</h4>
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                                    {(service.prices || []).map(price => {
                                                                        const discountValue = edited.discounts?.[service.id]?.[price.id] || 0;
                                                                        return (
                                                                            <div key={price.id} className="flex items-center gap-2">
                                                                                <label className="text-xs text-stone-500 min-w-[60px]">{price.durationServices || `${price.duration}m`}:</label>
                                                                                <div className="relative flex-1">
                                                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                                                                                    <input
                                                                                        type="number"
                                                                                        value={discountValue}
                                                                                        onChange={(e) => handlePromoDiscountChange(promo.id, service.id, price.id, e.target.value)}
                                                                                        className="w-full pl-6 pr-2 py-1.5 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                                                                        min="0"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-stone-800">Service Pricing</h2>
                                <p className="text-stone-500 text-sm">Edit prices for each service duration</p>
                            </div>
                            <button onClick={handleSaveServices} disabled={savingServices} className={`px-6 py-2.5 rounded-xl font-medium transition-all ${savingServices ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'}`}>
                                {savingServices ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                        {servicesSaveMessage && (
                            <div className={`mb-6 p-4 rounded-xl ${servicesSaveMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {servicesSaveMessage.text}
                            </div>
                        )}

                        {loadingServices ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                                <p className="text-stone-500">Loading services...</p>
                            </div>
                        ) : services.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-stone-500">No services found in database.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {services.map(service => (
                                    <div key={service.id} className="border border-stone-200 rounded-xl p-5">
                                        <h3 className="font-medium text-stone-800 mb-4">{SERVICE_TITLES[service.id] || service.id}</h3>
                                        {(service.prices || []).length === 0 ? (
                                            <p className="text-stone-400 text-sm italic">No prices configured</p>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {(service.prices || []).map(price => (
                                                    <div key={price.id} className="flex items-center gap-3">
                                                        <label className="text-sm text-stone-600 min-w-[80px]">
                                                            {price.durationServices || `${price.duration} min`}:
                                                        </label>
                                                        <div className="relative flex-1">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
                                                            <input
                                                                type="number"
                                                                value={editedPrices[service.id]?.[price.id] ?? price.price}
                                                                onChange={(e) => handlePriceChange(service.id, price.id, e.target.value)}
                                                                className="w-full pl-7 pr-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
