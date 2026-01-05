"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncReviews = exports.api = void 0;
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Format ISO date to "Month Year" format
const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
};
// Hardcoded fallback reviews
const FALLBACK_REVIEWS = {
    reviews: [
        {
            "author_name": "Kevin D.",
            "rating": 5,
            "relative_time_description": "2025-11-20T18:29:24.530847Z",
            "date": "November 2025",
            "text": "The best deep tissue massage!!!"
        },
        {
            "author_name": "Nicole L.",
            "rating": 5,
            "relative_time_description": "2025-11-18T18:40:52.486794Z",
            "date": "November 2025",
            "text": "Sunicha was absolutely amazing! Highly reccomend her for your next massage."
        },
        {
            "author_name": "Jenna",
            "rating": 5,
            "relative_time_description": "2025-11-15T22:05:09.973880Z",
            "date": "November 2025",
            "text": "A level of soothing relief you wouldn't believe!"
        },
        {
            "author_name": "Nancy L.",
            "rating": 5,
            "relative_time_description": "2025-11-09T19:48:47.514838Z",
            "date": "November 2025",
            "text": "AMAZING THAI MASSAGE"
        },
        {
            "author_name": "Ilir S.",
            "rating": 5,
            "relative_time_description": "2025-11-09T16:21:05.775422Z",
            "date": "November 2025",
            "text": "Sunicha is the best highly recommended"
        },
        {
            "author_name": "Vinicio V.",
            "rating": 5,
            "relative_time_description": "2025-11-09T01:17:33.124685Z",
            "date": "November 2025",
            "text": "Strong, yet good massage"
        },
        {
            "author_name": "Katherine",
            "rating": 5,
            "relative_time_description": "2025-11-08T15:47:14.017817Z",
            "date": "November 2025",
            "text": "My boyfriend and I went for a couples massage, Sunicha and Kai were amazing! I highly recommend going here for the best massage and results!"
        },
        {
            "author_name": "Kerri",
            "rating": 5,
            "relative_time_description": "2025-11-06T18:12:06.121946Z",
            "date": "November 2025",
            "text": "Hana is wonderful!!! I will be back!"
        }
    ],
    totalReviewCount: 214,
    averageRating: "5.0"
};
// Helper to shuffle array
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
// Helper to select 12 reviews (6 recent, 6 mixed)
const selectReviewSubset = (reviews) => {
    if (!reviews || reviews.length <= 12) {
        return shuffleArray(reviews || []);
    }
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    // Filter recent reviews (last 12 months)
    const recentReviews = reviews.filter(r => {
        // Use relative_time_description if available for precision, otherwise assume generic recent logic
        // But mapped reviews might not have raw timestamp if not persisted? 
        // Sync API stores 'relative_time_description'.
        const reviewDate = r.relative_time_description ? new Date(r.relative_time_description) : null;
        return reviewDate && reviewDate >= oneYearAgo;
    });
    // If we don't have distinct sets (e.g. all are recent), fallback to pool strategy
    // Strategy: 
    // 1. Pick up to 6 unique random from recent
    // 2. Pick up to (12 - count) unique random from 'others' (which is everything minus selected)
    // Better Approach:
    // Pool A: Recent Reviews
    // Pool B: All Reviews (excluding those selected from Pool A to avoid dups)
    const shuffledRecent = shuffleArray(recentReviews);
    const selectedRecent = shuffledRecent.slice(0, 6);
    // Remaining pool: All reviews minus the ones we just picked
    const selectedIDs = new Set(selectedRecent.map(r => r.relative_time_description || r.text)); // simplistic ID
    const remainingPool = reviews.filter(r => !selectedIDs.has(r.relative_time_description || r.text));
    const shuffledRemaining = shuffleArray(remainingPool);
    const needed = 12 - selectedRecent.length;
    const selectedOthers = shuffledRemaining.slice(0, needed);
    // Combine and final shuffle
    return shuffleArray([...selectedRecent, ...selectedOthers]);
};
// GET /api/reviews - Fetch reviews from Firestore or return fallback
app.get('/api/reviews', async (req, res) => {
    try {
        const reviewsDoc = await db.collection('config').doc('reviews').get();
        if (reviewsDoc.exists) {
            const data = reviewsDoc.data();
            const allReviews = data?.reviews || [];
            const selectedReviews = selectReviewSubset(allReviews);
            res.json({
                reviews: selectedReviews,
                totalReviewCount: data?.totalReviewCount || 0,
                averageRating: data?.averageRating || "0.0"
            });
        }
        else {
            // Return fallback if no data in Firestore
            console.log('No reviews in Firestore, returning fallback data');
            const selectedFallback = selectReviewSubset(FALLBACK_REVIEWS.reviews);
            res.json({
                ...FALLBACK_REVIEWS,
                reviews: selectedFallback
            });
        }
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        const selectedFallback = selectReviewSubset(FALLBACK_REVIEWS.reviews);
        res.json({
            ...FALLBACK_REVIEWS,
            reviews: selectedFallback
        });
    }
});
// GET /api/services - Fetch services with dynamic promotions
app.get('/api/services', async (req, res) => {
    try {
        const [servicesSnap, promotionsSnap] = await Promise.all([
            db.collection('services').get(),
            db.collection('promotions').where('enabled', '==', true).get()
        ]);
        const services = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const promotions = promotionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const now = new Date();
        const activePromotions = promotions.filter((p) => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            return now >= start && now <= end && p.enabled;
        });
        const enrichedServices = services.map((service) => {
            // Find applicable promo by checking if it has discounts for this service ID
            const promo = activePromotions.find((p) => p.discounts && p.discounts[service.id]);
            if (promo) {
                const serviceDiscounts = promo.discounts[service.id];
                let serviceHasPromo = false;
                const promoLabel = promo.label;
                const enrichedPrices = (service.prices || []).map((price) => {
                    // price.id is "0", "1", etc.
                    const discountAmount = serviceDiscounts[price.id];
                    if (discountAmount !== undefined && Number(discountAmount) > 0) {
                        serviceHasPromo = true;
                        const originalPrice = price.price;
                        const promoPrice = Math.max(0, originalPrice - Number(discountAmount));
                        return {
                            ...price,
                            promoPrice: promoPrice
                        };
                    }
                    return price;
                });
                if (serviceHasPromo) {
                    return {
                        ...service,
                        hasPromo: true,
                        promoLabel: promoLabel,
                        prices: enrichedPrices
                    };
                }
            }
            return service;
        });
        const activePromoIds = activePromotions.map((p) => p.id);
        res.json({
            services: enrichedServices,
            activePromoIds
        });
    }
    catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});
