import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from '../src/reviewsHandler.js';
import * as reviewsService from '../src/reviewsService.js';
import * as tokenValidation from '../src/tokenValidation.js';

vi.mock('../src/tokenValidation.js', () => ({
  validateToken: vi.fn(),
}));

vi.mock('../src/reviewsService.js', () => ({
  fetchReviews: vi.fn(),
}));

describe('Reviews Lambda Handler', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 200 and reviews list when token is valid', async () => {
    tokenValidation.validateToken.mockImplementation(() => { });
    reviewsService.fetchReviews.mockResolvedValue([{ id: 'item1' }, { id: 'item2' }]);

    const event = {
      method: 'GET', headers: { Authorization: 'test-apikey', Origin: 'https://dbmmotos.com.ar' },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).reviews).toHaveLength(2);
  });

  it('returns 401 when token is invalid', async () => {
    tokenValidation.validateToken.mockImplementation(() => {
      throw { statusCode: 401 };
    });

    const event = { method: 'GET', headers: { Origin: 'https://dbmmotos.com.ar' } };
    const result = await handler(event);

    expect(result.statusCode).toBe(401);
  });

  it('returns 500 on unexpected error', async () => {
    tokenValidation.validateToken.mockImplementation(() => { });
    reviewsService.fetchReviews.mockImplementation(() => {
      throw new Error('Something broke');
    });

    const event = { method: 'GET', headers: { Authorization: 'test-apikey', Origin: 'https://dbmmotos.com.ar' } };
    const result = await handler(event);

    expect(result.statusCode).toBe(500);
  });

  it('returns 403 when Origin header is missing or invalid', async () => {
    tokenValidation.validateToken.mockImplementation(() => { });
    const eventMissingOrigin = { method: 'GET', headers: { Authorization: 'test-apikey' } };
    const resultMissingOrigin = await handler(eventMissingOrigin);
    expect(resultMissingOrigin.statusCode).toBe(403);

    const eventInvalidOrigin = { method: 'GET', headers: { Authorization: 'test-apikey', Origin: 'test' } };
    const resultInvalidOrigin = await handler(eventInvalidOrigin);
    expect(resultInvalidOrigin.statusCode).toBe(403);
  });
});
