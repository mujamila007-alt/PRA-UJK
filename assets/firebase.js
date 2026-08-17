import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js';
import {
  getAuth, setPersistence, browserSessionPersistence, onAuthStateChanged,
  signInWithEmailAndPassword, signOut, getIdTokenResult
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, getDocs, query, orderBy, writeBatch, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
setPersistence(auth, browserSessionPersistence).catch(() => {});

export {
  onAuthStateChanged, signInWithEmailAndPassword, signOut, getIdTokenResult,
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, orderBy,
  writeBatch, serverTimestamp
};
