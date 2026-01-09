import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, app } from '../firebase';
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

type TabType = 'promotions' | 'services' | 'reviews';

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
            </main>
        </div>
    );
}
