import { describe, it, expect } from 'vitest';
import { validateAuth } from '../src/apiAuthValidation.js';

describe('validateAuth', () => {
  const env = {
    API_KEY: 'test-apikey',
    API_KEY_ENABLED: 'true',
  };

  it('does not throw when token is valid', () => {
    const headers = {
      Authorization: 'test-apikey',
    };
    expect(() => validateAuth(headers, env)).not.toThrow();
  });

  it('throws 401 when Authorization header is missing', () => {
    const headers = {};
    expect(() => validateAuth(headers, env)).toThrow(expect.objectContaining({
      statusCode: 401,
    }));
  });

  it('throws 401 when token is invalid', () => {
    const headers = {
      Authorization: 'wrong-token',
    };
    expect(() => validateAuth(headers, env)).toThrow(expect.objectContaining({
      statusCode: 401,
    }));
  });
});
