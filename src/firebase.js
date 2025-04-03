// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBOeFy8xQz4VBcVS66CPxHPaaKglt5_cPY",
  authDomain: "roopsunderi.firebaseapp.com",
  projectId: "roopsunderi",
  storageBucket: "roopsunderi.appspot.com",
  messagingSenderId: "159577295862",
  appId: "1:159577295862:web:56a5e2e04fe85af7e4d5d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
