import { fetchProducts } from '../src/productService.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fetch, { Response } from 'node-fetch';

vi.mock('node-fetch', () => ({
  default: vi.fn(),
  Response: vi.fn((body, init) => ({
    ok: init.status >= 200 && init.status < 300,
    status: init.status,
    json: () => Promise.resolve(JSON.parse(body)),
    text: () => Promise.resolve(body),
  })),
}));

describe('fetchProducts', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return products if auth and product fetch are successful', async () => {
    const mockToken = 'test-token';
    const mockProducts = { data: [{ id: 1, name: 'Test Motorcycle' }] };

    fetch.mockImplementation((url, options) => {
      if (url.endsWith('/users/login')) {
        return Promise.resolve(new Response(JSON.stringify({ data: { token: mockToken } }), { status: 200 }));
      }
      if (url.endsWith('/motorcycle/stock/website') && options.headers.Token === mockToken) {
        return Promise.resolve(new Response(JSON.stringify(mockProducts), { status: 200 }));
      }
      return Promise.resolve(new Response('Not Found', { status: 404 }));
    });

    const products = await fetchProducts();
    expect(products).toEqual(mockProducts.data);
  });

  it('should return an empty array if auth fails', async () => {
    fetch.mockImplementation((url) => {
      if (url.endsWith('/users/login')) {
        return Promise.resolve(new Response('Unauthorized', { status: 401 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 }));
    });

    const products = await fetchProducts();
    expect(products).toEqual([]);
  });

  it('should return an empty array if product fetch fails', async () => {
    const mockToken = 'test-token';
    fetch.mockImplementation((url, options) => {
      if (url.endsWith('/users/login')) {
        return Promise.resolve(new Response(JSON.stringify({ data: { token: mockToken } }), { status: 200 }));
      }
      if (url.endsWith('/motorcycle/stock/website')) {
        return Promise.resolve(new Response('Internal Server Error', { status: 500 }));
      }
      return Promise.resolve(new Response('Not Found', { status: 404 }));
    });

    const products = await fetchProducts();
    expect(products).toEqual([]);
  });

  it('should return an empty array if there is a network error during auth', async () => {
    fetch.mockRejectedValue(new Error('Network Error'));
    const products = await fetchProducts();
    expect(products).toEqual([]);
  });
});
