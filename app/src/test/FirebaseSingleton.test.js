import { describe, it, expect } from 'vitest';
import FirebaseConfigManager from '../patterns/FirebaseSingleton.js';

describe('Design Pattern (Creational): FirebaseConfigManager Singleton TDD Suite', () => {
  it('should always return the identical instance across multiple calls to getInstance()', () => {
    const instanceA = FirebaseConfigManager.getInstance();
    const instanceB = FirebaseConfigManager.getInstance();

    expect(instanceA).toBe(instanceB);
    expect(instanceA).toBeInstanceOf(FirebaseConfigManager);
  });

  it('should throw an error if attempted to instantiate directly with `new`', () => {
    // Ensuring instance exists
    FirebaseConfigManager.getInstance();

    expect(() => {
      new FirebaseConfigManager();
    }).toThrow(/Use FirebaseConfigManager\.getInstance\(\)/i);
  });
});
