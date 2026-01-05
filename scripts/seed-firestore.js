
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

const SERVICES = [
    {
        id: "swedish",
        prices: [
            { id: "0", duration: 30, durationServices: "30 Minutes", price: 55 },
            { id: "1", duration: 45, durationServices: "45 Minutes", price: 75 },
            { id: "2", duration: 60, durationServices: "60 Minutes", durationMain: "60 min", price: 90 },
            { id: "3", duration: 75, durationServices: "75 Minutes", price: 110 },
            { id: "4", duration: 90, durationServices: "90 Minutes", durationMain: "90 min", price: 125 }
        ]
    },
    {
        id: "combination",
        prices: [
            { id: "0", duration: 30, durationServices: "30 Minutes", price: 60 },
            { id: "1", duration: 45, durationServices: "45 Minutes", price: 80 },
            { id: "2", duration: 60, durationServices: "60 Minutes", durationMain: "60 min", price: 95 },
            { id: "3", duration: 75, durationServices: "75 Minutes", price: 115 },
            { id: "4", duration: 90, durationServices: "90 Minutes", durationMain: "90 min", price: 135 }
        ]
    },
    {
        id: "deep-tissue",
        prices: [
            { id: "0", duration: 30, durationServices: "30 Minutes", price: 65 },
            { id: "1", duration: 45, durationServices: "45 Minutes", price: 85 },
            { id: "2", duration: 60, durationServices: "60 Minutes", durationMain: "60 min", price: 100 },
            { id: "3", duration: 75, durationServices: "75 Minutes", price: 120 },
            { id: "4", duration: 90, durationServices: "90 Minutes", durationMain: "90 min", price: 140 }
        ]
    },
    {
        id: "release",
        prices: [
            { id: "0", duration: 30, durationServices: "30 Minutes", durationMain: "30 min", price: 55 },
            { id: "1", duration: 45, durationServices: "45 Minutes", durationMain: "45 min", price: 75 }
        ]
    },
    {
        id: "prenatal",
        prices: [
            { id: "0", duration: 30, durationServices: "30 Minutes", price: 55 },
            { id: "1", duration: 60, durationServices: "60 Minutes", durationMain: "60 min", price: 90 },
            { id: "2", duration: 90, durationServices: "90 Minutes", durationMain: "90 min", price: 125 }
        ]
    },
    {
        id: "couples",
        prices: [
            { id: "0", duration: 60, durationServices: "60 Minutes Swedish", durationMain: "60 min Swedish", price: 180 },
            { id: "1", duration: 60, durationServices: "60 Minutes Thai Combination", price: 190 },
            { id: "2", duration: 60, durationServices: "60 Minutes Thai Deep Tissue", durationMain: "60 min Deep Tissue", price: 200 },
            { id: "3", duration: 90, durationServices: "90 Minutes Swedish", price: 250 },
            { id: "4", duration: 90, durationServices: "90 Minutes Thai Combination", price: 270 },
            { id: "5", duration: 90, durationServices: "90 Minutes Thai Deep Tissue", price: 280 }
        ]
    }
];

const PROMOTIONS = [
    {
        id: "release-promo",
        label: "LIMITED TIME",
        enabled: true,
        startDate: "2026-01-05T00:00:00Z",
        endDate: "2026-01-30T23:59:59Z",
        discounts: {
            "release": {
                "0": 5, // Release 30min
                "1": 10 // Release 45min
            }
        }
    },
    {
        id: "holiday-promo",
        label: "PROMO",
        enabled: false,
        startDate: "2026-01-05T00:00:00Z",
        endDate: "2026-01-30T23:59:59Z",
        discounts: {
            "swedish": {
                "0": 0, // Swedish 30min
                "1": 0, // Swedish 45min
                "2": 10, // Swedish 60min
                "3": 10, // Swedish 75min
                "4": 15 // Swedish 90min
            },
            "combination": {
                "0": 0, // Combination 30min
                "1": 0, // Combination 45min
                "2": 10, // Combination 60min
                "3": 10, // Combination 75min
                "4": 15 // Combination 90min
            },
            "deep-tissue": {
                "0": 0, // Deep Tissue 30min
                "1": 0, // Deep Tissue 45min
                "2": 10, // Deep Tissue 60min
                "3": 10, // Deep Tissue 75min
                "4": 15 // Deep Tissue 90min
            },
            "prenatal": {
                "0": 0, // Prenatal 30min
                "1": 10, // Prenatal 60min
                "2": 15 // Prenatal 90min
            },
            "couples": {
                "0": 10, // Couples 60min Swedish
                "1": 10, // Couples 60min Thai Combination
                "2": 10, // Couples 60min Thai Deep Tissue
                "3": 15, // Couples 90min Swedish
                "4": 15, // Couples 90min Thai Combination
                "5": 15 // Couples 90min Thai Deep Tissue
            }
        }
    }
];

async function seed() {
    console.log("Seeding Firestore...");

    // Seed Services
    for (const service of SERVICES) {
        try {
            const { id, ...data } = service;
            await setDoc(doc(db, "services", id), data);
            console.log(`Updated Service: ${id}`);
        } catch (e) {
            console.error(`Error updating service ${service.id}:`, e);
        }
    }

    // Seed Promotions
    for (const promo of PROMOTIONS) {
        try {
            const { id, ...data } = promo;
            await setDoc(doc(db, "promotions", id), data);
            console.log(`Updated Promo: ${id}`);
        } catch (e) {
            console.error(`Error updating promo ${promo.id}:`, e);
        }
    }

    console.log("Done!");
    process.exit(0);
}

seed();
