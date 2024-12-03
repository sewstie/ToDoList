import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6GhGi3Mx64S-MU3xksAbaAY9FdS5NW2g",
  authDomain: "to-do-list-62c03.firebaseapp.com",
  projectId: "to-do-list-62c03",
  storageBucket: "to-do-list-62c03.firebasestorage.app",
  messagingSenderId: "63800374107",
  appId: "1:63800374107:web:45c68014a2e5587fa7e07e",
  measurementId: "G-QN68NZQ3V3",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
