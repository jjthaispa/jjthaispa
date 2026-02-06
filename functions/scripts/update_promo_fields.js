/**
 * Script to update promotions with title and dateLabel fields
 * Run with: node functions/scripts/update_promo_fields.js
 */

const admin = require('firebase-admin');

// Initialize Admin SDK (uses gcloud auth application-default login)
try {
    admin.initializeApp({
        projectId: 'jjthaispa-new'
    });
} catch (e) {
    console.error("Initialization error (continuing anyway in case it was already init):", e.message);
}

const db = admin.firestore();

async function updatePromotions() {
    const updates = [
        { id: 'holiday-promo', title: 'Holiday', dateLabel: 'December 2026' },
        { id: 'release-promo', title: "New Year's", dateLabel: 'January 2026' },
        { id: 'valentines-promo', title: "Valentine's", dateLabel: 'February 2026' }
    ];

    console.log('Updating promotions with title and dateLabel fields...\n');

    for (const update of updates) {
        try {
            const docRef = db.collection('promotions').doc(update.id);
            const doc = await docRef.get();

            if (doc.exists) {
                await docRef.update({
                    title: update.title,
                    dateLabel: update.dateLabel
                });
                console.log(`✓ Updated ${update.id}:`);
                console.log(`  title: "${update.title}"`);
                console.log(`  dateLabel: "${update.dateLabel}"\n`);
            } else {
                console.log(`✗ Document ${update.id} not found\n`);
            }
        } catch (error) {
            console.error(`✗ Error updating ${update.id}:`, error.message);
        }
    }

    console.log('Done!');
    process.exit(0);
}

updatePromotions();
