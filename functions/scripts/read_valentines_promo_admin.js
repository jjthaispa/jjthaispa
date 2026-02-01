
const admin = require('firebase-admin');

try {
    admin.initializeApp({
        projectId: 'jjthaispa-new'
    });
} catch (e) {
    console.error("Init error:", e.message);
}

const db = admin.firestore();

async function readPromo() {
    console.log("Reading Valentine's Promo...");
    try {
        const doc = await db.collection("promotions").doc("valentines-promo").get();
        if (!doc.exists) {
            console.log("Document does NOT exist!");
        } else {
            console.log("Document data:", JSON.stringify(doc.data(), null, 2));
        }
    } catch (e) {
        console.error("Error reading promo:", e);
    }
    process.exit(0);
}

readPromo();
