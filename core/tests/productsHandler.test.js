import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from '../src/productsHandler.js';
import * as productService from '../src/productService.js';
import * as apiAuthValidation from '../src/apiAuthValidation.js';

vi.mock('../src/apiAuthValidation.js', () => ({
  validateAuth: vi.fn(),
}));

vi.mock('../src/productService.js', () => ({
  fetchProducts: vi.fn(),
}));

describe('Lambda Handler', () => {
  const env = {
    API_KEY: 'test-apikey',
    API_KEY_ENABLED: 'true',
    CORS_ALLOWED_ORIGINS: 'http://127.0.0.1:2704',
    CORS_ENABLED: 'true',
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 200 and products list when token is valid', async () => {
    apiAuthValidation.validateAuth.mockImplementation(() => { });
    productService.fetchProducts.mockResolvedValue([{ id: 'item1' }, { id: 'item2' }]);

    const event = {
      method: 'GET', headers: { Authorization: 'test-apikey', Origin: 'http://127.0.0.1:2704' },
    };

    const result = await handler(event, env);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).products).toHaveLength(2);
    expect(apiAuthValidation.validateAuth).toHaveBeenCalledWith(event.headers, env);
    expect(productService.fetchProducts).toHaveBeenCalledWith(env);
  });

  it('returns 401 when token is invalid', async () => {
    apiAuthValidation.validateAuth.mockImplementation(() => {
      throw { statusCode: 401 };
    });

    const event = { method: 'GET', headers: { Origin: 'http://127.0.0.1:2704' } };
    const result = await handler(event, env);

    expect(result.statusCode).toBe(401);
  });

  it('returns 500 on unexpected error', async () => {
    apiAuthValidation.validateAuth.mockImplementation(() => { });
    productService.fetchProducts.mockImplementation(() => {
      throw new Error('Something broke');
    });

    const event = { method: 'GET', headers: { Authorization: 'test-apikey', Origin: 'http://127.0.0.1:2704' } };
    const result = await handler(event, env);

    expect(result.statusCode).toBe(500);
  });

  it('returns 403 when Origin header is missing or invalid', async () => {
    apiAuthValidation.validateAuth.mockImplementation(() => { });
    const eventMissingOrigin = { method: 'GET', headers: { Authorization: 'test-apikey' } };

    const resultMissingOrigin = await handler(eventMissingOrigin, env);
    expect(resultMissingOrigin.statusCode).toBe(403);

    const eventInvalidOrigin = { method: 'GET', headers: { Authorization: 'test-apikey', Origin: 'test' } };
    const resultInvalidOrigin = await handler(eventInvalidOrigin, env);
    expect(resultInvalidOrigin.statusCode).toBe(403);
  });
});
