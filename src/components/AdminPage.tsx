import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, app } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { SERVICES } from '../servicesData';
import HolidayPopup from './HolidayPopup';

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

// Review interface
interface Review {
    id: string;
    reviewer_name: string;
    rating: number;
    comment: string;
    create_time: string;
    timestamp: string; // relative_time_description for blocklist matching
    filterReason: string | null; // reason for filtering, null if approved
    source?: string;
}

type TabType = 'promotions' | 'services' | 'reviews' | 'holidayHours';

export default function AdminPage() {
    const { user, loading, isAuthorized, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('reviews');

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

    // Reviews state
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // Blocklist state
    const [blocklist, setBlocklist] = useState<string[]>([]);
    const [newBlocklistEntry, setNewBlocklistEntry] = useState('');
    const [savingBlocklist, setSavingBlocklist] = useState(false);

    // Blocklisted words state
    const [blocklistWords, setBlocklistWords] = useState<string[]>([]);
    const [newBlocklistWord, setNewBlocklistWord] = useState('');
    const [savingBlocklistWords, setSavingBlocklistWords] = useState(false);

    // Sync state
    const [syncing, setSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState<string | null>(null);
    const [showApprovedOnly, setShowApprovedOnly] = useState(false);

    // Holiday hours state
    interface RegularHour {
        day: string;
        dayIndex: number;
        open: string | null;
        close: string | null;
    }
    interface SpecialHour {
        date: string;
        open: string | null;
        close: string | null;
        closed: boolean;
    }
    interface BusinessHours {
        regularHours: RegularHour[];
        specialHours: SpecialHour[];
        updatedAt: string | null;
        lastSyncedAt: any;
    }
    const [hoursData, setHoursData] = useState<BusinessHours | null>(null);
    const [loadingHours, setLoadingHours] = useState(false);
    const [syncingHours, setSyncingHours] = useState(false);
    const [hoursSyncMessage, setHoursSyncMessage] = useState<string | null>(null);

    // Holiday labels state (date -> label mapping)
    const [holidayLabels, setHolidayLabels] = useState<Record<string, string>>({});
    const [editedHolidayLabels, setEditedHolidayLabels] = useState<Record<string, string>>({});
    const [savingHolidayLabels, setSavingHolidayLabels] = useState(false);
    const [holidayLabelsSaveMessage, setHolidayLabelsSaveMessage] = useState<string | null>(null);
    const [previewDate, setPreviewDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Manual sync trigger using Express API
    const triggerSync = async () => {
        if (!user) return;

        setSyncing(true);
        setSyncMessage(null);
        try {
            // Get the user's auth token
            const token = await user.getIdToken();

            const response = await fetch('/api/sync-reviews', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.success) {
                setSyncMessage(`✓ ${data.message}`);
                // Refresh reviews list
                fetchReviews();
            } else {
                setSyncMessage(`✗ ${data.error || 'Sync failed'}`);
            }
        } catch (error: any) {
            setSyncMessage(`✗ ${error.message || 'Failed to trigger sync'}`);
            console.error('Sync error:', error);
        } finally {
            setSyncing(false);
        }
    };

    // Fetch business hours data from Firestore
    const fetchHoursData = async () => {
        setLoadingHours(true);
        try {
            const { getDoc } = await import('firebase/firestore');
            const hoursDoc = await getDoc(doc(db, 'config', 'business_hours'));
            if (hoursDoc.exists()) {
                const data = hoursDoc.data() as BusinessHours;
                setHoursData(data);
            } else {
                setHoursData(null);
            }
        } catch (error) {
            console.error('Error fetching hours:', error);
        } finally {
            setLoadingHours(false);
        }
    };

    // Manual hours sync trigger
    const triggerHoursSync = async () => {
        if (!user) return;

        setSyncingHours(true);
        setHoursSyncMessage(null);
        try {
            const token = await user.getIdToken();

            const response = await fetch('/api/sync-hours', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.success) {
                setHoursSyncMessage(`✓ ${data.message}`);
                fetchHoursData();
            } else {
                setHoursSyncMessage(`✗ ${data.error || 'Sync failed'}`);
            }
        } catch (error: any) {
            setHoursSyncMessage(`✗ ${error.message || 'Failed to sync hours'}`);
            console.error('Hours sync error:', error);
        } finally {
            setSyncingHours(false);
        }
    };

    // Fetch holiday labels from Firestore
    const fetchHolidayLabels = async () => {
        try {
            const { getDoc } = await import('firebase/firestore');
            const labelsDoc = await getDoc(doc(db, 'config', 'holiday_labels'));
            if (labelsDoc.exists()) {
                const data = labelsDoc.data();
                const labels = data?.labels || {};
                setHolidayLabels(labels);
                setEditedHolidayLabels(labels);
            }
        } catch (error) {
            console.error('Error fetching holiday labels:', error);
        }
    };

    // Handle holiday label change
    const handleLabelChange = (date: string, value: string) => {
        setEditedHolidayLabels(prev => ({
            ...prev,
            [date]: value
        }));
    };

    // Save holiday labels
    const saveHolidayLabels = async () => {
        setSavingHolidayLabels(true);
        setHolidayLabelsSaveMessage(null);
        try {
            const { setDoc } = await import('firebase/firestore');
            // Save to config (public) so it can be read by the popup
            await setDoc(doc(db, 'config', 'holiday_labels'), {
                labels: editedHolidayLabels,
                updatedAt: new Date().toISOString()
            });
            setHolidayLabels(editedHolidayLabels);
            setHolidayLabelsSaveMessage('✓ Labels saved successfully');
        } catch (error) {
            console.error('Error saving holiday labels:', error);
            setHolidayLabelsSaveMessage('✗ Failed to save labels');
        } finally {
            setSavingHolidayLabels(false);
        }
    };

    // Fetch data based on active tab
    useEffect(() => {
        if (!isAuthorized) return;
        if (activeTab === 'services') {
            fetchServices();
        } else if (activeTab === 'promotions') {
            fetchPromotions();
        } else if (activeTab === 'reviews') {
            fetchReviews();
            fetchBlocklist();
            fetchBlocklistWords();
        } else if (activeTab === 'holidayHours') {
            fetchHoursData();
            fetchHolidayLabels();
        }
    }, [activeTab, isAuthorized]);

    // Fetch reviews
    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const { getDoc } = await import('firebase/firestore');
            const configDoc = await getDoc(doc(db, 'config_admin', 'reviews_all'));

            if (configDoc.exists()) {
                const data = configDoc.data();
                const reviewsArray = data.reviews || [];

                const reviewsData = reviewsArray.map((r: any, index: number) => ({
                    id: String(index),
                    reviewer_name: r.author_name || 'Anonymous',
                    rating: r.rating || 0,
                    comment: r.text || '',
                    create_time: r.date || 'Recent',
                    timestamp: r.relative_time_description || '',
                    filterReason: r.filterReason || null,
                    source: 'google'
                })) as Review[];

                setReviews(reviewsData);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoadingReviews(false);
        }
    };

    // Fetch blocklist
    const fetchBlocklist = async () => {
        try {
            const { getDoc } = await import('firebase/firestore');
            const blocklistDoc = await getDoc(doc(db, 'config_admin', 'reviews_blocklist'));
            if (blocklistDoc.exists()) {
                const data = blocklistDoc.data();
                setBlocklist(data?.timestamps || []);
            }
        } catch (error) {
            console.error('Error fetching blocklist:', error);
        }
    };

    // Add blocklist entry
    const addBlocklistEntry = async () => {
        if (!newBlocklistEntry.trim()) return;
        setSavingBlocklist(true);
        try {
            const { setDoc } = await import('firebase/firestore');
            const newList = [...blocklist, newBlocklistEntry.trim()];
            await setDoc(doc(db, 'config_admin', 'reviews_blocklist'), { timestamps: newList });
            setBlocklist(newList);
            setNewBlocklistEntry('');
        } catch (error) {
            console.error('Error adding blocklist entry:', error);
        } finally {
            setSavingBlocklist(false);
        }
    };

    // Remove blocklist entry
    const removeBlocklistEntry = async (timestamp: string) => {
        setSavingBlocklist(true);
        try {
            const { setDoc } = await import('firebase/firestore');
            const newList = blocklist.filter(t => t !== timestamp);
            await setDoc(doc(db, 'config_admin', 'reviews_blocklist'), { timestamps: newList });
            setBlocklist(newList);
        } catch (error) {
            console.error('Error removing blocklist entry:', error);
        } finally {
            setSavingBlocklist(false);
        }
    };

    // Fetch blocklisted words
    const fetchBlocklistWords = async () => {
        try {
            const { getDoc } = await import('firebase/firestore');
            const wordsDoc = await getDoc(doc(db, 'config_admin', 'reviews_blocklist_words'));
            if (wordsDoc.exists()) {
                const data = wordsDoc.data();
                setBlocklistWords(data?.words || []);
            }
        } catch (error) {
            console.error('Error fetching blocklisted words:', error);
        }
    };

    // Add blocklisted word
    const addBlocklistWord = async () => {
        if (!newBlocklistWord.trim()) return;
        setSavingBlocklistWords(true);
        try {
            const { setDoc } = await import('firebase/firestore');
            const newList = [...blocklistWords, newBlocklistWord.trim().toLowerCase()];
            await setDoc(doc(db, 'config_admin', 'reviews_blocklist_words'), { words: newList });
            setBlocklistWords(newList);
            setNewBlocklistWord('');
        } catch (error) {
            console.error('Error adding blocklisted word:', error);
        } finally {
            setSavingBlocklistWords(false);
        }
    };

    // Remove blocklisted word
    const removeBlocklistWord = async (word: string) => {
        setSavingBlocklistWords(true);
        try {
            const { setDoc } = await import('firebase/firestore');
            const newList = blocklistWords.filter(w => w !== word);
            await setDoc(doc(db, 'config_admin', 'reviews_blocklist_words'), { words: newList });
            setBlocklistWords(newList);
        } catch (error) {
            console.error('Error removing blocklisted word:', error);
        } finally {
            setSavingBlocklistWords(false);
        }
    };

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
                        <a
                            href="/admin/booking"
                            onClick={(e) => {
                                e.preventDefault();
                                window.history.pushState({}, '', '/admin/booking');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }}
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            Dev Booking →
                        </a>
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
                        <button onClick={() => setActiveTab('reviews')} className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reviews' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
                            Reviews
                        </button>
                        <button onClick={() => setActiveTab('promotions')} className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'promotions' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
                            Promotions
                        </button>
                        <button onClick={() => setActiveTab('services')} className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'services' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
                            Services & Pricing
                        </button>
                        <button onClick={() => setActiveTab('holidayHours')} className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'holidayHours' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
                            Holiday Hours
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-stone-800">Customer Reviews</h2>
                                <p className="text-stone-500 text-sm">View all customer feedback</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {syncMessage && (
                                    <span className={`text-sm ${syncMessage.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {syncMessage}
                                    </span>
                                )}
                                <button
                                    onClick={triggerSync}
                                    disabled={syncing}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {syncing ? (
                                        <>
                                            <span className="animate-spin">↻</span>
                                            Syncing...
                                        </>
                                    ) : (
                                        'Sync Reviews'
                                    )}
                                </button>
                                <span className="text-sm text-stone-500">
                                    Total: {reviews.length} | Approved: {reviews.filter(r => r.filterReason === null).length}
                                </span>
                            </div>
                        </div>

                        {/* Filter Toggle */}
                        <div className="flex items-center gap-2 mb-6">
                            <input
                                type="checkbox"
                                id="showApprovedOnly"
                                checked={showApprovedOnly}
                                onChange={(e) => setShowApprovedOnly(e.target.checked)}
                                className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                            />
                            <label htmlFor="showApprovedOnly" className="text-sm text-stone-700 cursor-pointer select-none">
                                Show only approved reviews
                            </label>
                        </div>

                        {/* Blocklist Section */}
                        <div className="mb-8 p-5 border border-amber-200 bg-amber-50 rounded-xl">
                            <h3 className="font-semibold text-stone-800 mb-3">Blocklisted Reviews</h3>
                            <p className="text-xs text-stone-500 mb-4">Reviews matching these timestamps will be excluded from the public site.</p>

                            {/* Add new entry */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newBlocklistEntry}
                                    onChange={(e) => setNewBlocklistEntry(e.target.value)}
                                    placeholder="Enter timestamp (e.g., 2025-07-12T21:12:12.410179Z)"
                                    className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                />
                                <button
                                    onClick={addBlocklistEntry}
                                    disabled={savingBlocklist || !newBlocklistEntry.trim()}
                                    className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Blocklist entries */}
                            {blocklist.length === 0 ? (
                                <p className="text-sm text-stone-400 italic">No blocklisted reviews</p>
                            ) : (
                                <div className="space-y-2">
                                    {blocklist.map((timestamp, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-stone-200">
                                            <code className="text-xs text-stone-600 break-all">{timestamp}</code>
                                            <button
                                                onClick={() => removeBlocklistEntry(timestamp)}
                                                disabled={savingBlocklist}
                                                className="text-red-500 hover:text-red-700 text-xs font-medium ml-2"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Blocklisted Words Section */}
                        <div className="mb-8 p-5 border border-yellow-300 bg-yellow-50 rounded-xl">
                            <h3 className="font-semibold text-stone-800 mb-3">Blocklisted Words</h3>
                            <p className="text-xs text-stone-500 mb-4">Reviews containing these words (case-insensitive) will be excluded from the public site.</p>

                            {/* Add new word */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newBlocklistWord}
                                    onChange={(e) => setNewBlocklistWord(e.target.value)}
                                    placeholder="Enter word to blocklist"
                                    className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                                />
                                <button
                                    onClick={addBlocklistWord}
                                    disabled={savingBlocklistWords || !newBlocklistWord.trim()}
                                    className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Words list */}
                            {blocklistWords.length === 0 ? (
                                <p className="text-sm text-stone-400 italic">No blocklisted words</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {blocklistWords.map((word, idx) => (
                                        <div key={idx} className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-stone-200">
                                            <span className="text-sm text-stone-700">{word}</span>
                                            <button
                                                onClick={() => removeBlocklistWord(word)}
                                                disabled={savingBlocklistWords}
                                                className="text-red-500 hover:text-red-700 text-xs ml-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {loadingReviews ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                                <p className="text-stone-500">Loading reviews...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-stone-500">No reviews found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews
                                    .filter(r => !showApprovedOnly || r.filterReason === null)
                                    .map(review => {
                                        // Use filterReason from backend for styling
                                        const isFiltered = review.filterReason !== null;
                                        const isTimestampBlock = review.filterReason === 'blocklisted_timestamp';
                                        const isWordBlock = review.filterReason?.startsWith('blocklisted_word');

                                        // Determine styling based on filter reason
                                        let cardClass = 'border-stone-200';
                                        let textClass = 'text-stone-800';
                                        let commentClass = 'text-stone-600';
                                        let badge = null;

                                        if (isTimestampBlock) {
                                            cardClass = 'border-red-300 bg-red-50';
                                            textClass = 'text-red-800';
                                            commentClass = 'text-red-600';
                                            badge = <span className="ml-2 text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded-full">Blocklisted (Timestamp)</span>;
                                        } else if (isWordBlock) {
                                            cardClass = 'border-yellow-300 bg-yellow-50';
                                            textClass = 'text-yellow-800';
                                            commentClass = 'text-yellow-700';
                                            const word = review.filterReason?.split(':')[1] || '';
                                            badge = <span className="ml-2 text-xs bg-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full">Blocklisted ({word})</span>;
                                        } else if (isFiltered) {
                                            // Other filter reasons - gray styling
                                            cardClass = 'border-stone-300 bg-stone-100';
                                            textClass = 'text-stone-600';
                                            commentClass = 'text-stone-500';
                                            badge = <span className="ml-2 text-xs bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">{review.filterReason?.replace(/_/g, ' ')}</span>;
                                        } else {
                                            // Approved - green accent
                                            badge = <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Approved</span>;
                                        }

                                        return (
                                            <div key={review.id} className={`border rounded-xl p-5 transition-colors ${cardClass}`}>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className={`font-semibold ${textClass}`}>
                                                            {review.reviewer_name}
                                                            {badge}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                                                            <span>{review.create_time}</span>
                                                            {review.source && (
                                                                <span className="px-2 py-0.5 bg-stone-100 rounded-full capitalize">{review.source}</span>
                                                            )}
                                                        </div>
                                                        {/* Full timestamp for blocklist identification */}
                                                        <code className="block text-xs text-stone-400 mt-1 select-all">{review.timestamp}</code>
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={`text-lg ${i < review.rating ? 'text-amber-400 font-variation-fill' : 'text-stone-200'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className={`text-sm leading-relaxed ${commentClass}`}>{review.comment}</p>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                )}

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

                {/* Holiday Hours Tab */}
                {activeTab === 'holidayHours' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-stone-800">Business Hours</h2>
                                <p className="text-stone-500 text-sm">Regular and holiday/special hours</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {hoursSyncMessage && (
                                    <span className={`text-sm ${hoursSyncMessage.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {hoursSyncMessage}
                                    </span>
                                )}
                                <button
                                    onClick={triggerHoursSync}
                                    disabled={syncingHours}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {syncingHours ? (
                                        <>
                                            <span className="animate-spin">↻</span>
                                            Syncing...
                                        </>
                                    ) : (
                                        'Sync Hours'
                                    )}
                                </button>
                            </div>
                        </div>

                        {loadingHours ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                                <p className="text-stone-500">Loading hours...</p>
                            </div>
                        ) : !hoursData ? (
                            <div className="text-center py-12">
                                <p className="text-stone-500">No hours data found. Click "Sync Hours" to fetch from Google Business.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Last Updated Info */}
                                {hoursData.updatedAt && (
                                    <p className="text-xs text-stone-400">
                                        Last updated from Google: {new Date(hoursData.updatedAt).toLocaleString()}
                                    </p>
                                )}

                                {/* Regular Hours */}
                                <div>
                                    <h3 className="font-semibold text-stone-800 mb-4">Regular Hours</h3>
                                    <div className="overflow-hidden rounded-xl border border-stone-200">
                                        <table className="w-full">
                                            <thead className="bg-stone-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-stone-600">Day</th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-stone-600">Open</th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-stone-600">Close</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-stone-100">
                                                {(hoursData.regularHours || []).sort((a, b) => a.dayIndex - b.dayIndex).map((hour) => (
                                                    <tr key={hour.day} className="hover:bg-stone-50">
                                                        <td className="px-4 py-3 text-sm font-medium text-stone-700 capitalize">
                                                            {hour.day.toLowerCase()}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-stone-600">
                                                            {hour.open || 'Closed'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-stone-600">
                                                            {hour.close || '-'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-stone-800 mb-4">Special / Holiday Hours</h3>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-stone-800">Special / Holiday Hours</h3>
                                    {(hoursData.specialHours || []).length > 0 && (
                                        <div className="flex items-center gap-3">
                                            {holidayLabelsSaveMessage && (
                                                <span className={`text-sm ${holidayLabelsSaveMessage.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>
                                                    {holidayLabelsSaveMessage}
                                                </span>
                                            )}
                                            <button
                                                onClick={saveHolidayLabels}
                                                disabled={savingHolidayLabels}
                                                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {savingHolidayLabels ? 'Saving...' : 'Save Labels'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {(hoursData.specialHours || []).length === 0 ? (
                                    <p className="text-sm text-stone-400 italic">No special hours configured</p>
                                ) : (
                                    <div className="overflow-hidden rounded-xl border border-amber-200">
                                        <table className="w-full">
                                            <thead className="bg-amber-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-amber-700">Date</th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-amber-700">Label</th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-amber-700">Status</th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium text-amber-700">Hours</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-amber-100">
                                                {(hoursData.specialHours || []).sort((a, b) => a.date.localeCompare(b.date)).map((hour) => {
                                                    const date = new Date(hour.date + 'T00:00:00');
                                                    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

                                                    return (
                                                        <tr key={hour.date} className={hour.closed ? 'bg-red-50' : 'hover:bg-amber-50'}>
                                                            <td className="px-4 py-3 text-sm font-medium text-stone-700">
                                                                {formattedDate}
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <input
                                                                    type="text"
                                                                    value={editedHolidayLabels[hour.date] || ''}
                                                                    onChange={(e) => handleLabelChange(hour.date, e.target.value)}
                                                                    placeholder="e.g., Thanksgiving"
                                                                    className="w-full px-2 py-1.5 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                {hour.closed ? (
                                                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Closed</span>
                                                                ) : (
                                                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Modified Hours</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-stone-600">
                                                                {hour.closed ? '-' : `${hour.open} - ${hour.close}`}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}


                                {/* Popup Preview Section */}
                                <div className="mt-8 pt-8 border-t border-stone-200">
                                    <h3 className="font-semibold text-stone-800 mb-4">Popup Preview</h3>
                                    <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                                            <div className="flex-1">
                                                <p className="text-sm text-stone-600 mb-2">Select a date to preview the holiday popup as it would appear on that day.</p>
                                                <p className="text-xs text-stone-500 italic">Simulates visiting the site on the selected date. Checks for holidays on that date and the next day.</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <label className="text-sm font-medium text-stone-700">Preview Date:</label>
                                                <input
                                                    type="date"
                                                    value={previewDate}
                                                    onChange={(e) => setPreviewDate(e.target.value)}
                                                    className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="w-full rounded-lg overflow-hidden">
                                            {/* The Popup Component */}
                                            <HolidayPopup
                                                previewMode={true}
                                                previewDate={new Date(previewDate + 'T12:00:00')}
                                                forceOpen={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
