
const admin = require('firebase-admin');

// Initialize Admin SDK
// Attempt to use default credentials (gcloud auth application-default login)
// If that fails, the user might need to point to a service account key.
// But we'll try basic init first.
try {
    admin.initializeApp({
        projectId: 'jjthaispa-new'
    });
} catch (e) {
    console.error("Initialization error (continuing anyway in case it was already init):", e.message);
}

const db = admin.firestore();

const VALENTINES_PROMO = {
    id: "valentines-promo",
    label: "VALENTINE'S SPECIAL",
    enabled: true,
    startDate: "2026-01-31T00:00:00Z", // Start today
    endDate: "2026-02-15T23:59:59Z",   // End just after Valentine's
    discounts: {
        "swedish": {
            "2": 10, // 60min
            "3": 10, // 75min
            "4": 15  // 90min
        },
        "combination": {
            "2": 10,
            "3": 10,
            "4": 15
        },
        "deep-tissue": {
            "2": 10,
            "3": 10,
            "4": 15
        },
        "prenatal": {
            "1": 10, // 60min
            "2": 15  // 90min
        },
        "couples": {
            "0": 10, // 60min Swedish
            "1": 10, // 60min Thai Comb
            "2": 10, // 60min Thai DT
            "3": 15, // 90min Swedish
            "4": 15, // 90min Thai Comb
            "5": 15  // 90min Thai DT
        }
    }
};

async function addPromo() {
    console.log("Adding Valentine's Promo using Admin SDK...");
    try {
        const { id, ...data } = VALENTINES_PROMO;
        await db.collection("promotions").doc(id).set(data);
        console.log(`Successfully added promo: ${id}`);
    } catch (e) {
        console.error(`Error adding promo:`, e);
        process.exit(1);
    }
    console.log("Done!");
    process.exit(0);
}

addPromo();