// Export the Express app as a Firebase Function (v2, us-east1)
exports.api = (0, https_1.onRequest)({ region: 'us-east1' }, app);
// Scheduled function to sync reviews daily at 3 AM (v2, us-east1)
// Blocklist of reviews to exclude by their relative_time_description
const BLOCKLISTED_TIMESTAMPS = [
    '2021-06-10T13:53:56.564352Z',
    '2025-07-12T21:12:12.410179Z',
];
// Blocklisted words in review text (case-insensitive)
const BLOCKLISTED_WORDS = ['atom', 'kat'];
// Check if text contains non-ASCII unicode characters
const hasUnicodeCharacters = (text) => {
    // eslint-disable-next-line no-control-regex
    return /[^\x00-\x7F]/.test(text);
};
// Check if name contains special characters (only allow letters, spaces, and hyphens)
const hasSpecialCharacters = (name) => {
    return !/^[a-zA-Z\s-]+$/.test(name);
};
// Format name to "First L." format
const formatShortName = (fullName) => {
    const parts = fullName.trim().split(/\s+/);
    // Only allow 1 or 2 name parts
    if (parts.length > 2) {
        return null;
    }
    // Capitalize first letter of first name
    const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    if (parts.length === 1) {
        // Single name only
        return firstName;
    }
    // First name + last initial with period
    const lastInitial = parts[1].charAt(0).toUpperCase() + '.';
    return `${firstName} ${lastInitial}`;
};
exports.syncReviews = (0, scheduler_1.onSchedule)({
    schedule: '0 3 * * *',
    timeZone: 'America/New_York',
    region: 'us-east1'
}, async () => {
    console.log('Starting daily review sync...');
    try {
        // Fetch reviews from source
        const response = await fetch('https://jjreviews-27d5c.web.app/json');
        if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.status}`);
        }
        const data = await response.json();
        // Filter reviews with multiple criteria
        const filteredReviews = (data.reviews || [])
            .filter((review) => {
            const text = review.text || '';
            const authorName = review.author_name || '';
            // Exclude empty text
            if (!text.trim()) {
                return false;
            }
            // Exclude reviews with more than 250 characters
            if (text.length > 250) {
                return false;
            }
            // Exclude reviews containing blocklisted words (case-insensitive)
            const textLower = text.toLowerCase();
            for (const word of BLOCKLISTED_WORDS) {
                if (textLower.includes(word.toLowerCase())) {
                    return false;
                }
            }
            // Exclude reviews with "(Translated by Google)"
            if (text.includes('(Translated by Google)')) {
                return false;
            }
            // Exclude reviews with unicode characters in text
            if (hasUnicodeCharacters(text)) {
                return false;
            }
            // Exclude blocklisted reviews by timestamp
            if (BLOCKLISTED_TIMESTAMPS.includes(review.relative_time_description)) {
                return false;
            }
            // Exclude names with special characters
            if (hasSpecialCharacters(authorName)) {
                return false;
            }
            // Exclude names with more than 2 parts
            const nameParts = authorName.trim().split(/\s+/);
            if (nameParts.length > 2) {
                return false;
            }
            return true;
        })
            // Format and clean the stored data
            .map((review) => ({
            author_name: formatShortName(review.author_name) || review.author_name,
            rating: review.rating,
            relative_time_description: review.relative_time_description,
            date: formatDate(review.relative_time_description),
            text: (review.text || '').replace(/\n/g, ' ')
        }));
        // Store in Firestore
        await db.collection('config').doc('reviews').set({
            reviews: filteredReviews,
            totalReviewCount: data.totalReviewCount || 0,
            averageRating: data.averageRating || "0.0",
            lastSyncedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Synced ${filteredReviews.length} reviews (filtered from ${data.reviews?.length || 0})`);
    }
    catch (error) {
        console.error('Error syncing reviews:', error);
    }
});
//# sourceMappingURL=index.js.map