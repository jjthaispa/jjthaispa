import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import express from 'express';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(express.json());

// Format date to "Month Year" format with fallbacks
const formatDate = (dateStr: string): string => {
    // Check for ISO timestamp (e.g. 2026-01-06T18:44:13.403321Z)
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        try {
            const date = new Date(dateStr);
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        } catch (e) {
            console.error('Error parsing ISO date:', e);
            return 'Recent';
        }
    }

    // Fallback regex for "Month Year" or "X weeks ago" extraction
    const months: Record<string, string> = {
        'january': 'January', 'february': 'February', 'march': 'March', 'april': 'April',
        'may': 'May', 'june': 'June', 'july': 'July', 'august': 'August',
        'september': 'September', 'october': 'October', 'november': 'November', 'december': 'December'
    };

    const dateMatch = dateStr.match(/(\w+)\s*,?\s*(\d{4})/i);
    if (dateMatch) {
        const monthName = months[dateMatch[1].toLowerCase()] || dateMatch[1];
        return `${monthName} ${dateMatch[2]}`;
    }

    return 'Recent';
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
const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Helper to select 12 reviews (6 recent, 6 mixed)
const selectReviewSubset = (reviews: any[]): any[] => {
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
        } else {
            // Return fallback if no data in Firestore
            console.log('No reviews in Firestore, returning fallback data');
            const selectedFallback = selectReviewSubset(FALLBACK_REVIEWS.reviews);
            res.json({
                ...FALLBACK_REVIEWS,
                reviews: selectedFallback
            });
        }
    } catch (error) {
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

        const services: any[] = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const promotions: any[] = promotionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const now = new Date();
        const activePromotions = promotions.filter((p: any) => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            return now >= start && now <= end && p.enabled;
        });

        const enrichedServices = services.map((service: any) => {
            // Find applicable promo by checking if it has discounts for this service ID
            const promo = activePromotions.find((p: any) => p.discounts && p.discounts[service.id]);

            if (promo) {
                const serviceDiscounts = promo.discounts[service.id];
                let serviceHasPromo = false;
                const promoLabel = promo.label;

                const enrichedPrices = (service.prices || []).map((price: any) => {
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

        const activePromoIds = activePromotions.map((p: any) => p.id);

        res.json({
            services: enrichedServices,
            activePromoIds
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// Admin emails for sync endpoint authentication
const SYNC_ADMIN_EMAILS = [
    'sunicha@jjthaispa.com',
    'michael@jjthaispa.com',
    'mikerijo@gmail.com',
    'sunicha7768@gmail.com'
];

// POST /api/sync-reviews - Manual sync trigger (authenticated, admin only)
app.post('/api/sync-reviews', async (req, res) => {
    // Verify Firebase Auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized - no token provided' });
        return;
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const email = decodedToken.email;

        // Check if user is an admin
        if (!email || !SYNC_ADMIN_EMAILS.includes(email)) {
            res.status(403).json({ error: 'Forbidden - admin access required' });
            return;
        }

        // Authorized - perform sync (performReviewSync is defined later, so we inline the logic)
        console.log('Manual sync triggered by:', email);

        // Fetch reviews from source
        const response = await fetch('https://jjreviews-27d5c.web.app/json');
        if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.status}`);
        }
        const data = await response.json();

        // Fetch blocklist from Firestore
        const blocklistedTimestampsDoc = await db.doc('config_admin/reviews_blocklist').get();
        const blocklistedTimestamps = blocklistedTimestampsDoc.exists ? (blocklistedTimestampsDoc.data()?.timestamps || []) : [];

        const blocklistedWordsDoc = await db.doc('config_admin/reviews_blocklist_words').get();
        const blocklistedWords = blocklistedWordsDoc.exists ? (blocklistedWordsDoc.data()?.words || []) : [];

        // Process ALL reviews and assign filter reasons
        const allReviewsWithReasons = (data.reviews || []).map((review: any) => {
            const text = review.text || '';
            const authorName = review.author_name || '';
            let filterReason: string | null = null;

            if (!text.trim()) {
                filterReason = 'empty_text';
            } else if (text.length > 250) {
                filterReason = 'too_long';
            } else if (text.includes('(Translated by Google)')) {
                filterReason = 'translated';
            } else if (/[^\x00-\x7F]/.test(text)) {
                filterReason = 'unicode';
            } else {
                const textLower = text.toLowerCase();
                for (const word of blocklistedWords) {
                    if (textLower.includes(word.toLowerCase())) {
                        filterReason = `blocklisted_word:${word}`;
                        break;
                    }
                }
            }

            if (!filterReason && blocklistedTimestamps.includes(review.relative_time_description)) {
                filterReason = 'blocklisted_timestamp';
            }

            if (!filterReason) {
                if (!/^[a-zA-Z\s-]+$/.test(authorName)) {
                    filterReason = 'special_chars_name';
                } else {
                    const nameParts = authorName.trim().split(/\s+/);
                    if (nameParts.length > 2) {
                        filterReason = 'too_many_name_parts';
                    }
                }
            }

            // Format name
            const parts = authorName.trim().split(/\s+/);
            let formattedName = authorName;
            if (parts.length === 1 && parts[0].length >= 2) {
                formattedName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
            } else if (parts.length === 2) {
                formattedName = `${parts[0].charAt(0).toUpperCase()}${parts[0].slice(1).toLowerCase()} ${parts[1].charAt(0).toUpperCase()}.`;
            }

            return {
                author_name: authorName,
                author_name_formatted: formattedName,
                rating: review.rating,
                relative_time_description: review.relative_time_description,
                date: formatDate(review.relative_time_description),
                text: text.replace(/\n/g, ' '),
                filterReason
            };
        });

        // Store ALL reviews with reasons in config_admin
        await db.collection('config_admin').doc('reviews_all').set({
            reviews: allReviewsWithReasons,
            totalReviewCount: data.totalReviewCount || 0,
            averageRating: data.averageRating || "0.0",
            lastSyncedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Filter to only approved reviews for public site
        const filteredReviews = allReviewsWithReasons
            .filter((r: any) => r.filterReason === null)
            .map((r: any) => ({
                author_name: r.author_name_formatted,
                rating: r.rating,
                relative_time_description: r.relative_time_description,
                date: r.date,
                text: r.text
            }));

        // Store filtered reviews in config/reviews for public site
        await db.collection('config').doc('reviews').set({
            reviews: filteredReviews,
            totalReviewCount: data.totalReviewCount || 0,
            averageRating: data.averageRating || "0.0",
            lastSyncedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
            success: true,
            message: `Synced ${allReviewsWithReasons.length} reviews, ${filteredReviews.length} approved for public`,
            total: allReviewsWithReasons.length,
            approved: filteredReviews.length
        });
    } catch (error) {
        console.error('Error in manual sync:', error);
        res.status(500).json({ error: 'Failed to sync reviews' });
    }
});

// Export the Express app as a Firebase Function (v2, us-east1)
export const api = onRequest({ region: 'us-east1' }, app);

// Scheduled function to sync reviews daily at 3 AM (v2, us-east1)
// Fetch blocklist from Firestore config
const getBlocklistedTimestamps = async (): Promise<string[]> => {
    try {
        const blocklistDoc = await db.doc('config_admin/reviews_blocklist').get();
        if (blocklistDoc.exists) {
            const data = blocklistDoc.data();
            return data?.timestamps || [];
        }
        return [];
    } catch (error) {
        console.error('Error fetching blocklist:', error);
        return [];
    }
};

// Fetch blocklisted words from Firestore config
const getBlocklistedWords = async (): Promise<string[]> => {
    try {
        const blocklistDoc = await db.doc('config_admin/reviews_blocklist_words').get();
        if (blocklistDoc.exists) {
            const data = blocklistDoc.data();
            return data?.words || [];
        }
        return [];
    } catch (error) {
        console.error('Error fetching blocklisted words:', error);
        return [];
    }
};

// Check if text contains non-ASCII unicode characters
const hasUnicodeCharacters = (text: string): boolean => {
    // eslint-disable-next-line no-control-regex
    return /[^\x00-\x7F]/.test(text);
};

// Check if name contains special characters (only allow letters, spaces, and hyphens)
const hasSpecialCharacters = (name: string): boolean => {
    return !/^[a-zA-Z\s-]+$/.test(name);
};

// Format name to "First L." format
const formatShortName = (fullName: string): string | null => {
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

interface SourceReview {
    author_name: string;
    profile_photo_url?: string;
    rating: number;
    relative_time_description: string;
    text?: string;
}

// Core sync logic - reusable by scheduled and manual triggers
const performReviewSync = async (): Promise<{ total: number; approved: number }> => {
    console.log('Starting review sync...');

    // Fetch reviews from source
    const response = await fetch('https://jjreviews-27d5c.web.app/json');

    if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    const data = await response.json();

    // Fetch blocklist from Firestore
    const blocklistedTimestamps = await getBlocklistedTimestamps();
    const blocklistedWords = await getBlocklistedWords();

    // Process ALL reviews and assign filter reasons
    const allReviewsWithReasons = (data.reviews || []).map((review: SourceReview) => {
        const text = review.text || '';
        const authorName = review.author_name || '';
        let filterReason: string | null = null;

        // Check each filter condition and set reason
        if (!text.trim()) {
            filterReason = 'empty_text';
        } else if (text.length > 250) {
            filterReason = 'too_long';
        } else if (text.includes('(Translated by Google)')) {
            filterReason = 'translated';
        } else if (hasUnicodeCharacters(text)) {
            filterReason = 'unicode';
        } else {
            // Check blocklisted words
            const textLower = text.toLowerCase();
            for (const word of blocklistedWords) {
                if (textLower.includes(word.toLowerCase())) {
                    filterReason = `blocklisted_word:${word}`;
                    break;
                }
            }
        }

        // Check timestamp blocklist (if not already filtered)
        if (!filterReason && blocklistedTimestamps.includes(review.relative_time_description)) {
            filterReason = 'blocklisted_timestamp';
        }

        // Check name filters (if not already filtered)
        if (!filterReason) {
            if (hasSpecialCharacters(authorName)) {
                filterReason = 'special_chars_name';
            } else {
                const nameParts = authorName.trim().split(/\s+/);
                if (nameParts.length > 2) {
                    filterReason = 'too_many_name_parts';
                } else if (!formatShortName(authorName)) {
                    filterReason = 'invalid_name_format';
                }
            }
        }

        return {
            author_name: review.author_name,
            author_name_formatted: formatShortName(review.author_name) || review.author_name,
            rating: review.rating,
            relative_time_description: review.relative_time_description,
            date: formatDate(review.relative_time_description),
            text: (text).replace(/\n/g, ' '),
            filterReason
        };
    });

    // Store ALL reviews with reasons in config_admin
    await db.collection('config_admin').doc('reviews_all').set({
        reviews: allReviewsWithReasons,
        totalReviewCount: data.totalReviewCount || 0,
        averageRating: data.averageRating || "0.0",
        lastSyncedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Filter to only approved reviews for public site
    const filteredReviews = allReviewsWithReasons
        .filter((r: any) => r.filterReason === null)
        .map((r: any) => ({
            author_name: r.author_name_formatted,
            rating: r.rating,
            relative_time_description: r.relative_time_description,
            date: r.date,
            text: r.text
        }));

    // Store filtered reviews in config/reviews for public site
    await db.collection('config').doc('reviews').set({
        reviews: filteredReviews,
        totalReviewCount: data.totalReviewCount || 0,
        averageRating: data.averageRating || "0.0",
        lastSyncedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Synced ${allReviewsWithReasons.length} total reviews, ${filteredReviews.length} approved for public`);
    return { total: allReviewsWithReasons.length, approved: filteredReviews.length };
};

// Scheduled function - daily at 3 AM
export const syncReviews = onSchedule({
    schedule: '0 3 * * *',
    timeZone: 'America/New_York',
    region: 'us-east1'
}, async () => {
    try {
        await performReviewSync();
    } catch (error) {
        console.error('Error syncing reviews:', error);
    }
});

// HTTP endpoint for manual sync trigger (authenticated, admin only)
const ADMIN_EMAILS = [
    'sunicha@jjthaispa.com',
    'michael@jjthaispa.com',
    'mikerijo@gmail.com',
    'sunicha7768@gmail.com'
];

// Callable function for manual sync trigger (auth handled by Firebase SDK)
import { onCall, HttpsError } from 'firebase-functions/v2/https';

export const triggerSyncReviews = onCall({
    region: 'us-east1'
}, async (request) => {
    // Check if user is authenticated
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'User must be authenticated');
    }

    const email = request.auth.token.email;

    // Check if user is an admin
    if (!email || !ADMIN_EMAILS.includes(email)) {
        throw new HttpsError('permission-denied', 'Admin access required');
    }

    try {
        const result = await performReviewSync();
        return {
            success: true,
            message: `Synced ${result.total} reviews, ${result.approved} approved for public`,
            ...result
        };
    } catch (error) {
        console.error('Error in manual sync:', error);
        throw new HttpsError('internal', 'Failed to sync reviews');
    }
});
