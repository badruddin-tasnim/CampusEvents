/**
 * DESIGN PATTERN 1: SINGLETON PATTERN (Creational Category)
 *
 * Problem Solved:
 * Prevents multiple redundant Firebase client initializations and connection leaks
 * across different modules of the application. Centralizes configuration and provides
 * a unified access point for Firebase Auth and Firestore.
 *
 * Rejected Alternative:
 * Global window-level variables or initializing Firebase independently in every service file.
 * Those lead to memory leaks, inconsistent authentication states, and test coupling.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

class FirebaseConfigManager {
  constructor() {
    if (FirebaseConfigManager._instance) {
      throw new Error('Use FirebaseConfigManager.getInstance() instead of new.');
    }

    // Default configuration (users can easily replace with their own firebaseConfig)
    this.config = {
      apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || 'demo-api-key-ruet',
      authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || 'campusevents-ruet.firebaseapp.com',
      projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || 'campusevents-ruet',
      storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || 'campusevents-ruet.appspot.com',
      messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
      appId: import.meta.env?.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456'
    };

    // Check if real Firebase keys are provided or if running in offline simulation mode
    this.isLiveConfig = Boolean(
      import.meta.env?.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key-ruet'
    );

    this.app = null;
    this.auth = null;
    this.db = null;
    this.googleProvider = null;

    this.initialize();
  }

  initialize() {
    try {
      if (this.isLiveConfig) {
        this.app = getApps().length === 0 ? initializeApp(this.config) : getApp();
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.googleProvider = new GoogleAuthProvider();
      }
    } catch (err) {
      console.warn('Firebase initialized in fallback/mock mode:', err.message);
      this.isLiveConfig = false;
    }
  }

  static getInstance() {
    if (!FirebaseConfigManager._instance) {
      FirebaseConfigManager._instance = new FirebaseConfigManager();
    }
    return FirebaseConfigManager._instance;
  }

  // Helper method for unit tests to reset singleton state
  static resetInstance() {
    FirebaseConfigManager._instance = null;
  }

  getAuth() {
    return this.auth;
  }

  getDb() {
    return this.db;
  }

  getGoogleProvider() {
    return this.googleProvider;
  }

  isLive() {
    return this.isLiveConfig;
  }
}

export default FirebaseConfigManager;
