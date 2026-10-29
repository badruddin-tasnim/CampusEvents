import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService, ADMIN_EMAIL, ADMIN_PASSWORD } from '../services/authService.js';

describe('AuthService & Role Management Suite', () => {
  let authService;

  beforeEach(() => {
    window.localStorage.clear();
    authService = new AuthService();
  });

  it('should authenticate the fixed admin credentials successfully', async () => {
    const admin = await authService.loginAsAdmin(ADMIN_EMAIL, ADMIN_PASSWORD);
    expect(admin).toBeDefined();
    expect(admin.role).toBe('admin');
    expect(admin.email).toBe(ADMIN_EMAIL);
    expect(authService.isAdmin()).toBe(true);
  });

  it('should reject invalid admin credentials', async () => {
    await expect(
      authService.loginAsAdmin('hacker@unknown.com', 'wrongpassword')
    ).rejects.toThrow(/invalid admin credentials/i);

    expect(authService.getCurrentUser()).toBeNull();
  });

  it('should authenticate student using Google sign-in flow', async () => {
    const user = await authService.loginWithGoogle();
    expect(user).toBeDefined();
    expect(user.role).toBe('student');
    expect(user.email).toContain('@ruet.ac.bd');
    expect(authService.isAdmin()).toBe(false);
  });

  it('should clear stored session on logout', async () => {
    await authService.loginAsAdmin(ADMIN_EMAIL, ADMIN_PASSWORD);
    expect(authService.getCurrentUser()).not.toBeNull();

    await authService.logout();
    expect(authService.getCurrentUser()).toBeNull();
    expect(authService.isAdmin()).toBe(false);
  });
});
