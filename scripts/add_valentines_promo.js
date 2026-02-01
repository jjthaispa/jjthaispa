
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
            "0": 15, // 60min Swedish
            "1": 15, // 60min Thai Comb
            "2": 15, // 60min Thai DT
            "3": 20, // 90min Swedish
            "4": 20, // 90min Thai Comb
            "5": 20  // 90min Thai DT
        }
    }
};

async function addPromo() {
    console.log("Adding Valentine's Promo...");
    try {
        const { id, ...data } = VALENTINES_PROMO;
        await setDoc(doc(db, "promotions", id), data);
        console.log(`Successfully added promo: ${id}`);
    } catch (e) {
        console.error(`Error adding promo:`, e);
        process.exit(1);
    }
    console.log("Done!");
    process.exit(0);
}

addPromo();
