import { onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import express from 'express';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(express.json());

// Format ISO date to "Month Year" format
const formatDate = (isoDate: string): string => {
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

// GET /api/reviews - Fetch reviews from Firestore or return fallback
app.get('/api/reviews', async (req, res) => {
    try {
        const reviewsDoc = await db.collection('config').doc('reviews').get();

        if (reviewsDoc.exists) {
            const data = reviewsDoc.data();
            res.json({
                reviews: data?.reviews || [],
                totalReviewCount: data?.totalReviewCount || 0,
                averageRating: data?.averageRating || "0.0"
            });
        } else {
            // Return fallback if no data in Firestore
            console.log('No reviews in Firestore, returning fallback data');
            res.json(FALLBACK_REVIEWS);
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.json(FALLBACK_REVIEWS);
    }
});

// Export the Express app as a Firebase Function (v2, us-east1)
export const api = onRequest({ region: 'us-east1' }, app);

// Scheduled function to sync reviews daily at 3 AM (v2, us-east1)
// Blocklist of reviews to exclude by their relative_time_description
const BLOCKLISTED_TIMESTAMPS = [
    '2021-06-10T13:53:56.564352Z',
    '2025-07-12T21:12:12.410179Z',
];

// Blocklisted words in review text (case-insensitive)
const BLOCKLISTED_WORDS = ['atom', 'kat'];

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

export const syncReviews = onSchedule({
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
            .filter((review: SourceReview) => {
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
            .map((review: SourceReview) => ({
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
    } catch (error) {
        console.error('Error syncing reviews:', error);
    }
});
