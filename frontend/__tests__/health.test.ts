import { describe, it, expect } from 'vitest';
import { isHealthy } from '../utils/health';

describe('health util', () => {
  it('returns true', () => {
    expect(isHealthy()).toBe(true);
  });
});
