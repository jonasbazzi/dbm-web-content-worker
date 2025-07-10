import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { validateToken } from '../src/tokenValidation.js';

describe('validateToken', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_KEY: 'test-apikey' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('does not throw when token is valid', () => {
    const headers = {
      Authorization: 'test-apikey',
    };
    expect(() => validateToken(headers)).not.toThrow();
  });

  it('throws 401 when Authorization header is missing', () => {
    const headers = {};
    expect(() => validateToken(headers)).toThrow(expect.objectContaining({
      statusCode: 401,
    }));
  });

  it('throws 401 when token is invalid', () => {
    const headers = {
      Authorization: 'wrong-token',
    };
    expect(() => validateToken(headers)).toThrow(expect.objectContaining({
      statusCode: 401,
    }));
  });
});
