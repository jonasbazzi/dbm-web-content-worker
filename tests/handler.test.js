import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler } from '../src/handler.js';
import * as productService from '../src/productService.js';
import * as tokenValidation from '../src/tokenValidation.js';

vi.mock('../src/tokenValidation.js', () => ({
  validateToken: vi.fn(),
}));

vi.mock('../src/productService.js', () => ({
  fetchProducts: vi.fn(),
}));

describe('Lambda Handler', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 200 and products list when token is valid', async () => {
    tokenValidation.validateToken.mockImplementation(() => { });
    productService.fetchProducts.mockResolvedValue([{ id: 'item1' }, { id: 'item2' }]);

    const event = {
      headers: { Authorization: 'test-apikey' },
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).products).toHaveLength(2);
  });

  it('returns 401 when token is invalid', async () => {
    tokenValidation.validateToken.mockImplementation(() => {
      throw { statusCode: 401 };
    });

    const event = { headers: {} };
    const result = await handler(event);

    expect(result.statusCode).toBe(401);
  });

  it('returns 500 on unexpected error', async () => {
    tokenValidation.validateToken.mockImplementation(() => { });
    productService.fetchProducts.mockImplementation(() => {
      throw new Error('Something broke');
    });

    const event = { headers: { Authorization: 'test-apikey' } };
    const result = await handler(event);

    expect(result.statusCode).toBe(500);
  });
});
