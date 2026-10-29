import FirebaseConfigManager from '../patterns/FirebaseSingleton.js';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { eventBus } from '../patterns/EventBus.js';

const ADMIN_EMAIL = 'admin@ruet.ac.bd';
const ADMIN_PASSWORD = 'AdminPass123!';
const STORAGE_USER_KEY = 'campusevents_current_user_ruet';

export class AuthService {
  constructor() {
    this.firebase = FirebaseConfigManager.getInstance();
    this.currentUser = this.loadStoredUser();
  }

  loadStoredUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  saveUser(user) {
    this.currentUser = user;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    }
    eventBus.publish('AUTH_STATE_CHANGED', user);
  }

  /**
   * Attendee Login: Sign In with Google only
   */
  async loginWithGoogle() {
    if (this.firebase.isLive() && this.firebase.getAuth() && this.firebase.getGoogleProvider()) {
      try {
        const result = await signInWithPopup(this.firebase.getAuth(), this.firebase.getGoogleProvider());
        const userProfile = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || result.user.email.split('@')[0],
          photoURL: result.user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${result.user.uid}`,
          role: 'student'
        };
        this.saveUser(userProfile);
        return userProfile;
      } catch (err) {
        console.warn('Google popup failed or cancelled, using demo Google login:', err.message);
      }
    }

    // Mock Google sign-in fallback (for seamless local testing without Firebase domain setup)
    const mockGoogleUser = {
      uid: `google_usr_${Math.floor(1000 + Math.random() * 9000)}`,
      email: 'student.2203001@ruet.ac.bd',
      displayName: 'RUET CSE Student (22 Series)',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      role: 'student'
    };
    this.saveUser(mockGoogleUser);
    return mockGoogleUser;
  }

  /**
   * Fixed Admin Login: One fixed email and password
   * Email: admin@ruet.ac.bd
   * Password: AdminPass123!
   */
  async loginAsAdmin(email, password) {
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (trimmedEmail !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      throw new Error('Invalid Admin credentials. Use admin@ruet.ac.bd / AdminPass123!');
    }

    const adminUser = {
      uid: 'admin_fixed_ruet_01',
      email: ADMIN_EMAIL,
      displayName: 'RUET Campus Event Administrator',
      photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
      role: 'admin'
    };
    this.saveUser(adminUser);
    return adminUser;
  }

  /**
   * Logout
   */
  async logout() {
    if (this.firebase.isLive() && this.firebase.getAuth()) {
      try {
        await signOut(this.firebase.getAuth());
      } catch (err) {
        console.warn('Signout warning:', err.message);
      }
    }
    this.saveUser(null);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAdmin() {
    return this.currentUser?.role === 'admin';
  }
}

export const authService = new AuthService();
export { ADMIN_EMAIL, ADMIN_PASSWORD };
export default AuthService;
